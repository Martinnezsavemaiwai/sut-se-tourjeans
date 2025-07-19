package test

import (
	"fmt"
	"testing"
	"toursystem/entity"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestEmployeesValidation(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`username is required`, func(t *testing.T) {
		employee := entity.Employees{
			UserName:    "", // ผิดตรงนี้
			FirstName:   "John",
			LastName:    "Doe",
			Email:       "johndoe@gmail.com",
			Password:    "securepassword",
			PhoneNumber: "0801234567",
			ProfilePath: "swad",
			RoleID:      1,
			GenderID: 	 1,	
		}

		ok, err := govalidator.ValidateStruct(employee)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("UserName is required"))
	})

	t.Run(`first name is required`, func(t *testing.T) {
		employee := entity.Employees{
			UserName:    "johndoe",
			FirstName:   "", // ผิดตรงนี้
			LastName:    "Doe",
			Email:       "johndoe@gmail.com",
			Password:    "securepassword",
			PhoneNumber: "0801234567",
			ProfilePath: "swad",
			RoleID:      1,
			GenderID: 	 1,	
		}

		ok, err := govalidator.ValidateStruct(employee)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("FirstName is required"))
	})

	t.Run(`last name is required`, func(t *testing.T) {
		employee := entity.Employees{
			UserName:    "johndoe",
			FirstName:   "John",
			LastName:    "", // ผิดตรงนี้
			Email:       "johndoe@gmail.com",
			Password:    "securepassword",
			PhoneNumber: "0801234567",
			ProfilePath: "swad",
			RoleID:      1,
			GenderID: 	 1,	
		}

		ok, err := govalidator.ValidateStruct(employee)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("LastName is required"))
	})

	t.Run(`email is required`, func(t *testing.T) {
		employee := entity.Employees{
			UserName:    "johndoe",
			FirstName:   "John",
			LastName:    "Doe",
			Email:       "",
			Password:    "securepassword",
			PhoneNumber: "0801234567",
			ProfilePath: "swad",
			RoleID:      1,
			GenderID: 	 1,	
		}

		ok, err := govalidator.ValidateStruct(employee)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Email is required"))
	})


	t.Run(`email format is invalid`, func(t *testing.T) {
		employee := entity.Employees{
			UserName:    "johndoe",
			FirstName:   "John",
			LastName:    "Doe",
			Email:       "invalid-email", // ผิดตรงนี้
			Password:    "securepassword",
			PhoneNumber: "0801234567",
			ProfilePath: "swad",
			RoleID:      1,
			GenderID: 	 1,	
		}

		ok, err := govalidator.ValidateStruct(employee)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal(fmt.Sprintf("Email: %s does not validate as email", employee.Email)))
	})

	t.Run(`password is required`, func(t *testing.T) {
		employee := entity.Employees{
			UserName:    "johndoe",
			FirstName:   "John",
			LastName:    "Doe",
			Email:       "johndoe@gmail.com",
			Password:    "", // ผิดตรงนี้
			PhoneNumber: "0801234567",
			ProfilePath: "swad",
			RoleID:      1,
			GenderID: 	 1,	
		}

		ok, err := govalidator.ValidateStruct(employee)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Password is required"))
	})

	t.Run(`phone number is required`, func(t *testing.T) {
		employee := entity.Employees{
			UserName:    "johndoe",
			FirstName:   "John",
			LastName:    "Doe",
			Email:       "johndoe@gmail.com",
			Password:    "securepassword",
			PhoneNumber: "",
			ProfilePath: "swad",
			RoleID:      1,
			GenderID: 	 1,
		}

		ok, err := govalidator.ValidateStruct(employee)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("PhoneNumber is required"))
	})

	t.Run(`phone number is invalid`, func(t *testing.T) {
		employee := entity.Employees{
			UserName:    "johndoe",
			FirstName:   "John",
			LastName:    "Doe",
			Email:       "johndoe@gmail.com",
			Password:    "securepassword",
			PhoneNumber: "123", // ผิดตรงนี้
			ProfilePath: "swad",
			RoleID:      1,
			GenderID: 	 1,	
		}

		ok, err := govalidator.ValidateStruct(employee)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal(fmt.Sprintf("PhoneNumber must be exactly 10 digits")))
	})

	t.Run(`profile path is required`, func(t *testing.T) {
		employee := entity.Employees{
			UserName:    "johndoe",
			FirstName:   "John",
			LastName:    "Doe",
			Email:       "johndoe@gmail.com",
			Password:    "securepassword",
			PhoneNumber: "0801234567",
			ProfilePath: "", // ผิดตรงนี้
			RoleID:      1,
			GenderID: 	 1,	
		}
	
		ok, err := govalidator.ValidateStruct(employee)
	
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("ProfilePath is required"))
	})

	t.Run(`role ID is required`, func(t *testing.T) {
		employee := entity.Employees{
			UserName:    "johndoe",
			FirstName:   "John",
			LastName:    "Doe",
			Email:       "johndoe@gmail.com",
			Password:    "securepassword",
			PhoneNumber: "0801234567",
			ProfilePath: "swad",
			RoleID:      0, // ผิดตรงนี้
			GenderID: 	 1,	
		}

		ok, err := govalidator.ValidateStruct(employee)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("RoleID is required"))
	})

	t.Run(`valid employee data`, func(t *testing.T) {
		employee := entity.Employees{
			UserName:    "johndoe",
			FirstName:   "John",
			LastName:    "Doe",
			Email:       "johndoe@gmail.com",
			Password:    "securepassword",
			PhoneNumber: "0801234567",
			ProfilePath: "swad",
			RoleID:      1,
			GenderID: 	 1,
		}

		ok, err := govalidator.ValidateStruct(employee)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}