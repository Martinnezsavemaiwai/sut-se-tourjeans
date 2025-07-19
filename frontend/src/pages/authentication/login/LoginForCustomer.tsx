import { useEffect, useRef, useState } from "react";
import "./LoginForCustomer.css";
import { message } from "antd";
import { SignInInterface } from "../../../interfaces/ISignIn";
import { CreateCustomer, SignInForCustomer } from "../../../services/http";
import { SignUpInterface } from "../../../interfaces/ISignUp";

interface Error {
    username?: string;
    firstname?: string;
    lastname?: string;
    email?: string;
    password?: string;
    phonenumber?: string;
}

function LoginForCustomer() {
    const [username, setUsername] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<Error>({});
    const [active, setActive] = useState(".signin-form")

    const [messageApiLogin, contextHolderLogin] = message.useMessage()
    const [focusedInput, setFocusedInput] = useState<string | null>(null)

    const [isSubmitting, setIsSubmitting] = useState(false)

    const usernameRef1 = useRef<HTMLInputElement>(null)
    const passwordRef1 = useRef<HTMLInputElement>(null)
    const usernameRef2 = useRef<HTMLInputElement>(null)
    const firstnameRef = useRef<HTMLInputElement>(null)
    const lastnameRef = useRef<HTMLInputElement>(null)
    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef2 = useRef<HTMLInputElement>(null)
    const phoneNumberRef = useRef<HTMLInputElement>(null)

    const handleFocus = (inputName: string) => {
        setFocusedInput(inputName)
    };

    const handleBlur = () => {
        setFocusedInput(null)
    }

    async function handleSignIn(e: { preventDefault: () => void }) {
        e.preventDefault();
        let hasError = false;
        const newErrors: Error = {};
        if (!username.trim()) {
            newErrors.username = "กรุณาป้อนชื่อผู้ใช้";
            hasError = true;
            usernameRef1.current?.focus()
        }
        if (!password.trim()) {
            newErrors.password = "กรุณาป้อนรหัสผ่าน";
            hasError = true;
            passwordRef1.current?.focus()
        }
        setErrors(newErrors);
        if (!hasError && active===".signin-form") {
            setIsSubmitting(true);
            const data: SignInInterface = {
                Username: username,
                Password: password,
            };

            try {
                let resSignin = await SignInForCustomer(data);
                if (resSignin) {
                    messageApiLogin.success("ลงชื่อเข้าใช้งานสำเร็จ");
                    localStorage.setItem("isLogin", "true");
                    localStorage.setItem("token_type", resSignin.token_type);
                    localStorage.setItem("token", resSignin.token);
                    localStorage.setItem("id", resSignin.id);

                    setTimeout(() => {
                        location.href = "/";
                    }, 2000);
                } else {
                    messageApiLogin.error("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
                }
            } catch (error) {
                messageApiLogin.error("เกิดข้อผิดพลาดในการลงชื่อเข้าใช้งาน");
            } finally {
                setIsSubmitting(false);
            }
        }
    }

    async function handleSignUp(e: { preventDefault: () => void }) {
        e.preventDefault();
        let hasError = false;
        const newErrors: Error = {};
        if (!username.trim()) {
            newErrors.username = "กรุณาป้อนชื่อผู้ใช้";
            hasError = true;
            usernameRef2.current?.focus()
        }
        else if (!firstname.trim()) {
            newErrors.firstname = "กรุณาป้อนชื่อจริง";
            hasError = true;
            firstnameRef.current?.focus()
        }
        else if (!lastname.trim()) {
            newErrors.lastname = "กรุณาป้อนนามสกุล";
            hasError = true;
            lastnameRef.current?.focus()
        }
        else if (!email.trim()) {
            newErrors.email = "กรุณาป้อนอีเมล";
            hasError = true;
            emailRef.current?.focus()
        }
        else if (!password.trim()) {
            newErrors.password = "กรุณาป้อนรหัสผ่าน";
            hasError = true;
            passwordRef2.current?.focus()
        }
        else if (!phoneNumber.trim()) {
            newErrors.phonenumber = "กรุณาป้อนเบอร์โทร";
            hasError = true;
            phoneNumberRef.current?.focus()
        }
        else if (!/^\d{10}$/.test(phoneNumber) && !/^0\d{2}[-\s]?\d{3}[-\s]?\d{4}$/.test(phoneNumber)) {
            newErrors.phonenumber = "เบอร์โทรไม่ถูกต้อง (รูปแบบ 0111111111 หรือ 011-111-1111)";
            hasError = true;
        }

        setErrors(newErrors);
        if (!hasError && active===".signup-form") {
            if (isSubmitting) return
            setIsSubmitting(true)

            const pattern = /^\d{10}$/
            let phone = phoneNumber
            if (pattern.test(phoneNumber)) {
                phone = `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`
            }
            const data: SignUpInterface = {
                Username: username,
                Firstname: firstname,
                Lastname: lastname,
                Email: email,
                Password: password,
                PhoneNumber: phone,
                GenderID: 3,
            }

            const resSignup = await CreateCustomer(data)
            if (resSignup) {
                messageApiLogin.success("สร้างข้อมูลผู้ใช้สำเร็จ")
                setActive(".signin-form")
                setTimeout(() => {
                    setIsSubmitting(false);
                }, 2000)
            } else {
                messageApiLogin.error("เกิดข้อผิดพลาดในการสร้างบัญชี")
                setIsSubmitting(false);
            }
        }
    }

    useEffect(() => {
        const activeElement = document.querySelector(active)
        const formElement = document.querySelectorAll(".login-form")
        if (activeElement && formElement) {
            formElement.forEach((item) => {
                item.classList.remove("active")
            })
            activeElement.classList.add("active")
        }
    }, [active])

    return (
        <div className="login-for-customer-page">
            {contextHolderLogin}
            <video className="bg-video" autoPlay muted loop>
                <source src="./images/backgrounds/beach.mp4" type="video/mp4" />
            </video>
            <div className="form-container">
                <div className="box">
                    <form className="signin-form login-form" onSubmit={handleSignIn}>
                        <span className="title">เข้าสู่ระบบ</span>
                        <div className="input-box"
                            style={{
                                border: focusedInput === "input1" ? "2px solid var(--yellow)" : "2px solid transparent"
                            }}
                        >
                            <span>ชื่อผู้ใช้</span>
                            <input
                                type="text"
                                ref={usernameRef1}
                                className="username-input"
                                value={username}
                                autoComplete="off"
                                onChange={(e) => {
                                    setUsername(e.target.value)
                                    setErrors((prevErrors) => ({
                                        ...prevErrors,
                                        username: "",
                                    }));
                                }}
                                onFocus={() => handleFocus("input1")}
                                onBlur={handleBlur}
                                onKeyDown={(e) => e.key === "Enter" && passwordRef1.current?.focus()}
                            />
                            {errors.username && <p className="err-text">{errors.username}</p>}
                        </div>
                        <div className="input-box"
                            style={{
                                border: focusedInput === "input2" ? "2px solid var(--yellow)" : "2px solid transparent"
                            }}
                        >
                            <span>รหัสผ่าน</span>
                            <input
                                type="password"
                                ref={passwordRef1}
                                className="password-input"
                                value={password}
                                autoComplete="off"
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                    setErrors((prevErrors) => ({
                                        ...prevErrors,
                                        password: "",
                                    }));
                                }}
                                onFocus={() => handleFocus("input2")}
                                onBlur={handleBlur}
                                onKeyDown={(e) => e.key === "Enter" && handleSignIn(e)}
                            />
                            {errors.password && <p className="err-text">{errors.password}</p>}
                        </div>
                        <button className="submit-btn btn" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "รอสักครู่..." : "ล็อคอิน"}
                        </button>
                        <div className="signup-btn btn" onClick={() => setActive(".signup-form")}>
                            สร้างบัญชี
                        </div>
                    </form>
                    <form className="signup-form login-form" onSubmit={handleSignUp}>
                        <span className="title">สร้างบัญชีผู้ใช้งาน</span>
                        <div className="input-container">
                            <div className="input-box username-input"
                                style={{
                                    border: focusedInput === "input1" ? "2px solid var(--yellow)" : "2px solid transparent"
                                }}
                            >
                                <span>ชื่อผู้ใช้</span>
                                <input
                                    type="text"
                                    ref={usernameRef2}
                                    value={username}
                                    autoComplete="off"
                                    onChange={(e) => {
                                        setUsername(e.target.value)
                                        setErrors((prevErrors) => ({
                                            ...prevErrors,
                                            username: "",
                                        }));
                                    }}
                                    onFocus={() => handleFocus("input1")}
                                    onBlur={handleBlur}
                                    onKeyDown={(e) => e.key === "Enter" && firstnameRef.current?.focus()}
                                />
                                {errors.username && <p className="err-text">{errors.username}</p>}
                            </div>
                            <div className="input-box firstname-input"
                                style={{
                                    border: focusedInput === "input2" ? "2px solid var(--yellow)" : "2px solid transparent"
                                }}
                            >
                                <span>ชื่อจริง</span>
                                <input
                                    type="text"
                                    ref={firstnameRef}
                                    value={firstname}
                                    autoComplete="off"
                                    onChange={(e) => {
                                        setFirstname(e.target.value)
                                        setErrors((prevErrors) => ({
                                            ...prevErrors,
                                            firstname: "",
                                        }));
                                    }}
                                    onFocus={() => handleFocus("input2")}
                                    onBlur={handleBlur}
                                    onKeyDown={(e) => e.key === "Enter" && lastnameRef.current?.focus()}
                                />
                                {errors.firstname && <p className="err-text">{errors.firstname}</p>}
                            </div>
                            <div className="input-box lastname-input"
                                style={{
                                    border: focusedInput === "input3" ? "2px solid var(--yellow)" : "2px solid transparent"
                                }}
                            >
                                <span>นามสกุล</span>
                                <input
                                    type="text"
                                    ref={lastnameRef}
                                    value={lastname}
                                    autoComplete="off"
                                    onChange={(e) => {
                                        setLastname(e.target.value)
                                        setErrors((prevErrors) => ({
                                            ...prevErrors,
                                            lastname: "",
                                        }));
                                    }}
                                    onFocus={() => handleFocus("input3")}
                                    onBlur={handleBlur}
                                    onKeyDown={(e) => e.key === "Enter" && emailRef.current?.focus()}
                                />
                                {errors.lastname && <p className="err-text">{errors.lastname}</p>}
                            </div>
                            <div className="input-box email-input"
                                style={{
                                    border: focusedInput === "input4" ? "2px solid var(--yellow)" : "2px solid transparent"
                                }}
                            >
                                <span>อีเมล</span>
                                <input
                                    type="email"
                                    ref={emailRef}
                                    value={email}
                                    autoComplete="off"
                                    onChange={(e) => {
                                        setEmail(e.target.value)
                                        setErrors((prevErrors) => ({
                                            ...prevErrors,
                                            email: "",
                                        }));
                                    }}
                                    onFocus={() => handleFocus("input4")}
                                    onBlur={handleBlur}
                                    onKeyDown={(e) => e.key === "Enter" && passwordRef2.current?.focus()}
                                />
                                {errors.email && <p className="err-text">{errors.email}</p>}
                            </div>
                            <div className="input-box password-input"
                                style={{
                                    border: focusedInput === "input5" ? "2px solid var(--yellow)" : "2px solid transparent"
                                }}
                            >
                                <span>รหัสผ่าน</span>
                                <input
                                    type="password"
                                    ref={passwordRef2}
                                    value={password}
                                    autoComplete="off"
                                    onChange={(e) => {
                                        setPassword(e.target.value)
                                        setErrors((prevErrors) => ({
                                            ...prevErrors,
                                            password: "",
                                        }));
                                    }}
                                    onFocus={() => handleFocus("input5")}
                                    onBlur={handleBlur}
                                    onKeyDown={(e) => e.key === "Enter" && phoneNumberRef.current?.focus()}
                                />
                                {errors.password && <p className="err-text">{errors.password}</p>}
                            </div>
                            <div className="input-box phone-number-input"
                                style={{
                                    border: focusedInput === "input6" ? "2px solid var(--yellow)" : "2px solid transparent"
                                }}
                            >
                                <span>เบอร์โทรศัพท์</span>
                                <input
                                    type="text"
                                    ref={phoneNumberRef}
                                    value={phoneNumber}
                                    autoComplete="off"
                                    onChange={(e) => {
                                        setPhoneNumber(e.target.value)
                                        setErrors((prevErrors) => ({
                                            ...prevErrors,
                                            phonenumber: "",
                                        }));
                                    }}
                                    onFocus={() => handleFocus("input6")}
                                    onBlur={handleBlur}
                                    onKeyDown={(e) => e.key === "Enter" && handleSignUp(e)}
                                />
                                {errors.phonenumber && <p className="err-text">{errors.phonenumber}</p>}
                            </div>
                        </div>
                        <button className="submit-btn btn" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "รอสักครู่..." : "สร้างบัญชี"}
                        </button>
                        <div className="signin-btn btn" onClick={() => setActive(".signin-form")}>
                            ลงชื่อเข้าใช้
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginForCustomer;
