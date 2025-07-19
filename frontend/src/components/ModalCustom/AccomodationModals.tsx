import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AccommodationsInterface } from '../../interfaces/IAccommodations';
import MealTypeModal from './MealTypeModal';

interface ModalProps {
  visible: boolean;
  type: "edit" | "delete" | "option" | null;
  data: AccommodationsInterface | null;
  onCancel: () => void;
  onConfirmDelete?: () => void;
  onEdit?: (id: number, type: "meal" | "accommodation" , mealType?: string) => void;
  onShowMore?: (id: number) => void;
}

const AccomodationModals: React.FC<ModalProps> = ({
  visible,
  type,
  data,
  onCancel,
  onConfirmDelete,
  onEdit,
  onShowMore
}) => {
  const [showMealTypeModal, setShowMealTypeModal] = useState(false);

  if (!visible) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  const handleMealTypeSelect = (mealType: string) => {
    if (data?.ID && onEdit) {
      onEdit(data.ID, "meal", mealType);  
      setShowMealTypeModal(false);
      onCancel();
    }
  };
  const editOptions = [
    {
      id: 'accommodation',
      title: 'แก้ไขที่พัก',
      icon: '/images/icons/hotel.png',
      alt: 'Accommodation icon',
      description: 'จัดการข้อมูลที่พัก'
    },
    {
      id: 'meal',
      title: 'แก้ไขอาหาร',
      icon: '/images/icons/spaghetti.png',
      alt: 'Meal icon',
      description: 'จัดการข้อมูลอาหารในแต่ละมื้อ'
    }
  ];

  const renderModalContent = () => {
    switch (type) {
      case 'edit':
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-center mb-8">เลือกสิ่งที่ต้องการจะแก้ไข</h2>
            <div className="grid grid-cols-2 gap-8 mb-8">
              {editOptions.map((option) => (
                <motion.div
                  key={option.id}
                  className="cursor-pointer group"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (option.id === 'meal') {
                      setShowMealTypeModal(true);
                    } else if (data?.ID && onEdit) {
                      onEdit(data.ID, option.id as "accommodation" | "meal");
                      onCancel();
                    }
                  }}
                >
                  {/* Rest of the option rendering code remains the same */}
                  <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-customYellow hover:shadow-xl transition-all duration-300 h-full">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center p-5 group-hover:bg-yellow-200 transition-colors">
                        <img
                          src={option.icon}
                          alt={option.alt}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600">
                        {option.title}
                      </h3>
                      <p className="text-sm text-gray-600 text-center">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="bg-gray-50 rounded-xl p-4 mt-4">
              <p className="text-center text-gray-600">
                กำลังแก้ไขทัวร์: <span className="font-medium text-gray-800">"{data?.TourPackage?.TourName}"</span>
              </p>
            </div>
          </div>
        );
        case 'delete':
          return (
            <div className="p-6">
              <div className="flex items-center justify-center space-x-2 mb-6">
                <div className="text-lg font-bold text-red-600">
                  ยืนยันการยกเลิกที่พักและอาหาร
                </div>
                <img
                  src="/images/icons/mark.png"
                  alt="Confirmation Icon"
                  className="w-6 h-6"
                />
              </div>
              <div className="text-center mb-8">
                <p className="text-gray-700 text-base mb-2">
                  คุณต้องการยกเลิกที่พัก{" "}
                  <span className="text-green-600 font-semibold">
                    {data?.Hotel?.HotelName}
                  </span>{" "}
                  หรือไม่?
                </p>
                <p className="text-gray-500 text-sm">
                  (ทัวร์: {data?.TourPackage?.TourName})
                </p>
              </div>
              <div className="flex justify-end gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gray-300 text-black px-6 py-2 rounded-lg hover:bg-gray-400 transition-all"
                  onClick={onCancel}
                >
                  ยกเลิก
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-all"
                  onClick={onConfirmDelete}
                >
                  ยืนยัน
                </motion.button>
              </div>
            </div>
          );
  
        case 'option':
          return (
            <div className="p-6">
              <div className="flex items-center justify-center space-x-2 mb-6">
                <div className="text-lg font-bold text-blue-600">
                  ดูรายละเอียดข้อมูล
                </div>
                <img
                  src="/images/icons/information.png"
                  alt="Information Icon"
                  className="w-6 h-6"
                />
              </div>
              <div className="text-center mb-8">
                <p className="text-gray-700 text-base mb-2">
                  คุณต้องการดูรายละเอียดของที่พัก{" "}
                  <span className="text-green-600 font-semibold">
                    {data?.Hotel?.HotelName}
                  </span>{" "}
                  หรือไม่?
                </p>
                <p className="text-gray-500 text-sm">
                  (ทัวร์: {data?.TourPackage?.TourName})
                </p>
              </div>
              <div className="flex justify-end gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gray-300 text-black px-6 py-2 rounded-lg hover:bg-gray-400 transition-all"
                  onClick={onCancel}
                >
                  ยกเลิก
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-all"
                  onClick={() => {
                    if (data?.ID && onShowMore) {
                      onShowMore(data.ID);
                      onCancel();
                    }
                  }}
                >
                  ตกลง
                </motion.button>
              </div>
            </div>
          );
  
        default:
          return null;
      }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={handleBackdropClick}>
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 overflow-hidden"
        >
          {renderModalContent()}
        </motion.div>
      </div>
      
      <MealTypeModal
        visible={showMealTypeModal}
        onCancel={() => setShowMealTypeModal(false)}
        onSelect={handleMealTypeSelect}
        packageName={data?.TourPackage?.TourName || ""}
      />
    </>
  );
};

export default AccomodationModals;