import { useEffect, useState } from "react"
import Navbar from "../../components/navbar/Navbar"
import { apiUrl, GetBookingByCustomerID, GetCustomerByID, GetGenders, UpdateBookingByID, UpdateCustomerByIDuseAnt, UpdateTourScheduleByID } from "../../services/http"
import "./Profile.css"
import { BookingsInterface } from "../../interfaces/IBookings"
import { Button, Col, Form, Input, message, Modal, Row, Select, Space, Steps, Upload, UploadFile, UploadProps } from "antd"

const { confirm } = Modal
import ImgCrop from "antd-img-crop"
import { ClockCircleOutlined, PlusOutlined } from "@ant-design/icons"
import { CustomersInterface } from "../../interfaces/ICustomers"
import { GendersInterface } from "../../interfaces/IGenders"
import { Link } from "react-router-dom"
import CustomMediaLoading from "../../components/employeeLoading/CustomMediaLoading"
import { TourSchedulesInterface } from "../../interfaces/ITourSchedules"
const { Option } = Select;

function Profile() {

    const [bookings, setBookings] = useState<BookingsInterface[]>()
    const [customer, setCustomer] = useState<CustomersInterface>()
    const [genders, setGenders] = useState<GendersInterface[]>()

    const [statusIsClicked, setStatusIsClicked] = useState(false)
    const [elementClicked, setElementClicked] = useState<number>()

    const [btnIsClicked, setBtnIsClicked] = useState<number>(1)
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const [form] = Form.useForm()
    const [fileList, setFileList] = useState<UploadFile[]>([])

    const [messageApi, contextHolder] = message.useMessage()

    const [timeLeft, setTimeLeft] = useState<Record<number, number>>({})

    const customerID = localStorage.getItem("id")
    const [imageUrl, setImageUrl] = useState("")

    async function getBookings() {
        const res = await GetBookingByCustomerID(Number(customerID))
        if (res) {
            setBookings(res)
        }
    }

    async function getCustomer() {
        const res = await GetCustomerByID(Number(customerID))
        if (res) {
            setCustomer(res)
        }
    }

    async function getGenders() {
        const res = await GetGenders()
        if (res) {
            setGenders(res)
        }
    }

    function fetchData() {
        try {
            getBookings()
            getCustomer()
            getGenders()
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setIsLoading(false);
        }
    }

    function toPayment(id: number | undefined) {
        localStorage.setItem("booking-id", String(id))
        setTimeout(() => {
            location.href = "/payment";
        });
    }

    function handleElementClick(id: number | undefined) {
        if (!id) return
        if (elementClicked === id) {
            setStatusIsClicked((prev) => !prev)
        } else {
            setElementClicked(id)
            setStatusIsClicked(true)
        }
    }

    function handleBtnClick(index: number) {
        setBtnIsClicked(index)
    }

    function showConfirm() {
        confirm({
            title: "ออกจากระบบ",
            content: "คุณต้องการจะออกจากระบบหรือไม่?",
            okText: "ยืนยัน",
            cancelText: "ยกเลิก",
            centered: true,
            okButtonProps: {
                style: { backgroundColor: "#FF4545", borderColor: "#FF4545" }
            },
            onOk() {
                localStorage.clear()
                setTimeout(() => {
                    location.href = "/login-customer";
                }, 2000);
                messageApi.open({
                    type: "success",
                    content: "ออกจากระบบสำเร็จ",
                })
            },
        })
    }

    function handleCancel() {
        form.setFieldsValue(customer);
    }

    const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    }

    const onPreview = async (file: UploadFile) => {
        let src = file.url as string;
        if (!src && file.originFileObj) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj as Blob);
                reader.onload = () => resolve(reader.result as string);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    }

    async function handleUpdateProfile(value: any) {
        if (fileList && fileList.length > 0) {
            const file = fileList[0];

            const formData = new FormData();

            if (file.originFileObj) {
                formData.append("file", file.originFileObj)
            }

            const pattern = /^\d{10}$/
            if (pattern.test(value.PhoneNumber)) {
                value.PhoneNumber = `${value.PhoneNumber.slice(0, 3)}-${value.PhoneNumber.slice(3, 6)}-${value.PhoneNumber.slice(6)}`
            }

            const res = await UpdateCustomerByIDuseAnt(value, Number(customerID), formData);
            if (res) {
                setTimeout(() => {
                    window.location.reload();
                }, 2000)
                messageApi.open({
                    type: "success",
                    content: "อัพเดตโปรไฟล์สำเร็จ",
                })
            }
            else {
                messageApi.open({
                    type: "error",
                    content: "เกิดข้อผิดพลาดในการอัพเดตโปรไฟล์",
                })
            }
        } else {
            messageApi.open({
                type: "error",
                content: "โปรดอัพโหลดรูปโปรไฟล์",
            })
        }
    }

    async function cancelBooking(booking: BookingsInterface) {
        try {
            const tourSchedule = booking.TourSchedule
            const bk: BookingsInterface = {
                BookingStatusID: 5,
                CancellationReasonID: 4,
            }
            const resUpBooking = await UpdateBookingByID(bk, Number(booking.ID))
            if (resUpBooking) {
                const tourScheduleData: TourSchedulesInterface = {
                    AvailableSlots: (tourSchedule?.AvailableSlots || 0) + (booking?.TotalQuantity || 0),
                    TourScheduleStatusID: 2,
                }

                UpdateTourScheduleByID(tourScheduleData, tourSchedule?.ID)

                setTimeout(() => {
                    window.location.reload();
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

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        if (customer?.ProfilePath) {
            setImageUrl(`${apiUrl}/${customer?.ProfilePath}?t=${new Date().getTime()}`)
        }
        else {
            setFileList(
                [{
                    uid: '-1',
                    name: 'customer.jpg',
                    status: 'done',
                    url: "/images/icons/user.png"
                }]
            )
        }
    }, [customer])

    useEffect(() => {
        setFileList(
            customer?.ProfilePath != "" ? [{
                uid: '-1',
                name: 'customer.jpg',
                status: 'done',
                url: imageUrl
            }] : []
        )
    }, [imageUrl])

    useEffect(() => {
        const your_booking_container = document.querySelector(".your-booking-container")
        const payment_history_container = document.querySelector(".payment-history-container")
        const edit_profile_container = document.querySelector(".edit-profile-container")
        if (btnIsClicked == 1) {
            payment_history_container?.classList.remove("active")
            edit_profile_container?.classList.remove("active")
            your_booking_container?.classList.add("active")
        }
        else if (btnIsClicked == 2) {
            your_booking_container?.classList.remove("active")
            edit_profile_container?.classList.remove("active")
            payment_history_container?.classList.add("active")
        }
        else if (btnIsClicked == 3) {
            payment_history_container?.classList.remove("active")
            your_booking_container?.classList.remove("active")
            edit_profile_container?.classList.add("active")
        }
    }, [btnIsClicked, customer])

    useEffect(() => {
        if (customer) {
            form.setFieldsValue(customer);
        }
    }, [customer, form])

    useEffect(() => {
        const intervals: Record<number, NodeJS.Timeout> = {}

        bookings?.forEach((booking) => {
            if (booking.BookingStatusID === 1) {
                const createdTime = booking.BookingDate ? new Date(booking.BookingDate).getTime() : 0
                const expiryTime = createdTime + 40 * 60 * 1000

                const bookingID = booking.ID

                if (bookingID !== undefined) {
                    intervals[bookingID] = setInterval(() => {
                        const now = Date.now()
                        const remaining = Math.max(0, expiryTime - now)

                        setTimeLeft((prev) => ({
                            ...prev,
                            [bookingID]: Math.floor(remaining / 1000),
                        }))

                        if (remaining <= 0) {
                            clearInterval(intervals[bookingID])
                            cancelBooking(booking)
                        }
                    }, 1000);
                }
            }
        })

        return () => {
            Object.values(intervals).forEach(clearInterval);
        }
    }, [bookings])

    const bookingElement = bookings?.map((booking, index) => {
        const bookingStatus = booking.BookingStatusID

        const timeLeftFormatted = booking.ID !== undefined ? timeLeft[booking.ID] || 0 : 0

        const timeFormat =
            `${Math.floor(timeLeftFormatted / 3600) < 10 ? 0 : ''}${Math.floor(timeLeftFormatted / 3600)}:` +
            `${Math.floor(timeLeftFormatted % 3600 / 60) < 10 ? 0 : ''}${Math.floor(timeLeftFormatted % 3600 / 60)}:` +
            `${timeLeftFormatted % 60 < 10 ? 0 : ''}${timeLeftFormatted % 60}`

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

        return (
            <div className="booking-box" key={index} style={{ borderColor: bookingStatus == 3 ? "var(--blue)" : bookingStatus == 4 ? "var(--lightorange)" : bookingStatus == 5 ? "var(--red)" : "var(--border-color-2)" }}>
                <div className="container">
                    <div className="text-box">
                        <span className="tour-name">{booking.TourSchedule?.TourPackage?.TourName}</span>
                        <span className="tourID">รหัสแพ็กเกจ: {booking.TourSchedule?.TourPackage?.PackageCode}</span>
                    </div>
                    <div className="btn-box">
                        {
                            bookingStatus===1 ? (
                                <div className="time">
                                    <ClockCircleOutlined/>
                                    <div className="text">{timeFormat}</div>
                                </div>
                            ) : (
                                <></>
                            )
                        }
                        <button className="check-detail-btn check-btn" onClick={() => toPayment(booking?.ID)}>รายละเอียด</button>
                        <button className="check-status-btn check-btn" onClick={() => handleElementClick(booking.ID)}>สถานะการจอง</button>
                    </div>
                </div>
                {
                    elementClicked == booking?.ID && statusIsClicked ? (
                        <div className="status-box">
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
                    ) : (<></>)
                }
            </div>
        )
    })

    const bookingHavePayment = bookings?.filter((booking) => booking.Payment !== null && booking.Payment !== undefined)

    const paymentElement = bookingHavePayment?.map((booking, index) => {
        const payment = booking.Payment
        const date = payment?.PaymentDate?.slice(0, 10)
        const time = payment?.PaymentDate?.slice(11, 19)
        const slip = `${apiUrl}/${payment?.Slip?.FilePath}`
        return (
            <div key={index} className="payment-box">
                <div>
                    <div className="date-box">
                        <p className="date">{`วันที่ ${date}`}</p>
                        <p className="time">{`เวลา ${time} น.`}</p>
                    </div>
                    <p className="amount">
                        {`จำนวนเงิน ${payment?.Amount?.toLocaleString('th-TH', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })} บาท`}
                    </p>
                </div>
                <a href={slip} target="_blank" className="check-slip">ตรวจสอบสลิป</a>
            </div>
        )
    })

    return isLoading ? (
        <CustomMediaLoading
            message="กำลังโหลดข้อมูล..."
            width={200}
            height={200}
        />
    ) : (
        <div className="profile-page">
            {contextHolder}
            <Navbar page={"profile"} scrollOnTop />
            <section>
                <div className="card-dashbord">
                    <div className="img-box">
                        <img src={customer?.ProfilePath ? imageUrl : "./images/icons/user.png"} alt="" />
                    </div>
                    <div className="profile-detail">
                        <span className="username">
                            {customer?.UserName}
                            {
                                customer?.GenderID == 3 ? (null) : (
                                    <div className="gender-img">
                                        <img src={
                                            customer?.GenderID == 1 ? "./images/icons/male.png" : "./images/icons/female.png"
                                        } alt="" />
                                    </div>
                                )
                            }
                        </span>
                        <span className="name">{`${customer?.FirstName} ${customer?.LastName}`}</span>
                        <span className="email">{customer?.Email}</span>
                    </div>
                    <div className="nav-btn-box">
                        <div className="top-box">
                            <button
                                className={`your-booking-btn btn ${btnIsClicked == 1 ? 'active' : ''}`}
                                onClick={() => handleBtnClick(1)}
                            >การจองของคุณ</button>
                            <button
                                className={`payment-history-btn btn ${btnIsClicked == 2 ? 'active' : ''}`}
                                onClick={() => handleBtnClick(2)}
                            >ประวัติการชำระเงิน</button>
                            <button
                                className={`edit-profile-btn btn ${btnIsClicked == 3 ? 'active' : ''}`}
                                onClick={() => handleBtnClick(3)}
                            >แก้ไขโปรไฟล์</button>
                        </div>
                        <div className="bottom-box">
                            <Button className="logout-btn btn" type="primary" onClick={showConfirm}>ออกจากระบบ</Button>
                        </div>
                    </div>
                </div>
                <div className="card-detail">
                    <div className="your-booking-container con">
                        <h5 className="title">การจองของคุณ</h5>
                        <div className="sub-container">
                            {
                                bookings && bookings?.length > 0 ? bookingElement : (
                                    <div className="no-data">
                                        <div className="img-box">
                                            <img src="./images/icons/no-booking.png" alt="" />
                                        </div>
                                        <span className="text">คุณยังไม่มีรายการจองทัวร์</span>
                                        <Link to="/tour-package">
                                            <button className="booking-now nodata-btn">จองทัวร์เลย!</button>
                                        </Link>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    <div className="payment-history-container con">
                        <h5 className="title">ประวัติการชำระเงิน</h5>
                        <div className="sub-container">
                            {
                                bookingHavePayment && bookingHavePayment?.length > 0 ? paymentElement : (
                                    <div className="no-data">
                                        <div className="img-box">
                                            <img src="./images/icons/no-payment.png" alt="" />
                                        </div>
                                        <span className="text">คุณยังไม่มีรายการชำระเงิน</span>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    <div className="edit-profile-container con">
                        <h5 className="title">แก้ไขโปรไฟล์</h5>
                        <div className="sub-container">
                            <Form className="edit-form"
                                form={form}
                                onFinish={handleUpdateProfile}
                            >
                                <Row gutter={[20, 1]}>
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24} >
                                        <Form.Item
                                            name="ProfilePath"
                                            valuePropName="fileList"
                                            className="upload-profile"
                                        >
                                            <ImgCrop rotationSlider>
                                                <Upload
                                                    fileList={fileList}
                                                    onChange={onChange}
                                                    onPreview={onPreview}
                                                    beforeUpload={(file) => {
                                                        setFileList([...fileList, file]);
                                                        return false;
                                                    }}
                                                    maxCount={1}
                                                    multiple={false}
                                                    listType="picture-card"
                                                    defaultFileList={fileList}
                                                >
                                                    <div>
                                                        <PlusOutlined />
                                                        <div style={{
                                                            marginTop: 8,
                                                            fontFamily: "Noto Sans Thai, sans-serif"
                                                        }}>อัพโหลด</div>
                                                    </div>
                                                </Upload>
                                            </ImgCrop>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                                        <label>ชื่อผู้ใช้</label>
                                        <Form.Item
                                            name="UserName"
                                            rules={[{ required: true, message: 'Please input your username!' }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                                        <label>ชื่อ</label>
                                        <Form.Item
                                            name="FirstName"
                                            rules={[{ required: true, message: 'Please input your firstname!' }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                                        <label>นามสกุล</label>
                                        <Form.Item
                                            name="LastName"
                                            rules={[{ required: true, message: 'Please input your lastname!' }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                                        <label>อีเมล</label>
                                        <Form.Item
                                            name="Email"
                                            rules={[
                                                { required: true, message: 'Please input your email!' },
                                                { type: 'email', message: 'Please enter a valid email!' },
                                            ]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                                        <label>เบอร์โทรศัพท์</label>
                                        <Form.Item
                                            name="PhoneNumber"
                                            rules={[
                                                { required: true, message: 'Please input your phone number!' },
                                                {
                                                    validator: (_, value) => {
                                                        const pattern1 = /^\d{10}$/
                                                        const pattern2 = /^0\d{2}[-\s]?\d{3}[-\s]?\d{4}$/
                                                        if (!value || pattern1.test(value) || pattern2.test(value)) {
                                                            return Promise.resolve()
                                                        }
                                                        return Promise.reject(new Error('Invalid phone number (format 0111111111 or 011-111-1111)'))
                                                    },
                                                },
                                            ]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                                        <label>เพศ</label>
                                        <Form.Item
                                            name="GenderID"
                                            rules={[
                                                { required: true, message: 'Please select your gender!' },
                                            ]}
                                        >
                                            <Select allowClear>
                                                {genders?.map((item) => (
                                                    <Option value={item.ID} key={item.GenderName}>
                                                        {item.GenderName}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row justify="end">
                                    <Col style={{ marginTop: "40px" }}>
                                        <Form.Item>
                                            <Space>
                                                <button
                                                    className="cancel-btn btn"
                                                    onClick={handleCancel}
                                                >
                                                    ยกเลิก
                                                </button>
                                                <button type="submit" className="submit-btn btn">
                                                    ยืนยัน
                                                </button>
                                            </Space>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
export default Profile