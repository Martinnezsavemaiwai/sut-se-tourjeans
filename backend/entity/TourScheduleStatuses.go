package entity

import "gorm.io/gorm"

type TourScheduleStatuses struct {
	gorm.Model
	StatusName	string  

	TourSchedules	[]TourSchedules	`gorm:"foreignKey:TourScheduleStatusID"`
}