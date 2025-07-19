import{ useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import UserDropdown from '../EmployeeProfile/Profile';

const Navbar = ({ page }: { page: string }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const menu = document.querySelector(`#${page}`);
    if (menu) {
      menu.classList.add('text-[#007AFF]', 'font-bold', 'after:w-full', 'after:bg-black');
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [page]);

  const navLinks = [
    { to: '/tour-package-manage', id: 'tourpackage-management', text: 'จัดการแพ็กเกจทัวร์' },
    { to: '/promotions-manage', id: 'promotions-management', text: 'จัดการโปรโมชันส่วนลด' },
    { to: '/ManageBooking', id: 'booking-management', text: 'จัดการการจอง' },
    { to: '/TravelTransportManagement', id: 'trnsport-management', text: 'จัดการการเดินทางและขนส่ง' },
    { to: '/AccommodationManagement', id: 'accomodation-management', text: 'จัดการที่พักและอาหาร' },
    { to: '/employeemanage', id: 'employee-management', text: 'จัดการพนักงาน' },
    { to: '/employeeschedule', id: 'employeeschedule-management', text: 'จัดการตารางงาน' },
    { to: '/insurance', id: 'insurance-management', text: 'จัดการประกัน'}
  ];

  return (
    <div className="sticky top-0 z-50">
      <nav 
        className={`
          bg-[#FFF100] flex justify-between items-center px-4 py-1
          sticky top-0 z-50 transition-all duration-500 ease-in-out h-[70px]
          ${isScrolled ? 'shadow-md' : ''}
        `}
      >
        {/* Logo */}
        <div style={{height: "100%", paddingLeft:"16px"}}>
          <img style={{
            width:"100%", height:"100%", objectFit:"cover"
          }} src="/images/logo/logo3.png" alt="" />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden xl2:flex items-center space-x-2">
          {navLinks.map((link) => (
            <Link
              key={link.id}
              to={link.to}
              id={link.id}
              className={`
                relative px-3 py-2 text-xl whitespace-nowrap text-black
                transition-colors duration-500
                after:content-[''] after:absolute after:left-0 after:bottom-0 
                after:w-0 after:h-[3px] after:bg-black
                after:transition-all after:duration-700 after:ease-in-out
                hover:after:w-full
                group-hover:after:w-full
              `}
            >
              {link.text}
            </Link>
          ))}
          <UserDropdown />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="xl2:hidden p-2 hover:bg-black hover:text-white rounded-md transition-colors duration-300"
        >
          <svg 
            className="w-6 h-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      <div 
        className={`
          xl2:hidden absolute w-full bg-[#FFF100] shadow-md
          transition-all duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
        `}
      >
        {navLinks.map((link) => (
          <Link
            key={`mobile-${link.id}`}
            to={link.to}
            id={`mobile-${link.id}`}
            className={`
              block px-4 py-2 text-base text-black
              hover:bg-black hover:text-white
              transition-colors duration-300 whitespace-nowrap
            `}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {link.text}
          </Link>
        ))}
        <div className="px-4 py-2 border-t border-[#00203FFF]/10">
          <UserDropdown />
        </div>
      </div>
    </div>
  );
};

export default Navbar;