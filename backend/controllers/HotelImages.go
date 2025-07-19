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

// GET /hotelimages
func GetHotelImages(c *gin.Context) {

	var hotelImages []entity.HotelImages

	db := config.DB()

	if err := db.Find(&hotelImages).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusOK, hotelImages)
}

// GET /hotelimages/:hotelid
func GetHotelImageByID(c *gin.Context) {

	hotelID := c.Param("hotelid")

	var hotelImage []entity.HotelImages

	db := config.DB()

	if err := db.Find(&hotelImage, "hotel_id = ?", hotelID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Hotel image not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusOK, hotelImage)
}

func createImageHotels(db *gorm.DB, filePath string, hotelID uint) error {
    image := entity.HotelImages{FilePath: filePath, HotelID: hotelID}

    // บันทึกข้อมูลโดยไม่เช็คเงื่อนไขซ้ำซ้อน
    if err := db.Create(&image).Error; err != nil {
        return err
    }
    return nil
}


// POST /hotelimages/:hotelid
func CreateHotelImage(c *gin.Context) {

	hotelImageID, err := strconv.ParseUint(c.Param("hotelid"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid hotel ID"})
		return
	}

	db := config.DB()

	form, err := c.MultipartForm()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No files received"})
		return
	}

	files := form.File["hotelimage"]
	if len(files) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No image files provided"})
		return
	}

	// ลบรูปภาพเก่า
	var existingImages []entity.HotelImages
	if err := db.Where("hotel_id = ?", hotelImageID).Find(&existingImages).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Hotel images not found"})
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
		subfolder := fmt.Sprintf("hotel%d", hotelImageID)
		fileName := fmt.Sprintf("hotel0%d%s", i+1, filepath.Ext(file.Filename))
		filePath := filepath.Join("images", "hotelImages", subfolder, fileName)

		err = os.MkdirAll(filepath.Join("images", "hotelImages", subfolder), os.ModePerm)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create directory"})
			return
		}

		if err := c.SaveUploadedFile(file, filePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
			return
		}

		if err := createImageHotels(db, filePath, uint(hotelImageID)); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image record"})
			return
		}
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Files created successfully"})
}