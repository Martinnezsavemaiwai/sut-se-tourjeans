import { Link } from 'react-router-dom';
import "./Navbar.css"
import { apiUrl, GetCustomerByID } from '../../services/http';
import { useEffect, useState } from 'react';
import { CustomersInterface } from '../../interfaces/ICustomers';

function Navbar(props: { page: any; scrollOnTop: boolean }) {

    const { page, scrollOnTop } = props
    const customerID = localStorage.getItem('id')

    const [customer, setCustomer] = useState<CustomersInterface>()

    async function getCustomer() {
        const res = await GetCustomerByID(Number(customerID))
        if (res) {
            setCustomer(res)
        }
    }

    useEffect(()=>{
        getCustomer()
    }, [])

    const isLoggedIn = localStorage.getItem("isLogin") === "true";
    const imageUrl = `${apiUrl}/${customer?.ProfilePath}?t=${new Date().getTime()}`

    const links = document.querySelectorAll(".link")
    if (links && scrollOnTop === true && page === "home") {
        links.forEach((link) => {
            (link as HTMLElement).style.color = "white"
        })
    }
    else {
        links.forEach((link) => {
            (link as HTMLElement).style.color = "black"
        })
    }

    return (
        <nav className="navbar"
            style={{
                backgroundColor: page == "home" ? (scrollOnTop == true ? "transparent" : "var(--title-color-1)") : "var(--title-color-1)",
                boxShadow: page == "home" ? (scrollOnTop == true ? "transparent" : "var(--title-color-1)") : "0 0px 5px rgba(0, 0, 0, 0.2)"
            }}
        >
            <div className="logo-box">
                <img src="./images/logo/logo3.png" alt="" />
            </div>
            <div className="link-page-box">
                <Link to="/" 
                    className={`link-home link ${page=="home"?"active":""}`}
                >หน้าหลัก</Link>
                <Link to="/tour-package" 
                    className={`link-tour-package link ${page=="tourPackage"?"active":""}`}
                >ทัวร์แพ็กเกจ</Link>
                <Link to="/promotions" 
                    className={`link-promotion link ${page=="promotion"?"active":""}`}
                >โปรโมชัน</Link>
                <Link to="/profile" 
                    className={`link-profile link ${page=="profile"?"active":""}`}
                >โปรไฟล์</Link>
            </div>
            <Link to={isLoggedIn ? "/profile" : "/login-customer"}>
                <div className={`login-box ${page==="home" && scrollOnTop ? "login-home-page" : ""}`}>
                    <div className='text'>{customer ? `${customer.UserName}` : "Sign In"}</div>
                    <div className="img-box">
                        <img src={customer ? (customer.ProfilePath ? imageUrl : "./images/icons/user.png") : "./images/icons/log-in.png"} alt="" />
                    </div>
                </div>
            </Link>
        </nav>
    )
}
export default Navbar