package test

import (
	"testing"
	"toursystem/entity"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)


func TestProviders(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("ProviderName is required", func(t *testing.T) {
		providerName := entity.Providers{
			ProviderName: "", // Invalid
			LogoPath: "/image",
		}

		ok, err := govalidator.ValidateStruct(providerName)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("ProviderName is required"))
	})


	t.Run("LogoPath is required", func(t *testing.T) {
		providerName := entity.Providers{
			ProviderName: "เมืองไทยประกันชีวิต", 
			LogoPath: "", // Invalid
		}

		ok, err := govalidator.ValidateStruct(providerName)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("LogoPath is required"))
	})

	t.Run("Provider is valid", func(t *testing.T) {
		providerName := entity.Providers{
			ProviderName: "เมืองไทยปลอดภัย", // Valid
			LogoPath: "/image", //Valid
		}

		ok, err := govalidator.ValidateStruct(providerName)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}