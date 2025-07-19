package controllers

import (
	"net/http"
	"toursystem/config"
	"toursystem/entity"

	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
)

// GET /purchase-details
func ListSalesReports(c *gin.Context) {
	var sales []entity.SalesReports

	db := config.DB()

	db.Find(&sales)

	c.JSON(http.StatusOK, &sales)
}

// POST /purchase-detail
func CreateSalesReports(c *gin.Context) {
	var cs entity.SalesReports

	// Bind JSON input to the SalesReports struct
	if err := c.ShouldBindJSON(&cs); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate the input using govalidator
	if ok, err := govalidator.ValidateStruct(&cs); !ok {
		c.JSON(http.StatusBadRequest, gin.H{"validation_error": err.Error()})
		return
	}

	db := config.DB()

	// Create a new SalesReports record
	p := entity.SalesReports{
		ReportName:   cs.ReportName,
		Data:         cs.Data,
		Date:         cs.Date,
		Total_sales:  cs.Total_sales,
		Total_revenue: cs.Total_revenue,
	}

	// Use db.Create to insert a new record
	if err := db.Create(&p).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Respond with the created record
	c.JSON(http.StatusCreated, gin.H{"message": "Created successfully", "data": p})
}

func DeleteSalesReports(c *gin.Context) {

	id := c.Param("id")
	db := config.DB()

	
	var salesreports entity.SalesReports
	if err := db.Where("id = ?", id).First(&salesreports).Error; err != nil {
		
		c.JSON(http.StatusNotFound, gin.H{"error": "SalesReport not found"})
		return
	}

	
	if err := db.Delete(&salesreports).Error; err != nil {
		
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete SalesReport"})
		return
	}

	
	c.JSON(http.StatusOK, gin.H{"message": "SalesReport deleted successfully"})
}
