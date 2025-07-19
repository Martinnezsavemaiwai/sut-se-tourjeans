package entity

import "gorm.io/gorm"

type RoomTypes struct {
	gorm.Model
	TypeName	string

	TourPrices		[]TourPrices	`gorm:"foreignKey:RoomTypeID"`
}