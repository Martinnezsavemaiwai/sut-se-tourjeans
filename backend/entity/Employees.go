package entity

import "gorm.io/gorm"

type Employees struct {
	gorm.Model
	UserName    string `valid:"required~UserName is required"`
	FirstName   string `valid:"required~FirstName is required"`
	LastName    string `valid:"required~LastName is required"`
	Email       string `valid:"required~Email is required,email~Email: %s does not validate as email"`
	Password    string `valid:"required~Password is required"`
	PhoneNumber string `valid:"required~PhoneNumber is required,stringlength(10|10)~PhoneNumber must be exactly 10 digits"`
	ProfilePath string `gorm:"type:longtext" valid:"required~ProfilePath is required"`

	GenderID	uint	`valid:"required~GenderID is required"`
	Gender		Genders	`gorm:"foreignKey:GenderID" valid:"-"`

	RoleID uint `valid:"required~RoleID is required"`
	Role   Roles `gorm:"foreignKey:RoleID" valid:"-"`

	EmployeeSchedules []EmployeeSchedules `gorm:"foreignKey:EmployeeID"`

	Payments []Payments `gorm:"foreignKey:EmployeeID"`
}
