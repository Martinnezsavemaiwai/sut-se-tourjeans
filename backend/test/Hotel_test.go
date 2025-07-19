package test

import (
	"testing"
	"toursystem/entity"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestHotelsValidation(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("HotelName is required", func(t *testing.T) {
		hotel := entity.Hotels{
			HotelName: "",
		}

		ok, err := govalidator.ValidateStruct(hotel)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("HotelName is required"))
	})

	t.Run("Success case", func(t *testing.T) {
		hotel := entity.Hotels{
			HotelName: "Paradise Hotel",
		}

		ok, err := govalidator.ValidateStruct(hotel)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}
