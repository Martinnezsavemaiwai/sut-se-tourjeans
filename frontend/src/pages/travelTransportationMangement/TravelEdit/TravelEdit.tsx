import Navbar from "../../../components/Navbar-Management/Navbar";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { message } from "antd";
import "react-datepicker/dist/react-datepicker.css";
import { VehiclesInterface } from "../../../interfaces/IVehicles";
import { GetProvinces, GetTourPackages, GetVehicles, GetTransportationByID, UpdateTransportationByID } from "../../../services/http";
import CancelBT from "../../../components/CancelBT/Cancel";
import { ProvincesInterface } from "../../../interfaces/IProvinces";
import { TourPackagesInterface } from "../../../interfaces/ITourPackages";
import { TransportationsInterface } from "../../../interfaces/ITransportations";
import Select from "react-select";
import { registerLocale } from "react-datepicker";
import { th } from "date-fns/locale/th";
registerLocale("th", th);
import "./TravelEdit.css";
import { useParams, useNavigate } from "react-router-dom";

function TravelEdit() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
    const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
    const [vehicles, setVehicles] = useState<VehiclesInterface[]>([]);
    const [provinces, setProvinces] = useState<ProvincesInterface[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
    const [tourPackages, setTourPackages] = useState<TourPackagesInterface[]>([]);
    const [location, setLocation] = useState<string>("");
    const [selectedTour, setSelectedTour] = useState<string | null>("");
    const [selectedVehicle, setSelectedVehicle] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);

    const validateLocation = (value: string) => {
        const regex = /^[^0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>?/`~]/;
        if (!regex.test(value)) {
            setLocationError("สถานที่ห้ามขึ้นต้นด้วยตัวเลขหรือตัวอักษรพิเศษ");
        } else {
            setLocationError(null);
        }
    };

    const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setLocation(value);
        validateLocation(value);
    };

    const vehicleOptions = vehicles.map((item) => ({
        value: item.ID,
        label: item.VehicleName,
    }));

    const provinceOptions = provinces.map((province) => ({
        value: province.ID,
        label: province.ProvinceName,
    }));

    const tourPackageOptions = tourPackages.map((item) => ({
        value: item.ID,
        label: item.TourName,
    }));


    const handleProvinceChange = (selectedOption: any) => {
        setSelectedProvince(selectedOption?.value || null);
    };

    const getVehicles = async () => {
        const res = await GetVehicles();
        if (res) {
            setVehicles(res);
        }
    };

    const getProvinces = async () => {
        const res = await GetProvinces();
        if (res) {
            setProvinces(res);
        }
    };

    const getTourPackages = async () => {
        const res = await GetTourPackages();
        if (res) {
            setTourPackages(res);
        }
    };


    const fetchTransportationDetails = async () => {
        setLoading(true);
        const res = await GetTransportationByID(Number(id));
        if (res) {
            setSelectedStartDate(new Date(new Date(res.DepartureTime).getTime() - 7 * 60 * 60 * 1000));
            setSelectedEndDate(new Date(new Date(res.ArrivalTime).getTime() - 7 * 60 * 60 * 1000));
            setSelectedTour((res.TourPackageID));
            setSelectedVehicle((res.VehicleID));
            setLocation(res.Location?.LocationName || "");
            setSelectedProvince(res.Location?.ProvinceID || null);

        } else {
            message.error("ไม่พบข้อมูลการเดินทาง");
        }
        setLoading(false);
    };



    useEffect(() => {


        const fetchData = async () => {
            await getVehicles();
            await getProvinces();
            await getTourPackages();
            await fetchTransportationDetails();
        };

        fetchData();
    }, []);

    const handleStartDateChange = (date: Date | null) => {
        if (date && selectedEndDate && date >= selectedEndDate) {
            message.error("เวลาออกเดินทางต้องน้อยกว่าเวลาถึงจุดหมาย");
        } else {
            setSelectedStartDate(date);
        }
    };

    const handleEndDateChange = (date: Date | null) => {
        if (date && selectedStartDate && date <= selectedStartDate) {
            message.error("เวลาถึงจุดหมายต้องมากกว่าเวลาออกเดินทาง");
        } else {
            setSelectedEndDate(date);
        }
    };

    const onFinish = async (event: React.FormEvent) => {
        event.preventDefault();

        if (locationError) {
            message.error("สถานที่ห้ามขึ้นต้นด้วยตัวเลขหรือตัวอักษรพิเศษ");
            return;
        }
        const adjustedStartDate = selectedStartDate ? new Date(selectedStartDate.getTime() + 7 * 60 * 60 * 1000) : null;
        const adjustedEndDate = selectedEndDate ? new Date(selectedEndDate.getTime() + 7 * 60 * 60 * 1000) : null;
        const selectedTourPackage = tourPackages.find((pkg) => pkg.ID === Number(selectedTour));
        const selectedVehicleObject = vehicles.find((veh) => veh.ID === Number(selectedVehicle));
        const selectedLocation = provinces.find((prov) => prov.ID === Number(selectedProvince));

        if (!selectedTourPackage || !selectedVehicleObject || !selectedLocation) {
            message.error("ข้อมูลที่เลือกไม่ถูกต้อง");
            return;
        }

        const travelData: TransportationsInterface = {
            ID: Number(id),
            TourPackage: selectedTourPackage,
            TourPackageID: Number(selectedTour),
            DepartureTime: (adjustedStartDate ?? new Date()).toISOString(),
            ArrivalTime: (adjustedEndDate ?? new Date()).toISOString(),
            Vehicle: selectedVehicleObject,
            VehicleID: Number(selectedVehicle),
            Location: {
                LocationName: location,
                ProvinceID: Number(selectedProvince),
            },
            LocationID: Number(selectedLocation.ID),
        };

        const res = await UpdateTransportationByID(travelData, Number(id));
        if (res) {
            message.success("อัปเดตข้อมูลเรียบร้อยแล้ว");
            navigate("/TravelTransportManagement");
        } else {
            message.error("อัปเดตข้อมูลไม่สําเร็จ");
        }
    };


    return (
        <div className="transport-edit-page-container">
            <Navbar page="trnsport-management" />
            <div className="transport-edit-page">
            <div className="min-h-screen bg-customSkyYellow text-black">
                <div className="flex">
                    <div className="bg-black text-customYellow font-bold text-[28px] py-2 px-4 w-96 rounded-r-[25px] text-center mt-20">
                        แก้ไขการเดินทาง
                    </div>
                </div>
                <form className="max-w-7xl mx-auto -mt-5" onSubmit={onFinish}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-20 bg-white rounded-[25px] p-20">
                        <div className="space-y-4">
                            <label className="block text-[24px] font-bold text-black mb-1">
                                แพ็กเกจทัวร์
                            </label>
                            <Select
                                options={tourPackageOptions}
                                onChange={(option) => setSelectedTour(String(option?.value))}
                                value={tourPackageOptions.find((option) => option.value === Number(selectedTour)) || null}
                                placeholder="พิมพ์ค้นหาแพ็กเกจทัวร์"
                                isClearable
                                classNamePrefix="react-select"
                            />
                            <label className="block text-[24px] font-bold text-black mb-1">
                                จังหวัด
                            </label>
                            <Select
                                options={provinceOptions}
                                onChange={handleProvinceChange}
                                value={provinceOptions.find((option) => option.value === selectedProvince) || null}
                                placeholder="พิมพ์ค้นหาจังหวัด"
                                isClearable
                                classNamePrefix="react-select"
                            />

                            <label className="block text-[24px] font-bold text-black mb-1">
                                เวลาออกเดินทาง
                            </label>
                            <DatePicker
                                selected={selectedStartDate}
                                onChange={handleStartDateChange}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                dateFormat="d MMM yyyy เวลา HH:mm น."
                                locale="th"
                                className="custom-datepicker"
                                placeholderText="เลือกเวลาออกเดินทาง"
                            />

                        </div>
                        <div className="space-y-4">
                            <label className="block text-[24px] font-bold text-black mb-1">
                                เลือกยานพาหนะ
                            </label>
                            {loading ? (
                                <p>กำลังโหลดข้อมูล...</p>
                            ) : (
                                <Select
                                    options={vehicleOptions}
                                    onChange={(option) => setSelectedVehicle(String(option?.value))}
                                    value={vehicleOptions.find((option) => option.value === Number(selectedVehicle)) || null}
                                    placeholder="พิมพ์ค้นหายานพาหนะ"
                                    isClearable
                                    classNamePrefix="react-select"
                                    isLoading={loading}
                                />
                            )}
                            <label className="block text-[24px] font-bold text-black mb-1">
                                สถานที่
                            </label>
                            <input
                                type="text"
                                name="location"
                                className="location-input block w-full rounded-[25px] p-2 "
                                placeholder="กรอกสถานที่"
                                value={location}
                                onChange={handleLocationChange}
                                required
                            />
                            {locationError && (
                                <div
                                    className="text-red-600 mt-2 flex items-center transition-all duration-300"
                                >

                                    {locationError}
                                </div>
                            )}

                            <label className="block text-[24px] font-bold text-black mb-1">
                                เวลาถึงจุดหมาย
                            </label>
                            <DatePicker
                                selected={selectedEndDate}
                                onChange={handleEndDateChange}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                dateFormat="d MMM yyyy เวลา HH:mm น."
                                locale="th"
                                className="custom-datepicker"
                                placeholderText="เลือกเวลาถึงจุดหมาย"
                                disabled={!selectedStartDate}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-4 mt-10">
                        <CancelBT />
                        <button
                            type="submit"
                            className="btn-submit bg-black text-white text-base font-semibold ml-5 rounded-[15px] h-[50px] w-[110px] p-2 hover:bg-[#686868] border border-black"
                        >
                            บันทึก
                        </button>
                    </div>
                </form>
            </div>
        </div>
        </div>

        
    );
}

export default TravelEdit;
