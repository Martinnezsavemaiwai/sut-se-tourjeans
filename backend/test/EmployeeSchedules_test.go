package test

import (
	"testing"
	"toursystem/entity"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestEmployeeSchedulesValidation(t *testing.T) {
	g := NewGomegaWithT(t)

	// ตรวจสอบว่าต้องกรอก TourScheduleID
	t.Run("TourScheduleID is required", func(t *testing.T) {
		employeeSchedules := entity.EmployeeSchedules{
			TourScheduleID: 0, // ผิดตรงนี้
			EmployeeID:     1,
		}

		ok, err := govalidator.ValidateStruct(employeeSchedules)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("TourScheduleID is required"))
	})

	// ตรวจสอบว่าต้องกรอก EmployeeID
	t.Run("EmployeeID is required", func(t *testing.T) {
		employeeSchedules := entity.EmployeeSchedules{
			TourScheduleID: 1,
			EmployeeID:     0, // ผิดตรงนี้
		}

		ok, err := govalidator.ValidateStruct(employeeSchedules)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("EmployeeID is required"))
	})

	// กรณีข้อมูลถูกต้อง
	t.Run("valid EmployeeSchedules data", func(t *testing.T) {
		employeeSchedules := entity.EmployeeSchedules{
			TourScheduleID: 1,
			EmployeeID:     2,
		}

		ok, err := govalidator.ValidateStruct(employeeSchedules)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})

}
