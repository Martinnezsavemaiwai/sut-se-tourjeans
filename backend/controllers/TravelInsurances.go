package controllers

import (
	"net/http"
	"toursystem/config"
	"toursystem/entity"

	"github.com/gin-gonic/gin"
)

func GetTravelInsurances(c *gin.Context) {
	var travelInsurances []entity.TravelInsurances

	db := config.DB()

	if err := db.Preload("Provider").Preload("PurchaseDetails").Find(&travelInsurances).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, &travelInsurances)
}

func GetTravelInsurancesByID(c *gin.Context) {
	var travelinsurance entity.TravelInsurances
	id := c.Param("id")

	db := config.DB()

	if err := db.Preload("Provider").Preload("PurchaseDetails").First(&travelinsurance, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Travel insurance not found"})
		return
	}

	c.JSON(http.StatusOK, travelinsurance)
}
