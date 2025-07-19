import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, Upload, message, Col, Row, Card, Divider, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop"; // Use ImgCrop for image cropping
import { CreateEmployee, GetRoles, CheckUserNameEmailPhoneNumber, GetGenders } from "../../../../services/http"; // Call API services
import { useNavigate } from "react-router-dom"; // For page navigation
import Navbar from "../../../../components/Navbar-Management/Navbar";

const { Text } = Typography;

const EmployeeCreate: React.FC = () => {
  const [form] = Form.useForm();
  const [image, setImage] = useState<{ fileList: any[]; base64: string | null }>({ fileList: [], base64: null });
  const [roles, setRoles] = useState<{ ID: number; RoleName: string }[]>([]); // Store role data
  const [genders, setGenders] = useState<{ ID: number; GenderName: string }[]>([]); // Store gender data
  const [duplicateFields, setDuplicateFields] = useState<string[]>([]); // Store list of duplicate fields
  const navigate = useNavigate(); // Page navigation

  // Fetch roles from the API
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await GetRoles();
        setRoles(response);
      } catch (error) {
        message.error("Failed to fetch roles");
      }
    };
    fetchRoles();
  }, []);

  // Fetch genders from the API
  useEffect(() => {
    const fetchGenders = async () => {
      try {
        const response = await GetGenders();
        setGenders(response);
      } catch (error) {
        message.error("Failed to fetch genders");
      }
    };
    fetchGenders();
  }, []);

  // Handle file upload and convert it to base64
  const handleImageUpload = (file: any) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImage((prev) => ({ ...prev, base64: reader.result as string }));
    };
    reader.readAsDataURL(file);
    return false; // Prevent direct upload
  };

  // Check if username, email, or phone number already exists
  const checkIfExists = async (userName: string, email: string, phoneNumber: string) => {
    try {
      const response = await CheckUserNameEmailPhoneNumber(userName, email, phoneNumber);
      return response; // Assuming response contains a boolean value for each field
    } catch (error) {
      console.error("Error checking duplicate fields:", error);
      return { userName: false, email: false, phoneNumber: false }; // Return false if check fails
    }
  };

  // Handle form submission to create employee
  const handleCreateSubmit = async (values: any) => {
    if (!image.base64) {
      message.error("Please upload a profile image");
      return;
    }

    const { UserName, Email, PhoneNumber } = values;

    // Check for duplicates before submitting
    const exists = await checkIfExists(UserName, Email, PhoneNumber);

    // Check which fields are duplicated and show the message
    const duplicateMessages: string[] = [];
    if (exists.userName) duplicateMessages.push("User Name");
    if (exists.email) duplicateMessages.push("Email");
    if (exists.phoneNumber) duplicateMessages.push("Phone Number");

    if (duplicateMessages.length > 0) {
      setDuplicateFields(duplicateMessages); // Set the duplicate fields state
      message.error(`The following fields are already taken: ${duplicateMessages.join(", ")}`);
      return; // Stop form submission if duplicates are found
    } else {
      setDuplicateFields([]); // Reset duplicate fields if no duplicates
    }

    const newEmployee = { ...values, ProfilePath: image.base64 };

    try {
      const response = await CreateEmployee(newEmployee); // Create employee via API

      if (response) {
        message.success("Employee created successfully");
        form.resetFields(); // Reset form and image data
        setImage({ fileList: [], base64: null });
        navigate("/employeemanage"); // Navigate back to EmployeeManage page
      } else {
        // Show error message if creation fails
        message.error("User Name หรือ Email หรือ Phone Number มีคนใช้แล้วโปรดแก้ไข");
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Failed to create employee";
      message.error(errorMessage);
    }
  };

  // Handle file list changes (e.g., user selects an image)
  const onChange = ({ fileList: newFileList }: any) => {
    setImage((prev) => ({ ...prev, fileList: newFileList }));
  };

  // Handle image preview before uploading
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
    <>
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
          <h2>Create Employee</h2>
          <Divider />
          <Form form={form} layout="vertical" onFinish={handleCreateSubmit}>
            <Row gutter={16}>
              {/* Profile image upload section */}
              <Col span={24}>
                <Form.Item label="Profile Image" name="ProfilePath" valuePropName="fileList">
                  <ImgCrop rotationSlider>
                    <Upload
                      fileList={image.fileList}
                      onChange={onChange}
                      onPreview={onPreview}
                      beforeUpload={(file) => {
                        const isImage = file.type.startsWith("image/");
                        const isLt2M = file.size / 1024 / 1024 < 2;

                        if (!isImage) {
                          message.error("สามารถอัพโหลดได้เฉพาะไฟล์ภาพ!");
                          return false;
                        }

                        if (!isLt2M) {
                          message.error("ไฟล์ภาพต้องมีขนาดไม่เกิน 2MB!");
                          return false;
                        }

                        setImage((prev) => ({ ...prev, fileList: [...prev.fileList, file] }));
                        handleImageUpload(file); // แปลงไฟล์เป็น base64
                        return false;
                      }}
                      maxCount={1}
                      multiple={false}
                      listType="picture-card"
                    >
                      <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>อัพโหลด</div>
                      </div>
                    </Upload>
                  </ImgCrop>
                </Form.Item>
              </Col>

              {/* User info and other form fields */}
              <Col span={24}>
                <Form.Item label="User Name" name="UserName" rules={[{ required: true, message: "กรุณากรอกชื่อผู้ใช้" }]}>
                  <Input placeholder="กรอกชื่อผู้ใช้" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="First Name" name="FirstName" rules={[{ required: true, message: "กรุณากรอกชื่อจริง" }]}>
                  <Input placeholder="กรอกชื่อจริง" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Last Name" name="LastName" rules={[{ required: true, message: "กรุณากรอกนามสกุล" }]}>
                  <Input placeholder="กรอกนามสกุล" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Email" name="Email" rules={[{ required: true, message: "กรุณากรอกอีเมล" }, { type: "email", message: "กรุณากรอกอีเมลที่ถูกต้อง" }]}>
                  <Input placeholder="กรอกอีเมล" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Phone Number" name="PhoneNumber" rules={[{ required: true, message: "กรุณากรอกหมายเลขโทรศัพท์" }, { pattern: /^0[0-9]{9}$/, message: "หมายเลขโทรศัพท์ต้องเริ่มต้นด้วย 0 และมีทั้งหมด 10 หลัก" }]}>
                  <Input placeholder="กรอกหมายเลขโทรศัพท์" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Password" name="Password" rules={[{ required: true, message: "กรุณากรอกรหัสผ่าน" }]}>
                  <Input.Password placeholder="กรอกรหัสผ่าน" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Role" name="RoleID" rules={[{ required: true, message: "กรุณาเลือกบทบาท" }]}>
                  <Select loading={roles.length === 0} placeholder="เลือกบทบาท">
                    {roles.map((role) => (
                      <Select.Option key={role.ID} value={role.ID}>
                        {role.RoleName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              {/* Add Gender selection */}
              <Col span={24}>
                <Form.Item label="Gender" name="GenderID" rules={[{ required: true, message: "กรุณาเลือกเพศ" }]}>
                  <Select placeholder="เลือกเพศ">
                    {genders.map((gender) => (
                      <Select.Option key={gender.ID} value={gender.ID}>
                        {gender.GenderName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item>
                <Row gutter={16} justify="end">
                    {/* Create Employee Button */}
                    <Col>
                      
                      <Button style={{ backgroundColor: 'white', color: 'black', fontSize: '16px', borderRadius: '15px' }}
                      onClick={() => navigate("/employeemanage")}>
                        Cancel
                      </Button>
                    </Col>

                    {/* Cancel Button */}
                    <Col>
                    <Button type="primary" htmlType="submit" style={{ fontSize: '16px', borderRadius: '15px', backgroundColor: 'black' }}>
                        บันทึก
                      </Button>
                    </Col>
                  </Row>
                </Form.Item>
              </Col>
            </Row>
          </Form>

          {/* Display duplicate field messages if any */}
          {duplicateFields.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <Text type="danger">The following fields are already taken: {duplicateFields.join(", ")}</Text>
            </div>
          )}
        </Card>
      </div>
    </>
  );
};

export default EmployeeCreate;
