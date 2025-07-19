package entity

import (
	"gorm.io/gorm"
)

type EmployeeSchedules struct {
	gorm.Model
	TourScheduleID uint       `valid:"required~TourScheduleID is required"`
	EmployeeID     uint       `valid:"required~EmployeeID is required"`
	TourSchedule   TourSchedules `gorm:"foreignKey:TourScheduleID" valid:"-"`
	Employee       Employees     `gorm:"foreignKey:EmployeeID" valid:"-"`
}
