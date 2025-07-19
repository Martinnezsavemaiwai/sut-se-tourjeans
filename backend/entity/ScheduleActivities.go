package entity

import (
	"time"

	"gorm.io/gorm"
)

type ScheduleActivities struct {
	gorm.Model
	Day         string      `valid:"required~Day is required"`
	Time	    time.Time   `valid:"required~Time is required"`

	ActivityID	uint        `valid:"required~ActivityID is required"`
	Activity	*Activities	`gorm:"foreignKey:ActivityID" valid:"-"`

	TourScheduleID 	uint    `valid:"required~TourScheduleID is required"`
	TourSchedule	*TourSchedules	`gorm:"foreignKey:TourScheduleID" valid:"-"`
}