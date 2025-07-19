import { useEffect, useState } from "react"
import Navbar from "../../components/Navbar-Management/Navbar"
import "./manageBooking.css"
import { BookingsInterface } from "../../interfaces/IBookings"
import { GetBookings, GetBookingStatuses } from "../../services/http"
import { Link } from "react-router-dom"
import { InfoCircleOutlined } from "@ant-design/icons"
import { FaSearch } from "react-icons/fa"
import { BookingStatusesInterface } from "../../interfaces/IBookingStatuses"
import CustomMediaLoading from "../../components/employeeLoading/CustomMediaLoading"

function ManageBooking() {
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const [listBookings, setListBookings] = useState<BookingsInterface[]>()
    const [bookingStatuses, setBookingStatuses] = useState<BookingStatusesInterface[]>()

    const [searchText, setSearchText] = useState("")
    const [searchOption, setSearchOption] = useState(1)
    const [sortOption, setSortOption] = useState(1)
    const [statusOption, setStatusOption] = useState(0)

    async function getBookings() {
        const res = await GetBookings()
        if (res) {
            setListBookings(res)
        }
    }

    console.log(bookingStatuses)

    async function getBookingStatuses() {
        const res = await GetBookingStatuses()
        if (res) {
            setBookingStatuses(res)
        }
    }

    async function fetchData() {
        try {
            getBookings()
            getBookingStatuses()
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const filteredBooking = listBookings?.filter((booking) => {
        return searchOption == 1 ? (
            String(booking?.ID).includes(searchText.toLowerCase())
        ) : searchOption == 2 ? (
            booking?.TourSchedule?.TourPackage?.PackageCode?.toLowerCase().includes(searchText.toLowerCase())
        ) : searchOption == 3 ? (
            booking.BookingDate?.slice(0, 10).includes(searchText.toLowerCase())
        ) : (
            `${booking.Customer?.FirstName} ${booking.Customer?.LastName}`.toLowerCase().includes(searchText.toLowerCase())
        )
    })

    const sortedBooking = (sortOption === 1) ? (
        filteredBooking?.sort((a, b) => {
            const idA = a.ID || 0
            const idB = b.ID || 0
            return idA - idB
        })
    ) : (
        filteredBooking?.sort((a, b) => {
            const idA = a.ID || 0
            const idB = b.ID || 0
            return idB - idA
        })
    )

    const sortedStatus = sortedBooking?.filter((booking) => {
        return statusOption !== 0 ? String(booking.BookingStatusID).includes(String(statusOption)) : booking
    })

    const bookingElement = sortedStatus?.map((booking, index) => {
        const id = booking.ID
        const packageCode = booking.TourSchedule?.TourPackage?.PackageCode
        const date = booking.BookingDate?.slice(0, 10)
        const time = booking.BookingDate?.slice(11, 19)
        const firstName = booking.Customer?.FirstName
        const lastName = booking.Customer?.LastName
        const statusName = booking.BookingStatus?.StatusName
        const statusID = booking.BookingStatus?.ID

        return (
            <tr className="booking-element" key={index}>
                <td className="booking-id">{id}</td>
                <td className="package-code">{packageCode}</td>
                <td className="booking-at">{date} {time}</td>
                <td className="customer-name">{`${firstName} ${lastName}`}</td>
                <td className="status" style={{
                    color: statusID == 3 ? "var(--blue)" :
                        statusID == 4 ? "var(--lightorange)" :
                            statusID == 5 ? "var(--red)" : ""
                }}>{statusName}</td>
                <td className="booking-detail">
                    <Link to="/CheckPayment">
                        <button className="check-detail" onClick={() => localStorage.setItem("booking-id", String(booking?.ID))}><InfoCircleOutlined /> ตรวจสอบ</button>
                    </Link>
                </td>
            </tr>
        )
    })

    return isLoading ? (
        <CustomMediaLoading
            message="กำลังโหลดข้อมูล..."
            width={200}
            height={200}
        />
    ) : (
        <div className="manage-booking-page">
            <Navbar page={'booking-management'} />
            <div className="manage-booking-container">
                <div className="text-4xl font-semibold text-left mt-10 ml-3 mb-3 text-box">
                    <h6 className="text-black">จัดการการจอง</h6>
                </div>
                <div className="card-section">
                    <div className="list-booking-card">
                        <div className="search-bar">
                            <div className="search-box">
                                <div className="relative w-full max-w-md">
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        className="w-full px-5 py-3 text-gray-700 bg-white border border-gray-300 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-gray-400"
                                        onChange={(e) => setSearchText(e.target.value)}
                                    />
                                    <button
                                        className="absolute top-1/2 -translate-y-1/2 right-3 flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full hover:bg-gray-200 transition duration-200"
                                    >
                                        <FaSearch className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>
                                <select onChange={(e) => setSearchOption(Number(e.target.value))}>
                                    <option value={1}>ค้นหาหมายเลขการจอง</option>
                                    <option value={2}>ค้นหารหัสทัวร์</option>
                                    <option value={3}>ค้นหาวันที่จอง</option>
                                    <option value={4}>ค้นหาชื่อผู้จอง</option>
                                </select>
                            </div>
                            <div className="search-box-container">
                                <div className="sort-box">
                                    <span className="text">การจัดเรียง</span>
                                    <select onChange={(e) => setSortOption(Number(e.target.value))}>
                                        <option value={1}>ลำดับน้อย-มาก</option>
                                        <option value={2}>ลำดับมาก-น้อย</option>
                                    </select>
                                </div>
                                <div className="sort-box">
                                    <span className="text">สถานะการจอง</span>
                                    <select onChange={(e) => setStatusOption(Number(e.target.value))}>
                                        <option value={0}>ทั้งหมด</option>
                                        {
                                            bookingStatuses?.map((item, index) => {
                                                return (
                                                    <option key={index} value={Number(item.ID)}>{item.StatusName}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="form-section">
                            <table>
                                <thead>
                                    <tr>
                                        <th className="booking-id">หมายเลขการจอง</th>
                                        <th>รหัสทัวร์</th>
                                        <th>วันที่ทำการจอง</th>
                                        <th>ชื่อผู้จอง</th>
                                        <th>สถานะการจอง</th>
                                        <th className="booking-detail">รายละเอียด</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookingElement}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ManageBooking