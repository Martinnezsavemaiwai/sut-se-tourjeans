package controllers

import (
	"net/http"
	"toursystem/config"
	"toursystem/entity"

	"github.com/gin-gonic/gin"
)

// GET /tour-schedule
func ListTourSchedules(c *gin.Context) {
	var statuses []entity.TourSchedules

	db := config.DB()

	// คำสั่งดึงข้อมูลทั้งหมดจากตาราง TourScheduleStatuses
	if err := db.Find(&statuses).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงข้อมูลได้"})
		return
	}

	// ส่งข้อมูลกลับเป็น JSON
	c.JSON(http.StatusOK, statuses)
}

func ListTourSchedulesforEmployeeSchedule(c *gin.Context) {
    var tourSchedules []entity.TourSchedules

    db := config.DB()
    if db == nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Database connection failed"})
        return
    }

    if err := db.Preload("TourPackage").Find(&tourSchedules).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to fetch tour schedules"})
        return
    }

    if len(tourSchedules) == 0 {
        c.JSON(http.StatusOK, gin.H{"message": "No tour schedules found"})
        return
    }

    c.JSON(http.StatusOK, tourSchedules)
}


// GET /tour-schedule/:id
func GetTourScheduleByID(c *gin.Context) {
	var tourSchedule entity.TourSchedules
	id := c.Param("id")

	db := config.DB()

	if err := db.First(&tourSchedule, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "tour package not found"})
		return
	}

	c.JSON(http.StatusOK, tourSchedule)
}

// PATCH /tour-schedule/:id
func UpdateTourSchedule(c *gin.Context) {
	ID := c.Param("id")

	var tourSchedule entity.TourSchedules

	db := config.DB()
	result := db.First(&tourSchedule, ID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&tourSchedule); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&tourSchedule)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

// GET /tour-schedule-packageID/:id
func GetTourSchedulesByPackageID(c *gin.Context) {
	tourPackageID := c.Param("id")

	db := config.DB()

	var tourSchedules []entity.TourSchedules
	if err := db.Where("tour_package_id = ?", tourPackageID).Find(&tourSchedules).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, tourSchedules)
}

// DELETE /delete-activity/:id
func DeleteTourScheduleByID(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()

	var tourSchedules entity.TourSchedules
	if err := db.Where("id = ?", id).First(&tourSchedules).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "TourSchedules not found"})
		return
	}

	if err := db.Delete(&tourSchedules).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete TourSchedules"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "TourSchedules deleted successfully"})
}

// PATCH /restore-tour-schedule/:id
func RestoreTourSchedule(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()

	// ค้นหาข้อมูลรอบทัวร์ รวมถึงข้อมูลที่ถูกลบ
	var tourSchedule entity.TourSchedules
	if err := db.Unscoped().Where("id = ?", id).First(&tourSchedule).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Tour schedule not found"})
		return
	}

	if !tourSchedule.DeletedAt.Valid {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Tour schedule is not deleted"})
		return
	}

	// กู้คืนรอบทัวร์โดยตั้ง DeletedAt ให้เป็น NULL
	if err := db.Unscoped().Model(&tourSchedule).Update("deleted_at", nil).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to restore tour schedule"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":      "Tour schedule restored successfully",
		"tourSchedule": tourSchedule, // คืนค่ารายละเอียดรอบทัวร์ที่ถูกกู้คืน
	})
}
