import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react"; // Import trash icon
import { apiUrl, DeleteHotelByID, GetHotelImages, GetHotels } from "../../services/http";
import { useNavigate } from "react-router-dom";
import Pagination from "../Pagination/Pagination";
import { HotelsInterface } from "../../interfaces/IHotels";
import { HotelImagesInterface } from "../../interfaces/IHotelImages";
import ManageHotelModal from "../ModalCustom/ManageHotelModal";
import { message } from "antd";

const ManageHotel: React.FC = () => {
    const [hotels, setHotels] = useState<HotelsInterface[]>([]);
    const [hotelImages, setHotelImages] = useState<HotelImagesInterface[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hotelsPerPage] = useState(3);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalState, setModalState] = useState<{
        type: "edit" | "delete" | null;
        data: HotelsInterface | null;
    }>({
        type: null,
        data: null,
    });

    const fetchHotelData = async () => {
        try {
            const hotelResponse = await GetHotels();
            if (hotelResponse) {
                setHotels(hotelResponse);
            }
        } catch (error) {
            console.error("Error fetching hotel data:", error);
        }
    };

    const fetchHotelImages = async () => {
        try {
            const hotelImagesRes = await GetHotelImages();
            if (hotelImagesRes) {
                setHotelImages(hotelImagesRes);
            }
        } catch (error) {
            console.error("Error fetching vehicle images:", error);
        }
    };

    useEffect(() => {
        fetchHotelImages();
        fetchHotelData();
    }, []);

    const navigate = useNavigate();

    const handleConfirmDelete = async () => {
        if (modalState.data) {
            const res = modalState.data?.ID !== undefined ? await DeleteHotelByID(modalState.data.ID) : false;
            if (res) {
                message.success("ลบข้อมูลสำเร็จ");
                setModalVisible(false);
                navigate(0);
            } else {
                console.error("Error deleting vehicle with ID:", modalState.data.ID);
            }
        }
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const indexOfLastHotel = currentPage * hotelsPerPage;
    const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
    const currentHotels = hotels.slice(indexOfFirstHotel, indexOfLastHotel);
    const hotelElements = currentHotels.map((hotel) => {
        const hotelImage = hotelImages.find((image) => image.HotelID === hotel.ID);

        return (
            <div key={hotel.ID} className="bg-gray-100 p-4 rounded-lg shadow relative">
                <button
                    className="absolute top-2 right-2 text-red-500 hover:text-white 
               bg-red-100 hover:bg-gradient-to-r from-red-500 to-red-700 
               transition-all duration-300 p-2 shadow-md rounded-full"
                    onClick={() => {
                        setModalState({ type: "delete", data: hotel });
                        setModalVisible(true);
                    }}
                >
                    <Trash2 size={24} />
                </button>


                <img
                    src={hotelImage ? `${apiUrl}/${hotelImage.FilePath}` : ""}
                    alt={hotel.HotelName}
                    className="w-full h-52 object-cover rounded-lg border-4 border-customYellow"
                />
                <h3 className="text-lg font-semibold mt-2">{hotel.HotelName}</h3>
                <div className="flex justify-start mt-4">
                    <button
                        className="absolute bottom-4 right-4 bg-green-500 text-white 
        px-3 py-1.5 rounded-lg text-sm font-medium
        hover:bg-green-600 transition-colors duration-300 
        flex items-center gap-2"
                        onClick={() => {
                            setModalState({ type: "edit", data: hotel });
                            setModalVisible(true);
                        }}
                    >
                        แก้ไข
                    </button>
                </div>
            </div>
        );
    });

    return (
        <div className="transport-management-page-container min-h-screen bg-customSkyYellow">
            <div className="max-w-7xl mx-auto p-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {hotelElements}
                    </div>
                    <div className="flex justify-center mt-6">
                        <Pagination
                            currentPage={currentPage}
                            totalItems={hotels.length}
                            itemsPerPage={hotelsPerPage}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </div>
            </div>

            {modalVisible && (
                <ManageHotelModal
                    visible={modalVisible}
                    type={modalState.type}
                    data={modalState.data}
                    onCancel={closeModal}
                    onConfirmDelete={handleConfirmDelete}
                    onEdit={(id) => navigate(`/EditHotel/${id}`)}
                />
            )}
        </div>
    );
};

export default ManageHotel;