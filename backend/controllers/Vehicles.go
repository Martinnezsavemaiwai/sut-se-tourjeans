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

// POST /vehicles
func CreateVehicle(c *gin.Context) {

	db := config.DB()

	var vehicle entity.Vehicles
	if err := c.ShouldBindJSON(&vehicle); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := db.Create(&vehicle).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create vehicle"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Vehicle created successfully",
		"data":    vehicle,
	})
}

// GET /vehicles
func GetVehicles(c *gin.Context) {

	db := config.DB()

	var vehicles []entity.Vehicles
	if err := db.Preload("VehicleType").Preload("Transportations").Find(&vehicles).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusOK, vehicles)
}

// GET /vehicles/:id
func GetVehicleByID(c *gin.Context) {
	id := c.Param("id")

	db := config.DB()

	var vehicle entity.Vehicles
	if err := db.Preload("VehicleType").Preload("Transportations").First(&vehicle, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Vehicle not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusOK, vehicle)
}

// PATH /vehicles/:id
func UpdateVehicle(c *gin.Context) {

	id := c.Param("id")

	db := config.DB()

	var vehicle entity.Vehicles
	if err := db.First(&vehicle, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Vehicle not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	if err := c.ShouldBindJSON(&vehicle); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := db.Save(&vehicle).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update vehicle"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Vehicle updated successfully",
		"data":    vehicle,
	})
}

// DELETE /vehicles/:id
func DeleteVehicle(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()

	var vehicle entity.Vehicles
	if err := db.First(&vehicle, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Vehicle not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	var vehicleImages []entity.VehicleImages
	if err := db.Where("vehicle_id = ?", vehicle.ID).Find(&vehicleImages).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Vehicle images not found"})
		return
	}

	for _, img := range vehicleImages {
		if err := os.Remove(img.FilePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete image file"})
			return
		}

		if err := db.Delete(&img).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete image record"})
			return
		}
	}

	subfolder := fmt.Sprintf("vehicle%d", vehicle.ID)
	folderPath := filepath.Join("images", "vehicleImages", subfolder)

	if err := os.RemoveAll(folderPath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete image folder"})
		return
	}

	if err := db.Delete(&vehicle).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete vehicle"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Vehicle and its images deleted successfully"})
}
