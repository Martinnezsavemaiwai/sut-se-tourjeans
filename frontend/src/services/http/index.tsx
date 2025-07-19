import { AccommodationsInterface } from "../../interfaces/IAccommodations";
import { BookingDetailsInterface } from "../../interfaces/IBookingDetails";
import { BookingsInterface } from "../../interfaces/IBookings";
import { HotelsInterface } from "../../interfaces/IHotels";
import { LocationsInterface } from "../../interfaces/ILocations";
import { MealsInterface } from "../../interfaces/IMeals";
import { PaymentsInterface } from "../../interfaces/IPayments";
import { SendEmailInterface } from "../../interfaces/ISendEmail";
import { SignInInterface } from "../../interfaces/ISignIn";
import { SignUpInterface } from "../../interfaces/ISignUp";
import { TourSchedulesInterface } from "../../interfaces/ITourSchedules";
import { TransportationsInterface } from "../../interfaces/ITransportations";
import { VehiclesInterface } from "../../interfaces/IVehicles";
import { VehicleTypesInterface } from "../../interfaces/IVehicleTypes";
import { TourPackage, UpdateTourPackageRequest } from "../../interfaces/ICreateTourPackage";
import { PromotionsInterfaceG } from "../../interfaces/IPromotions";
import { PromotionsInterface } from "../../interfaces/IPromotions";
import axios from 'axios';
import { InsuranceParticipantsInterface } from "../../interfaces/IInsuranceParticipants";
import { PurchaseDetailsInterface } from "../../interfaces/IPurchaseDetails";
import { SalesReportsInterface } from "../../interfaces/ISalesReports";

export const apiUrl = "https://api.tourjeans.site";
// export const apiUrl = "http://localhost:8000";

// SignInForCustomer
async function SignInForCustomer(data: SignInInterface) {
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
    };

    let res = await fetch(`${apiUrl}/signin-customer`, requestOptions).then((res) => {
        if (res.status == 200) {
            return res.json();
        } else {
            return false;
        }
    });

    return res;
}

async function SignInForEmployee(data: SignInInterface) {
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
    };

    let res = await fetch(`${apiUrl}/signin-employee`, requestOptions).then((res) => {
        if (res.status == 200) {
            return res.json();
        } else {
            return false;
        }
    });

    return res;
}

async function GetEmployeeByID(id: number) {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/employees/${id}`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        });

    return res;
}

// Send Email
async function SendEmail(data: SendEmailInterface) {
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
    };

    let res = await fetch(`${apiUrl}/send-email`, requestOptions).then((res) => {
        if (res.status == 201) {
            return res.json();
        } else {
            return false;
        }
    });

    return res;
}

// Genders
async function GetGenders() {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/genders`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        });

    return res;
}

async function GetGenderByID(id: Number) {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/genders/${id}`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        });

    return res;
}

// BookingDetails
async function GetBookingDetails() {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/booking-details`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        });

    return res;
}
async function CreateBookingDetail(data: BookingDetailsInterface) {
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
    };

    let res = await fetch(`${apiUrl}/booking-detail`, requestOptions).then((res) => {
        if (res.status == 201) {
            return res.json();
        } else {
            return res.json();
        }
    });

    return res;
}
async function DeleteBookingDetailByBookingID(bookingID: number | undefined) {
    const requestOptions = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/booking-detail/${bookingID}`, requestOptions).then((res) => {
        if (res.status == 200) {
            return res.json();
        } else {
            return false;
        }
    });

    return res;
}

// Bookings
async function GetBookings() {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/bookings`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        });

    return res;
}
async function GetBookingByID(id: Number) {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/booking/${id}`, requestOptions).then(
        (res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        }
    );

    return res;
}
async function GetBookingByCustomerID(customerid: Number) {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/bookings/${customerid}`, requestOptions).then(
        (res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        }
    );

    return res;
}
async function CreateBooking(data: BookingsInterface) {
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
    };

    let res = await fetch(`${apiUrl}/booking`, requestOptions).then((res) => {
        if (res.status == 201) {
            return res.json();
        } else {
            return res.json();
        }
    });

    return res;
}
async function UpdateBookingByID(data: BookingsInterface, id: Number | undefined) {
    const requestOptions = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
    };

    let res = await fetch(`${apiUrl}/booking/${id}`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        });

    return res;
}

// BookingStatuses
async function GetBookingStatuses() {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/booking-statuses`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        });

    return res;
}

// CancellationReasons
async function GetCancellationReasons() {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/cancellation-reasons`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        });

    return res;
}

// Customers
async function GetCustomerByID(id: Number) {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/customer/${id}`, requestOptions).then(
        (res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        }
    );

    return res;
}
async function CreateCustomer(data: SignUpInterface) {
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
    };

    let res = await fetch(`${apiUrl}/sign-up`, requestOptions).then((res) => {
        if (res.status == 201) {
            return res.json();
        } else {
            return false;
        }
    });

    return res;
}
async function UpdateCustomerByID(data: BookingsInterface, id: number | undefined) {
    const requestOptions = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
    };

    let res = await fetch(`${apiUrl}/customer-booking/${id}`, requestOptions)
        .then((res) => {
            if (res.status === 200) {
                return res.json();
            } else {
                return res.json();
            }
        })
        .catch((error) => {
            console.error("Error during fetch:", error);
            return { error: "Network error or other issues" };
        });

    return res;
}
async function UpdateCustomerByIDuseAnt(data: BookingsInterface, id: Number | undefined, formData: FormData) {
    Object.keys(data).forEach((key) => {
        formData.append(key, (data as any)[key]);
    })

    const requestOptions = {
        method: "PATCH",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
    };

    let res = await fetch(`${apiUrl}/customer/${id}`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        });

    return res;
}

//Role
async function GetRoles() {
    try {
        const res = await fetch(`${apiUrl}/roles`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        });

        if (res.ok) {
            return await res.json(); // Return all employees data
        } else {
            console.error("Error:", res.status);
            return false;
        }
    } catch (error) {
        console.error("Error fetching Roles:", error);
        return false;
    }
}


//Employee
async function GetEmployees() {
    try {
        const res = await fetch(`${apiUrl}/employees`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        });

        if (res.ok) {
            return await res.json(); // Return all employees data
        } else {
            console.error("Error:", res.status);
            return false;
        }
    } catch (error) {
        console.error("Error fetching employees:", error);
        return false;
    }
}

async function CreateEmployee(data: any) {
    try {
        const res = await fetch(`${apiUrl}/employee`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(data), // Send employee data
        });

        if (res.ok) {
            return await res.json(); // Return the created employee data
        } else if (res.status === 400) {
            // Handle 400 Bad Request
            try {
                const errorData = await res.json(); // Get the error message from response body
                throw new Error(errorData.message || "Bad Request: Invalid data"); // Throw error with message
            } catch (error) {
                throw new Error("Bad Request: Unable to parse error response");
            }
        } else {
            // Handle other non-OK responses (e.g., 500 server error)
            throw new Error(`Unexpected error: ${res.status} ${res.statusText}`);
        }
    } catch (error) {
        console.error("Error creating employee:", error);
        return false; // Return false in case of error
    }
}


async function UpdateEmployee(id: number, data: any) {
    try {
        const res = await fetch(`${apiUrl}/employee/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(data), // Send updated employee data
        });

        if (res.ok) {
            return await res.json(); // Return the updated employee data
        } else {
            return false;
        }
    } catch (error) {
        console.error(`Error updating employee with ID ${id}:`, error);
        return false;
    }
}

async function DeleteEmployee(id: number) {
    try {
        const res = await fetch(`${apiUrl}/employee/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        });

        if (res.ok) {
            return true; // Successfully deleted employee
        } else {
            return false;
        }
    } catch (error) {
        console.error(`Error deleting employee with ID ${id}:`, error);
        return false;
    }
}

export const CheckUserNameEmailPhoneNumber = async (userName: string, email: string, phoneNumber: string) => {
    try {
        const response = await axios.get('/api/employee/check-username-email-phone', {
            params: { userName, email, phoneNumber },
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            }
        });
        return response.data;
    } catch (error) {
        return { userName: false, email: false, phoneNumber: false };
    }
};

//EmployeeSchedules
async function GetEmployeeSchedules() {

    try {
        const res = await fetch(`${apiUrl}/employee-schedules`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        });

        if (res.ok) {
            return await res.json(); // Return all employees data
        } else {
            console.error("Error:", res.status);
            return false;
        }
    } catch (error) {
        console.error("Error fetching employees:", error);
        return false;
    }
}

async function CreateEmployeeSchedule(data: any) {
    try {
        const res = await fetch(`${apiUrl}/employee-schedules`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(data), // Send employee data
        });

        if (res.ok) {
            return await res.json(); // Return the created employee data
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error creating employee:", error);
        return false;
    }
}


async function UpdateEmployeeSchedule(employeeId: number, scheduleId: number, scheduleData: any) {
    const requestOptions = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(scheduleData), // ข้อมูลที่ต้องการอัพเดต
    };

    let res = await fetch(`${apiUrl}/employee/${employeeId}/schedule/${scheduleId}`, requestOptions)
        .then((res) => {
            if (res.status === 200) {
                return res.json(); // คืนค่าการอัพเดตตารางงาน
            } else {
                return false;
            }
        });

    return res;
}

// Updated DeleteEmployeeSchedule function with EmployeeScheduleID
async function DeleteEmployeeSchedule(EmployeeScheduleID: number) {
    const requestOptions = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/employee-schedules/${EmployeeScheduleID}`, requestOptions)
        .then((res) => {
            if (res.status === 200) {
                return true; // Successful deletion of employee schedule
            } else {
                return false;
            }
        });

    return res;
}


export const GetEmployeeSchedulesByTourScheduleID = async (tourScheduleId: number) => {
    try {
        const response = await fetch(`${apiUrl}/tourschedule/${tourScheduleId}/schedule`, {
            method: 'GET',
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch schedules for TourScheduleID: ${tourScheduleId}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error in GetEmployeeSchedulesByTourScheduleID:', error);
        throw error;
    }
};



export const GetEmployeeByTourSchedule = async (tourScheduleId: number) => {
    try {
        const response = await fetch(`${apiUrl}/employee/${tourScheduleId}/schedule`, {
            method: 'GET',
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch schedules for TourScheduleID: ${tourScheduleId}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error in GetEmployeeSchedulesByTourScheduleID:', error);
        throw error;
    }
};

async function GetEmployeeSchedulesbyemployeeId(employeeID: number): Promise<any[]> {
    const response = await fetch(`${apiUrl}/employee/${employeeID}/schedules`, {
        method: 'GET',
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch schedules: ${response.status}`);
    }

    return await response.json(); // Ensure the response returns an array
}

// Payments
async function GetPayments() {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/payment`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        })

    return res;
}
async function CreatePayment(data: PaymentsInterface) {
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
    };

    let res = await fetch(`${apiUrl}/payment`, requestOptions).then((res) => {
        if (res.status == 201) {
            return res.json();
        } else {
            return false;
        }
    });

    return res;
}
async function UpdatePaymentByID(data: PaymentsInterface, id: Number | undefined) {
    const requestOptions = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
    };

    let res = await fetch(`${apiUrl}/payment/${id}`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        });

    return res;
}
async function DeletePaymentByID(bookingID: number | undefined) {
    const requestOptions = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/payment/${bookingID}`, requestOptions).then((res) => {
        if (res.status == 200) {
            return res.json();
        } else {
            return false;
        }
    });

    return res;
}

// PersonTypes
async function GetPersonTypes() {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/person-types`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        });

    return res;
}

// Promotions
async function GetPromotionByCode(code: string | undefined) {
    const requestOptions = {
        method: "GET",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/promotion/${code}`, requestOptions).then(
        (res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return res.json();
            }
        }
    );

    return res;
}
async function GetPromotions() {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/promotions`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        });

    return res;
}

async function ListPromotions() {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/promotionss`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        });

    return res;
}

async function ListActivePromotions() {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/active-promotions`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        });

    return res;
}

async function GetPromotionsById(id: number) {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    try {
        const res = await fetch(`${apiUrl}/promotions/${id}`, requestOptions);

        if (res.status === 200) {
            const data = await res.json();
            return { status: res.status, data };
        } else {
            return { status: res.status, data: null };
        }
    } catch (error) {
        console.error('Error fetching promotion:', error);
        return { status: 500, data: null };
    }
}


async function CreatePromotion(data: PromotionsInterface) {
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
    };

    try {
        const response = await fetch(`${apiUrl}/create-promotion`, requestOptions);

        if (response.ok) {
            const result = await response.json();
            return { status: response.status, result };
        } else {
            const error = await response.json();
            console.error("Error:", error);
            return { status: response.status, error };
        }
    } catch (error) {
        console.error("Fetch error:", error);
        return { status: 500, error: "Internal Server Error" };
    }
}

async function UpdatePromotionById(id: string, data: PromotionsInterfaceG) {
    const requestOptions = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    try {
        const response = await axios.put(`${apiUrl}/update-promotion/${id}`, data, requestOptions);
        return response;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return {
                status: error.response?.status || 500,
                data: error.response?.data || { error: 'Unknown error occurred' },
            };
        }

        return {
            status: 500,
            data: { error: 'Unexpected error occurred' },
        };
    }
}

async function DeletePromotionById(id: number) {
    const requestOptions = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/delete-promotion/${id}`, requestOptions)
        .then((res) => {
            if (res.status === 200) {
                return true;
            } else {
                return false;
            }
        })
        .catch((error) => {
            console.error("Error deleting tour package:", error);
            return false;
        });

    return res;
}

// RoomTypes
async function GetRoomTypes() {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/room-types`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        });

    return res;
}

async function CreateTourPackages(packageData: TourPackage) {
    // ตรวจสอบว่า tourImages เป็น array หรือไม่ และตั้งค่าเป็น array เปล่าถ้าไม่ใช่
    const images = Array.isArray(packageData.tourImages) ? packageData.tourImages : [];

    // หาก tourImages มีข้อมูล (ไฟล์) ให้แปลงเป็นชื่อไฟล์หรือ URL
    if (images.length > 0) {
        packageData.tourImages = images.map(file => file);  // ใช้ชื่อไฟล์หรือ URL
    } else {
        packageData.tourImages = [];
    }

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(packageData), // ส่งข้อมูลที่แปลงแล้ว
    };

    try {
        const response = await fetch(`${apiUrl}/create-tour-package`, requestOptions);

        if (response.ok) {  // ถ้าการ request สำเร็จ
            const result = await response.json();
            return { status: response.status, result };
        } else {
            const error = await response.json();
            console.error("Error:", error);
            return { status: response.status, error };
        }
    } catch (error) {
        console.error("Fetch error:", error);
        return { status: 500, error: "Internal Server Error" };
    }
}

async function UpdateTourPackageById(id: string, data: UpdateTourPackageRequest) {
    const requestOptions = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    try {
        const response = await axios.put(`${apiUrl}/update-tour-package/${id}`, data, requestOptions);
        return response;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return {
                status: error.response?.status || 500,
                data: error.response?.data || { error: 'Unknown error occurred' },
            };
        }

        return {
            status: 500,
            data: { error: 'Unexpected error occurred' },
        };
    }
}


async function DeleteTourPackageById(id: string) {
    const requestOptions = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/delete-tour-package/${id}`, requestOptions)
        .then((res) => {
            if (res.status === 200) {
                return true;
            } else {
                return false;
            }
        })
        .catch((error) => {
            console.error("Error deleting tour package:", error);
            return false;
        });

    return res;
}

async function GetTourPackages() {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/tour-packages`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        });

    return res;
}

async function GetTourPackageByID(id: Number | undefined) {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/tour-package/${id}`, requestOptions).then(
        (res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        }
    );

    return res;
}

// Slips
async function CreateSlip(data: FormData) {
    const requestOptions = {
        method: "POST",
        body: data,
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/slip`, requestOptions).then((res) => {
        if (res.status == 201) {
            return res.json();
        } else {
            return res.json();
        }
    });

    return res;
}
async function CheckSlip(data: FormData) {
    const requestOptions = {
        method: "POST",
        headers: {
            "x-authorization": "SLIPOKQ4BLWA0"
        },
        body: data,
    };

    let res = await fetch(`https://api.slipok.com/api/line/apikey/36409`, requestOptions).then((res) => {
        if (res.ok) {
            return res.json();
        } else {
            return res.json();
        }
    });

    return res;
}
async function GetQuota() {
    const requestOptions = {
        method: "GET",
        headers: {
            "x-authorization": "SLIPOKQ4BLWA0",
        },
    };

    try {
        const response = await fetch(`https://api.slipok.com/api/line/apikey/36409/quota`, requestOptions);
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error("Error:", response.status, response.statusText);
            return false;
        }
    } catch (error) {
        console.error("Fetch error:", error);
        return false;
    }
}

// TourImages
async function GetTourImageByTourPackageID(id: Number | undefined) {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/tour-image/${id}`, requestOptions).then(
        (res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        }
    );

    return res;
}

// TourSchedules
async function GetTourScheduleByID(id: Number | undefined) {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/tour-schedule/${id}`, requestOptions).then(
        (res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        }
    );

    return res;
}
async function UpdateTourScheduleByID(data: TourSchedulesInterface, id: Number | undefined) {
    const requestOptions = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
    };

    let res = await fetch(`${apiUrl}/tour-schedule/${id}`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        });

    return res;
}

async function GetTourSchedules() {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/tour-schedule`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        });

    return res;
}

async function GetTourSchedulesForEmployeeSchedule() {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/tour-schedule-employee-schedule`, requestOptions)
        .then((res) => {
            if (res.status === 200) {
                return res.json();
            } else {
                return false;
            }
        })
        .catch((error) => {
            console.error("Error fetching tour schedules:", error);
            return false;
        });

    return res;
}


async function GetTourSchedulesByPackageID(id: Number | undefined) {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/tour-schedule-packageID/${id}`, requestOptions).then(
        (res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        }
    );

    return res;
}

async function DeleteTourScheduleByID(id: string) {
    const requestOptions = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    try {
        let res = await fetch(`${apiUrl}/delete-tour-schedule/${id}`, requestOptions);
        if (res.status === 200) {
            const data = await res.json();
            return { success: true, data: data };
        } else {
            return { success: false, message: 'Failed to delete activity' };
        }
    } catch (error) {
        console.error("Error deleting activity:", error);
        return { success: false, message: 'An error occurred' };
    }
}

async function RestoreTourScheduleByID(id: string) {
    const requestOptions = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    try {
        let res = await fetch(`${apiUrl}/restore-tour-schedule/${id}`, requestOptions);
        if (res.status === 200) {
            const data = await res.json();
            return { success: true, data: data };
        } else {
            const errorMessage = await res.json();
            return { success: false, message: errorMessage.error || 'Failed to restore tour schedule' };
        }
    } catch (error) {
        console.error("Error restoring tour schedule:", error);
        return { success: false, message: 'An error occurred' };
    }
}


// TourScheduleStatus 
async function GetScheduleStatuses() {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/tour-schedule-status`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        });

    return res;
}

// TourPrices
async function GetTourPrices() {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/tour-prices`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        });

    return res;
}

// ScheduleActivities
async function GetScheduleActivityByTourScheduleID(id: Number | undefined) {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/schedule-activity/${id}`, requestOptions).then(
        (res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        }
    );

    return res;
}

async function GetScheduleActivity(id: Number | undefined) {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/schedule-a-activity/${id}`, requestOptions)   /*ต้องมี id */
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        });

    return res;
}

async function GetProvinces() {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/provinces`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        });

    return res;
}

async function GetProvinceByID(id: number) {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/provinces/${id}`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        });

    return res;
}


// Location
async function CreateLocation(data: LocationsInterface) {
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
    };

    let res = await fetch(`${apiUrl}/locations`, requestOptions)
        .then((res) => {
            if (res.status == 201) {
                return res.json();
            } else {
                return false;
            }
        });

    return res;

}

async function GetLocations() {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/locations`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        });

    return res;
}

async function GetLocationByID(id: number) {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/locations/${id}`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        });

    return res;
}

async function UpdateLocationByID(data: LocationsInterface, id: number) {
    const requestOptions = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
    };

    let res = await fetch(`${apiUrl}/locations/${id}`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        });

    return res;
}

async function DeleteLocationByID(id: number) {
    const requestOptions = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/locations/${id}`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        });

    return res;
}

async function GetListLocationsByProvince(id: Number | undefined) {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/location-province/${id}`, requestOptions).then(
        (res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        }
    );

    return res;
}

// VehicleType
async function CreateVehicleType(data: VehicleTypesInterface) {
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
    };

    let res = await fetch(`${apiUrl}/vehicletypes`, requestOptions)
        .then((res) => {
            if (res.status == 201) {
                return res.json();
            } else {
                return false;
            }
        });

    return res;
}

async function GetVehicleTypes() {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/vehiclestypes`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        });

    return res;
}

async function GetVehicleTypeByID(id: number) {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/vehicletypes/${id}`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        });

    return res;
}

async function UpdateVehicleTypeByID(data: VehicleTypesInterface, id: number) {
    const requestOptions = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
    };

    let res = await fetch(`${apiUrl}/vehicletypes/${id}`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        });

    return res;
}

async function DeleteVehicleTypeByID(id: number) {
    const requestOptions = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/vehicletypes/${id}`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        });

    return res;
}

// Vehicle
async function CreateVehicle(data: VehiclesInterface) {
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
    };

    let res = await fetch(`${apiUrl}/vehicles`, requestOptions)
        .then((res) => {
            if (res.status == 201) {
                return res.json();
            } else {
                return false;
            }
        });

    return res;
}

async function GetVehicles() {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/vehicles`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        });

    return res;
}

async function GetVehicleByID(id: number) {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };


    let res = await fetch(`${apiUrl}/vehicles/${id}`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        });

    return res;
}

async function UpdateVehicleByID(data: VehiclesInterface, id: number) {
    const requestOptions = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
    };

    let res = await fetch(`${apiUrl}/vehicles/${id}`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        });

    return res;
}

async function DeleteVehicleByID(id: number) {
    const requestOptions = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/vehicles/${id}`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        });

    return res;
}

// Transportation
async function CreateTransportation(data: TransportationsInterface) {
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
    };


    let res = await fetch(`${apiUrl}/transportations`, requestOptions)
        .then((res) => {
            if (res.status == 201) {
                return res.json();
            } else {
                return false;
            }
        });

    return res;
}

async function GetTransportations() {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/transportations`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        })

    return res;
}

async function GetTransportationByID(id: number) {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/transportations/${id}`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        })
    return res;

}

async function UpdateTransportationByID(data: TransportationsInterface, id: number) {
    const requestOptions = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
    };

    let res = await fetch(`${apiUrl}/transportations/${id}`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        })
    return res;

}

async function DeleteTransportationByID(id: number) {
    const requestOptions = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/transportations/${id}`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        })
    return res;

}

async function CreateVehicleImage(formData: FormData, vehicleid: number) {
    const requestOptions = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
    };

    let res = await fetch(`${apiUrl}/vehicleimages/${vehicleid}`, requestOptions)
        .then((res) => {
            if (res.status === 201) {
                return res.json();
            } else {
                throw new Error(`Failed with status: ${res.status}`);
            }
        })
        .catch((err) => {
            console.error("Error uploading image:", err.message);
            return false;
        });

    return res;
}


async function GetVehicleImages() {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/vehicleimages`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        });

    return res;
}

async function GetVehicleImageByID(id: number | undefined) {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/vehicleimages/${id}`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        })
    return res;
}

//Accommodation
async function CreateAccommodation(data: AccommodationsInterface) {
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
    };

    let res = await fetch(`${apiUrl}/accommodations`, requestOptions)
        .then((res) => {
            if (res.status == 201) {
                return res.json();
            } else {
                return false;
            }
        })
    return res;
}

async function GetAccommodations() {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/accommodations`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        })
    return res;
}

async function GetAccommodationByID(id: number) {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/accommodations/${id}`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        })
    return res;
}

async function UpdateAccommodationByID(data: AccommodationsInterface, id: number) {
    const requestOptions = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
    };

    let res = await fetch(`${apiUrl}/accommodations/${id}`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        })
    return res;
}

async function DeleteAccommodationByID(id: number) {
    const requestOptions = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/accommodations/${id}`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        })
    return res;
}

// Hotel
async function CreateHotel(data: HotelsInterface) {
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
    };

    let res = await fetch(`${apiUrl}/hotels`, requestOptions)
        .then((res) => {
            if (res.status == 201) {
                return res.json();
            } else {
                return false;
            }
        })
    return res;
}

async function GetHotels() {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/hotels`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        })
    return res;
}

async function GetHotelByID(id: number) {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/hotels/${id}`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        })
    return res;
}

async function UpdateHotelByID(data: HotelsInterface, id: number) {
    const requestOptions = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
    };

    let res = await fetch(`${apiUrl}/hotels/${id}`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        })
    return res;
}
async function DeleteHotelByID(id: number) {
    const requestOptions = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/hotels/${id}`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
    })
    return res;
}
// HotelsImages
async function CreateHotelImage(formData: FormData, hotelid: number) {
    const requestOptions = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
    };

    let res = await fetch(`${apiUrl}/hotelimages/${hotelid}`, requestOptions)
        .then((res) => {
            if (res.status == 201) {
                return res.json();
            } else {
                return false;
            }
        })
    return res;
}

async function GetHotelImages() {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/hotelimages`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        })
    return res;
}

async function GetHotelImagesByID(hotelid: number) {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/hotelimages/${hotelid}`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        })
    return res;
}

// Meal Types
async function GetMealTypes() {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/mealtypes`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        })
    return res;
}

async function GetMealTypeByID(id: number) {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/mealtypes/${id}`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        })
    return res;
}

// Meals
async function CreateMeal(data: MealsInterface) {
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
    };

    let res = await fetch(`${apiUrl}/meals`, requestOptions)
        .then((res) => {
            if (res.status == 201) {
                return res.json();
            } else {
                return false;
            }
        })
    return res;
}
async function GetMeals() {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/meals`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        })
    return res;
}

async function GetMealsByID(id: number) {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/meals/${id}`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        })
    return res;
}

async function UpdateMealByID(data: MealsInterface, id: number) {
    const requestOptions = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
    };

    let res = await fetch(`${apiUrl}/meals/${id}`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        })
    return res;
}

async function DeleteMealByID(id: number) {
    const requestOptions = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/meals/${id}`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        })
    return res;
}

// Meal Images
async function CreateMealImage(formData: FormData, mealid: number) {
    const requestOptions = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
    };

    let res = await fetch(`${apiUrl}/mealimages/${mealid}`, requestOptions)
        .then(async (res) => {
            if (res.status === 201) {
                return res.json();
            } else {
                const errorText = await res.text();
                console.error(`Error: Status ${res.status}, Message: ${errorText}`);
                return false;
            }
        })
        .catch((error) => {
            console.error("Fetch error:", error);
            return false;
        });

    return res;
}

async function GetMealImages() {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/mealimages`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        })
    return res;
}

async function GetMealImageByID(id: number) {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/mealimages/${id}`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        })
    return res;
}


async function GetRoomTypeByID(id: number) {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/roomtypes/${id}`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        })
    return res;
}
async function GetTravelInsurances() {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/travelinsurances`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        })

    return res;
}

async function GetInsuranceParticipantByID(id: number) {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/insuranceparticipants/${id}`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        })

    return res;
}

async function GetProviders() {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/providers`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        })

    return res;
}

async function GetInsuranceParticipants() {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/insuranceparticipants`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        })

    return res;
}


async function CreateInsuranceParticipants(data: InsuranceParticipantsInterface) {
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
    };

    let res = await fetch(`${apiUrl}/insuranceparticipants`, requestOptions).then((res) => {
        if (res.status == 201) {
            return res.json();
        } else {
            return res.json();
        }
    });

    return res;
}

async function CreatePurchaseDetail(data: PurchaseDetailsInterface) {
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
    };

    let res = await fetch(`${apiUrl}/purchase-detail`, requestOptions).then((res) => {
        if (res.status == 201) {
            return res.json();
        } else {
            return res.json();
        }
    });

    return res;
}

async function GetSalesReports() {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/salesreports`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        })

    return res;
}


async function CreateSalesReports(data: SalesReportsInterface) {
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
    };

    let res = await fetch(`${apiUrl}/salesreports`, requestOptions).then((res) => {
        if (res.status == 201) {
            return res.json();
        } else {
            return res.json();
        }
    });

    return res;
}

async function GetPurchaseDetails() {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/purchase-details`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        })

    return res;
}

async function DeleteSalesReport(SalesReportsID: number | undefined){
    const requestOptions = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/salesreports/${SalesReportsID}`, requestOptions).then((res) => {
        if (res.status == 200) {
            return res.json();
        } else {
            return false;
        }
    });

    return res;
}

async function DeleteInsuranceParticipant(inparID: number | undefined){
    const requestOptions = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/insuranceparticipants/${inparID}`, requestOptions).then((res) => {
        if (res.status == 200) {
            return res.json();
        } else {
            return false;
        }
    });

    return res;
}
async function DeletePurchaseDetailByBookingID(bookingID: number | undefined) {
    const requestOptions = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    };

    let res = await fetch(`${apiUrl}/purchase-detail/${bookingID}`, requestOptions).then((res) => {
        if (res.status == 200) {
            return res.json();
        } else {
            return false;
        }
    });

    return res;
}

export {
    // SignInForCustomer
    SignInForCustomer,

    // SendEmail
    SendEmail,

    // Genders
    GetGenders,
    GetGenderByID,

    // BookingDetails
    GetBookingDetails,
    CreateBookingDetail,
    DeleteBookingDetailByBookingID,

    // Bookings
    GetBookings,
    GetBookingByID,
    GetBookingByCustomerID,
    CreateBooking,
    UpdateBookingByID,

    // BookingStatuses
    GetBookingStatuses,

    // CancellationReasons
    GetCancellationReasons,

    // Customers
    GetCustomerByID,
    CreateCustomer,
    UpdateCustomerByID,
    UpdateCustomerByIDuseAnt,

    // Payments
    GetPayments,
    CreatePayment,
    UpdatePaymentByID,
    DeletePaymentByID,

    // PersonTypes
    GetPersonTypes,

    // Promotions
    GetPromotions,
    GetPromotionByCode,
    ListPromotions,
    ListActivePromotions,
    GetPromotionsById,
    CreatePromotion,
    UpdatePromotionById,
    DeletePromotionById,

    // Slips
    CreateSlip,
    CheckSlip,
    GetQuota,

    // TourPackage
    GetTourPackages,
    GetTourPackageByID,
    CreateTourPackages,
    UpdateTourPackageById,
    DeleteTourPackageById,

    // TourSchedules
    GetTourScheduleByID,
    UpdateTourScheduleByID,
    GetTourSchedules,
    GetTourSchedulesByPackageID,
    GetTourSchedulesForEmployeeSchedule,
    DeleteTourScheduleByID,
    RestoreTourScheduleByID,


    // TourSchedulesStatuses  
    GetScheduleStatuses,

    //Prices 
    GetTourPrices,

    // ScheduleActivities
    GetScheduleActivityByTourScheduleID,
    GetScheduleActivity,

    // Province
    GetProvinces,
    GetProvinceByID,

    // Location
    CreateLocation,
    GetLocations,
    GetLocationByID,
    UpdateLocationByID,
    DeleteLocationByID,
    GetListLocationsByProvince,

    // VehicleType
    CreateVehicleType,
    GetVehicleTypes,
    GetVehicleTypeByID,
    UpdateVehicleTypeByID,
    DeleteVehicleTypeByID,

    // Vehicle
    CreateVehicle,
    GetVehicles,
    GetVehicleByID,
    UpdateVehicleByID,
    DeleteVehicleByID,

    // Transportation
    CreateTransportation,
    GetTransportations,
    GetTransportationByID,
    UpdateTransportationByID,
    DeleteTransportationByID,

    // VehicleImage
    CreateVehicleImage,
    GetVehicleImages,
    GetVehicleImageByID,

    // SignIn Employee
    SignInForEmployee,

    //Role
    GetRoles,

    // Employee
    GetEmployees,
    GetEmployeeByID,
    CreateEmployee,
    UpdateEmployee,
    DeleteEmployee,

    // TourImage
    GetTourImageByTourPackageID,

    // Accommodation
    CreateAccommodation,
    GetAccommodations,
    GetAccommodationByID,
    UpdateAccommodationByID,
    DeleteAccommodationByID,

    // Hotel
    CreateHotel,
    GetHotels,
    GetHotelByID,
    UpdateHotelByID,
    DeleteHotelByID,

    // HotelImage
    CreateHotelImage,
    GetHotelImages,
    GetHotelImagesByID,

    // Meal Type
    GetMealTypes,
    GetMealTypeByID,

    // Meals
    CreateMeal,
    GetMeals,
    GetMealsByID,
    UpdateMealByID,
    DeleteMealByID,

    // MealImage
    CreateMealImage,
    GetMealImages,
    GetMealImageByID,

    // Room Type
    GetRoomTypes,
    GetRoomTypeByID,

    //EmployeeSchedules
    GetEmployeeSchedules,
    CreateEmployeeSchedule,
    UpdateEmployeeSchedule,
    DeleteEmployeeSchedule,
    GetEmployeeSchedulesbyemployeeId,

    //insurance
    GetTravelInsurances,
    GetProviders,
    GetInsuranceParticipants,
    GetInsuranceParticipantByID,
    CreateInsuranceParticipants,
    CreatePurchaseDetail,
    DeleteInsuranceParticipant,
    DeletePurchaseDetailByBookingID,

    //salesreport
    CreateSalesReports,
    GetSalesReports,
    GetPurchaseDetails,
    DeleteSalesReport,
};
