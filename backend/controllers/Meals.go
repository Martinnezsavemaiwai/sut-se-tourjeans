package controllers

import (
	"errors"
	"net/http"
	"toursystem/config"
	"toursystem/entity"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// POST /meals
func CreateMeal(c *gin.Context) {
	db := config.DB()

	var meal entity.Meals
	if err := c.ShouldBindJSON(&meal); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := db.Create(&meal).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create meal"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Meal created successfully",
		"data":    meal,
	})
}

// GET /meals
func GetMeals(c *gin.Context) {
	db := config.DB()

	var meals []entity.Meals
	if err := db.Preload("MealType").Find(&meals).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusOK, meals)
}

// GET /meals/:id
func GetMealByID(c *gin.Context) {
	id := c.Param("id")

	db := config.DB()

	var meal entity.Meals
	if err := db.Preload("MealType").First(&meal, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Meal not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusOK, meal)
}

// PATH /meals/:id
func UpdateMeal(c *gin.Context) {
	id := c.Param("id")

	db := config.DB()

	var meal entity.Meals
	if err := db.First(&meal, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Meal not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	if err := c.ShouldBindJSON(&meal); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := db.Save(&meal).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update meal"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Meal updated successfully",
		"data":    meal,
	})
}

// DELETE /meals/:id
func DeleteMeal(c *gin.Context) {
	id := c.Param("id")

	db := config.DB()

	var meal entity.Meals
	if err := db.First(&meal, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Meal not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	if err := db.Delete(&meal).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete meal"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Meal deleted successfully"})
}