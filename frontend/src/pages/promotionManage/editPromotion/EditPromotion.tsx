import React, { useEffect, useState } from 'react';
import { Form, Input, Button, DatePicker, ConfigProvider, InputNumber, Row, Col, Card, notification } from 'antd';
import thTH from 'antd/lib/locale/th_TH';
import './EditPromotion.css';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import { GetPromotionsById, UpdatePromotionById } from "../../../services/http";
import { Switch } from 'antd';
import { useParams } from 'react-router-dom';
import { useRef } from 'react';
import CustomMediaLoading from '../../../components/employeeLoading/CustomMediaLoading';

const EditPromotion: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [form] = Form.useForm();
    const { id } = useParams<{ id: any }>();
    const isFirstRender = useRef(true);

    const fetchPromotion = async () => {
        try {
            const response = await GetPromotionsById(id);
            if (response && response.status === 200) {
                const data = response.data;
                form.setFieldsValue({
                    PromotionCode: data.PromotionCode,
                    PromotionName: data.PromotionName,
                    MinimumPrice: data.MinimumPrice,
                    DiscountPercentage: data.DiscountPercentage,
                    ValidFrom: dayjs(data.ValidFrom).subtract(7, 'hour'),
                    ValidUntil: dayjs(data.ValidUntil).subtract(7, 'hour'),
                    PromotionStatusID: data.PromotionStatusID === 1,
                });
            } else {
                notification.error({
                    message: 'ไม่พบโปรโมชัน',
                    description: 'กรุณาลองใหม่อีกครั้ง',
                    placement: 'top',
                });
            }
        } catch (error) {
            console.error('Error fetching promotion:', error);
            notification.error({
                message: 'เกิดข้อผิดพลาด',
                description: 'ไม่สามารถโหลดข้อมูลโปรโมชันได้',
                placement: 'top',
            });
        }
    };

    useEffect(() => {
        try {
            if (isFirstRender.current) {
                isFirstRender.current = false;
            } else {
                fetchPromotion();
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setIsLoading(false);
        }
    }, [id, form]);

    const handleSubmit = async () => {
        try {
            const formValues = await form.validateFields();
            const promotionStatus = formValues.PromotionStatusID ? 1 : 2;

            const validFrom = dayjs(formValues.ValidFrom).add(7, 'hour').utc().format();
            const validUntil = dayjs(formValues.ValidUntil).add(7, 'hour').utc().format();

            const payload = {
                ...formValues,
                PromotionStatusID: promotionStatus,
                ValidFrom: validFrom,
                ValidUntil: validUntil,
            };
            console.log(payload)
            const response = await UpdatePromotionById(id, payload);

            if (response.status === 200) {
                notification.success({
                    message: 'แก้ไขโปรโมชันสำเร็จ',
                    description: 'โปรโมชันของคุณถูกแก้ไขเรียบร้อยแล้ว',
                    placement: 'top',
                });
                setTimeout(() => {
                    window.history.back();
                }, 200);
            } else {
                notification.error({
                    message: 'เกิดข้อผิดพลาด',
                    description: response.data?.error || 'ไม่สามารถแก้ไขโปรโมชันได้ โปรดลองใหม่อีกครั้ง',
                    placement: 'top',
                });
            }
        } catch (error) {
            console.error('Error:', error);
            notification.error({
                message: 'เกิดข้อผิดพลาด',
                description: 'ไม่สามารถแก้ไขโปรโมชันได้ โปรดลองใหม่อีกครั้ง',
                placement: 'top',
            });
        }
    };
    const handleCancel = () => {
        window.history.back();
    };

    return isLoading ? (
        <CustomMediaLoading
            message="กำลังโหลดข้อมูล..."
            width={200}
            height={200}
        />
    ) : (
        <ConfigProvider locale={thTH}>
            <div className="edit-pro-f-container">
                <h1 className="bg">แก้ไขโปรโมชันส่วนลด</h1>
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
                                    rules={[{ required: true, message: 'กรุณากรอกรหัสโค้ด' }]}>
                                    <Input placeholder="กรอกรหัสโค้ด" style={{ width: '52%' }} disabled />
                                </Form.Item>
                                <Form.Item
                                    label="ชื่อโปรโมชัน"
                                    name="PromotionName"
                                    rules={[{ required: true, message: 'กรุณากรอกชื่อโปรโมชัน' }]}>
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
                                                    return Promise.resolve(); // วันสิ้นสุดต้องอยู่หลังวันเริ่ม
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
                                    onChange={(checked) => {
                                        form.setFieldValue('PromotionStatusID', checked);
                                    }}
                                />
                            </Form.Item>
                        </Row>
                    </Card>
                    <div className="form-buttons">
                        <Button className="cancel-button" onClick={handleCancel}>ยกเลิก</Button>
                        <Button className="submit-button" type="primary" htmlType="submit" onClick={handleSubmit}>
                            บันทึก
                        </Button>
                    </div>
                </Form>
            </div>
        </ConfigProvider>
    );
};

export default EditPromotion;