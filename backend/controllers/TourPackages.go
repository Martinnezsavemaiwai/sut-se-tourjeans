package controllers

import (
	"net/http"
	"toursystem/config"
	"toursystem/entity"

	"encoding/base64"
	"fmt"
	"github.com/gin-gonic/gin"
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"
	"time"
)

func saveBase64Image(base64String, savePath string) error {
	if !strings.HasPrefix(base64String, "data:image/") {
		return fmt.Errorf("invalid base64 format, missing data:image/ prefix")
	}

	dataIndex := strings.Index(base64String, ",") + 1
	imageData, err := base64.StdEncoding.DecodeString(base64String[dataIndex:])
	if err != nil {
		return fmt.Errorf("failed to decode base64: %v", err)
	}

	if err := os.MkdirAll(filepath.Dir(savePath), os.ModePerm); err != nil {
		return fmt.Errorf("failed to create directory: %v", err)
	}

	if err := ioutil.WriteFile(savePath, imageData, 0644); err != nil {
		return fmt.Errorf("failed to save file: %v", err)
	}

	return nil
}

// GET /tour-packages
func ListTourPackages(c *gin.Context) {
	var tourPackages []entity.TourPackages

	db := config.DB()

	if err := db.Preload("Province").Preload("TourPrices").Preload("TourImages").Preload("TourDescriptions").Preload("TourSchedules").Find(&tourPackages).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, &tourPackages)
}

// GET /tour-package/:id
func GetTourPackageByID(c *gin.Context) {
	var tourpackage entity.TourPackages
	id := c.Param("id")

	db := config.DB()

	if err := db.Preload("Province").Preload("TourPrices.PersonType").Preload("TourImages").Preload("TourDescriptions").Preload("TourSchedules.TourScheduleStatus").Preload("TourSchedules.ScheduleActivities.Activity.Location").First(&tourpackage, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "tour package not found"})
		return
	}

	c.JSON(http.StatusOK, tourpackage)
}

// POST /create-tour-package
func CreateTourPackage(c *gin.Context) {
	var requestData struct {
		PackageCode string `json:"package_code" binding:"required"`
		TourName    string `json:"tour_name" binding:"required"`
		Duration    string `json:"duration" binding:"required,min=1"`
		ProvinceID  uint   `json:"province_id"`

		Intro           string `json:"intro"`
		PackageDetail   string `json:"package_detail"`
		TripHighlight   string `json:"trip_highlight"`
		PlacesHighlight string `json:"places_highlight"`

		TourImages []struct {
			FilePath string `json:"file_path"`
		} `json:"tourImages"`

		TourSchedules []struct {
			StartDate      time.Time `json:"start_date" binding:"required"`
			EndDate        time.Time `json:"end_date" binding:"required"`
			AvailableSlots int       `json:"available_slots" binding:"required,min=1"`
		} `json:"tourSchedules"`

		Activities []struct {
			Day          string    `json:"day" binding:"required"`
			Time         time.Time `json:"time" binding:"required"`
			ActivityName string    `json:"activity_name" binding:"required"`
			Description  string    `json:"description"`
			LocationID   uint      `json:"location_id"`
		} `json:"activities"`

		TourPrices []struct {
			Price float32 `json:"price" binding:"required"`
		} `json:"tourPrices"`
	}

	db := config.DB()

	if err := c.ShouldBindJSON(&requestData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input", "details": err.Error()})
		return
	}

	// ตรวจสอบ PackageCode
	var existingPackage entity.TourPackages
	if err := db.Where("package_code = ?", requestData.PackageCode).First(&existingPackage).Error; err == nil {
		// ถ้าพบว่ามีรหัสแพ็กเกจทัวร์ซ้ำ
		c.JSON(http.StatusConflict, gin.H{"error": "Package code already exists"})
		return
	}

	// สร้าง Tour Package
	tourPackage := entity.TourPackages{
		PackageCode: requestData.PackageCode,
		TourName:    requestData.TourName,
		Duration:    requestData.Duration,
		ProvinceID:  requestData.ProvinceID,
	}

	if err := db.Create(&tourPackage).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create tour package", "details": err.Error()})
		return
	}
	// ดึง TourPackageID ที่เพิ่งสร้าง
	tourPackageID := tourPackage.ID

	description := entity.TourDescriptions{
		TourPackageID:   tourPackageID,
		Intro:           requestData.Intro,
		PackageDetail:   requestData.PackageDetail,
		TripHighlight:   requestData.TripHighlight,
		PlacesHighlight: requestData.PlacesHighlight,
	}

	if err := db.Create(&description).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create description", "details": err.Error()})
		return
	}

	for i, img := range requestData.TourImages {
		if img.FilePath == "" {
			c.JSON(http.StatusBadRequest, gin.H{
				"error":   "File path is empty",
				"details": "Each image must have a valid file path",
			})
			return
		}

		// สร้างชื่อไฟล์
		fileName := fmt.Sprintf("tour%02d.jpg", i+1)
		savePath := fmt.Sprintf("images/tourImages/tourPackage%d/%s", tourPackageID, fileName)

		// แปลง Base64 และบันทึกไฟล์
		if err := saveBase64Image(img.FilePath, savePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Failed to save image",
				"details": err.Error(),
			})
			return
		}

		// บันทึกข้อมูลลงในฐานข้อมูล
		tourImage := entity.TourImages{
			TourPackageID: tourPackageID,
			FilePath:      savePath,
		}
		if err := db.Create(&tourImage).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Failed to save image path to database",
				"details": err.Error(),
			})
			return
		}
	}
	// สร้างตัวแปรสำหรับเก็บ IDs ของ TourSchedules
	scheduleIDs := []uint{}

	// เพิ่มรอบทัวร์
	for _, round := range requestData.TourSchedules {
		schedule := entity.TourSchedules{
			TourPackageID:        tourPackageID,
			StartDate:            round.StartDate.UTC().Truncate(24 * time.Hour).Add(24 * time.Hour),
			EndDate:              round.EndDate.UTC().Truncate(24 * time.Hour).Add(24 * time.Hour),
			AvailableSlots:       round.AvailableSlots,
			TourScheduleStatusID: 2, // สมมติว่าใช้ ID 2 สำหรับสถานะ "ยังไม่เต็ม"
		}

		if err := db.Create(&schedule).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create schedule", "details": err.Error()})
			return
		}
		scheduleIDs = append(scheduleIDs, schedule.ID)
	}

	// เพิ่มกิจกรรม
	for _, activity := range requestData.Activities {
		act := entity.Activities{
			ActivityName: activity.ActivityName,
			Description:  activity.Description,
			LocationID:   activity.LocationID,
		}
		if err := db.Create(&act).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create activity", "details": err.Error()})
			return
		}
	}

	for _, scheduleID := range scheduleIDs { // วนลูปผ่านรอบทัวร์ที่สร้างไว้
		for _, activity := range requestData.Activities { // วนลูปผ่านกิจกรรมที่ได้รับจาก UI

			// ตรวจสอบว่า ActivityID หรือ ActivityName มีอยู่ในข้อมูลที่ได้รับจาก UI
			var activityFromDB entity.Activities
			if err := db.Where("activity_name = ?", activity.ActivityName).First(&activityFromDB).Error; err != nil {
				c.JSON(http.StatusNotFound, gin.H{
					"error":   "Activity not found",
					"details": "The specified Activity does not exist",
				})
				return
			}
			activityTimeStr := activity.Time.Local().Format("15:04:05")
			activityTime, _ := time.Parse("15:04:05", activityTimeStr)

			// สร้างข้อมูลในตาราง ScheduleActivities
			scheduleActivity := entity.ScheduleActivities{
				TourScheduleID: scheduleID,
				ActivityID:     activityFromDB.ID,
				Time:           activityTime,
				Day:            activity.Day,
			}

			if err := db.Create(&scheduleActivity).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{
					"error":   "Failed to link activity to schedule",
					"details": err.Error(),
				})
				return
			}
		}
	}

	// ดึงข้อมูล RoomTypes
	var roomTypes []entity.RoomTypes
	if err := db.Find(&roomTypes).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to fetch room types",
			"details": err.Error(),
		})
		return
	}

	expectedRoomTypesCount := len(roomTypes)
	receivedTourPricesCount := len(requestData.TourPrices)

	// ตรวจสอบว่าจำนวน TourPrices ที่รับมาจากฟอร์มตรงกับจำนวน RoomTypes หรือไม่
	if receivedTourPricesCount != expectedRoomTypesCount {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Mismatch between the number of RoomTypes and TourPrices data",
			"details": gin.H{
				"expected": expectedRoomTypesCount,
				"received": receivedTourPricesCount,
			},
		})
		return
	}

	// ตรวจสอบข้อมูลที่ได้รับ และสร้าง TourPrices สำหรับแต่ละ RoomType
	for i, roomType := range roomTypes {
		// สมมุติว่าเรากำหนด PersonTypeID โดยการเช็ค RoomTypes
		var personTypeID uint
		if roomType.TypeName == "เพิ่มเตียงเสริม" || roomType.TypeName == "ไม่เพิ่มเตียงเสริม" {
			personTypeID = 1
		} else {
			personTypeID = 2
		}

		// สร้างข้อมูล TourPrices สำหรับแต่ละ RoomType
		tourPrice := entity.TourPrices{
			TourPackageID: tourPackage.ID,
			RoomTypeID:    roomType.ID,
			PersonTypeID:  personTypeID,
			Price:         requestData.TourPrices[i].Price,
		}

		if err := db.Create(&tourPrice).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Failed to create tour price",
				"details": err.Error(),
			})
			return
		}
	}
	c.JSON(http.StatusCreated, gin.H{
		"message":       "สร้างแพ็กเกจทัวร์สำเร็จ",
		"tourPackageID": tourPackageID,
	})	
}

// PUT /update-tour-package/:id
func UpdateTourPackage(c *gin.Context) {
	var requestData struct {
		PackageCode     string `json:"package_code" binding:"required"`
		TourName        string `json:"tour_name" binding:"required"`
		Duration        string `json:"duration" binding:"required,min=1"`
		ProvinceID      uint   `json:"province_id"`
		Intro           string `json:"intro"`
		PackageDetail   string `json:"package_detail"`
		TripHighlight   string `json:"trip_highlight"`
		PlacesHighlight string `json:"places_highlight"`

		TourImages []struct {
			FilePath string `json:"file_path"`
		} `json:"tourImages"`

		TourSchedules []struct {
			StartDate      time.Time `json:"start_date" binding:"required"`
			EndDate        time.Time `json:"end_date" binding:"required"`
			AvailableSlots int       `json:"available_slots" binding:"required,min=1"`
		} `json:"tourSchedules"`

		Activities []struct {
			ID           int       `json:"id"`
			Time         time.Time `json:"time" binding:"required"`
			Day          string    `json:"day" binding:"required"`
			ActivityName string    `json:"activity_name" binding:"required"`
			Description  string    `json:"description"`
			LocationID   uint      `json:"location_id"`
		} `json:"activities"`

		TourPrices []struct {
			Price float32 `json:"price" binding:"required"`
		} `json:"tourPrices"`
	}

	// เช็คข้อมูลที่ได้รับมา
	if err := c.ShouldBindJSON(&requestData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Invalid JSON payload: %v", err)})
		return
	}

	id := c.Param("id")

	// เช็คว่า TourPackage ที่มี ID นี้มีอยู่หรือไม่
	db := config.DB()
	var tourPackage entity.TourPackages
	if err := db.First(&tourPackage, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Tour package not found"})
		return
	}

	// อัปเดตข้อมูลพื้นฐาน
	if err := db.Model(&tourPackage).Updates(map[string]interface{}{
		"tour_name":   requestData.TourName,
		"duration":    requestData.Duration,
		"province_id": requestData.ProvinceID,
	}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update tour package", "details": err.Error()})
		return
	}

	// ค้นหา TourDescriptions ที่เกี่ยวข้องกับ TourPackageID
	var description entity.TourDescriptions
	if err := db.First(&description, "tour_package_id = ?", tourPackage.ID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "TourDescriptions not found for the given TourPackageID"})
		return
	}

	description.Intro = requestData.Intro
	description.PackageDetail = requestData.PackageDetail
	description.TripHighlight = requestData.TripHighlight
	description.PlacesHighlight = requestData.PlacesHighlight

	if err := db.Save(&description).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update description", "details": err.Error()})
		return
	}

	var existingImages []entity.TourImages
	// ดึงข้อมูลรูปภาพปัจจุบัน
	if err := db.Where("tour_package_id = ?", tourPackage.ID).Find(&existingImages).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Images not found for the specified tour package"})
		return
	}

	// เริ่ม Transaction
	tx := db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	baseDir := fmt.Sprintf("images/tourImages/tourPackage%d", tourPackage.ID)

	// อัปเดตหรือเพิ่มรูปภาพ
	for i, img := range requestData.TourImages {
		// ตั้งชื่อไฟล์
		fileName := fmt.Sprintf("tour%02d.jpg", i+1)
		savePath := fmt.Sprintf("%s/%s", baseDir, fileName)

		// สร้างโฟลเดอร์ถ้ายังไม่มี
		if err := os.MkdirAll(filepath.Dir(savePath), os.ModePerm); err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create directory", "details": err.Error()})
			return
		}

		if i < len(existingImages) {
			// อัปเดตรูปภาพที่มีอยู่แล้ว
			existingImages[i].FilePath = savePath
			if err := tx.Save(&existingImages[i]).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update image", "details": err.Error()})
				return
			}
		} else {
			fileName := fmt.Sprintf("tour%02d.jpg", i+1)
			savePath := fmt.Sprintf("images/tourImages/tourPackage%d/%s", tourPackage.ID, fileName)

			// แปลง Base64 และบันทึกไฟล์
			if err := saveBase64Image(img.FilePath, savePath); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{
					"error":   "Failed to save image",
					"details": err.Error(),
				})
				return
			}
			// เพิ่มรูปภาพใหม่
			newImage := entity.TourImages{
				TourPackageID: tourPackage.ID,
				FilePath:      savePath,
			}
			if err := tx.Create(&newImage).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create new image", "details": err.Error()})
				return
			}
		}
	}
	// Map ที่เก็บ ID ของ TourImages ที่ส่งมาใน request
	requestImageIDs := make(map[string]bool)
	for _, img := range requestData.TourImages {
		requestImageIDs[img.FilePath] = true
	}

	// ลบภาพที่ไม่ได้ส่งมาใน request
	for _, existingImage := range existingImages {
		if _, exists := requestImageIDs[existingImage.FilePath]; !exists {
			// ลบไฟล์จริง
			if err := os.Remove(existingImage.FilePath); err != nil && !os.IsNotExist(err) {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete file", "details": err.Error()})
				return
			}
			if err := tx.Delete(&existingImage).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete extra images", "details": err.Error()})
				return
			}
		}
	}
	if err := tx.Commit().Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to commit transaction", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Tour images updated successfully"})

	// ดึงรอบทัวร์ที่มีอยู่ในฐานข้อมูลสำหรับ TourPackageID ที่ได้รับ
	var existingSchedules []entity.TourSchedules
	if err := db.Where("tour_package_id = ?", tourPackage.ID).Find(&existingSchedules).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "No schedules found for the specified tour package"})
		return
	}
	// ดึงเฉพาะ ID จาก existingSchedules
	var scheduleIDsOld []uint
	for _, schedule := range existingSchedules {
		scheduleIDsOld = append(scheduleIDsOld, schedule.ID)
	}

	for i, schedule := range requestData.TourSchedules {
		if i < len(existingSchedules) {
			existingSchedule := &existingSchedules[i]

			loc, _ := time.LoadLocation("Asia/Bangkok")
			existingSchedule.StartDate = time.Date(
				schedule.StartDate.In(loc).Year(),
				schedule.StartDate.In(loc).Month(),
				schedule.StartDate.In(loc).Day(),
				0, 0, 0, 0,
				time.UTC,
			)

			existingSchedule.EndDate = time.Date(
				schedule.EndDate.In(loc).Year(),
				schedule.EndDate.In(loc).Month(),
				schedule.EndDate.In(loc).Day(),
				0, 0, 0, 0,
				time.UTC,
			)
			existingSchedule.AvailableSlots = schedule.AvailableSlots

			// ตรวจสอบและอัปเดต TourScheduleStatusID ตาม AvailableSlots
			if existingSchedule.AvailableSlots > 0 {
				existingSchedule.TourScheduleStatusID = 2 // สถานะ "ยังไม่เต็ม"
			} else {
				existingSchedule.TourScheduleStatusID = 1 // สถานะ "เต็ม"
			}
			if err := db.Save(existingSchedule).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update schedule", "details": err.Error()})
				return
			}
		} else {
			// เพิ่มรอบทัวร์ใหม่
			for _, schedule := range requestData.TourSchedules[len(existingSchedules):] {
				newSchedule := entity.TourSchedules{
					TourPackageID: tourPackage.ID,

					StartDate: time.Date(
						schedule.StartDate.In(time.Local).Year(),
						schedule.StartDate.In(time.Local).Month(),
						schedule.StartDate.In(time.Local).Day(),
						0, 0, 0, 0,
						time.UTC,
					),
					EndDate: time.Date(
						schedule.EndDate.In(time.Local).Year(),
						schedule.EndDate.In(time.Local).Month(),
						schedule.EndDate.In(time.Local).Day(),
						0, 0, 0, 0,
						time.UTC,
					),
					AvailableSlots: schedule.AvailableSlots,
				}
				if newSchedule.AvailableSlots > 0 {
					newSchedule.TourScheduleStatusID = 2 // สถานะ "ยังไม่เต็ม"
				} else {
					newSchedule.TourScheduleStatusID = 1 // สถานะ "เต็ม"
				}

				if err := db.Create(&newSchedule).Error; err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create new schedule", "details": err.Error()})
					return
				}

				// คัดลอกกิจกรรมจากรอบทัวร์เก่าไปยังรอบใหม่
				var oldScheduleActivities []entity.ScheduleActivities
				if err := db.Where("tour_schedule_id = ?", scheduleIDsOld[len(scheduleIDsOld)-1]).
					Find(&oldScheduleActivities).Error; err == nil {
					for _, oldActivity := range oldScheduleActivities {

						activityTimeStr := oldActivity.Time.Format("15:04:05")
						oldActivityTime, _ := time.Parse("15:04:05", activityTimeStr)

						// สร้างเวลาใหม่ที่มีวันที่เป็น "0000-01-01" และเวลาจาก oldActivityTime โดยใช้ UTC
						oldActivityTimeUTC := time.Date(0, time.January, 1, oldActivityTime.Hour(), oldActivityTime.Minute(), oldActivityTime.Second(), oldActivityTime.Nanosecond(), time.UTC)

						fmt.Println("New Activity Time (UTC, 0000-01-01):", oldActivityTimeUTC)

						newScheduleActivity := entity.ScheduleActivities{
							TourScheduleID: newSchedule.ID,
							ActivityID:     oldActivity.ActivityID,
							Day:            oldActivity.Day,
							Time:           oldActivityTimeUTC,
						}
						if err := db.Create(&newScheduleActivity).Error; err != nil {
							fmt.Printf("Error creating new ScheduleActivity for schedule %d: %v\n", newSchedule.ID, err)
							continue
						}
					}
				} else {
					fmt.Printf("Error retrieving old ScheduleActivities: %v\n", err)
				}
			}

		}
	}

	// ดึงข้อมูล TourSchedules ที่เชื่อมโยงกับ TourPackageID
	var tourSchedules []entity.TourSchedules
	if err := db.Where("tour_package_id = ?", id).Find(&tourSchedules).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "No tour schedules found for the specified package"})
		return
	}

	var scheduleActivitiesIDs []uint
	tourSchedulesIDs := make([]uint, len(tourSchedules))

	// สร้าง tourSchedulesIDs
	for i, ts := range tourSchedules {
		tourSchedulesIDs[i] = ts.ID
	}

	fmt.Println("tourSchedulesIDs old:", scheduleIDsOld)
	fmt.Println("tourSchedulesIDs new:", tourSchedulesIDs)

	// สร้าง Map จาก scheduleIDsOld
	scheduleIDsOldMap := make(map[uint]bool)
	for _, id := range scheduleIDsOld {
		scheduleIDsOldMap[id] = true
	}

	// ดึง ID ที่ไม่อยู่ใน scheduleIDsOld
	var newScheduleIDs []uint
	for _, id := range tourSchedulesIDs {
		if !scheduleIDsOldMap[id] {
			newScheduleIDs = append(newScheduleIDs, id)
		}
	}
	fmt.Println("New IDs not in scheduleIDsOld:", newScheduleIDs) /*รอบที่เพิ่มมา*/

	if err := db.Model(&entity.ScheduleActivities{}).
		Where("tour_schedule_id IN ?", tourSchedulesIDs).
		Pluck("id", &scheduleActivitiesIDs).Error; err != nil {
		fmt.Println("Error retrieving schedule activities IDs:", err)
	} else {
		fmt.Println("Retrieved scheduleActivitiesIDs:", scheduleActivitiesIDs)
	}

	// ดึงข้อมูลเฉพาะ activity_id ที่เชื่อมโยงกับ scheduleActivitiesIDs และนับจำนวน
	var activityIDs []uint
	fmt.Println("activityIDs_OK", activityIDs)

	if len(scheduleActivitiesIDs) > 0 {
		if err := db.Model(&entity.ScheduleActivities{}).
			Where("id IN ?", scheduleActivitiesIDs).
			Pluck("activity_id", &activityIDs).Error; err != nil {
			fmt.Println("Error retrieving activity IDs:", err)
		} else {
			// สร้างแผนที่สำหรับนับจำนวน activity_id ที่ไม่ซ้ำ
			activityCountMap := make(map[uint]bool)
			for _, activityID := range activityIDs {
				activityCountMap[activityID] = true
			}

			var uniqueActivityIDs []uint
			for id := range activityCountMap {
				uniqueActivityIDs = append(uniqueActivityIDs, id)
			}

			fmt.Print("ActivityID: ")
			for i, id := range uniqueActivityIDs {
				if i > 0 {
					fmt.Print(",")
				}
				fmt.Print(id)
			}

			// นับจำนวน activityID ที่ไม่ซ้ำ
			fmt.Printf("Count: %d\n", len(uniqueActivityIDs))

			// ตรวจสอบว่า Activities ที่ได้รับมาจาก UI มีจำนวนน้อยกว่า uniqueActivityIDs
			if len(requestData.Activities) < len(uniqueActivityIDs) {

				diff := len(uniqueActivityIDs) - len(requestData.Activities)

				uniqueActivityIDs = uniqueActivityIDs[:len(uniqueActivityIDs)-diff]
				fmt.Printf("Updated uniqueActivityIDs after trimming: %v\n", uniqueActivityIDs)
			}

			// ลบ ScheduleActivityID ที่อยู่ใน tourSchedulesIDs แต่ไม่มีอยู่ใน uniqueActivityIDs
			if len(uniqueActivityIDs) > 0 {
				if err := db.Where("tour_schedule_id IN ?", tourSchedulesIDs).
					Where("activity_id NOT IN ?", uniqueActivityIDs).
					Delete(&entity.ScheduleActivities{}).Error; err != nil {
					fmt.Printf("Error deleting ScheduleActivities not in uniqueActivityIDs: %v\n", err)
				} else {
					fmt.Println("Successfully deleted ScheduleActivities not in uniqueActivityIDs")
				}
			}
			// อัปเดต DateTime ใน ScheduleActivities ตาม activity_id และ tourSchedulesID
			for i, activityID := range uniqueActivityIDs {
				if i < len(requestData.Activities) {
					activity := requestData.Activities[i]
					Day := activity.Day
					utcTime := activity.Time.In(time.UTC)
					Time := time.Date(0, 1, 1, utcTime.Hour(), utcTime.Minute(), utcTime.Second(), 0, time.UTC)

					// อัปเดต DateTime สำหรับ activity_id ที่ตรงกันใน ScheduleActivities
					result := db.Model(&entity.ScheduleActivities{}).
						Where("activity_id = ? AND tour_schedule_id IN ?", activityID, tourSchedulesIDs).
						Updates(map[string]interface{}{
							"day":  Day,
							"time": Time,
						})

					if result.Error != nil {
						fmt.Printf("Error updating ScheduleActivities with activity_id %d: %v\n", activityID, result.Error)
					} else {
						if result.RowsAffected > 0 {
							fmt.Printf("Successfully updated ScheduleActivities for activity with ID %d: DateTime: %s\n", activityID, activity.Time)
						} else {
							fmt.Printf("No rows affected for ScheduleActivities with activity_id %d\n", activityID)
						}
					}
					// อัปเดตข้อมูลในตาราง activities ตาม activity_id
					for i, activity := range requestData.Activities {
						if len(uniqueActivityIDs) > i {
							activityID := uniqueActivityIDs[i]

							// อัปเดตข้อมูลในฐานข้อมูลที่ตรงกับ activity_id นี้
							result := db.Model(&entity.Activities{}).
								Where("id = ?", activityID).
								Updates(map[string]interface{}{
									"activity_name": activity.ActivityName,
									"description":   activity.Description,
									"location_id":   activity.LocationID,
								})

							if result.Error != nil {
								fmt.Printf("Error updating activity with ID %d: %v\n", activityID, result.Error)
							} else {
								if result.RowsAffected > 0 {
									fmt.Printf("Successfully updated activity with ID %d: %s, Location ID: %d\n", activityID, activity.ActivityName, activity.LocationID)
								} else {
									fmt.Printf("No rows affected for activity with ID %d: %s, Location ID: %d\n", activityID, activity.ActivityName, activity.LocationID)
								}
							}
						}
					}
				}
			}

			// ตรวจสอบว่าจำนวน Activities ที่ส่งมาจาก UI มากกว่า uniqueActivityIDs
			if len(requestData.Activities) > len(uniqueActivityIDs) {

				additionalActivities := requestData.Activities[len(uniqueActivityIDs):]

				for _, newActivity := range additionalActivities {
					activity := entity.Activities{
						ActivityName: newActivity.ActivityName,
						Description:  newActivity.Description,
						LocationID:   newActivity.LocationID,
					}
					if err := db.Create(&activity).Error; err != nil {
						fmt.Printf("Error creating new activity: %v\n", err)
						continue
					}

					activityTimeStr := newActivity.Time.Format("15:04:05")

					location, _ := time.LoadLocation("Asia/Bangkok")
					parsedTime, err := time.ParseInLocation("15:04:05", activityTimeStr, location)
					if err != nil {
						fmt.Printf("Error parsing time: %v\n", err)
						return
					}

					newActivityTime := time.Date(0, time.January, 1, parsedTime.Hour(), parsedTime.Minute(), parsedTime.Second(), parsedTime.Nanosecond(), time.UTC)
					newActivityTime = newActivityTime.Add(7 * time.Hour)

					// เพิ่มกิจกรรมใหม่ใน ScheduleActivities
					for _, scheduleID := range tourSchedulesIDs {
						scheduleActivity := entity.ScheduleActivities{
							TourScheduleID: scheduleID,
							ActivityID:     activity.ID,
							Day:            newActivity.Day,
							Time:           newActivityTime,
						}
						if err := db.Create(&scheduleActivity).Error; err != nil {
							fmt.Printf("Error creating new ScheduleActivity: %v\n", err)
							continue
						}
					}
					fmt.Printf("Successfully added new activity: %s (ID: %d)\n", newActivity.ActivityName, activity.ID)
				}
			}
		}
	}

	var roomTypes []entity.RoomTypes
	if err := db.Find(&roomTypes).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch room types", "details": err.Error()})
		return
	}
	if len(roomTypes) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No RoomTypes found in the database"})
		return
	}

	// ดึงราคาทั้งหมดที่มี TourPackageID เท่ากับ ID ที่รับจาก URL
	var existingPrices []entity.TourPrices
	if err := db.Where("tour_package_id = ?", tourPackage.ID).Find(&existingPrices).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch existing prices", "details": err.Error()})
		return
	}

	// ตรวจสอบความถูกต้องของจำนวนข้อมูล
	if len(requestData.TourPrices) > len(roomTypes) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Insufficient RoomTypes for the given TourPrices"})
		return
	}

	// อัปเดตราคาตามลำดับ
	for i := 0; i < len(requestData.TourPrices); i++ {
		roomType := roomTypes[i] // ใช้ RoomType ตามลำดับ
		var personTypeID uint

		// กำหนดค่า PersonTypeID ตาม RoomType
		if roomType.TypeName == "เพิ่มเตียงเสริม" || roomType.TypeName == "ไม่เพิ่มเตียงเสริม" {
			personTypeID = 1
		} else {
			personTypeID = 2
		}

		if i < len(existingPrices) {
			existingPrice := &existingPrices[i]
			existingPrice.RoomTypeID = roomType.ID
			existingPrice.PersonTypeID = personTypeID
			existingPrice.Price = requestData.TourPrices[i].Price

			if err := db.Save(existingPrice).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update price", "details": err.Error()})
				return
			}
		} else {
			newPrice := entity.TourPrices{
				TourPackageID: tourPackage.ID,
				RoomTypeID:    roomType.ID,
				PersonTypeID:  personTypeID,
				Price:         requestData.TourPrices[i].Price,
			}

			if err := db.Create(&newPrice).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create new price", "details": err.Error()})
				return
			}
		}
	}

	// ลบราคาที่เกิน
	if len(requestData.TourPrices) < len(existingPrices) {
		for i := len(requestData.TourPrices); i < len(existingPrices); i++ {
			if err := db.Delete(&existingPrices[i]).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete extra prices", "details": err.Error()})
				return
			}
		}
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Tour package updated successfully",
	})
}

// DELETE /delete-tour-package/:id
func DeleteTourPackage(c *gin.Context) {

	id := c.Param("id")
	db := config.DB()

	// ดำเนินการลบแพ็กเกจทัวร์จากฐานข้อมูล
	var tourPackage entity.TourPackages
	if err := db.Where("id = ?", id).First(&tourPackage).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Package not found"})
		return
	}

	// ลบข้อมูลแพ็กเกจทัวร์
	if err := db.Delete(&tourPackage).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete package"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Tour package deleted successfully"})
}
