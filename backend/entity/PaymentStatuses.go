package entity

import "gorm.io/gorm"

type PaymentStatuses struct {
	gorm.Model
	StatusName	string

	Payments	[]Payments	`gorm:"foreignKey:PaymentStatusID"`
}