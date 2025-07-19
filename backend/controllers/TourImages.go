package controllers

import (
	"net/http"
	"toursystem/config"
	"toursystem/entity"

	"github.com/gin-gonic/gin"
)

// GET /tour-image/:tourpackageId
func GetTourImageByTourPackageID(c *gin.Context){
	tourpackageID := c.Param("tourpackageId")
	var image []entity.TourImages

	db := config.DB()
	results := db.Preload("TourPackage").Find(&image, "tour_package_id=?", tourpackageID)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, image)
}