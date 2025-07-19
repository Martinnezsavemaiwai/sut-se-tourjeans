package entity

import (
	"time"

	"gorm.io/gorm"
	"fmt"
)

type Promotions struct {
	gorm.Model
	PromotionName 	string		`valid:"required~PromotionName is required"`
	PromotionCode 	string 		`valid:"required~PromotionCode is required,matches(^P\\d+$)~PromotionCode must start with 'P' followed by numbers"`

	DiscountPercentage	float32 `valid:"required~DiscountPercentage is required,greaterzeroF~DiscountPercentage must be greater than 0"`
	ValidFrom	time.Time       `valid:"required~ValidFrom is required"`
	ValidUntil	time.Time       `valid:"required~ValidUntil is required"`
	MinimumPrice	float32		`valid:"required~MinimumPrice is required,greaterzeroF~MinimumPrice must be greater than -1"`

	PromotionStatusID	uint	`valid:"required~PromotionStatusID is required"`
	PromotionStatus		*PromotionStatuses	`gorm:"foreignKey:PromotionStatusID" valid:"-"`

	Bookings	[]Bookings	`gorm:"foreignKey:PromotionID"`
}

// ฟังก์ชัน Validate
func (ts *Promotions) Validate() error {
	if ts.ValidFrom.After(ts.ValidUntil) {
		return fmt.Errorf("ValidUntil must be after ValidFrom") 
	}
	return nil
}