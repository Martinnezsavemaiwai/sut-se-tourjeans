import {  useEffect, useState } from "react";
import { GetEmployeeByID, UpdateEmployee, GetGenders, GetEmployeeSchedulesbyemployeeId, GetProvinces } from "../../../services/http"; // เพิ่ม GetProvinces
import { Button, Select, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { EmployeesInterface } from "../../../interfaces/IEmployees";

import Loading from "../../../components/loading/Loading";
import { Form, Input, message, Space, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import "./employeeProfile.css";
import moment from "moment";

function EmployeeProfile() {
  const [employee, setEmployee] = useState<EmployeesInterface>();
  const [genders, setGenders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(true);
  const [isScheduleVisible, setIsScheduleVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [schedules, setSchedules] = useState<any[]>([]);
  const [, setProvinces] = useState<any[]>([]); // State สำหรับ provinces

  const employeeID = localStorage.getItem("id");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fileList, setFileList] = useState<any[]>([]);
  interface ModalData {
    Transportations: {
      Location: {
        LocationName: string;
      };
      Vehicle: {
        VehicleName: string;
      };
    }[];
    TourPackage: {
      Transportations: any;
      TourName: string;
      PackageCode: string;
      Duration: string;
      Province: {
        ProvinceName: string;
      };
    };
  }
  


  const [modalState, setModalState] = useState<{ visible: boolean; data: ModalData | null }>({
    visible: false,
    data: null,
  });

  async function getEmployee() {
    const res = await GetEmployeeByID(Number(employeeID));
    if (res) {
      setEmployee(res);
    }
  }

  async function fetchSchedules(employeeID: number) {
    try {
      const data: any[] = await GetEmployeeSchedulesbyemployeeId(employeeID);
      if (data.length > 0) {
        data.sort((a, b) => moment(b.TourSchedule.EndDate).diff(moment(a.TourSchedule.EndDate)));
        setSchedules(data);
      } else {
        setSchedules([]);
        message.warning("No schedules available for this employee.");
      }
    } catch (error) {
      console.error("Error fetching schedules:", error);
      message.error("Failed to fetch employee schedules.");
    }
  }

  const fetchProvinces = async () => {
    try {
      const response = await GetProvinces();
      setProvinces(response); 
    } catch (error) {
      console.error("Failed to fetch provinces:", error);
      message.error("ไม่สามารถโหลดข้อมูลจังหวัดได้");
    }
  };
  

  const fetchData = async () => {
    try {
      await getEmployee();
      await fetchProvinces(); // เรียก fetchProvinces
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setIsLoading(false);
    }
  };

  const showConfirm = () => {
    const confirmed = window.confirm("คุณต้องการจะออกจากระบบหรือไม่?");
    if (confirmed) {
      localStorage.clear();
      setTimeout(() => {
        location.href = "/login-employee";
      }, 2000);
      alert("ออกจากระบบสำเร็จ");
    }
  };

  const handleSave = async () => {
    if (!employee) {
      message.error("ข้อมูลผู้ใช้ไม่สามารถเข้าถึงได้");
      return;
    }

    try {
      const values = await form.validateFields();
      const updatedEmployee = { ...employee, ...values, ProfilePath: imageUrl };
      const res = await UpdateEmployee(employee.ID, updatedEmployee);
      if (res) {
        message.success("อัพเดตโปรไฟล์สำเร็จ");
        setIsEditing(false);
        window.location.reload();
      } else {
        message.error("ไม่สามารถอัพเดตโปรไฟล์ได้");
      }
    } catch (errorInfo) {
      console.error("Failed to save profile:", errorInfo);
    }
  };

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
    setIsScheduleVisible(false);
  };

  const handleToggleSchedule = () => {
    setIsScheduleVisible(!isScheduleVisible);
    if (!isScheduleVisible) fetchSchedules(Number(employeeID));
    setIsEditing(false);
  };

  useEffect(() => {
    if (employeeID) {
      fetchData();
    } else {
      message.error("ไม่พบข้อมูลผู้ใช้");
      setIsLoading(false);
    }

    const fetchGenders = async () => {
      try {
        const gendersResponse = await GetGenders();
        setGenders(gendersResponse);
      } catch (error) {
        message.error("Failed to fetch genders");
      }
    };

    fetchGenders();
  }, []);

  useEffect(() => {
    if (employee) {
      setImageUrl(employee.ProfilePath ?? null);
    }
  }, [employee]);

  useEffect(() => {
    if (modalState.data) {
      console.log("Modal Data:", modalState.data);
    }
  }, [modalState.data]);

  const handleImageUpload = (file: any) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
    return false;
  };

  const onChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
    if (newFileList.length > 0) {
      const file = newFileList[0].originFileObj;
      handleImageUpload(file);
    }
  };

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

  const openModal = (tourScheduleID: any) => {
    // หา TourSchedule ที่ตรงกับ TourScheduleID
    const schedule = schedules.find((item) => item.TourScheduleID === tourScheduleID);

    if (schedule) {
      // อัปเดต modalState ด้วยข้อมูลที่เจอ
      setModalState({ visible: true, data: schedule.TourSchedule });
    } else {
      message.error("ไม่พบข้อมูลตารางงานสำหรับ TourScheduleID นี้");
    }
  };


  const closeModal = () => {
    setModalState({ visible: false, data: null });
  };



  return isLoading ? (
    <Loading />
  ) : (
    <div className="profileEmployee-page">
      <div className="profileEmployee-container">
        <div className="profileEmployee-sidebar">
          <div className="profileEmployee-info">
            <img
              className="profileEmployee-picture"
              src={employee?.ProfilePath || "https://via.placeholder.com/150"}
              alt="Profile"
            />
            <h2>{employee?.UserName}</h2>
            <p>{`${employee?.FirstName} ${employee?.LastName}`}</p>
            <p>{employee?.Email}</p>
            <p>{employee?.Role.RoleName || "N/A"}</p>
          </div>
          <div className="menu-buttons">
            <button
              className={`menu-btn ${isEditing ? 'active' : ''}`}
              onClick={handleToggleEdit}
              disabled={isEditing}
            >
              แก้ไขโปรไฟล์
            </button>
            <button
              className={`menu-btn ${isScheduleVisible ? 'active' : ''}`}
              onClick={handleToggleSchedule}
              disabled={isScheduleVisible}
            >
              ดูตารางงาน
            </button>
          </div>
          <Button className="logout-btn" type="primary" onClick={showConfirm}>
            ออกจากระบบ
          </Button>
        </div>
        <div className="profileEmployee-content">
          {isEditing ? (
            <div className="edit-profileEmployee-form">
              <h1>แก้ไขโปรไฟล์</h1>
              <Form form={form} onFinish={handleSave} layout="vertical" initialValues={employee}>
                <Form.Item label="Profile Picture" name="ProfilePath">
                  <ImgCrop rotationSlider>
                    <Upload
                      fileList={fileList}
                      onChange={onChange}
                      onPreview={onPreview}
                      beforeUpload={(file: any) => {
                        setFileList([file]);
                        handleImageUpload(file);
                        return false;
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

                <Form.Item
                  label="Username"
                  name="UserName"
                  initialValue={employee?.UserName}
                  rules={[{ required: true, message: "กรุณากรอกชื่อผู้ใช้!" }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Firstname"
                  name="FirstName"
                  initialValue={employee?.FirstName}
                  rules={[{ required: true, message: "กรุณากรอกชื่อ!" }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Lastname"
                  name="LastName"
                  initialValue={employee?.LastName}
                  rules={[{ required: true, message: "กรุณากรอกนามสกุล!" }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Email"
                  name="Email"
                  initialValue={employee?.Email}
                  rules={[
                    { required: true, message: "กรุณากรอกอีเมล!" },
                    { type: "email", message: "กรุณากรอกอีเมลที่ถูกต้อง!" },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Phone Number"
                  name="PhoneNumber"
                  initialValue={employee?.PhoneNumber}
                  rules={[{ required: true, message: "กรุณากรอกหมายเลขโทรศัพท์!" }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Gender"
                  name="GenderID"
                  rules={[{ required: true, message: "Please select a gender" }]}
                >
                  <Select>
                    {genders.map((gender: any) => (
                      <Select.Option key={gender.ID} value={gender.ID}>
                        {gender.GenderName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    style={{
                      fontSize: '16px',
                      borderRadius: '15px',
                      backgroundColor: 'black',
                    }}
                  >
                    บันทึก
                  </Button>
                </Space>
              </Form>
            </div>
          ) : (
            isScheduleVisible && (
              <div style={{ overflowX: 'auto', padding: '10px' }}>
                <table className="employee-schedule-table">
                  <thead>
                    <tr>
                      <th>Tour Name</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedules.length > 0 ? (
                      schedules.map((schedule) => (
                        <tr key={schedule.TourScheduleID}>
                          <td>{schedule.TourSchedule.TourPackage.TourName}</td>
                          <td>{moment(schedule.TourSchedule.StartDate).format('DD-MM-YYYY')}</td>
                          <td>{moment(schedule.TourSchedule.EndDate).format('DD-MM-YYYY')}</td>
                          <td>
                            <button
                              className="text-blue-500 p-2 rounded-full hover:scale-105 transform transition-all focus:outline-none"
                              onClick={() => openModal(schedule.TourScheduleID)}
                            >
                              ดูรายละเอียด
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} style={{ textAlign: 'center' }}>
                          No schedules available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>
      </div>

      <Modal
        title="รายละเอียดทัวร์"
        visible={modalState.visible}
        onCancel={closeModal}
        footer={null}
        className="custom-modal"
      >
        {modalState.data ? (
          <div>
            <p><strong>ชื่อทัวร์:</strong> {modalState.data?.TourPackage?.TourName || "ไม่พบข้อมูล"}</p>
            <p><strong>รหัสทัวร์:</strong> {modalState.data?.TourPackage?.PackageCode || "ไม่พบข้อมูล"}</p>
            <p><strong>ระยะเวลา:</strong> {modalState.data?.TourPackage?.Duration || "ไม่พบข้อมูล"}</p>
            <p><strong>จังหวัด:</strong> {modalState.data?.TourPackage?.Province?.ProvinceName || "ไม่พบข้อมูล"}</p>
            <p><strong>สถานที่:</strong>
              {modalState.data?.TourPackage?.Transportations?.length > 0
                ? modalState.data.TourPackage.Transportations.map((transportation: { Location: { LocationName: any; }; }, index: any | null | undefined) => (
                  <span key={index}>
                    {transportation?.Location?.LocationName || "ไม่พบข้อมูล"}{index < modalState.data?.TourPackage.Transportations.length - 1 ? ", " : ""}
                  </span>
                ))
                : "ไม่พบข้อมูล"}
            </p>
          </div>

        ) : (
          <p>กำลังโหลดข้อมูล...</p>
        )}
      </Modal>



    </div>
  );
}

export default EmployeeProfile;
