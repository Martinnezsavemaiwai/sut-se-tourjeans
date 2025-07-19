import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HotelsInterface } from "../../interfaces/IHotels";

interface ModalProps {
  visible: boolean;
  type: "edit" | "delete" | null;
  data: HotelsInterface | null;
  onCancel: () => void;
  onConfirmDelete?: () => void;
  onEdit?: (id: number) => void;
}

const ManageHotelModal: React.FC<ModalProps> = ({
  visible,
  type,
  data,
  onCancel,
  onConfirmDelete,
  onEdit,
}) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  const modalVariants = {
    hidden: { 
      scale: 0.9, 
      opacity: 0,
      transition: { duration: 0.2 }
    },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }
    }
  };

  const renderModalContent = () => {
    switch (type) {
      case "edit":
        return (
          <div className="p-6 space-y-4">
            <h2 className="text-2xl font-bold text-center text-gray-800">
              แก้ไขที่พัก
            </h2>
            <p className="text-gray-600 text-center">
              คุณกำลังแก้ไข: 
              <span className="font-semibold ml-2 text-gray-800">
                {data?.HotelName}
              </span>
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 w-full">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-6 py-2 rounded-lg 
                  border border-gray-300 
                  bg-white text-gray-800 
                  hover:bg-gray-100 
                  transition-all duration-300"
                onClick={onCancel}
              >
                ยกเลิก
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-6 py-2 rounded-lg 
                  bg-blue-600 text-white 
                  hover:bg-blue-700 
                  transition-all duration-300"
                onClick={() => {
                  if (data?.ID && onEdit) {
                    onEdit(data.ID);
                    onCancel();
                  }
                }}
              >
                ตกลง
              </motion.button>
            </div>
          </div>
        );
      case "delete":
        return (
          <div className="p-6 space-y-4">
            <h2 className="text-2xl font-bold text-center text-red-600">
              ยืนยันการลบ
            </h2>
            <p className="text-gray-600 text-center">
              คุณต้องการลบ "
              <span className="font-semibold text-red-700">
                {data?.HotelName}
              </span>
              " หรือไม่?
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 w-full">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-6 py-2 rounded-lg 
                  border border-gray-300 
                  bg-white text-gray-800 
                  hover:bg-gray-100 
                  transition-all duration-300"
                onClick={onCancel}
              >
                ยกเลิก
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-6 py-2 rounded-lg 
                  bg-red-500 text-white 
                  hover:bg-red-600 
                  transition-all duration-300"
                onClick={onConfirmDelete}
              >
                ยืนยัน
              </motion.button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto 
          bg-black/40 flex items-center justify-center 
          px-4 py-6"
          onClick={handleBackdropClick}
        >
          <motion.div
            key="modal"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={modalVariants}
            className="relative w-full max-w-md 
            bg-white rounded-xl shadow-2xl 
            overflow-hidden"
          >
            {renderModalContent()}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ManageHotelModal;