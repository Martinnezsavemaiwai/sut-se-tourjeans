package test

import (
	"testing"
	"toursystem/entity"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestMealsValidation(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("MenusDetail is required", func(t *testing.T) {
		meals := entity.Meals{
			MenusDetail:     "",
			MealTypeID:      1,
			AccommodationID: 1,
		}

		ok, err := govalidator.ValidateStruct(meals)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("MenusDetail is required"))
	})

	t.Run("MealTypeID is required", func(t *testing.T) {
		meals := entity.Meals{
			MenusDetail:     "Grilled Chicken",
			MealTypeID:      0,
			AccommodationID: 1,
		}

		ok, err := govalidator.ValidateStruct(meals)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("MealTypeID is required"))
	})

	t.Run("AccommodationID is required", func(t *testing.T) {
		meals := entity.Meals{
			MenusDetail:     "Grilled Chicken",
			MealTypeID:      1,
			AccommodationID: 0,
		}

		ok, err := govalidator.ValidateStruct(meals)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("AccommodationID is required"))
	})

	t.Run("Success case", func(t *testing.T) {
		meals := entity.Meals{
			MenusDetail:     "Grilled Chicken",
			MealTypeID:      1,
			AccommodationID: 1,
		}

		ok, err := govalidator.ValidateStruct(meals)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}
