package test

import (
	"testing"
	"toursystem/entity"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestVehicleImagesValidation(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("FilePath is required", func(t *testing.T) {
		vehicleImage := entity.VehicleImages{
			FilePath:  "", // Invalid: ไม่ได้กำหนด FilePath
			VehicleID: 1,
		}

		ok, err := govalidator.ValidateStruct(vehicleImage)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("FilePath is required"))
	})

	t.Run("FilePath invalid pattern", func(t *testing.T) {
		vehicleImage := entity.VehicleImages{
			FilePath:  "images/vehicleImages/vehicle3/vehicle01.pdf", // Invalid extension
			VehicleID: 1,
		}

		ok, err := govalidator.ValidateStruct(vehicleImage)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("FilePath must be a valid image path"))
	})

	t.Run("FilePath is valid", func(t *testing.T) {
		vehicleImage := entity.VehicleImages{
			FilePath:  "/images/vehicleImages/vehicle3/vehicle01.jpg", // Valid Path
			VehicleID: 1,
		}

		ok, err := govalidator.ValidateStruct(vehicleImage)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})

}
