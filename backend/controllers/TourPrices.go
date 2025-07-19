package controllers

import (
	"net/http"
	"toursystem/config"
	"toursystem/entity"

	"github.com/gin-gonic/gin"
)

// GET /tour-prices
func GetTourPricesController(c *gin.Context) {
	var tourPrices []entity.TourPrices 
	var tourPackages []entity.TourPackages

    db := config.DB()

	// ดึงข้อมูล TourPackages ทั้งหมด
	if err := db.Find(&tourPackages).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch tour packages"})
		return
	}

	// สำหรับแต่ละ Package ดึงราคาที่เกี่ยวข้อง
	for _, pkg := range tourPackages {
		var prices []entity.TourPrices
		if err := db.Where("tour_package_id = ?", pkg.ID).Find(&prices).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch prices"})
			return
		}
		tourPrices = append(tourPrices, prices...)
	}

	c.JSON(http.StatusOK, tourPrices)
}