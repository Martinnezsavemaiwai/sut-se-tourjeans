import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react"; // Import trash icon
import { VehiclesInterface } from "../../interfaces/IVehicles";
import { VehicleTypesInterface } from "../../interfaces/IVehicleTypes";
import { apiUrl, DeleteVehicleByID, GetVehicleImages, GetVehicles, GetVehicleTypes } from "../../services/http";
import { VehicleImagesInterface } from "../../interfaces/IVehicleImages";
import { useNavigate } from "react-router-dom";
import ManageVehicleModal from "../ModalCustom/ManageVehicleModal";
import Pagination from "../Pagination/Pagination";
import { message } from "antd";

const ManageVehicle: React.FC = () => {
    const [vehicles, setVehicles] = useState<VehiclesInterface[]>([]);
    const [vehicleTypes, setVehicleTypes] = useState<VehicleTypesInterface[]>([]);
    const [vehicleImages, setVehicleImages] = useState<VehicleImagesInterface[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [vehiclesPerPage] = useState(3);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalState, setModalState] = useState<{
        type: "edit" | "delete" | null;
        data: VehiclesInterface | null;
    }>({
        type: null,
        data: null,
    });

    const fetchVehicleData = async () => {
        try {
            const vehicleResponse = await GetVehicles();
            if (vehicleResponse) {
                setVehicles(vehicleResponse);
            }
            const vehicleTypeResponse = await GetVehicleTypes();
            if (vehicleTypeResponse) {
                setVehicleTypes(vehicleTypeResponse);
            }
        } catch (error) {
            console.error("Error fetching vehicle data:", error);
        }
    };

    const fetchVehicleImages = async () => {
        try {
            const vehicleImagesRes = await GetVehicleImages();
            if (vehicleImagesRes) {
                setVehicleImages(vehicleImagesRes);
            }
        } catch (error) {
            console.error("Error fetching vehicle images:", error);
        }
    };

    useEffect(() => {
        fetchVehicleImages();
        fetchVehicleData();
    }, []);

    const navigate = useNavigate();

    const handleConfirmDelete = async () => {
        if (modalState.data) {
            const res = modalState.data?.ID !== undefined ? await DeleteVehicleByID(modalState.data.ID) : false;
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

    const indexOfLastVehicle = currentPage * vehiclesPerPage;
    const indexOfFirstVehicle = indexOfLastVehicle - vehiclesPerPage;
    const currentVehicles = vehicles.slice(indexOfFirstVehicle, indexOfLastVehicle);
    const vehiclelements = currentVehicles.map((vehicle) => {
        const vehicleImage = vehicleImages.find((image) => image.VehicleID === vehicle.ID);

        return (
            <div key={vehicle.ID} className="bg-gray-100 p-4 rounded-lg shadow relative">
                <button
                    className="absolute top-2 right-2 text-red-500 hover:text-white 
               bg-red-100 hover:bg-gradient-to-r from-red-500 to-red-700 
               transition-all duration-300 p-2 shadow-md rounded-full"
                    onClick={() => {
                        setModalState({ type: "delete", data: vehicle });
                        setModalVisible(true);
                    }}
                >
                    <Trash2 size={24} />
                </button>


                <img
                    src={vehicleImage ? `${apiUrl}/${vehicleImage.FilePath}` : ""}
                    alt={vehicle.VehicleName}
                    className="w-full h-52 object-cover rounded-lg border-4 border-customYellow"
                />
                <h3 className="text-lg font-semibold mt-2">{vehicle.VehicleName}</h3>
                <p className="text-gray-600">
                    ประเภท:{" "}
                    {vehicle.VehicleTypeID &&
                        vehicleTypes.find((type) => type.ID === vehicle.VehicleTypeID)?.TypeName}
                </p>
                <div className="flex justify-start mt-4">
                    <button
                        className="absolute bottom-4 right-4 bg-green-500 text-white 
        px-3 py-1.5 rounded-lg text-sm font-medium
        hover:bg-green-600 transition-colors duration-300 
        flex items-center gap-2"
                        onClick={() => {
                            setModalState({ type: "edit", data: vehicle });
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
                        {vehiclelements}
                    </div>
                    <div className="flex justify-center mt-6">
                        <Pagination
                            currentPage={currentPage}
                            totalItems={vehicles.length}
                            itemsPerPage={vehiclesPerPage}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </div>
            </div>

            {modalVisible && (
                <ManageVehicleModal
                    visible={modalVisible}
                    type={modalState.type}
                    data={modalState.data}
                    onCancel={closeModal}
                    onConfirmDelete={handleConfirmDelete}
                    onEdit={(id) => navigate(`/EditTransport/${id}`)}
                />
            )}
        </div>
    );
};

export default ManageVehicle;