import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Select, message, Row, Col, Card, Divider, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { UpdateEmployee, GetRoles, GetGenders } from '../../../../services/http'; // API calls
import Navbar from '../../../../components/Navbar-Management/Navbar';
import ImgCrop from 'antd-img-crop';

const EditEmployeePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state: employee } = location; // Get employee data passed via location

  const [form] = Form.useForm();
  const [roles, setRoles] = useState<any[]>([]); // Store roles
  const [genders, setGenders] = useState<any[]>([]); // Store genders
  const [imageUrl, setImageUrl] = useState<string | null>(employee.ProfilePath || null); // Image URL
  const [fileList, setFileList] = useState<any[]>([]); // File list for image

  // Fetch roles and genders data from API
  useEffect(() => {
    const fetchRolesAndGenders = async () => {
      try {
        const [rolesResponse, gendersResponse] = await Promise.all([GetRoles(), GetGenders()]);
        setRoles(rolesResponse);
        setGenders(gendersResponse);
      } catch (error) {
        message.error('Failed to fetch roles or genders');
      }
    };
    fetchRolesAndGenders();
  }, []);

  // Handle image upload
  const handleImageUpload = (file: any) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result as string); // Update the image URL after uploading
    };
    reader.readAsDataURL(file); // Convert file to base64
    return false;
  };

  // Handle form submission
  const handleEditSubmit = async (values: any) => {
    if (!imageUrl) {
      message.error('Please upload a profile image.');
      return;
    }

    const updatedEmployee = { ...values, ProfilePath: imageUrl }; // Merge updated profile data

    try {
      const res = await UpdateEmployee(employee.ID, updatedEmployee); // Call API to update employee
      if (res) {
        message.success('Employee updated successfully');
        navigate('/employeemanage'); // Redirect to manage employee page
      } else {
        message.error('Failed to update employee');
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('Failed to update employee');
    }
  };

  // Handle file list change for uploaded files
  const onChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
    if (newFileList.length > 0) {
      const file = newFileList[0].originFileObj;
      handleImageUpload(file); // Update the imageUrl with the new file
    }
  };

  // Function to handle image preview
  const onPreview = async (file: any) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  return (
    <div className="Employee-page" style={{ backgroundColor: 'rgba(255, 255, 255, 0.84)', position: 'relative', minHeight: '100vh' }}>
      <Navbar page="employee-management" />
      <div
  style={{
    fontFamily: 'Arial, sans-serif', // ใช้ฟอนต์ Arial
    maxWidth: '100%', // กำหนดให้ความกว้างไม่เกิน 100%
    margin: 'auto', // จัดให้อยู่กลาง
    padding: '80px', // เพิ่มระยะห่างรอบๆ
    backgroundColor: 'var(--lightyellow)', // White background for the box
    borderRadius: '0px 0px 8px 8px', // ขอบล่างซ้ายและขวาเป็นมุมมน
    minHeight: '100vh', // ความสูงของคอนเทนเนอร์เต็มหน้าจอ
    height: '100%', // ความสูงของคอนเทนเนอร์
    width: '100%', // ความกว้างเต็มหน้าจอ
  }}
>
  
  <Card
  style={{
    maxWidth: '700px', // ขนาดการ์ด
    margin: '0 auto', // จัดให้การ์ดอยู่กลาง
    padding: '10px',
   
    backgroundColor: '#fff', // พื้นหลังการ์ดสีขาว
    border: '1px solid #fff', // ขอบสีขาว
    borderRadius: '8px', // มุมมน
    boxShadow: '0 4px 8px rgba(142, 141, 141, 0.3)', // เงาของการ์ด
    marginBottom: '15px', // ระยะห่างด้านล่างของการ์ด
  }}
>
    
    <h2>Edit Employee</h2>
              <Divider />
    <Form form={form} layout="vertical" onFinish={handleEditSubmit} initialValues={employee}>
      <Row gutter={16}>
        {/* Profile Picture Upload */}
        <Col span={24}>
          <Form.Item label="Profile Picture" name="ProfilePath">
            <ImgCrop rotationSlider>
              <Upload
                fileList={fileList}
                onChange={onChange}
                onPreview={onPreview}
                beforeUpload={(file: any) => {
                  setFileList([file]);
                  handleImageUpload(file);
                  return false; // Prevent automatic upload
                }}
                maxCount={1}
                showUploadList={false}
                listType="picture-card"
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Profile Preview"
                    style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            </ImgCrop>
          </Form.Item>
        </Col>

        {/* Employee Name Fields */}
        <Col span={12}>
          <Form.Item label="First Name" name="FirstName" rules={[{ required: true, message: 'Please enter the first name' }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Last Name" name="LastName" rules={[{ required: true, message: 'Please enter the last name' }]}>
            <Input />
          </Form.Item>
        </Col>

        {/* Email Field */}
        <Col span={24}>
          <Form.Item
            label="Email"
            name="Email"
            rules={[{ required: true, message: 'Please enter an email address' }, { type: 'email', message: 'Please enter a valid email address' }]}
          >
            <Input />
          </Form.Item>
        </Col>

        {/* Phone Number Field */}
        <Col span={24}>
          <Form.Item label="Phone Number" name="PhoneNumber" rules={[{ required: true, message: 'Please enter the phone number' }, { pattern: /^0[0-9]{9}$/, message: 'Phone number must start with 0 and be 10 digits long' }]}>
            <Input />
          </Form.Item>
        </Col>

        {/* Role Selection */}
        <Col span={24}>
          <Form.Item label="Role" name="RoleID" rules={[{ required: true, message: 'Please select a role' }]}>
            <Select>
              {roles.map((role: any) => (
                <Select.Option key={role.ID} value={role.ID}>
                  {role.RoleName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        {/* Gender Selection */}
        <Col span={24}>
          <Form.Item label="Gender" name="GenderID" rules={[{ required: true, message: 'Please select a gender' }]}>
            <Select>
              {genders.map((gender: any) => (
                <Select.Option key={gender.ID} value={gender.ID}>
                  {gender.GenderName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        {/* Action Buttons */}
        <Col span={24}>
          <Form.Item>
            <Row gutter={16} justify="end">
              {/* Align buttons to the right using justify="end" */}
              <Col>
              <Button
                  type="default"
                  style={{ backgroundColor: 'white', color: 'black', fontSize: '16px', borderRadius: '15px' }} // Custom style for cancel button
                  onClick={() => navigate("/employeemanage")}
                  block
                >
                  Cancel
                </Button>
              </Col>

              {/* Cancel Button */}
              <Col>
                
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  block 
                  style={{ fontSize: '16px', borderRadius: '15px', backgroundColor: 'black' }} // Custom style for save button
                >
                  บันทึก
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  </Card>
</div>

    </div>
  );
};

export default EditEmployeePage;
