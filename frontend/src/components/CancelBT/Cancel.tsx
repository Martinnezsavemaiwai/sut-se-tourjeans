import { useNavigate, useParams } from 'react-router-dom';

function CancelBT() {
    const navigate = useNavigate(); 
    const { id } = useParams<{ id: string }>();


    const handleClick = () => {
        const currentPath = window.location.pathname;      
        if (currentPath === '/Create/Accommodation' || currentPath === '/Create/Meal' || currentPath === `/Create/Hotel` || currentPath === `/Edit/Meal/${id}` || currentPath === `/Edit/Accommodation/${id}` || currentPath === `/ShowAccommodation/${id}`) {
            navigate('/AccommodationManagement');
        }
        else if (currentPath === `/EditTransport/${id}`) {
            navigate('/TransportManagement');
        }
        else if (currentPath === `/EditHotel/${id}`) {
            navigate('/HotelManagement');
        } 
        
        else {
            navigate('/TravelTransportManagement');
        }
    };

    return (
        <button
            type="button"
            className="bg-white text-black text-base font-semibold ml-5 rounded-[15px] h-[50px] w-[110px] p-2 flex items-center justify-center space-x-2 shadow-md hover:bg-gray-100 border border-black"
            onClick={handleClick}
        >
            ยกเลิก
        </button>
    );
}

export default CancelBT;
