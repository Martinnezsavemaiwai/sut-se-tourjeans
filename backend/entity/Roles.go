package entity

import "gorm.io/gorm"

type Roles struct {
	gorm.Model
	RoleName string `valid:"required~RoleName is required"`

	Employees	[]Employees `gorm:"foreignKey:RoleID"`
}