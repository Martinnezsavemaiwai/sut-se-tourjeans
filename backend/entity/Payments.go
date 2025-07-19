package entity

import (
	"time"

	"gorm.io/gorm"
)

type Payments struct {
	gorm.Model
	PaymentDate		time.Time	`valid:"required~PaymentDate is required"`
	Amount			float32		`valid:"required~Amount is required,greaterzeroF~Amount must be greater than 0"`
	Note			*string

	EmployeeID		uint		`valid:"required~EmployeeID is required"`
	Employee		Employees	`gorm:"foreignKey:EmployeeID" valid:"-"`

	BookingID		uint		`valid:"required~BookingID is required"`
	Booking			Bookings	`gorm:"foreignKey:BookingID" valid:"-"`

	PaymentStatusID	uint		`valid:"required~PaymentStatusID is required"`
	PaymentStatus	PaymentStatuses	`gorm:"foreignKey:PaymentStatusID" valid:"-"`

	SalesReportID	*uint
	SalesReport		SalesReports	`gorm:"foreignKey:SalesReportID" valid:"-"`

	Slip	*Slips	`gorm:"foreignKey:PaymentID"`
}