package test

import (
	"testing"
	"toursystem/entity"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestUserName(t *testing.T) {
	InitCustomValidators()

	g := NewGomegaWithT(t)

	t.Run(`user_name is required`, func(t *testing.T) {
		customer := entity.Customers{
			UserName: "",	// ผิดตรงนี้
			FirstName: "Peter",
			LastName: "Parker",
			Email: "test_2@gmail.com",
			Password: "",
			PhoneNumber: "000-000-0000",
			ProfilePath: "",
			GenderID: 1,
		}

		ok, err := govalidator.ValidateStruct(customer)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("UserName is required"))
	})

	t.Run(`user_name is valid`, func(t *testing.T) {
		customer := entity.Customers{
			UserName: "Spider",	// ถูกต้อง
			FirstName: "Peter",
			LastName: "Parker",
			Email: "test_2@gmail.com",
			Password: "",
			PhoneNumber: "000-000-0000",
			ProfilePath: "",
			GenderID: 1,
		}

		ok, err := govalidator.ValidateStruct(customer)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}

func TestFirstName(t *testing.T) {
	InitCustomValidators()

	g := NewGomegaWithT(t)

	t.Run(`first_name is required`, func(t *testing.T) {
		customer := entity.Customers{
			UserName: "Spider",
			FirstName: "",	// ผิดตรงนี้
			LastName: "Parker",
			Email: "test_2@gmail.com",
			Password: "",
			PhoneNumber: "000-000-0000",
			ProfilePath: "",
			GenderID: 1,
		}

		ok, err := govalidator.ValidateStruct(customer)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("FirstName is required"))
	})

	t.Run(`first_name is valid`, func(t *testing.T) {
		customer := entity.Customers{
			UserName: "Spider",
			FirstName: "Peter",	// ถูกต้อง
			LastName: "Parker",
			Email: "test_2@gmail.com",
			Password: "",
			PhoneNumber: "000-000-0000",
			ProfilePath: "",
			GenderID: 1,
		}

		ok, err := govalidator.ValidateStruct(customer)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}

func TestLastName(t *testing.T) {
	InitCustomValidators()

	g := NewGomegaWithT(t)

	t.Run(`last_name is required`, func(t *testing.T) {
		customer := entity.Customers{
			UserName: "Spider",
			FirstName: "Peter",
			LastName: "",	// ผิดตรงนี้
			Email: "test_2@gmail.com",
			Password: "",
			PhoneNumber: "000-000-0000",
			ProfilePath: "",
			GenderID: 1,
		}

		ok, err := govalidator.ValidateStruct(customer)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("LastName is required"))
	})

	t.Run(`last_name is valid`, func(t *testing.T) {
		customer := entity.Customers{
			UserName: "Spider",
			FirstName: "Peter",
			LastName: "Parker",	// ถูกต้อง
			Email: "test_2@gmail.com",
			Password: "",
			PhoneNumber: "000-000-0000",
			ProfilePath: "",
			GenderID: 1,
		}

		ok, err := govalidator.ValidateStruct(customer)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}

func TestEmail(t *testing.T) {
	InitCustomValidators()

	g := NewGomegaWithT(t)

	t.Run(`email is required`, func(t *testing.T) {
		customer := entity.Customers{
			UserName: "Spider",
			FirstName: "Peter",
			LastName: "Parker",
			Email: "",	// ผิดตรงนี้
			Password: "",
			PhoneNumber: "000-000-0000",
			ProfilePath: "",
			GenderID: 1,
		}

		ok, err := govalidator.ValidateStruct(customer)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("Email is required"))
	})

	t.Run(`email is invalid`, func(t *testing.T) {
		customer := entity.Customers{
			UserName: "Spider",
			FirstName: "Peter",
			LastName: "Parker",
			Email: "test_2gmail.com",	// ผิดตรงนี้
			Password: "",
			PhoneNumber: "000-000-0000",
			ProfilePath: "",
			GenderID: 1,
		}

		ok, err := govalidator.ValidateStruct(customer)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("Email is invalid"))
	})

	t.Run(`email is valid`, func(t *testing.T) {
		customer := entity.Customers{
			UserName: "Spider",
			FirstName: "Peter",
			LastName: "Parker",
			Email: "test_2@gmail.com",	// ถูกต้อง
			Password: "",
			PhoneNumber: "000-000-0000",
			ProfilePath: "",
			GenderID: 1,
		}

		ok, err := govalidator.ValidateStruct(customer)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}

func TestPhoneNumber(t *testing.T) {
	InitCustomValidators()

	g := NewGomegaWithT(t)

	t.Run(`phone_number is required`, func(t *testing.T) {
		customer := entity.Customers{
			UserName: "Spider",
			FirstName: "Peter",
			LastName: "Parker",
			Email: "test_2@gmail.com",
			Password: "",
			PhoneNumber: "",	// ผิดตรงนี้
			ProfilePath: "",
			GenderID: 1,
		}

		ok, err := govalidator.ValidateStruct(customer)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("PhoneNumber is required"))
	})

	t.Run(`phone_number is invalid`, func(t *testing.T) {
		customer := entity.Customers{
			UserName: "Spider",
			FirstName: "Peter",
			LastName: "Parker",
			Email: "test_2@gmail.com",
			Password: "",
			PhoneNumber: "000-000-000",	// ผิดตรงนี้
			ProfilePath: "",
			GenderID: 1,
		}

		ok, err := govalidator.ValidateStruct(customer)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("Invalid PhoneNumber format"))
	})

	t.Run(`phone_number is valid`, func(t *testing.T) {
		customer := entity.Customers{
			UserName: "Spider",
			FirstName: "Peter",
			LastName: "Parker",
			Email: "test_2@gmail.com",
			Password: "",
			PhoneNumber: "000-000-0000",	// ถูกต้อง
			ProfilePath: "",
			GenderID: 1,
		}

		ok, err := govalidator.ValidateStruct(customer)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}

func TestGenderinCustomer(t *testing.T) {
	InitCustomValidators()

	g := NewGomegaWithT(t)

	t.Run(`gender_id is required`, func(t *testing.T) {
		customer := entity.Customers{
			UserName: "Spider",
			FirstName: "Peter",
			LastName: "Parker",
			Email: "test_2@gmail.com",
			Password: "",
			PhoneNumber: "000-000-0000",
			ProfilePath: "",
			GenderID: 0,	// ผิดตรงนี้
		}

		ok, err := govalidator.ValidateStruct(customer)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("GenderID is required"))
	})

	t.Run(`gender_id is valid`, func(t *testing.T) {
		customer := entity.Customers{
			UserName: "Spider",
			FirstName: "Peter",
			LastName: "Parker",
			Email: "test_2@gmail.com",
			Password: "",
			PhoneNumber: "000-000-0000",
			ProfilePath: "",
			GenderID: 1,	// ถูกต้อง
		}

		ok, err := govalidator.ValidateStruct(customer)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}