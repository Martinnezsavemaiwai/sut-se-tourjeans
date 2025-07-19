import { useNavigate } from 'react-router-dom';

function TravelButtonNew() {
    const navigate = useNavigate(); // สร้างฟังก์ชันนำทาง

    const handleClick = () => {
        navigate(`/Create/TravelManagement`); 
    };

    return (
        <div className="flex justify-center items-center mt-4">
            <button
                className="group flex items-center gap-2 bg-customYellow hover:bg-customBlue text-black text-base hover:text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                onClick={handleClick}
            >
                {/* รูปภาพ */}
                <img
                    src="/images/icons/plus (1).png"
                    alt="เพิ่ม"
                    className="w-5 h-5 group-hover:hidden"
                />
                <img
                    src="/images/icons/plus (2).png"
                    alt="เพิ่ม (Hover)"
                    className="w-5 h-5 hidden group-hover:block"
                />
                {/* ข้อความ */}
                เพิ่มการเดินทางและขนส่ง
            </button>
        </div>
    );
}

export default TravelButtonNew;
