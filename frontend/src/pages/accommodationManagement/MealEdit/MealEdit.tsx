import { useEffect, useState } from "react";
import CancelBT from "../../../components/CancelBT/Cancel";
import Navbar from "../../../components/Navbar-Management/Navbar";
import { UpdateMealByID, GetMealTypes, GetAccommodationByID, CreateMealImage } from "../../../services/http";
import { message } from "antd";
import Select from "react-select";
import { MealsInterface } from "../../../interfaces/IMeals";
import { MealsTypesInterface } from "../../../interfaces/IMealTypes";
import './MealEdit.css';
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AccommodationsInterface } from "../../../interfaces/IAccommodations";
import { MealImagesInterface } from "../../../interfaces/IMealImages";

function MealEdit() {
    const [searchParams] = useSearchParams();
    const mealTypeParam = searchParams.get('type'); 
    const [accommodation, setAccommodation] = useState<AccommodationsInterface | null>(null);
    const [mealTypes, setMealTypes] = useState<MealsTypesInterface[]>([]);
    const [menuName, setMenuName] = useState<string>("");
    const [selectedType, setSelectedType] = useState<string>("");
    const [fileList, setFileList] = useState<File[]>([]);
    const [mealNameError, setMealNameError] = useState<string | null>(null);
    const { id } = useParams<{ id: string }>();
    const [images, setImages] = useState<MealImagesInterface[]>([]);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const navigate = useNavigate();

    const fetchAccommodationData = async () => {
        const res = await GetAccommodationByID(Number(id));
        if (res) {
            setAccommodation(res);
            const relevantMeal = res.Meals?.find((meal: MealsInterface) => {
                switch (mealTypeParam) {
                    case 'breakfast':
                        return meal.MealType?.TypeName === 'อาหารเช้า';
                    case 'lunch':
                        return meal.MealType?.TypeName === 'อาหารกลางวัน';
                    case 'dinner':
                        return meal.MealType?.TypeName === 'อาหารเย็น';
                    default:
                        return false;
                }
            });

            if (relevantMeal) {
                setMenuName(relevantMeal.MenusDetail || "");
                setSelectedType(relevantMeal.MealTypeID?.toString() || "");
                setImages(relevantMeal.MealImagesInterface || []);
            } else {
                message.error("ไม่พบข้อมูลมื้ออาหารที่ต้องการแก้ไข");
                navigate("/AccommodationManagement");
            }
        }
    };

    const getMealTypes = async () => {
        const res = await GetMealTypes();
        if (res) {
            setMealTypes(res);
            const matchingType = res.find((type: MealsTypesInterface) => {
                switch (mealTypeParam) {
                    case 'breakfast':
                        return type.TypeName === 'อาหารเช้า';
                    case 'lunch':
                        return type.TypeName === 'อาหารกลางวัน';
                    case 'dinner':
                        return type.TypeName === 'อาหารเย็น';
                    default:
                        return false;
                }
            });
            if (matchingType) {
                setSelectedType(matchingType.ID?.toString() || "");
            }
        }
    };

    const handleImageClick = (file: File) => {
        setPreviewImage(URL.createObjectURL(file));
    };

    const handleClosePreview = () => {
        setPreviewImage(null);
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
            setImages((prev) => [...prev, ...newImages]);
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

    
    const removeFile = (index: number) => {
        setFileList((prev) => prev.filter((_, i) => i !== index));
        setImages((prev) => prev.filter((_, i) => i !== index));
    };
    const onFinished = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (mealNameError) {
            message.error(mealNameError);
            return;
        }

        const existingMeal = accommodation?.Meals?.find(meal => 
            meal.MealTypeID?.toString() === selectedType
        );

        const updatedMeal: MealsInterface = {
            ID: existingMeal?.ID,
            MenusDetail: menuName,
            MealTypeID: Number(selectedType),
            MealType: {},
            MealImagesInterface: images,
            AccommodationID: accommodation?.ID
        };

        const resMeal = await UpdateMealByID(updatedMeal, existingMeal?.ID || 0);

        if (fileList.length > 0) {
            const formDataImageMeal = new FormData();
            for (const file of fileList) {
                formDataImageMeal.append("mealimage", file);
            }    

            const resMealImages = await CreateMealImage(formDataImageMeal, resMeal.data.ID);
            if (!resMealImages) {
                message.error("เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ");
                return;
            }
        }

        if (resMeal) {
            message.success("อัปเดตข้อมูลเมนูอาหารเรียบร้อย");
            setTimeout(() => {
                navigate("/AccommodationManagement");
            }, 2000);
        } else {
            message.error("เกิดข้อผิดพลาดในการอัปเดตข้อมูล");
        }
    };

    useEffect(() => {
        if (!mealTypeParam) {
            message.error("ไม่พบข้อมูลประเภทมื้ออาหาร");
            navigate("/AccommodationManagement");
            return;
        }
        fetchAccommodationData();
        getMealTypes();
    }, [mealTypeParam]);

    const mealTypeSelectStyles = {
        control: (base: any) => ({
            ...base,
            backgroundColor: '#f3f4f6',
            cursor: 'not-allowed'
        })
    };

    return (
        <div className="meal-edit-page">
            <Navbar page={"accomodation-management"} />
            <div className="min-h-screen bg-customSkyYellow text-black">
                <div className="flex">
                    <div className="bg-black text-customYellow font-bold text-[28px] py-2 px-4 w-96 rounded-r-[25px] text-center mt-20">
                        แก้ไขเมนูอาหาร
                    </div>
                </div>
                <form className="max-w-7xl mx-auto -mt-5" onSubmit={onFinished}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-20 bg-white rounded-[25px] p-20">
                        {/* Left Column */}
                        <div className="space-y-4">
                            <label className="block text-[24px] font-bold text-black mb-1">
                                ประเภทอาหาร
                            </label>
                            <Select
                                options={mealTypes.map((item) => ({
                                    value: item.ID,
                                    label: item.TypeName,
                                }))}
                                value={mealTypes
                                    .filter((item) => item.ID?.toString() === selectedType)
                                    .map((item) => ({
                                        value: item.ID,
                                        label: item.TypeName,
                                    }))}
                                isDisabled={true}
                                styles={mealTypeSelectStyles}
                                classNamePrefix="react-select"
                            />
                        </div>
                        {/* Right Column remains the same */}
                        <div className="space-y-4">
                            <label className="block text-[24px] font-bold text-black mb-1">
                                รายละเอียดเมนู
                            </label>
                            <input
                                type="text"
                                className={`location-input block w-full rounded-[25px] p-2 text-gray-700 bg-white border ${
                                    mealNameError ? "border-red-500" : "border-gray-300"
                                } rounded-full shadow focus:outline-none focus:ring-2 focus:ring-gray-400`}
                                placeholder="กรุณาใส่รายละเอียดเมนู"
                                value={menuName}
                                onChange={(e) => {
                                    setMenuName(e.target.value);
                                    validateMealName(e.target.value);
                                }}
                                required
                            />
                            {mealNameError && (
                                <p className="text-red-500 text-sm mt-2">{mealNameError}</p>
                            )}
                            {/* File upload section remains the same */}
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

export default MealEdit;