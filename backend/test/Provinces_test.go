package test

import (
	"testing"
	"toursystem/entity"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestProvincesValidation(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("ProvinceName must not start with a number", func(t *testing.T) {
		province := entity.Provinces{
			ProvinceName: "1สกลนคร",
		}

		ok, err := govalidator.ValidateStruct(province)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("ProvinceName must not start with a number"))
	})

	t.Run("ProvinceName is required", func(t *testing.T) {
		province := entity.Provinces{
			ProvinceName: "",
		}

		ok, err := govalidator.ValidateStruct(province)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("ProvinceName is required"))
	})

	t.Run("Success case", func(t *testing.T) {
		province := entity.Provinces{
			ProvinceName: "สกลนคร",
		}

		ok, err := govalidator.ValidateStruct(province)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}
