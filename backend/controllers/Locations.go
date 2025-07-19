package controllers

import (
	"errors"
	"net/http"
	"toursystem/config"
	"toursystem/entity"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// Post /locations
func CreateLocation(c *gin.Context) {
	db := config.DB()

	var location entity.Locations
	if err := c.ShouldBindJSON(&location); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := db.Create(&location).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create location"})
		return
	}

	c.JSON(http.StatusCreated, location)
}

// GET /locations
func GetLocations(c *gin.Context) {
	
	db := config.DB()

	var locations []entity.Locations
	if err := db.Preload("Province").Preload("Activities").Preload("Transportations").Find(&locations).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusOK, locations)
}

// GET /locations/:id
func GetLocationByID(c *gin.Context) {
    id := c.Param("id")
    idInt, err := strconv.Atoi(id)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
        return
    }

    db := config.DB()

    var location entity.Locations
    if err := db.Preload("Province").Preload("Activities").Preload("Transportations").First(&location, idInt).Error; err != nil {
        if errors.Is(err, gorm.ErrRecordNotFound) {
            c.JSON(http.StatusNotFound, gin.H{"error": "Location not found"})
            return
        }
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
        return
    }

    c.JSON(http.StatusOK, location)
}

// PATH /locations/:id
func UpdateLocation(c *gin.Context) {
	id := c.Param("id")

	db := config.DB()

	var location entity.Locations
	if err := db.First(&location, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Location not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	if err := c.ShouldBindJSON(&location); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := db.Save(&location).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update location"})
		return
	}

	c.JSON(http.StatusOK, location)
}

// DELETE /locations/:id
func DeleteLocation(c *gin.Context) {
	id := c.Param("id")

	db := config.DB()

	var location entity.Locations
	if err := db.First(&location, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Location not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	if err := db.Delete(&location).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete location"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Location deleted successfully"})
	
}

// GET /locations/:provinceId
func ListLocationsByProvince(c *gin.Context) {
	var locations []entity.Locations
	provinceId := c.Param("id")

	db := config.DB()

	if err := db.Where("province_id = ?", provinceId).Find(&locations).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, locations)
}