import { Key, useEffect, useState } from "react"
import "./ShowTourSlice.css"
import { apiUrl} from "../../services/http";
import { Carousel } from "antd";

function ShowTourSlice(props: { tourPackages: any; }) {
    const { tourPackages } = props

    const [currentSlide, setCurrentSlide] = useState(0);
    const [startPriceF, setStartPriceF] = useState<string>("");

    function handleSetStartPrice() {
        let startPrice = 999999;
        tourPackages[currentSlide]?.TourPrices?.forEach((price: any) => {
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

    useEffect(() => {
        handleSetStartPrice()
    }, [currentSlide, tourPackages]);

    const bigImageUrl = `${apiUrl}/${tourPackages[currentSlide]?.TourImages?.[0]?.FilePath}?t=${new Date().getTime()}`

    const imageElement = tourPackages.map((tour: { TourImages: { FilePath: any; }[]; ID: number | undefined; }, index: Key | null | undefined) => {
        const imageUrl = `${apiUrl}/${tour?.TourImages?.[0]?.FilePath}`
        return (
            <div className="image-box" key={index} onClick={()=>setPackageData(tour.ID)}>
                <img src={imageUrl} alt="" />
            </div>
        )
    })

    return (
        <div className="show-tour-slice-container">
            <div className="image-bg">
                <img src={bigImageUrl} alt="" />
            </div>
            <div className="tour-container">
                <div className="image-box">
                    <Carousel afterChange={(current) => setCurrentSlide(current)} autoplay autoplaySpeed={5000} speed={2000}>
                        {imageElement}
                    </Carousel>
                </div>
                <div className="text-box">
                    <h3 className="tour-name">
                        {tourPackages?.[currentSlide]?.TourName}
                    </h3>
                    <p className="tour-description">
                        {tourPackages?.[currentSlide]?.TourDescriptions?.Intro}
                    </p>
                    <p className="title-text">รายละเอียดแพ็กเกจ</p>
                    <p className="tour-detail subtext">
                        {tourPackages?.[currentSlide]?.TourDescriptions?.PackageDetail}
                    </p>
                    <p className="title-text">ไฮไลท์ของทริป</p>
                    <p className="tour-detail subtext">
                        {tourPackages?.[currentSlide]?.TourDescriptions?.TripHighlight}
                    </p>
                </div>
            </div>

        </div>
    )
}
export default ShowTourSlice