package entity

import (
	"gorm.io/gorm"
)

type HotelImages struct {
	gorm.Model `valid:"-"`
	FilePath string `valid:"required~FilePath is required"`
	HotelID  uint   `valid:"required~HotelID is required"`
	Hotel Hotels `gorm:"foreignKey:HotelID" valid:"-"`
}