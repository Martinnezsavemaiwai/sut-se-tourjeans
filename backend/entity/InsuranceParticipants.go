package entity

import "gorm.io/gorm"

type InsuranceParticipants struct {
	gorm.Model
	IdCardNumber	string `valid:"required~IdCardNumber is required"`
	FirstName		string `valid:"required~FirstName is required"`
	LastName		string `valid:"required~LastName is required"`
	Age				int `valid:"required~Age is required"`
	PhoneNumber		string `valid:"required~PhoneNumber is required"`
	Detail          string `valid:"required~Detail is required"`

	PurchaseDetailID	uint
	PurchaseDetail	PurchaseDetails	`gorm:"foreignKey:PurchaseDetailID" valid:"-"`
}