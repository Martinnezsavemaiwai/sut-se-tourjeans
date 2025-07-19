package test

import (
	"testing"
	"toursystem/entity"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestMealTypesValidation(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("TypeName is required", func(t *testing.T) {
		mealType := entity.MealTypes{
			TypeName: "",
		}

		ok, err := govalidator.ValidateStruct(mealType)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("TypeName is required"))
	})

	t.Run("Success case", func(t *testing.T) {
		mealType := entity.MealTypes{
			TypeName: "Breakfast",
		}

		ok, err := govalidator.ValidateStruct(mealType)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}
