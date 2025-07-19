package entity

import "gorm.io/gorm"

type Locations struct {
	gorm.Model `valid:"-"`
	LocationName string `valid:"matches(^[A-Za-zก-๙].*)~LocationName must not start with a number,required~LocationName is required"`

	ProvinceID uint `valid:"required~ProvinceID is required"`
	Province   Provinces `gorm:"foreignKey:ProvinceID" valid:"-"`

	Activities  []Activities   `gorm:"foreignKey:LocationID" valid:"-"`
	Transportations []Transportations `gorm:"foreignKey:LocationID" valid:"-"`
}
