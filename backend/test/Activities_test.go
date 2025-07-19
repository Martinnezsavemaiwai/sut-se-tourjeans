package test

import (
	"testing"
	"toursystem/entity"
	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestActivities(t *testing.T) {

	g := NewGomegaWithT(t)

	t.Run(`Activities is valid`, func(t *testing.T) {
		ac := entity.Activities{
			ActivityName:	"เดินทางไปยังท่าเรือ",
			Description:	"เดินทางไปยังท่าเรือเพื่อขึ้นเรือสปีดโบ๊ท มุ่งหน้าสู่ เกาะพยาม (ใช้เวลาประมาณ 45 นาที) เพลิดเพลินกับบรรยากาศทะเลสวยงามและทิวทัศน์ระหว่างการเดินทาง",
			LocationID:   	 1,
			Location: &entity.Locations{
				LocationName: "วัดเกาะพยาม",
			},
		}
		ok, err := govalidator.ValidateStruct(ac)
		g.Expect(ok).To(BeTrue()) 
		g.Expect(err).To(BeNil()) 
	})
}

func TestActivityName(t *testing.T) {

	g := NewGomegaWithT(t)

	t.Run(`activity_name is required`, func(t *testing.T) {
		ac := entity.Activities{
			ActivityName:	"",  //ผิดตรงนี้
			Description:	"เดินทางไปยังท่าเรือเพื่อขึ้นเรือสปีดโบ๊ท มุ่งหน้าสู่ เกาะพยาม (ใช้เวลาประมาณ 45 นาที) เพลิดเพลินกับบรรยากาศทะเลสวยงามและทิวทัศน์ระหว่างการเดินทาง",
			LocationID:   	1,
		}
		ok, err := govalidator.ValidateStruct(ac)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("ActivityName is required"))
	})
}

func TestLocationID(t *testing.T) {

	g := NewGomegaWithT(t)

	t.Run(`location_id is required`, func(t *testing.T) {
		ac := entity.Activities{
			ActivityName:	"เดินทางไปยังท่าเรือ",  
			Description:	"เดินทางไปยังท่าเรือเพื่อขึ้นเรือสปีดโบ๊ท มุ่งหน้าสู่ เกาะพยาม (ใช้เวลาประมาณ 45 นาที) เพลิดเพลินกับบรรยากาศทะเลสวยงามและทิวทัศน์ระหว่างการเดินทาง",
			LocationID:   	0,  //ผิดตรงนี้
		}
		ok, err := govalidator.ValidateStruct(ac)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("LocationID is required"))
	})
}