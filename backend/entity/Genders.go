package entity

import "gorm.io/gorm"

type Genders struct {
	gorm.Model
	GenderName	string

	Customers	[]Customers	`gorm:"foreignKey:GenderID"`

	Employees	[]Employees	`gorm:"foreignKey:GenderID"`
}