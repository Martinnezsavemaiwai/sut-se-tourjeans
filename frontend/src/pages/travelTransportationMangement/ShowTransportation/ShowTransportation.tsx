import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TransportationsInterface } from "../../../interfaces/ITransportations";
import { VehicleImagesInterface } from "../../../interfaces/IVehicleImages";
import { TourImagesInterface } from "../../../interfaces/ITourImages";
import { apiUrl, GetTransportationByID, GetVehicleImageByID, GetTourPackageByID } from "../../../services/http";
import { ArrowLeft } from "lucide-react";
import Navbar from "../../../components/Navbar-Management/Navbar";
import CustomMediaLoading from "../../../components/employeeLoading/CustomMediaLoading";
import CustomErrorLoading from "../../../components/employeeLoading/ErrorLoadind";

function ShowTransportation() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [transportations, setTransportation] = useState<TransportationsInterface | null>(null);
    const [vehicleImages, setVehicleImages] = useState<VehicleImagesInterface[]>([]);
    const [tourImages, setTourImages] = useState<TourImagesInterface[]>([]);
    const [bigImage1, setBigImage1] = useState<string | null>(null);
    const [bigImage2, setBigImage2] = useState<string | null>(null);

    const fetchTransportationData = async () => {
        if (!id) return;
        try {
            setIsLoading(true);
            setError(null);
            const transportationRes = await GetTransportationByID(Number(id));
            if (transportationRes) {
                setTransportation(transportationRes);
                await Promise.all([
                    fetchTourImages(transportationRes.TourPackageID),
                    fetchVehicleImages(transportationRes.VehicleID)
                ]);
            }
        } catch (error) {
            setError("ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
            console.error("Error fetching transportation data:", error);
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 2000);
        }
    };

    const fetchTourImages = async (tourPackageID: number) => {
        try {
            const tourRes = await GetTourPackageByID(tourPackageID);
            if (tourRes?.TourImages) {
                setTourImages(tourRes.TourImages);
                setBigImage1(tourRes.TourImages[0]?.FilePath || null);
            }
        } catch (error) {
            console.error("Error fetching tour images:", error);
        }
    };

    const fetchVehicleImages = async (vehicleID: number) => {
        try {
            const vehicleImagesRes = await GetVehicleImageByID(vehicleID);
            if (vehicleImagesRes) {
                setVehicleImages(vehicleImagesRes);
                setBigImage2(vehicleImagesRes[0]?.FilePath || null);
            }
        } catch (error) {
            console.error("Error fetching vehicle images:", error);
        }
    };

    useEffect(() => {
        fetchTransportationData();
    }, [id]);

    const formatTimeRange = (editTime: string | undefined) => {
        if (!editTime) return "ไม่ระบุ";
        const [hour, minute] = editTime.split("T")[1].split(":");
        return `${hour.padStart(2, "0")}.${minute.padStart(2, "0")}`;
    };

    const handleBack = () => {
        navigate(-1);
    };

    const ImageGallery = ({
        images,
        selectedImage,
        setSelectedImage,
        type
    }: {
        images: TourImagesInterface[] | VehicleImagesInterface[],
        selectedImage: string | null,
        setSelectedImage: (path: string | null) => void,
        type: "tour" | "vehicle"
    }) => (
        <div className="flex flex-col space-y-4">
            <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden bg-gray-100 shadow-lg group">
                {selectedImage ? (
                    <img
                        src={`${apiUrl}/${selectedImage}`}
                        alt={`Selected ${type} image`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        <p className="text-lg">ไม่มีรูปภาพ</p>
                    </div>
                )}
            </div>
            <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {images.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedImage(image.FilePath || null)}
                        className={`flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden transition-all duration-200 
                            ${selectedImage === image.FilePath
                                ? 'ring-4 ring-customYellow ring-offset-2'
                                : 'hover:ring-2 ring-gray-300'
                            }`}
                    >
                        <img
                            src={`${apiUrl}/${image.FilePath}`}
                            alt={`${type} thumbnail ${index + 1}`}
                            className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                        />
                    </button>
                ))}
            </div>
        </div>
    );

    if (isLoading) {
        return (
            <CustomMediaLoading
                message="กำลังโหลดข้อมูล..."
                width={200}
                height={200}
            />
        );
    }

    if (error) {
        return (
            <CustomErrorLoading
                message={error}
                width={200}
                height={200}
                onRetry={fetchTransportationData}  
            />
        );
    }

    return (
        <div className="showtranspotation-container">
            <Navbar page="trnsport-management" />
            <div className="min-h-screen bg-gray-50">
                <main className="container mx-auto px-4 py-8">
                    <div className="space-y-6 mb-8">
                        <div className="flex">
                            <button
                                onClick={handleBack}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full shadow-md transition-all"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span>ย้อนกลับ</span>
                            </button>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center">
                            รายละเอียดที่การเดินทางและขนส่ง
                        </h1>
                    </div>



                    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Tour Section */}
                            <section className="space-y-6">
                                <div className="text-center">
                                    <h2 className="text-2xl font-semibold text-customBlue">
                                        {transportations?.TourPackage?.TourName || "ไม่พบข้อมูล"}
                                    </h2>
                                </div>

                                <ImageGallery
                                    images={tourImages}
                                    selectedImage={bigImage1}
                                    setSelectedImage={setBigImage1}
                                    type="tour"
                                />

                                <div className="mt-6 space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <img src="/images/icons/location.png" className="w-6 h-6" alt="Location" />
                                        <h3 className="text-xl font-semibold text-gray-700">สถานที่</h3>
                                    </div>
                                    <p className="text-gray-600 pl-9">
                                        {transportations?.Location?.LocationName || "ไม่ระบุ"}
                                    </p>
                                </div>
                            </section>

                            {/* Vehicle Section */}
                            <section className="space-y-6">
                                <div className="text-center">
                                    <h2 className="text-2xl font-semibold text-customBlue">
                                        {transportations?.Vehicle?.VehicleName || "ไม่พบข้อมูล"}
                                    </h2>
                                </div>

                                <ImageGallery
                                    images={vehicleImages}
                                    selectedImage={bigImage2}
                                    setSelectedImage={setBigImage2}
                                    type="vehicle"
                                />

                                <div className="mt-6 space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <img src="/images/icons/clock.png" className="w-6 h-6" alt="Clock" />
                                        <h3 className="text-xl font-semibold text-gray-700">ระยะเวลา</h3>
                                    </div>
                                    <div className="pl-9 space-y-2">
                                        <p className="text-gray-600">
                                            <span className="font-medium">เวลาออกเดินทาง:</span> {formatTimeRange(transportations?.DepartureTime)}
                                        </p>
                                        <p className="text-gray-600">
                                            <span className="font-medium">เวลาถึงจุดหมาย:</span> {formatTimeRange(transportations?.ArrivalTime)}
                                        </p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default ShowTransportation;