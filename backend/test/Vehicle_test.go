package test

import (
	"testing"
	"toursystem/entity"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestVehiclesValidation(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("VehicleName must not start with a number", func(t *testing.T) {
		vehicle := entity.Vehicles{
			VehicleName:   "1รถบัส", // ชื่อยานพาหนะไม่ควรเริ่มต้นด้วยตัวเลขหรือสัญลักษณ์พิเศษ
			VehicleTypeID: 1,
		}

		ok, err := govalidator.ValidateStruct(vehicle)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("VehicleName must not start with a number"))
	})

	t.Run("VehicleName is required", func(t *testing.T) {
		vehicle := entity.Vehicles{
			VehicleName:   "", // ชื่อยานพาหนะต้องไม่ว่าง
			VehicleTypeID: 1,
		}

		ok, err := govalidator.ValidateStruct(vehicle)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("VehicleName is required"))
	})

	t.Run("VehicleTypeID is required", func(t *testing.T) {
		vehicle := entity.Vehicles{
			VehicleName:   "รถบัส",
			VehicleTypeID: 0, // VehicleTypeID ต้องไม่เป็น 0
		}

		ok, err := govalidator.ValidateStruct(vehicle)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("VehicleTypeID is required"))
	})

	t.Run("Success case", func(t *testing.T) {
		vehicle := entity.Vehicles{
			VehicleName:   "รถบัส", // ชื่อยานพาหนะถูกต้อง
			VehicleTypeID: 1,       // VehicleTypeID ถูกต้อง
		}

		ok, err := govalidator.ValidateStruct(vehicle)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}
