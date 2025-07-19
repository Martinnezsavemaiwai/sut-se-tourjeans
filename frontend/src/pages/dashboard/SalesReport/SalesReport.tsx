import { useState,useEffect } from "react";
import {    Col,  Row,   Button,  Form,   Modal, Input, Select, notification} from "antd";
import { GetPayments, CreateSalesReports, UpdatePaymentByID } from "../../../services/http";
import { PaymentsInterface } from "../../../interfaces/IPayments";

function SalesReport(){
    const [payments, setPayments] = useState<PaymentsInterface[]>([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const { Item } = Form;
    const [form] = Form.useForm();
    const showModal = () => setModalVisible(true);
    const closeModal = () => setModalVisible(false);
    const [yreport, setyreport] = useState("");
    const [mreport, setmreport] = useState("");
    
    const getPayments = async () => {
        const res = await GetPayments();
        if (res){
            setPayments(res)
        }
    }

    useEffect(() => {
            getPayments();
        }, []);
        
          const paymentFilter = payments.filter((pm) => {
            if (!pm.PaymentDate) return false; // Skip if PaymentDate is undefined
            
            // Convert PaymentDate to a Date object
            const paymentDate = new Date(pm.PaymentDate);
          
            // Extract the year and month
            const paymentYear = paymentDate.getFullYear();
            const paymentMonth = paymentDate.getMonth() + 1; // Months are zero-based, so add 1
          
            // Check if year and month match yreport and mreport
            return paymentYear === Number(yreport) && paymentMonth === Number(mreport);
          });

          const filteredAmount = paymentFilter.reduce((sum, pm) => sum + (pm.Amount ?? 0), 0);
          const filteredCount = paymentFilter.length;

          const onFinish = async (values: any) => {
            try {
              const sales = {
                ReportName: values.ReportName,
                Data: values.Data,
                Date: new Date().toISOString(),
                Total_sales: filteredCount,
                Total_revenue: filteredAmount,
              };
          
              const resSales = await CreateSalesReports(sales);
              console.log("values:", resSales);
              
              const updatedPayments = paymentFilter.map((pm) => ({
                ...pm,
                SalesReportID: resSales.data.ID, 
              }));
          
              console.log("Payments to update:", updatedPayments);
          
              
              const updatePromises = updatedPayments.map(async (payment) => {
                try {
                  if (payment.ID) {
                    await UpdatePaymentByID({ SalesReportID: payment.SalesReportID }, payment.ID);
                    console.log(`Payment ID ${payment.ID} updated successfully.`);
                  }
                } catch (error) {
                  console.error(`Failed to update Payment ID ${payment.ID}:`, error);
                }
              });
          
              await Promise.all(updatePromises);
          
              if (resSales) {
                notification.success({
                  message: "สร้างรายงานเสร็จสิ้น!",
                  placement: "top",
                  duration: 3,
                });
              
                  setTimeout(() => {
                    location.href = "/dashboard";
                  }, 1800);
                
                  };
                }
                catch(error){
                  notification.error({
                  message: "เกิดปัญหาในการสร้างรายงาน",
                  placement: "top",
                  duration: 2,
                  });
                  console.error("Error creating salereport:", error);  
                }
            }   
    return (
    <>
        <Button
        className="sales-report-add-button"
        type="primary"
        onClick={() => {
          showModal();
        }}
      >
        รายงานการขายประจำเดือน
      </Button>
      <Modal
        title="รายงานการขายประจำเดือน"
        visible={isModalVisible}
        onCancel={closeModal}
        footer={null}
      >
        <Form form={form} onFinish={onFinish}>
            <Item label="ชื่อรายงาน" name="ReportName" rules={[{ required: true, message: 'โปรดใส่ชื่อรายงาน!' },{
              validator: (_, value) => {
                
                const hasNumber = /[\d\u0E50-\u0E59]/;
                const hasSpecialChar =/[^a-zA-Z0-9\s\u0E00-\u0E7F]/;
                if (value && hasNumber.test(value)) {
                  return Promise.reject(new Error('ชื่อไม่ควรมีตัวเลข!'));
                }if (value && hasSpecialChar.test(value)) {
                  return Promise.reject(new Error('ชื่อไม่ควรมีอักขระพิเศษ!'));
                }
                return Promise.resolve();
              },
            },]}>
              <Input />
            </Item>
            <Item label="รายละเอียดเพื่่มเติม" name="Data">
              <Input />
            </Item>
            <Item label="ปี (Year)" name="year" rules={[{ required: true, message: 'โปรดเลือกปี!' }]}>
              <Select
                placeholder="Select Year"
                onChange={(value) => {
                  setyreport(value); 
                  console.log("Year selected:", value);
                }}
              >
                {[2023, 2024, 2025].map((year) => (
                  <Select.Option key={year} value={year}>
                    {year}
                  </Select.Option>
                ))}
              </Select>
            </Item>
            <Item label="เดือน (Month)" name="month" rules={[{ required: true, message: 'โปรดเลือกเดือน!' }]}>
              <Select
                placeholder="Select Month"
                onChange={(value) => {
                  setmreport(value); 
                  console.log("Month selected:", value);
                }}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <Select.Option key={month} value={month}>
                    {new Date(0, month - 1).toLocaleString('default', { month: 'long' })}
                  </Select.Option>
                ))}
              </Select>
            </Item>
            <Item label="จำนวนเงินที่ได้ทั้งหมดในเดือนนั้น">
            <span>{filteredAmount}</span>
            </Item>
            <Item label="จำนวนทัวร์ที่ขายได้ทั้งหมดในเดือนนั้น">
            <span>{filteredCount}</span>
            </Item>
            <Row gutter={16}>
                <Col span={12}>
                    <Button className="sales-report-add-button" type="primary" htmlType="submit" block>
                      สร้างรายงานการขาย
                    </Button>
                </Col>
            </Row>
        </Form>
        </Modal>
        </>
    );
}

export default SalesReport