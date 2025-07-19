package test

import (
	"testing"
	"toursystem/entity"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestFilePath(t *testing.T) {
	InitCustomValidators()

	g := NewGomegaWithT(t)

	t.Run(`filepath is required`, func(t *testing.T) {
		slip := entity.Slips{
			FilePath:  "", // ผิดตรงนี้
			PaymentID: 1,
		}

		ok, err := govalidator.ValidateStruct(slip)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("FilePath is required"))
	})

	t.Run(`filepath is invalid`, func(t *testing.T) {
		slip := entity.Slips{
			FilePath:  "images/slips/cus/slip_payment1.jpg", // ผิดตรงนี้
			PaymentID: 1,
		}

		ok, err := govalidator.ValidateStruct(slip)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("FilePath must match the required format"))
	})

	t.Run(`filepath is valid`, func(t *testing.T) {
		slip := entity.Slips{
			FilePath:  "images/slips/customer1/slip_payment1.jpg", // ถูกต้อง
			PaymentID: 1,
		}

		ok, err := govalidator.ValidateStruct(slip)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}

func TestPaymentID(t *testing.T) {
	InitCustomValidators()

	g := NewGomegaWithT(t)

	t.Run(`payment_id is required`, func(t *testing.T) {
		slip := entity.Slips{
			FilePath:  "images/slips/customer1/slip_payment1.jpg",
			PaymentID: 0, // ผิดตรงนี้
		}

		ok, err := govalidator.ValidateStruct(slip)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("PaymentID is required"))
	})

	t.Run(`filepath is valid`, func(t *testing.T) {
		slip := entity.Slips{
			FilePath:  "images/slips/customer1/slip_payment1.jpg",
			PaymentID: 1, // ถูกต้อง
		}

		ok, err := govalidator.ValidateStruct(slip)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}
