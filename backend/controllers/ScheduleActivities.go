package controllers

import (
	"net/http"
	"toursystem/config"
	"toursystem/entity"

	"github.com/gin-gonic/gin"
    "fmt"
    "sort"
)

// GET /schedule-activity/:id
func GetScheduleActivityByTourScheduleID(c *gin.Context) {
	var scheduleActivity []entity.ScheduleActivities
    id := c.Param("id")

    db := config.DB()

    if err := db.Preload("Activity").Find(&scheduleActivity, "tour_schedule_id = ?", id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "tour package not found"})
        return
    }

    c.JSON(http.StatusOK, scheduleActivity)
}

// GET /schedule-a-activity/:id
func GetScheduleActivity(c *gin.Context) {
    tourPackageID := c.Param("id")

    db := config.DB()
    var tourPackage entity.TourPackages
    if err := db.First(&tourPackage, tourPackageID).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Tour package not found"})
        return
    }

    // ดึงข้อมูล TourDescriptions
    var description entity.TourDescriptions
    if err := db.First(&description, "tour_package_id = ?", tourPackage.ID).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "TourDescriptions not found for the given TourPackageID"})
        return
    }

    // ดึงข้อมูล TourImages
    var existingImages []entity.TourImages
    if err := db.Where("tour_package_id = ?", tourPackage.ID).Find(&existingImages).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Images not found for the specified tour package"})
        return
    }

    // ดึงข้อมูล TourSchedules
    var tourSchedules []entity.TourSchedules
    if err := db.Where("tour_package_id = ?", tourPackageID).Find(&tourSchedules).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "No tour schedules found for the specified package"})
        return
    }

    // สร้าง tourSchedulesIDs
    tourSchedulesIDs := make([]uint, len(tourSchedules))
    for i, ts := range tourSchedules {
        tourSchedulesIDs[i] = ts.ID
    }
    fmt.Println("Schedule IDs 1:", tourSchedulesIDs)
    
    // ดึง ScheduleActivities IDs
    var scheduleActivitiesIDs []uint
    if err := db.Model(&entity.ScheduleActivities{}).
        Where("tour_schedule_id IN ?", tourSchedulesIDs).
        Pluck("id", &scheduleActivitiesIDs).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve schedule activities IDs"})
        return
    }
    fmt.Println("Schedule Activities Ja:", scheduleActivitiesIDs)

    // ดึง Activity IDs
    var activityIDs []uint
    if len(scheduleActivitiesIDs) > 0 {
        if err := db.Model(&entity.ScheduleActivities{}).
            Where("id IN ?", scheduleActivitiesIDs).
            Pluck("activity_id", &activityIDs).Error; err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve activity IDs"})
            return
        }
    }
    //fmt.Println("Activities IDs:", activityIDs)

    // คัดกรอง activity IDs ให้ไม่ซ้ำ
    uniqueActivityIDs := uniqueIDs(activityIDs)

    // เรียงลำดับ uniqueActivityIDs ตามค่า ID
    sort.Slice(uniqueActivityIDs, func(i, j int) bool {
    return uniqueActivityIDs[i] < uniqueActivityIDs[j]
    })
    //fmt.Println("Activities IDs:", uniqueActivityIDs)


var activityScheduleMap []gin.H

if len(uniqueActivityIDs) > 0 {
    for _, activityID := range uniqueActivityIDs {
        var scheduleActivity entity.ScheduleActivities
        var activity entity.Activities  
        var location entity.Locations   

        // ดึงเฉพาะตัวแรกที่ตรงกับ activity_id ใน ScheduleActivities
        if err := db.Where("activity_id = ?", activityID).First(&scheduleActivity).Error; err == nil {
            // ดึงข้อมูล activity ที่เกี่ยวข้อง
            if err := db.First(&activity, activityID).Error; err == nil {
                // ดึงข้อมูล Location ที่เกี่ยวข้องจาก LocationID ของ Activity
                if err := db.First(&location, activity.LocationID).Error; err == nil {
                    // เพิ่มข้อมูลทั้ง scheduleActivity, activity และ location ลงใน activityScheduleMap
                    activityScheduleMap = append(activityScheduleMap, gin.H{
                        "ID":              scheduleActivity.ID,
                        "Day":             scheduleActivity.Day,
                        "Time":            scheduleActivity.Time,
                        "ActivityID":      scheduleActivity.ActivityID,
                        "TourScheduleID":  scheduleActivity.TourScheduleID,
                        "Activity": gin.H{
                            "ID":           activity.ID,
                            "ActivityName": activity.ActivityName,
                            "Description":  activity.Description,
                            "Location": gin.H{
                            "LocationName": location.LocationName,  
                            },
                        },
                    })
                }
            }
        }
    }
}

if len(activityScheduleMap) == 0 {
    c.JSON(http.StatusNotFound, gin.H{"error": "No schedule activities or activities found for the given activity IDs"})
    return
}

c.JSON(http.StatusOK, activityScheduleMap)
}

// ฟังก์ชันช่วยสำหรับคัดกรอง ID ที่ไม่ซ้ำ
func uniqueIDs(ids []uint) []uint {
    idMap := make(map[uint]bool)
    for _, id := range ids {
        idMap[id] = true
    }

    var uniqueIDs []uint
    for id := range idMap {
        uniqueIDs = append(uniqueIDs, id)
    }
    return uniqueIDs
}