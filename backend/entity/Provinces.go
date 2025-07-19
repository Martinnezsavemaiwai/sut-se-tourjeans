package entity

import "gorm.io/gorm"

type Provinces struct {
	gorm.Model
	ProvinceName string `valid:"matches(^[A-Za-zก-๙].*)~ProvinceName must not start with a number,required~ProvinceName is required"`

	TourPackages []TourPackages `gorm:"foreignKey:ProvinceID" valid:"-"`
	Locations    []Locations    `gorm:"foreignKey:ProvinceID" valid:"-"`
}
