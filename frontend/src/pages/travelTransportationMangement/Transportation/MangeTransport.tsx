import ManageVehicle from "../../../components/ManageVehicle/manageVehicle";
import Navbar from "../../../components/Navbar-Management/Navbar";

function TransportManagement() {
    return (
<div className="fixed inset-0 overflow-hidden bg-customSkyYellow">            
    <Navbar page={"trnsport-management"} />
            <div className="container mx-auto">
                <div className="flex justify-center items-center mt-20">
                    <div className="bg-black text-customYellow font-bold text-[28px] py-2 px-4 w-full md:w-96 text-center rounded-[25px]">
                        จัดการยานพาหนะ
                    </div>
                </div>
                <div className="mt-10">
                    <ManageVehicle />
                </div>
            </div>
        </div>
    );
}
export default TransportManagement;