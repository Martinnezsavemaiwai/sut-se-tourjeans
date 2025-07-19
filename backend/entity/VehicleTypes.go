package entity

import "gorm.io/gorm"

type VehicleTypes struct {
	gorm.Model
	TypeName	string `valid:"required~VehicleTypeName is required,type(string)"`

	Vehicles	[]Vehicles `gorm:"foreignKey:VehicleTypeID" valid:"-"`
}