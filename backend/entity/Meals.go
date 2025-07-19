package entity

import "gorm.io/gorm"

type Meals struct {
    gorm.Model `valid:"-"` 
    MenusDetail   string           `valid:"required~MenusDetail is required"`
    MealTypeID    uint             `valid:"required~MealTypeID is required"`
    MealType      MealTypes        `gorm:"foreignKey:MealTypeID" valid:"-"` 
    MealImages    []MealImages     `gorm:"foreignKey:MealID" valid:"-"`    
    AccommodationID uint           `valid:"required~AccommodationID is required"`
    Accommodation Accommodations   `gorm:"foreignKey:AccommodationID" valid:"-"` 
}
