package entity

import "gorm.io/gorm"

type Providers struct {
	gorm.Model
	ProviderName	string `valid:"required~ ProviderName is required"`
	LogoPath		string `valid:"required~ LogoPath is required"`

	TravelInsurances   []TravelInsurances `gorm:"foreignKey:ProviderID"`
}