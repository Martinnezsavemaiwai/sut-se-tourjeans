package test

import (
	"testing"
	"toursystem/entity"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestTourPricesValidetion(t *testing.T) {

	g := NewGomegaWithT(t)

	t.Run(`TourPrices is valid`, func(t *testing.T) {
		tourprices := entity.TourPrices{
			Price:          4500,
			TourPackageID:  1,
			TourPackage: &entity.TourPackages{
				TourName:	 "แพ็กเกจทัวร์ทะเลระนอง: เปิดประสบการณ์สู่มนต์เสน่ห์แห่งอันดามันใต้",
	        	PackageCode: "T00001",
	        	Duration:	 "2 วัน 2 คืน",
			},
			PersonTypeID:	 2,
			PersonType: &entity.PersonTypes{
				TypeName:    "เด็ก (อายุ 4-12 ปี) หรือ ผู้ใหญ่",
			},
			RoomTypeID:      1,
			RoomType:  &entity.RoomTypes{
				TypeName:    "พักเดี่ยว",
			},
		}
		ok, err := govalidator.ValidateStruct(tourprices)
		g.Expect(ok).To(BeTrue()) 
		g.Expect(err).To(BeNil()) 
	})
}

func TestPrices(t *testing.T) {

	g := NewGomegaWithT(t)


	t.Run(`Price is required`, func(t *testing.T) {
		tourprices := entity.TourPrices{
			TourPackageID:  1,
			PersonTypeID:	2,
			RoomTypeID:     1,
		}
		ok, err := govalidator.ValidateStruct(tourprices)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("Price is required"))
	})

	t.Run(`Price must be greater than -1`, func(t *testing.T) {
		tourprices := entity.TourPrices{
			Price:          -1,  //ผิดตรงนี้
			TourPackageID:  1,
			PersonTypeID:	2,
			RoomTypeID:     1,
		}
		ok, err := govalidator.ValidateStruct(tourprices)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("Price must be greater than -1"))
	})
}