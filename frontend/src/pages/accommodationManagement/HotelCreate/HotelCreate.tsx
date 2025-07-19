import { useState } from "react";
import CancelBT from "../../../components/CancelBT/Cancel";
import Navbar from "../../../components/Navbar-Management/Navbar";
import { CreateHotelImage, CreateHotel } from "../../../services/http";
import { message } from "antd";
import { HotelImagesInterface } from "../../../interfaces/IHotelImages";
import { HotelsInterface } from "../../../interfaces/IHotels";
import './HotelCreate.css';
function HotelCreate() {
    const [selectedHotel, setSelectedHotel] = useState<string>("");
    const [hotelfileList, setHotelFileList] = useState<File[]>([]);
    const [images, setImage] = useState<HotelImagesInterface[]>([]);
    const [previewHotelImage, setpreviewHotelImage] = useState<string | null>(null);
    const [HotelNameError, setHotelNameError] = useState<string | null>(null);


    const handleHotelImageClick = (file: File) => {
        setpreviewHotelImage(URL.createObjectURL(file));
    };

    const handleHotelClosePreview = () => {
        setpreviewHotelImage(null);
    };


    const validateHotel = (value: string) => {
        const regex = /^[^0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>?/`~]/;
        if (!regex.test(value)) {
            setHotelNameError("โรงแรมที่ห้ามขึ้นต้นด้วยตัวเลขหรือตัวอักษรพิเศษ");
        } else {
            setHotelNameError(null);
        }
    };

    const handleHotelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSelectedHotel(value);
        validateHotel(value);
    };



    const handleReset = () => {
        setSelectedHotel("");
        setHotelNameError(null);
        setHotelFileList([]);};

    const handleHotelFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const files = Array.from(event.target.files);

            if (HotelNameError) {
                message.error(HotelNameError);
                return;
            }

            if (hotelfileList.length + files.length > 5) {
                message.error("คุณสามารถอัพโหลดรูปภาพได้ไม่เกิน 5 รูป");
                return;
            }

            const validFiles = files.filter((file) => {
                const isValidType = ["image/jpeg", "image/png", "image/jpg"].includes(file.type);
                const isValidSize = file.size <= 10 * 1024 * 1024;

                if (!isValidType) {
                    message.error(`${file.name} ไม่ใช่ไฟล์รูปภาพที่รองรับ`);
                }
                if (!isValidSize) {
                    message.error(`${file.name} มีขนาดใหญ่เกินไป (สูงสุด 10MB)`);
                }
                return isValidType && isValidSize;
            });

            setHotelFileList((prev) => [...prev, ...validFiles]);

            const newImages = validFiles.map((file, index) => ({
                ID: index + images.length,
                FilePath: file.name
            }));
            setImage((prev) => [...prev, ...newImages]);
        }
    };

    const removeHotelFile = (index: number) => {
        setHotelFileList((prev) => prev.filter((_, i) => i !== index));
        setImage((prev) => prev.filter((_, i) => i !== index));
    };


    const onFinished = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (HotelNameError) {
            message.error("กรุณากรอกข้อมูลให้ถูกต้อง");
            return;
        }
        
        if (!selectedHotel && hotelfileList.length === 0) {
            message.error("กรุณาเลือกข้อมูลให้ครบถ้วน");
            return;
        }

        if (hotelfileList.length === 0) {
            message.error("กรุณาอัปโหลดรูปภาพอย่างน้อย 1 รูป");
            return;
        }

        const HotelsData: HotelsInterface = {
            HotelName: selectedHotel,
            HotelImagesInterface: images
        }

        const resHotel = await CreateHotel(HotelsData);

        const formDataImageHotel = new FormData();
        for (const file of hotelfileList) {
            formDataImageHotel.append("hotelimage", file);
        }

        const resHotelImage = await CreateHotelImage(formDataImageHotel, resHotel.data.ID);

        if (resHotel && resHotelImage) {
            message.success("บันทึกข้อมูลเรียบร้อย");
            handleReset();
        } else {
            message.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        }

    };


    return (
        <div className="hotel-create-page">
            <Navbar page={"accomodation-management"} />
            <div className="min-h-screen bg-customSkyYellow text-black">
                <div className="flex">
                    <div className="bg-black text-customYellow font-bold text-[28px] py-2 px-4 w-96 rounded-r-[25px] text-center mt-20">
                        สร้างโรงแรม
                    </div>
                </div>
                <form className="max-w-7xl mx-auto -mt-5" onSubmit={onFinished}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-20 bg-white rounded-[25px] p-20">
                        {/* Left Column */}
                        <div className="space-y-4">
                            <label className="block text-[24px] font-bold text-black mb-1">
                                ชื่อที่พัก
                            </label>
                            <input
                                type="text"
                                name="hotel"
                                className="location-input block w-full rounded-[25px] p-2 "
                                placeholder="กรอกชื่อที่พัก"
                                value={selectedHotel}
                                onChange={handleHotelChange}
                                required
                            />
                            {HotelNameError && (
                                <div
                                    className="text-red-600 mt-2 flex items-center transition-all duration-300"
                                >

                                    {HotelNameError}
                                </div>
                            )}
                        </div>
                        {/* Right Column */}
                        <div className="space-y-4">


                            <label className="block text-[24px] font-bold text-black mb-1">
                                รูปภาพที่พัก
                            </label>
                            <div className="relative w-full max-w-md">
                                <input
                                    type="file"
                                    id="hotel-file-upload"
                                    className="image-input-upload hidden"
                                    accept="image/*"
                                    onChange={handleHotelFileChange}
                                    multiple
                                    required
                                />
                                <label
                                    htmlFor="hotel-file-upload"
                                    className="w-full px-5 py-3 text-gray-700 bg-white border border-gray-300 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-gray-400 cursor-pointer flex items-center justify-between"
                                >
                                    <span>{"กรุณาเลือกรูปที่พัก"}</span>
                                    <img
                                        src="/images/icons/image-upload.png"
                                        alt="รูปภาพที่พัก"
                                        className="w-6 h-6"
                                    />
                                </label>
                            </div>
                            <div className="flex flex-wrap gap-4 mt-4">
                                {hotelfileList.length > 0 ? (
                                    hotelfileList.map((file, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt="hotel preview"
                                                className="w-24 h-24 object-cover rounded-lg shadow"
                                                onClick={() => handleHotelImageClick(file)}
                                            />
                                            <button
                                                type="button"
                                                className="absolute top-0 right-0 p-1"
                                                onClick={() => removeHotelFile(index)}
                                            >
                                                <img
                                                    src="/images/icons/close.png"
                                                    alt="remove"
                                                    className="w-6 h-6"
                                                />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">ยังไม่มีรูปที่เลือก</p>
                                )}
                            </div>
                            {previewHotelImage && (
                                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                                    <div className="relative">
                                        <img
                                            src={previewHotelImage}
                                            alt="Preview"
                                            className="max-w-[80vw] max-h-[80vh] rounded-lg object-contain"
                                        />
                                        <button
                                            type="button"
                                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
                                            onClick={handleHotelClosePreview}
                                        >
                                            <img
                                                src="/images/icons/close.png"
                                                alt="remove"
                                                className="w-6 h-6"
                                            />

                                        </button>
                                    </div>
                                </div>
                            )}

                            {hotelfileList.length > 0 && (
                                <p className="text-gray-700 mt-2">คุณเลือก {hotelfileList.length}/5 รูป</p>
                            )}

                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-4 mt-10">
                        <CancelBT />
                        <button
                            type="reset"
                            className="bg-customYellow text-black text-base font-semibold ml-5 rounded-[15px] h-[50px] w-[110px] p-2  hover:bg-yellow-500"
                            onClick={handleReset}

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
    );
}

export default HotelCreate;
