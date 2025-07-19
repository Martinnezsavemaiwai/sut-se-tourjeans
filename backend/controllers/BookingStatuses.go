package controllers

import (
	"net/http"
	"toursystem/config"
	"toursystem/entity"
	"github.com/gin-gonic/gin"
)

// GET /booking-statuses
func ListBookingStatuses(c *gin.Context) {
	var bookingStatuses []entity.BookingStatuses

	db := config.DB()

	db.Find(&bookingStatuses)

	c.JSON(http.StatusOK, &bookingStatuses)
}