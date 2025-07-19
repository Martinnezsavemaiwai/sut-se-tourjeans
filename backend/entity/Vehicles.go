package entity

import "gorm.io/gorm"

type Vehicles struct {
	gorm.Model
	VehicleName   string `valid:"matches(^[A-Za-zก-๙].*)~VehicleName must not start with a number,required~VehicleName is required"`

	VehicleTypeID uint `valid:"required~VehicleTypeID is required"`
	VehicleType   VehicleTypes `gorm:"foreignKey:VehicleTypeID" valid:"-"`

	Transportations []Transportations `gorm:"foreignKey:VehicleID" valid:"-"`
}
