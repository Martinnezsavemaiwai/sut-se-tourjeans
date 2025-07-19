package controllers

import (
	"fmt"
	"net/http"
	"toursystem/config"
	"toursystem/entity"

	"github.com/gin-gonic/gin"
)

// GET /employee-schedules
// ดึงข้อมูลทั้งหมดของ EmployeeSchedules
func ListEmployeeSchedules(c *gin.Context) {
	var employeeSchedules []entity.EmployeeSchedules

	db := config.DB()

	// Preload ข้อมูลที่เกี่ยวข้อง เช่น TourSchedule, Employee และ TourPackage
	// เพิ่มการ Preload "TourSchedule.TourPackage" เพื่อดึงข้อมูล TourName
	if err := db.Preload("TourSchedule.TourPackage").Preload("Employee").Find(&employeeSchedules).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, &employeeSchedules)
}

func GetEmployeeScheduleByID(c *gin.Context) {
	id := c.Param("id") // Retrieve the employee schedule ID from the URL parameters
	var employeeSchedule entity.EmployeeSchedules

	db := config.DB()

	// Preload related data such as TourSchedule, Employee, and TourPackage
	// Preload "TourSchedule.TourPackage" to get the TourName within the TourPackage
	if err := db.Preload("TourSchedule").Preload("TourSchedule.TourPackage").Preload("Employee").
		First(&employeeSchedule, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Employee schedule not found"})
		return
	}

	// Return the employee schedule with all the related data (TourSchedule and TourPackage)
	c.JSON(http.StatusOK, employeeSchedule)
}

// POST /employee-schedules
// สร้าง EmployeeSchedules ใหม่
func CreateEmployeeSchedule(c *gin.Context) {
	var employeeSchedule entity.EmployeeSchedules

	// Bind JSON body to employeeSchedule struct
	if err := c.ShouldBindJSON(&employeeSchedule); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	db := config.DB()

	// Create employeeSchedule in DB
	if err := db.Create(&employeeSchedule).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create employee schedule"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Employee schedule created successfully", "employeeSchedule": employeeSchedule})
}

// PUT /employee-schedules/:id
// อัปเดต EmployeeSchedules
func UpdateEmployeeSchedule(c *gin.Context) {
	id := c.Param("id")
	var employeeSchedule entity.EmployeeSchedules

	// Bind JSON to employeeSchedule struct
	if err := c.ShouldBindJSON(&employeeSchedule); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	db := config.DB()

	// Find the employeeSchedule by ID and update it
	if err := db.Model(&employeeSchedule).Where("id = ?", id).Updates(employeeSchedule).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update employee schedule"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Employee schedule updated successfully", "employeeSchedule": employeeSchedule})
}

// DELETE /employee-schedules/:id
// ลบ EmployeeSchedules
func DeleteEmployeeSchedule(c *gin.Context) {
	id := c.Param("id")
	var employeeSchedule entity.EmployeeSchedules

	db := config.DB()

	// Delete employeeSchedule by ID
	if err := db.Delete(&employeeSchedule, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete employee schedule"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Employee schedule deleted successfully"})
}

// GET /employee/:id/schedules
// ดึงข้อมูลตารางงานของพนักงานตาม ID

func GetEmployeeSchedulesByEmployeeID(c *gin.Context) {
	employeeID := c.Param("id") // ดึงพารามิเตอร์ id จาก URL

	var employeeSchedules []entity.EmployeeSchedules
	db := config.DB()

	// เพิ่มการ Preload สำหรับข้อมูลที่เกี่ยวข้อง
	if err := db.
		Preload("TourSchedule.TourPackage").
		Preload("TourSchedule.TourPackage.Province").
		Preload("TourSchedule.TourPackage.Transportations.Location").
		Preload("TourSchedule.TourPackage.Transportations.Vehicle").
		Where("employee_id = ?", employeeID).
		Find(&employeeSchedules).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// ส่งข้อมูลในรูปแบบ JSON
	c.JSON(http.StatusOK, employeeSchedules)
}

func GetEmployeeSchedulesByTourScheduleID(c *gin.Context) {
	tourScheduleID := c.Param("id") // ดึง tourScheduleID จาก URL parameters

	var employeeSchedules []entity.EmployeeSchedules
	db := config.DB()

	if err := db.Preload("Employee.Role").Preload("TourSchedule.TourPackage").Where("tour_schedule_id = ?", tourScheduleID).Find(&employeeSchedules).Error; err != nil {
		fmt.Println("Error fetching data:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, employeeSchedules)
}

// Fetch Employee schedules that are overlapping with the provided TourSchedule
func GetEmployeeByTourSchedule(c *gin.Context) {
	tourScheduleID := c.Param("id") // Get the tourScheduleID from the URL parameter

	// Ensure tourScheduleID is valid
	if tourScheduleID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid tourScheduleID"})
		return
	}

	var tourSchedule entity.TourSchedules
	var overlappingEmployees []entity.EmployeeSchedules

	db := config.DB()

	// Fetch the TourSchedule record based on tourScheduleID
	if err := db.Preload("TourPackage").Preload("TourScheduleStatus").First(&tourSchedule, tourScheduleID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "TourSchedule not found"})
		return
	}

	// Log the start and end date for debugging purposes
	fmt.Println("TourSchedule StartDate:", tourSchedule.StartDate)
	fmt.Println("TourSchedule EndDate:", tourSchedule.EndDate)

	// Fetch EmployeeSchedules that overlap with the TourSchedule
	startDate := tourSchedule.StartDate
	endDate := tourSchedule.EndDate

	// Updated query to find overlapping schedules using TourSchedule start_date and end_date
	if err := db.Preload("Employee").Where(`
        (tour_schedules.start_date < ? AND tour_schedules.end_date > ?) OR 
        (tour_schedules.start_date BETWEEN ? AND ?) OR 
        (tour_schedules.end_date BETWEEN ? AND ?)`, endDate, startDate, startDate, endDate, startDate, endDate).
		Joins("JOIN tour_schedules ON tour_schedules.id = employee_schedules.tour_schedule_id").
		Find(&overlappingEmployees).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch overlapping employees"})
		return
	}

	// Return the response with the overlapping employees and the tour schedule details
	c.JSON(http.StatusOK, gin.H{
		"tour_schedule":         tourSchedule,
		"overlapping_employees": overlappingEmployees,
	})
}
