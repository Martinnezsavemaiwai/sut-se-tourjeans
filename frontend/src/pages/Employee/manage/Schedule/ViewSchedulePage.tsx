import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Typography, message, Row, Col, Card, Button } from 'antd';
import Navbar from '../../../../components/Navbar-Management/Navbar';
import moment from 'moment';
import { GetEmployeeSchedulesbyemployeeId } from '../../../../services/http';
import CustomMediaLoading from '../../../../components/employeeLoading/CustomMediaLoading';
const { Title } = Typography;

// Define types for TourPackage, TourSchedule, and EmployeeSchedule
interface TourPackage {
  TourName: string;
}

interface TourSchedule {
  TourScheduleID: string;
  TourPackage: TourPackage;
  StartDate: string;
  EndDate: string;
}

interface EmployeeSchedule {
  TourScheduleID: string;
  TourSchedule: TourSchedule;
}

const EmployeeSchedulePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState<EmployeeSchedule[]>([]);
  const [ loading, setLoading] = useState(false);
  const { state: employee } = location;

  useEffect(() => {
    if (employee && employee.ID) {
      fetchSchedules(employee.ID);
    }
  }, [employee]);

  const fetchSchedules = async (employeeID: any) => {
    setLoading(true);
    try {
      const data = await GetEmployeeSchedulesbyemployeeId(employeeID); // เรียกใช้ฟังก์ชันที่มีอยู่
      if (data && data.length > 0) {
        data.sort((a: EmployeeSchedule, b: EmployeeSchedule) => {
          const dateA = moment(a.TourSchedule.EndDate);
          const dateB = moment(b.TourSchedule.EndDate);
          return dateB.diff(dateA); // จัดเรียงจากใหม่ไปเก่า
        });
        setSchedules(data); // ตั้งค่า state ของตาราง
      } else {
        setSchedules([]); // กรณีไม่มีข้อมูล
        message.warning('No schedules available for this employee.');
      }
    } catch (error) {
      console.error('Error fetching schedules:', error);
      message.error('Failed to fetch employee schedules');
    } finally {
      setLoading(false); // ปิดสถานะโหลด
    }
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
      <section style={{ backgroundColor: 'white', color: 'white', padding: '20px', borderRadius: '8px', minHeight: '100vh' }}>

        <div
          style={{
            backgroundColor: 'var(--lightyellow)', // White background for the box
            borderRadius: '8px', // Rounded corners for the box
            padding: '20px', // Add some padding inside the box
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow for 3D effect
            marginTop: '20px', // Space between the heading and the box
            marginLeft: '20px', // Add space from the left side
            marginRight: '20px', // Add space from the right side
            minHeight: '70vh',
            position: 'relative',
          }}
        >
          {/* Employee Information */}
          <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
            <Col span={24}>
              <Card style={{ textAlign: 'center', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: '10px',
                  }}
                >
                  <img
                    alt="profile"
                    src={employee?.ProfilePath || 'https://via.placeholder.com/150'}
                    style={{
                      width: '120px',
                      height: '120px',
                      objectFit: 'cover',
                      borderRadius: '50%',
                      boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                </div>
                <Title level={5}>{employee?.FirstName} {employee?.LastName}</Title>
                <p>Email: {employee?.Email}</p>
                <p>Phone: {employee?.PhoneNumber}</p>
              </Card>
            </Col>
          </Row>

          {/* Schedule Table */}
          <div style={{ overflowX: 'auto', padding: '10px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', borderSpacing: '0' }}>
              <thead>
                <tr style={{ backgroundColor: '#333', color: '#fff' }}>
                  <th style={thStyle}>Tour Name</th>
                  <th style={thStyle}>Start Date</th>
                  <th style={thStyle}>End Date</th>
                </tr>
              </thead>
              <tbody>
                {schedules.length > 0 ? (
                  schedules.map((schedule) => (
                    <tr key={schedule.TourScheduleID} style={trStyle}>
                      <td style={tdStyle}>{schedule.TourSchedule.TourPackage.TourName}</td>
                      <td style={tdStyle}>{moment(schedule.TourSchedule.StartDate).format('DD-MM-YYYY')}</td>
                      <td style={tdStyle}>{moment(schedule.TourSchedule.EndDate).format('DD-MM-YYYY')}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} style={{ ...tdStyle, textAlign: 'center', color: 'black', height: '100px' }}>No schedules available</td>
                  </tr>
                )}
              </tbody>
            </table>
            <Button
              onClick={() => navigate(-1)}
              style={{ backgroundColor: 'white', color: 'black', fontSize: '16px', borderRadius: '15px', position: 'absolute', bottom: '20px', left: '20px' }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

// Styles for table elements
const thStyle = {
  padding: '12px 8px',
  textAlign: 'center' as 'center',
  fontSize: '16px',
  backgroundColor: '#333',
  color: '#fff',
};

const trStyle = {
  backgroundColor: '#fff',
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  marginBottom: '10px',
  color: 'black',
};

const tdStyle = {
  padding: '12px 8px',
  textAlign: 'center' as 'center',
  fontSize: '14px',
  borderBottom: '1px solid #e0e0e0',
};

export default EmployeeSchedulePage;
