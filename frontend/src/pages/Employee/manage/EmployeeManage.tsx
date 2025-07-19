import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, message, Modal, Row, Col, Card, Space, Pagination, Input, Select, Spin } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, CalendarOutlined } from '@ant-design/icons';
import { GetEmployees, DeleteEmployee, GetRoles } from '../../../services/http';
import Navbar from '../../../components/Navbar-Management/Navbar';

// Import Employee and Role interfaces
import { EmployeesInterface } from '../../../interfaces/IEmployees';
import { RolesInterface } from '../../../interfaces/IRoles';
import CustomMediaLoading from '../../../components/employeeLoading/CustomMediaLoading';

const { Title } = Typography;
const { Search } = Input;

const MainEmployeePage = () => {
  const [employees, setEmployees] = useState<EmployeesInterface[]>([]);
  const [roles, setRoles] = useState<RolesInterface[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleID, setRoleID] = useState<number | null>(null); // State to store selected role ID
  const [loading, setLoading] = useState(true); // Loading state to manage data fetch process
  const pageSize = 12;
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  // Fetch employees data
  const fetchData = async () => {
    try {
      const employeesData = await GetEmployees();
      setEmployees(employeesData);
    } catch (error) {
      message.error('Failed to fetch employees data');
    } finally {
      setLoading(false); // Set loading to false after data is fetched
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

  useEffect(() => {
    fetchData();
    fetchRoles();
  }, []);

  // Delete employee
  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this employee?',
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'No, Cancel',
      onOk: async () => {
        try {
          await DeleteEmployee(id);
          message.success('Employee deleted successfully');
          fetchData();
        } catch (error) {
          message.error('Failed to delete employee');
        }
      },
    });
  };

  // Handle page change for pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle name search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when search term changes
  };

  // Handle role change from dropdown
  const handleRoleChange = (value: number | null) => {
    setRoleID(value);
    setCurrentPage(1); // Reset to first page when role changes
  };

  // Filter employees based on name and role
  const filteredEmployees = employees.filter((employee) => {
    const fullName = `${employee.FirstName} ${employee.LastName}`.toLowerCase();
    const searchQuery = searchTerm.toLowerCase();
    const matchesSearchTerm = fullName.includes(searchQuery);

    const matchesRole = roleID ? employee.RoleID === roleID : true;

    return matchesSearchTerm && matchesRole;
  });

  // Employees to display on current page
  const displayedEmployees = filteredEmployees.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Function to get RoleName by RoleID
  const getRoleNameById = (roleId: number) => {
    const role = roles.find((r) => r.ID === roleId);
    return role ? role.RoleName : 'Unknown Role';
  };

  return loading ? (
    <CustomMediaLoading
      message="กำลังโหลดข้อมูล..."
      width={200}
      height={200}
    />
  ) : (
    <div className="Employee-page" style={{ backgroundColor: 'rgba(255, 255, 255, 0.84)', position: 'relative', minHeight: '100vh' }}>
      <Navbar page="employee-management" />
      <section style={{ backgroundColor: 'white', color: 'white', padding: '20px', borderRadius: '8px' }}>
        <div className="text-4xl font-semibold text-left mt-10 ml-3">
          <h6 className="text-black">จัดการพนักงาน</h6>
        </div>

        <div
          style={{
            backgroundColor: 'var(--lightyellow)', // White background for the box
            borderRadius: '8px', // Rounded corners for the box
            padding: '20px', // Add some padding inside the box
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow for 3D effect
            marginTop: '20px', // Space between the heading and the box
            marginLeft: '20px', // Add space from the left side
            marginRight: '20px', // Add space from the right side
          }}
        >
          {loading ? (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#FFF100', // Semi-transparent background
              }}
            >
              <Spin size="large" />
            </div>
          ) : (
            <>
              <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
                <Col xs={24} sm={5}>
                  <Search
                    placeholder="ค้นหาจากชื่อ-สกุล"
                    onSearch={handleSearch}
                    style={{ width: '100%' }}
                  />
                </Col>
                <Col xs={24} sm={2}>
                  <Select
                    placeholder="เลือกบทบาท"
                    value={roleID}
                    onChange={handleRoleChange}
                    style={{ width: '100%' }}
                  >
                    <Select.Option value={null}>All Roles</Select.Option>
                    {roles.map((role) => (
                      <Select.Option key={role.ID} value={role.ID}>
                        {role.RoleName}
                      </Select.Option>
                    ))}
                  </Select>
                </Col>

                {/* Align the Create button to the right */}
                <Col xs={24} sm={17} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate('/employee/create')}
                    onMouseEnter={() => setIsHovered(true)} // เมื่อ hover
                    onMouseLeave={() => setIsHovered(false)} // เมื่อออกจาก hover
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: isHovered ? '#0055FF' : '#FFEC00', // เปลี่ยนสีพื้นหลังเมื่อ hover
                      color: isHovered ? 'white' : 'black', // เปลี่ยนสีข้อความเมื่อ hover
                      fontWeight: '600',
                      padding: '10px 16px',
                      borderRadius: '8px',
                      boxShadow: isHovered ? '0 6px 12px rgba(0, 0, 0, 0.2)' : '0 4px 6px rgba(0, 0, 0, 0.1)', // เปลี่ยนเงาเมื่อ hover
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                    }}
                  >
                    Create Employee
                  </Button>
                </Col>
              </Row>

              <Row
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                  gap: '16px',
                }}
              >
                {displayedEmployees.map((employee) => (
                  <div
                    key={employee.ID}
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'stretch',
                    }}
                  >
                    <Card
                      style={{
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: '100%',
                        minHeight: '250px',
                        padding: '20px',
                      }}
                    >
                      {/* Profile Image */}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',  // Center the image horizontally
                          alignItems: 'center',      // Center the image vertically
                          marginBottom: '10px',      // Space between image and text
                        }}
                      >
                        <img
                          alt="profile"
                          src={employee.ProfilePath || 'https://via.placeholder.com/150'}
                          style={{
                            width: '120px',
                            height: '120px',
                            objectFit: 'cover',
                            borderRadius: '50%',
                          }}
                        />
                      </div>

                      {/* Employee Name and Info */}
                      <Title level={5}>{employee.FirstName} {employee.LastName}</Title>
                      <p>Email: {employee.Email}</p>
                      <p>Phone Number: {employee.PhoneNumber}</p>
                      <p>Role: {getRoleNameById(employee.RoleID)}</p>

                      <Space>
                        <Button
                          type="primary"
                          icon={<EditOutlined />}
                          style={{ backgroundColor: 'black', borderColor: 'black', color: 'white' }}
                          onClick={() => navigate(`/employee/edit/${employee.ID}`, { state: employee })}
                        >
                          Edit
                        </Button>

                        <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(employee.ID)}>
                          Delete
                        </Button>
                        <Button
                          icon={<CalendarOutlined />}
                          onClick={() => navigate(`/employee/schedule/${employee.ID}`, { state: employee })}
                        >
                          View Schedule
                        </Button>
                      </Space>
                    </Card>
                  </div>
                ))}
              </Row>

              <Pagination
                current={currentPage}
                total={filteredEmployees.length}
                pageSize={pageSize}
                onChange={handlePageChange}
                style={{ marginTop: '20px', textAlign: 'center' }}
              />
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default MainEmployeePage;
