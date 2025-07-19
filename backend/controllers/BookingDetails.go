package controllers

import (
	"net/http"
	"toursystem/config"
	"toursystem/entity"

	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
)

// GET /booking-details
func ListBookingDetails(c *gin.Context) {
	var bookingDetails []entity.BookingDetails

	db := config.DB()

	db.Find(&bookingDetails)

	c.JSON(http.StatusOK, &bookingDetails)
}

// POST /booking-detail
func CreateBookingDetail(c *gin.Context) {
	var bookingDetail entity.BookingDetails

	if err := c.ShouldBindJSON(&bookingDetail); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if ok, err := govalidator.ValidateStruct(&bookingDetail); !ok {
		c.JSON(http.StatusBadRequest, gin.H{"validation_error": err.Error()})
		return
	}

	db := config.DB()

	var booking entity.Bookings
	if err := db.First(&booking, bookingDetail.BookingID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "booking not found"})
		return
	}

	var tourPrice entity.TourPrices
	if err := db.First(&tourPrice, bookingDetail.TourPriceID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "tour price not found"})
		return
	}

	bkd := entity.BookingDetails{
		Quantity: bookingDetail.Quantity,
		TotalPrice: bookingDetail.TotalPrice,
		BookingID: bookingDetail.BookingID,
		TourPriceID: bookingDetail.TourPriceID,
	}

	if err := db.FirstOrCreate(&bkd, &entity.BookingDetails{
		BookingID: bkd.BookingID,
		TourPriceID: bkd.TourPriceID,
	}).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": bkd})
}

// DELETE /booking-detail/:bookingID
func DeleteBookingDetailByBookingID(c *gin.Context) {
    bookingID := c.Param("bookingID")

    db := config.DB()

    var bookingDetails entity.BookingDetails
    if err := db.Where("booking_id = ?", bookingID).First(&bookingDetails).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Booking details not found"})
        return
    }

    if err := db.Where("booking_id = ?", bookingID).Delete(&entity.BookingDetails{}).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete booking details"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Booking details deleted successfully"})
}