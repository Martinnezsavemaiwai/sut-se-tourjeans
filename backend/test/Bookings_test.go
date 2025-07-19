package test

import (
	"testing"
	"time"
	"toursystem/entity"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestBookingDate(t *testing.T) {
	InitCustomValidators()

	g := NewGomegaWithT(t)

	t.Run(`booking_date is required`, func(t *testing.T) {
		booking := entity.Bookings{
			BookingDate: time.Time{},	// ผิดตรงนี้
			TotalPrice: 1000,
			TotalQuantity: 5,
			CustomerID: 1,
			TourScheduleID: 1,
			BookingStatusID: 1,
		}

		ok, err := govalidator.ValidateStruct(booking)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("BookingDate is required"))
	})

	t.Run(`booking_date is valid`, func(t *testing.T) {
		booking := entity.Bookings{
			BookingDate: time.Now(),	// ถูกต้อง
			TotalPrice: 1000,
			TotalQuantity: 5,
			CustomerID: 1,
			TourScheduleID: 1,
			BookingStatusID: 1,
		}

		ok, err := govalidator.ValidateStruct(booking)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}

func TestTotalPrice(t *testing.T) {
	InitCustomValidators()

	g := NewGomegaWithT(t)

	t.Run(`total_price is required`, func(t *testing.T) {
		booking := entity.Bookings{
			BookingDate: time.Now(),
			TotalPrice: 0,	// ผิดตรงนี้
			TotalQuantity: 5,
			CustomerID: 1,
			TourScheduleID: 1,
			BookingStatusID: 1,
		}

		ok, err := govalidator.ValidateStruct(booking)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("TotalPrice is required"))
	})

	t.Run(`total_price must be greater than 0`, func(t *testing.T) {
		booking := entity.Bookings{
			BookingDate: time.Now(),
			TotalPrice: -1000,	// ผิดตรงนี้
			TotalQuantity: 5,
			CustomerID: 1,
			TourScheduleID: 1,
			BookingStatusID: 1,
		}

		ok, err := govalidator.ValidateStruct(booking)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("TotalPrice must be greater than 0"))
	})

	t.Run(`total_price is valid`, func(t *testing.T) {
		booking := entity.Bookings{
			BookingDate: time.Now(),
			TotalPrice: 1000,	// ถูกต้อง
			TotalQuantity: 5,
			CustomerID: 1,
			TourScheduleID: 1,
			BookingStatusID: 1,
		}

		ok, err := govalidator.ValidateStruct(booking)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}

func TestTotalQuantity(t *testing.T) {
	InitCustomValidators()

	g := NewGomegaWithT(t)

	t.Run(`total_quantity is required`, func(t *testing.T) {
		booking := entity.Bookings{
			BookingDate: time.Now(),
			TotalPrice: 1000,
			TotalQuantity: 0,	// ผิดตรงนี้
			CustomerID: 1,
			TourScheduleID: 1,
			BookingStatusID: 1,
		}

		ok, err := govalidator.ValidateStruct(booking)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("TotalQuantity is required"))
	})

	t.Run(`total_quantity must be greater than 0`, func(t *testing.T) {
		booking := entity.Bookings{
			BookingDate: time.Now(),
			TotalPrice: 1000,
			TotalQuantity: -5,	// ผิดตรงนี้
			CustomerID: 1,
			TourScheduleID: 1,
			BookingStatusID: 1,
		}

		ok, err := govalidator.ValidateStruct(booking)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("TotalQuantity must be greater than 0"))
	})

	t.Run(`total_quantity is valid`, func(t *testing.T) {
		booking := entity.Bookings{
			BookingDate: time.Now(),
			TotalPrice: 1000,
			TotalQuantity: 5,	// ถูกต้อง
			CustomerID: 1,
			TourScheduleID: 1,
			BookingStatusID: 1,
		}

		ok, err := govalidator.ValidateStruct(booking)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}

func TestCustomerID(t *testing.T) {
	InitCustomValidators()

	g := NewGomegaWithT(t)

	t.Run(`customer_id is required`, func(t *testing.T) {
		booking := entity.Bookings{
			BookingDate: time.Now(),	
			TotalPrice: 1000,
			TotalQuantity: 5,
			CustomerID: 0,	// ผิดตรงนี้
			TourScheduleID: 1,
			BookingStatusID: 1,
		}

		ok, err := govalidator.ValidateStruct(booking)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("CustomerID is required"))
	})

	t.Run(`customer_id is valid`, func(t *testing.T) {
		booking := entity.Bookings{
			BookingDate: time.Now(),
			TotalPrice: 1000,
			TotalQuantity: 5,
			CustomerID: 1,	// ถูกต้อง
			TourScheduleID: 1,
			BookingStatusID: 1,
		}

		ok, err := govalidator.ValidateStruct(booking)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}

func TestTourScheduleID(t *testing.T) {
	InitCustomValidators()

	g := NewGomegaWithT(t)

	t.Run(`tour_schedule_id is required`, func(t *testing.T) {
		booking := entity.Bookings{
			BookingDate: time.Now(),	
			TotalPrice: 1000,
			TotalQuantity: 5,
			CustomerID: 1,
			TourScheduleID: 0,	// ผิดตรงนี้
			BookingStatusID: 1,
		}

		ok, err := govalidator.ValidateStruct(booking)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("TourScheduleID is required"))
	})

	t.Run(`tour_schedule_id is valid`, func(t *testing.T) {
		booking := entity.Bookings{
			BookingDate: time.Now(),
			TotalPrice: 1000,
			TotalQuantity: 5,
			CustomerID: 1,
			TourScheduleID: 1,	// ถูกต้อง
			BookingStatusID: 1,
		}

		ok, err := govalidator.ValidateStruct(booking)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}

func TestBookingStatusID(t *testing.T) {
	InitCustomValidators()

	g := NewGomegaWithT(t)

	t.Run(`booking_status_id is required`, func(t *testing.T) {
		booking := entity.Bookings{
			BookingDate: time.Now(),	
			TotalPrice: 1000,
			TotalQuantity: 5,
			CustomerID: 1,
			TourScheduleID: 1,
			BookingStatusID: 0,	// ผิดตรงนี้
		}

		ok, err := govalidator.ValidateStruct(booking)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("BookingStatusID is required"))
	})

	t.Run(`booking_status_id is valid`, func(t *testing.T) {
		booking := entity.Bookings{
			BookingDate: time.Now(),
			TotalPrice: 1000,
			TotalQuantity: 5,
			CustomerID: 1,
			TourScheduleID: 1,
			BookingStatusID: 1,	// ถูกต้อง
		}

		ok, err := govalidator.ValidateStruct(booking)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}