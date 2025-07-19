import "./Footer.css"

function Footer(){
    return (
        <div className="footer-container">
            <div className="logo-box">My Logo</div>
            <span className="time-open">
                ศูนย์บริการลูกค้า เปิดบริการทุกวัน เวลา 8:30 - 16.00 น.
            </span>
            <div className="contact-box">
                <div className="contact">
                    <div className="img-box">
                        <img src="./images/icons/phone.png" alt="" />
                    </div>
                    <span className="detail">099-999-9999</span>
                </div>
                <div className="contact">
                    <div className="img-box">
                        <img src="./images/icons/line.png" alt="" />
                    </div>
                    <span className="detail">line@se</span>
                </div>
                <div className="contact">
                    <div className="img-box">
                        <img src="./images/icons/email.png" alt="" />
                    </div>
                    <span className="detail">Se67@gmail.com</span>
                </div>
                <div className="contact">
                    <div className="img-box">
                        <img src="./images/icons/facebook.png" alt="" />
                    </div>
                    <span className="detail">seTourThai888</span>
                </div>
            </div>
        </div>
    )
}
export default Footer