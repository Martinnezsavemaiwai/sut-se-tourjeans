package entity

import (
	"fmt"
	"time"
	"gorm.io/gorm"
)

type Transportations struct {
	gorm.Model
	DepartureTime time.Time `valid:"required~DepartureTime is required"`
	ArrivalTime   time.Time `valid:"required~ArrivalTime is required"`

	VehicleID     uint      `valid:"required~VehicleID is required"`
	Vehicle       Vehicles  `gorm:"foreignKey:VehicleID" valid:"-"`

	TourPackageID uint       `valid:"required~TourPackageID is required"`
	TourPackage   TourPackages `gorm:"foreignKey:TourPackageID" valid:"-"`

	LocationID    uint      `valid:"required~LocationID is required"`
	Location      Locations `gorm:"foreignKey:LocationID" valid:"-"`
}

func ValidateTransportations(transportation *Transportations) (bool, error) {
	if transportation.DepartureTime.IsZero() {
		return false, fmt.Errorf("DepartureTime is required")
	}

	if transportation.ArrivalTime.IsZero() {
		return false, fmt.Errorf("ArrivalTime is required")
	}

	if !transportation.DepartureTime.Before(transportation.ArrivalTime) {
		return false, fmt.Errorf("DepartureTime must be before ArrivalTime")
	}

	if transportation.VehicleID == 0 {
		return false, fmt.Errorf("VehicleID is required")
	}
	if transportation.TourPackageID == 0 {
		return false, fmt.Errorf("TourPackageID is required")
	}

	if transportation.LocationID == 0 {
		return false, fmt.Errorf("LocationID is required")
	}

	return true, nil
}
