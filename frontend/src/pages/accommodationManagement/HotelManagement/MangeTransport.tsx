import ManageHotel from "../../../components/ManageHotel/manageHotel";
import Navbar from "../../../components/Navbar-Management/Navbar";

function HotelManagement() {
    return (
<div className="fixed inset-0 overflow-hidden bg-customSkyYellow">            
    <Navbar page={"accomodation-management"} />
            <div className="container mx-auto">
                <div className="flex justify-center items-center mt-20">
                    <div className="bg-black text-customYellow font-bold text-[28px] py-2 px-4 w-full md:w-96 text-center rounded-[25px]">
                        จัดการที่พัก
                    </div>
                </div>
                <div className="mt-10">
                    <ManageHotel />
                </div>
            </div>
        </div>
    );
}
export default HotelManagement;