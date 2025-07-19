import Navbar from "../../../components/Navbar-Management/Navbar";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { message } from "antd";
import "react-datepicker/dist/react-datepicker.css";
import { VehiclesInterface } from "../../../interfaces/IVehicles";
import { CreateTransportation, GetProvinces, GetTourPackages, GetVehicles } from "../../../services/http";
import CancelBT from "../../../components/CancelBT/Cancel";
import { ProvincesInterface } from "../../../interfaces/IProvinces";
import { TourPackagesInterface } from "../../../interfaces/ITourPackages";
import { TransportationsInterface } from "../../../interfaces/ITransportations";
import Select from "react-select";
import { registerLocale } from "react-datepicker";
import { th } from "date-fns/locale/th";
registerLocale("th", th);
import "./TravelCreate.css";
import { useNavigate } from "react-router-dom";

function TravelCreate() {
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
    const navigate = useNavigate();

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


    const provinceOptions = provinces.map((province) => ({
        value: province.ID,
        label: province.ProvinceName,
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


    const resetForm = () => {
        setSelectedStartDate(null);
        setSelectedEndDate(null);
        setSelectedTour("");
        setSelectedVehicle("");
        setLocation("");
        setSelectedProvince(null);
        navigate(0);
    };



    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await getVehicles();
            await getProvinces();
            await getTourPackages();
            setLoading(false);
        };

        fetchData();
    }, []);

    const onFinish = async (event: React.FormEvent) => {
        event.preventDefault();

        if (locationError) {
            message.error("สถานที่ห้ามขึ้นต้นด้วยตัวเลขหรือตัวอักษรพิเศษ");
            return;
        }

        if (!selectedTour || !selectedStartDate || !selectedEndDate || !selectedVehicle || !location || !selectedProvince) {
            message.error("กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }

        const adjustedStartDate = new Date(selectedStartDate.getTime() + 7 * 60 * 60 * 1000);
        const adjustedEndDate = new Date(selectedEndDate.getTime() + 7 * 60 * 60 * 1000);


        const travelData: TransportationsInterface = {
            ID: 0,
            TourPackage: {},
            TourPackageID: Number(selectedTour),
            DepartureTime: adjustedStartDate.toISOString(),
            ArrivalTime: adjustedEndDate.toISOString(),
            Vehicle: {},
            VehicleID: Number(selectedVehicle),
            Location: {
                LocationName: location,
                ProvinceID: Number(selectedProvince),
            },
            LocationID: Number(location),
            VehicleImage: [],
        };


        const res = await CreateTransportation(travelData);
        if (res) {
            message.success("สร้างข้อมูลการเดินทางและการขนส่งสำเร็จ");
            setTimeout(() => {
                navigate(0);
            }, 2000);
        }
        else {
            message.error(res?.message || "เกิดข้อผิดพลาด");
        }

    };


    return (
        <div className="travel-create-page-container">
            <Navbar page="trnsport-management" />
            <div className="travel-create-page ">
                <div className="min-h-screen bg-customSkyYellow text-black">
                    <div className="flex">
                        <div className="bg-black text-customYellow font-bold text-[28px] py-2 px-4 w-96 rounded-r-[25px] text-center mt-20">
                            สร้างการเดินทาง
                        </div>
                    </div>
                    <form className="max-w-7xl mx-auto -mt-5" onSubmit={onFinish}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 bg-white rounded-[25px] p-20">
                            <div className="space-y-4">
                                <label className="block text-[24px] font-bold text-black mb-1">
                                    แพ็กเกจทัวร์
                                </label>
                                <Select
                                    options={tourPackages.map((item) => ({
                                        value: item.ID,
                                        label: item.TourName,
                                    }))}
                                    onChange={(option) => setSelectedTour(String(option?.value || ""))}
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
                                        options={vehicles.map((item) => ({
                                            value: item.ID,
                                            label: item.VehicleName,
                                        }))}
                                        onChange={(option) =>
                                            setSelectedVehicle(String(option?.value) || "")
                                        }
                                        placeholder="พิมพ์ค้นหายานพาหนะ"
                                        isClearable
                                        classNamePrefix="react-select"
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
                                />

                            </div>
                        </div>
                        <div className="flex justify-end space-x-4 mt-10">
                            <CancelBT />
                            <button
                                type="reset"
                                className="bg-customYellow text-black text-base font-semibold ml-5 rounded-[15px] h-[50px] w-[110px] p-2 hover:bg-yellow-500"
                                onClick={resetForm}
                            >
                                รีเซ็ต
                            </button>
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

export default TravelCreate;
