import { useEffect, useRef, useState } from "react"
import "./CheckPayment.css"
import { BookingsInterface } from "../../interfaces/IBookings"
import { apiUrl, GetBookingByID, GetCancellationReasons, SendEmail, UpdateBookingByID, UpdatePaymentByID, UpdateTourScheduleByID } from "../../services/http"

import { message, Modal, Steps } from 'antd';
import { PromotionsInterface } from "../../interfaces/IPromotions"
import Navbar from "../../components/Navbar-Management/Navbar"
import { PaymentsInterface } from "../../interfaces/IPayments"
import { SendEmailInterface } from "../../interfaces/ISendEmail"
import { TourSchedulesInterface } from "../../interfaces/ITourSchedules"
import { CancellationReasonsInterface } from "../../interfaces/ICancellationReasons"
import CustomMediaLoading from "../../components/employeeLoading/CustomMediaLoading"

const { confirm } = Modal

function CheckPayment() {
    const bookingID = localStorage.getItem("booking-id")

    const [booking, setBooking] = useState<BookingsInterface>()
    const [tourSchedule, setTourSchedule] = useState<TourSchedulesInterface>()

    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [amount, setAmount] = useState(0.00);
    const [note, setNote] = useState("")
    const noteRef = useRef(note)
    const [reason, setReason] = useState<CancellationReasonsInterface[]>()
    const [selectedReason, setSelectedReason] = useState(5)
    const selectedReasonRef = useRef(selectedReason)

    const [promotion, setPromotion] = useState<PromotionsInterface>()
    const [discount, setDiscount] = useState<number>(0)

    const qrCodeRef = useRef<HTMLDivElement>(null)

    const [showSlip, setShowSlip] = useState(<></>)

    const [messageApi, contextHolder] = message.useMessage()

    async function getBookingByID() {
        if (bookingID) {
            const resBooking = await GetBookingByID(Number(bookingID))
            if (resBooking) {
                setBooking(resBooking)
            }
        }
    }

    async function getCancellationReasons() {
        const res = await GetCancellationReasons()
        if (res) {
            setReason(res)
        }
    }

    async function fetchData() {
        try {
            getBookingByID()
            getCancellationReasons()
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setIsLoading(false);
        }
    }

    async function cancelBooking() {
        try {
            const bk: BookingsInterface = {
                BookingStatusID: 5,
                CancellationReasonID: selectedReasonRef.current
            }
            const resUpBooking = await UpdateBookingByID(bk, Number(bookingID))
            if (resUpBooking) {
                const tourScheduleData: TourSchedulesInterface = {
                    AvailableSlots: (tourSchedule?.AvailableSlots || 0) + (booking?.TotalQuantity || 0),
                    TourScheduleStatusID: 2,
                }

                UpdateTourScheduleByID(tourScheduleData, tourSchedule?.ID)

                const emailData: SendEmailInterface = {
                    ID: Number(bookingID),
                    Email: booking?.Customer?.Email,
                    Name: `${booking?.Customer?.FirstName} ${booking?.Customer?.LastName}`,
                    TourName: booking?.TourSchedule?.TourPackage?.TourName,
                    Date: dateFormat,
                    Subject: "การจองทัวร์ถูกยกเลิกแล้ว",
                    Body: "การจองทัวร์ของคุณถูกยกเลิกจากผู้ดูแลระบบแล้ว โดยรายละเอียดการจองมีดังนี้:"
                }
                SendEmail(emailData)

                messageApi.open({
                    type: "success",
                    content: "การจองถูกยกเลิกแล้ว",
                });
                setTimeout(() => {
                    window.location.reload();
                }, 2000)
            } else {
                messageApi.open({
                    type: "error",
                    content: "เกิดข้อผิดพลาดในการยกเลิกการจอง",
                });
            }
        } catch (error) {
            messageApi.open({
                type: "error",
                content: "เกิดข้อผิดพลาดในการยกเลิกการจอง",
            });
        }
    }

    async function confirmBooking() {
        try {
            const bk: BookingsInterface = {
                BookingStatusID: 3,
            }
            const resUpBooking = await UpdateBookingByID(bk, Number(bookingID))
            if (resUpBooking) {
                const em_id = localStorage.getItem("id")
                const pm: PaymentsInterface = {
                    PaymentStatusID: 2,
                    EmployeeID: em_id ? Number(em_id) : undefined
                }

                const resPayment = await UpdatePaymentByID(pm, booking?.Payment?.ID)
                if (resPayment) {
                    const emailData: SendEmailInterface = {
                        ID: Number(bookingID),
                        Email: booking?.Customer?.Email,
                        Name: `${booking?.Customer?.FirstName} ${booking?.Customer?.LastName}`,
                        TourName: booking?.TourSchedule?.TourPackage?.TourName,
                        Date: dateFormat,
                        Subject: "การจองของคุณได้รับการยืนยันแล้ว",
                        Body: "ขอบคุณที่ทำการจองกับเรา! การจองของคุณได้รับการยืนยันเรียบร้อยแล้ว โดยรายละเอียดการจองมีดังนี้:"
                    }
                    
                    SendEmail(emailData)
                    messageApi.open({
                        type: "success",
                        content: "การจองได้รับการยืนยันแล้ว",
                    });
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000)
                } else {
                    messageApi.open({
                        type: "error",
                        content: "เกิดข้อผิดพลาดในการอัพเดตการชำระเงิน",
                    });
                }
            } else {
                messageApi.open({
                    type: "error",
                    content: "เกิดข้อผิดพลาดในการอัพเดตสถานะการจอง",
                });
            }
        } catch (error) {
            messageApi.open({
                type: "error",
                content: "เกิดข้อผิดพลาดในการยืนยัน",
            });
        }
    }

    async function reUploadSlip() {
        try {
            const bk: BookingsInterface = {
                BookingStatusID: 4
            }
            const resUpBooking = await UpdateBookingByID(bk, Number(bookingID))
            if (resUpBooking) {
                const pyData: PaymentsInterface = {
                    Note: noteRef.current,
                    PaymentStatusID: 3
                }
                UpdatePaymentByID(pyData, booking?.Payment?.ID)


                const emailData: SendEmailInterface = {
                    ID: Number(bookingID),
                    Email: booking?.Customer?.Email,
                    Name: `${booking?.Customer?.FirstName} ${booking?.Customer?.LastName}`,
                    TourName: booking?.TourSchedule?.TourPackage?.TourName,
                    Date: dateFormat,
                    Subject: "แจ้งเตือนการส่งสลิปใหม่",
                    Body: "โปรดทำการแนบหลักฐานการโอนใหม่อีกครั้ง ในของการจองทัวร์ของคุณ โดยรายละเอียดการจองมีดังนี้:"
                }
                SendEmail(emailData)
                messageApi.open({
                    type: "success",
                    content: "แจ้งส่งสลิปใหม่สำเร็จ",
                });
                setTimeout(() => {
                    window.location.reload();
                }, 2000)
            } else {
                messageApi.open({
                    type: "error",
                    content: "เกิดข้อผิดพลาดในการแจ้งส่งสลิปใหม่",
                });
            }
        } catch (error) {
            messageApi.open({
                type: "error",
                content: "เกิดข้อผิดพลาดในการแจ้งส่งสลิปใหม่",
            });
        }
    }

    const showConfirmConfirm = () => {
        confirm({
            title: "ยืนยันการจองนี้",
            content: "คุณต้องการจะยืนยันการจองนี้หรือไม่?",
            okText: "ยืนยัน",
            cancelText: "ยกเลิก",
            centered: true,
            okButtonProps: {
                style: { backgroundColor: "#1cb2fd", borderColor: "#1cb2fd" }
            },
            onOk() {
                confirmBooking()
            },
        });
    };

    const showConfirmCancel = () => {
        confirm({
            title: "ยกเลิกการจองนี้",
            content: (
                <div>
                    <p>คุณต้องการจะยกเลิกการจองนี้หรือไม่?</p>
                    <select
                        style={{
                            marginTop: "10px",
                            border: "1px solid var(--border-color-1)",
                            width: "100%",
                            borderRadius: "5px",
                            padding: "2px 12px"
                        }}
                        onChange={(e) => setSelectedReason(Number(e.target.value))}
                    >
                        {
                            reason?.slice(4).map((items, index) => {
                                return (
                                    <option value={items.ID} key={index}>{items.Reason}</option>
                                )
                            })
                        }
                    </select>
                </div>
            ),
            okText: "ยืนยัน",
            cancelText: "ยกเลิก",
            centered: true,
            okButtonProps: {
                style: { backgroundColor: "#FF4545", borderColor: "#FF4545" }
            },
            onOk() {
                cancelBooking()
            },
        });
    };

    const showConfirmReUpload = () => {
        confirm({
            title: "แจ้งอัพโหลดสลิปใหม่",
            content: (
                <div>
                    <p>คุณต้องการจะแจ้งอัพโหลดสลิปใหม่หรือไม่?</p>
                    <input
                        placeholder="กรุณาใส่เหตุผล"
                        onChange={(e) => setNote(e.target.value)}
                        style={{
                            marginTop: "10px",
                            border: "1px solid var(--border-color-1)",
                            width: "100%",
                            borderRadius: "5px",
                            padding: "2px 12px"
                        }}
                    />
                </div>
            ),
            okText: "ยืนยัน",
            cancelText: "ยกเลิก",
            centered: true,
            okButtonProps: {
                style: { backgroundColor: "#1cb2fd", borderColor: "#1cb2fd" }
            },
            onOk() {
                if (!noteRef.current.trim()) {
                    messageApi.open({
                        type: "warning",
                        content: "กรุณาใส่เหตุผลก่อนยืนยัน",
                    });
                } else {
                    reUploadSlip()
                }
            },
        });
    };

    function popUpPicture() {
        setShowSlip(
            <div className="popup-slip" onClick={() => setShowSlip(<></>)}>
                <img src={`${apiUrl}/${booking?.Payment?.Slip?.FilePath}`} alt="" />
            </div>
        )
    }

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        const totalPrice = booking?.TotalPrice
        setTourSchedule(booking?.TourSchedule)

        if (totalPrice) {
            setAmount(totalPrice)

            if (booking?.Promotion) {
                setPromotion(booking?.Promotion)
                const dcp = booking?.Promotion?.DiscountPercentage

                let price_befor = 0
                booking.BookingDetails?.forEach((item) => {
                    price_befor += item.TotalPrice || 0
                })
                booking.PurchaseDetails?.forEach((item) => {
                    price_befor += item.TotalPrice || 0
                })

                if (dcp) {
                    let disc = Math.round(price_befor * (dcp / 100))
                    setDiscount(disc)
                    setAmount(totalPrice)
                }
            }
        }
    }, [booking])

    useEffect(() => {
        selectedReasonRef.current = selectedReason
    }, [selectedReason])

    useEffect(() => {
        noteRef.current = note
    }, [note])

    const months = [
        "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
        "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];

    const startDate = booking?.TourSchedule?.StartDate?.slice(8, 10)
    const startDateFormat = startDate?.startsWith("0") ? startDate?.slice(1, 2) : startDate
    const endDate = booking?.TourSchedule?.EndDate?.slice(8, 10)
    const endDateFormat = endDate?.startsWith("0") ? endDate?.slice(1, 2) : endDate
    const mountFormat = months[Number(booking?.TourSchedule?.StartDate?.slice(5, 7)) - 1]
    const yearFormat = booking?.TourSchedule?.StartDate?.slice(0, 4)
    const dateFormat = `วันที่ ${startDateFormat}-${endDateFormat} ${mountFormat} ${yearFormat}`

    const sortedDetails = booking?.BookingDetails?.sort((a, b) => {
        const roomTypeA = a.TourPrice?.RoomTypeID || 0;
        const roomTypeB = b.TourPrice?.RoomTypeID || 0;
        return roomTypeA - roomTypeB;
    }) || [];

    let totalPeople = 0
    const tableRowElement1 = sortedDetails?.map((detail, index) => {
        let list = ""
        const tourPrice = detail.TourPrice
        totalPeople = totalPeople + Number(detail.Quantity)

        const personType = tourPrice?.PersonType?.TypeName
        const roomType = tourPrice?.RoomType?.TypeName

        if (tourPrice?.PersonTypeID == 2) {
            if (tourPrice.RoomTypeID == 1) {
                list = `${personType} ห้อง${roomType}`
            }
            else if (tourPrice.RoomTypeID == 2) {
                list = `${personType} ห้อง${roomType}`
            }
            else if (tourPrice.RoomTypeID == 3) {
                list = `${personType} ห้อง${roomType}`
            }
        }
        else {
            if (tourPrice?.RoomTypeID == 4) {
                list = `${personType} ${roomType}`
            }
            else if (tourPrice?.RoomTypeID == 5) {
                list = `${personType} ${roomType}`
            }
        }
        const priceFormat = tourPrice?.Price?.toLocaleString('th-TH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })
        const totalPriceFormat = ((tourPrice?.Price || 0) * (detail?.Quantity || 0)).toLocaleString('th-TH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })
        return (
            <tr key={index}>
                <td align="center" style={{ minWidth: "40px" }}>{index + 1}</td>
                <td style={{ paddingLeft: "15px" }}>{list}</td>
                <td align="left">{`${detail.Quantity} × ${priceFormat}`}</td>
                <td align="right" style={{ paddingRight: "15px" }}>
                    {totalPriceFormat}
                </td>
            </tr>
        )
    })

    const tableRowElement2 = booking?.PurchaseDetails?.map((detail, index) => {
        const name = detail.TravelInsurance?.InsuranceName
        const priceFormat = detail.TravelInsurance?.Price?.toLocaleString('th-TH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })
        const quantity = detail.Quantity
        const totalPriceFormat = detail.TotalPrice?.toLocaleString('th-TH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })
        return (
            <tr key={index}>
                <td align="center" style={{ minWidth: "40px" }}>{(booking?.BookingDetails?.length || 0) + index + 1}</td>
                <td style={{ paddingLeft: "15px" }}>{name}</td>
                <td align="left">{`${quantity} × ${priceFormat}`}</td>
                <td align="right" style={{ paddingRight: "15px" }}>{totalPriceFormat}</td>
            </tr>
        )
    })

    const bookingStatus = booking?.BookingStatusID
    const items = bookingStatus != 4 ? [
        {
            title: 'จองแพ็กเกจ',
        },
        {
            title: 'ชำระเงิน',
        },
        {
            title: 'รอการตรวจสอบ',
        },
        {
            title: 'การจองเสร็จสิ้น',
        },
    ] : [
        {
            title: 'จองแพ็กเกจ',
        },
        {
            title: 'ชำระเงิน',
        },
        {
            title: 'ส่งสลิปใหม่',
        },
        {
            title: 'รอการตรวจสอบ',
        },
        {
            title: 'การจองเสร็จสิ้น',
        },
    ]

    return isLoading ? (
        <CustomMediaLoading
            message="กำลังโหลดข้อมูล..."
            width={200}
            height={200}
        />
    ) : (
        <div className="check-payment-page">
            {showSlip}
            {contextHolder}
            <Navbar page={"payment-page"} />
            <section className="payment-box-card">
                <div className="booking-step-card card">
                    {
                        (bookingStatus == 5) ? (
                            <div className="step-error">
                                <Steps status="error"
                                    labelPlacement="vertical"
                                    items={[{ title: 'ถูกยกเลิกแล้ว' }]}
                                />
                            </div>
                        ) : (
                            <Steps current={bookingStatus == 4 ? 2 : bookingStatus} labelPlacement="vertical" items={items} />
                        )
                    }
                </div>
                <div className="sub-section-card">
                    <div className="booking-detail-card card">
                        <div className="detail-title title">รายละเอียดการจอง</div>
                        <div className="detail-container">
                            <div className="detail-box">
                                <p className="tour-name">{booking?.TourSchedule?.TourPackage?.TourName}</p>
                                <p className="tour-code">{`รหัสแพ็กเกจ: ${booking?.TourSchedule?.TourPackage?.PackageCode}`}</p>
                                <p className="tour-date">{`วันที่เดินทาง: ${dateFormat}`}</p>
                            </div>
                            <table className="detail-table">
                                <thead>
                                    <tr>
                                        <th>ลำดับ</th>
                                        <th>รายการ</th>
                                        <th>จำนวน (คน)</th>
                                        <th>ราคา (บาท)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableRowElement1}
                                    {tableRowElement2}
                                    <tr>
                                        <td className="gap"></td>
                                    </tr>
                                    {
                                        discount != 0 ? (
                                            <tr>
                                                <td colSpan={2}
                                                    style={{ paddingLeft: "15px" }}
                                                >{promotion?.PromotionName}</td>
                                                <td colSpan={2}
                                                    align="right"
                                                    style={{ paddingRight: "15px", color: "var(--price-color)" }}
                                                >{
                                                        `− ${discount.toLocaleString('th-TH', {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        })}`
                                                    }</td>
                                            </tr>
                                        ) : <></>
                                    }
                                    <tr className="foot">
                                        <th align="left"
                                            colSpan={2}
                                            style={{ paddingLeft: "15px" }}
                                        >จำนวนผู้เดินทางและราคารวม</th>
                                        <th>{totalPeople}</th>
                                        <th align="right" style={{ paddingRight: "15px" }}>
                                            {amount.toLocaleString('th-TH', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </th>
                                    </tr>
                                </tbody>
                            </table>
                            {
                                booking?.SpecialRequest ? (
                                    <textarea
                                        className="special-Request"
                                        placeholder="คำขอพิเศษ เช่น ประเภทอาหาร อาหารที่แพ้"
                                        defaultValue={booking.SpecialRequest}
                                        readOnly
                                    />
                                ) : (<></>)
                            }

                        </div>
                    </div>
                    <div ref={qrCodeRef} className="qr-code-card card">
                        {
                            bookingStatus === 4 ? (
                                <p className="note-text">
                                    <span className="star">{"** "}</span>
                                    {`Note: ${booking?.Payment?.Note}`}
                                    <span className="star">{" **"}</span>
                                </p>
                            ) : bookingStatus === 5 ? (
                                <p className="note-text">
                                    <span className="star">{"** "}</span>
                                    {`Note: ${booking?.CancellationReason?.Reason}`}
                                    <span className="star">{" **"}</span>
                                </p>
                            ) : (<></>)
                        }
                        {
                            booking?.Payment?.Slip != null ? (
                                <>
                                    <p className="title">หลักฐานการโอน</p>
                                    <div className="img-box" onClick={popUpPicture}>
                                        <img src={`${apiUrl}/${booking?.Payment?.Slip?.FilePath}`} alt="" />
                                    </div>
                                </>
                            ) : (<></>)
                        }
                        {
                            bookingStatus == 3 || bookingStatus == 5 ? (
                                <></>
                            ) : bookingStatus == 1 ? (
                                <div className="no-data">
                                    <div className="img-box">
                                        <img src="./images/icons/no-payment.png" alt="" />
                                    </div>
                                    <span className="text">{booking?.BookingStatus?.StatusName}...</span>
                                </div>
                            ) : (
                                <>
                                    <button className="confirm-booking-btn btn" onClick={showConfirmConfirm}>ยืนยันการตรวจสอบ</button>
                                    <button className="re-upload-btn btn" onClick={showConfirmReUpload}>แจ้งส่งสลิปใหม่</button>
                                    <button className="cancel-btn btn" onClick={showConfirmCancel}>ยกเลิกการจอง</button>
                                </>
                            )
                        }
                    </div>
                </div>
            </section >
        </div >
    )
}
export default CheckPayment