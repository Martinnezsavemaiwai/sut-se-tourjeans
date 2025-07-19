package test

import (
	"testing"
	"toursystem/entity"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestQuantity(t *testing.T) {
	InitCustomValidators()

	g := NewGomegaWithT(t)

	t.Run(`quantity is required`, func(t *testing.T) {
		bkd := entity.BookingDetails{
			Quantity:    0, // ผิดตรงนี้
			TotalPrice:  1000,
			BookingID:   1,
			TourPriceID: 1,
		}

		ok, err := govalidator.ValidateStruct(bkd)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("Quantity is required"))
	})

	t.Run(`quantity must be greater than 0`, func(t *testing.T) {
		bkd := entity.BookingDetails{
			Quantity:    -5, // ผิดตรงนี้
			TotalPrice:  1000,
			BookingID:   1,
			TourPriceID: 1,
		}

		ok, err := govalidator.ValidateStruct(bkd)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("Quantity must be greater than 0"))
	})

	t.Run(`quantity is valid`, func(t *testing.T) {
		bkd := entity.BookingDetails{
			Quantity:    5, // ถูกต้อง
			TotalPrice:  1000,
			BookingID:   1,
			TourPriceID: 1,
		}

		ok, err := govalidator.ValidateStruct(bkd)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}

func TestTotalPriceInBookingDetail(t *testing.T) {
	InitCustomValidators()

	g := NewGomegaWithT(t)

	t.Run(`total price is required`, func(t *testing.T) {
		bkd := entity.BookingDetails{
			Quantity:    5,
			TotalPrice:  0, // ผิดตรงนี้
			BookingID:   1,
			TourPriceID: 1,
		}

		ok, err := govalidator.ValidateStruct(bkd)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("TotalPrice is required"))
	})

	t.Run(`total price must be greater than 0`, func(t *testing.T) {
		bkd := entity.BookingDetails{
			Quantity:    5,
			TotalPrice:  -1000, // ผิดตรงนี้
			BookingID:   1,
			TourPriceID: 1,
		}

		ok, err := govalidator.ValidateStruct(bkd)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("TotalPrice must be greater than 0"))
	})

	t.Run(`total price is valid`, func(t *testing.T) {
		bkd := entity.BookingDetails{
			Quantity:    5,
			TotalPrice:  1000, // ถูกต้อง
			BookingID:   1,
			TourPriceID: 1,
		}

		ok, err := govalidator.ValidateStruct(bkd)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}

func TestBookingIDInBookingDatail(t *testing.T) {
	InitCustomValidators()

	g := NewGomegaWithT(t)

	t.Run(`booking_id is required`, func(t *testing.T) {
		bkd := entity.BookingDetails{
			Quantity:    1,
			TotalPrice:  1000,
			BookingID:   0, // ผิดตรงนี้
			TourPriceID: 1,
		}

		ok, err := govalidator.ValidateStruct(bkd)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("BookingID is required"))
	})

	t.Run(`booking_id is valid`, func(t *testing.T) {
		bkd := entity.BookingDetails{
			Quantity:    5,
			TotalPrice:  1000,
			BookingID:   1, // ถูกต้อง
			TourPriceID: 1,
		}

		ok, err := govalidator.ValidateStruct(bkd)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}

func TestTourPriceID(t *testing.T) {
	InitCustomValidators()

	g := NewGomegaWithT(t)

	t.Run(`tour_price_id is required`, func(t *testing.T) {
		bkd := entity.BookingDetails{
			Quantity:    1,
			TotalPrice:  1000,
			BookingID:   1,
			TourPriceID: 0, // ผิดตรงนี้
		}

		ok, err := govalidator.ValidateStruct(bkd)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("TourPriceID is required"))
	})

	t.Run(`tour_price_id is valid`, func(t *testing.T) {
		bkd := entity.BookingDetails{
			Quantity:    5,
			TotalPrice:  1000,
			BookingID:   1,
			TourPriceID: 1, // ถูกต้อง
		}

		ok, err := govalidator.ValidateStruct(bkd)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}
