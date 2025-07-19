package test

import (
	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
	"testing"
	"toursystem/entity"
)

func TestTourPackagesValidetion(t *testing.T) {

	g := NewGomegaWithT(t)

	t.Run(`TourPackages is valid`, func(t *testing.T) {
		packages := entity.TourPackages{
			TourName:    "แพ็กเกจทัวร์ทะเลระนอง: เปิดประสบการณ์สู่มนต์เสน่ห์แห่งอันดามันใต้",
			PackageCode: "T12345",
			Duration:    "2 วัน 2 คืน",
			ProvinceID:  1,
			Province: &entity.Provinces{
				ProvinceName: "กรุงเทพ",
			},
		}
		ok, err := govalidator.ValidateStruct(packages)
		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}

func TestTourName(t *testing.T) {

	g := NewGomegaWithT(t)

	t.Run(`tour_name is required`, func(t *testing.T) {
		packages := entity.TourPackages{
			TourName:    "", //ผิดตรงนี้
			PackageCode: "T12345",
			Duration:    "2 วัน 2 คืน",
			ProvinceID:  1,
		}
		ok, err := govalidator.ValidateStruct(packages)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("TourName is required"))
	})
}

func TestPackageCode(t *testing.T) {

	g := NewGomegaWithT(t)

	t.Run(`package_code is required`, func(t *testing.T) {
		packages := entity.TourPackages{
			TourName:    "แพ็กเกจทัวร์ทะเลระนอง: เปิดประสบการณ์สู่มนต์เสน่ห์แห่งอันดามันใต้",
			PackageCode: "", //ผิดตรงนี้
			Duration:    "2 วัน 2 คืน",
			ProvinceID:  1,
		}
		ok, err := govalidator.ValidateStruct(packages)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("PackageCode is required"))
	})

	t.Run(`package_code must start with 'T' and followed by numbers`, func(t *testing.T) {
		packages := entity.TourPackages{
			TourName:    "แพ็กเกจทัวร์ทะเลระนอง: เปิดประสบการณ์สู่มนต์เสน่ห์แห่งอันดามันใต้",
			PackageCode: "A12345",  //ผิดตรงนี้
			Duration:    "2 วัน 2 คืน",
			ProvinceID:  1,
		}
		ok, err := govalidator.ValidateStruct(packages)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("PackageCode must start with 'T' and followed by numbers"))
	})
}

func TestDuration(t *testing.T) {

	g := NewGomegaWithT(t)

	t.Run(`duration is required`, func(t *testing.T) {
		packages := entity.TourPackages{
			TourName:    "แพ็กเกจทัวร์ทะเลระนอง: เปิดประสบการณ์สู่มนต์เสน่ห์แห่งอันดามันใต้",
			PackageCode: "T12345",
			Duration:    "", //ผิดตรงนี้
			ProvinceID:  1,
		}
		ok, err := govalidator.ValidateStruct(packages)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("Duration is required"))
	})
}

func TestProvinceID(t *testing.T) {

	g := NewGomegaWithT(t)

	t.Run(`province_id is required`, func(t *testing.T) {
		packages := entity.TourPackages{
			TourName:    "แพ็กเกจทัวร์ทะเลระนอง: เปิดประสบการณ์สู่มนต์เสน่ห์แห่งอันดามันใต้",
			PackageCode: "T12345",
			Duration:    "2 วัน 2 คืน",
			ProvinceID:  0, //ผิดตรงนี้
		}
		ok, err := govalidator.ValidateStruct(packages)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("ProvinceID is required"))
	})
}
