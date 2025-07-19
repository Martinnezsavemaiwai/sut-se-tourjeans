import React, { useEffect, useState } from "react";
import { Table, Button, Input, Space, Tooltip, message, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, MoreOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { GetTourPackages, GetProvinces, DeleteTourPackageById } from "../../../services/http";
import { TourPackagesInterface } from "../../../interfaces/ITourPackages";
import { ProvincesInterface } from "../../../interfaces/IProvinces";
import { TourPricesInterface } from "../../../interfaces/ITourPrices";
import { notification } from "antd";
import "./TourPackageManage.css";
import { Link, useNavigate } from 'react-router-dom';
import Navbar from "../../../components/Navbar-Management/Navbar";
import CustomMediaLoading from "../../../components/employeeLoading/CustomMediaLoading";

const TourPackageManage: React.FC = () => {
    const [tourPackages, setTourPackages] = useState<TourPackagesInterface[]>([]);
    const [provices, setProvices] = useState<ProvincesInterface[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [searchText, setSearchText] = useState("");
    const navigate = useNavigate();

    // ดึงข้อมูลจาก API ของ Tour Packages
    const fetchTourPackages = async () => {
        try {
            const response = await GetTourPackages();
            setTourPackages(response);
        } catch (error) {
            console.error("Error fetching tour packages:", error);
            message.error("ไม่สามารถโหลดข้อมูลได้");
        } finally {
            setIsLoading(false);
        }
    };

    // ดึงข้อมูลจาก API ของ Provinces
    const fetchProvinces = async () => {
        try {
            const response = await GetProvinces();
            setProvices(response);
        } catch (error) {
            console.error("Error fetching provinces:", error);
            message.error("ไม่สามารถโหลดข้อมูลจังหวัดได้");
        }
    };

    useEffect(() => {
        fetchTourPackages();
        fetchProvinces();
    }, []);

    const getProvinceName = (provinceId: number) => {
        const province = provices.find((p) => p.ID === provinceId);
        return province ? province.ProvinceName : "ไม่ระบุ";
    };

    const columns = [
        {
            title: "รหัส",
            dataIndex: "PackageCode",
            key: "PackageCode",
        },
        {
            title: "ชื่อ",
            dataIndex: "TourName",
            key: "TourName",
        },
        {
            title: "จังหวัด",
            dataIndex: "ProvinceID",
            key: "ProvinceName",
            render: (provinceId: number) => getProvinceName(provinceId),
        },
        {
            title: "ระยะเวลา",
            dataIndex: "Duration",
            key: "Duration",
        },
        {
            title: "ราคา",
            dataIndex: "TourPrices",
            key: "TourPrices",
            render: (tour_prices: TourPricesInterface[] | undefined) => {
                if (!tour_prices?.length) return <div>ไม่มีราคา</div>;

                const uniquePrices = [...new Set(tour_prices.map(p => p.Price))].sort((a, b) => (a || 0) - (b || 0));

                return (
                    <div>
                        {uniquePrices.map((price, index) => (
                            <div key={index}>฿ {(price || 0).toLocaleString("en-US")}</div>
                        ))}
                    </div>
                );
            },
        },
        {
            title: "สถานะ",
            dataIndex: "tour_schedule_status_id",
            key: "status",
            render: (_: number, record: any) => {
                const totalAvailableSlots = record.TourSchedules.reduce((total: number, schedule: any) => total + schedule.AvailableSlots, 0);
                const statusName = totalAvailableSlots > 0 ? "ยังไม่เต็ม" : "เต็ม";
                const statusClass = totalAvailableSlots > 0 ? "available" : "full";
                return (
                    <span className={`status ${statusClass}`}>
                        {statusName}
                    </span>
                );
            },
        },
        {
            title: 'จัดการ',
            key: 'actions',
            render: (_: any, record: any) => (
                <Space>
                    <Tooltip title="แก้ไข">
                        <Button
                            shape="circle"
                            icon={<EditOutlined style={{ fontSize: "18px" }} />}
                            style={{ width: "38px", height: "38px", lineHeight: "38px" }}
                            onClick={() => navigate(`/tour-package-manage/edit-tour-package/${record.ID}`)}
                        />
                    </Tooltip>
                    <Tooltip title="ลบ">
                        <Button
                            shape="circle"
                            icon={<DeleteOutlined style={{ fontSize: "18px", color: "#FF8181" }} />}
                            style={{ width: "38px", height: "38px", lineHeight: "38px" }}
                            onClick={() => handleDelete(record.ID, record.PackageCode)}
                        />
                    </Tooltip>
                    <Link to={"/tour-package-manage/tour-details"} onClick={() => localStorage.setItem("tourPackageID", record.ID)} >
                        <Tooltip title="รายละเอียดเพิ่มเติม">
                            <Button
                                shape="circle"
                                icon={<MoreOutlined style={{ fontSize: "18px" }} />}
                                style={{ width: "38px", height: "38px", lineHeight: "38px" }}
                            />
                        </Tooltip>
                    </Link>

                </Space>
            ),
        },
    ];

    const filteredTours = tourPackages.filter((tour) => {
        // ตรวจสอบชื่อทัวร์
        const tourNameMatch = tour.TourName?.toLowerCase().includes(searchText.toLowerCase());

        // หาจังหวัดที่ตรงกับคำค้นหา
        const provinceNameMatch = provices.some((province) =>
            province.ProvinceName?.toLowerCase().includes(searchText.toLowerCase()) &&
            province.ID === tour.ProvinceID
        );
        // ตรวจสอบ Package Code
        const packageCodeMatch = tour.PackageCode?.toLowerCase().includes(searchText.toLowerCase());
        return tourNameMatch || provinceNameMatch || packageCodeMatch;
    });

    const handleDelete = async (id: number, packageCode: string) => {
        Modal.confirm({
            title: `คุณต้องการลบแพ็กเกจทัวร์ ${packageCode} หรือไม่?`,
            onOk: async () => {
                try {
                    const result = await DeleteTourPackageById(id.toString());
                    if (result) {
                        notification.success({
                            message: "ลบแพ็กเกจทัวร์สำเร็จ",
                            description: "แพ็กเกจทัวร์ถูกลบออกจากระบบแล้ว",
                            placement: "top",
                            duration: 3,
                        });
                        fetchTourPackages();
                    } else {
                        notification.error({
                            message: "ไม่สามารถลบแพ็กเกจทัวร์ได้",
                            description: "อาจมีข้อผิดพลาดในเซิร์ฟเวอร์หรือข้อมูลไม่ถูกต้อง",
                            placement: "top",
                            duration: 3,
                        });
                    }
                } catch (error) {
                    console.error("Error:", error);
                    notification.error({
                        message: "เกิดข้อผิดพลาด",
                        description: "ไม่สามารถลบแพ็กเกจทัวร์ได้ โปรดลองใหม่อีกครั้ง",
                        placement: "top",
                        duration: 3,
                    });
                }
            },
        });
    };


    return isLoading ? (
        <CustomMediaLoading
            message="กำลังโหลดข้อมูล..."
            width={200}
            height={200}
        />
    ) : (
        <div className="tour-packages-container-manage">
            <Navbar page={"tourpackage-management"} />
            {isLoading ? (
                <div className="loading-spinner">
                </div>
            ) : (
                <>
                    <div className="title-container">
                        <h1 className="tour-packages-title">จัดการแพ็กเกจทัวร์</h1>
                        <div className="tour-package-management-search-input">
                            <Input
                                prefix={<SearchOutlined />}
                                placeholder="ค้นหาแพ็กเกจ"
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                        </div>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            className="tour-package-management-add-button"
                            onClick={() => navigate("/tour-package-manage/create-tour-package")}
                        >
                            เพิ่มแพ็กเกจ
                        </Button>
                    </div>
                    <Table
                        className="tour-packages-table"
                        columns={columns}
                        dataSource={filteredTours}
                        rowKey="ID"
                        pagination={{
                            pageSize: 5,
                        }}
                    />
                </>
            )}
        </div>
    );
};

export default TourPackageManage;