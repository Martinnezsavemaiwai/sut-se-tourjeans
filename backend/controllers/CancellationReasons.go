package controllers

import (
	"net/http"
	"toursystem/config"
	"toursystem/entity"

	"github.com/gin-gonic/gin"
)

// GET /cancellation-reasons
func ListCancellationReasons(c *gin.Context) {
	var reasons []entity.CancellationReasons

	db := config.DB()

	db.Find(&reasons)

	c.JSON(http.StatusOK, &reasons)
}