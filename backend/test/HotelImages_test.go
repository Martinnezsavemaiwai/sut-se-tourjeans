package test

import (
	"testing"
	"toursystem/entity"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestHotelImagesValidation(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("FilePath is required", func(t *testing.T) {
		hotelImage := entity.HotelImages{
			FilePath: "",
			HotelID:  1,
		}

		ok, err := govalidator.ValidateStruct(hotelImage)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("FilePath is required"))
	})

	t.Run("HotelID is required", func(t *testing.T) {
		hotelImage := entity.HotelImages{
			FilePath: "images/hotelImages/hotel1/hotel02.jpg",
			HotelID:  0,
		}

		ok, err := govalidator.ValidateStruct(hotelImage)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("HotelID is required"))
	})

	t.Run("Success case", func(t *testing.T) {
		hotelImage := entity.HotelImages{
			FilePath: "images/hotelImages/hotel1/hotel02.jpg",
			HotelID:  1,
		}

		ok, err := govalidator.ValidateStruct(hotelImage)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}
