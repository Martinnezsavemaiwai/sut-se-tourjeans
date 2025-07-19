package controllers

import (
	"errors"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"toursystem/config"
	"toursystem/entity"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// POST /hotels
func CreateHotel(c *gin.Context) {

	db := config.DB()

	var hotel entity.Hotels
	if err := c.ShouldBindJSON(&hotel); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := db.Create(&hotel).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create hotel"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Hotel created successfully",
		"data":    hotel,
	})
}

// GET /hotels
func GetHotels(c *gin.Context) {

	db := config.DB()

	var hotels []entity.Hotels
	if err := db.Find(&hotels).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusOK, hotels)
}

// GET /hotels/:id
func GetHotelByID(c *gin.Context) {
	id := c.Param("id")

	db := config.DB()

	var hotel entity.Hotels
	if err := db.Preload("Accommodations").First(&hotel, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Hotel not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusOK, hotel)
}

// PATH /hotels/:id
func UpdateHotel(c *gin.Context) {
	id := c.Param("id")

	db := config.DB()

	var hotel entity.Hotels
	if err := db.First(&hotel, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Hotel not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	if err := c.ShouldBindJSON(&hotel); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := db.Save(&hotel).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update hotel"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Hotel updated successfully",
		"data":    hotel,
	})
}

// DELETE /hotels/:id
func DeleteHotel(c *gin.Context) {
	id := c.Param("id")

	db := config.DB()

	var hotel entity.Hotels
	if err := db.First(&hotel, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Hotel not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	var hotelImages []entity.HotelImages
	if err := db.Where("hotel_id = ?", hotel.ID).Find(&hotelImages).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Hotel images not found"})
		return
	}

	for _, img := range hotelImages {
		if err := os.Remove(img.FilePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete image file"})
			return
		}

		if err := db.Delete(&img).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete image record"})
			return
		}
	}

	subfolder := fmt.Sprintf("hotel%d", hotel.ID)
	folderPath := filepath.Join("images", "hotelImages", subfolder)

	if err := os.RemoveAll(folderPath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete image folder"})
		return
	}

	if err := db.Delete(&hotel).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete hotel"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Hotel deleted successfully"})
}
