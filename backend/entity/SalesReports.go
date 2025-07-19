package entity

import (
	"time"

	"gorm.io/gorm"
)

type SalesReports struct {
	gorm.Model
	ReportName	string `valid:"required~ReportName is required"`
	Data		string 
	Date 		time.Time `valid:"required~Date is required"`
	Total_sales int `valid:"required~Total_sales is required"`
	Total_revenue float32 `valid:"required~Total_revenue is required"`

	Payments	[]Payments	`gorm:"foreignKey:SalesReportID"`
}