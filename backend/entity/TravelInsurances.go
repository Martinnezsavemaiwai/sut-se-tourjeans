package entity

import "gorm.io/gorm"

type TravelInsurances struct {
	gorm.Model
	InsuranceName	string `valid:"required~InsuranceName is required"`
	Price			float32 `valid:"required~Price is required"`
	CoverageDetail	string `valid:"required~CoverageDetail is required"`

	ProviderID	uint
	Provider	*Providers	`gorm:"foreignKey:ProviderID"`

	PurchaseDetails	[]PurchaseDetails	`gorm:"foreignKey:TravelInsuranceID"`
}