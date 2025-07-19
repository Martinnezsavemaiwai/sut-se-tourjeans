import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Typography, message, Row, Col, Card, Pagination, Input, Spin } from 'antd';

import { CreateEmployeeSchedule, GetEmployees, GetRoles, GetEmployeeSchedulesByTourScheduleID, GetEmployeeByTourSchedule } from '../../../../../services/http';
import Navbar from '../../../../../components/Navbar-Management/Navbar';

import { EmployeesInterface } from '../../../../../interfaces/IEmployees';
import { RolesInterface } from '../../../../../interfaces/IRoles';
import { EmployeeSchedulesInterface } from '../../../../../interfaces/IEmployeeSchedules';

const { Title } = Typography;
const { Search } = Input;

const CreateEmployeeSchedules = () => {
    const [employees, setEmployees] = useState<EmployeesInterface[]>([]);
    const [roles, setRoles] = useState<RolesInterface[]>([]);
    const [currentPageDriver, setCurrentPageDriver] = useState(1); // For Driver Pagination
    const [currentPageGuide, setCurrentPageGuide] = useState(1); // For Guide Pagination
    const [searchTerm, setSearchTerm] = useState('');
    const [roleID] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [scheduledEmployeeIDs, setScheduledEmployeeIDs] = useState<number[]>([]);
    const [overlappingEmployees, setOverlappingEmployees] = useState<EmployeeSchedulesInterface[]>([]); // State for overlapping employees

    const pageSize = 8; // Show 8 per page for each Driver and Guide
    const location = useLocation();
    const navigate = useNavigate();
    const { state } = location;
    const tourScheduleId = state?.tourScheduleId;  // Ensure you're accessing the correct property

    // Fetch employee data
    const fetchData = async () => {
        try {
            const employeesData = await GetEmployees();
            setEmployees(employeesData);
        } catch (error) {
            message.error('Failed to fetch employees data');
        }
    };

    // Fetch roles data
    const fetchRoles = async () => {
        try {
            const rolesData = await GetRoles();
            setRoles(rolesData);
        } catch (error) {
            message.error('Failed to fetch roles');
        }
    };

    // Fetch scheduled employees for the specific tourScheduleId
    const fetchScheduledEmployees = async () => {
        if (!tourScheduleId) return;
        try {
            const schedules = await GetEmployeeSchedulesByTourScheduleID(tourScheduleId);
            const scheduledIDs = schedules.map((schedule: { EmployeeID: number }) => schedule.EmployeeID);
            setScheduledEmployeeIDs(scheduledIDs);

            // Fetch overlapping employees
            const response = await GetEmployeeByTourSchedule(tourScheduleId); 
            setOverlappingEmployees(response.overlapping_employees); // Set the overlapping employees
        } catch (error) {
            message.error('Failed to fetch schedules');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        fetchRoles();
        fetchScheduledEmployees();
    }, [tourScheduleId]);

    const handlePageChangeDriver = (page: number) => {
        setCurrentPageDriver(page);
    };

    const handlePageChangeGuide = (page: number) => {
        setCurrentPageGuide(page);
    };

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        setCurrentPageDriver(1);
        setCurrentPageGuide(1);
    };

    const handleCreateSchedule = async (employee: EmployeesInterface) => {
        if (!tourScheduleId) {
            message.error('Please select a tour schedule!');
            return;
        }

        // เรียกใช้งาน GetEmployeeByTourSchedule เพื่อเช็คว่ามีการทับซ้อนหรือไม่
        try {
            const response = await GetEmployeeByTourSchedule(tourScheduleId); 
            const overlappingEmployees: EmployeeSchedulesInterface[] = response.overlapping_employees;

            if (overlappingEmployees.some((emp: EmployeeSchedulesInterface) => emp.EmployeeID === employee.ID)) {
                message.error('Employee is already scheduled for this period!');
                return;
            }

        } catch (error) {
            message.error('Failed to check employee schedule');
            return;
        }

        const scheduleData = {
            EmployeeID: employee.ID,
            TourScheduleID: tourScheduleId,
        };

        try {
            setLoading(true);
            const response = await CreateEmployeeSchedule(scheduleData);
            if (response) {
                message.success('Schedule created successfully');
                fetchScheduledEmployees();
            } else {
                message.error('Failed to create schedule');
            }
        } catch (error) {
            message.error('Failed to create schedule');
        } finally {
            navigate(-1);
            setLoading(false);
        }
    };

    const filteredEmployees = employees.filter((employee) => {
        const fullName = `${employee.FirstName} ${employee.LastName}`.toLowerCase();
        const searchQuery = searchTerm.toLowerCase();
        const matchesSearchTerm = fullName.includes(searchQuery);

        const isRoleFilterMatch = roleID ? employee.RoleID === roleID : true;

        const isRoleGuideOrDriver = employee.RoleID === 2 || employee.RoleID === 3; // Assuming 2 = Driver, 3 = Guide
        const notScheduled = !scheduledEmployeeIDs.includes(employee.ID); // Checking if the employee is scheduled

        // Check if employee has time conflict with already scheduled employees
        const hasTimeConflict = overlappingEmployees.some((emp: EmployeeSchedulesInterface) => emp.EmployeeID === employee.ID);

        // Only show employees who match search, role, are not scheduled, and have no time conflict
        return matchesSearchTerm && isRoleFilterMatch && isRoleGuideOrDriver && notScheduled && !hasTimeConflict;
    });

    // Split employees into Drivers and Guides
    const drivers = filteredEmployees.filter(employee => employee.RoleID === 2);
    const guides = filteredEmployees.filter(employee => employee.RoleID === 3);

    const displayedDrivers = drivers.slice((currentPageDriver - 1) * pageSize, currentPageDriver * pageSize);
    const displayedGuides = guides.slice((currentPageGuide - 1) * pageSize, currentPageGuide * pageSize);

    const getRoleNameById = (roleId: number) => {
        const role = roles.find((r) => r.ID === roleId);
        return role ? role.RoleName : 'Unknown Role';
    };

    return (
        <div className="employeeschedule-management" style={{ backgroundColor: 'rgba(255, 255, 255, 0.84)', position: 'relative', minHeight: '100vh' }}>
            <Navbar page="employeeschedule-management" />
            <section style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
                <div style={{ backgroundColor: 'var(--lightyellow)', borderRadius: '8px', padding: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', marginTop: '20px', marginLeft: '20px', marginRight: '20px' }}>
                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            <Spin size="large" />
                        </div>
                    ) : (
                        <>
                            <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
                                <Col xs={24} sm={5}>
                                    <Search
                                        placeholder="ค้นหาชื่อ สกุล"
                                        onSearch={handleSearch}
                                        style={{
                                            width: '100vh',
                                            backgroundColor: '#FFFFE0',
                                            borderRadius: '10px',
                                            padding: '5px',
                                        }}
                                        suffix={
                                            <i
                                                className="anticon anticon-search"
                                                style={{
                                                    color: '#808080',
                                                }}
                                            />
                                        }
                                    />
                                </Col>
                            </Row>

                            {/* Display Driver Schedules */}
                            <div>
                                <Title level={3}>Driver Schedules</Title>
                                <Row gutter={[16, 16]}>
                                    {displayedDrivers.map((employee) => (
                                        <Col key={employee.ID} xs={24} sm={12} md={8} lg={6}>
                                            <Card style={{ textAlign: 'center', padding: '20px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                                                    <img
                                                        alt="profile"
                                                        src={employee.ProfilePath || 'https://via.placeholder.com/150'}
                                                        style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '50%' }}
                                                    />
                                                </div>
                                                <Title level={5}>{employee.FirstName} {employee.LastName}</Title>
                                                <p>Email: {employee.Email}</p>
                                                <p>Phone: {employee.PhoneNumber}</p>
                                                <p>Role: {getRoleNameById(employee.RoleID)}</p>
                                                <Button
                                                    type="primary"
                                                    onClick={() => handleCreateSchedule(employee)}
                                                    loading={loading}
                                                    block
                                                    disabled={scheduledEmployeeIDs.includes(employee.ID) || !tourScheduleId}
                                                    style={{
                                                        fontSize: '16px',
                                                        borderRadius: '15px',
                                                        backgroundColor: 'black',
                                                        color: 'white',
                                                    }}
                                                >
                                                    Create Schedule
                                                </Button>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                                <Pagination
                                    current={currentPageDriver}
                                    total={drivers.length}
                                    pageSize={pageSize}
                                    onChange={handlePageChangeDriver}
                                    style={{ marginTop: '20px', textAlign: 'center' }}
                                />
                            </div>

                            {/* Display Guide Schedules */}
                            <div style={{ marginTop: '20px' }}>
                                <Title level={3}>Guide Schedules</Title>
                                <Row gutter={[16, 16]}>
                                    {displayedGuides.map((employee) => (
                                        <Col key={employee.ID} xs={24} sm={12} md={8} lg={6}>
                                            <Card style={{ textAlign: 'center', padding: '20px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                                                    <img
                                                        alt="profile"
                                                        src={employee.ProfilePath || 'https://via.placeholder.com/150'}
                                                        style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '50%' }}
                                                    />
                                                </div>
                                                <Title level={5}>{employee.FirstName} {employee.LastName}</Title>
                                                <p>Email: {employee.Email}</p>
                                                <p>Phone: {employee.PhoneNumber}</p>
                                                <p>Role: {getRoleNameById(employee.RoleID)}</p>
                                                <Button
                                                    type="primary"
                                                    onClick={() => handleCreateSchedule(employee)}
                                                    loading={loading}
                                                    block
                                                    disabled={scheduledEmployeeIDs.includes(employee.ID) || !tourScheduleId}
                                                    style={{
                                                        fontSize: '16px',
                                                        borderRadius: '15px',
                                                        backgroundColor: 'black',
                                                        color: 'white',
                                                    }}
                                                >
                                                    Create Schedule
                                                </Button>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                                    <Pagination
                                        current={currentPageGuide}
                                        total={guides.length}
                                        pageSize={pageSize}
                                        onChange={handlePageChangeGuide}
                                    />
                                <Button
                                    onClick={() => navigate(-1)}
                                    style={{
                                        backgroundColor: 'white',
                                        color: 'black',
                                        fontSize: '16px',
                                        borderRadius: '15px',
                                        }}
                                >
                                    Cancel
                                </Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
};

export default CreateEmployeeSchedules;
