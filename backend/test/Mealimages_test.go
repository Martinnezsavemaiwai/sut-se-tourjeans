package test

import (
	"testing"
	"toursystem/entity"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestMealImagesValidation(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("FilePath is required", func(t *testing.T) {
		mealImage := entity.MealImages{
			FilePath: "",
			MealID:   1,
		}

		ok, err := govalidator.ValidateStruct(mealImage)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("FilePath is required"))
	})

	t.Run("MealID is required", func(t *testing.T) {
		mealImage := entity.MealImages{
			FilePath: "images/meals/meal1/image1.jpg",
			MealID:   0,
		}

		ok, err := govalidator.ValidateStruct(mealImage)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("MealID is required"))
	})

	t.Run("Success case", func(t *testing.T) {
		mealImage := entity.MealImages{
			FilePath: "images/meals/meal1/image1.jpg",
			MealID:   1,
		}

		ok, err := govalidator.ValidateStruct(mealImage)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}
