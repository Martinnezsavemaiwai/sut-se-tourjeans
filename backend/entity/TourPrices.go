package entity

import "gorm.io/gorm"

type TourPrices struct {
	gorm.Model
	Price 	float32    `valid:"required~Price is required,greaterzeroF~Price must be greater than -1"`

	TourPackageID	uint          `valid:"required~TourPackageID is required"`
	TourPackage		*TourPackages	`gorm:"foreignKey:TourPackageID" valid:"-"`

	PersonTypeID	uint 		   `valid:"required~PersonTypeID is required"`
	PersonType		*PersonTypes		`gorm:"foreignKey:PersonTypeID" valid:"-"`

	RoomTypeID		uint        `valid:"required~RoomTypeID is required"`
	RoomType		*RoomTypes	`gorm:"foreignKey:RoomTypeID" valid:"-"`

	BookingDetails	[]BookingDetails	`gorm:"foreignKey:TourPriceID"`
}