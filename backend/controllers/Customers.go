package controllers

import (
	"fmt"
	"net/http"
	"path"
	"toursystem/config"
	"toursystem/entity"

	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
)

// GET /customer/:id
func GetCustomerByID(c *gin.Context) {
	ID := c.Param("id")
	var customer entity.Customers

	db := config.DB()
	results := db.Preload("Gender").First(&customer, ID)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	if customer.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	c.JSON(http.StatusOK, customer)
}

// POST /sign-up
func CreateCustomer(c *gin.Context) {
	var customer entity.Customers

	if err := c.ShouldBindJSON(&customer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if ok, err := govalidator.ValidateStruct(&customer); !ok {
		c.JSON(http.StatusBadRequest, gin.H{"validation_error": err.Error()})
		return
	}

	db := config.DB()

	hashedPassword, _ := config.HashPassword(customer.Password)
	cus := entity.Customers{
		UserName:    customer.UserName,
		FirstName:   customer.FirstName,
		LastName:    customer.LastName,
		Email:       customer.Email,
		Password:    hashedPassword,
		PhoneNumber: customer.PhoneNumber,
		GenderID: 	 customer.GenderID,	
	}

	if err := db.FirstOrCreate(&cus, entity.Customers{
		Email: cus.Email,
	}).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": cus})
}

// PATCH /customer/:id
func UpdateCustomer(c *gin.Context) {
	ID := c.Param("id")

	var customer entity.Customers

	db := config.DB()
	result := db.First(&customer, ID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	file, err := c.FormFile("file")
	filePath := customer.ProfilePath
	if err == nil {
		customerFolder := "images/profileCustomers"
		createFolderIfNotExist(customerFolder)

		newFileName := fmt.Sprintf("customer%s.jpg", ID)
		filePath = path.Join(customerFolder, newFileName)

		if err := c.SaveUploadedFile(file, filePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถบันทึกไฟล์ได้"})
			return
		}
	}

	if ok, err := govalidator.ValidateStruct(&customer); !ok {
		c.JSON(http.StatusBadRequest, gin.H{"validation_error": err.Error()})
		return
	}	

	updates := map[string]interface{}{
		"user_name":    c.PostForm("UserName"),
		"first_name":   c.PostForm("FirstName"),
		"last_name":    c.PostForm("LastName"),
		"email":        c.PostForm("Email"),
		"phone_number": c.PostForm("PhoneNumber"),
		"profile_path": filePath,
		"gender_id":	c.PostForm("GenderID"),
	}

	// Debugging: Log updates data
	fmt.Printf("Data to update: %+v\n", updates)

	// Update customer details
	if err := db.Model(&customer).Updates(updates).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to update customer"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Update successful", "data": customer})
}

// PATCH /customer-booking/:id
func UpdateCustomerBooking(c *gin.Context) {
	ID := c.Param("id")

	var customer entity.Customers

	db := config.DB()
	result := db.First(&customer, ID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&customer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	if ok, err := govalidator.ValidateStruct(&customer); !ok {
		c.JSON(http.StatusBadRequest, gin.H{"validation_error": err.Error()})
		return
	}

	result = db.Save(&customer)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to update customer"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}