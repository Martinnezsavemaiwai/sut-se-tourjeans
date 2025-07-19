package entity

import "gorm.io/gorm"

type BookingStatuses struct {
	gorm.Model
	StatusName	string

	Bookings	[]Bookings	`gorm:"foreignKey:BookingStatusID"`
}