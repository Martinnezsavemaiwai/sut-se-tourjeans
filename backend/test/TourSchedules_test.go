package test

import (
	"fmt"
	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
	"testing"
	"time"
	"toursystem/entity"
)

func TestTourSchedulesValidetion(t *testing.T) {
	InitCustomValidators()

	g := NewGomegaWithT(t)

	t.Run(`TourSchedules is valid`, func(t *testing.T) {
		tschedules := entity.TourSchedules{
			StartDate:      time.Now(),
			EndDate:        time.Now().AddDate(0, 0, 2),
			AvailableSlots: 50,
			TourPackageID:  1,
			TourPackage: &entity.TourPackages{
				TourName:    "แพ็กเกจทัวร์ทะเลระนอง: เปิดประสบการณ์สู่มนต์เสน่ห์แห่งอันดามันใต้",
				PackageCode: "T00001",
				Duration:    "2 วัน 2 คืน",
			},
			TourScheduleStatusID: 2,
			TourScheduleStatus: &entity.TourScheduleStatuses{
				StatusName: "ยังไม่เต็ม",
			},
		}
		ok, err := govalidator.ValidateStruct(tschedules)
		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}

func TestStartDate(t *testing.T) {

	g := NewGomegaWithT(t)

	t.Run(`start_date is required`, func(t *testing.T) {
		tschedules := entity.TourSchedules{
			StartDate:            time.Time{}, // Invalid: zero time
			EndDate:              time.Now().AddDate(0, 0, 2),
			AvailableSlots:       50,
			TourPackageID:        1,
			TourScheduleStatusID: 2,
		}
		ok, err := govalidator.ValidateStruct(tschedules)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("StartDate is required"))
	})
}

func TestEndDate(t *testing.T) {

	g := NewGomegaWithT(t)

	t.Run(`end_date is required`, func(t *testing.T) {
		tschedules := entity.TourSchedules{
			StartDate:            time.Now(),
			EndDate:              time.Time{}, // Invalid: zero time
			AvailableSlots:       50,
			TourPackageID:        1,
			TourScheduleStatusID: 2,
		}
		ok, err := govalidator.ValidateStruct(tschedules)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("EndDate is required"))
	})
}

func TestEndDateMustBeAfterStartDate(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("EndDate must be after StartDate", func(t *testing.T) {
		tschedules := entity.TourSchedules{
			StartDate:            time.Now().AddDate(0, 0, 5),
			EndDate:              time.Now().AddDate(0, 0, 3), // EndDate น้อยกว่า StartDate (ไม่ถูกต้อง)
			AvailableSlots:       50,
			TourPackageID:        1,
			TourScheduleStatusID: 2,
		}
		// เรียกใช้ custom validation
		err := tschedules.Validate()
		g.Expect(err).NotTo(BeNil()) // ต้องมีข้อผิดพลาด
		g.Expect(err.Error()).To(Equal("EndDate must be after StartDate"))
	})
}

func TestAvailableSlots(t *testing.T) {

	g := NewGomegaWithT(t)

	t.Run(`available_slots is required`, func(t *testing.T) {
		tschedules := entity.TourSchedules{
			StartDate: time.Now(),
			EndDate:   time.Now().AddDate(0, 0, 2),

			TourPackageID:        1,
			TourScheduleStatusID: 2,
		}
		ok, err := govalidator.ValidateStruct(tschedules)
		if err != nil {
			fmt.Println("Validation error:", err.Error())
		}
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("AvailableSlots is required"))
	})

	t.Run(`AvailableSlots must be greater than 0`, func(t *testing.T) {
		tschedules := entity.TourSchedules{
			StartDate:            time.Now(),
			EndDate:              time.Now().AddDate(0, 0, 2),
			AvailableSlots:       -1, //ผิดตรงนี้
			TourPackageID:        1,
			TourScheduleStatusID: 2,
		}
		ok, err := govalidator.ValidateStruct(tschedules)
		if err != nil {
			fmt.Println("Validation error:", err.Error())
		}
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("AvailableSlots must be greater than 0"))
	})

}
