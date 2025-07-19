import { useRoutes, RouteObject } from "react-router-dom";
import MainRoutes from "./MainRoutes";
import CustomerRoutes from "./CustomerRoutes";
import AdminRoutes from "./AdminRoutes";
import EmployeeRoutes from "./EmployeeRoutes";

function ConfigRoutes() {
    // ตรวจสอบสถานะการล็อกอิน
    const isLoggedIn = localStorage.getItem("isLogin") === "true";
    const isEmployeeLoggedIn = localStorage.getItem("isEmployeeLogin") === "true";
    const role = localStorage.getItem("role") === "1";

    let routes: RouteObject[] = [];

    if (isEmployeeLoggedIn && role) {
        routes = [AdminRoutes()];
    } 
    else if(isLoggedIn&& isEmployeeLoggedIn&& !role){
        routes = [EmployeeRoutes()];
    }
    else if (isLoggedIn) {
        routes = [CustomerRoutes()];
    } 
    else {
        routes = [MainRoutes()];
    }

    // ส่งเส้นทางไปที่ useRoutes
    return useRoutes(routes);
}

export default ConfigRoutes;
