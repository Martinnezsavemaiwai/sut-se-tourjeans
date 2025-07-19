import React, { useEffect, useState } from 'react';
import { Upload, Form, Input, Button, Select, DatePicker, Space, ConfigProvider, InputNumber, Row, Col, Card, Modal, notification } from 'antd';
import { GetRoomTypes, GetProvinces, GetListLocationsByProvince } from '../../../services/http';
import { CreateTourPackages } from "../../../services/http";
import { PlusOutlined } from '@ant-design/icons';
import thTH from 'antd/lib/locale/th_TH';
import './CreateTourPackage.css';
import { TimePicker } from 'antd';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import CustomMediaLoading from '../../../components/employeeLoading/CustomMediaLoading';
dayjs.extend(utc);

const { Option } = Select;

const { TextArea } = Input;

const CreateTourPackage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [form] = Form.useForm();
  const [roomTypes, setRoomTypes] = useState<any[]>([]);

  const [provinces, setProvinces] = useState<any[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<any | null>(null);
  const [locations, setLocations] = useState<any[]>([]);

  const [fileList, setFileList] = useState<any[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [previewTitle, setPreviewTitle] = useState<string>('');

  const [options, setOptions] = useState<string[]>([]);
  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    const number = value ? parseInt(value.match(/\d+/)?.[0] || '0', 10) : NaN;

    if (!isNaN(number)) {
      const generatedOptions = Array.from({ length: number }, (_, i) => {
        return i === 0 ? `วันแรก` : `วันที่ ${i + 1}`;
      });
      setOptions(generatedOptions);
    } else {
      setOptions([]);
    }
  };

  const [time, setTime] = useState<string | null>(null);

  const handleTimeChange = (newTime: dayjs.Dayjs | null) => {
    if (newTime) {
      setTime(newTime.format('YYYY-MM-DD HH:mm:ss'));
    } else {
      setTime(null);
    }
  };
  const timeValue = time ? dayjs.utc(time, 'YYYY-MM-DD HH:mm:ss') : null;

  const handleCancel = () => {
    window.history.back();
  };

  const onPreview = async (file: any) => {
    let fileUrl = file.url;
    if (!fileUrl) {
      fileUrl = URL.createObjectURL(file.originFileObj);
    }
    setPreviewImage(fileUrl);
    setPreviewVisible(true);
    setPreviewTitle(file.name || 'รูปภาพ');
  };

  const onChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
  };

  const beforeUpload = async (file: File) => {
    const resizedFile = await resizeImage(file, 1350, 900);
    setFileList((prev) => [...prev, resizedFile]);
    return false;
  };

  const resizeImage = async (file: File, width: number, height: number): Promise<File> => {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);

    return new Promise((resolve) => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(resizedFile);
          }
        }, file.type);
      };
    });
  };

  // ฟังก์ชันดึงข้อมูลจังหวัด
  const fetchProvinces = async () => {
    try {
      const response = await GetProvinces();
      console.log('Response:', response);
      setProvinces(response || []);
    } catch (error) {
      console.error('Error fetching provinces:', error);
    }
  };

  const fetchLocations = async () => {
    try {
      if (selectedProvince?.ID) {
        const data = await GetListLocationsByProvince(selectedProvince.ID);
        setLocations(data || []);
      } else {
        setLocations([]);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const locationOptions = locations?.map((location) => ({
    label: location.LocationName,
    value: location.ID,
  })) || [];

  // ฟังก์ชันดึงข้อมูลประเภทห้องพัก
  const fetchRoomTypes = async () => {
    try {
      const data = await GetRoomTypes();
      setRoomTypes(data);
    } catch (error) {
      console.error('Error fetching room types:', error);
    }
  };

  useEffect(() => {
    try {
      fetchRoomTypes();
      fetchProvinces();
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      fetchLocations();
    }
  }, [selectedProvince]);


  const handleSubmit = async () => {
    try {
      const formValues = await form.validateFields();
      console.log(formValues); // ดูว่า tourImages มีข้อมูลหรือไม่

      const payload = {
        ...formValues,
        tourImages: fileList.map(file => ({ file_path: file.thumbUrl || file.url }))
      };
      const response = await CreateTourPackages(payload);

      console.log(response.status)

      if (response.status === 409) {
        notification.error({
          message: 'รหัสแพ็กเกจทัวร์นี้ถูกใช้เเล้ว',
          description: 'คำเเนะนำ: กรุณาใช้รหัสอื่น',
          placement: 'top',
          duration: 2,
        });
      } else {
        notification.success({
          message: 'สร้างแพ็กเกจทัวร์สำเร็จ',
          description: 'แพ็กเกจทัวร์ของคุณถูกสร้างสำเร็จแล้ว',
          placement: 'top',
          duration: 3,
        });
        setTimeout(() => {
          window.history.back();
        }, 100);
      }

    } catch (error) {
      console.error("Error ja:", error);
      notification.error({
        message: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถสร้างแพ็กเกจทัวร์ได้ โปรดลองใหม่อีกครั้ง',
        placement: 'top',
      });
    }
  };

  return isLoading ? (
    <CustomMediaLoading
      message="กำลังโหลดข้อมูล..."
      width={200}
      height={200}
    />
  ) : (
    <ConfigProvider locale={thTH}>
      <div className="create-package-f-container">
        <h1 className="bg">สร้างแพ็กเกจทัวร์</h1>
        <Form form={form}
          layout="vertical"
          onFinish={(values) => console.log(values)}
          initialValues={{
            province_name: selectedProvince ? selectedProvince.ID : undefined,
            activities: [{ day: null, time: null, location_id: null, activity_name: '', description: '' }],
            duration: '',
            tourSchedules: [{ start_date: null, end_date: null, available_slots: undefined }],
            intro: '',
            trip_highlight: '',
            package_detail: '',
            places_highlight: '',
            tourPrices: [
              { price: undefined },
              { price: undefined },
              { price: undefined },
              { price: undefined },
              { price: undefined },
              { price: undefined }
            ]
          }}
        >
          {/* Upload Section */}
          <Card className='card'>
            <Row>
              <Col>
                <Form.Item label="รูปภาพ" name="tourImages" valuePropName="fileList">
                  <Upload
                    id="image"
                    fileList={fileList}
                    onChange={onChange}
                    onPreview={onPreview}
                    beforeUpload={beforeUpload}
                    multiple={true}
                    listType="picture-card"
                    style={{ width: '100%', maxWidth: '1350px' }}
                    previewFile={(file) =>
                      new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = () => resolve(reader.result as string); // ส่งไฟล์จริงไปแสดงผล
                      })
                    }
                  >
                    {fileList.length >= 5 ? null : (
                      <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>อัพโหลด</div>
                      </div>
                    )}
                  </Upload>
                  <Modal
                    visible={previewVisible}
                    title={previewTitle}
                    footer={null}
                    onCancel={() => setPreviewVisible(false)}
                    width={1350}
                  >
                    <img
                      alt="example"
                      style={{ width: '100%', height: 'auto' }}
                      src={previewImage}
                    />
                  </Modal>
                </Form.Item>
              </Col>
            </Row>

            {/* Form Section */}
            <Row>
              <Col span={12}>
                <Form.Item
                  label="รหัสแพ็กเกจทัวร์"
                  name="package_code"
                  rules={[
                    { required: true, message: 'กรุณากรอกรหัสแพ็กเกจทัวร์' },
                    {
                      validator: async (_, value) => {
                        if (!value || !value.startsWith('T') || !/^\d+$/.test(value.slice(1))) {
                          return Promise.reject(new Error('รหัสแพ็กเกจทัวร์ต้องขึ้นต้นด้วยตัว T และตามด้วยตัวเลข'));
                        }
                      }
                    }
                  ]}
                >
                  <Input placeholder="กรอกรหัสแพ็กเกจทัวร์" style={{ width: '52%' }} />
                </Form.Item>
              </Col>


              <Col span={12}>
                <Form.Item
                  label="ชื่อแพ็กเกจทัวร์"
                  name="tour_name"
                  rules={[{ required: true, message: 'กรุณากรอกชื่อแพ็กเกจทัวร์' }]}
                >
                  <Input placeholder="กรอกชื่อแพ็กเกจทัวร์" style={{ width: '80%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <Form.Item
                  label="แนะนำ"
                  name="intro"
                  rules={[{ required: true, message: 'กรุณากรอกเเนะนำ' }]}
                >
                  <TextArea rows={3} placeholder="กรอกคำแนะนำ" style={{ width: '80%' }} />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="ไฮไลต์ของทัวร์"
                  name="trip_highlight"
                  rules={[{ required: true, message: 'กรุณากรอกไฮไลต์' }]}
                >
                  <TextArea rows={3} placeholder="กรอกไฮไลต์" style={{ width: '80%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <Form.Item
                  label="รายละเอียด"
                  name="package_detail"
                  rules={[{ required: true, message: 'กรุณากรอกรายละเอียด' }]}
                >
                  <TextArea rows={5} placeholder="กรอกรายละเอียด" style={{ width: '80%' }} />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="จุดเด่นของเเพ็กเกจทัวร์"
                  name="places_highlight"
                  rules={[{ required: true, message: 'กรุณากรอกจุดเด่นของเเพ็กเกจทัวร์' }]}
                >
                  <TextArea rows={5} placeholder="กรอกจุดเด่นของเเพ็กเกจทัวร์" style={{ width: '80%' }} />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card className="card">
            <h2 style={{ marginBottom: '12px' }}><b>ราคา</b></h2>
            <Row gutter={[10, 10]}>
              {/* เด็ก/ผู้ใหญ่ */}
              <Col span={12}>
                <h4 style={{ color: '#1cb2fd' }}>เด็ก/ผู้ใหญ่</h4>
                <p style={{ color: '#686868', marginBottom: '16px' }}>*เตียงเสริมสำหรับเด็กเล็ก</p>
                {roomTypes.map((roomType, index) => (
                  <Row key={roomType.ID} style={{ marginBottom: '12px' }}>
                    <Col span={12}>
                      <span>{roomType.TypeName}</span>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name={['tourPrices', index, 'price']}
                        style={{ marginBottom: 0 }}
                        rules={[
                          {
                            required: true,
                            message: "กรุณากรอกตัวเลข",
                          },
                          {
                            validator(_, value) {
                              if (value === undefined) {
                                return Promise.resolve();
                              }
                              if (value >= 0) {
                                return Promise.resolve();
                              }
                              return Promise.reject(new Error("ราคาต้องมากกว่าหรือเท่ากับ 0"));
                            },
                          },
                        ]}
                      >
                        <InputNumber
                          placeholder="ราคา (บาท)"
                          className="widthInputNum"
                          step={1.0}
                          precision={2}
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                ))}
              </Col>
            </Row>
          </Card>

          <Card className="card">
            <Row>
              <h2 style={{ marginBottom: '15px' }}><b>ระยะเวลาทริป</b></h2>
            </Row>
            <Row>
              <Col>
                <Form.Item
                  label="ระยะเวลาทั้งสิ้น"
                  name="duration"
                  rules={[{ required: true, message: 'กรุณากรอกระยะเวลาทั้งสิ้น' }]}
                  style={{ width: '106%' }}
                >
                  <Input
                    placeholder="เช่น 2 วัน 2 คืน"
                    onChange={handleDurationChange}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.List name="tourSchedules">
              {(fields, { add, remove }) => (
                <>
                  <h2 style={{ marginBottom: '15px' }}><b>รอบทัวร์</b></h2>
                  {fields.map((field, index) => (
                    <div key={field.key} style={{ marginBottom: '20px' }}>
                      {index > 0 && (
                        <hr style={{ border: '1px dashed #d9d9d9', margin: '20px 0' }} />
                      )}
                      <Space size="large" direction="vertical" style={{ width: '100%' }}>
                        <h4 style={{ marginBottom: '-30px', color: '#1cb2fd' }}>
                          รอบที่ {index + 1}
                        </h4>
                        <Row gutter={16} align="middle" style={{ marginBottom: '15px' }}>
                          <Col span={4}>
                            <Form.Item
                              {...field}
                              name={[field.name, 'start_date']}
                              fieldKey={[field.key, 'start_date']}
                              label="วันเริ่มต้น"
                              rules={[{ required: true, message: 'กรุณาเลือกวันเริ่มต้น' }]}
                              style={{ marginBottom: '15px' }}
                            >
                              <DatePicker
                                format="DD/MM/YYYY"
                                placeholder="เลือกวัน"
                                showToday={false}
                                allowClear
                                style={{ width: '100%' }}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={4}>
                            <Form.Item
                              {...field}
                              name={[field.name, 'end_date']}
                              fieldKey={[field.key, 'end_date']}
                              label="วันสิ้นสุด"
                              rules={[
                                { required: true, message: 'กรุณาเลือกวันสิ้นสุด' },
                                {
                                  validator: (_, value) => {
                                    const startDate = form.getFieldValue(['tourSchedules', field.name, 'start_date']);
                                    if (startDate && value && value.isBefore(startDate)) {
                                      return Promise.reject('วันสิ้นสุดต้องหลังจากวันเริ่มต้น');
                                    }
                                    return Promise.resolve();
                                  }
                                }
                              ]}
                              style={{ marginBottom: '15px' }}
                            >
                              <DatePicker
                                format="DD/MM/YYYY"
                                placeholder="เลือกวัน"
                                showToday={false}
                                allowClear
                                style={{ width: '100%' }}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={4}>
                            <Form.Item
                              label="จำนวนที่นั่ง"
                              name={[field.name, 'available_slots']}
                              rules={[
                                { required: true, message: 'กรุณากรอกจำนวนที่นั่ง' },
                                {
                                  validator: (_, value) => {
                                    if (value === undefined || value <= 0) {
                                      return Promise.reject(new Error('จำนวนที่นั่งต้องมากกว่าศูนย์'));
                                    }
                                    return Promise.resolve();
                                  }
                                }
                              ]}
                            >
                              <InputNumber
                                placeholder="จำนวนที่นั่ง"
                                style={{ width: '100%', marginTop: '6px' }}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={1} style={{ textAlign: 'left' }}>
                            <Button
                              type="link"
                              onClick={() => remove(field.name)}
                              style={{ color: 'red', marginTop: '7px' }}
                            >
                              ลบ
                            </Button>
                          </Col>
                        </Row>
                      </Space>
                    </div>
                  ))}
                  <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                    เพิ่มรอบทัวร์
                  </Button>
                </>
              )}
            </Form.List>
          </Card>

          <Card className="card">
            {/* ช่องกรอกจังหวัดที่อยู่ด้านบนสุด */}
            <h2 style={{ marginBottom: '15px' }}><b>แผนการเดินทางและกิจกรรม</b></h2>
            <Row gutter={16} align="middle" style={{ marginBottom: '15px' }}>
              <Form.Item
                name="province_id"
                label="จังหวัด"
                rules={[{ required: true, message: 'กรุณาเลือกจังหวัด' }]}
              >
                <Select
                  className="custom-select"
                  style={{ width: '182%' }}
                  placeholder="เลือกจังหวัด"
                  value={selectedProvince?.ID || undefined}
                  onChange={(value) => {
                    const selected = provinces.find((province) => province.ID === value);
                    setSelectedProvince(selected);

                    form.setFieldsValue({
                      province_name: value,
                    });
                  }}
                >
                  {provinces.map((province) => (
                    <Option key={province.ID} value={province.ID}>
                      {province.ProvinceName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Row>

            <Form.List
              name="activities"
              initialValue={[
                { day: null, time: null, location_name: undefined, activity_name: '', description: '' },
              ]}
            >
              {(fields, { add, remove }) => (
                <>
                  {/* แสดงกิจกรรม */}
                  {fields.map((field, index) => (
                    <div key={field.key} style={{ marginBottom: '20px' }}>
                      <Space size="large" direction="vertical" className="activity-row" style={{ width: '100%' }}>
                        <h4 style={{ marginBottom: '-30px', color: '#1cb2fd' }}>กิจกรรมที่ {index + 1}</h4>
                        <Row gutter={16} align="middle" style={{ marginBottom: '15px' }}>

                          {/* เลือกวัน */}
                          <Col span={4}>
                            <Form.Item
                              {...field}
                              name={[field.name, 'day']}
                              fieldKey={[field.key, 'day']}
                              label="เลือกวัน"
                              rules={[{ required: true, message: 'กรุณาเลือกวัน' }]}
                              style={{ marginBottom: '10px' }}
                            >
                              <Select placeholder="เลือกวัน" disabled={options.length === 0}>
                                {options.map((option, index) => (
                                  <Option key={index} value={(index + 1).toString()}>
                                    {option}
                                  </Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </Col>

                          <Col span={4}>
                            <Form.Item
                              {...field}
                              name={[field.name, 'time']}
                              fieldKey={[field.key, 'time']}
                              label="เวลา"
                              rules={[{ required: true, message: 'กรุณาเลือกเวลา' }]}
                              style={{ marginBottom: '10px' }}
                            >
                              <TimePicker
                                value={timeValue}
                                onChange={handleTimeChange}
                                format="HH:mm"
                                placeholder="เลือกเวลา"
                              />
                            </Form.Item>
                          </Col>

                          <Col span={4}>
                            <Form.Item
                              {...field}
                              name={[field.name, 'location_id']}
                              fieldKey={[field.key, 'location_id']}
                              label="สถานที่"
                              rules={[{ required: true, message: 'กรุณาเลือกสถานที่' }]}
                              style={{ marginBottom: '10px' }}
                            >
                              <Select
                                placeholder="เลือกสถานที่"
                                className="custom-select"
                                style={{ width: '100%' }}
                                disabled={!selectedProvince}
                                options={locationOptions}
                              />
                            </Form.Item>
                          </Col>

                          <Col span={4}>
                            <Form.Item
                              {...field}
                              name={[field.name, 'activity_name']}
                              fieldKey={[field.key, 'activity_name']}
                              label="ชื่อกิจกรรม"
                              rules={[{ required: true, message: 'กรุณากรอกชื่อกิจกรรม' }]}
                              style={{ marginBottom: '15px' }}
                            >
                              <Input placeholder="กรอกชื่อกิจกรรม" />
                            </Form.Item>
                          </Col>

                          <Col span={10}>
                            <Form.Item
                              {...field}
                              name={[field.name, 'description']}
                              fieldKey={[field.key, 'description']}
                              label="รายละเอียดกิจกรรม"
                              style={{ marginBottom: '10px' }}
                            >
                              <TextArea
                                style={{ width: '100%' }}
                                rows={1}
                                placeholder="กรอกรายละเอียดกิจกรรม"
                                maxLength={2000}
                              />
                            </Form.Item>
                          </Col>

                          <Col span={1} style={{ textAlign: 'left' }}>
                            <Button
                              type="link"
                              onClick={() => remove(field.name)}
                              style={{ color: 'red', marginTop: '6px' }}
                            >
                              ลบ
                            </Button>
                          </Col>
                        </Row>
                      </Space>
                    </div>
                  ))}

                  <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                    เพิ่มกิจกรรม
                  </Button>
                </>
              )}
            </Form.List>
          </Card>
          <div className="form-buttons">
            <Button className="cancel-button" onClick={handleCancel} >ยกเลิก</Button>
            <Button className="reset-button" htmlType="reset">
              รีเซ็ต
            </Button>
            <Button className="submit-button" type="primary" htmlType="submit" onClick={handleSubmit}>
              บันทึก
            </Button>
          </div>
        </Form>
      </div>
    </ConfigProvider>
  );
};
export default CreateTourPackage;