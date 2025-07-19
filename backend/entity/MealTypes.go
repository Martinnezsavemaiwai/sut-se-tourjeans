package entity

import "gorm.io/gorm"

type MealTypes struct {
	gorm.Model `valid:"-"` 
	TypeName   string      `valid:"required~TypeName is required"`
	Meals      []Meals     `gorm:"foreignKey:MealTypeID" valid:"-"` 
}
