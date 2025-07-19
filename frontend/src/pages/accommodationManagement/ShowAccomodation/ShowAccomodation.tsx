import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiUrl, GetHotelImagesByID, GetAccommodationByID, GetMealImageByID } from "../../../services/http";
import { ArrowLeft } from "lucide-react";
import Navbar from "../../../components/Navbar-Management/Navbar";
import { HotelImagesInterface } from "../../../interfaces/IHotelImages";
import { AccommodationsInterface } from "../../../interfaces/IAccommodations";
import { MealImagesInterface } from "../../../interfaces/IMealImages";
import CustomMediaLoading from "../../../components/employeeLoading/CustomMediaLoading";
import CustomErrorLoading from "../../../components/employeeLoading/ErrorLoadind";

function ShowAccommodation() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [accommodations, setAccommodations] = useState<AccommodationsInterface | null>(null);
    const [mealImages, setMealImages] = useState<MealImagesInterface[]>([]);
    const [hotelImages, setHotelImages] = useState<HotelImagesInterface[]>([]);
    const [bigImage1, setBigImage1] = useState<string | null>(null);
    const [bigImage2, setBigImage2] = useState<string | null>(null);

    const fetchAccommodations = async () => {
        if (!id) return;
        try {
            setIsLoading(true);
            setError(null);
            const accommodationRes = await GetAccommodationByID(Number(id));
            if (accommodationRes) {
                setAccommodations(accommodationRes);
                await Promise.all([
                    fetchAccommodationImages(accommodationRes.HotelID),
                    fetchMealImages(accommodationRes.Meals || [])
                ]);
            }
        } catch (error) {
            setError("ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
            console.error("Error fetching accommodation data:", error);
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 2000);
        }
    };

    const fetchMealImages = async (meals: any[]) => {
        try {
            const mealsWithImages = await Promise.all(
                meals.map(async (meal: { ID: number }) => {
                    const mealImagesRes = await GetMealImageByID(meal.ID);
                    return { ...meal, MealImages: mealImagesRes || [] };
                })
            );

            const newMealImages: MealImagesInterface[] = mealsWithImages.flatMap((meal: { MealImages: MealImagesInterface[], ID: number }) =>
                meal.MealImages.map((image: MealImagesInterface) => ({
                    ID: image.ID,
                    FilePath: image.FilePath,
                    MealID: meal.ID,
                }))
            );

            setMealImages(newMealImages);
            if (newMealImages.length > 0) {
                setBigImage2(newMealImages[0].FilePath || null);
            }
        } catch (error) {
            console.error("Error fetching meal images:", error);
        }
    };

    const fetchAccommodationImages = async (hotelID: number) => {
        try {
            const accommodationImagesRes = await GetHotelImagesByID(hotelID);
            if (accommodationImagesRes) {
                setHotelImages(accommodationImagesRes);
                setBigImage1(accommodationImagesRes[0]?.FilePath || null);
            }
        } catch (error) {
            console.error("Error fetching accommodation images:", error);
        }
    };

    useEffect(() => {
        fetchAccommodations();
    }, [id]);

    const handleBack = () => {
        navigate(-1);
    };

    const convertToThaiDateTime = (dateTime: string) => {
        if (!dateTime) return "ไม่ระบุ";
        const dateObj = new Date(dateTime);
        const year = dateObj.getFullYear() + 543;
        const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
        const day = dateObj.getDate().toString().padStart(2, "0");
        const hour = dateObj.getHours().toString().padStart(2, "0");
        const minute = dateObj.getMinutes().toString().padStart(2, "0");
        return `${day}/${month}/${year}  ${hour}.${minute} น.`;
    };

    const ImageGallery = ({
        images,
        selectedImage,
        setSelectedImage,
        type
    }: {
        images: HotelImagesInterface[] | MealImagesInterface[],
        selectedImage: string | null,
        setSelectedImage: (path: string | null) => void,
        type: "hotel" | "meal"
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
                onRetry={fetchAccommodations}
            />
        );
    }

    return (
        <div className="showaccommodation-container">
            <Navbar page="accomodation-management" />
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
                            รายละเอียดที่พักและอาหาร
                        </h1>
                    </div>



                    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Hotel Section */}
                            <section className="space-y-6">
                                <div className="text-center">
                                    <h2 className="text-2xl font-semibold text-customBlue">
                                        {accommodations?.Hotel?.HotelName || "ไม่พบข้อมูล"}
                                    </h2>
                                </div>

                                <ImageGallery
                                    images={hotelImages}
                                    selectedImage={bigImage1}
                                    setSelectedImage={setBigImage1}
                                    type="hotel"
                                />

                                <div className="mt-6 space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <img src="/images/icons/clock.png" className="w-6 h-6" alt="Clock" />
                                        <h3 className="text-xl font-semibold text-gray-700">ระยะเวลา</h3>
                                    </div>
                                    <div className="pl-9 space-y-2">
                                        <p className="text-gray-600">
                                            <span className="font-medium">เช็คอิน:</span> {convertToThaiDateTime(accommodations?.CheckInDate || "")}
                                        </p>
                                        <p className="text-gray-600">
                                            <span className="font-medium">เช็คเอาท์:</span> {convertToThaiDateTime(accommodations?.CheckOutDate || "")}
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Meal Section */}
                            <section className="space-y-6">
                                <div className="text-center">
                                    <h2 className="text-2xl font-semibold text-customBlue">
                                        อาหาร
                                    </h2>
                                </div>

                                <ImageGallery
                                    images={mealImages}
                                    selectedImage={bigImage2}
                                    setSelectedImage={setBigImage2}
                                    type="meal"
                                />

                                <div className="mt-6 space-y-6">
                                    {accommodations?.Meals && accommodations.Meals.length > 0 ? (
                                        accommodations.Meals.map((meal, index) => (
                                            <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-4 hover:bg-gray-100 transition-colors">
                                                <div className="flex items-center space-x-3">
                                                    <h3 className="text-xl font-semibold text-gray-700">
                                                        {meal.MealType?.TypeName || "ไม่ระบุประเภทอาหาร"}
                                                    </h3>
                                                </div>
                                                <div className="pl-6 space-y-2">
                                                    <p className="text-gray-600">
                                                        <span className="font-medium">รายละเอียดเมนู:</span>{" "}
                                                        {meal.MenusDetail || "ไม่มีข้อมูลเมนู"}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <p>ไม่มีข้อมูลอาหารในแพ็กเกจนี้</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
}

export default ShowAccommodation;