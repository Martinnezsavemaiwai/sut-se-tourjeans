package controllers

import (
	"net/http"
	"toursystem/config"
	"toursystem/entity"

	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
)

// GET /purchase-details
func ListPurchaseDetails(c *gin.Context) {
	var purchaseDetail []entity.PurchaseDetails

	db := config.DB()

	db.Preload("Booking").Preload("TravelInsurance").Find(&purchaseDetail)

	c.JSON(http.StatusOK, &purchaseDetail)
}

// POST /purchase-detail
func CreatePurchaseDetail(c *gin.Context) {
	var purchaseDetail entity.PurchaseDetails

	if err := c.ShouldBindJSON(&purchaseDetail); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if ok, err := govalidator.ValidateStruct(&purchaseDetail); !ok {
		c.JSON(http.StatusBadRequest, gin.H{"validation_error": err.Error()})
		return
	}

	db := config.DB()

	var booking entity.Bookings
	if err := db.First(&booking, purchaseDetail.BookingID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "booking not found"})
		return
	}

	var travelInsurance entity.TravelInsurances
	if err := db.First(&travelInsurance, purchaseDetail.TravelInsuranceID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "travel insurance not found"})
		return
	}

	p := entity.PurchaseDetails{
		Quantity: purchaseDetail.Quantity,
		TotalPrice: purchaseDetail.TotalPrice,
		BookingID: purchaseDetail.BookingID,
		TravelInsuranceID: purchaseDetail.TravelInsuranceID,
	}

	if err := db.FirstOrCreate(&p, &entity.PurchaseDetails{
		BookingID: p.BookingID,
		TravelInsuranceID: p.TravelInsuranceID,
	}).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": p})
}

// DELETE /purchase-detail/:bookingID
func DeletePurchaseDetailByBookingID(c *gin.Context) {
    bookingID := c.Param("bookingID")

    db := config.DB()

    var purchaseDetails entity.PurchaseDetails
    if err := db.Where("booking_id = ?", bookingID).First(&purchaseDetails).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Purchase Detail not found"})
        return
    }

    if err := db.Where("booking_id = ?", bookingID).Delete(&entity.PurchaseDetails{}).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete Purchase Detail"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Purchase Detail deleted successfully"})
}