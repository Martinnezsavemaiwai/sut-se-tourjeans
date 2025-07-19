import React from 'react';
import Lottie from 'lottie-react';
import animationData from './Animation - 1737538156482.json';

interface CustomErrorLoadingProps {
    message?: string;
    width?: number;
    height?: number;
    onRetry?: () => void;  // เพิ่ม prop สำหรับ retry
}

const CustomErrorLoading: React.FC<CustomErrorLoadingProps> = ({
    message = "กำลังโหลด...",
    width = 200,
    height = 200,
    onRetry
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

                {/* Error Message */}
                <div className="mt-4 text-center">
                    <p className="text-lg font-medium text-red-500">{message}</p>
                </div>

                {/* Retry Button */}
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="mt-4 px-6 py-2 bg-customYellow text-black rounded-lg 
                                 hover:bg-yellow-500 transition-colors"
                    >
                        ลองใหม่อีกครั้ง
                    </button>
                )}

                {/* Decorative Elements */}
                <div className="flex space-x-2 mt-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
                    <div 
                        className="w-2 h-2 bg-red-500 rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                    ></div>
                    <div 
                        className="w-2 h-2 bg-red-500 rounded-full animate-bounce"
                        style={{ animationDelay: '0.4s' }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default CustomErrorLoading;