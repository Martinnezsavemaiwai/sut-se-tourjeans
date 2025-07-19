package test

import (
	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
	"testing"
	"time"
	"toursystem/entity"
)

func TestPromotionsValidetion(t *testing.T) {
	InitCustomValidators()

	g := NewGomegaWithT(t)

	t.Run(`Promotions is valid`, func(t *testing.T) {
		promotion := entity.Promotions{
			PromotionName:      "ส่วนลด 5% เมื่อซื้อแพ็กเกจครบ 5,000 บาท",
			PromotionCode:      "P12345",
			DiscountPercentage: 5,
			ValidFrom:          time.Now(),
			ValidUntil:         time.Now().AddDate(0, 0, 2),
			MinimumPrice:       5000,
			PromotionStatusID:  1,
			PromotionStatus: &entity.PromotionStatuses{
				StatusName: "เปิดใช้งาน",
			},
		}
		ok, err := govalidator.ValidateStruct(promotion)
		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}

func TestPromotionName(t *testing.T) {

	g := NewGomegaWithT(t)

	t.Run(`promotion_name is required`, func(t *testing.T) {
		promotion := entity.Promotions{
			PromotionName:      "", //ผิดตรงนี้
			PromotionCode:      "P12345",
			DiscountPercentage: 5,
			ValidFrom:          time.Now(),
			ValidUntil:         time.Now().AddDate(0, 0, 2),
			MinimumPrice:       5000,
			PromotionStatusID:  1,
		}
		ok, err := govalidator.ValidateStruct(promotion)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("PromotionName is required"))
	})
}

func TestPromotionCode(t *testing.T) {

	g := NewGomegaWithT(t)

	t.Run(`promotion_code is required`, func(t *testing.T) {
		promotion := entity.Promotions{
			PromotionName:      "ส่วนลด 5% เมื่อซื้อแพ็กเกจครบ 5,000 บาท",
			PromotionCode:      "", //ผิดตรงนี้
			DiscountPercentage: 5,
			ValidFrom:          time.Now(),
			ValidUntil:         time.Now().AddDate(0, 0, 2),
			MinimumPrice:       5000,
			PromotionStatusID:  1,
		}
		ok, err := govalidator.ValidateStruct(promotion)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("PromotionCode is required"))
	})

	t.Run(`promotion_code must start with 'P' and followed by numbers`, func(t *testing.T) {
		promotion := entity.Promotions{
			PromotionName:      "ส่วนลด 5% เมื่อซื้อแพ็กเกจครบ 5,000 บาท",
			PromotionCode:      "A12345", //ผิดตรงนี้
			DiscountPercentage: 5,
			ValidFrom:          time.Now(),
			ValidUntil:         time.Now().AddDate(0, 0, 2),
			MinimumPrice:       5000,
			PromotionStatusID:  1,
		}
		ok, err := govalidator.ValidateStruct(promotion)
		g.Expect(ok).NotTo(BeTrue())  
		g.Expect(err).NotTo(BeNil())  
		g.Expect(err.Error()).To(Equal("PromotionCode must start with 'P' followed by numbers"))
	})
}

func TestDiscountPercentage(t *testing.T) {

	g := NewGomegaWithT(t)

	t.Run(`discountPercentage is required`, func(t *testing.T) {
		promotion := entity.Promotions{
			PromotionName:      "ส่วนลด 5% เมื่อซื้อแพ็กเกจครบ 5,000 บาท",
			PromotionCode:      "P12345",
			DiscountPercentage: 0, //ผิดตรงนี้
			ValidFrom:          time.Now(),
			ValidUntil:         time.Now().AddDate(0, 0, 2),
			MinimumPrice:       5000,
			PromotionStatusID:  1,
		}
		ok, err := govalidator.ValidateStruct(promotion)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("DiscountPercentage is required"))
	})
}

func TestValidFrom(t *testing.T) {

	g := NewGomegaWithT(t)

	t.Run(`valid_from is required`, func(t *testing.T) {
		promotion := entity.Promotions{
			PromotionName:      "ส่วนลด 5% เมื่อซื้อแพ็กเกจครบ 5,000 บาท",
			PromotionCode:      "P12345",
			DiscountPercentage: 5,
			ValidFrom:          time.Time{}, // Invalid: zero time
			ValidUntil:         time.Now().AddDate(0, 0, 2),
			MinimumPrice:       5000,
			PromotionStatusID:  1,
		}
		ok, err := govalidator.ValidateStruct(promotion)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("ValidFrom is required"))
	})
}

func TestValidUntil(t *testing.T) {

	g := NewGomegaWithT(t)

	t.Run(`valid_until is required`, func(t *testing.T) {
		promotion := entity.Promotions{
			PromotionName:      "ส่วนลด 5% เมื่อซื้อแพ็กเกจครบ 5,000 บาท",
			PromotionCode:      "P12345",
			DiscountPercentage: 5,
			ValidFrom:          time.Now(),
			ValidUntil:         time.Time{}, // Invalid: zero time
			MinimumPrice:       5000,
			PromotionStatusID:  1,
		}
		ok, err := govalidator.ValidateStruct(promotion)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("ValidUntil is required"))
	})
}

func TestMinimumPrice(t *testing.T) {

	g := NewGomegaWithT(t)

	t.Run(`minimum_price is required`, func(t *testing.T) {
		promotion := entity.Promotions{
			PromotionName:      "ส่วนลด 5% เมื่อซื้อแพ็กเกจครบ 5,000 บาท",
			PromotionCode:      "P12345",
			DiscountPercentage: 5,
			ValidFrom:          time.Now(),
			ValidUntil:         time.Now().AddDate(0, 0, 2),

			PromotionStatusID: 1,
		}
		ok, err := govalidator.ValidateStruct(promotion)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("MinimumPrice is required"))
	})

	t.Run(`MinimumPrice must be greater than -1`, func(t *testing.T) {
		promotion := entity.Promotions{
			PromotionName:      "ส่วนลด 5% เมื่อซื้อแพ็กเกจครบ 5,000 บาท",
			PromotionCode:      "P12345",
			DiscountPercentage: 5,
			ValidFrom:          time.Now(),
			ValidUntil:         time.Now().AddDate(0, 0, 2),
			MinimumPrice:       -1, //ผิดตรงนี้
			PromotionStatusID:  1,
		}
		ok, err := govalidator.ValidateStruct(promotion)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("MinimumPrice must be greater than -1"))
	})
}

func TestValidUntilMustBeAfterValidFrom(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`ValidUntil must be after ValidFrom`, func(t *testing.T) {
		promotion := entity.Promotions{
			PromotionName:      "ส่วนลด 5% เมื่อซื้อแพ็กเกจครบ 5,000 บาท",
			PromotionCode:      "P12345",
			DiscountPercentage: 5,
			ValidFrom:          time.Now(),
			ValidUntil:         time.Now().AddDate(0, 0, -3), // ValidUntil น้อยกว่า ValidFrom (ไม่ถูกต้อง)
			MinimumPrice:       5000,
			PromotionStatusID:  1,
		}
		// ใช้ custom validation
		err := promotion.Validate()

		g.Expect(err).NotTo(BeNil()) // ต้องมีข้อผิดพลาด
		g.Expect(err.Error()).To(Equal("ValidUntil must be after ValidFrom"))
	})
}
