// InsurSelect Component
import { useState, useEffect } from "react";
import { Button, Modal, Card, Col, Row } from "antd";
import { TravelInsurancesInterface } from '../../interfaces/ITravelInsurances';
import { apiUrl, GetTravelInsurances } from '../../services/http';
import InsurCreate from "./Create/InsurCreate";

function InsurSelect() {
  const [travelinsurances, setTravelinsurances] = useState<TravelInsurancesInterface[]>([]);

  const getTravelInsurances = async () => {
    const res = await GetTravelInsurances();
    if (res) {
      setTravelinsurances(res);
    }
  };

  

  useEffect(() => {
    getTravelInsurances();
    
  }, []);
  const [isInnerModalVisible, setInnerModalVisible] = useState(false);
  const showInnerModal = () => setInnerModalVisible(true);
  const closeInnerModal = () => setInnerModalVisible(false);


  
  const insurancelist = travelinsurances.map(insur => ({
        key: insur.ID,
        logo: insur.Provider?.LogoPath,
        name: insur.InsuranceName,
        detail: insur.CoverageDetail,
        price: insur.Price,
  }))

  return (
    <>
      <Button className="buy-insurance-btn" type="primary" onClick={showInnerModal}>
        ซื้อประกันการเดินทาง
      </Button>
      <Modal
        title="เลือกซื้อประกัน"
        visible={isInnerModalVisible}
        onCancel={closeInnerModal}
        footer={null}
        width={1000}
      >
        <Row gutter={16}>
      {insurancelist.map((insur, index) => (
        <Col span={6} key={index}>
          <Card title={insur.name} bordered={false} style={{ width: '100%' }}>
            <img
              src={`${apiUrl}/${insur.logo}`}
              alt="Provider Logo"
              style={{ width: '50px', height: '50px', objectFit: 'contain' }}
            />
            <p>{insur.detail}</p>
            <p>ราคา: {insur.price} บาท</p>
            <InsurCreate insuranceValue={index+1}/>
          </Card>
        </Col>
      ))}
      </Row>
      </Modal>
    </>
  );
}

export default InsurSelect;
