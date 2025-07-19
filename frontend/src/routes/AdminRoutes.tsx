import MinimalLayout from "../layouts/MinimalLayout/MinimalLayout";
import AccommodationManagement from "../pages/accommodationManagement/accommodationManagement";
import MealCreate from "../pages/accommodationManagement/MealCreate/MealCreate";
import CheckPayment from "../pages/checkPayment/CheckPayment";
import ManageBooking from "../pages/manageBooking/manageBooking";
import TravelTransportMangement from "../pages/travelTransportationMangement/travelTransportationMangement";
import ShowTransportation from "../pages/travelTransportationMangement/ShowTransportation/ShowTransportation";
import TransportCreate from "../pages/travelTransportationMangement/TransportCreate/TransportCreate";
import TransportEdit from "../pages/travelTransportationMangement/TransportEdit/TransportEdit";
import TravelCreate from "../pages/travelTransportationMangement/TravelCreate/TravelCreate";
import TravelEdit from "../pages/travelTransportationMangement/TravelEdit/TravelEdit";

import TourPackageManage from "../pages/packageManage/tourPackageManage/TourPackageManage";
import DetailPackageManage from "../pages/packageManage/detailPackageManage/DetailPackageManage";
import CreateTourPackage from "../pages/packageManage/createTourPackage/CreateTourPackage"; 
import EditTourPackage from "../pages/packageManage/editTourPackage/EditTourPackage"; 

import PromotionsManage from "../pages/promotionManage/promotionsManage/PromotionsManage";
import EditPromotion from "../pages/promotionManage/editPromotion/EditPromotion";
import CreatePromotions from "../pages/promotionManage/createPromotion/CreatePromotion";

import EmployeeManage from "../pages/Employee/manage/EmployeeManage";
import ViewSchedule from "../pages/Employee/manage/Schedule/ViewSchedulePage";
import EmployeeEdit from "../pages/Employee/manage/edit/EmployeeEdit"; 
import EmployeeCreate from "../pages/Employee/manage/create/EmployeeCreate"; 

import EmployeeSchedules from "../pages/Employee/schedules/EmployeeSchedules";
import ManageEmployeeSchedules from "../pages/Employee/schedules/manage/ManageEmployeeSchedules"; 
import AcccommodationCreate from "../pages/accommodationManagement/AccommodationCreate/AcccommodationCreate";
import MealEdit from "../pages/accommodationManagement/MealEdit/MealEdit";
import AcccommodationEdit from "../pages/accommodationManagement/AccommodationEdit/AcccommodationEdit";
import ShowAccomodation from "../pages/accommodationManagement/ShowAccomodation/ShowAccomodation";
import HotelCreate from "../pages/accommodationManagement/HotelCreate/HotelCreate";
import Dashboard from "../pages/dashboard/Dashboard";
import Insurance from "../pages/insurance/Insurance";

import EmployeeProfile from "../pages/Employee/profile/employeeProfile";
import CreateEmployeeSchedule from "../pages/Employee/schedules/manage/create/createEmployeeSchedule"; 
import AdminDashboard from "../components/adminDashBoard/AdminDashboard";
import HotelEdit from "../pages/accommodationManagement/HotelEdit/HotelEdit";
import HotelManagement from "../pages/accommodationManagement/HotelManagement/MangeTransport";
import EditTransport from "../pages/travelTransportationMangement/TransportEdit copy/EditTransport";
import TransportManagement from "../pages/travelTransportationMangement/Transportation/MangeTransport";

const AddminRoutes = () => {
    return {

        path: "/",

        element: <MinimalLayout />,
        children: [

            {
                path: "/",
                element: <AdminDashboard />
            },
            {
                path: "/dashboard",
                element: <AdminDashboard />
            },
            {
                path: "/TravelTransportManagement",
                element:<TravelTransportMangement />
                ,
            },
            
            {
                path: "/TransportManagement",
                element: <TransportManagement />,

            },
            
            {
                path: "/Create/TransportManagement",
                element: <TransportCreate />,
            },

            {
                path: "/EditTransportation/:id",
                element: <TransportEdit />,
            },

            {
                path: "/Create/TravelManagement",
                element:<TravelCreate />
                ,
            },

            {
                path: "/EditTravel/:id",
                element: <TravelEdit />,
            },

            {
                path: "/EditTransport/:id",
                element: <EditTransport />,
            },

            {
                path: "/ShowTransportation/:id",
                element: <ShowTransportation />,
            },

            {
                path: "/AccommodationManagement",
                element: <AccommodationManagement />
            },

            {
                path: "/Create/Meal",
                element: <MealCreate />
            },

            {
                path: "/Edit/Meal/:id",
                element: <MealEdit />
            },

            {
                path: "/Create/Hotel",
                element: <HotelCreate />
            },

            {
                path: "/HotelManagement",
                element: <HotelManagement />
            },

            {
                path: "/EditHotel/:id",
                element: <HotelEdit />
            },

            {
                path: "/Create/Accommodation",
                element: <AcccommodationCreate />
            },

            {
                path: "/Edit/Accommodation/:id",
                element: <AcccommodationEdit />
            },

            {
                path: "//ShowAccommodation/:id",
                element: <ShowAccomodation />
            },

            {
                path: "/ManageBooking",
                element: <ManageBooking />,
            },

            {
                path: "/CheckPayment",
                element: <CheckPayment />,
            },

            {
                path: "/tour-package-manage",
                element: <TourPackageManage />,
            },
            {
                path: "/tour-package-manage/tour-details",
                element: <DetailPackageManage />,
            },
            {   path: "/tour-package-manage/create-tour-package",
                element: <CreateTourPackage />,
            },
            {   path: "/tour-package-manage/edit-tour-package/:id",
                element: <EditTourPackage />,
            },

            {
                path: "/promotions-manage",
                element: <PromotionsManage />,
            },
            {
                path: "/promotions-manage/edit-promotion/:id",
                element: <EditPromotion />,
            },
            {   path: "/promotions-manage/create-tour-promotion",
                element: <CreatePromotions />,
            },
            {
                path: "/employee-profile", // สำหรับแก้ไขพนักงาน (มี dynamic parameter)
                element: <EmployeeProfile />,
            },
            {
                path: "/employeemanage", 
                element: <EmployeeManage />,
            },
            {
                path: "/employee/create", // สำหรับเพิ่มพนักงาน
                element: <EmployeeCreate />,
            },
            {
                path: "/employee/edit/:id", // สำหรับแก้ไขพนักงาน (มี dynamic parameter)
                element: <EmployeeEdit />,
            },
            {
                path: "/employee/schedule/:employeeId", // สำหรับแก้ไขพนักงาน (มี dynamic parameter)
                element: <ViewSchedule  />,
            },
            {
                path: "/employeeschedule", // สำหรับตารางงานพนักงาน
                element: <EmployeeSchedules />,
            },
            {
                path: "/employee-schedules/:scheduleid", // สำหรับแก้ไขพนักงาน (มี dynamic parameter)
                element: <ManageEmployeeSchedules  />,
            },
            {
                path: "/dashboard",
                element: <Dashboard />,
            },
            {
                path: "/insurance",
                element: <Insurance />,
            },
            
            {
                path: "/create-employee-schedule/:scheduleid", // สำหรับแก้ไขพนักงาน (มี dynamic parameter)
                element: <CreateEmployeeSchedule  />,
            },
        ],

    }
}

export default AddminRoutes;