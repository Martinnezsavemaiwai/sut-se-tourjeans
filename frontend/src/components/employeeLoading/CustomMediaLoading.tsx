import React from 'react';
import Lottie from 'lottie-react';
import animationData from './Animation - 1737490071528.json';

interface CustomLoadingProps {
  message?: string;
  width?: number;
  height?: number;
}

const CustomMediaLoading: React.FC<CustomLoadingProps> = ({
  message = "กำลังโหลด...",
  width = 200,
  height = 200
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col items-center">
        {/* Lottie Animation Container */}
        <div 
          className="flex items-center justify-center"
          style={{ width, height }}
        >
          <Lottie animationData={animationData} loop autoplay />
        </div>

        {/* Loading Message */}
        <div className="mt-4 text-center">
          <p className="text-lg font-medium text-black">{message}</p>
        </div>

        {/* Optional Decorative Elements */}
        <div className="flex space-x-2 mt-3">
          <div className="w-2 h-2 bg-customYellow rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-customYellow rounded-full animate-bounce" 
               style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-customYellow rounded-full animate-bounce" 
               style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default CustomMediaLoading;
