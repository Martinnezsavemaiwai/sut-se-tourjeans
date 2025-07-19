package entity

import "gorm.io/gorm"

type VehicleImages struct {
	gorm.Model
	FilePath string `valid:"required~FilePath is required,matches(.*\\.(jpg|jpeg|png)$)~FilePath must be a valid image path"`
	VehicleID uint 	`valid:"required~VehicleID is required"`
	Vehicle Vehicles `gorm:"foreignKey:VehicleID" valid:"-"`
}