package test

import (
	"testing"
	"toursystem/entity"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestTourImagesValidetion(t *testing.T) {

	g := NewGomegaWithT(t)

	t.Run(`TourImages is valid`, func(t *testing.T) {
		tourImage := entity.TourImages{
			FilePath:      "/images/vehicleImages/vehicle3/vehicle01.jpg",
			TourPackageID: 1,
			TourPackage: &entity.TourPackages{
				TourName:    "แพ็กเกจทัวร์ทะเลระนอง: เปิดประสบการณ์สู่มนต์เสน่ห์แห่งอันดามันใต้",
				PackageCode: "T00001",
				Duration:    "2 วัน 2 คืน",
			},
		}
		ok, err := govalidator.ValidateStruct(tourImage)
		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}

func TestTourImagesValidation(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("FilePath is required", func(t *testing.T) {
		tourImage := entity.TourImages{
			FilePath:      "", // Invalid: ไม่ได้กำหนด FilePath
			TourPackageID: 1,
		}
		ok, err := govalidator.ValidateStruct(tourImage)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("FilePath is required"))
	})
}
