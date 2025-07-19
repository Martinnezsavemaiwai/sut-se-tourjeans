package test

import (
	"testing"
	"toursystem/entity"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestRolesValidation(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("RoleName is required", func(t *testing.T) {
		role := entity.Roles{
			RoleName: "", // ผิดตรงนี้
		}

		ok, err := govalidator.ValidateStruct(role)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("RoleName is required"))
	})
}
