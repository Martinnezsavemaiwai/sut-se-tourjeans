package entity

import "gorm.io/gorm"

type TourDescriptions struct {
	gorm.Model
	Intro	string	`valid:"required~Intro is required"`
	PackageDetail	string	`valid:"required~PackageDetail is required"`
	TripHighlight	string	`valid:"required~TripHighlight is required"`
	PlacesHighlight	string	`valid:"required~PlacesHighlight is required"`

	TourPackageID	uint	`valid:"required~TourPackageID is required"`
	TourPackage    *TourPackages `gorm:"foreignKey:TourPackageID" valid:"-"`
}