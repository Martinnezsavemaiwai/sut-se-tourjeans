package controllers

import (
	"errors"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"toursystem/config"
	"toursystem/entity"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// GET /mealimages
func GetMealImages(c *gin.Context) {
	db := config.DB()

	var mealImages []entity.MealImages

	if err := db.Find(&mealImages).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusOK, mealImages)
}

// GET /mealimages/:id
func GetMealImageByID(c *gin.Context) {
	mealID := c.Param("mealid")

	var mealImage []entity.MealImages

	db := config.DB()

	if err := db.Find(&mealImage,"meal_id =?", mealID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Meal image not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusOK, mealImage)
}

// POST /mealimages
func createImageMeals(db *gorm.DB, filePath string, mealID uint) error {
    image := entity.MealImages{FilePath: filePath, MealID: mealID}

    // บันทึกข้อมูลโดยไม่เช็คเงื่อนไขซ้ำซ้อน
    if err := db.Create(&image).Error; err != nil {
        return err
    }
    return nil
}


func CreateMealImage(c *gin.Context) {

	mealImageID, err := strconv.ParseUint(c.Param("mealid"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid meal ID"})
		return
	}

	db := config.DB()

	form, err := c.MultipartForm()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No files received"})
		return
	}

	files := form.File["mealimage"]
	if len(files) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No image files provided"})
		return
	}

	// ลบรูปภาพเก่า
	var existingImages []entity.MealImages
	if err := db.Where("meal_id = ?", mealImageID).Find(&existingImages).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Meal images not found"})
		return
	}

	for _, img := range existingImages {
		if err := os.Remove(img.FilePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete old image"})
			return
		}
		if err := db.Delete(&img).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete image record"})
			return
		}
	}

	// บันทึกรูปภาพใหม่
	for i, file := range files {
		subfolder := fmt.Sprintf("meal%d", mealImageID)
		fileName := fmt.Sprintf("meal0%d%s", i+1, filepath.Ext(file.Filename))
		filePath := filepath.Join("images", "mealImages", subfolder, fileName)

		err = os.MkdirAll(filepath.Join("images", "mealImages", subfolder), os.ModePerm)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create directory"})
			return
		}

		if err := c.SaveUploadedFile(file, filePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
			return
		}

		if err := createImageMeals(db, filePath, uint(mealImageID)); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image record"})
			return
		}
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Files created successfully"})
}
