import { useEffect, useState } from "react";
import { DeleteAccommodationByID, GetAccommodations, GetMeals } from "../../services/http";
import Navbar from "../../components/Navbar-Management/Navbar";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { AccommodationsInterface } from "../../interfaces/IAccommodations";
import { MealsInterface } from "../../interfaces/IMeals";
import SerchBoxAccommodation from "../../components/Serchbox/SerchBoxAccommodation";
import './accommodationManagement.css';
import AccomodationModals from "../../components/ModalCustom/AccomodationModals";
import CustomMediaLoading from "../../components/employeeLoading/CustomMediaLoading";
function AccommodationManagement() {
    const [accomodations, setAccomodations] = useState<AccommodationsInterface[]>([]);
    const [meals, setMeals] = useState<MealsInterface[]>([]);
    const [modalState, setModalState] = useState<{
        type: "edit" | "delete" | "option" | null;
        data: AccommodationsInterface | null;
    }>({
        type: null,
        data: null,
    });

    const navigate = useNavigate();

    const [filteredAccomodations, setfilteredAccomodations] = useState<AccommodationsInterface[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const handleShowMore = (id: number) => {
        navigate(`/ShowAccommodation/${id}`);
    };

    const openModal = (type: "edit" | "delete" | "option", data: AccommodationsInterface) => {
        setModalState({ type, data });
    };

    const closeModal = () => {
        setModalState({ type: null, data: null });
    };


    const handleConfirmDelete = async () => {
        if (modalState.data) {
            const res = await DeleteAccommodationByID(modalState.data.ID ?? 0);
            if (res) {
                message.success("ยกเลิกสำเร็จ");
                fetschData();
                closeModal();
            } else {
                message.error("ไม่สามารถลบข้อมูลได้");
            }
        }
    };


    const handleEdit = (id: number, type: "accommodation" | "meal", mealType?: string) => {
        let path;
        if (type === "accommodation") {
            path = `/Edit/Accommodation/${id}`;
        } else {
            path = `/Edit/Meal/${id}${mealType ? `?type=${mealType}` : ''}`;
        }
        navigate(path);
    };

    const fetschData = async () => {
        setIsLoading(true);
        try {
            const accommodationRes = await GetAccommodations();
            if (accommodationRes) {
                setAccomodations(accommodationRes);
                setfilteredAccomodations(accommodationRes);
            }

            const mealRes = await GetMeals();
            if (mealRes) {
                setMeals(mealRes);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 2000);
        }
    };




    const convertToThaiDateTime = (dateTime: string) => {
        const dateObj = new Date(dateTime);
        const year = dateObj.getFullYear() + 543;
        const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
        const day = dateObj.getDate().toString().padStart(2, "0");

        const hour = dateObj.getHours().toString().padStart(2, "0");
        const minute = dateObj.getMinutes().toString().padStart(2, "0");

        return `${day}/${month}/${year}  ${hour}.${minute} น.`;
    };

    useEffect(() => {
        fetschData();
    }, []);

    const accomodationElements = filteredAccomodations.flatMap((item) => {
        const packageCode = item.TourPackage?.PackageCode;
        const accommodationName = item.Hotel?.HotelName;

        const mealsForPackage = meals.filter((meal) => meal.AccommodationID === item.ID);

        return mealsForPackage.map((meal, index) => {
            const isFirstMeal = index === 0;
            const isLastMeal = index === mealsForPackage.length - 1;

            const mealTimeClass =
                meal.MealType?.TypeName === "อาหารเช้า" ? "text-green-500" :
                    meal.MealType?.TypeName === "อาหารกลางวัน" ? "text-blue-500" :
                        "text-red-500";

            return (
                <tr className="transport-element hover:cursor-pointer" key={`${item.ID}-${meal.ID}`} onClick={() => openModal("option", item)}>
                    <td className="package-code">{packageCode}</td>
                    <td>{accommodationName}</td>
                    <td>
                        <span className={`text-sm font-bold ${mealTimeClass}`}>
                            {meal.MealType?.TypeName}:
                        </span>{" "}
                        {meal.MenusDetail}
                    </td>
                    <td>{isFirstMeal ? convertToThaiDateTime(item.CheckInDate as string) : '-'}</td>
                    <td>{isLastMeal ? convertToThaiDateTime(item.CheckOutDate as string) : '-'}</td>
                    <td className="management">
                        <div className="flex justify-center items-center space-x-3">
                            <button
                                className="text-yellow-500 p-2 rounded-full hover:scale-105 transform transition-all focus:outline-none"
                                onClick={(e) => { e.stopPropagation(); openModal("edit", item) }}
                            >
                                <img src={"/images/icons/edit.png"} alt="Edit Icon" className="w-5 h-5" />
                            </button>

                            <button
                                className="text-red-500 p-2 rounded-full hover:scale-105 transform transition-all focus:outline-none"
                                onClick={(e) => { e.stopPropagation(); openModal("delete", item) }}
                            >
                                <img src={"/images/icons/delete.png"} alt="Edit Icon" className="w-5 h-5" />
                            </button>
                        </div>
                    </td>
                </tr>
            );
        });
    });




    useEffect(() => {
        const filtered = accomodations.filter((item) => {
            const searchString = `${item.TourPackage?.PackageCode} ${item.Hotel?.HotelName} ${convertToThaiDateTime(item.CheckInDate ?? '')} ${convertToThaiDateTime(item.CheckOutDate ?? '')}`.toLowerCase();
            return searchString.includes(searchTerm.toLowerCase());
        });
        setfilteredAccomodations(filtered);
    }, [searchTerm, accomodations]);

    if (isLoading) {
        return <CustomMediaLoading message="กำลังโหลดข้อมูล..." width={200} height={200} />;
    }

    return (
        <div className="accommodation-management-management">
            <Navbar page={'accomodation-management'} />
            <div className="accommodation-management-page overwflow-hidden">
                <div className="text-4xl font-semibold text-left mt-10 ml-3 text-box">
                    <h6 className="text-black">จัดการที่พักและอาหาร</h6>
                </div>

                <div className="card-content-management">
                    <div className="list-accommodation-card">
                        <SerchBoxAccommodation onSearch={(term) => setSearchTerm(term)} />
                        <div className="accommodation-form-section">
                            <table>
                                <thead >
                                    <tr>
                                        <th className="package-code">รหัสทัวร์</th>
                                        <th >ชื่อโรงเเรม</th>
                                        <th >รายละเอียดเมนู</th>
                                        <th >เวลาเช็คอิน</th>
                                        <th >เวลาเช็คเอาท์</th>
                                        <th className="management">จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {accomodationElements.length > 0 ? (
                                        accomodationElements
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="text-center rounded-[10px]">
                                                ไม่พบข้อมูลที่ท่านค้นหา
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <>
                            <AccomodationModals
                                visible={!!modalState.type}
                                type={modalState.type}
                                data={modalState.data}
                                onCancel={closeModal}
                                onConfirmDelete={handleConfirmDelete}
                                onEdit={handleEdit}
                                onShowMore={handleShowMore}
                            />
                        </>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AccommodationManagement;
