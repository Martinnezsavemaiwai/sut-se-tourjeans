package test

import (
	"testing"
	"time"
	"toursystem/entity"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestTransportationsValidation(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("DepartureTime must be before ArrivalTime", func(t *testing.T) {
		transportation := entity.Transportations{
			DepartureTime: time.Now().Add(2 * time.Hour),
			ArrivalTime:   time.Now(),
			VehicleID:     1,
			TourPackageID: 1,
			LocationID:    1,
		}

		ok, err := entity.ValidateTransportations(&transportation)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("DepartureTime must be before ArrivalTime"))
	})

	t.Run("Success case", func(t *testing.T) {
		transportation := entity.Transportations{
			DepartureTime: time.Now(),
			ArrivalTime:   time.Now().Add(2 * time.Hour),
			VehicleID:     1,
			TourPackageID: 1,
			LocationID:    1,
		}

		ok, err := entity.ValidateTransportations(&transportation)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}

func TestTransportationsID(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("VehicleID is required", func(t *testing.T) {
		transportation := entity.Transportations{
			DepartureTime: time.Now().Add(1 * time.Hour),
			ArrivalTime:   time.Now().Add(2 * time.Hour),
			TourPackageID: 1,
			LocationID:    1,
			VehicleID:     0,
		}

		ok, err := govalidator.ValidateStruct(transportation)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("VehicleID is required"))
	})

	t.Run("TourPackageID is required", func(t *testing.T) {
		transportation := entity.Transportations{
			DepartureTime: time.Now().Add(1 * time.Hour),
			ArrivalTime:   time.Now().Add(2 * time.Hour),
			VehicleID:     1,
			LocationID:    1,
			TourPackageID: 0,
		}

		ok, err := govalidator.ValidateStruct(transportation)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("TourPackageID is required"))
	})

	t.Run("LocationID is required", func(t *testing.T) {
		transportation := entity.Transportations{
			DepartureTime: time.Now().Add(1 * time.Hour),
			ArrivalTime:   time.Now().Add(2 * time.Hour),
			VehicleID:     1,
			TourPackageID: 1,
			LocationID:    0,
		}

		ok, err := govalidator.ValidateStruct(transportation)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("LocationID is required"))
	})

	t.Run("Success case", func(t *testing.T) {
		transportation := entity.Transportations{
			DepartureTime: time.Now().Add(1 * time.Hour),
			ArrivalTime:   time.Now().Add(2 * time.Hour),
			VehicleID:     1,
			TourPackageID: 1,
			LocationID:    1,
		}

		ok, err := entity.ValidateTransportations(&transportation)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}
