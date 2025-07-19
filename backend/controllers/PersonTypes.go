package controllers

import (
	"net/http"
	"toursystem/config"
	"toursystem/entity"

	"github.com/gin-gonic/gin"
)

// GET /person-types
func ListPersonTypes(c *gin.Context) {
	var personTypes []entity.PersonTypes

	db := config.DB()

	if err := db.Find(&personTypes).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

	c.JSON(http.StatusOK, &personTypes)
}