package entity

import "gorm.io/gorm"

type CancellationReasons struct {
	gorm.Model
	Reason	string

	Bookings	[]Bookings	`gorm:"foreignKey:CancellationReasonID"`
}