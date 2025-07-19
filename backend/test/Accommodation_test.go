package test

import (
	"testing"
	"time"
	"toursystem/entity"

	. "github.com/onsi/gomega"
)

func TestCheckInandCheckOutDate(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("CheckInDate is required", func(t *testing.T) {
		accommodation := entity.Accommodations{
			CheckInDate:   time.Time{},
			CheckOutDate:  time.Now(),
			TourPackageID: 1,
			HotelID:       1,
		}

		ok, err := entity.ValidateAccommodation(&accommodation)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("CheckInDate is required"))
	})

	t.Run("CheckInDate must be before CheckOutDate", func(t *testing.T) {
		accommodation := entity.Accommodations{
			CheckInDate:   time.Now().Add(2 * time.Hour),
			CheckOutDate:  time.Now(),
			TourPackageID: 1,
			HotelID:       1,
		}

		ok, err := entity.ValidateAccommodation(&accommodation)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("CheckInDate must be before CheckOutDate"))
	})

	t.Run("CheckOutDate is required", func(t *testing.T) {
		accommodation := entity.Accommodations{
			CheckInDate:   time.Now(),
			CheckOutDate:  time.Time{},
			TourPackageID: 1,
			HotelID:       1,
		}

		ok, err := entity.ValidateAccommodation(&accommodation)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("CheckOutDate is required"))
	})

	t.Run("Success case", func(t *testing.T) {
		accommodation := entity.Accommodations{
			CheckInDate:   time.Now(),
			CheckOutDate:  time.Now().Add(2 * time.Hour),
			TourPackageID: 1,
			HotelID:       1,
		}

		ok, err := entity.ValidateAccommodation(&accommodation)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}
