import React, { useEffect } from 'react';
import { Form, Input, Button, DatePicker, ConfigProvider, InputNumber, Row, Col, Card, notification } from 'antd';
import thTH from 'antd/lib/locale/th_TH';
import './CreatePromotion.css';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import { CreatePromotion } from "../../../services/http";
import { Switch } from 'antd';

const CreatePromotions: React.FC = () => {
  const [form] = Form.useForm();

  const handleCancel = () => {
    window.history.back();
  };

  useEffect(() => {

  }, []);

  const handleSubmit = async () => {
    try {
      const formValues = await form.validateFields();
      console.log('Form Values:', formValues);

      // ตรวจสอบค่าที่ส่งจาก Switch และแปลงเป็น 1 หรือ 2
      const promotionStatus = formValues.PromotionStatusID ? 1 : 2;
      console.log('ส่งไปฐานข้อมูล:', promotionStatus);

      const payload = {
        ...formValues,
        PromotionStatusID: promotionStatus,
      };
      console.log("Ja", payload)
      const response = await CreatePromotion(payload);

      if (response.status === 409) {
        notification.error({
          message: 'รหัสโค้ดนี้ถูกใช้เเล้ว',
          description: 'คำเเนะนำ: กรุณาใช้รหัสอื่น',
          placement: 'top',
          duration: 2,
        });
      } else {
        notification.success({
          message: 'สร้างโปรโมชันสำเร็จ',
          description: 'โปรโมชันของคุณถูกสร้างสำเร็จแล้ว',
          placement: 'top',
          duration: 3,
        });
        setTimeout(() => {
          window.history.back();
        }, 100);
      }

    } catch (error) {
      console.error("Error:", error);
      notification.error({
        message: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถสร้างโปรโมชันได้ โปรดลองใหม่อีกครั้ง',
        placement: 'top',
      });
    }
  };


  return (
    <ConfigProvider locale={thTH}>
      <div className="create-pro-f-container">
        <h1 className="bg">สร้างโปรโมชันส่วนลด</h1>
        <Form
          form={form} layout="vertical"
          initialValues={{
            PromotionStatusID: false,
          }}
        >
          <Card className='card'>
            <Row>
              <Col span={12}>
                <Form.Item
                  label="รหัสโค้ด"
                  name="PromotionCode"
                  rules={[
                    { required: true, message: 'กรุณากรอกรหัสโค้ด' },
                    {
                      validator: async (_, value) => {
                        if (!value || !value.startsWith('P') || !/^\d+$/.test(value.slice(1))) {
                          return Promise.reject(new Error('รหัสโค้ดต้องขึ้นต้นด้วยตัว P และตามด้วยตัวเลข'));
                        }
                      }
                    }
                  ]}
                >
                  <Input placeholder="กรอกรหัสโค้ด" style={{ width: '52%' }} />
                </Form.Item>

                <Form.Item
                  label="ชื่อโปรโมชัน"
                  name="PromotionName"
                  rules={[{ required: true, message: 'กรุณากรอกชื่อโปรโมชัน' }]}
                >
                  <Input placeholder="กรอกชื่อโปรโมชัน" style={{ width: '80%' }} />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  label="ราคาจองขั้นตํ่า"
                  name="MinimumPrice"
                  rules={[
                    { required: true, message: 'กรุณากรอกราคาจองขั้นตํ่า' },
                    {
                      validator(_, value) {
                        if (value === undefined || value >= 0) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('ราคาจองขั้นตํ่าต้องมากกว่าหรือเท่ากับ 0'));
                      },
                    },
                  ]}
                >
                  <InputNumber
                    placeholder="กรอกราคาจองขั้นตํ่า"
                    style={{ width: '80%' }}
                    step={1.00}
                    precision={2}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="เปอร์เซ็นส่วนลด"
                  name="DiscountPercentage"
                  rules={[
                    { required: true, message: 'กรุณากรอกเปอร์เซ็นส่วนลด' },
                    {
                      validator(_, value) {
                        if (value === undefined) {
                          return Promise.resolve();
                        }
                        if (value > 0) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('เปอร์เซ็นส่วนลดต้องมากกว่า 0'));
                      },
                    },
                  ]}
                >
                  <InputNumber
                    placeholder="กรอกเปอร์เซ็นส่วนลด"
                    style={{ width: '80%' }}
                    step={0.01}
                    precision={2}
                  />
                </Form.Item>
              </Col>
            </Row>
            <hr className='hr-pro' />
            <Row>
              <Col span={12}>
                <h1 className='title-promotion' style={{ marginBottom: '15px' }}><b>ระยะเวลาโปรโมชัน</b></h1>
                <Form.Item
                  label="เริ่มโปรโมชัน"
                  name="ValidFrom"
                  rules={[{ required: true, message: 'กรุณาเลือกวันเริ่มโปรโมชัน' }]}
                >
                  <DatePicker showTime style={{ width: '80%' }} format="DD-MM-YYYY HH:mm:ss" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <h2 style={{ marginTop: '35px' }}> </h2>
                <Form.Item
                  label="สิ้นสุดโปรโมชัน"
                  name="ValidUntil"
                  rules={[
                    { required: true, message: 'กรุณาเลือกวันสิ้นสุดโปรโมชัน' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const startDate = getFieldValue('ValidFrom');
                        if (!value || !startDate) {
                          return Promise.resolve();
                        }
                        if (value.isAfter(startDate)) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('วันสิ้นสุดโปรโมชันต้องอยู่หลังจากวันเริ่มโปรโมชัน'));
                      },
                    }),
                  ]}
                >
                  <DatePicker showTime style={{ width: '80%' }} format="DD-MM-YYYY HH:mm:ss" />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Form.Item
                label="สถานะโปรโมชัน"
                name="PromotionStatusID"
                valuePropName="checked"
              >
                <Switch
                  checkedChildren="เปิดใช้งาน"
                  unCheckedChildren="ปิดใช้งาน"
                  checked={form.getFieldValue('PromotionStatusID') === true}
                  onChange={(checked) => {
                    // เมื่อ Switch เปลี่ยนสถานะ, ส่งค่าเป็น 1 หรือ 2
                    form.setFieldValue('PromotionStatusID', checked); // ส่งค่า true หรือ false
                    console.log('สถานะ Switch:', checked);
                  }}
                />
              </Form.Item>
            </Row>
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

export default CreatePromotions;