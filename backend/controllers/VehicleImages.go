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

// GET /vehicleimages
func GetVehicleImages(c *gin.Context) {

	var vehicleImages []entity.VehicleImages

	db := config.DB()

	if err := db.Find(&vehicleImages).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusOK, vehicleImages)
}

// GET /vehicleimages/:vehicleid
func GetVehicleImageByID(c *gin.Context) {

	vehicleID := c.Param("vehicleid")

	var vehicleImage []entity.VehicleImages

	db := config.DB()

	if err := db.Preload("Vehicle").Find(&vehicleImage,"vehicle_id =?", vehicleID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Vehicle image not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusOK, vehicleImage)
}

func createImageVehicle(db *gorm.DB, filePath string, vehicleID uint) error {
    image := entity.VehicleImages{FilePath: filePath, VehicleID: vehicleID}

    // บันทึกข้อมูลโดยไม่เช็คเงื่อนไขซ้ำซ้อน
    if err := db.Create(&image).Error; err != nil {
        return err
    }
    return nil
}

// POST /vehicleimages
func CreateVehicleImage(c *gin.Context) {
	vehicleImageID, err := strconv.ParseUint(c.Param("vehicleid"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid vehicle ID"})
		return
	}

	db := config.DB()

	form, err := c.MultipartForm()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No files received"})
		return
	}

	files := form.File["vehicleimage"]
	if len(files) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No image files provided"})
		return
	}

	// ลบรูปภาพเก่า
	var existingImages []entity.VehicleImages
	if err := db.Where("vehicle_id = ?", vehicleImageID).Find(&existingImages).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Vehicle images not found"})
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
		subfolder := fmt.Sprintf("vehicle%d", vehicleImageID)
		fileName := fmt.Sprintf("vehicle0%d%s", i+1, filepath.Ext(file.Filename))
		filePath := filepath.Join("images", "vehicleImages", subfolder, fileName)

		err = os.MkdirAll(filepath.Join("images", "vehicleImages", subfolder), os.ModePerm)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create directory"})
			return
		}

		if err := c.SaveUploadedFile(file, filePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
			return
		}

		if err := createImageVehicle(db, filePath, uint(vehicleImageID)); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image record"})
			return
		}
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Files updated successfully"})
}