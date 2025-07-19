package entity

import "gorm.io/gorm"

type MealImages struct {
	gorm.Model `valid:"-"` 
	FilePath   string      `valid:"required~FilePath is required"`
	MealID     uint        `valid:"required~MealID is required"`
	Meal       Meals       `gorm:"foreignKey:MealID" valid:"-"`
}
