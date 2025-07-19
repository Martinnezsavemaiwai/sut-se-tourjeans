import { Key, useState, useEffect, FormEvent } from "react"
import "./Booking.css"
import { CustomersInterface } from "../../interfaces/ICustomers";
import { CreateBooking, CreateBookingDetail, GetCustomerByID, GetTourScheduleByID, UpdateCustomerByID, UpdateTourScheduleByID } from "../../services/http";
import { useDateContext } from "../../contexts/DateContext";
import { BookingsInterface } from "../../interfaces/IBookings";
import { BookingDetailsInterface } from "../../interfaces/IBookingDetails";
import { TourSchedulesInterface } from "../../interfaces/ITourSchedules";
import { InputNumber, Modal } from "antd";
import CustomMediaLoading from "../employeeLoading/CustomMediaLoading";

const { confirm } = Modal

function Booking(props: { roomTypes: any; tourPackage: any; setPopUp: any; messageApi: any; }) {

    const { dateSelectedFormat, dateID } = useDateContext()

    const { roomTypes, tourPackage, setPopUp, messageApi } = props

    const [customer, setCustomer] = useState<CustomersInterface>();
    const [tourSchedule, setTourSchedule] = useState<TourSchedulesInterface>();

    const [childAdultSingleCount, setChildAdultSingleCount] = useState(0)
    const [childAdultDoubleCount, setChildAdultDoubleCount] = useState(0)
    const [childAdultThreeCount, setChildAdultThreeCount] = useState(0)
    const [infantAddBedCount, setInfantAddBedCount] = useState(0)
    const [infantNoAddBedCount, setNoInfantAddBedCount] = useState(0)
    const [totalPeople, setTotalPeople] = useState(0)

    const [childAdultSinglePrice, setChildAdultSinglePrice] = useState(0)
    const [childAdultDoublePrice, setChildAdultDoublePrice] = useState(0)
    const [childAdultThreePrice, setChildAdultThreePrice] = useState(0)
    const [infantAddBedPrice, setInfantAddBedPrice] = useState(0)
    const [infantNoAddBedPrice, setNoInfantAddBedPrice] = useState(0)

    const [fName, setFName] = useState<string | undefined>("");
    const [lName, setLName] = useState<string | undefined>("");
    const [phoneNumber, setPhoneNumber] = useState<string | undefined>("");
    const [email, setEmail] = useState<string | undefined>("");

    const [totalPrice, setTotalPrice] = useState<number>(0)

    const [isEditBtnDisabled, setIsEditBtnDisabled] = useState(true);
    const [isBookingBtnDisabled, setIsBookingDisabled] = useState(false)
    const [isLoading, setIsLoading] = useState<boolean>(true);

    async function getCustomerByID() {
        let res = await GetCustomerByID(1)
        if (res) {
            setCustomer(res);
        }
    }

    async function getTourSchedule() {
        let res = await GetTourScheduleByID(dateID)
        if (res) {
            setTourSchedule(res)
        }
    }

    async function fetchData() {
        try {
            getCustomerByID()
            getTourSchedule()
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setIsLoading(false);
        }
    }

    function handleChange(e: number, index: Key, p: number | undefined) {
        const newCount = e;
        const newTotalPeople =
            (index === 0 ? (newCount + 2 * childAdultDoubleCount + 3 * childAdultThreeCount + infantAddBedCount + infantNoAddBedCount)
                : index === 1 ? (childAdultSingleCount + 2 * newCount + 3 * childAdultThreeCount + infantAddBedCount + infantNoAddBedCount)
                    : index === 2 ? (childAdultSingleCount + 2 * childAdultDoubleCount + 3 * newCount + infantAddBedCount + infantNoAddBedCount)
                        : index === 3 ? (childAdultSingleCount + 2 * childAdultDoubleCount + 3 * childAdultThreeCount + newCount + infantNoAddBedCount)
                            : (childAdultSingleCount + 2 * childAdultDoubleCount + 3 * childAdultThreeCount + infantAddBedCount + newCount)
            )

        if (tourSchedule && newTotalPeople > (tourSchedule.AvailableSlots ?? 0)) {
            messageApi.open({
                type: "warning",
                content: "จำนวนผู้เดินทางเกินกว่าที่นั่งที่เหลือ",
            });
            return;
        }

        switch (index) {
            case 0:
                setChildAdultSingleCount(Number(e))
                setChildAdultSinglePrice(p ? p * Number(e) : 0)
                break;
            case 1:
                setChildAdultDoubleCount(Number(e))
                setChildAdultDoublePrice(p ? p * Number(e) : 0)
                break;
            case 2:
                setChildAdultThreeCount(Number(e))
                setChildAdultThreePrice(p ? p * Number(e) : 0)
                break;
            case 3:
                setInfantAddBedCount(Number(e))
                setInfantAddBedPrice(p ? p * Number(e) : 0)
                break;
            default:
                setNoInfantAddBedCount(Number(e))
                setNoInfantAddBedPrice(p ? p * Number(e) : 0)
                break;
        }
    }

    function handleCancle() {
        setIsEditBtnDisabled(true)
        setFName(customer?.FirstName)
        setLName(customer?.LastName)
        setEmail(customer?.Email)
        setPhoneNumber(customer?.PhoneNumber)
    }

    function showConfirm(){
        if (totalPeople===0){
            messageApi.open({
                type: "error",
                content: "กรุณาระบุจำนวนผู้เดินทาง!",
            });
        }
        else {
            confirm({
                title: "สร้างคำสั่งจอง",
                content: "คุณต้องการจะสร้างคำสั่งจองนี้หรือไม่? หากยืนยันจะไม่สามารถแก้ไขรายละเอียดการจองได้",
                okText: "ยืนยัน",
                cancelText: "ยกเลิก",
                centered: true,
                okButtonProps: {
                    style: { backgroundColor: "#1cb2fd", borderColor: "#1cb2fd" }
                },
                onOk() {
                    handleCreateBooking()
                },
            })
        }
    }

    async function handleCreateBooking() {
        try {
            setIsBookingDisabled(true)
            const customerid = localStorage.getItem("id")
            const dateNow = new Date().toISOString().slice(0, 19)+"Z"
            const booking: BookingsInterface = {
                BookingDate: dateNow,
                TotalPrice: totalPrice,
                TotalQuantity: totalPeople,
                CustomerID: Number(customerid),
                TourScheduleID: dateID,
                BookingStatusID: 1
            }

            const resBooking = await CreateBooking(booking)
            if (resBooking.validation_error==null) {
                const tourScheduleData: TourSchedulesInterface = {
                    AvailableSlots: (tourSchedule?.AvailableSlots ?? 0) - totalPeople,
                    TourScheduleStatusID: tourSchedule?.AvailableSlots == totalPeople ? 1 : 2,
                }

                UpdateTourScheduleByID(tourScheduleData, dateID)

                const bookingDetailsList: BookingDetailsInterface[] = [];

                tourPrices.map((price: { PersonTypeID: number; RoomTypeID: number; ID: number; }) => {
                    if (price.PersonTypeID==2){
                        if (childAdultSingleCount != 0 && price.RoomTypeID==1) {
                            bookingDetailsList.push({
                                Quantity: childAdultSingleCount,
                                TotalPrice: childAdultSinglePrice,
                                BookingID: resBooking.data.ID,
                                TourPriceID: price.ID
                            })
                        }
                        if (childAdultDoubleCount != 0 && price.RoomTypeID==2) {
                            bookingDetailsList.push({
                                Quantity: childAdultDoubleCount * 2,
                                TotalPrice: childAdultDoublePrice * 2,
                                BookingID: resBooking.data.ID,
                                TourPriceID: price.ID
                            })
                        }
                        if (childAdultThreeCount != 0 && price.RoomTypeID==3) {
                            bookingDetailsList.push({
                                Quantity: childAdultThreeCount * 3,
                                TotalPrice: childAdultThreePrice * 3,
                                BookingID: resBooking.data.ID,
                                TourPriceID: price.ID
                            })
                        }
                    }
                    else {
                        if (infantAddBedCount != 0 && price.RoomTypeID==4) {
                            bookingDetailsList.push({
                                Quantity: infantAddBedCount,
                                TotalPrice: infantAddBedPrice,
                                BookingID: resBooking.data.ID,
                                TourPriceID: price.ID
                            })
                        }
                        if (infantNoAddBedCount != 0 && price.RoomTypeID==5) {
                            bookingDetailsList.push({
                                Quantity: infantNoAddBedCount,
                                TotalPrice: infantNoAddBedPrice,
                                BookingID: resBooking.data.ID,
                                TourPriceID: price.ID
                            })
                        }
                    } 
                })

                const createDetailsPromises = bookingDetailsList.map((detail) =>
                    CreateBookingDetail(detail)
                );

                const results = await Promise.all(createDetailsPromises)    
                if (results.every((result) => result)) {
                    messageApi.open({
                        type: "success",
                        content: "สร้างการจองแพ็กเกจทัวร์เรียบร้อยแล้ว",
                    });

                    localStorage.setItem("booking-id", resBooking.data.ID)
                    setTimeout(() => {
                        setIsBookingDisabled(false)
                        location.href = "/payment";
                    }, 1800);
                }
                else {
                    messageApi.open({
                        type: "error",
                        content: "เกิดข้อผิดพลาดในการจองแพ็กเกจทัวร์",
                    });
                    setIsBookingDisabled(false)
                }
            }
            else {
                messageApi.open({
                    type: "error",
                    content: resBooking.validation_error,
                });
                setIsBookingDisabled(false)
            }

        } catch (error) {
            console.error("Error creating order:", error);
            messageApi.open({
                type: "error",
                content: "เกิดข้อผิดพลาดในการจองแพ็กเกจทัวร์",
            });
            setIsBookingDisabled(false)
        }
    }

    async function handleUpdateCustomer(e: FormEvent<HTMLFormElement>){
        e.preventDefault()
        try {
            const pattern = /^\d{10}$/
            let phone = phoneNumber
            if (phoneNumber && pattern.test(phoneNumber)) {
                phone = `${phoneNumber.slice(0,3)}-${phoneNumber.slice(3,6)}-${phoneNumber.slice(6)}`
            }
            const customerData: CustomersInterface={
                FirstName: fName,
                LastName: lName,
                PhoneNumber: phone,
                Email: email,
            }
            
            const resUpdate = await UpdateCustomerByID(customerData, customer?.ID)
            if (resUpdate.validation_error) {
                messageApi.open({
                    type: "error",
                    content: resUpdate.validation_error,
                });
            }
            else {
                messageApi.open({
                    type: "success",
                    content: "อัพเดตข้อมูลเรียบร้อยแล้ว",
                });
                setTimeout(() => {
                    setIsEditBtnDisabled(true)
                }, 1800);
            }
        } catch (error) {
            console.error("Error creating order:", error);
            messageApi.open({
                type: "error",
                content: "เกิดข้อผิดพลาดในการอัพเดตข้อมูล",
            });
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(()=>{
        setFName(customer?.FirstName)
        setLName(customer?.LastName)
        setPhoneNumber(customer?.PhoneNumber)
        setEmail(customer?.Email)
    }, [customer])

    useEffect(() => {
        const total = childAdultSinglePrice + 2 * childAdultDoublePrice + 3 * childAdultThreePrice + infantAddBedPrice + infantNoAddBedPrice
        setTotalPrice(total)
    }, [childAdultSinglePrice, childAdultDoublePrice, childAdultThreePrice, infantAddBedPrice, infantNoAddBedPrice])

    useEffect(() => {

        const count = childAdultSingleCount + 2 * childAdultDoubleCount + 3 * childAdultThreeCount + infantAddBedCount + infantNoAddBedCount
        setTotalPeople(count)

        if (childAdultSingleCount == 0 && childAdultDoubleCount == 0 && childAdultThreeCount == 0) {
            setInfantAddBedCount(0)
            setNoInfantAddBedCount(0)
            setInfantAddBedPrice(0)
            setNoInfantAddBedPrice(0)
        }
    }, [childAdultSingleCount, childAdultDoubleCount, childAdultThreeCount, infantAddBedCount, infantNoAddBedCount])

    const tourPrices = tourPackage?.TourPrices
    const priceElement = roomTypes?.map((type: any, index: number) => {
        var p: number | undefined
        var pfm: number | undefined
        tourPrices?.forEach((price: any, _: number) => {
            if (price.RoomTypeID === type.ID && price.PersonTypeID) {
                pfm = price.Price?.toLocaleString('th-TH', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })
                p = price.Price
            }
        });

        return pfm ? (
            <div key={index}>
                {
                    index == 3 ? <span className="infant-title">เด็กเล็กพักกับผู้ใหญ่</span> : <></>
                }
                <div className="price-box">
                    <span className="type-name">{type.TypeName}</span>
                    {
                        index < 3 ? <p className="quantity">{index + 1} × </p> :
                            <p className="quantity">{1} × </p>
                    }
                    <InputNumber id={`input-quantity${index+1}`} type="number" value={
                        index == 0 ? childAdultSingleCount : (
                            index == 1 ? childAdultDoubleCount : (
                                index == 2 ? childAdultThreeCount : (
                                    index == 3 ? infantAddBedCount :
                                        infantNoAddBedCount
                                )
                            )
                        )
                    } onChange={(value) => (handleChange(value as number, index, p))}
                        min={0} />
                    <span className="price">{
                        index == 0 ? childAdultSingleCount : (
                            index == 1 ? 2 * childAdultDoubleCount : (
                                index == 2 ? 3 * childAdultThreeCount : (
                                    index == 3 ? infantAddBedCount :
                                        infantNoAddBedCount
                                )
                            )
                        )
                    } × {pfm}</span>
                </div>
            </div>
        ) : ""
    })

    return isLoading ? (
        <CustomMediaLoading
            message="กำลังโหลดข้อมูล..."
            width={200}
            height={200}
        />
    ) : (
        <div className="booking-container">
            <div className="card">
                <span className="header">จองแพ็กเกจทัวร์</span>
                <section className="section-cover">
                    <div className="select-persontype-card sub-card">
                        <div className="top-box">
                            <span className="title">โปรดระบุจำนวนผู้เดินทาง</span>
                            <div className="add-quantity-box">
                                <div className="title-box">
                                    <span className="span1">เด็ก/ผู้ใหญ่</span>
                                    <span className="span2">จำนวน (คน)</span>
                                    <span className="span3">ราคา (บาท)</span>
                                </div>
                                {priceElement}
                            </div>
                        </div>
                        <div className="bottom-box">
                            <hr />
                            <div className="total-price-box">
                                <span className="title-total-price">ราคารวม</span>
                                <span className="total-people">{totalPeople}</span>
                                <span className="total-price">
                                    ฿{totalPrice.toLocaleString('th-TH', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </span>
                            </div>
                            <hr />
                            <hr />
                        </div>
                    </div>
                    <div className="card-box">
                        <div className="booking-data-card sub-card">
                            <span className="title">ตรวจสอบข้อมูลผู้จอง</span>
                            <form className="customer-form" onSubmit={handleUpdateCustomer}>
                                <div className="fname data-box">
                                    <span className="title-input">ชื่อ</span>
                                    <input type="text"
                                        defaultValue={customer?.FirstName}
                                        value={fName || ""}
                                        placeholder="โปรดป้อนชื่อ"
                                        disabled={isEditBtnDisabled}
                                        onChange={(e) => setFName(e.target.value)}
                                    />
                                </div>
                                <div className="fname data-box">
                                    <span className="title-input">นามสกุล</span>
                                    <input type="text"
                                        defaultValue={customer?.LastName}
                                        value={lName || ""}
                                        placeholder="โปรดป้อนนามสกุล"
                                        disabled={isEditBtnDisabled}
                                        onChange={(e) => setLName(e.target.value)}
                                    />
                                </div>
                                <div className="fname data-box">
                                    <span className="title-input">เบอร์โทรศัพท์</span>
                                    <input type="text"
                                        defaultValue={customer?.PhoneNumber}
                                        value={phoneNumber || ""}
                                        placeholder="โปรดป้อนเบอร์โทรศัพท์ (000-000-0000)"
                                        disabled={isEditBtnDisabled}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                    />
                                </div>
                                <div className="fname data-box">
                                    <span className="title-input">อีเมล</span>
                                    <input type="text"
                                        defaultValue={customer?.Email}
                                        value={email || ""}
                                        placeholder="โปรดป้อนอีเมล (sa@gmail.com)"
                                        disabled={isEditBtnDisabled}
                                        onChange={(e) => setEmail(e.target.value)} />
                                </div>
                                <div className="btn-box">
                                    {
                                        isEditBtnDisabled ? (
                                            <button className="edit-btn btn" onClick={() => setIsEditBtnDisabled(false)}>แก้ไขข้อมูล</button>
                                        ) : (
                                            <div className="sub-btn-box">
                                                <div className="cancel-btn btn" onClick={() => handleCancle()}>ยกเลิก</div>
                                                <button type="submit" className="confirm-btn btn">บันทึก</button>
                                            </div>
                                        )
                                    }
                                </div>
                            </form>
                        </div>
                        <div className="confirm-booking-card sub-card">
                            <div className="detail">
                                <span className="title">ตรวจสอบข้อมูลการจอง</span>
                                <div className="tour-name-box sub-box">
                                    <div className="img-box">
                                        <img src="./images/icons/tour.png" alt="" />
                                    </div>
                                    {tourPackage?.TourName}
                                </div>
                                <div className="tour-date-box sub-box">
                                    <div className="img-box">
                                        <img src="./images/icons/calendar.png" alt="" />
                                    </div>
                                    {dateSelectedFormat}
                                </div>
                                <div className="people-quantity-box sub-box">
                                    <div className="img-box">
                                        <img src="./images/icons/bag.png" alt="" />
                                    </div>
                                    ผู้เดินทางจำนวน {totalPeople} ท่าน
                                </div>
                                <div className="btn-box">
                                    <button className="cancel-btn btn" onClick={() => setPopUp(<></>)}>ยกเลิก </button>
                                    <button className="confirm-btn btn"
                                        disabled={isBookingBtnDisabled}
                                        onClick={showConfirm}
                                        style={{
                                            cursor: !isBookingBtnDisabled ? "pointer" : "not-allowed",
                                            opacity: !isBookingBtnDisabled ? "1" : "0.6"
                                        }}
                                    >ยืนยันการจอง</button>
                                </div>
                            </div>
                            <div className="picture-box">
                                <img src="./images/backgrounds/travel.jpg" alt="" />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}
export default Booking