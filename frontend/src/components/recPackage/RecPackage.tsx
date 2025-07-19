import { Link } from "react-router-dom"
import "./RecPackage.css"
import { TourPackagesInterface } from "../../interfaces/ITourPackages"
import { apiUrl } from "../../services/http"
import { useEffect, useState } from "react"

function RecPackage(props: { tourPackages: any }) {
    const { tourPackages } = props

    const [startPriceF, setStartPriceF] = useState<string>("")

    const [hoveredBox, setHoveredBox] = useState<number | null>(null);

    const handleMouseEnter = (boxId: number) => {
        setHoveredBox(boxId);
    };
    const handleMouseLeave = () => {
        setHoveredBox(null);
    };

    function handleSetStartPrice() {
        let startPrice = 999999;
        tourPackages[hoveredBox!=null ? hoveredBox : 0]?.TourPrices?.forEach((price: any) => {
            if (price.PersonTypeID !== 1 && price.Price && price.Price < startPrice) {
                startPrice = price.Price;
            }
        });
        setStartPriceF(startPrice.toLocaleString('th-TH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }))
    }

    function setPackageData(id: number | undefined) {
        localStorage.setItem("startPrice", startPriceF)
        localStorage.setItem("tourPackageID", String(id))
        setTimeout(() => {
            location.href = "/tour-select";
        });
    }

    const tourElement = tourPackages.map((tour: TourPackagesInterface, index: number) => {
        const imageUrl = `${apiUrl}/${tour?.TourImages?.[0]?.FilePath}?t=${new Date().getTime()}`
        return (
            <div className={`tour-box ${hoveredBox==index ? "active" : ""}`}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                key={index}
                onClick={()=>setPackageData(tour.ID)}
            >
                <img className="image-bg" src={imageUrl} alt="" />
                <div className={`text-box ${hoveredBox==index ? "active" : ""}`}>
                    <div className="tour-title">
                        {tour.TourName}
                    </div>
                    <div className="tour-code">
                        {`รหัสทัวร์แพ็กเก็จ: ${tour.PackageCode}`}
                    </div>
                    <div className="price-title">ราคาเริ่มต้น</div>
                    <div className="tour-price">
                        ฿{startPriceF}
                    </div>
                </div>
            </div>
        )
    })

    useEffect(() => {
        handleSetStartPrice()
    }, [tourPackages, hoveredBox]);

    return (
        <div className="rec-package-container">
            <div className="card-title">
                <div className="title">
                    <div className="icon-box">
                        <img src="/images/icons/island.png" alt="" />
                    </div>
                    <div className="text-box">แนะนำแพ็กเกจทัวร์สุดพิเศษ</div>
                </div>
                <Link to={"/tour-package"}>
                    <button className="more-tour-btn">{"แพ็กเกจทั้งหมด"}</button>
                </Link>
            </div>
            <section className="tour-section">
                {tourElement}
            </section>
        </div>
    )
}
export default RecPackage