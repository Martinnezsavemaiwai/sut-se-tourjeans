package entity

import "gorm.io/gorm"

type Slips struct {
	gorm.Model
	FilePath 	string 		`valid:"filePathFormat~FilePath must match the required format,required~FilePath is required"`
	
	PaymentID	uint		`valid:"required~PaymentID is required"`
	Payment		Payments	`gorm:"foreignKey:PaymentID" valid:"-"`
}