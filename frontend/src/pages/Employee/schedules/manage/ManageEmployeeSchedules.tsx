import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Typography, Row, Col, Card, message, Pagination, Button, Modal } from 'antd';
import { GetEmployees, GetRoles, DeleteEmployeeSchedule, GetEmployeeSchedulesByTourScheduleID } from '../../../../services/http';
import Navbar from '../../../../components/Navbar-Management/Navbar';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import CustomMediaLoading from '../../../../components/employeeLoading/CustomMediaLoading';

const { Title } = Typography;

const ManageEmployeeSchedulesPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [employeeSchedules, setEmployeeSchedules] = useState<any[]>([]);
  const [, setEmployees] = useState<any[]>([]);
  const [, setRoles] = useState<any[]>([]);
  const [] = useState(1);
  const [loading, setLoading] = useState(false);
  const [employeeLoading, setEmployeeLoading] = useState(false);
  const pageSize = 8;

  const [currentPageDriver, setCurrentPageDriver] = useState(1);
  const [currentPageGuide, setCurrentPageGuide] = useState(1);

  const { tourScheduleId, tourName } = location.state || {};

  useEffect(() => {
    if (tourScheduleId) {
      fetchEmployeeSchedules(tourScheduleId);
      fetchEmployees();
      fetchRoles();
    } else {
      message.error('Invalid Tour Schedule ID or Tour Name');
    }
  }, [tourScheduleId, tourName]);

  const fetchEmployeeSchedules = async (tourScheduleId: any) => {
    try {
      setLoading(true);
      const response = await GetEmployeeSchedulesByTourScheduleID(tourScheduleId);

      if (response) {
        setEmployeeSchedules(response);
      } else {
        throw new Error('Failed to fetch employee schedules');
      }
    } catch (error) {
      console.error('Error fetching employee schedules:', error);
      message.error('Failed to fetch employee schedules');
    } finally {
      setLoading(false);
    }
  };


  const fetchEmployees = async () => {
    setEmployeeLoading(true);
    try {
      const employeeData = await GetEmployees();
      if (employeeData && employeeData.length > 0) {
        setEmployees(employeeData);
      } else {
        message.warning('No employees found');
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      message.error('Failed to fetch employees');
    } finally {
      setEmployeeLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const rolesData = await GetRoles();
      setRoles(rolesData);
    } catch (error) {
      console.error('Error fetching roles:', error);
      message.error('Failed to fetch roles');
    }
  };


  const confirmDelete = (scheduleId: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this schedule?',
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'No, Cancel',
      onOk: () => handleDeleteEmployeeSchedule(scheduleId),
    });
  };

  const handleDeleteEmployeeSchedule = async (scheduleId: number) => {
    try {
      const response = await DeleteEmployeeSchedule(scheduleId);
      if (response) {
        message.success('Employee schedule deleted successfully');
        fetchEmployeeSchedules(tourScheduleId);
      } else {
        message.error('Failed to delete employee schedule');
      }
    } catch (error) {
      message.error('Failed to delete employee schedule');
    }
  };

  const driverSchedules = employeeSchedules.filter(
    (schedule) => schedule.Employee.Role.RoleName === 'Driver'
  );
  const guideSchedules = employeeSchedules.filter(
    (schedule) => schedule.Employee.Role.RoleName === 'Guide'
  );

  const displayedDrivers = driverSchedules.slice(
    (currentPageDriver - 1) * pageSize,
    currentPageDriver * pageSize
  );
  const displayedGuides = guideSchedules.slice(
    (currentPageGuide - 1) * pageSize,
    currentPageGuide * pageSize
  );

  if (loading || employeeLoading) {
    return (
      <CustomMediaLoading
        message="กำลังโหลดข้อมูล..."
        width={200}
        height={200}
      />
    );
  }

  return loading ? (
    <CustomMediaLoading
      message="กำลังโหลดข้อมูล..."
      width={200}
      height={200}
    />
  ) : (
    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.84)', position: 'relative', minHeight: '100vh' }}>
      <Navbar page="employeeschedule-management" />
      <section style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', minHeight: '100vh' }}>
        <Title style={{ fontSize: '24px', textAlign: 'center' }}>{tourName || 'Tour Name Not Provided'}</Title>

        <div
          style={{
            backgroundColor: 'var(--lightyellow)',
            borderRadius: '8px',
            padding: '20px',
            marginTop: '20px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Row gutter={[16, 16]} justify="end">
            <Col>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => navigate(`/create-employee-schedule/${tourScheduleId}`, { state: { tourScheduleId } })}
                style={{ borderRadius: '8px', padding: '10px 16px' }}
              >
                Add Schedule
              </Button>
            </Col>
          </Row>

          {/* Driver Schedules */}
          <div style={{ marginBottom: '20px' }}>
            <Title level={3} style={{ textAlign: 'left' }}>Driver Schedules</Title>
            <Row gutter={[16, 16]}>
              {displayedDrivers.map((schedule) => (
                <Col
                  xs={24}
                  sm={12}
                  md={8}
                  lg={6}
                  key={schedule.ID}
                >
                  <Card
                    style={{
                      textAlign: 'center',
                      padding: '20px',
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                      borderRadius: '10px',
                      minHeight: '320px', // Fix ขนาดให้ทุกการ์ดเท่ากัน
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
                      <img
                        alt="profile"
                        src={schedule.Employee.ProfilePath || 'https://via.placeholder.com/150'}
                        style={{
                          width: '100px',
                          height: '100px',
                          objectFit: 'cover',
                          borderRadius: '50%',
                          boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
                        }}
                      />
                    </div>
                    <Title level={5} style={{ marginBottom: '10px' }}>
                      {`${schedule.Employee.FirstName} ${schedule.Employee.LastName}`}
                    </Title>
                    <p style={{ marginBottom: '5px' }}>Email: {schedule.Employee.Email}</p>
                    <p style={{ marginBottom: '5px' }}>Phone: {schedule.Employee.PhoneNumber}</p>
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => confirmDelete(schedule.ID)}
                      style={{
                        marginTop: '10px',
                        borderRadius: '5px',
                      }}
                    >
                      Delete
                    </Button>
                  </Card>
                </Col>
              ))}
            </Row>
            <Pagination
              current={currentPageDriver}
              total={driverSchedules.length}
              pageSize={pageSize}
              onChange={(page) => setCurrentPageDriver(page)}
              style={{ textAlign: 'center', marginTop: '20px' }}
            />
          </div>

          {/* Guide Schedules */}
          <div>
            <Title level={3} style={{ textAlign: 'left' }}>Guide Schedules</Title>
            <Row gutter={[16, 16]}>
              {displayedGuides.map((schedule) => (
                <Col
                  xs={24}
                  sm={12}
                  md={8}
                  lg={6}
                  key={schedule.ID}
                >
                  <Card
                    style={{
                      textAlign: 'center',
                      padding: '20px',
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                      borderRadius: '10px',
                      minHeight: '320px', // Fix ขนาดให้ทุกการ์ดเท่ากัน
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
                      <img
                        alt="profile"
                        src={schedule.Employee.ProfilePath || 'https://via.placeholder.com/150'}
                        style={{
                          width: '100px',
                          height: '100px',
                          objectFit: 'cover',
                          borderRadius: '50%',
                          boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
                        }}
                      />
                    </div>
                    <Title level={5} style={{ marginBottom: '10px' }}>
                      {`${schedule.Employee.FirstName} ${schedule.Employee.LastName}`}
                    </Title>
                    <p style={{ marginBottom: '5px' }}>Email: {schedule.Employee.Email}</p>
                    <p style={{ marginBottom: '5px' }}>Phone: {schedule.Employee.PhoneNumber}</p>
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => confirmDelete(schedule.ID)}
                      style={{
                        marginTop: '10px',
                        borderRadius: '5px',
                      }}
                    >
                      Delete
                    </Button>
                  </Card>
                </Col>
              ))}
            </Row>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
              <Pagination
                current={currentPageGuide}
                total={guideSchedules.length}
                pageSize={pageSize}
                onChange={(page) => setCurrentPageGuide(page)}
                style={{ textAlign: 'center', marginTop: '20px' }}
              />
              <Button
                onClick={() => navigate(-1)}
                style={{ backgroundColor: 'white', color: 'black', fontSize: '16px', borderRadius: '15px' }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ManageEmployeeSchedulesPage;
