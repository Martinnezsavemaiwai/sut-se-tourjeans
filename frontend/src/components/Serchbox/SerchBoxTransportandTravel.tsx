import { FaSearch } from 'react-icons/fa';
import './SerchBox.css';
import TravelButtonNew from '../NewTravelTransportButton/TravelButttonNew';
import TransportButtonNew from '../NewTravelTransportButton/TransportButtonNew';

interface SearchBoxProps {
    onSearch: (searchTerm: string) => void;
}

function SerchBoxTransportandTravel({ onSearch }: SearchBoxProps) {
    return (
        <div className="serch-box p-4">
            <div className="flex justify-between items-center space-y-2 md:space-y-0">
                {/* ช่องค้นหา */}
                <div className="relative w-full max-w-md">
                    <input
                        type="text"
                        placeholder="ค้นหาการเดินทางและการขนส่ง"
                        className="w-full px-5 py-3 text-gray-700 bg-white border border-gray-300 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-gray-400"
                        onChange={(e) => onSearch(e.target.value)}
                    />
                    <button
                        className="absolute top-1/2 -translate-y-1/2 right-3 flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full hover:bg-gray-200 transition duration-200"
                    >
                        <FaSearch className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                
                <div className="flex space-x-3">
                    <TravelButtonNew />
                    <TransportButtonNew />
                </div>
            </div>
        </div>
    );
}

export default SerchBoxTransportandTravel;
