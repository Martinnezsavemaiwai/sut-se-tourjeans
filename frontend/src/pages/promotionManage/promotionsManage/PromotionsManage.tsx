import React, { useEffect, useState } from "react";
import { Table, Button, Input, Space, Tooltip, message, Modal, notification } from "antd";
import { EditOutlined, DeleteOutlined, MoreOutlined, SearchOutlined, PlusOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { ListPromotions, DeletePromotionById } from "../../../services/http";
import { PromotionsInterfaceG } from "../../../interfaces/IPromotions";
import "./PromotionsManage.css";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Navbar from "../../../components/Navbar-Management/Navbar";
import CustomMediaLoading from "../../../components/employeeLoading/CustomMediaLoading";

const PromotionsManage: React.FC = () => {
    const [promotions, setPromotions] = useState<PromotionsInterfaceG[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [searchText, setSearchText] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedPromotion, setSelectedPromotion] = useState<PromotionsInterfaceG | null>(null);
    const navigate = useNavigate();

    const [remainingTime, setRemainingTime] = useState("");

    useEffect(() => {
        const updateRemainingTime = () => {
            const now = moment();
            const validFrom = moment(selectedPromotion?.ValidFrom).subtract(7, 'hours');
            const validUntil = moment(selectedPromotion?.ValidUntil).subtract(7, 'hours');

            const durationFromStart = moment.duration(validFrom.diff(now));
            const durationUntilEnd = moment.duration(validUntil.diff(now));

            if (durationFromStart.asMilliseconds() > 0) {
                setRemainingTime("ยังไม่ถึงกำหนดเปิดโปรโมชัน");
            } else if (durationUntilEnd.asMilliseconds() <= 0) {
                setRemainingTime("หมดเวลาโปรโมชัน");
            } else {
                const days = durationUntilEnd.days();
                const hours = durationUntilEnd.hours();
                const minutes = durationUntilEnd.minutes();
                const seconds = durationUntilEnd.seconds();
                setRemainingTime(`เหลืออีก ${days} วัน ${hours} ชั่วโมง ${minutes} นาที ${seconds} วินาที`);
            }
        };

        if (selectedPromotion) {
            updateRemainingTime();
            const intervalId = setInterval(updateRemainingTime, 1000);

            return () => clearInterval(intervalId);
        }
    }, [selectedPromotion]);

    const validFromMidnight = moment(selectedPromotion?.ValidFrom).utc().format("DD/MM/YYYY HH:mm:ss");
    const validUntilMidnight = moment(selectedPromotion?.ValidUntil).utc().format("DD/MM/YYYY HH:mm:ss");

    const fetchPromotions = async () => {
        try {
            const response = await ListPromotions();
            setPromotions(response);
        } catch (error) {
            console.error("Error fetching tour packages:", error);
            message.error("ไม่สามารถโหลดข้อมูลได้");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPromotions();
    }, []);

    const showModal = (promotion: PromotionsInterfaceG) => {
        setSelectedPromotion(promotion);
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const columns = [
        {
            title: "รหัสโค้ด",
            dataIndex: "PromotionCode",
            key: "PromotionCode",
        },
        {
            title: "ชื่อ",
            dataIndex: "PromotionName",
            key: "PromotionName",
        },
        {
            title: "%ส่วนลด",
            dataIndex: "DiscountPercentage",
            key: "DiscountPercentage",
            render: (text: number) => {
                return text !== undefined && text !== null
                    ? `${text.toFixed(2)}%`
                    : "ไม่มีข้อมูล";
            },
        },
        {
            title: "เริ่มต้นโปรโมชัน",
            dataIndex: "ValidFrom",
            key: "ValidFrom",
            render: (ValidFrom: string) =>
                ValidFrom ? (
                    <div>
                        {moment(ValidFrom).utc().format("DD/MM/YYYY")}
                        <br />
                        {moment(ValidFrom).utc().format("HH:mm:ss")} น.
                    </div>
                ) : (
                    "ไม่มีข้อมูล"
                ),
        },
        {
            title: "สิ้นสุดโปรโมชัน",
            dataIndex: "ValidUntil",
            key: "ValidUntil",
            render: (validUntil: string) =>
                validUntil ? (
                    <div>
                        {moment(validUntil).utc().format("DD/MM/YYYY")}
                        <br />
                        {moment(validUntil).utc().format("HH:mm:ss")} น.
                    </div>
                ) : (
                    "ไม่มีข้อมูล"
                ),
        },
        {
            title: "ราคาจองขั้นตํ่า (บาท)",
            dataIndex: "MinimumPrice",
            key: "MinimumPrice",
            render: (price: number) =>
                price !== undefined && price !== null
                    ? `${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    : "ไม่มีข้อมูล",
        },
        {
            title: "สถานะ",
            key: "PromotionStatus",
            render: (record: any) => {
                const statusName = record.PromotionStatus?.StatusName || "ไม่ทราบสถานะ";

                const statusClass =
                    statusName === "เปิดใช้งาน"
                        ? "statusP availableP"
                        : statusName === "ปิดใช้งาน"
                            ? "statusP fullP"
                            : "statusP";

                return <span className={statusClass}>{statusName}</span>;
            },
        },
        {
            title: "จัดการ",
            key: "actions",
            render: (_: any, record: PromotionsInterfaceG) => (
                <Space>
                    <Tooltip title="แก้ไข">
                        <Button
                            shape="circle"
                            icon={<EditOutlined style={{ fontSize: "18px" }} />}
                            style={{ width: "38px", height: "38px", lineHeight: "38px" }}
                            onClick={() => navigate(`/promotions-manage/edit-promotion/${record.ID}`)}
                        />
                    </Tooltip>
                    <Tooltip title="ลบ">
                        <Button
                            shape="circle"
                            icon={<DeleteOutlined style={{ fontSize: "18px", color: "#FF8181" }} />}
                            style={{ width: "38px", height: "38px", lineHeight: "38px" }}
                            onClick={() => {
                                if (record?.ID) {
                                    handleDelete(record.ID, record.PromotionCode);
                                }
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="รายละเอียดเพิ่มเติม">
                        <Button
                            shape="circle"
                            icon={<MoreOutlined style={{ fontSize: "18px" }} />}
                            style={{ width: "38px", height: "38px", lineHeight: "38px" }}
                            onClick={() => showModal(record)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const filteredPromotion = promotions.filter((promotion) => {
        const promotionNameMatch = promotion.PromotionName?.toLowerCase().includes(searchText.toLowerCase());
        const promotionCodeMatch = promotion.PromotionCode?.toLowerCase().includes(searchText.toLowerCase());
        return promotionNameMatch || promotionCodeMatch;
    });

    const handleDelete = async (id: number, promotionCode: string | undefined) => {
        Modal.confirm({
            title: `คุณต้องการลบโปรโมชัน ${promotionCode} หรือไม่?`,
            onOk: async () => {
                try {
                    const result = await DeletePromotionById(id);
                    if (result) {
                        notification.success({
                            message: "ลบโปรโมชันสำเร็จ",
                            description: "โปรโมชันถูกลบออกจากระบบแล้ว",
                            placement: "top",
                            duration: 3,
                        });
                        fetchPromotions();
                    } else {
                        notification.error({
                            message: "ไม่สามารถลบโปรโมชันได้",
                            description: "อาจมีข้อผิดพลาดในเซิร์ฟเวอร์หรือข้อมูลไม่ถูกต้อง",
                            placement: "top",
                            duration: 3,
                        });
                    }
                } catch (error) {
                    console.error("Error:", error);
                    notification.error({
                        message: "เกิดข้อผิดพลาด",
                        description: "ไม่สามารถลบโปรโมชันได้ โปรดลองใหม่อีกครั้ง",
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
        <div className="tour-promotions-container-manage">
            <Navbar page={"promotions-management"} />
            {isLoading ? (
                <div className="loading-spinner"></div>
            ) : (
                <>
                    <div className="title-container">
                        <h1 className="tour-promotions-title">จัดการโปรโมชันส่วนลด</h1>
                        <div className="tour-promotions-management-search-input">
                            <Input
                                prefix={<SearchOutlined />}
                                placeholder="ค้นหาโปรโมชันส่วนลด"
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                        </div>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            className="tour-promotions-management-add-button"
                            onClick={() => navigate("/promotions-manage/create-tour-promotion")}
                        >
                            เพิ่มโปรโมชัน
                        </Button>
                    </div>
                    <Table
                        className="tour-promotions-table"
                        columns={columns}
                        dataSource={filteredPromotion}
                        rowKey="ID"
                        pagination={{
                            pageSize: 5,
                        }}
                    />
                </>
            )}
            <Modal
                title="รายละเอียดโปรโมชันส่วนลด"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        ปิด
                    </Button>,
                ]}
                width={700}
                style={{ marginTop: '-43px' }}
                closable={false}
            >
                {selectedPromotion && (
                    <div className="promotion-container">
                        <div className="promotion-block">
                            <div><span><b>รหัสโค้ด</b></span></div>
                            <div><span className="sub-promotion-block">{selectedPromotion?.PromotionCode ?? "ไม่มีข้อมูล"}</span></div>
                        </div>
                        <div className="flex-block">
                            <div className="info-column">
                                <span className="info-label"><b>ชื่อโปรโมชันส่วนลด : </b></span>
                                <span className="value" style={{ textIndent: "2em" }}>{selectedPromotion?.PromotionName ?? "ไม่มีข้อมูล"}</span>
                                <span className="info-label"><b>ราคาจองขั้นต่ำ : </b></span>
                                <span className="value" style={{ textIndent: "2em" }}>
                                    {selectedPromotion?.MinimumPrice != null
                                        ? selectedPromotion.MinimumPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                        : "ไม่มีข้อมูล"} บาท
                                </span>
                                <span className="info-label"><b>เปอร์เซ็นส่วนลด : </b></span>
                                <span className="value" style={{ textIndent: "2em" }}>
                                    {selectedPromotion?.DiscountPercentage ? selectedPromotion.DiscountPercentage.toFixed(2) : "ไม่มีข้อมูล"}%
                                </span>
                            </div>
                            <div className="info-column1">
                                <span className="info-label"><b>เริ่มต้น : </b></span>
                                <span className="value" style={{ textIndent: "2em" }}>{validFromMidnight} น.</span>
                                <span className="info-label"><b>สิ้นสุด : </b></span>
                                <span className="value" style={{ textIndent: "2em" }}>{validUntilMidnight} น.</span>
                            </div>
                        </div>
                        <div className={`promotion-status-block ${selectedPromotion?.PromotionStatus?.StatusName === "ปิดใช้งาน" ? "closed" : "open"}`}>
                            <span className="info-label">
                                <b>สถานะ : </b>
                                <span>
                                    {selectedPromotion?.PromotionStatus?.StatusName ?? "ไม่ทราบสถานะ"}
                                </span>
                            </span>
                        </div>
                        <div className="sub1-promotion-block">
                            <span className="t-time1"><ClockCircleOutlined style={{ marginRight: '5px', fontSize: '17px' }} />{remainingTime}</span>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default PromotionsManage;