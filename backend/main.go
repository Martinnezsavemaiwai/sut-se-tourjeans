package main

import (
	"net/http"
	"toursystem/config"
	controllers "toursystem/controllers"
	"toursystem/test"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)


func init() {
    test.InitCustomValidators()
}

func main() {
	config.ConnectionDB()
	config.SetupDatabase()

	r := gin.Default()

	r.Use(CORSMiddleware())

	r.POST("/signin-customer", controllers.SignInForCustomer)
	r.POST("/signin-employee", controllers.SignInForEmployee)

	r.POST("/send-email", controllers.SendEmail)

	r.Static("/images", "./images")

	r.Use(func(c *gin.Context) {
		c.Header("Cache-Control", "no-cache, no-store, must-revalidate")
		c.Header("Pragma", "no-cache")
		c.Header("Expires", "0")
		c.Next()
	})

	router := r.Group("/")
	{
		// ตั้งค่า CORS
		router.Use(cors.New(cors.Config{
			AllowOrigins:     []string{"https://tourjeans.site", "https://www.tourjeans.site", "http://localhost:5173"},
			AllowMethods: []string{"POST", "GET", "OPTIONS", "PATCH", "PUT"},
			AllowHeaders: []string{"Content-Type", "Authorization", "X-Authorization"},
    		ExposeHeaders:    []string{"Content-Length", "X-Authorization"},
    		AllowCredentials: true,
		}))

		// BookingDetails
		router.GET("/booking-details", controllers.ListBookingDetails)
		router.POST("/booking-detail", controllers.CreateBookingDetail)
		router.DELETE("/booking-detail/:bookingID", controllers.DeleteBookingDetailByBookingID)

		// Bookings
		router.GET("/bookings", controllers.ListBookings)
		router.GET("/booking/:id", controllers.GetBookingByID)
		router.GET("/bookings/:customerId", controllers.GetBookingByCustomerID)
		router.POST("/booking", controllers.CreateBooking)
		router.PATCH("/booking/:id", controllers.UpdateBooking)

		// BookingStatuses
		router.GET("/booking-statuses", controllers.ListBookingStatuses)

		// CancellationReasons
		router.GET("/cancellation-reasons", controllers.ListCancellationReasons)

		// Customers
		router.GET("/customer/:id", controllers.GetCustomerByID)
		router.POST("/sign-up", controllers.CreateCustomer)
		router.PATCH("/customer/:id", controllers.UpdateCustomer)
		router.PATCH("/customer-booking/:id", controllers.UpdateCustomerBooking)

		// Payments
		router.GET("/payment", controllers.ListPayments)
		router.POST("/payment", controllers.CreatePayment)
		router.PATCH("/payment/:id", controllers.UpdatePayment)
		router.DELETE("/payment/:bookingID", controllers.DeletePaymentByBookingID)

		// PersonTypes
		router.GET("/person-types", controllers.ListPersonTypes)

		// Promotions
		router.GET("/promotions", controllers.ListPromotions)
		router.GET("/promotion/:code", controllers.GetPromotionByCode)
		router.GET("/promotionss", controllers.ListPromotionss)
		router.GET("/active-promotions", controllers.ListActivePromotions)
		router.GET("/promotions/:id", controllers.GetPromotionsById)
		router.POST("/create-promotion", controllers.CreatePromotion)
		router.PUT("/update-promotion/:id", controllers.UpdatePromotionById)
		router.DELETE("/delete-promotion/:id", controllers.DeletePromotionById)

		// RoomTypes
		router.GET("/room-types", controllers.ListRoomTypes)

		// Slips
		router.POST("/slip", controllers.CreateSlip)

		// TourImages
		router.GET("/tour-image/:tourpackageId", controllers.GetTourImageByTourPackageID)

		// TourPackages
		router.GET("/tour-packages", controllers.ListTourPackages)
		router.GET("/tour-package/:id", controllers.GetTourPackageByID)
		router.POST("/create-tour-package", controllers.CreateTourPackage)
		router.PUT("/update-tour-package/:id", controllers.UpdateTourPackage)
		router.DELETE("/delete-tour-package/:id", controllers.DeleteTourPackage)

		// TourSchedule
		router.GET("/tour-schedule/:id", controllers.GetTourScheduleByID)
		router.PATCH("/tour-schedule/:id", controllers.UpdateTourSchedule)
		router.GET("/tour-schedule", controllers.ListTourSchedules) 
		router.GET("/tour-schedule-packageID/:id", controllers.GetTourSchedulesByPackageID)  
		router.GET("/tour-schedule-employee-schedule", controllers.ListTourSchedulesforEmployeeSchedule)  
		router.DELETE("/delete-tour-schedule/:id", controllers.DeleteTourScheduleByID)
		router.PATCH("/restore-tour-schedule/:id", controllers.RestoreTourSchedule)

		// TourScheduleStatus
		router.GET("/tour-schedule-status", controllers.ListScheduleStatuses)

		// ScheduleActivities
		router.GET("/schedule-activity/:id", controllers.GetScheduleActivityByTourScheduleID)
		router.GET("/schedule-a-activity/:id", controllers.GetScheduleActivity)

		// TourPrices
		router.GET("/tour-prices", controllers.GetTourPricesController)

		// Province
		router.GET("/provinces", controllers.GetProvinces)
		router.GET("/provinces/:id", controllers.GetProvinceByID)

		// PurchaseDetails
		router.GET("/purchase-details", controllers.ListPurchaseDetails)
		router.POST("/purchase-detail", controllers.CreatePurchaseDetail)
		router.DELETE("/purchase-detail/:bookingID", controllers.DeletePurchaseDetailByBookingID)

		// Location
		router.POST("/locations", controllers.CreateLocation)
		router.GET("/locations", controllers.GetLocations)
		router.GET("/locations/:id", controllers.GetLocationByID)
		router.PATCH("/locations/:id", controllers.UpdateLocation)
		router.DELETE("/locations/:id", controllers.DeleteLocation)
		router.GET("/location-province/:id", controllers.ListLocationsByProvince)

		// Vehicle Type
		router.POST("/vehiclestypes", controllers.CreateVehicleType)
		router.GET("/vehiclestypes", controllers.GetVehicleTypes)
		router.GET("/vehiclestypes/:id", controllers.GetVehicleTypeByID)
		router.PATCH("/vehiclestypes/:id", controllers.UpdateVehicleType)
		router.DELETE("/vehiclestypes/:id", controllers.DeleteVehicleType)

		// Vehicle
		router.POST("/vehicles", controllers.CreateVehicle)
		router.GET("/vehicles", controllers.GetVehicles)
		router.GET("/vehicles/:id", controllers.GetVehicleByID)
		router.PATCH("/vehicles/:id", controllers.UpdateVehicle)
		router.DELETE("/vehicles/:id", controllers.DeleteVehicle)

		// VehicleImage
		router.POST("/vehicleimages/:vehicleid", controllers.CreateVehicleImage)
		router.GET("/vehicleimages", controllers.GetVehicleImages)
		router.GET("/vehicleimages/:vehicleid", controllers.GetVehicleImageByID)

		// Transportation
		router.POST("/transportations", controllers.CreateTransportation)
		router.GET("/transportations", controllers.GetTransportations)
		router.GET("/transportations/:id", controllers.GetTransportationByID)
		router.PATCH("/transportations/:id", controllers.UpdateTransportation)
		router.DELETE("/transportations/:id", controllers.DeleteTransportation)

		// Accommodation
		router.POST("/accommodations", controllers.CreateAccommodation)
		router.GET("/accommodations", controllers.GetAccommodations)
		router.GET("/accommodations/:id", controllers.GetAccommodationByID)
		router.PATCH("/accommodations/:id", controllers.UpdateAccommodation)
		router.DELETE("/accommodations/:id", controllers.DeleteAccommodation)

		// Hotels
		router.POST("/hotels", controllers.CreateHotel)
		router.GET("/hotels", controllers.GetHotels)
		router.GET("/hotels/:id", controllers.GetHotelByID)
		router.PATCH("/hotels/:id", controllers.UpdateHotel)
		router.DELETE("/hotels/:id", controllers.DeleteHotel)

		// Hotel Images
		router.POST("/hotelimages/:hotelid", controllers.CreateHotelImage)
		router.GET("/hotelimages", controllers.GetHotelImages)
		router.GET("/hotelimages/:hotelid", controllers.GetHotelImageByID)

		// Meal Types
		router.GET("/mealtypes", controllers.GetMealTypes)
		router.GET("/mealtypes/:id", controllers.GetMealTypeByID)

		// Meals
		router.POST("/meals", controllers.CreateMeal)
		router.GET("/meals", controllers.GetMeals)
		router.GET("/meals/:id", controllers.GetMealByID)
		router.PATCH("/meals/:id", controllers.UpdateMeal)
		router.DELETE("/meals/:id", controllers.DeleteMeal)

		// MealImages
		router.POST("/mealimages/:mealid", controllers.CreateMealImage)
		router.GET("/mealimages", controllers.GetMealImages)
		router.GET("/mealimages/:mealid", controllers.GetMealImageByID)

		// Employee
		router.GET("/employees", controllers.ListEmployees)
		router.GET("/employees/:id", controllers.GetEmployeeByID)
		router.POST("/employee", controllers.CreateEmployee)
		router.PUT("/employee/:id", controllers.UpdateEmployee)
		router.DELETE("/employee/:id", controllers.DeleteEmployee)
		router.GET("/check-duplicate", controllers.CheckDuplicateUserNameEmailPhoneNumber)

		//EmployeeSchedules
		router.GET("/employee-schedules", controllers.ListEmployeeSchedules)
		router.GET("/employee-schedules/:id", controllers.GetEmployeeScheduleByID)
		router.GET("/tourschedule/:id/schedule", controllers.GetEmployeeSchedulesByTourScheduleID)
		router.GET("/employee/:id/schedule", controllers.GetEmployeeByTourSchedule)
		router.POST("/employee-schedules", controllers.CreateEmployeeSchedule)
		router.PUT("/employee-schedules/:id", controllers.UpdateEmployeeSchedule)
		router.DELETE("/employee-schedules/:id", controllers.DeleteEmployeeSchedule)
		router.GET("/employee/:id/schedules", controllers.GetEmployeeSchedulesByEmployeeID)

		// Role
		r.GET("/roles", controllers.ListRoles)

		// Genders
		r.GET("/genders", controllers.ListGenders)
		r.GET("/genders/:id", controllers.GetGenderByID)
		// Provider/insurance
		router.GET("/travelinsurances", controllers.GetTravelInsurances)
		router.GET("/travelinsurances/:id", controllers.GetTravelInsurancesByID)
		router.GET("/insuranceparticipants", controllers.ListInsuranceParticipants)
		router.POST("/insuranceparticipants", controllers.CreateInsuranceParticipants)
		router.GET("/insuranceparticipants/:id", controllers.GetInsuranceParticipantByID)
		router.DELETE("/insuranceparticipants/:id", controllers.DeleteInsuranceParticipant)
		router.GET("/providers", controllers.GetProviders)
		router.GET("/providers/:id", controllers.GetProvidersByID)

		//Salesreports
		router.GET("/salesreports", controllers.ListSalesReports)
		router.POST("/salesreports", controllers.CreateSalesReports)
		router.DELETE("/salesreports/:id", controllers.DeleteSalesReports)

	}

	r.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "API RUNNING... PORT: %s")
	})

	r.Run()
	// r.Run("localhost:" + "8000")

}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

