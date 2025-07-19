import { useEffect, useState } from "react";
import CancelBT from "../../../components/CancelBT/Cancel";
import Navbar from "../../../components/Navbar-Management/Navbar";
import { GetTourPackages, CreateMeal, CreateMealImage, GetMealTypes } from "../../../services/http";
import { message } from "antd";
import Select from "react-select";
import { TourPackagesInterface } from "../../../interfaces/ITourPackages";
import { MealsInterface } from "../../../interfaces/IMeals";
import { MealImagesInterface } from "../../../interfaces/IMealImages";
import { MealsTypesInterface } from "../../../interfaces/IMealTypes";
import './MealCreate.css';
import { useNavigate } from "react-router-dom";

function MealCreate() {
    const [tourPackages, setTourPackages] = useState<TourPackagesInterface[]>([]);
    const [melsTypes, setMelsTypes] = useState<MealsTypesInterface[]>([]);
    const [menuName, setmenuName] = useState<string>("");
    const [selectedType, setSelectedType] = useState<string>("");
    const [images, setImage] = useState<MealImagesInterface[]>([]);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [fileList, setFileList] = useState<File[]>([]);
    const [mealNameError, setMealNameError] = useState<string | null>(null);
    const [selectedTour, setSelectedTour] = useState<string | null>("");
    const navigate = useNavigate();
    
    const handleImageClick = (file: File) => {
        setPreviewImage(URL.createObjectURL(file));
    };

    const handleClosePreview = () => {
        setPreviewImage(null);
    };


    const getMelsTypes = async () => {
        const res = await GetMealTypes();
        if (res) {
            setMelsTypes(res);
        }
    }


    const getTourPackages = async () => {
        const res = await GetTourPackages();
        if (res) {
            setTourPackages(res);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const files = Array.from(event.target.files);

            if (mealNameError) {
                message.error(mealNameError);
                return;
            }

            if (fileList.length + files.length > 5) {
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

            setFileList((prev) => [...prev, ...validFiles]);


            const newImages = validFiles.map((file, index) => ({
                ID: index + images.length,
                FilePath: file.name
            }));
            setImage((prev) => [...prev, ...newImages]);
        }
    };


    const validateMealName = (value: string): boolean => {
        const regex = /^[^0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>?/`~]/;
        if (!regex.test(value)) {
            setMealNameError("ห้ามขึ้นต้นด้วยตัวเลขหรือตัวอักษรพิเศษ");
            return false;
        }
        setMealNameError(null);
        return true;
    };
    const handleReset = () => {
        setSelectedType("");
        setImage([]);
        setFileList([]);
        setmenuName("");
        setSelectedTour(null);
        setMealNameError(null);
        setPreviewImage(null);
        navigate(0);
    };


    const removeFile = (index: number) => {
        setFileList((prev) => prev.filter((_, i) => i !== index));
        setImage((prev) => prev.filter((_, i) => i !== index));
    };

    const onFinished = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (validateMealName(menuName) === false) {
            message.error("เมนูอาหารห้ามขึ้นต้นด้วยตัวเลขหรือตัวอักษรพิเศษ");
            return;
        }
        if (!selectedTour || !selectedType || fileList.length === 0 || !menuName) {
            message.error("กรุณาเลือกข้อมูลให้ครบถ้วน");
            return;
        }


        if (fileList.length === 0) {
            message.error("กรุณาอัปโหลดรูปภาพอย่างน้อย 1 รูป");
            return;
        }

        const MealsData: MealsInterface = {
            MenusDetail: menuName,
            MealType: {},
            MealTypeID: Number(selectedType),
            MealImagesInterface: images,
            AccommodationID: Number(selectedTour),
        }
        const resMeal = await CreateMeal(MealsData);

        const formDataImageMeal = new FormData();
        for (const file of fileList) {
            formDataImageMeal.append("mealimage", file);
        }

        const resMealImage = await CreateMealImage(formDataImageMeal, resMeal.data.ID);

        if (resMeal && resMealImage) {
            message.success("บันทึกข้อมูลเมนูอาหารเรียบร้อย");
            setTimeout(() => {
                navigate(0);
            }, 2000);
        } else {
            message.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        }

    };

    useEffect(() => {
        getTourPackages();
        getMelsTypes();
    }, []);

    return (
        <div className="meal-create-page">
            <Navbar page={"accomodation-management"} />
            <div className="min-h-screen bg-customSkyYellow text-black">
                <div className="flex">
                    <div className="bg-black text-customYellow font-bold text-[28px] py-2 px-4 w-96 rounded-r-[25px] text-center mt-20">
                        สร้างเมนูอาหาร
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
                                ประเภทอาหาร
                            </label>
                            <Select
                                options={melsTypes.map((item) => ({
                                    value: item.ID,
                                    label: item.TypeName,
                                }))}
                                onChange={(option) => setSelectedType(String(option?.value || ""))}
                                placeholder="ค้นหาหรือเลือกประเภทอาหาร"
                                isClearable
                                classNamePrefix="react-select"
                            />
                        </div>
                        {/* Right Column */}
                        <div className="space-y-4">
                            <label className="block text-[24px] font-bold text-black mb-1">
                                รายละเอียดเมนู
                            </label>
                            <input
                                type="text"
                                className={`location-input block w-full rounded-[25px] p-2  text-gray-700 bg-white border ${mealNameError ? "border-red-500" : "border-gray-300"
                                    } rounded-full shadow focus:outline-none focus:ring-2 focus:ring-gray-400`}
                                placeholder="กรุณาใส่รายละเอียดเมนู"
                                value={menuName}
                                onChange={(e) => {
                                    setmenuName(e.target.value);
                                    validateMealName(e.target.value);
                                }}
                                required
                            />
                            {mealNameError && (
                                <p className="text-red-500 text-sm mt-2">{mealNameError}</p>
                            )}

                            <label className="block text-[24px] font-bold text-black mb-1">
                                รูปภาพอาหาร
                            </label>
                            <div className="relative w-full max-w-md">
                                <input
                                    type="file"
                                    id="food-file-upload"
                                    className="image-input-upload hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    multiple
                                    required
                                />
                                <label
                                    htmlFor="food-file-upload"
                                    className="w-full px-5 py-3 text-gray-700 bg-white border border-gray-300 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-gray-400 cursor-pointer flex items-center justify-between"
                                >
                                    <span>{"กรุณาเลือกรูปอาหาร"}</span>
                                    <img
                                        src="/images/icons/image-upload.png"
                                        alt="รูปภาพอาหาร"
                                        className="w-6 h-6"
                                    />
                                </label>
                            </div>
                            <div className="flex flex-wrap gap-4 mt-4">
                                {fileList.length > 0 ? (
                                    fileList.map((file, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt="meal preview"
                                                className="w-24 h-24 object-cover rounded-lg shadow"
                                                onClick={() => handleImageClick(file)}
                                            />
                                            <button
                                                type="button"
                                                className="absolute top-0 right-0 p-1"
                                                onClick={() => removeFile(index)}
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
                            {previewImage && (
                                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                                    <div className="relative">
                                        <img
                                            src={previewImage}
                                            alt="Preview"
                                            className="max-w-[80vw] max-h-[80vh] rounded-lg object-contain"
                                        />
                                        <button
                                            type="button"
                                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
                                            onClick={handleClosePreview}
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

                            {fileList.length > 0 && (
                                <p className="text-gray-700 mt-2">คุณเลือก {fileList.length}/5 รูป</p>
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

export default MealCreate;
