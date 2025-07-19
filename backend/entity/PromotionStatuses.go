package entity

import "gorm.io/gorm"

type PromotionStatuses struct {
	gorm.Model
	StatusName	string

	Promotions	[]Promotions `gorm:"foreignKey:PromotionStatusID"`
}