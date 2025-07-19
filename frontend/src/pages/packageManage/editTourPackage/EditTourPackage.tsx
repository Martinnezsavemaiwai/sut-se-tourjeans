import React, { useEffect, useState } from 'react';
import { Upload, Form, Input, Button, Select, DatePicker, Space, ConfigProvider, InputNumber, Row, Col, Card, Modal, notification } from 'antd';
import { GetRoomTypes, GetProvinces, GetListLocationsByProvince } from '../../../services/http';
import { apiUrl, UpdateTourPackageById, GetTourPackageByID, DeleteTourScheduleByID, RestoreTourScheduleByID } from "../../../services/http";
import { PlusOutlined } from '@ant-design/icons';
import thTH from 'antd/lib/locale/th_TH';
import './EditTourPackage.css';
import { TimePicker } from 'antd';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useParams } from 'react-router-dom';
dayjs.extend(utc);

const { Option } = Select;

const { TextArea } = Input;

const EditTourPackage: React.FC = () => {
  const [form] = Form.useForm();
  const { id } = useParams<{ id: any }>();
  const [roomTypes, setRoomTypes] = useState<any[]>([]);

  const [provinces, setProvinces] = useState<any[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<any | null>(null);

  const [locations, setLocations] = useState<any[]>([]);

  const [fileList, setFileList] = useState<any[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [previewTitle, setPreviewTitle] = useState<string>('');

  const [options, setOptions] = useState<string[]>([]);

  const [prices, setPrices] = useState<number[]>([]);

  const [tourSchedules, setTourSchedules] = useState<any[]>([]);
  const [backupTourSchedules, setBackupTourSchedules] = useState<any[] | null>(null);
  const [deletedTourScheduleIds, setDeletedTourScheduleIds] = useState<any[]>([]);

  const [activities, setActivities] = useState<any[]>([]);

  const fetchPackageByTD = async () => {
    try {
      const data = await GetTourPackageByID(id);

      // ดึงข้อมูลภาพจาก data.tourImages
      const tourImages = Array.isArray(data?.TourImages)
        ? data.TourImages.map((item: { FilePath: string, id?: string, description?: string }) => ({
          FilePath: item.FilePath,
          id: item.id,
          description: item.description || '',
        }))
        : [];
      console.log('tourImages:', tourImages);

      const priceList = data.TourPrices.map((item: { Price: number }) => item.Price);
      setPrices(priceList);

      // ดึงข้อมูล TourSchedules และ Activities
      const tourSchedules = data.TourSchedules
        ? data.TourSchedules.map((item: any) => ({
          AvailableSlots: item.AvailableSlots,
          EndDate: item.EndDate,
          ID: item.ID,
          StartDate: item.StartDate,
          // กรองเฉพาะข้อมูลกิจกรรมที่เกี่ยวข้อง
          activities: item.ScheduleActivities?.map((activity: any) => ({
            id: activity.Activity?.ID,
            activity_name: activity.Activity?.ActivityName,
            description: activity.Activity?.Description,
            location_name: activity.Activity?.Location?.LocationName,
          })),
        }))
        : [];
      setTourSchedules(tourSchedules);

      const activities = data.TourSchedules
        ? Array.from(
          data.TourSchedules.flatMap((schedule: any) =>
            schedule.ScheduleActivities.map((itemAc: any) => ({
              id: itemAc.Activity?.ID,
              day: itemAc.Day,
              time: itemAc.Time,
              activity_name: itemAc.Activity?.ActivityName,
              description: itemAc.Activity?.Description,
              location_id: itemAc.Activity?.Location?.ID,
            }))
          )
            .filter(
              (item: { id?: number; day?: string; time?: string; activity_name?: string; description?: string; location_id?: string; }) => item.id && item.activity_name
            )
            .reduce(
              (
                map: Map<
                  number,
                  {
                    id: number; day: string; time: string; activity_name: string; description: string; location_id: string;
                  }
                >,
                item: { id: number; day: string; time: string; activity_name: string; description: string; location_id: string; }
              ) => map.set(item.id, item),
              new Map<
                number,
                {
                  id: number; day: string; time: string; activity_name: string; description: string; location_id: string;
                }
              >()
            )
            .values()
        )
        : [];
      const sortedActivities = activities.sort((a: any, b: any) => {
        // เปรียบเทียบ Day ก่อน (วันน้อยขึ้นก่อน)
        if (Number(a.day) !== Number(b.day)) {
          return Number(a.day) - Number(b.day);
        }
        // ถ้าวันเท่ากัน ให้เปรียบเทียบเวลา (เวลาน้อยขึ้นก่อน)
        const timeA = a.time ? new Date(a.time).getTime() : 0;
        const timeB = b.time ? new Date(b.time).getTime() : 0;
        return timeA - timeB;
      });
      setActivities(sortedActivities);

      let activitiesList: any[] = [];
      if (data.TourSchedules) {
        activitiesList = data.TourSchedules.flatMap((schedule: any) =>
          schedule.ScheduleActivities.map((itemAc: any) => ({
            activity: itemAc.Activity,
          }))
        )
          .reduce((acc: any[], curr: any) => {
            const existing = acc.find(item => item.activity?.ID === curr.activity?.ID);
            if (!existing) {
              acc.push(curr);
            }
            return acc;
          }, []);
      }
      // ตรวจสอบและตั้งค่าฟอร์ม
      if (data && data.PackageCode) {
        form.setFieldsValue({
          package_code: data.PackageCode || '',
          tour_name: data.TourName || '',
          province_id: data.ProvinceID || '',
          intro: data.TourDescriptions?.Intro || '',
          trip_highlight: data.TourDescriptions?.TripHighlight || '',
          package_detail: data.TourDescriptions?.PackageDetail || '',
          places_highlight: data.TourDescriptions?.PlacesHighlight || '',
          duration: data.Duration || '',
          tourSchedules: tourSchedules,
          activities: activitiesList,
          tourImages: data.tourImages ? data.tourImages.map((item: { file_path: string }) => item.file_path) : [], // แปลงให้เป็นอาเรย์ของ file_path
        });
      } else {
        console.error("Data or PackageCode is missing:", data);
        notification.error({
          message: 'ข้อมูลไม่สมบูรณ์',
          description: 'ไม่พบ PackageCode ในข้อมูลที่โหลด',
          placement: 'top',
        });
      }
    } catch (error) {
      console.error("Error fetching tour package:", error);
      notification.error({
        message: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถโหลดข้อมูลแพ็กเกจทัวร์ได้',
        placement: 'top',
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await GetTourPackageByID(id);
      if (data?.TourImages && Array.isArray(data.TourImages)) {
        const tourImages = data.TourImages.map((image: any, index: any) => ({
          uid: index.toString(),
          name: `Image ${index + 1}`,
          status: 'done',
          url: `${apiUrl}/${image.FilePath}`,
        }));
        setFileList(tourImages);
      }
    };
    fetchData();
  }, [id]);

  const handleDeleteTourSchedules = (tourScheduleId: number) => {
    console.log('ก่อนลบ:', tourSchedules);

    setBackupTourSchedules([...tourSchedules]);
    console.log('ข้อมูลสำรองก่อนลบ:', [...tourSchedules]);
    console.log(backupTourSchedules);
    console.log(deletedTourScheduleIds)

    if (tourSchedules.length === 0) {
      console.warn('ไม่มีข้อมูลรอบทัวร์ใน tourSchedules');
      return;
    }
    setDeletedTourScheduleIds((prevDeletedIds) => [...prevDeletedIds, tourScheduleId]);

    DeleteTourScheduleByID(tourScheduleId.toString())
      .then(response => {
        if (response.success) {
          console.log('ลบรอบทัวร์สำเร็จ:', response.data);

          // อัพเดต tourSchedules หลังจากลบสำเร็จ
          setTourSchedules(prevSchedules =>
            prevSchedules.filter(schedule => schedule.id !== tourScheduleId)
          );
        } else {
          console.error('ลบรอบทัวร์ไม่สำเร็จ:', response.message);
        }
      })
      .catch(error => {
        console.error('เกิดข้อผิดพลาดในการลบรอบทัวร์:', error);
      });
  };

  const handleDurationChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    const number = value ? parseInt(value.match(/\d+/)?.[0] || '0', 10) : NaN;

    if (!isNaN(number)) {
      // สร้างตัวเลือกตามจำนวน
      const generatedOptions = Array.from({ length: number }, (_, i) => {
        return i === 0 ? `วันแรก` : `วันที่ ${i + 1}`;
      });
      // เปลี่ยนแค่ตัวเลือกไม่เปลี่ยนค่าเริ่มต้น
      setOptions(generatedOptions);
    } else {
      setOptions([]);
    }
  };

  const handleDurationChange = (value: string) => {
    console.log("Input:", value);
    const match = value.match(/\d+/);
    const number = match ? parseInt(match[0], 10) : NaN;
    if (!isNaN(number)) {
      const generatedOptions = Array.from({ length: number }, (_, i) => {
        return i === 0 ? `วันแรก` : `วันที่ ${i + 1}`;
      });

      setOptions(generatedOptions);
    } else {
      setOptions([]);
    }
  };

  const fetchData = async () => {
    try {
      const data = await GetTourPackageByID(id);
      const duration = data.Duration;
      console.log("Fetched Duration:", duration);

      handleDurationChange(duration);
    } catch (error) {
      console.error("Error fetching data:", error);
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


  const handleCancel = async () => {
    if (deletedTourScheduleIds.length > 0) {
      console.log("กำลังกู้คืนรอบทัวร์จาก ID ที่ลบไป:", deletedTourScheduleIds);
      const validTourScheduleIds = deletedTourScheduleIds.filter((id) => id !== null && id !== undefined);

      if (validTourScheduleIds.length === 0) {
        console.warn("ไม่พบ ID ที่ถูกต้องสำหรับการกู้คืน");
        return;
      }
      const restoreResults = await Promise.all(
        validTourScheduleIds.map(async (tourScheduleId) => {
          const result = await RestoreTourScheduleByID(tourScheduleId.toString());
          if (result.success) {
            console.log(`รอบทัวร์ ID: ${tourScheduleId} กู้คืนสำเร็จ`);
            return tourScheduleId;
          } else {
            console.warn(`รอบทัวร์ ID: ${tourScheduleId} กู้คืนล้มเหลว:`, result.message);
            return null;
          }
        })
      );

      const successfullyRestoredIds = restoreResults.filter((id) => id !== null);

      if (successfullyRestoredIds.length > 0) {
        setTourSchedules((prevTourSchedules) => [
          ...prevTourSchedules,
          ...successfullyRestoredIds.map((id) => ({ id })), // เพิ่มข้อมูลรอบทัวร์ที่กู้คืนใน array
        ]);

        console.log("รอบทัวร์ที่กู้คืน:", successfullyRestoredIds);
      }

      setDeletedTourScheduleIds([]);
      setBackupTourSchedules(null);
      console.log("การกู้คืนรอบทัวร์เสร็จสิ้น");
    } else {
      console.warn("ไม่มีรอบทัวร์ที่ถูกลบไว้");
    }

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
      //console.log('Response:', response);
      setProvinces(response || []);
    } catch (error) {
      console.error('Error fetching provinces:', error);
    }
  };

  const fetchLocations = async () => {
    try {
      const data1 = await GetTourPackageByID(id);

      if (selectedProvince?.ID && selectedProvince.ID !== data1.ProvinceID) {
        // เลือกจังหวัดใหม่
        const data = await GetListLocationsByProvince(selectedProvince.ID);
        setLocations(data || []);
      } else {
        // เริ่มต้น
        const data = await GetListLocationsByProvince(Number(data1.ProvinceID));
        setLocations(data || []);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const locationOptions = locations?.map((location) => ({
    label: location.LocationName,
    value: location.ID,
  })) || [];

  useEffect(() => {
    fetchLocations();
  }, [selectedProvince]);

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
    fetchPackageByTD()
    fetchRoomTypes();
    fetchProvinces();
    fetchData();
  }, []);

  const handleSubmit = async () => {
    try {
      const formValues = await form.validateFields();
      console.log("data form", formValues);

      const payload = {
        ...formValues,
        activities: formValues.activities.map((activity: any) => ({
          ...activity,
          location_id: Number(activity.location_id),
        })),
        tourImages: fileList.map(file => ({
          file_path: (file.thumbUrl || file.url)?.replace('http://localhost:8000/', '')
        }))
      };
      const response = await UpdateTourPackageById(id, payload);
      console.log(response.status)

      if (response.status === 200) {
        notification.success({
          message: 'แก้ไขแพ็กเกจทัวร์สำเร็จ',
          description: 'แพ็กเกจทัวร์ของคุณถูกแก้ไขสำเร็จแล้ว',
          placement: 'top',
          duration: 3,
        });
        setTimeout(() => {
          window.history.back();
        }, 200);
      }

    } catch (error) {
      console.error("Error ja:", error);
      notification.error({
        message: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถแก้ไขแพ็กเกจทัวร์ได้ โปรดลองใหม่อีกครั้ง',
        placement: 'top',
      });
    }
  };

  return (
    <ConfigProvider locale={thTH}>
      <div className="edit-package-f-container">
        <h1 className="bg">แก้ไขแพ็กเกจทัวร์</h1>
        <Form form={form}
          layout="vertical"
          onFinish={(values) => console.log(values)}
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
                    open={previewVisible}
                    title={previewTitle}
                    footer={null}
                    onCancel={() => setPreviewVisible(false)}
                    width={700}
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
                  rules={[{ required: true, message: 'กรุณากรอกรหัสแพ็กเกจทัวร์' }]}
                >
                  <Input placeholder="กรอกรหัสแพ็กเกจทัวร์" style={{ width: '52%' }} disabled />
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
              <Col span={12}>
                <h4 style={{ color: '#1cb2fd' }}>เด็ก/ผู้ใหญ่</h4>
                <p style={{ color: '#686868', marginBottom: '16px' }}>*เตียงเสริมสำหรับเด็กเล็ก</p>
                {roomTypes && roomTypes.length > 0 ? (
                  roomTypes.map((roomType, index) => (
                    <Row key={roomType.ID} style={{ marginBottom: '12px' }}>
                      <Col span={12}>
                        <span>{roomType.TypeName}</span>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name={['tourPrices', index, 'price']}
                          style={{ marginBottom: 0 }}
                          initialValue={prices[index]}
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
                  ))
                ) : (
                  <p>ไม่มีข้อมูลราคา</p>
                )}
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
                    onChange={handleDurationChange1}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.List name="tourSchedules" initialValue={tourSchedules}>
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
                              initialValue={tourSchedules[index]?.StartDate ? dayjs(tourSchedules[index]?.StartDate) : null}
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
                              initialValue={tourSchedules[index]?.EndDate ? dayjs(tourSchedules[index]?.EndDate) : null}
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
                              initialValue={tourSchedules[index] && typeof tourSchedules[index].AvailableSlots === 'number'
                                ? tourSchedules[index].AvailableSlots
                                : null}

                              rules={[
                                { required: true, message: 'กรุณากรอกจำนวนที่นั่ง' },
                                {
                                  validator: (_, value) => {
                                    if (value === undefined || value < 0) {
                                      return Promise.reject(new Error('จำนวนที่นั่งต้องมากกว่าหรือเท่ากับศูนย์'));
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
                              onClick={() => {
                                const tourSchedulesId = tourSchedules[index]?.ID;
                                remove(field.name);
                                console.log(tourSchedulesId)
                                if (tourSchedulesId) {
                                  handleDeleteTourSchedules(tourSchedulesId);
                                }
                              }}
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
                  onChange={(value) => {
                    const selected = provinces.find((province) => province.ID === value);
                    setSelectedProvince(selected);

                    form.setFieldsValue({
                      province_name: selected?.ProvinceName,
                    });
                    if (selected) {
                      fetchLocations();
                    }
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

            <Form.List name="activities" initialValue={activities}
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
                              initialValue={activities[index]?.day ? activities[index]?.day : null}
                            >
                              <Select placeholder="เลือกวัน">
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
                              initialValue={activities[index]?.time ? dayjs.utc(activities[index]?.time).set('year', 0).set('month', 0).set('date', 1) : null}
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
                              initialValue={activities[index]?.location_id ? activities[index]?.location_id : null}
                            >
                              <Select
                                placeholder="เลือกสถานที่"
                                className="custom-select"
                                style={{ width: '100%' }}
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
                              initialValue={activities[index]?.activity_name ? activities[index]?.activity_name : null}
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
                              initialValue={activities[index]?.description ? activities[index]?.description : null}
                            >
                              <TextArea
                                style={{ width: '100%' }}
                                rows={2}
                                placeholder="กรอกรายละเอียดกิจกรรม"
                                maxLength={2000}
                              />
                            </Form.Item>
                          </Col>

                          <Col span={1} style={{ textAlign: 'left' }}>
                            <Button
                              type="link"
                              onClick={() => {
                                const activityId = activities[index]?.ID;
                                remove(field.name);
                                console.log(activityId)
                              }}
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
            <Button className="submit-button" type="primary" htmlType="submit" onClick={handleSubmit}>
              บันทึก
            </Button>
          </div>
        </Form>
      </div>
    </ConfigProvider >
  );
};
export default EditTourPackage;