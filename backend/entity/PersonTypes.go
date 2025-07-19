package entity

import "gorm.io/gorm"

type PersonTypes struct {
	gorm.Model
	TypeName	string
	
	TourPrices		[]TourPrices `gorm:"foreignKey:PersonTypeID"`
}