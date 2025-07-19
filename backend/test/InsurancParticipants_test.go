package test

import (
	"testing"
	"toursystem/entity"
	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)


func TestInsuranceParticipants(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("IdCardNumber is required", func(t *testing.T) {
		participants := entity.InsuranceParticipants{
			IdCardNumber: "", // Invalid
			FirstName: "Patha",
			LastName: "Pond",
			Age: 20,
			PhoneNumber: "0629987910",
			Detail: "3 follower nick pea paul",
		}

		ok, err := govalidator.ValidateStruct(participants)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("IdCardNumber is required"))
	})


	t.Run("Firstname is required", func(t *testing.T) {
		participants := entity.InsuranceParticipants{
			IdCardNumber: "1309902981165", 
			FirstName: "",// Invalid
			LastName: "Pond",
			Age: 20,
			PhoneNumber: "0629987910",
			Detail: "3 follower nick pea paul",
		}

		ok, err := govalidator.ValidateStruct(participants)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("FirstName is required"))
	})

	t.Run("Lastname is required", func(t *testing.T) {
		participants := entity.InsuranceParticipants{
			IdCardNumber: "1309902981165", 
			FirstName: "Patha",
			LastName: "",// Invalid
			Age: 20,
			PhoneNumber: "0629987910",
			Detail: "3 follower nick pea paul",
		}

		ok, err := govalidator.ValidateStruct(participants)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("LastName is required"))
	})

	t.Run("Age is required", func(t *testing.T) {
		participants := entity.InsuranceParticipants{
			IdCardNumber: "1309902981165", 
			FirstName: "Patha",
			LastName: "Pond",
			Age: 0,// Invalid
			PhoneNumber: "0629987910",
			Detail: "3 follower nick pea paul",
		}

		ok, err := govalidator.ValidateStruct(participants)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("Age is required"))
	})

	t.Run("PhoneNumber is required", func(t *testing.T) {
		participants := entity.InsuranceParticipants{
			IdCardNumber: "1309902981165", 
			FirstName: "Patha",
			LastName: "Pond",
			Age: 20,
			PhoneNumber: "",// Invalid
			Detail: "3 follower nick pea paul",
		}

		ok, err := govalidator.ValidateStruct(participants)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("PhoneNumber is required"))
	})

	t.Run("PhoneNumber is required", func(t *testing.T) {
		participants := entity.InsuranceParticipants{
			IdCardNumber: "1309902981165", 
			FirstName: "Patha",
			LastName: "Pond",
			Age: 20,
			PhoneNumber: "0629987910",
			Detail: "",// Invalid
		}

		ok, err := govalidator.ValidateStruct(participants)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("Detail is required"))
	})

	t.Run("InsuranceParticipants is Valid", func(t *testing.T) {
		participants := entity.InsuranceParticipants{
			IdCardNumber: "1309902981165", 
			FirstName: "Patha",
			LastName: "Pond",
			Age: 20,
			PhoneNumber: "0629987910",
			Detail: "3 follower nick pea paul",
		}

		ok, err := govalidator.ValidateStruct(participants)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}