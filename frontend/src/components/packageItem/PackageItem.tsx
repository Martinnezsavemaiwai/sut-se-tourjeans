import { useEffect, useState } from "react";
import "./PackageItem.css";
import { Link } from "react-router-dom";
import { apiUrl } from "../../services/http";

function PackageItem(props: { tour: any; }) {
    const { tour } = props;

    const [startPriceFormat, setStartPriceFormat] = useState("");

    const imageUrl = `${apiUrl}/${tour.TourImages[0]?.FilePath}?t=${new Date().getTime()}`

    function handleSetStartPrice() {
        let startPrice = 999999;
        tour?.TourPrices?.forEach((price: any) => {
            if (price.PersonTypeID !== 1 && price.Price && price.Price < startPrice) {
                startPrice = price.Price;
            }
        });
        setStartPriceFormat(startPrice.toLocaleString('th-TH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }))
    }

    function setPackageData(id: string) {
        localStorage.setItem("startPrice", startPriceFormat)
        localStorage.setItem("tourPackageID", id)
    }

    useEffect(() => {
        handleSetStartPrice()
    }, [tour.TourPrices]);


    return (
        <div className="package-item-container">
            <div className="title-bg"></div>
            <div className="detail-box">
                <div className="title"><h3>{tour.TourName}</h3></div>
                <p className="description">{tour.TourDescriptions.Intro}</p>
                <div className="duration-province-box">
                    <div className="sub-box">
                        <div className="icon-box">
                            <img src="./images/icons/calendar.png" alt="" />
                        </div>
                        <p className="detail">{tour.Duration}</p>
                    </div>
                    <div className="sub-box">
                        <div className="icon-box">
                            <img src="./images/icons/map.png" alt="" />
                        </div>
                        <p className="detail">{tour.Province?.ProvinceName}</p>
                    </div>
                </div>
                <div className="price-tourDetail-box">
                    <div className="sub-box">
                        <span className="title">ราคาเริ่มต้น</span>
                        <span className="price">฿{startPriceFormat}</span>
                    </div>
                    <div className="sub-box">
                        <Link to="/tour-select" onClick={() => setPackageData(tour.ID)}>
                            <div className="btn-detail">รายละเอียดทัวร์</div>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="image-box">
                <img src={imageUrl} alt="" />
            </div>
        </div>
    );
}
export default PackageItem;
