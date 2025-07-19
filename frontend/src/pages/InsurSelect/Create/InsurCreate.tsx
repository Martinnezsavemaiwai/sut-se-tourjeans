import { useState, useEffect, useCallback } from "react";
import { Modal, Button, Form, Row, Col, Input, InputNumber, notification } from "antd";
import TextArea from "antd/es/input/TextArea";
import { GetTravelInsurances, GetBookingByID, CreatePurchaseDetail, CreateInsuranceParticipants } from "../../../services/http";
import { TravelInsurancesInterface } from "../../../interfaces/ITravelInsurances";
import Loading from "../../../components/loading/Loading";

function InsurCreate({ insuranceValue }: { insuranceValue: number }) {
  const { Item } = Form;
  const [form] = Form.useForm();
  const bookingID = localStorage.getItem("booking-id");
  const [loading, setLoading] = useState<boolean>(true);
  const [amount, setAmount] = useState<number>(1);
  const [age, setAge] = useState<number>(1);
  const [pricePerUnit, setPricePerUnit] = useState<number>(0);
  const [travelinsurances, setTravelinsurances] = useState<TravelInsurancesInterface[]>([]);

  const [isInnerModalVisible, setInnerModalVisible] = useState(false);

  const showInnerModal = () => setInnerModalVisible(true);
  const closeInnerModal = () => setInnerModalVisible(false);

  // Optimized Data Fetching
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [travelInsuranceData] = await Promise.all([
        
        GetTravelInsurances(),
        bookingID ? GetBookingByID(Number(bookingID)) : Promise.resolve(null),
      ]);

      setTravelinsurances(travelInsuranceData || []);
      if (travelInsuranceData) {
        const selectedInsurance = travelInsuranceData.find((insurance: { ID: number; }) => insurance.ID === insuranceValue);
        setPricePerUnit(selectedInsurance?.Price || 0);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [insuranceValue, bookingID]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onFinish = async (values: any) => {
    try {
      const purchase = {
        Quantity: amount,
        TotalPrice: amount * pricePerUnit,
        BookingID: Number(bookingID),
        TravelInsuranceID: insuranceValue,
      };
      const resPurchase = await CreatePurchaseDetail(purchase);
      console.log("values", resPurchase.data.ID);
      console.log("values",travelinsurances);
      const participant = {
        FirstName: values.Firstname,
        LastName: values.Lastname,
        Age: values.Age,
        PhoneNumber: values.PhoneNumber,
        IdCardNumber: values.IdCardNumber,
        Detail: values.Detail,
        PurchaseDetailID: resPurchase.data.ID,
        PurchaseDetail:  resPurchase.data
      };
      try {
        const resParticipant = await CreateInsuranceParticipants(participant);
        console.log("Participant response:", resParticipant);
        console.log("values", participant);
        if (resPurchase) {
          if (resParticipant){
            notification.success({
            message: "สั่งซื้อประกันเสร็จสิ้น!",
            placement: "top",
            duration: 3,}
          )}};
      } catch (error) {
        if (error instanceof Error) {
          notification.error({
            message: "เกิดปัญหาในการสั่งซื้อประกัน",
            placement: "top",
            duration: 2,
          });
          console.error("Error creating participant:", error.message);
        } else if ((error as any)?.response?.data) {
          notification.error({
            message: "เกิดปัญหาในการสั่งซื้อประกัน",
            placement: "top",
            duration: 2,
          });
          console.error("Error creating participant:", (error as any).response.data);
        } else {
          notification.error({
            message: "เกิดปัญหาในการสั่งซื้อประกัน",
            placement: "top",
            duration: 2,
          });
          console.error("Unknown error:", error);
        }
      }
        
        localStorage.setItem("purchase-id", resPurchase.data.ID);
        setTimeout(() => {
          location.href = "/payment";
        }, 1800);
        
      }
      catch (error) {
      notification.error({
        message: "เกิดปัญหาในการสั่งซื้อประกัน",
        placement: "top",
        duration: 2,
      });
      console.error("Error creating purchase:", error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Button
        className="buy-insurance-btn"
        type="primary"
        onClick={() => {
          console.log("Selected Insurance ID:", insuranceValue);
          showInnerModal();
        }}
      >
        ซื้อประกัน
      </Button>
      <Modal
        title="กรอกรายละเอียดสำหรับซื้อประกัน"
        visible={isInnerModalVisible}
        onCancel={closeInnerModal}
        footer={null}
      >
        <Form form={form} onFinish={onFinish}>
          <Item label="ชื่อ" name="Firstname" rules={[{ required: true, message: 'โปรดระบุชื่อ' },{
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
          
            <Item label="นามสกุล" name="Lastname" rules={[{ required: true, message: 'โปรดระบุนามสกุล!' },
            {validator: (_, value) => {
                
                const hasNumber = /[\d\u0E50-\u0E59]/;
                const hasSpecialChar =/[^a-zA-Z0-9\s\u0E00-\u0E7F]/;
                if (value && hasNumber.test(value)) {
                  return Promise.reject(new Error('นามสกุลไม่ควรมีตัวเลข!'));
                }if (value && hasSpecialChar.test(value)) {
                  return Promise.reject(new Error('นามสกุลไม่ควรมีอักขระพิเศษ!'));
                }
                return Promise.resolve();
              },
            },]}>
              <Input />
            </Item>

            <Item label="เบอร์โทรศัพท์" name="PhoneNumber" rules={[{ required: true, message: 'Please input your phone number!' },{
            validator: (_, value) => {
              const phoneRegex = /^[0-9]{10}$/;

              if (value) {
                if (!phoneRegex.test(value)) {
                  return Promise.reject(new Error('เบอร์โทรศัพท์ต้องมี 10 หลัก และ ไม่มีตัวอักขระใดๆ'));
                }
              }
              return Promise.resolve();
            },
            },]}>
              <Input />
            </Item>

            <Item label="เลขบัตรประชาชน" name="IdCardNumber" rules={[{ required: true, message: 'Please input your phone number!' },{
            validator: (_, value) => {
              const phoneRegex = /^[0-9]{13}$/;
            
              if (value) {
                if (!phoneRegex.test(value)) {
                  return Promise.reject(new Error('เลขบัตรประจำตัวประชาชนต้องมี 13 หลัก และ ไม่มีตัวอักขระใดๆ'));
                }
              }
              return Promise.resolve();
            },
            },]}>
              <Input />
            </Item>

            <Item label="อายุ" name="Age" rules={[{ required: true, message: 'Please input your age' }]}>
            <InputNumber
                min={20}
                max={100}
                value={age}
                onChange={(value) => setAge(value || 20)} // Update the amount state
                style={{ width: '100%' }}
              />
            </Item>
            <Item
            label="จำนวนคนที่ทำประกันทั้งหมด(รวมตัวคุณเอง)"
            name="Amount"
            rules={[{ required: true, message: "Please select the amount!" }]}
            >
            <InputNumber
              min={1}
              max={100}
              value={amount}
              onChange={(value) => setAmount(value || 1)}
            />
            </Item>

            <Item label="รายละเอียดผู้ทำประกันร่วม" name="Detail" rules={[{ required: true, message: 'Please input your participant details!' }]}>
              <TextArea />
            </Item>
            <p style={{ color: 'red', fontWeight: 'bold' }}>ข้อมูลที่จำเป็น: ชื่อ นามสกุล เลขบัตรประจำตัวประชาชน</p>
          <Item label="ราคารวม">
            <span>{amount * pricePerUnit}</span>
          </Item>
          <p style={{ color: 'red', fontWeight: 'bold' }}>โปรดเช็ครายละเอียดผู้ทำประกันร่วมให้ดี กรอกข้อมูลที่จำเป็นให้ครบ ไม่เช่นนั้น หากบริษัทประกันไม่รับเรื่อง ทางเราจะไม่รับผิดชอบใดๆทั้งสิ้น แต่ลูกทัวร์จะยังได้เงินส่วนของประกันคืน</p>
          <Row gutter={16}>
            <Col span={12}>
              <Button type="primary" htmlType="submit" block>
                Submit
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}

export default InsurCreate;
