import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, message, Pagination, Input, Button, Space, Select } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import { GetTourSchedulesForEmployeeSchedule } from '../../../services/http';
import Navbar from '../../../components/Navbar-Management/Navbar';
import './EmployeeSchedulePage.css'
import CustomMediaLoading from '../../../components/employeeLoading/CustomMediaLoading';
const { Search } = Input;
const { Option } = Select;

const EmployeeSchedulePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [schedules, setSchedules] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>('desc');


  const pageSize = 12;
  const navigate = useNavigate();
  const fetchTourSchedules = async () => {
    try {
      const schedulesData = await GetTourSchedulesForEmployeeSchedule();
      if (!Array.isArray(schedulesData)) {
        throw new Error('Invalid data format');
      }
      setSchedules(schedulesData);
    } catch (error) {
      message.error('Failed to fetch tour schedules data');
      console.error('Error fetching tour schedules:', error);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchTourSchedules();
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSortChange = (value: 'asc' | 'desc') => {
    setSortOrder(value);
  };


  const filteredSchedules = schedules.filter((schedule) => {
    const tourName = schedule.TourPackage?.TourName?.toLowerCase() || '';
    const searchQuery = searchTerm.toLowerCase();
    return tourName.includes(searchQuery);
  });


  const sortedSchedules = [...filteredSchedules].sort((a, b) => {
    const dateA = new Date(a.StartDate).getTime();
    const dateB = new Date(b.StartDate).getTime();
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });



  const displayedSchedules = sortedSchedules.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  

  const columns = [
    {
      title: 'Tour Name',
      dataIndex: ['TourPackage', 'TourName'],
      key: 'TourName',
      render: (text: string) => text || 'N/A',
    },
    {
      title: 'Start Date',
      dataIndex: 'StartDate',
      key: 'StartDate',
      render: (date: string) =>
        date
          ? new Date(date).toLocaleDateString('th-TH', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
          : 'N/A',
    },
    {
      title: 'End Date',
      dataIndex: 'EndDate',
      key: 'EndDate',
      render: (date: string) =>
        date
          ? new Date(date).toLocaleDateString('th-TH', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
          : 'N/A',
    },
    {
      title: 'Available Slots',
      dataIndex: 'AvailableSlots',
      key: 'AvailableSlots',
    },
    {
      title: 'Actions',
      key: 'Actions',
      render: (_: any, record: any) => (
        <Button
          icon={<CalendarOutlined />}
          onClick={() =>
            navigate(`/employee-schedules/${record.ID}`, {
              state: {
                tourScheduleId: record.ID,
                tourName: record.TourPackage?.TourName,
              },
            })
          }
        >
          Manage EmployeeSchedule
        </Button>
      ),
    },
  ];


  return isLoading ? (
    <CustomMediaLoading
      message="กำลังโหลดข้อมูล..."
      width={200}
      height={200}
    />
  ) : (
    <div className="employeeschedule-management" style={{ backgroundColor: 'rgba(255, 255, 255, 0.84)', position: 'relative', minHeight: '100vh' }}>
      <Navbar page="employeeschedule-management" />
      <section style={{ backgroundColor: 'white', color: 'white', padding: '20px', borderRadius: '8px' }}>
        <div className="text-4xl font-semibold text-left mt-10 ml-3">
          <h6 className="text-black">จัดการตารางงาน</h6>
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
          <Space
            style={{
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between', // กระจายองค์ประกอบให้ชิดซ้ายและขวา
              alignItems: 'center', // จัดตำแหน่งแนวตั้งให้อยู่ตรงกลาง
              width: '100%', // ใช้ความกว้างเต็ม
              flexWrap: 'wrap', // รองรับการแสดงผลหลายแถวเมื่อหน้าจอเล็ก
            }}
          >
            <Search
              placeholder="ค้นหาด้วยชื่อ ทัวร์"
              onSearch={handleSearch}
              style={{
                flex: 1, // ใช้พื้นที่ที่เหลือ
                minWidth: '350px', // กำหนดความกว้างขั้นต่ำ
                maxWidth: '700px', // จำกัดความกว้างสูงสุด
                marginRight: '10px', // เพิ่มช่องว่างระหว่าง Search และ Select
              }}
            />
            <Select
              placeholder="Sort by Start Date"
              value={sortOrder}
              onChange={handleSortChange}
              style={{
                width: '200px', // กำหนดความกว้างคงที่สำหรับ Select
                minWidth: '150px', // เพิ่มความกว้างขั้นต่ำ
              }}
              allowClear
            >
              <Option value="asc">Start Date: Ascending</Option>
              <Option value="desc">Start Date: Descending</Option>
            </Select>
          </Space>

          <Table
            dataSource={displayedSchedules}
            columns={columns}
            rowKey="id"
            pagination={false}
            bordered
            style={{
              border: '1px solid black',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
            tableLayout="fixed"
            rowClassName={(_record, index) =>
              index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
            }
            scroll={{ x: true }}
          />

          <Pagination
            current={currentPage}
            total={filteredSchedules.length}
            pageSize={pageSize}
            onChange={handlePageChange}
            style={{ marginTop: '20px', textAlign: 'center' }}
          />
        </div>
      </section>


    </div>
  );
};

export default EmployeeSchedulePage;
