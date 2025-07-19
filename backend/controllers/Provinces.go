package controllers

import (
	"errors"
	"net/http"
	"toursystem/config"
	"toursystem/entity"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// GET /provinces
func GetProvinces(c *gin.Context) {

	db := config.DB()

	var provinces []entity.Provinces
	if err := db.Preload("TourPackages").Find(&provinces).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusOK, provinces)
}

// GET /provinces/:id
func GetProvinceByID(c *gin.Context) {
	id := c.Param("id")

	db := config.DB()

	var province entity.Provinces
	if err := db.Preload("TourPackages").First(&province, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Province not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusOK, province)
}