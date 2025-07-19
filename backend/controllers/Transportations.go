package controllers

import (
	"errors"
	"net/http"
	"toursystem/config"
	"toursystem/entity"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// POST /transportations
func CreateTransportation(c *gin.Context){

	db := config.DB()

	var transportation entity.Transportations
	if err := c.ShouldBindJSON(&transportation); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := db.Create(&transportation).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create transportation"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Transportation created successfully",
		"data":    transportation,
	})
}

// GET /transportations
func GetTransportations(c *gin.Context) {
    db := config.DB()

    // ใช้ Preload เพื่อโหลดข้อมูลที่เกี่ยวข้อง
    var transportations []entity.Transportations
    if err := db.Preload("Vehicle").Preload("TourPackage").Preload("Location").Preload("Vehicle.VehicleType").Find(&transportations).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
        return
    }

    c.JSON(http.StatusOK, transportations)
}


// GET /transportations/:id
func GetTransportationByID(c *gin.Context) {

	id := c.Param("id")

	db := config.DB()

	var transportation entity.Transportations
	if err := db.Preload("Vehicle").Preload("TourPackage").Preload("Location").Preload("Vehicle.VehicleType").First(&transportation, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Transportation not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusOK, transportation)
}

// PATH /transportations/:id
func UpdateTransportation(c *gin.Context) {

	id := c.Param("id")

	db := config.DB()

	var transportation entity.Transportations
	if err := db.First(&transportation, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Transportation not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	if err := c.ShouldBindJSON(&transportation); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := db.Save(&transportation).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update transportation"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Transportation updated successfully",
		"data":    transportation,
	})
}

// DELETE /transportations/:id
func DeleteTransportation(c *gin.Context) {
    id := c.Param("id")

    db := config.DB()

    // ค้นหา Transportation โดย id
    var transportation entity.Transportations
    if err := db.First(&transportation, id).Error; err != nil {
        if errors.Is(err, gorm.ErrRecordNotFound) {
            c.JSON(http.StatusNotFound, gin.H{"error": "Transportation not found"})
            return
        }
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
        return
    }

    // ลบ Transportation (จะ cascade ลบ Location ด้วย)
    if err := db.Delete(&transportation).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete transportation"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Transportation and associated Location deleted successfully"})
}
