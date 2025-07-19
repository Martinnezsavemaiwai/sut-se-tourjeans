package test

import (
	"fmt"
	"testing"
	"toursystem/entity"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestValidateVehicleType(t *testing.T) {
	g := NewWithT(t)

	t.Run("TypeName is required", func(t *testing.T) {
		vehicleType := entity.VehicleTypes{
			TypeName: "", // Invalid
		}

		ok, err := govalidator.ValidateStruct(vehicleType)

		fmt.Println("Validation result:", ok)
		if err != nil {
			fmt.Println("Validation error:", err.Error())
		}

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("VehicleTypeName is required"))
	})

	t.Run("TypeName is valid", func(t *testing.T) {
		vehicleType := entity.VehicleTypes{
			TypeName: "Car", // Valid
		}
	
		ok, err := govalidator.ValidateStruct(vehicleType)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})

	t.Run("TypeName contains invalid characters", func(t *testing.T) {
		vehicleType := entity.VehicleTypes{
			TypeName: "Car123", // Valid
		}
	
		ok, err := govalidator.ValidateStruct(vehicleType)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
	
	
}
