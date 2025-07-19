import { useEffect, useState } from "react";
import CancelBT from "../../../components/CancelBT/Cancel";
import Navbar from "../../../components/Navbar-Management/Navbar";
import { TransportationsInterface } from "../../../interfaces/ITransportations";
import { VehicleTypesInterface } from "../../../interfaces/IVehicleTypes";
import { VehicleImagesInterface } from "../../../interfaces/IVehicleImages";
import { GetTransportationByID, GetVehicleTypes, UpdateVehicleByID, CreateVehicleImage } from "../../../services/http";
import { useNavigate, useParams } from "react-router-dom";
import { message } from "antd";

function TransportEdit() {
  const { id } = useParams<{ id: string }>();
  const [transportation, setTransportation] = useState<TransportationsInterface | null>(null);
  const [vehicleTypes, setVehicleTypes] = useState<VehicleTypesInterface[]>([]);
  const [vehicleName, setVehicleName] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [images, setImages] = useState<VehicleImagesInterface[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [fileList, setFileList] = useState<File[]>([]);
  const [VehicleNameError, setVehicleNameError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchTransportationData = async () => {
    if (!id) return;
    const res = await GetTransportationByID(Number(id));
    if (res) {
      setTransportation(res);
    }
  };

  // Fetch vehicle types
  const fetchVehicleTypes = async () => {
    const res = await GetVehicleTypes();
    if (res) setVehicleTypes(res);
  };

  useEffect(() => {
    fetchTransportationData();
    fetchVehicleTypes();
  }, [id]);

  useEffect(() => {
    if (transportation) {
      setVehicleName(transportation.Vehicle?.VehicleName || "");
      setSelectedType(transportation.Vehicle?.VehicleTypeID?.toString() || "");
      setImages(transportation.Vehicle.VehicleImagesInterface || []);
    }
  }, [transportation]);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);

      if (fileList.length + files.length > 5) {
        message.error("คุณสามารถอัพโหลดรูปภาพได้ไม่เกิน 5 รูป");
        return;
      }

      const validFiles = files.filter((file) => {
        const isValidType = ["image/jpeg", "image/png", "image/jpg"].includes(file.type);
        const isValidSize = file.size <= 10 * 1024 * 1024;

        if (!isValidType) message.error(`${file.name} ไม่ใช่ไฟล์รูปภาพที่รองรับ`);
        if (!isValidSize) message.error(`${file.name} มีขนาดใหญ่เกินไป (สูงสุด 10MB)`);

        return isValidType && isValidSize;
      });

      setFileList((prev) => [...prev, ...validFiles]);
      const newImages = validFiles.map((file, index) => ({
        ID: index + images.length,
        FilePath: file.name,
        VehicleID: 0,
      }));
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const validateVehicleName = (value: string): boolean => {
    const regex = /^[^0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>?/`~]/;
    if (!regex.test(value)) {
      setVehicleNameError("ชื่อห้ามขึ้นต้นด้วยตัวเลขหรือตัวอักษรพิเศษ");
      return false;
    }
    setVehicleNameError(null);
    return true;
  };


  const handleReset = () => {
    setVehicleName("");
    setSelectedType("");
    setImages([]);
    setFileList([]);
    setVehicleNameError(null);
  };

  const handleImageClick = (file: File) => {
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleClosePreview = () => setPreviewImage(null);

  const removeFile = (index: number) => {
    setFileList((prev) => prev.filter((_, i) => i !== index));
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onFinished = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateVehicleName(vehicleName)) {
      message.error("กรุณากรอกชื่อยานพาหนะให้ถูกต้อง");
      return;
    }

    const updatedVehicle = {
      VehicleName: vehicleName,
      VehicleTypeID: Number(selectedType),
      VehicleImagesInterface: images,
    };

    const res = await UpdateVehicleByID(updatedVehicle, transportation?.Vehicle?.ID || 0);

    const formDataImageVehicle = new FormData();
    for (const file of fileList) {
      formDataImageVehicle.append("vehicleimage", file);
    }

    const resVehicleImages = await CreateVehicleImage(formDataImageVehicle, res.data.ID);

    if (res || resVehicleImages) {
      message.success("แก้ไขยานพาหนะสําเร็จ");
      setTimeout(() => {
        handleReset();
        navigate(`/TravelTransportMangement`);

      }, 2000);
    }
    else {
      message.error("แก้ไขยานพาหนะไม่สําเร็จ");
    }
  };

  return (
    <div className="transport-edit-page-container">
      <Navbar page={"trnsport-management"} />
      <div className="transport-edit-page">
        <div className="min-h-screen bg-customSkyYellow text-black">
          <div className="flex">
            <div className="bg-black text-customYellow font-bold text-[28px] py-2 px-4 w-96 rounded-r-[25px] text-center mt-20">
              แก้ไขการขนส่ง
            </div>
          </div>
          <form className="max-w-7xl mx-auto -mt-5" onSubmit={onFinished}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 bg-white rounded-[25px] p-20">
              {/* Left Column */}
              <div className="space-y-4">
                <label className="block text-[24px] font-bold text-black mb-1">
                  รูปภาพยานพาหนะ
                </label>
                <div className="relative w-full max-w-md">
                  <input
                    type="file"
                    id="file-upload"
                    className="image-input-upload hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                    multiple
                  />
                  <label
                    htmlFor="file-upload"
                    className="w-full px-5 py-3 text-gray-700 bg-white border border-gray-300 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-gray-400 cursor-pointer flex items-center justify-between"
                  >
                    <span>{"กรุณาเลือกรูปภาพยานพาหนะ"}</span>
                    <img
                      src="/images/icons/image-upload.png"
                      alt="รูปภาพยานพาหนะ"
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
                          alt="vehicle preview"
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
                        className="max-w-full max-h-screen rounded-lg"
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

              {/* Right Column */}
              <div className="space-y-4">
                <label className="block text-[24px] font-bold text-black mb-1">
                  ชื่อยานพาหนะ
                </label>
                <div className="relative w-full max-w-md">
                  <input
                    type="text"
                    className={`w-full px-5 py-3 text-gray-700 bg-white border ${VehicleNameError ? "border-red-500" : "border-gray-300"
                      } rounded-full shadow focus:outline-none focus:ring-2 focus:ring-gray-400`}
                    placeholder="กรุณาใส่ชื่อยานพาหนะ"
                    value={vehicleName}
                    onChange={(e) => {
                      setVehicleName(e.target.value);
                      validateVehicleName(e.target.value);
                    }}
                    required
                  />
                  {VehicleNameError && (
                    <p className="text-red-500 text-sm mt-2">{VehicleNameError}</p>
                  )}
                </div>
                <label className="block text-[24px] font-bold text-black mb-1">
                  ประเภทยานพาหนะ
                </label>
                <div className="relative w-full max-w-md">
                  <select
                    name="vehicle"
                    className="block w-full border border-gray-300 rounded-full p-3"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      เลือกประเภทยานพาหนะ
                    </option>
                    {vehicleTypes.map((item) => (
                      <option value={item.ID} key={item.ID}>
                        {item.TypeName}
                      </option>
                    ))}
                  </select>
                </div>
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
    </div>


  );
}

export default TransportEdit;
