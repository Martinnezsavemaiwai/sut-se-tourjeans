import { useState,useEffect } from "react";
import Navbar from "../../components/Navbar-Management/Navbar";
import "./insurance.css"
import { GetInsuranceParticipants,  DeleteInsuranceParticipant, } from "../../services/http";
import { InsuranceParticipantsInterface,} from "../../interfaces/IInsuranceParticipants";
import {  Card,  Col,  Row, Table,  notification, Button, Popconfirm, Modal} from "antd";
import {
  DeleteOutlined,
  MoreOutlined,
} from '@ant-design/icons';

function Insurance(){
    const [participants, setParticipants] = useState<InsuranceParticipantsInterface[]>([]);
    const [selectedParticipant, setSelectedParticipant] = useState<InsuranceParticipantsInterface | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const getParticipants = async () => {
        const res = await GetInsuranceParticipants();
        if (res) {
            setParticipants(res);
        }
    }

    const deleteParticipant = async (id: number) => {
      try {
          const res = await DeleteInsuranceParticipant(id);
          if (res) {
              notification.success({
                  message: "ลบผู้ทำประกันสำเร็จ",
                  placement: "top",
                  duration: 2,
              });
              // Refresh participants after deletion
              getParticipants();
              setTimeout(() => {
                location.href = "/insurance";
              }, 1800);
          }
      } catch (error) {
          notification.error({
              message: "เกิดข้อผิดพลาดในการลบผู้ทำประกัน",
              placement: "top",
              duration: 2,
          });
      }
  };

    useEffect(() => {
        getParticipants();
    }, []);

    const showModal = (participant: InsuranceParticipantsInterface) => {
            setSelectedParticipant(participant);
            setIsModalVisible(true);
          };

    const handleCancel = () => {
      setIsModalVisible(false);
      setSelectedParticipant(null);
    };

    useEffect(() => {
      console.log("Updated selectedParticipant:", selectedParticipant);
      console.log("PurchaseDetail:", selectedParticipant?.PurchaseDetail);
      console.log("TravelInsurance:", selectedParticipant?.PurchaseDetail?.TravelInsurance);
    }, [selectedParticipant]);

    const columns = [
        {
          title: <span className="custom-header">เลขบัตรประชาชน</span>,
          dataIndex: "IdCardNumber",
          className: 'custom-column-class', 
        },
        {
          title: <span className="custom-header">ชื่อ</span>,
          dataIndex: "FirstName",
          className: 'custom-column-class', 
        },
        {
          title: <span className="custom-header">นามสกุล</span>,
          dataIndex: "LastName",
          className: 'custom-column-class',
        },
        {
          title: <span className="custom-header">อายุ</span>,
          dataIndex: "Age",
          className: 'custom-column-class', 
        },
        {
          title: <span className="custom-header">จำนวนคนที่ทำประกัน</span>,
          dataIndex: "Quantity",
          className: 'custom-column-class', 
        },
        {
          title: <span className="custom-header">ชื่อประกัน</span>,
          dataIndex: "InsuranceName",
          className: 'custom-column-class', 
        },
        {
          title: <span className="custom-header">ราคาประกัน</span>,
          dataIndex: "InsurancePrice",
          className: 'custom-column-class', 
        },
        {
          title: <span className="custom-header">ราคาทั้งหมดที่ผู้ทำต้องจ่าย</span>,
          dataIndex: "TotalPrice",
          className: 'custom-column-class', 
        },
        {
          title: <span className="custom-header">จัดการ</span>,
          dataIndex: "action",
          className: 'custom-column-class',
          render: (_: any, record: any) => (
            <div>
                <Button
                  type="default"
                  icon={<MoreOutlined />}
                  onClick={() => showModal(record)} // Show the modal when clicked
                />

                <Popconfirm
                  title="คุณต้องการลบผู้ทำประกันนี้หรือไม่?"
                  onConfirm={() => deleteParticipant(record.key)}
                  okText="ใช่"
                  cancelText="ไม่"
                >
                  <Button type="default" danger icon={<DeleteOutlined />} style={{ marginRight: '10px' }} />
                </Popconfirm>

                
            </div>
          ),
      },
      ];

      const dataSource = participants.map(inpar => ({
        key: inpar.ID, 
        IdCardNumber: inpar.IdCardNumber, 
        FirstName: inpar.FirstName,
        LastName: inpar.LastName,
        Age: inpar.Age,
        Quantity: inpar.PurchaseDetail?.Quantity,
        InsuranceName: inpar.PurchaseDetail?.TravelInsurance?.InsuranceName,
        InsurancePrice: inpar.PurchaseDetail?.TravelInsurance?.Price,
        TotalPrice: inpar.PurchaseDetail?.TotalPrice,
        Detail: inpar.Detail,
        PurchaseDetailID: inpar.PurchaseDetail?.ID,
      }));

    return(
    
        <div className="insurance">
            <Navbar page="insurance" />
            <div className="insurance-page">
            <div className="text-4xl font-semibold text-left mt-10 ml-3">
                <h1 className="text-black">จัดการประกัน</h1>
            </div>
            <div className="table-content-management bg-customSkyYellow p-6">
            <Row gutter={[24, 0]}
                  justify="center"
            >
            <Col span={24} >
            <Card bordered={false} className="insurance-card bg-customSkyYellow p-6">
              <div className="insurance-table">
              <Table className="insurance-table-content"
                    columns={columns}
                    dataSource={dataSource}
                    pagination={{
                      pageSize: 5, // Maximum rows per page
                      showSizeChanger: false, 
                    }}
                    size="large"
                    bordered={true}
                    style={{ width: '100%' }}
                  />
              </div>
            </Card>
          </Col>
          </Row>
            </div>
            </div>
            <Modal
        title="รายละเอียดผู้ทำประกัน"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        
        {selectedParticipant && (
          <div>
            <p><strong>เลขบัตรประชาชน:</strong> {selectedParticipant.IdCardNumber}</p>
            <p><strong>ชื่อ:</strong> {selectedParticipant.FirstName}</p>
            <p><strong>นามสกุล:</strong> {selectedParticipant.LastName}</p>
            <p><strong>อายุ:</strong> {selectedParticipant.Age}</p>
            <p><strong>รายละเอียด:</strong> {selectedParticipant.Detail}</p>
          </div>
          
        )}
        
        </Modal>
        </div>
    );
}

export default Insurance