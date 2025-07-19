package controllers

import (
	"net/http"
	"time"
	"toursystem/config"
	"toursystem/entity"

	"github.com/gin-gonic/gin"
)
func ListPayments(c *gin.Context) {
	var payment []entity.Payments

	db := config.DB()

	db.Find(&payment)

	c.JSON(http.StatusOK, &payment)
}
// POST /payment
func CreatePayment(c *gin.Context) {
	var payment entity.Payments

	if err := c.ShouldBindJSON(&payment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	var booking entity.Bookings
	if err := db.First(&booking, payment.BookingID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "booking not found"})
		return
	}

	pm := entity.Payments{
		PaymentDate: time.Now(),
		Amount: payment.Amount,
		BookingID: payment.BookingID,
		PaymentStatusID: 1,
	}

	if err := db.FirstOrCreate(&pm, &entity.Payments{
		BookingID: pm.BookingID,
	}).Error; 
	err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": pm})
}

// PATCH /Payment/:id
func UpdatePayment(c *gin.Context) {
	ID := c.Param("id")

	var payment entity.Payments

	db := config.DB()
	result := db.First(&payment, ID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&payment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&payment)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

// DELETE /payment/:bookingID
func DeletePaymentByBookingID(c *gin.Context) {
    bookingID := c.Param("bookingID")

    db := config.DB()

    var payments entity.Payments
    if err := db.Where("booking_id = ?", bookingID).First(&payments).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Payment not found"})
        return
    }

    if err := db.Where("booking_id = ?", bookingID).Delete(&entity.Payments{}).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete payment"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Payment deleted successfully"})
}