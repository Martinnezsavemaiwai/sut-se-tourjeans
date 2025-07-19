package entity

import (
	"time"
	"fmt"
	"gorm.io/gorm"
)

type TourSchedules struct {
	gorm.Model
	StartDate	time.Time         `valid:"required~StartDate is required"`
	EndDate		time.Time         `valid:"required~EndDate is required"`
	AvailableSlots	int           `valid:"required~AvailableSlots is required,greaterzeroI~AvailableSlots must be greater than 0"`

	TourPackageID	uint          `valid:"required~TourPackageID is required"`
	TourPackage		*TourPackages `gorm:"foreignKey:TourPackageID" valid:"-"`

	TourScheduleStatusID	uint   `valid:"required~TourScheduleStatusID is required"`
	TourScheduleStatus	*TourScheduleStatuses	`gorm:"foreignKey:TourScheduleStatusID" valid:"-"`

	EmployeeSchedules	[]EmployeeSchedules	`gorm:"foreignKey:TourScheduleID"`

	Bookings	[]Bookings	`gorm:"foreignKey:TourScheduleID"`

	ScheduleActivities	[]ScheduleActivities	`gorm:"foreignKey:TourScheduleID"`
}

// ฟังก์ชัน Validate 
func (ts *TourSchedules) Validate() error {
	if ts.StartDate.After(ts.EndDate) {
		return fmt.Errorf("EndDate must be after StartDate")
	}
	return nil
}