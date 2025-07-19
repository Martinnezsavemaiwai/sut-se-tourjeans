package controllers

import (
	"net/http"
	"toursystem/config"
	"toursystem/entity"

	"github.com/gin-gonic/gin"
)

// GET /room-types
func ListRoomTypes(c *gin.Context) {
	var roomTypes []entity.RoomTypes

	db := config.DB()

	if err := db.Find(&roomTypes).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusOK, roomTypes)
}