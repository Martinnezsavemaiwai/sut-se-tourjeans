import { useEffect, useState } from "react";
import { TransportationsInterface } from "../../interfaces/ITransportations";
import {DeleteTransportationByID, GetProvinces, GetTransportations } from "../../services/http";
import Navbar from "../../components/Navbar-Management/Navbar";
import { ProvincesInterface } from "../../interfaces/IProvinces";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import SerchBoxTransportandTravel from "../../components/Serchbox/SerchBoxTransportandTravel";
import './travelTransportationMangement.css'
import TransportationModal from "../../components/ModalCustom/TransportationModal";
import CustomMediaLoading from "../../components/employeeLoading/CustomMediaLoading";
function TravelTransportMangement() {
    const [transportations, setTransportation] = useState<TransportationsInterface[]>([]);
    const [provinces, setProvinces] = useState<ProvincesInterface[]>([]);
    const [modalState, setModalState] = useState<{
        type: "edit" | "delete" | "option" | null;
        data: TransportationsInterface | null;
    }>({
        type: null,
        data: null,
    });

    const [filteredTransportations, setFilteredTransportations] = useState<TransportationsInterface[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);


    const handleConfirmDelete = async () => {
        if (modalState.data) {
            const res = await DeleteTransportationByID(modalState.data.ID);
            if (res) {
                message.success("ลบข้อมูลสำเร็จ");
                fetchData(); // โหลดข้อมูลใหม่
                closeModal();
            } else {
                message.error("ไม่สามารถลบข้อมูลได้");
            }
        }
    };

    const navigate = useNavigate();


    const handleShowMore = (id: number) => {
        navigate(`/ShowTransportation/${id}`);
    };

    const openModal = (type: "edit" | "delete" | "option", data: TransportationsInterface) => {
        setModalState({ type, data });
    };

    const closeModal = () => {
        setModalState({ type: null, data: null });
    };


    const handleEdit = (id: number, type: "travel" | "transportation") => {
        const path = type === "travel" ? `/EditTravel/${id}` : `/EditTransportation/${id}`;
        navigate(path);
    };

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const transportationRes = await GetTransportations();
            if (transportationRes) {
                setTransportation(transportationRes);
                setFilteredTransportations(transportationRes);
            }
            const provincesRes = await GetProvinces();
            if (provincesRes) {
                setProvinces(provincesRes);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 2000);
        }
    }

    const convertToThaiDate = (date: string) => {
        const dateObj = new Date(date);
        const year = dateObj.getFullYear() + 543;
        const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
        const day = dateObj.getDate().toString().padStart(2, "0");

        return `${day}/${month}/${year}`;
    };

    const formatTimeRange = (startTime: string | undefined, endTime: string | undefined) => {
        if (!startTime || !endTime) return '';

        const formatTime = (time: string) => {
            const [hour, minute] = time.split("T")[1].split(":");
            return `${hour.padStart(2, '0')}.${minute.padStart(2, '0')}`;
        };

        return `${formatTime(startTime)} - ${formatTime(endTime)}`;
    };

    useEffect(() => {
        fetchData();
    }, []);

    const transportElements = filteredTransportations.map((item, index) => {

        const packageCode = item.TourPackage?.PackageCode
        const province = provinces.find(province => province.ID === item.Location.ProvinceID)?.ProvinceName
        const locationName = item.Location.LocationName
        const departureTime = item.DepartureTime && convertToThaiDate(item.DepartureTime)
        const arrivalTime = formatTimeRange(item.DepartureTime, item.ArrivalTime)
        const vehicleName = item.Vehicle.VehicleName

        return (
            <tr className="transport-element hover:cursor-pointer" key={index} onClick={() => openModal("option", item)}
            >
                <td className="package-code">{packageCode}</td>
                <td className="provines">{province}</td>
                <td className="lacationName">{locationName}</td>
                <td className="departureTime">{departureTime}</td>
                <td className="arrivalTime">{arrivalTime}</td>
                <td className="vehicleName">{vehicleName}</td>
                <td className="management">
                    <div className="flex justify-center items-center space-x-3">

                        <button className="text-yellow-500 p-2 rounded-full hover:scale-105 transform transition-all focus:outline-none"
                            onClick={(e) => { e.stopPropagation(); openModal("edit", item) }}>
                            <img src={"/images/icons/edit.png"} alt="Edit Icon" className="w-5 h-5" />

                        </button>

                        <button className="text-red-500 p-2 rounded-full hover:scale-105 transform transition-all focus:outline-none"
                            onClick={(e) => { e.stopPropagation(); openModal("delete", item) }}>
                            <img src={"/images/icons/delete.png"} alt="Edit Icon" className="w-5 h-5" />

                        </button>
                    </div>
                </td>
            </tr>
        )

    })


    useEffect(() => {
        const filtered = transportations.filter((item) => {
            const searchString = `${item.TourPackage.PackageCode} ${item.Location} ${convertToThaiDate(item.DepartureTime)} ${formatTimeRange(item.DepartureTime, item.ArrivalTime)} ${item.Vehicle.VehicleName}`.toLowerCase();
            return searchString.includes(searchTerm.toLowerCase());
        });
        setFilteredTransportations(filtered);
    }, [searchTerm, transportations]);

    if (isLoading) {
        return <CustomMediaLoading message="กำลังโหลดข้อมูล..." width={200} height={200} />;
    }
    

    return (
        <div className="travel-transport-management">
            <Navbar page={'trnsport-management'} />

            <div className="travel-transport-management-page overflow-auto">

                <div className="text-4xl font-semibold text-left mt-10 ml-3 mb-3 text-box">
                    <h6 className="text-black">จัดการการเดินทางและการขนส่ง</h6>
                </div>

                <div className="card-content-management overflow-auto">
                    <div className="list-transportation-card">
                        <SerchBoxTransportandTravel onSearch={(term) => setSearchTerm(term)} />
                        <div className="transport-form-section">
                            <table>
                                <thead>
                                    <tr>
                                        <th className="package-code">รหัสทัวร์</th>
                                        <th>จังหวัด</th>
                                        <th>สถานที่</th>
                                        <th>วันเดินทาง</th>
                                        <th>เวลาในการเดินทาง</th>
                                        <th>ยานพาหะนะ</th>
                                        <th className="management">จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transportElements.length > 0 ? (
                                        transportElements
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="text-center rounded-[10px]">
                                                ไม่พบข้อมูลที่ท่านค้นหา
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <>
                            <TransportationModal
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

export default TravelTransportMangement;
