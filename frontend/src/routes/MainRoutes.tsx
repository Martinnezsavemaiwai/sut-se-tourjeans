import { RouteObject } from "react-router-dom";
import MinimalLayout from "../layouts/MinimalLayout/MinimalLayout";
import Home from "../pages/home/Home";
import LoginForCustomer from "../pages/authentication/login/LoginForCustomer";
import LoginForEmployee from "../pages/authentication/empolyeeLogin/LoginForEmployee";

const MainRoutes = (): RouteObject => {
    return {
        path: "/",

        element: <MinimalLayout />,

        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/login-customer",
                element: <LoginForCustomer/>,
            },
            {
                path: "/login-employee",
                element: <LoginForEmployee/>,
            },
            {
                path: "*",
                element: <LoginForCustomer />,
            },
        ],
    };
};

export default MainRoutes;