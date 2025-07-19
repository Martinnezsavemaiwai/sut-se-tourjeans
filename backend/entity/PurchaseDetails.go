package entity

import "gorm.io/gorm"

type PurchaseDetails struct {
	gorm.Model
	Quantity   	int 	`valid:"required~Quantity is required,greaterzeroI~Quantity must be greater than 0"`
	TotalPrice	float32	`valid:"required~TotalPrice is required,greaterzeroF~TotalPrice must be greater than 0"`

	BookingID	uint		`valid:"required~BookingID is required"`
	Booking		Bookings	`gorm:"foreignKey:BookingID" valid:"-"`

	TravelInsuranceID	uint
	TravelInsurance	TravelInsurances	`gorm:"foreignKey:TravelInsuranceID" valid:"-"`

	InsuranceParticipants	[]InsuranceParticipants	`gorm:"foreignKey:PurchaseDetailID"`
}