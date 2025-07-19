package test

import (
	"testing"
	"toursystem/entity"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)


func TestTravelinsurances(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("InsuranceName is required", func(t *testing.T) {
		travelinsurance := entity.TravelInsurances{
			InsuranceName: "", // Invalid
			Price: 1000,
			CoverageDetail: "chilling insurance",
		}

		ok, err := govalidator.ValidateStruct(travelinsurance)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("InsuranceName is required"))
	})


	t.Run("Price is required", func(t *testing.T) {
		travelinsurance := entity.TravelInsurances{
			InsuranceName: "ระดับทองแดง", 
			Price: 0, // Invalid
			CoverageDetail: "chilling insurance",
			Provider: &entity.Providers{
				ProviderName: "กรุงศรี",
				LogoPath: "/image",
			},
		}

		ok, err := govalidator.ValidateStruct(travelinsurance)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("Price is required"))
	})

	t.Run("CoverageDetail is required", func(t *testing.T) {
		travelinsurance := entity.TravelInsurances{
			InsuranceName: "ระดับทองแดง", 
			Price: 1000, 
			CoverageDetail: "", // Invalid
			Provider: &entity.Providers{
				ProviderName: "กรุงศรี",
				LogoPath: "/image",
			},
		}

		ok, err := govalidator.ValidateStruct(travelinsurance)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("CoverageDetail is required"))
	})

	t.Run("TravelInsurance is valid", func(t *testing.T) {
		travelinsurance := entity.TravelInsurances{
			InsuranceName: "ระดับทองแดง", 
			Price: 1000, 
			CoverageDetail: "chilling coverage",
			Provider: &entity.Providers{
				ProviderName: "กรุงศรี",
				LogoPath: "/image",
			},
		}

		ok, err := govalidator.ValidateStruct(travelinsurance)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}