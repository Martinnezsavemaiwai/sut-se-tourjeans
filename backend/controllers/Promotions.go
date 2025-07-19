package controllers

import (
	"errors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"net/http"
	"time"
	"toursystem/config"
	"toursystem/entity"
)

// GET /promotions
func ListPromotions(c *gin.Context) {
	var promotions []entity.Promotions

	db := config.DB()

	db.Find(&promotions)

	c.JSON(http.StatusOK, &promotions)
}

// GET /promotion/:code
func GetPromotionByCode(c *gin.Context) {
	var promotion entity.Promotions
	id := c.Param("code")

	db := config.DB()

	if err := db.First(&promotion, "promotion_code = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "tour package not found"})
		return
	}

	c.JSON(http.StatusOK, promotion)
}

// GET /promotionss
func ListPromotionss(c *gin.Context) {
	var promotions []entity.Promotions

	db := config.DB()

	if err := db.Preload("PromotionStatus").Find(&promotions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, &promotions)
}

// GET /active-promotions
func ListActivePromotions(c *gin.Context) {
	var promotions []entity.Promotions

	db := config.DB()

	// ค้นหาข้อมูลโปรโมชั่นที่มี promotion_status_id = 1 (เปิดใช้งาน)
	if err := db.Preload("PromotionStatus").Where("promotion_status_id = ?", 1).Find(&promotions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, &promotions)
}

// GET /promotions/:id
func GetPromotionsById(c *gin.Context) {
	var promotion entity.Promotions
	db := config.DB()

	// ดึง ID จาก context
	id := c.Param("id")

	// ค้นหาโปรโมชั่นตาม ID
	if err := db.Preload("PromotionStatus").First(&promotion, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Promotion not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, &promotion)
}

// POST /create-promotion
func CreatePromotion(c *gin.Context) {
	var promotion entity.Promotions
	db := config.DB()

	if err := c.ShouldBindJSON(&promotion); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid data", "message": err.Error()})
		return
	}

	// ตรวจสอบ promotion_code ซ้ำ
	var existingPromotion entity.Promotions
	if err := db.First(&existingPromotion, "promotion_code = ?", promotion.PromotionCode).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Promotion code already exists"})
		return
	} else if err != gorm.ErrRecordNotFound {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check promotion code", "message": err.Error()})
		return
	}

	promotion.ValidFrom = promotion.ValidFrom.UTC().Add(7 * time.Hour).Truncate(time.Second)
	promotion.ValidUntil = promotion.ValidUntil.UTC().Add(7 * time.Hour).Truncate(time.Second)

	if err := db.Create(&promotion).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create promotion", "message": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Promotion created successfully", "promotion": promotion.ID})
}

// PUT /update-promotion/:id
func UpdatePromotionById(c *gin.Context) {
	var promotion entity.Promotions

	id := c.Param("id")
	db := config.DB()

	if err := db.First(&promotion, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Promotion not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch promotion", "message": err.Error()})
		return
	}

	// Bind JSON body ไปยัง struct promotion เพื่ออัปเดตข้อมูล
	if err := c.ShouldBindJSON(&promotion); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid data", "message": err.Error()})
		return
	}

	if err := db.Save(&promotion).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update promotion", "message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Promotion updated successfully", "promotion": promotion.ID})
}

// DELETE /delete-promotion/:id
func DeletePromotionById(c *gin.Context) {

	id := c.Param("id")
	db := config.DB()

	// ค้นหาข้อมูลโปรโมชั่นที่ต้องการลบ
	var promotion entity.Promotions
	if err := db.First(&promotion, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Promotion not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch promotion", "message": err.Error()})
		return
	}

	if err := db.Delete(&promotion).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete promotion", "message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Promotion deleted successfully"})
}