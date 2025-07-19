import { useEffect, useState } from "react";
import { Row, Col, Button } from 'antd';
import { LeftOutlined } from "@ant-design/icons";
import moment from 'moment';
import "./DetailPackageManage.css";
import { TourPackagesInterface } from "../../../interfaces/ITourPackages";
import { apiUrl, GetPersonTypes, GetRoomTypes, GetScheduleActivity, GetTourPackageByID, GetTourSchedulesByPackageID } from "../../../services/http";
import { PersonTypesInterface } from "../../../interfaces/IPersonTypes";
import { RoomTypesInterface } from "../../../interfaces/IRoomTypes";
import { TourSchedulesInterface } from "../../../interfaces/ITourSchedules";
import { ScheduleActivitiesG } from "../../../interfaces/IScheduleActivitise";
import CustomMediaLoading from "../../../components/employeeLoading/CustomMediaLoading";

function DetailPackageManage() {

    const [scheduleActivities, setScheduleActivities] = useState<ScheduleActivitiesG[]>([]);
    const [tourPackage, setTourPackage] = useState<TourPackagesInterface>();
    const [personTypes, setPersonTypes] = useState<PersonTypesInterface[]>();
    const [roomTypes, setRoomTypes] = useState<RoomTypesInterface[]>();
    const [tourSchedules, setTourSchedules] = useState<TourSchedulesInterface[]>([]);

    const [bigImage, setBigImage] = useState<string>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    async function getTourPackage() {
        const resTourPackage = await GetTourPackageByID(Number(tourPackageID));
        if (resTourPackage) {
            setTourPackage(resTourPackage);
            console.log(resTourPackage);

        }
    }

    async function getTourSchedules() {
        const resSchedules = await GetTourSchedulesByPackageID(Number(tourPackageID));
        if (resSchedules) {
            console.log(resSchedules);
            setTourSchedules(resSchedules);
        }
    }

    async function getPersonTypes() {
        const resPersonType = await GetPersonTypes();
        if (resPersonType) {
            setPersonTypes(resPersonType)
        }
    }

    async function getRoomTypes() {
        const resRoomType = await GetRoomTypes();
        if (resRoomType) {
            setRoomTypes(resRoomType)
        }
    }

    async function getScheduleActivities() {
        try {
            const scheduleActivities = await GetScheduleActivity(Number(tourPackageID));

            if (scheduleActivities && Array.isArray(scheduleActivities)) {
                console.log("ok", scheduleActivities);
                setScheduleActivities(scheduleActivities);
            } else {
                console.log("No schedule activities found");
            }
        } catch (error) {
            console.error("Error fetching schedule activities:", error);
        }
    }

    async function fetchData() {
        try {
            getTourPackage()
            getPersonTypes()
            getRoomTypes()
            getTourSchedules()
            getScheduleActivities()
            formattedSchedule
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchData()
    }, [isLoading]);

    const tourPackageID = localStorage.getItem("tourPackageID");

    const content0 = document.querySelector(".content0");
    if (content0 && tourPackage?.TourDescriptions?.Intro) {
        content0.innerHTML = tourPackage.TourDescriptions.Intro.replace(/\n/g, "<br>");
    }

    const content1 = document.querySelector(".content1");
    if (content1 && tourPackage?.TourDescriptions?.PackageDetail) {
        content1.innerHTML = tourPackage.TourDescriptions.PackageDetail.replace(/\n/g, "<br>");
    }

    const content2 = document.querySelector(".content2");
    if (content2 && tourPackage?.TourDescriptions?.TripHighlight) {
        content2.innerHTML = tourPackage.TourDescriptions.TripHighlight.replace(/\n/g, "<br>");
    }

    const content3 = document.querySelector(".content3");
    if (content3 && tourPackage?.TourDescriptions?.PlacesHighlight) {
        content3.innerHTML = tourPackage.TourDescriptions.PlacesHighlight.replace(/\n/g, "<br>");
    }

    const imageElement = (tourPackage?.TourImages as any[])?.map(
        (image, index) => (
            <div className={`sImage ${bigImage === image.FilePath ? "selected" : ""}`} id={`image${index + 1}`} key={index} onClick={() => setBigImage(image.FilePath)}>
                <img src={`${apiUrl}/${image.FilePath}`} />
            </div>
        )
    );

    const formattedSchedule = tourSchedules.map((type) => ({
        id: type.ID,
        dateRange: `${type.StartDate ? moment(type.StartDate).format('DD/MM/YYYY') : ''} \u00A0\u00A0  ถึง  \u00A0\u00A0  ${type.EndDate ? moment(type.EndDate).format('DD/MM/YYYY') : ''}`,
        availableSlots: type.AvailableSlots || 0
    }));

    const priceElement1 = roomTypes?.map((type, index) => {
        const tourPrices = tourPackage?.TourPrices
        var p1
        tourPrices?.forEach((price, _) => {
            if (price.RoomTypeID === type.ID && price.PersonTypeID === personTypes?.[1]?.ID) {
                p1 = price.Price?.toLocaleString('th-TH', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })
            }
        });

        return p1 ? (
            <div className="price-box" key={index}>
                <Row gutter={16}>
                    <Col span={12}>
                        <span className="type-name">{type.TypeName}</span>
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                        <span className="price">฿{p1}</span>
                    </Col>
                </Row>
            </div>
        ) : null;

    })

    const priceElement2 = roomTypes?.map((type, index) => {
        const tourPrices = tourPackage?.TourPrices
        var p2
        tourPrices?.forEach((price, _) => {
            if (price.RoomTypeID === type.ID && price.PersonTypeID === personTypes?.[0]?.ID) {
                p2 = price.Price?.toLocaleString('th-TH', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })
            }
        });
        return p2 ? (
            <div className="price-box" key={index}>
                <Row gutter={16}>
                    <Col span={12}>
                        <span className="type-name">{type.TypeName}</span>
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                        <span className="price">฿{p2}</span>
                    </Col>
                </Row>
            </div>
        ) : null;
    })

    const handleBack = () => {
        window.history.back();
    };

    return isLoading ? (
        <CustomMediaLoading
            message="กำลังโหลดข้อมูล..."
            width={200}
            height={200}
        />
    ) : (
        <div className="tour-select-page-manage">
            <div className="sub-tour-select-page">
                <Button className="back-button" onClick={handleBack}>
                    <LeftOutlined style={{ marginRight: "-5px", marginLeft: "-5px" }} />ย้อนกลับ
                </Button>
                <section>
                    <div className="package-detail">
                        <div className="image-box">
                            <div className="big-image">
                                <img src={`${apiUrl}/${bigImage ? bigImage : tourPackage?.TourImages ? tourPackage?.TourImages[0].FilePath : ""}`} alt="" />
                            </div>
                            <div className="small-image">{imageElement}</div>
                        </div>
                        <div className="description-box">
                            <h1 className="tour-name"><b>{tourPackage?.PackageCode} {tourPackage?.TourName}</b></h1>
                            <hr />
                            <p className="content0 detail" style={{ textIndent: '2em', marginBottom: '1em', lineHeight: '1.6' }}></p>
                            <hr />
                            <div className="package-detail-box des-box">
                                <span className="title">รายละเอียดแพ็กเกจ</span>
                                <p className="content1 detail"></p>
                            </div>
                            <hr />
                            <div className="trip-highlight des-box">
                                <span className="title">ไฮไลท์ของทริป</span>
                                <p className="content2 detail"></p>
                            </div>
                            <hr />
                            <div className="places-highlight des-box">
                                <span className="title">จุดเด่นของแพ็กเกจ</span>
                                <p className="content3 detail"></p>
                            </div>
                            <hr />
                            <span><span className="title">จังหวัด:</span>&emsp;{tourPackage?.Province?.ProvinceName}
                                &emsp;&emsp;&emsp;&emsp;<span className="title">ระยะเวลาทริป</span>&emsp;{tourPackage?.Duration}</span></div>
                    </div>
                    <div className="travel-a">
                        <div className="travel-schedule" style={{ alignItems: 'center' }}><span className="title"><h2 className="title">รายการรอบทัวร์</h2></span>
                            <ul style={{ listStyle: 'none' }}>
                                {formattedSchedule.map((schedule) => (
                                    <li key={schedule.id}><br />
                                        <strong>รอบวันที่:&emsp;</strong> {schedule.dateRange}
                                        <strong>&emsp;&emsp;&emsp;ที่นั่งว่าง:&emsp;</strong> {schedule.availableSlots}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="travel-schedule" style={{ alignItems: 'center' }}>
                            <h2 className="title">ราคาแพ็กเกจทัวร์</h2><br />
                            <div className="person-type-title" style={{ display: 'flex', gap: '130px' }}>
                                <div className="type-box">
                                    <b>เด็ก/ผู้ใหญ่&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;(บาท/ท่าน)<hr /></b>
                                    {priceElement1}
                                </div><hr style={{ width: '1px', height: '100px', backgroundColor: 'Gray', border: 'none' }} />
                                <div className="type-box">
                                    <b>เด็กเล็ก&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;บาท/ท่าน<hr /></b>
                                    {priceElement2}
                                </div>
                            </div><br />
                        </div>
                    </div>
                    <div className="travel-plane">
                        <div className="title-box">
                            <h2 className="title">แผนการเดินทาง</h2>
                        </div>
                        <div>
                            <div>
                                <table className="custom-table">
                                    <thead>
                                        <tr>
                                            <th style={{ width: "8%" }}>วัน</th>
                                            <th style={{ width: "8%" }}>เวลา</th>
                                            <th style={{ width: "11%" }}>สถานที่</th>
                                            <th style={{ width: "13%" }}>ชื่อกิจกรรม</th>
                                            <th style={{ width: "30%" }}>กิจกรรม</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {scheduleActivities
                                            .sort((a, b) => {
                                                // เปรียบเทียบ Day ก่อน
                                                if (Number(a.Day) !== Number(b.Day)) {
                                                    return Number(a.Day) - Number(b.Day);
                                                }

                                                // ถ้าวันเท่ากัน ให้เปรียบเทียบเวลา แต่ตรวจสอบว่ามีค่าหรือไม่
                                                const timeA = a.Time ? new Date(a.Time).getTime() : 0;
                                                const timeB = b.Time ? new Date(b.Time).getTime() : 0;
                                                return timeA - timeB;
                                            })
                                            .map((activityScheduleMap, index) => (
                                                <tr key={activityScheduleMap.ID || index}>
                                                    <td>
                                                        {Number(activityScheduleMap.Day) === 1
                                                            ? "วันแรก"
                                                            : Number(activityScheduleMap.Day) > 1
                                                                ? `วันที่ ${activityScheduleMap.Day}`
                                                                : "N/A"}
                                                    </td>
                                                    <td>
                                                        {activityScheduleMap.Time
                                                            ? moment
                                                                .utc(activityScheduleMap.Time)
                                                                .utcOffset(0)
                                                                .format("HH:mm")
                                                            : "N/A"}{" "}
                                                        น.
                                                    </td>
                                                    <td>
                                                        {activityScheduleMap.Activity?.Location?.LocationName || "N/A"}
                                                    </td>
                                                    <td>{activityScheduleMap.Activity?.ActivityName || "N/A"}</td>
                                                    <td>{activityScheduleMap.Activity?.Description || "N/A"}</td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div></div>

                    </div>
                </section>
            </div>
        </div>
    )
}
export default DetailPackageManage;