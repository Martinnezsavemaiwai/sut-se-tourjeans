package entity

import "gorm.io/gorm"

type Customers struct {
	gorm.Model
	UserName 	string	`valid:"required~UserName is required"`
	FirstName 	string	`valid:"required~FirstName is required"`
	LastName	string	`valid:"required~LastName is required"`
	Email		string	`valid:"required~Email is required, email~Email is invalid"`
	Password	string	
	PhoneNumber	string	`valid:"required~PhoneNumber is required, matches(^\\d{3}-\\d{3}-\\d{4}$)~Invalid PhoneNumber format"`
	ProfilePath	string

	GenderID	uint	`valid:"required~GenderID is required"`
	Gender		Genders	`gorm:"foreignKey:GenderID" valid:"-"`

	Bookings	[]Bookings	`gorm:"foreignKey:CustomerID"`
}