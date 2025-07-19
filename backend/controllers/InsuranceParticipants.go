package controllers

import (
	"net/http"
	"toursystem/config"
	"toursystem/entity"

	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
)

// GET /purchase-details
func ListInsuranceParticipants(c *gin.Context) {
	var insuranceParticipants []entity.InsuranceParticipants

	db := config.DB()

	db.Preload("PurchaseDetail").Preload("PurchaseDetail.TravelInsurance").Find(&insuranceParticipants)

	c.JSON(http.StatusOK, &insuranceParticipants)
}

func GetInsuranceParticipantByID(c *gin.Context) {
	ID := c.Param("id")
	var inpar entity.InsuranceParticipants

	db := config.DB()
	results := db.Preload("PurchaseDetail").Preload("PurchaseDetail.TravelInsurance").First(&inpar, ID)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	if inpar.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	c.JSON(http.StatusOK, inpar)
}

// POST /purchase-detail
func CreateInsuranceParticipants(c *gin.Context) {
	var insuranceParticipants entity.InsuranceParticipants

	if err := c.ShouldBindJSON(&insuranceParticipants); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if ok, err := govalidator.ValidateStruct(&insuranceParticipants); !ok {
		c.JSON(http.StatusBadRequest, gin.H{"validation_error": err.Error()})
		return
	}

	db := config.DB()

	var purchaseDetail entity.PurchaseDetails
	if err := db.First(&purchaseDetail, insuranceParticipants.PurchaseDetailID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "purchase detail not found"})
		return
	}

	p := entity.InsuranceParticipants{
		IdCardNumber: insuranceParticipants.IdCardNumber,
		FirstName: insuranceParticipants.FirstName,
		LastName: insuranceParticipants.LastName,
		PurchaseDetailID: insuranceParticipants.PurchaseDetailID,
		Age: insuranceParticipants.Age,
		PhoneNumber: insuranceParticipants.PhoneNumber,
		Detail: insuranceParticipants.Detail,
	}

	if err := db.FirstOrCreate(&p, &entity.InsuranceParticipants{
		PurchaseDetailID: p.PurchaseDetailID,
	}).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": p})
}

func DeleteInsuranceParticipant(c *gin.Context) {

	id := c.Param("id")
	db := config.DB()

	
	var inpar entity.InsuranceParticipants
	if err := db.Where("id = ?", id).First(&inpar).Error; err != nil {
		
		c.JSON(http.StatusNotFound, gin.H{"error": "InsuranceParticipant not found"})
		return
	}

	
	if err := db.Delete(&inpar).Error; err != nil {
		
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete InsuranceParticipant"})
		return
	}

	
	c.JSON(http.StatusOK, gin.H{"message": "InsuranceParticipant deleted successfully"})
}