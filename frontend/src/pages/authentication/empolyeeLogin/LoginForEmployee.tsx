import { useState } from "react";
import "./LoginForEmployee.css";
import { message } from "antd";
import { SignInInterface } from "../../../interfaces/ISignIn";
import { GetEmployeeByID, SignInForEmployee } from "../../../services/http";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

function LoginForEmployee() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [messageApiLogin, contextHolderLogin] = message.useMessage()
    const [focusedInput, setFocusedInput] = useState<string | null>(null)

    const handleFocus = (inputName: string) => {
        setFocusedInput(inputName)
    };

    const handleBlur = () => {
        setFocusedInput(null)
    }


    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    async function handleSubmit(e: { preventDefault: () => void }) {
        e.preventDefault();
        if (isSubmitting) return;

        let hasError = false;
        const newErrors: { username?: string; password?: string } = {};
        if (!username.trim()) {
            newErrors.username = "กรุณากรอกชื่อผู้ใช้";
            hasError = true;
        }
        if (!password.trim()) {
            newErrors.password = "กรุณากรอกรหัสผ่าน";
            hasError = true;
        }
        setErrors(newErrors);
        if (!hasError) {
            setIsSubmitting(true);
            const data: SignInInterface = {
                Username: username,
                Password: password,
            };
            try {
                const resSignin = await SignInForEmployee(data);
                if (resSignin) {
                    messageApiLogin.success("ลงชื่อเข้าใช้สำเร็จ");
                    localStorage.setItem("isLogin", "true");
                    localStorage.setItem("isEmployeeLogin", "true");
                    localStorage.setItem("token_type", resSignin.token_type);
                    localStorage.setItem("token", resSignin.token);
                    localStorage.setItem("id", resSignin.id);
                    localStorage.setItem("role", resSignin.RoleID);

                    const resGetEmployee = await GetEmployeeByID(resSignin.id);
                    localStorage.setItem("employee", JSON.stringify(resGetEmployee));

                    setTimeout(() => {
                        location.href = "/";
                    }, 2000);
                } else {
                    messageApiLogin.error("Email or Password is Incorrect");
                }
            } catch (error) {
                messageApiLogin.error("An error occurred during login");
            } finally {
                setIsSubmitting(false);
            }
        }
    }

    return (
        <div className="login-for-employee-page">
            {contextHolderLogin}
            <video className="bg-video" autoPlay muted loop>
                <source src="./images/backgrounds/Bangkok.mp4" type="video/mp4" />
            </video>
            <div className="form-container">
                <div className="box">
                    <form className="login-form" onSubmit={handleSubmit}>
                        <span className="title">เข้าสู่ระบบ</span>
                        <div className="input-box"
                            style={{
                                border: focusedInput === "input1" ? "2px solid var(--yellow)" : "2px solid transparent"
                            }}
                        >
                            <span>ชื่อผู้ใช้</span>
                            <input
                                type="text"
                                className="username-input"
                                value={username}
                                autoComplete="off"
                                onChange={(e) => setUsername(e.target.value)}
                                onFocus={() => handleFocus("input1")}
                                onBlur={handleBlur}
                            />
                            {errors.username && <p className="err-text">{errors.username}</p>}
                        </div>
                        <div
                            className="input-box"
                            style={{
                                border: focusedInput === "input2" ? "2px solid var(--yellow)" : "2px solid transparent",
                                position: "relative", // เพิ่มเพื่อให้ตำแหน่งไอคอนซ้อนกับ input
                            }}
                        >
                            <span>รหัสผ่าน</span>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="password-input"
                                value={password}
                                autoComplete="off"
                                onChange={(e) => setPassword(e.target.value)}
                                onFocus={() => handleFocus("input2")}
                                onBlur={handleBlur}
                            />
                            <button
                                type="button"
                                className="toggle-password-btn"
                                onClick={togglePasswordVisibility}
                                style={{
                                    position: "absolute",
                                    top: "50%",
                                    right: "10px",
                                    transform: "translateY(-50%)",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                }}
                            >
                                {showPassword ? (
                                    <EyeInvisibleOutlined style={{ fontSize: "18px", color: "#666" }} />
                                ) : (
                                    <EyeOutlined style={{ fontSize: "18px", color: "#666" }} />
                                )}
                            </button>
                            {errors.password && <p className="err-text">{errors.password}</p>}
                        </div>
                        <button className="submit-btn btn" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "รอสักครู่..." : "ล็อคอิน"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginForEmployee;