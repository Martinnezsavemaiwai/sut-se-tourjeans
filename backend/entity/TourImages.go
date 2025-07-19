package entity

import "gorm.io/gorm"

type TourImages struct {
	gorm.Model
	FilePath	string   `valid:"required~FilePath is required"`

	TourPackageID	uint  `valid:"required~TourPackageID is required"`
	TourPackage		*TourPackages	`gorm:"foreignKey:TourPackageID" valid:"-"`
}