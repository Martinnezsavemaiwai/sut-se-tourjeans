import Navbar from "../../components/navbar/Navbar";
import "./Home.css";
import ShowTourSlice from "../../components/showTourSlice/ShowTourSlice";
import RecPackage from "../../components/recPackage/RecPackage";
import ShowPromotion from "../../components/showPromotion/ShowPromotion";
import Footer from "../../components/footer/Footer";
import { Carousel } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import { TourPackagesInterface } from "../../interfaces/ITourPackages";
import { GetTourPackages } from "../../services/http";
import CustomMediaLoading from "../../components/employeeLoading/CustomMediaLoading";

const texts = [
    {
        title: 'เตรียมตัวให้พร้อม แล้วออกเดินทางกันเลย!',
        description: 'อย่ารอช้า! ทริปดี ๆ รอคุณอยู่ เริ่มต้นการเดินทางในฝันของคุณได้ที่นี่ แล้วพบกันในจุดหมายปลายทาง!'
    },
    {
        title: ' เที่ยวสนุก ทุกจุดหมายปลายทาง',
        description: 'ไม่ว่าคุณจะรักทะเล ภูเขา หรือเมืองใหญ่ เราพร้อมพาคุณไปพบกับความสุขในทุกสถานที่ที่คุณเลือก'
    },
    {
        title: 'เที่ยวได้ทุกฤดู ตอบโจทย์ทุกสไตล์',
        description: 'ไม่ว่าฤดูไหนก็เที่ยวสนุกได้ กับแพ็คเกจที่หลากหลาย พร้อมแนะนำจุดหมายปลายทางที่เหมาะกับคุณที่สุด'
    },
    {
        title: 'ประสบการณ์พรีเมียม ในราคาที่คุณเอื้อมถึง',
        description: 'สัมผัสบริการระดับพรีเมียม ทั้งที่พัก อาหาร และไกด์นำเที่ยว ในราคาสุดพิเศษที่คุณจะประทับใจ'
    },
]

function Home() {
    const [tourPackages, setTourPackages] = useState<TourPackagesInterface[]>([]);

    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [scrollOnTop, setScrollOntop] = useState<boolean>(true)

    const scrollRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (scrollRef.current?.scrollTop == 0) {
            setScrollOntop(true)
        }
        else {
            setScrollOntop(false)
        }
    };

    async function getTourPackages() {
        let res = await GetTourPackages()
        if (res) {
            setTourPackages(res);
        }
    }

    async function fetchData() {
        try {
            getTourPackages()
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const [group1, group2] = useMemo(() => {
        const total = tourPackages.length
        if (total < 8) {
            return [[], []]
        }

        const lastFive = tourPackages.slice(-4)
        const remaining = tourPackages.slice(0, total - 4)
        const shuffledRemaining = [...remaining].sort(() => Math.random() - 0.5)
        const randomThree = shuffledRemaining.slice(0, 4)

        return [lastFive, randomThree]
    }, [tourPackages])

    const textElement = texts.map((text, index) => {
        return (
            <div key={index} className="text-box">
                <h3 className="text-title">{text.title}</h3>
                <p className="text-description">{text.description}</p>
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
        <div className="home-page" 
            ref={scrollRef}
            onScroll={handleScroll}
        >
            <Navbar page="home" scrollOnTop={scrollOnTop}/>
            <div className="full-bg">
                <div className="show-text-container">
                    <Carousel autoplay autoplaySpeed={5000} speed={2000}>
                        {textElement}
                    </Carousel>
                </div>
            </div>
            <ShowTourSlice tourPackages={group1} />
            <section>
                <RecPackage tourPackages={group2} />
                <ShowPromotion />
            </section>
            <Footer />
        </div>
    );
}

export default Home;
