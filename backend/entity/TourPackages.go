package entity

import (
	"gorm.io/gorm"
)

type TourPackages struct {
	gorm.Model
	TourName	string	`valid:"required~TourName is required"`
	PackageCode string  `valid:"required~PackageCode is required,matches(^T\\d+$)~PackageCode must start with 'T' and followed by numbers"`

	Duration	string	`valid:"required~Duration is required"`

	ProvinceID	uint	`valid:"required~ProvinceID is required"`
	Province	*Provinces	`gorm:"foreignKey:ProvinceID" valid:"-"`

	TourPrices	[]TourPrices	`gorm:"foreignKey:TourPackageID"`

	TourSchedules	[]TourSchedules	`gorm:"foreignKey:TourPackageID"`

	TourImages	[]TourImages	`gorm:"foreignKey:TourPackageID"`

	Transportations	[]Transportations	`gorm:"foreignKey:TourPackageID"`

	Accommodations	[]Accommodations	`gorm:"foreignKey:TourPackageID"`

	TourDescriptions	*TourDescriptions	`gorm:"foreignKey:TourPackageID"`

}