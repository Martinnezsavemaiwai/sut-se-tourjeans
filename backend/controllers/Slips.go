package controllers

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"path"
	"strconv"
	"toursystem/config"
	"toursystem/entity"

	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
)

func createFolderIfNotExist(folderPath string) {
	if _, err := os.Stat(folderPath); os.IsNotExist(err) {
		err := os.MkdirAll(folderPath, os.ModePerm)
		if err != nil {
			log.Fatalf("ไม่สามารถสร้างโฟลเดอร์ %s: %v", folderPath, err)
		}
	}
}

// POST /slip
func CreateSlip(c *gin.Context) {
	// รับ customerID และ paymentID จาก form-data
	customerIDStr := c.PostForm("customerID")
	paymentIDStr := c.PostForm("paymentID")
	paymentID, err2 := strconv.ParseUint(paymentIDStr, 10, 32)

	if customerIDStr == "" || err2 != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "กรุณาระบุ customerID และ paymentID"})
		return
	}

	db := config.DB()

	// รับไฟล์จากฟอร์ม
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่พบไฟล์"})
		return
	}

	// สร้างโฟลเดอร์ customerXX ถ้ายังไม่มี
	customerFolder := fmt.Sprintf("images/slips/customer%s", customerIDStr)
	createFolderIfNotExist(customerFolder)

	// ตั้งชื่อไฟล์ใหม่
	newFileName := fmt.Sprintf("slip_payment%s.jpg", paymentIDStr)
	filePath := path.Join(customerFolder, newFileName)

	// บันทึกไฟล์ลงในโฟลเดอร์
	if err := c.SaveUploadedFile(file, filePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถบันทึกไฟล์ได้"})
		return
	}

	// บันทึก path ลงในฐานข้อมูล
	slip := entity.Slips{
		FilePath:  filePath,
		PaymentID: uint(paymentID),
	}

	if ok, err := govalidator.ValidateStruct(&slip); !ok {
		c.JSON(http.StatusBadRequest, gin.H{"validation_error": err.Error()})
		return
	}

	if err := db.FirstOrCreate(&slip, &entity.Slips{
		PaymentID: slip.PaymentID,
	}).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "อัพโหลดสำเร็จ", "slip": slip})
}