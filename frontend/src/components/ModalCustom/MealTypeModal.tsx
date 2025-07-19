import React from 'react';
import { motion } from 'framer-motion';

interface MealTypeModalProps {
  visible: boolean;
  onCancel: () => void;
  onSelect: (mealType: string) => void;
  packageName: string;
}

const MealTypeModal: React.FC<MealTypeModalProps> = ({
  visible,
  onCancel,
  onSelect,
  packageName
}) => {
  if (!visible) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  const mealTypes = [
    {
      id: 'breakfast',
      title: 'อาหารเช้า',
      icon: '/images/icons/breakfast.png',
      color: 'bg-green-100',
      hoverColor: 'group-hover:bg-green-200',
      textColor: 'text-green-600'
    },
    {
      id: 'lunch',
      title: 'อาหารกลางวัน',
      icon: '/images/icons/lunch.png',
      color: 'bg-blue-100',
      hoverColor: 'group-hover:bg-blue-200',
      textColor: 'text-blue-600'
    },
    {
      id: 'dinner',
      title: 'อาหารเย็น',
      icon: '/images/icons/dinner.png',
      color: 'bg-red-100',
      hoverColor: 'group-hover:bg-red-200',
      textColor: 'text-red-600'
    }
  ];

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 overflow-hidden"
      >
        <div className="p-8">
          <h2 className="text-2xl font-bold text-center mb-8">เลือกมื้ออาหารที่ต้องการแก้ไข</h2>
          <div className="grid grid-cols-3 gap-6 mb-8">
            {mealTypes.map((type) => (
              <motion.div
                key={type.id}
                className="cursor-pointer group"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(type.id)}
              >
                <div className="bg-white rounded-2xl p-4 border-2 border-gray-200 hover:border-customYellow hover:shadow-xl transition-all duration-300 h-full">
                  <div className="flex flex-col items-center space-y-4">
                    <div className={`w-20 h-20 ${type.color} rounded-full flex items-center justify-center p-4 ${type.hoverColor} transition-colors`}>
                      <img
                        src={type.icon}
                        alt={`${type.title} icon`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <h3 className={`text-lg font-semibold ${type.textColor}`}>
                      {type.title}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="bg-gray-50 rounded-xl p-4 mt-4">
            <p className="text-center text-gray-600">
              กำลังแก้ไขทัวร์: <span className="font-medium text-gray-800">"{packageName}"</span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MealTypeModal;