package controllers

import (
	"net/http"
	"regexp"
	"toursystem/config"
	"toursystem/entity"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

// GET /employees
func ListEmployees(c *gin.Context) {
	var employees []entity.Employees

	db := config.DB()

	// Preload related data
	if err := db.Preload("Role").Preload("EmployeeSchedules").Find(&employees).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, &employees)
}

// GET /employee/:id
func GetEmployeeByID(c *gin.Context) {
	var employee entity.Employees
	id := c.Param("id")

	db := config.DB()
	if err := db.Preload("Role").Preload("EmployeeSchedules").First(&employee, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Employee not found"})
		return
	}

	c.JSON(http.StatusOK, employee)
}

// POST /employees
func CreateEmployee(c *gin.Context) {
	var employee entity.Employees

	if err := c.ShouldBindJSON(&employee); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	// Validate email format
	if !isValidEmail(employee.Email) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid email format"})
		return
	}

	// Validate phone number format
	if !isValidPhoneNumber(employee.PhoneNumber) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Phone number must start with 0 and be 10 digits"})
		return
	}

	// Check if userName, email, or phoneNumber already exists
	if isUserNameEmailPhoneNumberExists(employee.UserName, employee.Email, employee.PhoneNumber) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "UserName, Email, or PhoneNumber already exists"})
		return
	}

	// Hash password
	if len(employee.Password) > 0 {
		hashedPassword, err := hashPassword(employee.Password)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
			return
		}
		employee.Password = hashedPassword
	}

	db := config.DB()
	if err := db.Create(&employee).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create employee"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Employee created successfully", "employee": employee})
}

// PUT /employee/:id
func UpdateEmployee(c *gin.Context) {
    id := c.Param("id")
    var employee entity.Employees

    if err := c.ShouldBindJSON(&employee); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
        return
    }

    // Validate email format
    if !isValidEmail(employee.Email) {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid email format"})
        return
    }

    // Validate phone number format
    if !isValidPhoneNumber(employee.PhoneNumber) {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Phone number must start with 0 and be 10 digits"})
        return
    }

    // Check if email or phoneNumber already exists (excluding the current employee's own data)
    db := config.DB()
    var existingEmployee entity.Employees

    // Check for duplicate email or phone number
    if err := db.Where("email = ? AND id != ?", employee.Email, id).First(&existingEmployee).Error; err == nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Email already exists"})
        return
    }

    if err := db.Where("phone_number = ? AND id != ?", employee.PhoneNumber, id).First(&existingEmployee).Error; err == nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Phone number already exists"})
        return
    }

    // Exclude password from being updated, leave it as is
    employee.Password = "" // Set password as empty to prevent updating

    // Only update the fields that were modified (excluding password)
    if err := db.Model(&entity.Employees{}).Where("id = ?", id).Updates(employee).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update employee"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Employee updated successfully", "employee": employee})
}


// DELETE /employee/:id
func DeleteEmployee(c *gin.Context) {
	id := c.Param("id")
	var employee entity.Employees

	db := config.DB()
	if err := db.Delete(&employee, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete employee"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Employee deleted successfully"})
}

// Helper Functions
func hashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedPassword), nil
}

func isValidEmail(email string) bool {
	re := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
	return re.MatchString(email)
}

func isValidPhoneNumber(phone string) bool {
	re := regexp.MustCompile(`^0\d{9}$`)
	return re.MatchString(phone)
}

// Helper function to check if the username, email, or phone number already exists in the database
func isUserNameEmailPhoneNumberExists(userName, email, phoneNumber string) bool {
	var count int64
	db := config.DB()

	// Check for duplicate username
	if err := db.Model(&entity.Employees{}).Where("user_name = ?", userName).Count(&count).Error; err != nil {
		return true // Error occurred, assume duplicate
	}
	if count > 0 {
		return true
	}

	// Check for duplicate email
	if err := db.Model(&entity.Employees{}).Where("email = ?", email).Count(&count).Error; err != nil {
		return true // Error occurred, assume duplicate
	}
	if count > 0 {
		return true
	}

	// Check for duplicate phone number
	if err := db.Model(&entity.Employees{}).Where("phone_number = ?", phoneNumber).Count(&count).Error; err != nil {
		return true // Error occurred, assume duplicate
	}
	if count > 0 {
		return true
	}

	return false
}

// GET /check-duplicate
func CheckDuplicateUserNameEmailPhoneNumber(c *gin.Context) {
	userName := c.DefaultQuery("userName", "")
	email := c.DefaultQuery("email", "")
	phoneNumber := c.DefaultQuery("phoneNumber", "")

	if isUserNameEmailPhoneNumberExists(userName, email, phoneNumber) {
		c.JSON(http.StatusOK, gin.H{"exists": true})
	} else {
		c.JSON(http.StatusOK, gin.H{"exists": false})
	}
}
