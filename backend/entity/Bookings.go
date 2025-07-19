package entity

import (
	"time"

	"gorm.io/gorm"
)

type Bookings struct {
	gorm.Model
	BookingDate		time.Time	`valid:"required~BookingDate is required"`
	TotalPrice		float32		`valid:"required~TotalPrice is required,greaterzeroF~TotalPrice must be greater than 0"`
	TotalQuantity 	int 		`valid:"required~TotalQuantity is required,greaterzeroI~TotalQuantity must be greater than 0"`
	SpecialRequest	string

	CustomerID		uint		`valid:"required~CustomerID is required"`
	Customer		Customers	`gorm:"foreignKey:CustomerID" valid:"-"`

	TourScheduleID 	uint		`valid:"required~TourScheduleID is required"`
	TourSchedule	TourSchedules	`gorm:"foreignKey:TourScheduleID" valid:"-"`

	BookingStatusID	uint			`valid:"required~BookingStatusID is required"`
	BookingStatus	BookingStatuses	`gorm:"foreignKey:BookingStatusID" valid:"-"`

	CancellationReasonID	*uint
	CancellationReason	CancellationReasons `gorm:"foreignKey:CancellationReasonID" valid:"-"`

	PromotionID		*uint
	Promotion		Promotions	`gorm:"foreignKey:PromotionID" valid:"-"`

	BookingDetails	[]BookingDetails	`gorm:"foreignKey:BookingID"`

	PurchaseDetails	[]PurchaseDetails	`gorm:"foreignKey:BookingID"`

	Payment		*Payments			`gorm:"foreignKey:BookingID"`
}