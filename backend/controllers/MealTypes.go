package controllers

import (
	"errors"
	"net/http"
	"toursystem/config"
	"toursystem/entity"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// GET /mealtypes
func GetMealTypes(c *gin.Context) {
	// เชื่อมต่อกับฐานข้อมูล
	db := config.DB()

	// ดึงข้อมูล 
	var mealtypes []entity.MealTypes
	if err := db.Find(&mealtypes).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	// ส่งข้อมูลกลับในรูป JSON
	c.JSON(http.StatusOK, mealtypes)

}

// GET /mealtypes/:id
func GetMealTypeByID(c *gin.Context) {
	// เชื่อมต่อกับฐานข้อมูล
	db := config.DB()

	id := c.Param("id")

	// ดึงข้อมูล 
	var mealtypes entity.MealTypes
	if err := db.First(&mealtypes, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "MealType not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	// ส่งข้อมูลกลับในรูป JSON
	c.JSON(http.StatusOK, mealtypes)

}