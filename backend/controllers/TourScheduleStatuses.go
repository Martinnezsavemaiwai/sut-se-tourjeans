package controllers

import (
	"net/http"
	"toursystem/config"
	"toursystem/entity"

	"github.com/gin-gonic/gin"
)

// GET /tour-schedule-status
func ListScheduleStatuses(c *gin.Context) {
	var statuses []entity.TourScheduleStatuses

	db := config.DB()

	// คำสั่งดึงข้อมูลทั้งหมดจากตาราง TourScheduleStatuses
	if err := db.Find(&statuses).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงข้อมูลได้"})
		return
	}

	// ส่งข้อมูลกลับเป็น JSON
	c.JSON(http.StatusOK, statuses)
}