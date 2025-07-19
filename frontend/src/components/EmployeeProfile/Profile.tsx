import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { message } from "antd";
import { GetEmployeeByID } from '../../services/http';
import { User, Settings, LogOut, LayoutDashboard, BusFront, Hotel } from 'lucide-react';
import LogoutModal from "../ModalCustom/LogoutModal";
import { EmployeesInterface } from "../../interfaces/IEmployees";


const UserDropdown: React.FC = () => {
  const [isDropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);
  const [employee, setEmployee] = useState<EmployeesInterface | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      setLoading(true);
      try {
        const storedEmployee = localStorage.getItem('employee');
        const employeeID = storedEmployee ? JSON.parse(storedEmployee) : null;

        if (employeeID) {
          const employeeData = await GetEmployeeByID(employeeID.ID);
          setEmployee(employeeData);
        }
      } catch (error) {
        console.error('Failed to fetch employee data:', error);
        message.error('ไม่สามารถดึงข้อมูลพนักงานได้');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, []);

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  const closeDropdown = () => {
    setDropdownVisible(false);
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
    setDropdownVisible(false);
  };
  
  const handleLogoutConfirm = () => {
    localStorage.clear();
    message.success("ออกจากระบบสำเร็จ");  
    setTimeout(() => {
      location.href = "/login-employee";
    }, 2000);
  };
  


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById("userDropdown");
      const avatarButton = document.getElementById("avatarButton");

      if (
        dropdown &&
        avatarButton &&
        !dropdown.contains(event.target as Node) &&
        !avatarButton.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-12 h-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-400"></div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex items-center justify-center w-12 h-12">
        <User className="w-6 h-6 text-gray-400" />
      </div>
    );
  }

  return (
    <div className="employee-profile-page">
      <div className="relative">
        <button
          id="avatarButton"
          className="relative p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2"
          onClick={toggleDropdown}
        >
          <div className="relative">
            <img
              className="w-12 h-12 object-cover rounded-full ring-2 ring-pink-400/30"
              src={employee.ProfilePath || '/api/placeholder/150/150'}
              alt={`${employee.FirstName} ${employee.LastName}`}
            />
            {/* ปรับตำแหน่งและสไตล์ของสถานะออนไลน์ */}
            <div className="absolute bottom-0 right-0 translate-x-1 translate-y-1">
              <div className="w-3.5 h-3.5 bg-green-500 rounded-full ring-2 ring-white dark:ring-gray-800"></div>
            </div>
          </div>
        </button>

        {isDropdownVisible && (
          <div
            id="userDropdown"
            className="absolute right-0 z-50 mt-3 w-72 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black/5 focus:outline-none dark:bg-gray-800 dark:ring-gray-700 md:w-80"
          >
            <div className="p-4 border-b dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-pink-400/30"
                    src={employee.ProfilePath || '/api/placeholder/150/150'}
                    alt={`${employee.FirstName} ${employee.LastName}`}
                  />
                  {/* สถานะออนไลน์ในส่วน dropdown */}
                  <div className="absolute bottom-0 right-0 translate-x-1 translate-y-1">
                    <div className="w-4 h-4 bg-green-500 rounded-full ring-2 ring-white dark:ring-gray-800"></div>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-semibold text-gray-900 truncate dark:text-white">
                    {employee.FirstName} {employee.LastName}
                  </p>
                  <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                    {employee.Email}
                  </p>
                  <p className="text-xs text-pink-500 font-medium">
                    {employee.Role.RoleName || 'Employee'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-2">
              <Link
                to="/dashboard"
                className="flex items-center px-4 py-3 text-sm text-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 dark:text-gray-200 transition-colors duration-200"
              >
                <LayoutDashboard className="w-5 h-5 mr-3 text-gray-500" />
                แดชบอร์ด
              </Link>
              <Link
                to="/TransportManagement"
                className="flex items-center px-4 py-3 text-sm text-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 dark:text-gray-200 transition-colors duration-200"
              >
                <BusFront  className="w-5 h-5 mr-3 text-gray-500" />
                จัดการยานพาหนะ
              </Link>
              <Link
                to="/HotelManagement"
                className="flex items-center px-4 py-3 text-sm text-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 dark:text-gray-200 transition-colors duration-200"
              >
                <Hotel className="w-5 h-5 mr-3 text-gray-500" />
                จัดการห้องพัก
              </Link>
              <Link
                to="/employee-profile"
                className="flex items-center px-4 py-3 text-sm text-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 dark:text-gray-200 transition-colors duration-200"
              >
                <Settings className="w-5 h-5 mr-3 text-gray-500" />
                ตั้งค่า
              </Link>
            </div>

            <div className="p-2 border-t dark:border-gray-700">
              <button
                onClick={handleLogout}
                className="flex w-full items-center px-4 py-3 text-sm text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
              >
                <LogOut className="w-5 h-5 mr-3" />
                ออกจากระบบ
              </button>
            </div>
          </div>
        )}
      </div>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </div>


  );
};

export default UserDropdown;