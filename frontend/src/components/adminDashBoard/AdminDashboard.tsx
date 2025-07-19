import React, { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import {
    User,
    Package,
    Percent,
    Calendar,
    Truck,
    Home,
    Users,
    Clock,
    Mail,
    Phone,
    Settings,
    LogOut,
    Menu,
    X,
    Sun,
    Moon,
    BriefcaseBusiness,
} from 'lucide-react';
import { EmployeesInterface } from '../../interfaces/IEmployees';
import { GetEmployeeByID, GetGenderByID } from '../../services/http';
import { message } from 'antd';
import LogoutModal from '../ModalCustom/LogoutModal';
import { GendersInterface } from '../../interfaces/IGenders';
import CustomMediaLoading from '../employeeLoading/CustomMediaLoading';
import CustomErrorLoading from '../employeeLoading/ErrorLoadind';
import Dashboard from '../../pages/dashboard/Dashboard';

interface CardProps {
    children: ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => (
    <div className={`dark:bg-zinc-900 bg-white shadow-lg rounded-xl transition-all duration-200 hover:shadow-xl ${className}`}>
        {children}
    </div>
);

const CardContent: React.FC<CardProps> = ({ children, className = '' }) => (
    <div className={`p-6 ${className}`}>
        {children}
    </div>
);

const CardHeader: React.FC<CardProps> = ({ children, className = '' }) => (
    <div className={`p-6 border-b dark:border-zinc-700 border-gray-100 ${className}`}>
        {children}
    </div>
);

interface MenuItem {
    id: string;
    title: string;
    icon: React.ReactNode;
    path: string;
}

const AdminDashboard = () => {
    const [employee, setEmployee] = useState<EmployeesInterface | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const [gender, setGender] = useState<GendersInterface | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'dark';
    });

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    const menuItems: MenuItem[] = [
        { id: "tourpackage-management", title: "จัดการแพ็กเกจทัวร์", icon: <Package className="w-5 h-5" />, path: "/tour-package-manage" },
        { id: "promotions-management", title: "จัดการโปรโมชันส่วนลด", icon: <Percent className="w-5 h-5" />, path: "/promotions-manage" },
        { id: "booking-management", title: "จัดการการจอง", icon: <Calendar className="w-5 h-5" />, path: "/ManageBooking" },
        { id: "trnsport-management", title: "จัดการการเดินทางและขนส่ง", icon: <Truck className="w-5 h-5" />, path: "/TravelTransportManagement" },
        { id: "accomodation-management", title: "จัดการที่พักและอาหาร", icon: <Home className="w-5 h-5" />, path: "/AccommodationManagement" },
        { id: "employee-management", title: "จัดการพนักงาน", icon: <Users className="w-5 h-5" />, path: "/employeemanage" },
        { id: "employeeschedule-management", title: "จัดการตารางงาน", icon: <Clock className="w-5 h-5" />, path: "/employeeschedule" },
        { id: "insurance", title: "จัดการประกัน", icon: <BriefcaseBusiness className="w-5 h-5"/>, path:"/insurance"}
    ];

    const handleLogout = () => {
        setIsLogoutModalOpen(true);
    };

    const handleLogoutConfirm = () => {
        localStorage.clear();
        message.success("ออกจากระบบสำเร็จ");
        setTimeout(() => {
            location.href = "/login-employee";
        }, 2000);
    };

    const fetchEmployeeData = async () => {
        setLoading(true);
        setError(null);
        try {
            const storedEmployee = localStorage.getItem('employee');
            const employeeID = storedEmployee ? JSON.parse(storedEmployee) : null;

            if (employeeID) {
                const employeeData = await GetEmployeeByID(employeeID.ID);
                setEmployee(employeeData);
                const genderData = await GetGenderByID(employeeID.GenderID);
                setGender(genderData);
            }
        } catch (error) {
            setError('ไม่สามารถดึงข้อมูลพนักงานได้');
        } finally {
            setTimeout(() => {
                setLoading(false);
            },2000);
        }
    };

    useEffect(() => {
        fetchEmployeeData();
    }, []);

    if (loading) {
        return (
            <CustomMediaLoading
                message="กำลังโหลดข้อมูล..."
                width={200}
                height={200}
            />
        );
    }

    if (error) {
        return (
            <CustomErrorLoading
                message={error}
                width={200}
                height={200}
                onRetry={fetchEmployeeData}  
            />
        );
    }

    return (
        <div className="min-h-screen bg-customBackground dark:bg-customBackground flex">
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-20"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-30
                w-72 bg-white dark:bg-zinc-800 shadow-xl
                transform transition-all duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="h-full flex flex-col">
                    <button
                        onClick={toggleTheme}
                        className="absolute top-4 right-4 p-2 rounded-lg bg-gray-100 dark:bg-zinc-700 
                                 text-gray-600 dark:text-customYellow hover:bg-gray-200 
                                 dark:hover:bg-zinc-600 transition-colors"
                        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                        {isDarkMode ? (
                            <Sun className="w-5 h-5" />
                        ) : (
                            <Moon className="w-5 h-5" />
                        )}
                    </button>

                    {/* Profile-section*/}
                    <div className="p-6 border-b border-gray-100 dark:border-zinc-700">
                        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                            ข้อมูลพนักงาน
                        </h3>
                        <div className="flex flex-col items-center">
                            <div className="w-24 h-24 rounded-full ring-4 ring-customYellow overflow-hidden mb-4">
                                <img
                                    src={employee?.ProfilePath}
                                    alt="Admin Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                                {`${employee?.FirstName} ${employee?.LastName}`}
                            </h2>
                            <span className="px-3 py-1 text-sm bg-customYellow text-black rounded-full font-medium mt-2">
                                {employee?.Role.RoleName}
                            </span>
                        </div>

                        <div className="mt-6 space-y-4">
                            {/* Info  */}
                            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
                                <User className="w-4 h-4 dark:text-customYellow" />
                                <p className="text-sm">{employee?.UserName}</p>
                            </div>
                            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
                                <Mail className="w-4 h-4 dark:text-customYellow" />
                                <p className="text-sm">{employee?.Email}</p>
                            </div>
                            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
                                <Phone className="w-4 h-4 dark:text-customYellow" />
                                <p className="text-sm">{employee?.PhoneNumber}</p>
                            </div>
                            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
                                <img
                                    src={isDarkMode ? "images/icons/gender.png" : "images/icons/greygender.png"}
                                    alt="Gender Icon"
                                    className="w-4 h-4 object-contain"
                                />
                                <p className="text-sm">{gender?.GenderName || 'ไม่ระบุเพศ'}</p>
                            </div>

                        </div>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                            การจัดการ
                        </h3>
                        {menuItems.map((item) => (
                            <a
                                key={item.id}
                                href={item.path}
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 
                                         dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300 
                                         transition-colors group"
                            >
                                <div className="dark:text-customYellow">{item.icon}</div>
                                <span className="text-sm font-medium group-hover:text-black 
                                               dark:group-hover:text-white transition-colors">
                                    {item.title}
                                </span>
                            </a>
                        ))}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-100 dark:border-zinc-700">
                        <a
                            href="/employee-profile"
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 
                                     dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300 
                                     transition-colors group mb-2"
                        >
                            <Settings className="w-5 h-5 dark:text-customYellow" />
                            <span className="text-sm font-medium group-hover:text-black 
                                           dark:group-hover:text-white transition-colors">
                                การตั้งค่า
                            </span>
                        </a>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 p-3 rounded-lg 
                                     hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 
                                     transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="text-sm font-medium">ออกจากระบบ</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 lg:p-8">
                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="fixed top-4 left-4 p-2 rounded-lg bg-white dark:bg-zinc-800 
                             shadow-lg lg:hidden z-30 text-gray-600 dark:text-white 
                             hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                >
                    {isSidebarOpen ? (
                        <X className="w-6 h-6" />
                    ) : (
                        <Menu className="w-6 h-6" />
                    )}
                </button>

                {/* Content */}
                <div className="max-w-7xl mx-auto mt-16 lg:mt-0">
                    <Card>
                        <CardHeader>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                การวิเคราะห์ข้อมูลและการสร้างรายงาน
                            </h2>
                        </CardHeader>
                        <CardContent >
                            <div className="grid gap-4">
                                <Dashboard />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>

            <LogoutModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={handleLogoutConfirm}
            />
        </div>
    );
};

export default AdminDashboard;