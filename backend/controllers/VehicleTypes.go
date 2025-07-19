package controllers

import (
	"errors"
	"net/http"
	"toursystem/config"
	"toursystem/entity"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// POST /vehiclestypes
func CreateVehicleType(c *gin.Context) {

	db := config.DB()

	var vehicleType entity.VehicleTypes
	if err := c.ShouldBindJSON(&vehicleType); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := db.Create(&vehicleType).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create vehicle type"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Vehicle type created successfully",
		"data":    vehicleType,
	})

}

// GET /vehiclestypes
func GetVehicleTypes(c *gin.Context) {

	db := config.DB()

	var vehicleTypes []entity.VehicleTypes
	if err := db.Preload("Vehicles").Find(&vehicleTypes).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusOK, vehicleTypes)

}

// GET /vehiclestypes/:id
func GetVehicleTypeByID(c *gin.Context) {
	id := c.Param("id")

	db := config.DB()

	var vehicleType entity.VehicleTypes
	if err := db.Preload("Vehicles").First(&vehicleType, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Vehicle type not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusOK, vehicleType)

}

// PATH /vehiclestypes/:id
func UpdateVehicleType(c *gin.Context) {
	id := c.Param("id")

	db := config.DB()

	var vehicleType entity.VehicleTypes
	if err := db.First(&vehicleType, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Vehicle type not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	if err := c.ShouldBindJSON(&vehicleType); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := db.Save(&vehicleType).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update vehicle type"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Vehicle type updated successfully", 
		"data": vehicleType,
	})

}

// DELETE /vehiclestypes/:id
func DeleteVehicleType(c* gin.Context){

	id := c.Param("id")

	db := config.DB()

	var vehicleType entity.VehicleTypes
	if err := db.First(&vehicleType, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Vehicle type not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	if err := db.Delete(&vehicleType).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete vehicle type"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Vehicle type deleted successfully"})
}