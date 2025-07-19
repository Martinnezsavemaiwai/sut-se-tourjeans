package test

import (
	"fmt"
	"testing"
	"toursystem/entity"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestLocationsValidation(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("LocationName must not start with a number", func(t *testing.T) {
		location := entity.Locations{
			LocationName: "1บางแสน",
			ProvinceID:   1,
		}

		ok, err := govalidator.ValidateStruct(location)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("LocationName must not start with a number"))
	})

	t.Run("LocationName is required", func(t *testing.T) {
		location := entity.Locations{
			LocationName: "",
			ProvinceID:   1,
		}

		ok, err := govalidator.ValidateStruct(location)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("LocationName is required"))
	})

	t.Run("ProvinceID is required", func(t *testing.T) {
		location := entity.Locations{
			LocationName: "บางแสน",
			ProvinceID:   0,
		}

		ok, err := govalidator.ValidateStruct(location)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("ProvinceID is required"))
	})

	t.Run("Success case", func(t *testing.T) {
		location := entity.Locations{
			LocationName: "บางแสน",
			ProvinceID:   1,
		}

		ok, err := govalidator.ValidateStruct(location)
		fmt.Println("Validation Result:", ok)
		fmt.Println("Validation Error:", err)
		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}
