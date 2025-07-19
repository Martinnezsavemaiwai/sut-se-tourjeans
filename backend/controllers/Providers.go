package controllers

import (
	"net/http"
	"toursystem/config"
	"toursystem/entity"

	"github.com/gin-gonic/gin"
)

func GetProviders(c *gin.Context) {
	var Provider []entity.Providers

	db := config.DB()

	if err := db.Preload("TravelInsurances").Find(&Provider).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, &Provider)
}

func GetProvidersByID(c *gin.Context) {
	var provider entity.Providers
	id := c.Param("id")

	db := config.DB()

	if err := db.Preload("TravelInsurances").First(&provider, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Provider not found"})
		return
	}

	c.JSON(http.StatusOK, provider)
}
