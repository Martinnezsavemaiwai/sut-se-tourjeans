package controllers

import (
	"errors"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strconv"

	"toursystem/config"
	"toursystem/entity"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// POST /accommodations
func CreateAccommodation(c *gin.Context) {
	// เชื่อมต่อกับฐานข้อมูล
	db := config.DB()

	// รับข้อมูล Accommodation จากคําขอ
	var accommodation entity.Accommodations
	if err := c.ShouldBindJSON(&accommodation); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := db.First(&entity.Hotels{}, accommodation.HotelID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid HotelID"})
		return
	}

	if err := db.First(&entity.Meals{}, accommodation.Meals).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid MealID"})
		return
	}

	if err := db.First(&entity.TourPackages{}, accommodation.TourPackageID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid TourPackageID"})
		return
	}

	// บันทึก Accommodation ในฐานข้อมูล
	if err := db.Create(&accommodation).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create Accommodation"})
		return
	}

	// ส่งข้อมูล Accommodation กลับในรูป JSON
	c.JSON(http.StatusCreated, accommodation)
}

// GET /accommodations
func GetAccommodations(c *gin.Context) {
	// เชื่อมต่อกับฐานข้อมูล
	db := config.DB()
	// ดึงข้อมูล Accommodation พร้อมความสัมพันธ์
	var accommodations []entity.Accommodations
	if err := db.
		Preload("Meals.MealType").
		Preload("Hotel").
		Preload("TourPackage").
		Find(&accommodations).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	// ส่งข้อมูลกลับในรูป JSON
	c.JSON(http.StatusOK, accommodations)
}

// GET /accommodations/:id
func GetAccommodationByID(c *gin.Context) {
	id := c.Param("id")

	// ตรวจสอบความถูกต้องของ ID
	if _, err := strconv.Atoi(id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	// เชื่อมต่อกับฐานข้อมูล
	db := config.DB()

	// ดึงข้อมูล Accommodation พร้อมความสัมพันธ์
	var accommodation entity.Accommodations
	if err := db.Preload("Meals.MealType").
		Preload("Hotel").
		Preload("TourPackage").
		First(&accommodation, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Accommodation not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	// ส่งข้อมูลกลับในรูป JSON
	c.JSON(http.StatusOK, accommodation)
}

// PATH /accommodations/:id
func UpdateAccommodation(c *gin.Context) {
	id := c.Param("id")

	// ตรวจสอบความถูกต้องของ ID
	if _, err := strconv.Atoi(id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	// เชื่อมต่อกับฐานข้อมูล
	db := config.DB()

	// ดึงข้อมูล Accommodation
	var accommodation entity.Accommodations
	if err := db.First(&accommodation, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Accommodation not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	// รับข้อมูล Accommodation จากคําขอ
	if err := c.ShouldBindJSON(&accommodation); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// บันทึก Accommodation ในฐานข้อมูล
	if err := db.Save(&accommodation).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update Accommodation"})
		return
	}

	// ส่งข้อมูล Accommodation กลับในรูป JSON
	c.JSON(http.StatusOK, accommodation)
}

// DELETE /accommodations/:id
func DeleteAccommodation(c *gin.Context) {
	id := c.Param("id")

	// ตรวจสอบความถูกต้องของ ID
	if _, err := strconv.Atoi(id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	// เชื่อมต่อกับฐานข้อมูล
	db := config.DB()

	// ดึงข้อมูล Accommodation
	var accommodation entity.Accommodations
	if err := db.First(&accommodation, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Accommodation not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	// ดึง Meals ที่เกี่ยวข้องกับ TourPackageID
	var meals []entity.Meals
	if err := db.Where("accommodation_id  = ?", accommodation.ID).Find(&meals).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve related Meals"})
		return
	}

	// ลบรูปภาพและโฟลเดอร์ของ Meals
	for _, meal := range meals {
		var mealImages []entity.MealImages
		if err := db.Where("meal_id = ?", meal.ID).Find(&mealImages).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve Meal images"})
			return
		}

		for _, img := range mealImages {
			// ลบไฟล์รูปภาพ
			if err := os.Remove(img.FilePath); err != nil && !os.IsNotExist(err) {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete image file"})
				return
			}
		}

		// ลบโฟลเดอร์
		mealFolder := filepath.Join("images", "mealImages", fmt.Sprintf("meal%d", meal.ID))
		if err := os.RemoveAll(mealFolder); err != nil && !os.IsNotExist(err) {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete meal folder"})
			return
		}

		// ลบข้อมูล MealImages
		if err := db.Where("meal_id = ?", meal.ID).Delete(&entity.MealImages{}).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete Meal image records"})
			return
		}
	}

	// ลบ Meals
	if err := db.Where("accommodation_id = ?", accommodation.ID).Delete(&entity.Meals{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete related Meals"})
		return
	}

	// ลบ Accommodation จากฐานข้อมูล
	if err := db.Delete(&accommodation).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete Accommodation"})
		return
	}

	// ส่งข้อความสำเร็จ
	c.JSON(http.StatusOK, gin.H{"message": "Accommodation, related Meals, images, and folders deleted successfully"})
}
