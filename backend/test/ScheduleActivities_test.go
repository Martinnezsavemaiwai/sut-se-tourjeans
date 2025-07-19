package test

import (
	"testing"
	"toursystem/entity"
    "time"
	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestScheduleActivitiesValidetion(t *testing.T) {

	g := NewGomegaWithT(t)

	t.Run(`ScheduleActivities is valid`, func(t *testing.T) {
		sa := entity.ScheduleActivities{
			Day:            "1",
			Time:	        time.Now(),
			ActivityID:     1,
			Activity: &entity.Activities{
				ActivityName:	"เดินทางไปยังท่าเรือ",
			    Description:	"เดินทางไปยังท่าเรือเพื่อขึ้นเรือสปีดโบ๊ท มุ่งหน้าสู่ เกาะพยาม (ใช้เวลาประมาณ 45 นาที) เพลิดเพลินกับบรรยากาศทะเลสวยงามและทิวทัศน์ระหว่างการเดินทาง",
			},
			TourScheduleID: 1,
			TourSchedule: &entity.TourSchedules{
				StartDate:  time.Now(),
				EndDate:    time.Now(),		
				AvailableSlots:		50,
			},
		}
		ok, err := govalidator.ValidateStruct(sa)
		g.Expect(ok).To(BeTrue()) 
		g.Expect(err).To(BeNil()) 
	})
}

func TestDay(t *testing.T) {

	g := NewGomegaWithT(t)

	t.Run(`day is required`, func(t *testing.T) {
		sa := entity.ScheduleActivities{
			Day:            "", //ผิดตรงนี้
			Time:	        time.Date(2024, time.December, 28, 15, 30, 0, 0, time.UTC),   //time.Date(0000, time.January, 01, 15, 30, 0, 0, time.UTC),  time.Date(2024, time.December, 28, 15, 30, 0, 0, time.UTC),
			ActivityID:     1,
			TourScheduleID: 1,
		}
		ok, err := govalidator.ValidateStruct(sa)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("Day is required"))
	})
}