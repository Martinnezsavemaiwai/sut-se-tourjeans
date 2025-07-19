package test

import (
	"testing"
	"time"
	"toursystem/entity"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestPaymentDate(t *testing.T) {
	InitCustomValidators()

	g := NewGomegaWithT(t)

	t.Run(`payment_date is required`, func(t *testing.T) {
		payment := entity.Payments{
			PaymentDate: time.Time{},	// ผิดตรงนี้
			Amount: 1000,
			EmployeeID: 1,
			BookingID: 1,
			PaymentStatusID: 1,
		}

		ok, err := govalidator.ValidateStruct(payment)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("PaymentDate is required"))
	})

	t.Run(`payment_date is valid`, func(t *testing.T) {
		payment := entity.Payments{
			PaymentDate: time.Now(),	// ถูกต้อง
			Amount: 1000,
			EmployeeID: 1,
			BookingID: 1,
			PaymentStatusID: 1,
		}

		ok, err := govalidator.ValidateStruct(payment)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}

func TestAmount(t *testing.T) {
	InitCustomValidators()

	g := NewGomegaWithT(t)

	t.Run(`amount is required`, func(t *testing.T) {
		payment := entity.Payments{
			PaymentDate: time.Now(),
			Amount: 0,	// ผิดตรงนี้
			EmployeeID: 1,
			BookingID: 1,
			PaymentStatusID: 1,
		}

		ok, err := govalidator.ValidateStruct(payment)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("Amount is required"))
	})

	t.Run(`amount must be greater than 0`, func(t *testing.T) {
		payment := entity.Payments{
			PaymentDate: time.Now(),
			Amount: -1000,	// ผิดตรงนี้
			EmployeeID: 1,
			BookingID: 1,
			PaymentStatusID: 1,
		}

		ok, err := govalidator.ValidateStruct(payment)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("Amount must be greater than 0"))
	})

	t.Run(`amount is valid`, func(t *testing.T) {
		payment := entity.Payments{
			PaymentDate: time.Now(),
			Amount: 1000,	// ถูกต้อง
			EmployeeID: 1,
			BookingID: 1,
			PaymentStatusID: 1,
		}

		ok, err := govalidator.ValidateStruct(payment)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}

func TestEmployeeID(t *testing.T) {
	InitCustomValidators()

	g := NewGomegaWithT(t)

	t.Run(`employee_id is required`, func(t *testing.T) {
		payment := entity.Payments{
			PaymentDate: time.Now(),
			Amount: 1000,
			EmployeeID: 0,	// ผิดตรงนี้
			BookingID: 1,
			PaymentStatusID: 1,
		}

		ok, err := govalidator.ValidateStruct(payment)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("EmployeeID is required"))
	})

	t.Run(`employee_id is valid`, func(t *testing.T) {
		payment := entity.Payments{
			PaymentDate: time.Now(),
			Amount: 1000,
			EmployeeID: 1,	// ถูกต้อง
			BookingID: 1,
			PaymentStatusID: 1,
		}

		ok, err := govalidator.ValidateStruct(payment)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}

func TestBookingIDInPayment(t *testing.T) {
	InitCustomValidators()

	g := NewGomegaWithT(t)

	t.Run(`booking_id is required`, func(t *testing.T) {
		payment := entity.Payments{
			PaymentDate: time.Now(),
			Amount: 1000,
			EmployeeID: 1,
			BookingID: 0,	// ผิดตรงนี้
			PaymentStatusID: 1,
		}

		ok, err := govalidator.ValidateStruct(payment)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("BookingID is required"))
	})

	t.Run(`booking_id is valid`, func(t *testing.T) {
		payment := entity.Payments{
			PaymentDate: time.Now(),
			Amount: 1000,
			EmployeeID: 1,
			BookingID: 1,	// ถูกต้อง
			PaymentStatusID: 1,
		}

		ok, err := govalidator.ValidateStruct(payment)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}

func TestPaymentStatusID(t *testing.T) {
	InitCustomValidators()

	g := NewGomegaWithT(t)

	t.Run(`booking_id is required`, func(t *testing.T) {
		payment := entity.Payments{
			PaymentDate: time.Now(),
			Amount: 1000,
			EmployeeID: 1,
			BookingID: 1,
			PaymentStatusID: 0,	// ผิดตรงนี้
		}

		ok, err := govalidator.ValidateStruct(payment)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("PaymentStatusID is required"))
	})

	t.Run(`booking_id is valid`, func(t *testing.T) {
		payment := entity.Payments{
			PaymentDate: time.Now(),
			Amount: 1000,
			EmployeeID: 1,
			BookingID: 1,
			PaymentStatusID: 1,	// ถูกต้อง
		}

		ok, err := govalidator.ValidateStruct(payment)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}