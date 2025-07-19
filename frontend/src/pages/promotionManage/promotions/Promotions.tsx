import React, { useState, useEffect } from "react";
import { Input, message, Spin } from "antd";
import { SearchOutlined, CopyOutlined, ClockCircleOutlined } from "@ant-design/icons";
import "./Promotions.css";
import Navbar from "../../../components/navbar/Navbar";
import { ListActivePromotions, apiUrl } from "../../../services/http";
import moment from 'moment';
import Footer from "../../../components/footer/Footer";
import CustomMediaLoading from "../../../components/employeeLoading/CustomMediaLoading";

const Promotions: React.FC = () => {
  const [promotions, setPromotions] = useState<any[]>([]);
  const [filteredPromotions, setFilteredPromotions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [remainingTimes, setRemainingTimes] = useState<any[]>([]); // เก็บเวลาที่เหลือสำหรับแต่ละโปรโมชัน

  const imageUrl = `${apiUrl}/images/pagePromotions/pagepromotions.jpg`;

  const fetchPromotions = async () => {
    try {
      const response = await ListActivePromotions();
      setPromotions(response);
      setFilteredPromotions(response);
    } catch (error) {
      console.error("Error fetching promotions:", error);
      message.error("ไม่สามารถโหลดข้อมูลได้");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = promotions.filter(promo =>
      promo.PromotionName.toLowerCase().includes(query.toLowerCase()) ||
      promo.PromotionCode.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPromotions(filtered);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      message.success("คัดลอกโค้ดแล้ว!");
    }).catch((err) => {
      message.error("ไม่สามารถคัดลอกโค้ดได้");
      console.error("เกิดข้อผิดพลาด:", err);
    });
  };

  // ฟังก์ชันคำนวณเวลาที่เหลือ
  const calculateRemainingTime = (validUntil: string) => {
    const now = moment();
    const endTime = moment(validUntil).subtract(7, 'hours');
    const duration = moment.duration(endTime.diff(now));

    if (duration.asMilliseconds() <= 0) {
      return "หมดเวลาโปรโมชัน";
    } else {
      const days = duration.days();
      const hours = duration.hours();
      const minutes = duration.minutes();
      const seconds = duration.seconds();
      return `เหลือ ${days} วัน ${hours} ชั่วโมง ${minutes} นาที ${seconds} วินาที`;
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newRemainingTimes = filteredPromotions.map(promo => ({
        id: promo.ID,
        remaining: calculateRemainingTime(promo.ValidUntil)
      }));
      setRemainingTimes(newRemainingTimes);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [filteredPromotions]);

  return isLoading ? (
    <CustomMediaLoading
      message="กำลังโหลดข้อมูล..."
      width={200}
      height={200}
    />
  ) : (
    <div>
      <Navbar page={"promotion"} scrollOnTop />
      <div className="promotions-page">
        {/* Banner Section */}
        <div className="banner">
        <img src={imageUrl} alt="promotions" />
          <h1>
            โปรโมชันส่วนลด
          </h1>
          <p>
            โค้ดส่วนลดพิเศษจัดเต็ม!
          </p>
        </div>

        {/* Search Bar */}
        <div className="search-bar">
          <Input
            placeholder="ค้นหา"
            prefix={<SearchOutlined />}
            className="search-input"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {/* Promotions Section */}
        {isLoading ? (
          <div className="loading">
            <Spin size="large" />
          </div>
        ) : (
          <div className="promotion-cards">
            {filteredPromotions.map((promo) => {
              // หาเวลาที่เหลือจาก `remainingTimes`
              const remainingTime = remainingTimes.find(item => item.id === promo.ID)?.remaining || "";

              return (
                <div key={promo.ID} className="promotion-card">
                  {/* Header */}
                  <div className="promotion-header">
                    <div className="discount">
                      <div className="icon-box"><p className="tag-icon"><img src="../images/icons/discount.png" alt="" /></p></div>
                      <div className="percen">ส่วนลด {promo.DiscountPercentage}%</div>
                    </div>
                    <div className="type">{promo.PromotionName}</div>
                  </div>
                  {/* Details */}
                  <div className="promotion-details">
                    <p>ขั้นต่ำ {promo.MinimumPrice.toLocaleString()} ฿</p>
                  </div>
                  <div className="promotion-details1">
                    <p>
                      ตั้งแต่{" "}
                      {moment(promo.ValidFrom).format("DD/MM/YYYY")}{" "}
                      ถึง{" "}
                      {moment(promo.ValidUntil).format("DD/MM/YYYY")}
                    </p>
                    {/* เพิ่มเวลาที่เหลือ */}
                    <div className="promotion-details2">
                      <p><ClockCircleOutlined style={{ marginRight: '5px' }} />{remainingTime}</p>
                    </div>
                  </div>
                  <div className="code">
                    <span>{promo.PromotionCode}</span>
                    <CopyOutlined
                      className="copy-icon"
                      onClick={() => handleCopyCode(promo.PromotionCode)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Promotions;