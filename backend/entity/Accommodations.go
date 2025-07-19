package entity

import (
	"fmt"
	"time"

	"gorm.io/gorm"
)

type Accommodations struct {
	gorm.Model
	CheckInDate   time.Time `valid:"required~CheckInDate is required"`
	CheckOutDate  time.Time `valid:"required~CheckOutDate is required"`
	TourPackageID uint      `valid:"required~TourPackageID is required"`
	TourPackage   TourPackages `gorm:"foreignKey:TourPackageID"`
	HotelID       uint         `valid:"required~HotelID is required"`
	Hotel         Hotels       `gorm:"foreignKey:HotelID"`
	Meals         []Meals      `gorm:"foreignKey:AccommodationID"`
}

func ValidateAccommodation(accommodation *Accommodations) (bool, error) {
	if accommodation.CheckInDate.IsZero() {
		return false, fmt.Errorf("CheckInDate is required")
	}

	if accommodation.CheckOutDate.IsZero() {
		return false, fmt.Errorf("CheckOutDate is required")
	}

	if !accommodation.CheckInDate.Before(accommodation.CheckOutDate) {
		return false, fmt.Errorf("CheckInDate must be before CheckOutDate")
	}

	return true, nil
}