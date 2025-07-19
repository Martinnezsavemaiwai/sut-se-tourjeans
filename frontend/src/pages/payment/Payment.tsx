import { FormEvent, useEffect, useRef, useState } from "react"
import Navbar from "../../components/navbar/Navbar"
import "./Payment.css"
import { BookingsInterface } from "../../interfaces/IBookings"
import { apiUrl, CheckSlip, CreatePayment, CreateSlip, DeletePaymentByID, GetBookingByID, GetCancellationReasons, GetPromotionByCode, GetQuota, UpdateBookingByID, UpdateTourScheduleByID } from "../../services/http"

import QRCode from 'react-qr-code';

import { Button, message, Modal, Steps, Upload, UploadFile, UploadProps } from 'antd';
import generatePayload from 'promptpay-qr';
import { ClockCircleOutlined, UploadOutlined } from "@ant-design/icons"
import { PromotionsInterface } from "../../interfaces/IPromotions"
import { PaymentsInterface } from "../../interfaces/IPayments"
import { TourSchedulesInterface } from "../../interfaces/ITourSchedules"
import { CancellationReasonsInterface } from "../../interfaces/ICancellationReasons"
import InsurSelect from "../InsurSelect/InsurSelect"
import CustomMediaLoading from "../../components/employeeLoading/CustomMediaLoading"

const { confirm } = Modal

function Payment() {
    const bookingID = localStorage.getItem("booking-id")

    const [booking, setBooking] = useState<BookingsInterface>()
    const [tourSchedule, setTourSchedule] = useState<TourSchedulesInterface>()

    const [specialRequest, setSpecialRequest] = useState("")

    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isUploadBtnDisabled, setIsUploadBtnDisabled] = useState(false)

    // @ts-ignore
    const [phoneNumber, setPhoneNumber] = useState("098-594-4576");
    const [amount, setAmount] = useState(0.00);
    const [qrCode, setqrCode] = useState("sample");

    const [code, setCode] = useState<string | undefined>("")
    const [promotion, setPromotion] = useState<PromotionsInterface>()
    const [warningText, setWarningText] = useState<string>()
    const [discount, setDiscount] = useState<number>(0)

    const [qrSize, setQrSize] = useState(256)
    const qrCodeRef = useRef<HTMLDivElement>(null)

    const [fileList, setFileList] = useState<UploadFile[]>([])

    const [timeLeft, setTimeLeft] = useState<number>(0)
    const [bookingCreatedAt, setBookingCreatedAt] = useState<string>()

    const [reason, setReason] = useState<CancellationReasonsInterface[]>()
    const [selectedReason, setSelectedReason] = useState(1)
    const selectedReasonRef = useRef(selectedReason)

    const [messageApi, contextHolder] = message.useMessage()

    let totalPriceInsurance = 0

    function handleQR() {
        setqrCode(generatePayload(phoneNumber, { amount }))
    }

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

    async function handlePromotion(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        try {
            if (code != "") {
                const res = await GetPromotionByCode(code)
                if (res.error == null) {
                    const { ValidFrom, ValidUntil, PromotionStatusID } = res;
                    const currentTime = new Date()
                    const validFromDate = new Date(ValidFrom)
                    const validUntilDate = new Date(ValidUntil)

                    console.log(PromotionStatusID)

                    if (currentTime >= validFromDate && currentTime <= validUntilDate && PromotionStatusID === 1) {
                        if (amount >= res.MinimumPrice) {
                            let disc = Math.round(amount * (res.DiscountPercentage / 100))
                            setDiscount(disc)
                            setAmount(amount - disc)
                            setWarningText("")
                            setPromotion(res)
                        } else {
                            setWarningText("ราคาที่ต้องชำระไม่ตรงตามเงื่อนไขการใช้งาน")
                            cancelPromotion()
                        }
                    } else {
                        setWarningText("โค้ดส่วนลดหมดอายุหรือยังไม่สามารถใช้งานได้")
                        cancelPromotion()
                    }
                } else {
                    setWarningText("ไม่พบโค้ดส่วนลด")
                    cancelPromotion()
                }
            }
        } catch (error) {
            console.error('Failed to fetch data:', error)
        }
    }

    function cancelPromotion() {
        setAmount(amount + discount)
        setDiscount(0)
    }

    // @ts-ignore
    async function checkSlip() {
        const resQuota = await GetQuota()
        if (resQuota.data.quota != 0) {
            const formData = new FormData();
            formData.append('files', fileList[0] as any)
            const resCheckSlip = await CheckSlip(formData)
            console.log(resCheckSlip.data)
            if (resCheckSlip.success === true) {
                if (resCheckSlip.data.amount === amount && resCheckSlip.data.receiver.displayName === "นายพูลทรัพย์ น") {
                    console.log("สลิปถูกต้อง")
                    return true
                }
                else {
                    messageApi.open({
                        type: "error",
                        content: "สลิปไม่ถูกต้อง",
                    });
                    setIsUploadBtnDisabled(false)
                    return false
                }
            }
            else {
                messageApi.open({
                    type: "error",
                    content: "สลิปไม่ถูกต้อง",
                });
                setIsUploadBtnDisabled(false)
                return false
            }
        }
        else {
            messageApi.open({
                type: "error",
                content: "โควต้าจำนวนการตรวจสอบสลิปหมดแล้ว",
            });
            setIsUploadBtnDisabled(false)
        }
    }

    async function handleUpload() {
        setIsUploadBtnDisabled(true)
        try {
            const paymentData: PaymentsInterface = {
                Amount: amount,
                BookingID: Number(bookingID),
            }
            const resPayment = await CreatePayment(paymentData)
            if (resPayment) {
                const formData = new FormData();
                formData.append('file', fileList[0] as any)

                const customerID = localStorage.getItem("id")
                if (customerID) {
                    formData.append('customerID', customerID)
                }

                formData.append('paymentID', resPayment.data.ID)

                const resCheck = await checkSlip()
                if (resCheck) {
                    const resSlip = await CreateSlip(formData)
                    if (resSlip) {
                        const bk: BookingsInterface = {
                            BookingStatusID: 2,
                            TotalPrice: amount,
                            SpecialRequest: specialRequest,
                            PromotionID: promotion != undefined ? promotion.ID : undefined
                        }
                        const resUpBooking = await UpdateBookingByID(bk, Number(bookingID))
                        if (resUpBooking) {
                            messageApi.open({
                                type: "success",
                                content: "อัพโหลดสลิปสำเร็จ!",
                            });
                            setTimeLeft(0)
                            setTimeout(() => {
                                window.location.reload();
                                setIsUploadBtnDisabled(false)
                            }, 2000)
                        } else {
                            messageApi.open({
                                type: "error",
                                content: "เกิดข้อผิดพลาดในการอัพโหลดสลิป",
                            });
                            setIsUploadBtnDisabled(false)
                        }
                    }
                    else {
                        DeletePaymentByID(resPayment.data.ID)
                        setIsUploadBtnDisabled(false)
                    }
                }
                else {
                    DeletePaymentByID(resPayment.data.ID)
                    setIsUploadBtnDisabled(false)
                }
            }
            else {
                messageApi.open({
                    type: "error",
                    content: "เกิดข้อผิดพลาดในการอัพโหลดสลิป",
                });
                setIsUploadBtnDisabled(false)
            }
        } catch (error) {
            console.error('Failed to fetch data:', error)
            messageApi.open({
                type: "error",
                content: "เกิดข้อผิดพลาดในการอัพโหลดสลิป",
            });
            setIsUploadBtnDisabled(false)
        }
    }
    async function cancelBooking() {
        try {
            const bk: BookingsInterface = {
                BookingStatusID: 5,
                CancellationReasonID: selectedReasonRef.current == 0 ? 4 : selectedReasonRef.current,
            }
            const resUpBooking = await UpdateBookingByID(bk, Number(bookingID))
            if (resUpBooking) {
                const tourScheduleData: TourSchedulesInterface = {
                    AvailableSlots: (tourSchedule?.AvailableSlots || 0) + (booking?.TotalQuantity || 0),
                    TourScheduleStatusID: 2,
                }

                UpdateTourScheduleByID(tourScheduleData, tourSchedule?.ID)

                setTimeout(() => {
                    window.location.reload();
                    setIsUploadBtnDisabled(false)
                }, 2000)
                messageApi.open({
                    type: "success",
                    content: "การจองถูกยกเลิกแล้ว",
                });
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

    function showConfirm(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (fileList.length === 0) {
            messageApi.open({
                type: "warning",
                content: "กรุณาเลือกไฟล์ก่อน",
            });
            setIsUploadBtnDisabled(false)
            return
        }
        confirm({
            title: "อัพโหลดสลิป",
            content: "คุณต้องการจะอัพโหลดสลิปนี้หรือไม่? หากอัพโหลดไปแล้วจะไม่สามารถแก้ไขได้",
            okText: "ยืนยัน",
            cancelText: "ยกเลิก",
            centered: true,
            okButtonProps: {
                style: { backgroundColor: "#1cb2fd", borderColor: "#1cb2fd" }
            },
            onOk() {
                handleUpload()
            },
        })
    }

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
                            reason?.slice(0, 3).map((items, index) => {
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

    useEffect(() => {
        selectedReasonRef.current = selectedReason
    }, [selectedReason])

    useEffect(() => {
        fetchData()

        const updateQRCodeSize = () => {
            if (qrCodeRef.current) {
                const parentWidth = qrCodeRef.current.offsetWidth
                setQrSize(parentWidth * 0.5)
            }
        };
        updateQRCodeSize();
        window.addEventListener('resize', updateQRCodeSize);
        return () => {
            window.removeEventListener('resize', updateQRCodeSize);
        };

    }, [])

    useEffect(() => {
        setBookingCreatedAt(booking?.BookingDate)
        setTourSchedule(booking?.TourSchedule)

        const totalPrice = (booking?.TotalPrice || 0) + totalPriceInsurance
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
                setCode(booking?.Promotion?.PromotionCode)
            }

            if (booking?.Payment) {
                const filePath = booking.Payment.Slip?.FilePath
                const fileName = filePath?.slice(23)
                if (filePath && fileName) {
                    setFileList([
                        {
                            uid: '1',
                            name: fileName,
                            status: 'done',
                            url: `${apiUrl}/${filePath}`
                        },
                    ])
                }
            }
        }
    }, [booking])

    useEffect(() => {
        if (bookingStatus == 1) {
            const createdTime = bookingCreatedAt ? new Date(bookingCreatedAt).getTime() : 0
            const expiryTime = createdTime + (40 * 1) * 60 * 1000;
            const interval = setInterval(() => {
                const now = Date.now();
                const remaining = Math.max(0, expiryTime - now);
                setTimeLeft(Math.floor(remaining / 1000));

                if (remaining <= 0) {
                    clearInterval(interval)
                    selectedReasonRef.current = 4
                    cancelBooking()
                }
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [bookingCreatedAt])

    useEffect(() => {
        handleQR()
    }, [amount])

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
        const totalPriceFormat = (detail.TotalPrice || 0).toLocaleString('th-TH', {
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

        if (booking.BookingStatusID == 1) {
            totalPriceInsurance += detail.TotalPrice || 0
        }

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

    const props: UploadProps = {
        beforeUpload: (file) => {
            const isImage = file.type === 'image/png' || file.type === 'image/jpeg';
            if (!isImage) {
                message.error('กรุณาเลือกไฟล์ที่เป็น .png หรือ .jpg เท่านั้น');
                return false;
            }
            setFileList([file])
            return false
        },
        onRemove: (file) => {
            setFileList((prevList) => prevList.filter((item) => item.uid !== file.uid))
        },
        fileList,
    }

    const timeFormat =
        `${Math.floor(timeLeft / 3600) < 10 ? 0 : ''}${Math.floor(timeLeft / 3600)}:` +
        `${Math.floor(timeLeft % 3600 / 60) < 10 ? 0 : ''}${Math.floor(timeLeft % 3600 / 60)}:` +
        `${timeLeft % 60 < 10 ? 0 : ''}${timeLeft % 60}`

    return isLoading ? (
        <CustomMediaLoading
            message="กำลังโหลดข้อมูล..."
            width={200}
            height={200}
        />
    ) : (
        <div className="payment-page">
            {contextHolder}
            <Navbar page="payment" scrollOnTop />
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
                                bookingStatus === 1 ? (
                                    <form className="promotion-box" onSubmit={(e) => handlePromotion(e)}>
                                        <div className="input-box">
                                            <input type="text"
                                                className="code-input"
                                                value={code}
                                                onChange={(e) => setCode(e.target.value)}
                                                placeholder="ป้อนโค้ดส่วนลด (ถ้ามี)"
                                            />
                                            <button className="usecode-btn btn" type="submit">ใช้โค้ด</button>
                                            <button className="cancelcode-btn btn"
                                                type="reset"
                                                onClick={() => {
                                                    cancelPromotion();
                                                    setCode("");
                                                }}
                                            >เลิกใช้โค้ด</button>
                                        </div>
                                    </form>
                                ) : (<></>)
                            }
                            <p className="warning-text">
                                {warningText}
                            </p>
                            <textarea className="special-Request"
                                placeholder="คำขอพิเศษ เช่น ประเภทอาหาร อาหารที่แพ้"
                                defaultValue={booking?.SpecialRequest}
                                readOnly={bookingStatus === 1 ? false : true}
                                onChange={(e) => setSpecialRequest(e.target.value)}
                            />
                            {
                                bookingStatus === 1 && booking?.PurchaseDetails?.length === 0 ? (
                                    <div className="insurance-box">
                                        <InsurSelect />
                                        <div className="text-box">
                                            <p className="text1">
                                                <span className="star">{"** "}</span>
                                                เดินทางครั้งนี้ คุณพร้อมรับมือกับเหตุการณ์ที่ไม่คาดฝันแล้วหรือยัง?
                                                <span className="star">{" **"}</span>
                                            </p>
                                            <p className="text2">คุณยังไม่ได้ซื้อ ประกันการเดินทาง อย่าปล่อยให้ความไม่แน่นอนมาขัดจังหวะการเดินทางของคุณ!</p>
                                        </div>
                                    </div>
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
                        <div className="img-box">
                            <img src="./images/icons/prompt-pay.png" alt="" />
                        </div>
                        <QRCode value={qrCode} size={qrSize} level="M" />
                        <p className="account-name">บริษัท mylogo จำกัด</p>
                        <p className="account-number">660-5-65XXX-5</p>
                        <div className="time-box">
                            <p className="time"
                                style={{ color: Math.floor(timeLeft / 3600) == 0 && Math.floor(timeLeft % 3600 / 60) <= 5 && bookingStatus == 1 ? "var(--red)" : "" }}
                            ><ClockCircleOutlined /> {timeFormat}</p>
                            <p className="text">โปรดชำระเงินภายในเวลาที่กำหนด</p>
                        </div>
                        <form className="upload-form" onSubmit={showConfirm}>
                            <Upload {...props} id="upload-file">
                                <Button icon={<UploadOutlined />}
                                    disabled={bookingStatus == 1 || bookingStatus == 4 ? false : true}
                                >เลือกไฟล์</Button>
                            </Upload>
                            <button type="submit"
                                className="upload-btn"
                                disabled={bookingStatus == 1 || bookingStatus == 4 ? isUploadBtnDisabled : true}
                                style={{
                                    cursor: bookingStatus == 1 || bookingStatus == 4 && !isUploadBtnDisabled ? "pointer" : "not-allowed",
                                    opacity: bookingStatus == 1 || bookingStatus == 4 && !isUploadBtnDisabled ? "1" : "0.6"
                                }}
                            >อัพโหลดสลิป</button>
                        </form>
                        <button
                            className="cancel-btn btn"
                            onClick={showConfirmCancel}
                            disabled={bookingStatus == 1 || bookingStatus == 4 ? isUploadBtnDisabled : true}
                            style={{
                                cursor: bookingStatus == 1 || bookingStatus == 4 && !isUploadBtnDisabled ? "pointer" : "not-allowed",
                                opacity: bookingStatus == 1 || bookingStatus == 4 && !isUploadBtnDisabled ? "1" : "0.6"
                            }}
                        >ยกเลิกการจอง</button>
                    </div>
                </div>
            </section >
        </div >
    )
}
export default Payment