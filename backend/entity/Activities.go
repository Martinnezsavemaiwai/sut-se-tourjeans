package entity

import (
	"gorm.io/gorm"
)

type Activities struct {
	gorm.Model
	ActivityName	string	`valid:"required~ActivityName is required"`
	Description		string  

	LocationID   	uint    `valid:"required~LocationID is required"`
    Location    	*Locations   `gorm:"foreignKey:LocationID" valid:"-"`

	ScheduleActivities	[]ScheduleActivities	`gorm:"foreignKey:ActivityID"`
}