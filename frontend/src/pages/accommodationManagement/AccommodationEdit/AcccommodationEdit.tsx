import { useEffect, useState } from "react";
import CancelBT from "../../../components/CancelBT/Cancel";
import Navbar from "../../../components/Navbar-Management/Navbar";
import { GetTourPackages, GetHotels, GetAccommodationByID, UpdateAccommodationByID } from "../../../services/http";
import { message } from "antd";
import Select from "react-select";
import { registerLocale } from "react-datepicker";
import { th } from "date-fns/locale/th";
registerLocale("th", th);
import DatePicker from "react-datepicker";
import { TourPackagesInterface } from "../../../interfaces/ITourPackages";
import { AccommodationsInterface } from "../../../interfaces/IAccommodations";
import { HotelsInterface } from "../../../interfaces/IHotels";
import { useNavigate, useParams } from "react-router-dom";
import './AcccommodationEdit.css'
function AcccommodationEdit() {
    const [tourPackages, setTourPackages] = useState<TourPackagesInterface[]>([]);
    const [selectedTour, setSelectedTour] = useState<string | null>("");
    const [selectedHotel, setSelectedHotel] = useState<string>("");
    const [selectedCheckInDate, setselectedCheckInDate] = useState<Date | null>(null);
    const [selectCheckOutDate, setselectCheckOutDate] = useState<Date | null>(null);
    const [hotels, setHotels] = useState<HotelsInterface[]>([]);
    const { id } = useParams<{ id: string }>(); 
    const navigate = useNavigate();
 
    const tourPackageOptions = tourPackages.map((item) => ({
        value: item.ID,
        label: item.TourName,
    }));

    const hotelOptions = hotels.map((item) => ({
        value: item.ID,
        label: item.HotelName,
    }))
    const getTourPackages = async () => {
        const res = await GetTourPackages();
        if (res) {
            setTourPackages(res);
        }
    };

    const getHotels = async () => {
        const res = await GetHotels();
        if (res) {
            setHotels(res);
        }
    };

    const getAccommodationDetails = async () => {
        if (!id) return;
        const res = await GetAccommodationByID(Number(id));
        if (res) {
            setSelectedTour(String(res.TourPackageID));
            setSelectedHotel(String(res.HotelID));
            setselectedCheckInDate(new Date(res.CheckInDate));
            setselectCheckOutDate(new Date(res.CheckOutDate));
        } else {
            message.error("ไม่พบข้อมูลที่พัก");
        }
    };


    const handleCheckInDateChange = (date: Date | null) => {
        if (date && selectCheckOutDate && date >= selectCheckOutDate) {
            message.error("เวลาเช็คอินต้องน้อยกว่าเวลาเช็คเอาท์");
        } else {
            setselectedCheckInDate(date);
        }
    };

    const handleCheckOutDateChange = (date: Date | null) => {
        if (date && selectedCheckInDate && date <= selectedCheckInDate) {
            message.error("เวลาเช็คเอาท์ต้องมากกว่าเวลาเช็คอิน");
        } else {
            setselectCheckOutDate(date);
        }
    };

    const onFinished = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!selectedHotel || !selectedCheckInDate || !selectCheckOutDate || !selectedTour) {
            message.error("กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }

        const accommodationsData: AccommodationsInterface = {
            ID: Number(id),
            CheckInDate: selectedCheckInDate?.toISOString(),
            CheckOutDate: selectCheckOutDate?.toISOString(),
            HotelID: Number(selectedHotel),
            TourPackageID: Number(selectedTour),
            TourPackage: {},
        };

        const res = await UpdateAccommodationByID(accommodationsData, Number(id));
        if (!res) {
            message.error("เกิดข้อผิดพลาดในการแก้ไขข้อมูล");
            return;
        }
        message.success("แก้ไขข้อมูลที่พักสําเร็จ");
        setTimeout(() => navigate("/AccommodationManagement"), 1000);
    };

    useEffect(() => {
        getTourPackages();
        getHotels();
        getAccommodationDetails();
    }, []);

    return (
        <div className="hotel-edit-page">
            <Navbar page={"accomodation-management"} />
            <div className="min-h-screen bg-customSkyYellow text-black">
                <div className="flex">
                    <div className="bg-black text-customYellow font-bold text-[28px] py-2 px-4 w-96 rounded-r-[25px] text-center mt-20">
                        แก้ไขที่พัก
                    </div>
                </div>
                <form className="max-w-7xl mx-auto -mt-5" onSubmit={onFinished}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-20 bg-white rounded-[25px] p-20">
                        {/* Left Column */}
                        <div className="space-y-4">
                            <label className="block text-[24px] font-bold text-black mb-1">
                                แพ็กเกจทัวร์
                            </label>
                            <Select
                                options={tourPackageOptions}
                                value={tourPackageOptions.find((item) => item.value === Number(selectedTour)) || null}
                                onChange={(option) => setSelectedTour(String(option?.value || ""))}
                                placeholder="พิมพ์ค้นหาแพ็กเกจทัวร์"
                                isClearable
                                classNamePrefix="react-select"
                                />
                            <label className="block text-[24px] font-bold text-black mb-1">
                                เวลาเช็คอิน
                            </label>
                            <DatePicker
                                selected={selectedCheckInDate}
                                onChange={handleCheckInDateChange}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                dateFormat="d MMM yyyy เวลา HH:mm น."
                                locale="th"
                                className="custom-datepicker"
                                placeholderText="เลือกเวลาเช็คอิน"
                            />
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                            <label className="block text-[24px] font-bold text-black mb-1">
                                โรงแรม
                            </label>
                            <Select
                                options={hotelOptions}
                                value={hotelOptions.find((item) => item.value === Number(selectedHotel)) || null}
                                onChange={(option) => setSelectedHotel(String(option?.value || ""))}
                                placeholder="พิมพ์ค้นหาโรงแรม"
                                isClearable
                                classNamePrefix="react-select"
                            />

                            <label className="block text-[24px] font-bold text-black mb-1">
                                เวลาเช็คเอาท์
                            </label>
                            <DatePicker
                                selected={selectCheckOutDate}
                                onChange={handleCheckOutDateChange}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                dateFormat="d MMM yyyy เวลา HH:mm น."
                                locale="th"
                                className="custom-datepicker"
                                placeholderText="เลือกเวลาเช็คเอาท์"
                            />
                        </div>
                    </div>

                    {/* Buttons */}
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
    );
}

export default AcccommodationEdit;
