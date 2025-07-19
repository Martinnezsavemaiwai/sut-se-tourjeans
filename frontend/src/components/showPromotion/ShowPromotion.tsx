import { Link } from "react-router-dom"
import "./ShowPromotion.css"
import { useEffect, useRef, useState } from "react";
import { PromotionsInterfaceG } from "../../interfaces/IPromotions";
import { GetPromotions } from "../../services/http";
import { CopyOutlined } from "@ant-design/icons";
import { message } from "antd";

function ShowPromotion() {
    const [promotions, setPromotions] = useState<PromotionsInterfaceG[]>()

    const scrollRef = useRef<HTMLDivElement | null>(null)
    const [scrollDirection, setScrollDirection] = useState(1)
    const [isUserScrolling, setIsUserScrolling] = useState(false)

    async function getPromotions() {
        let res = await GetPromotions()
        if (res) {
            setPromotions(res);
        }
    }

    async function handleCopy(code: string) {
        try {
            await navigator.clipboard.writeText(code)
            message.success("คัดลอกโค้ดเรียบร้อยแล้ว!")
        } catch (err) {
            message.error("ไม่สามารถคัดลอกโค้ดได้")
        }
    }

    useEffect(() => {
        getPromotions()
    }, [])

    useEffect(() => {
        let animationFrameId: number;
        if (isUserScrolling) {
            setTimeout(() => {
                setIsUserScrolling(false)
            }, 1000)
        }
        else {
            const smoothScroll = () => {
                if (scrollRef.current) {
                    const maxScrollLeft =
                        scrollRef.current.scrollWidth - scrollRef.current.clientWidth;

                    scrollRef.current.scrollLeft += scrollDirection;

                    if (scrollRef.current.scrollLeft >= maxScrollLeft) {
                        setScrollDirection(-1);
                    } else if (scrollRef.current.scrollLeft <= 0) {
                        setScrollDirection(1);
                    }
                }

                animationFrameId = requestAnimationFrame(smoothScroll);
            };

            animationFrameId = requestAnimationFrame(smoothScroll);

            return () => cancelAnimationFrame(animationFrameId);
        }
    }, [scrollDirection, isUserScrolling]);

    const promotionElement = promotions?.map((item, index) => {
        const validFrom = `${item.ValidFrom?.slice(8, 10)}/${item.ValidFrom?.slice(5, 7)}/${item.ValidFrom?.slice(0, 4)}`
        const validUntil = `${item.ValidUntil?.slice(8, 10)}/${item.ValidUntil?.slice(5, 7)}/${item.ValidUntil?.slice(0, 4)}`
        const timeFormat = `ตั้งแต่ ${validFrom} ถึง ${validUntil}`
        const code = item.PromotionCode || ""

        return (
            <div className="promotion-item" key={index}>
                <div className="promotion-detail-box">
                    <div className="percent-box">
                        <div className="img-box">
                            <img src="./images/icons/discount.png" alt="" />
                        </div>
                        <p className="percent">
                            {`ส่วนลด ${item.DiscountPercentage}%`}
                        </p>
                    </div>
                    <div className="subdetail-box">
                        <span className="promotion-name">
                            {item.PromotionName}
                        </span>
                        <div className="detail-wrap">
                            <p className="minimum-price detail">
                                {`ขั้นต่ำ ฿${item.MinimumPrice?.toLocaleString('th-TH', {
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0,
                                })}`}
                            </p>
                            <p className="time detail">
                                {timeFormat}
                            </p>
                            <div className="code-box detail">
                                <p>คัดลอกโค้ด</p>
                                <p className="text">{`${item.PromotionCode}`}</p>
                                <CopyOutlined onClick={() => handleCopy(code)} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    })

    return (
        <div className="show-promotion-container">
            <div className="card-title">
                <div className="title">
                    <div className="icon-box">
                        <img src="/images/icons/promotion.png" alt="" />
                    </div>
                    <div className="text-box">โปรโมชันพิเศษประจำเดือนนี้</div>
                </div>
                <Link to={"/tour-package"}>
                    <button className="more-promotion-btn">{"โปรโมชั่นทั้งหมด"}</button>
                </Link>
            </div>
            <div className="promotion-section"
                ref={scrollRef}
                onMouseMove={() => setIsUserScrolling(true)}
            >
                {promotionElement}
            </div>
        </div>
    )
}
export default ShowPromotion