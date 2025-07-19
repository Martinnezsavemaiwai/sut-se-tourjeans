package entity

import "gorm.io/gorm"

type Hotels struct {
	gorm.Model
	HotelName string `valid:"required~HotelName is required"`

	Accommodations []Accommodations `gorm:"foreignKey:HotelID"`

	HotelImages []HotelImages `gorm:"foreignKey:HotelID"`

}