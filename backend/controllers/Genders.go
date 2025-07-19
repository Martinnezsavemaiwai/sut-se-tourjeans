package controllers

import (
	"net/http"
	"toursystem/config"
	"toursystem/entity"

	"github.com/gin-gonic/gin"
)

// GET /genders
func ListGenders(c *gin.Context) {
	var genders []entity.Genders

	db := config.DB()

	db.Find(&genders)

	c.JSON(http.StatusOK, &genders)
}

func GetGenderByID(c *gin.Context) {
	id := c.Param("id")

	var gender entity.Genders

	db := config.DB()

	if err := db.First(&gender, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Record not found!"})
		return
	}

	c.JSON(http.StatusOK, &gender)
}