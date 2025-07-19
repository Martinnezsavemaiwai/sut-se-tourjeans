import { useState,useEffect } from "react";
import {  Card,  Col,  Row,  Typography, Button,  Table, notification, Popconfirm} from "antd";
import {
    DollarCircleOutlined,
    ProfileOutlined,
    DeleteOutlined,
    ShoppingCartOutlined,
    TransactionOutlined,
  } from '@ant-design/icons';

import { GetBookings,GetSalesReports, GetPurchaseDetails, DeleteSalesReport} from "../../services/http";
import { PieChart, Pie, Legend,  Cell, ResponsiveContainer } from 'recharts';
import "./dashboard.css"
import { BookingsInterface } from "../../interfaces/IBookings";
import { SalesReportsInterface } from "../../interfaces/ISalesReports";
import SalesReport from "./SalesReport/SalesReport";
import { PurchaseDetailsInterface } from "../../interfaces/IPurchaseDetails";


function Dashboard(){
    const [bookings, setBookings] = useState<BookingsInterface[]>([]);
    
    const [purchase, setPurchases] = useState<PurchaseDetailsInterface[]>([]);
    const [sales, setSales] = useState<SalesReportsInterface[]>([]);
    const { Title } = Typography;
    
    const getSales = async () => {
        const res = await GetSalesReports();
        if(res) {
          setSales(res);
        }
    }

    const getBookings = async () => {
        const res = await GetBookings();
        if (res) {
            setBookings(res);
        }
    }

    const getPurchaseDetails = async () => {
      const res = await GetPurchaseDetails();
      if (res){
        setPurchases(res)
      }
  }
  const deleteSalesReport = async (id: number) => {
    try {
        const res = await DeleteSalesReport(id);
        if (res) {
            notification.success({
                message: " ลบรายงานสำเร็จ ",
                placement: "top",
                duration: 2,
            });
            
            getSales();
            setTimeout(() => {
              location.href = "/dashboard";
            }, 1800);
        }
    } catch (error) {
        notification.error({
            message: "เกิดข้อผิดพลาดในการลบผู้ทำประกัน",
            placement: "top",
            duration: 2,
        });
    }
  }
    
    useEffect(() => {
        getBookings();
        getSales();
        getPurchaseDetails();
    }, []);

    const columns = [
        {
          title: "แพ็คเกจทัวร์",
          dataIndex: "TourName", 
        },
        {
          title: "ราคา",
          dataIndex: "TotalPrice", 
        },
        {
          title: "จำนวนคน",
          dataIndex: "Quantity", 
        },
      ];

      const salescolumns = [
        {
          title: "ชื่อรายงาน",
          dataIndex: "ReportName", 
        },
        {
          title: "จำนวนคนสั่งจองในเดือนทั้งหมด",
          dataIndex: "Total_sales", 
        },
        {
          title: "จำนวนเงินที่ได้จากเดือนทั้งหมด",
          dataIndex: "Total_revenue", 
        },
        {
          title: <span className="custom-header">จัดการ</span>,
          dataIndex: "action",
          className: 'custom-column-class',
          render: (_: any, record: any) => (
            <div>

                <Popconfirm
                  title="คุณต้องการลบรายงานนี้หรือไม่?"
                  onConfirm={() => deleteSalesReport(record.key)}
                  okText="ใช่"
                  cancelText="ไม่"
                >
                  <Button type="default" danger icon={<DeleteOutlined />} style={{ marginRight: '10px' }} />
                </Popconfirm>

                
            </div>
          ),
        },
      ];
      
      const SalesdataSource = sales.map(sale => ({
        key: sale.ID, 
        ReportName: sale.ReportName, 
        Total_sales: sale.Total_sales,
        Total_revenue: sale.Total_revenue,
      }));
      
      const InsurPrice = purchase.reduce((sum, insur) => sum + (insur.TotalPrice ?? 0), 0);;
      const Allincome = sales.reduce((sum, sale) => sum + (sale.Total_revenue ?? 0), 0);
      const Allsales = sales.reduce((sum, sale) => sum + (sale.Total_sales ?? 0), 0);
      const TourPrice = Allincome - InsurPrice;
      const Realincome = TourPrice * 0.2;
      const dataSource = bookings.map(details => ({
        key: details.ID, 
        TourName: details.TourSchedule?.TourPackage?.TourName, 
        TotalPrice: details.TotalPrice,
        Quantity: details.TotalQuantity,
      }));

    const count = [
        {  
          style: "icon-box1",
          today: "จำนวนเงินที่ได้รับทั้งหมด",
          title: Allincome,
          icon: TransactionOutlined,
          bnb: "bnb2",
        },
        {
          style: "icon-box2",
          today: "ค่าใช้จ่ายสำหรับทัวร์ทั้งหมด",
          title: TourPrice,
          icon: ProfileOutlined,
          bnb: "bnb2",
        },
        {
          style: "icon-box3",
          today: "รายได้จากการทำทัวร์",
          title: Realincome,
          icon: DollarCircleOutlined,
          bnb: "redtext",
        },
        {
          style: "icon-box4",
          today: "จำนวนการสั่งจองทัวร์ทั้งหมด",
          title: Allsales,
          icon: ShoppingCartOutlined,
          bnb: "bnb2",
        },
      ];

    
    const PieChartComponent: React.FC = () => {
      const tourPackageCounts: { [key: string]: number } = {};

      bookings.forEach((booking) => {
            const tourName = booking.TourSchedule?.TourPackage?.TourName;
        if (tourName) {
            tourPackageCounts[tourName] = (tourPackageCounts[tourName] || 0) + 1;
        }
        });

        const data = Object.keys(tourPackageCounts).map((tourName) => ({
          name: tourName,
          value: tourPackageCounts[tourName],
          }));
        // Define color palette
        const COLORS = [
          '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF4560', '#7758FF', '#1F77B4', '#FF7F0E', '#2CA02C', '#D62728',
          '#9467BD', '#8C564B', '#E377C2', '#7F7F7F', '#BCBD22', '#17BECF', '#F7B7A3', '#FFDDC1', '#D9E7FD', '#F5C8F7',
          '#F2E5D9', '#D4D2FF', '#F9D8D1', '#B0E0E6', '#E6E6FA', '#F0FFF0', '#FFF0F5', '#FFE4E1', '#F0F8FF', '#FAEBD7',
          '#F5FFFA', '#F0E68C', '#E6E6FA', '#B0E0E6', '#FFEFD5', '#FFDEAD', '#F5F5DC', '#FFFACD', '#F0FFFF', '#B22222',
          '#D2691E', '#DC143C', '#FF7F50', '#FF6347', '#FF4500', '#FF1493', '#FF69B4', '#FFB6C1', '#FF0000', '#FF8C00',
          '#FFD700', '#ADFF2F', '#7FFF00', '#32CD32', '#98FB98', '#8FBC8F', '#228B22', '#006400', '#008000', '#00FF00',
          '#90EE90', '#32CD32', '#006400', '#2E8B57', '#8A2BE2', '#A52A2A', '#5F9EA0', '#7FFF00', '#D2691E', '#FF7F50',
          '#FF6347', '#FF4500', '#00CED1', '#40E0D0', '#48D1CC', '#1E90FF', '#6495ED', '#4169E1', '#8A2BE2', '#A52A2A',
          '#DEB887', '#D3D3D3', '#C71585', '#F4A460', '#FFD700', '#8B4513', '#E0FFFF', '#87CEFA', '#B0E0E6', '#AFEEEE',
          '#F0E68C', '#D3D3D3', '#00BFFF', '#ADD8E6', '#4682B4', '#7B68EE', '#663399', '#8B008B', '#8B0000', '#CD5C5C',
          '#C71585', '#FF4500', '#FF6347', '#6A5ACD', '#2F4F4F', '#9ACD32', '#32CD32', '#3CB371', '#228B22', '#00FF7F',
          '#20B2AA', '#008B8B', '#7FFF00', '#32CD32', '#00FA9A', '#9ACD32', '#ADFF2F', '#98FB98', '#7CFC00', '#00FF00'
        ];        
    
        const RADIAN = Math.PI / 180;
    
        // Define the type for the label rendering function parameters
        interface RenderCustomizedLabelProps {
            cx: number;
            cy: number;
            midAngle: number;
            innerRadius: number;
            outerRadius: number;
            percent: number;
            index: number;
        }
    
        // Custom label renderer function
        const renderCustomizedLabel = ({
            cx,
            cy,
            midAngle,
            innerRadius,
            outerRadius,
            percent,
            
        }: RenderCustomizedLabelProps) => {
            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
            return (
                <text
                    x={x}
                    y={y}
                    fill="white"
                    textAnchor={x > cx ? 'start' : 'end'}
                    dominantBaseline="central"
                >
                    {`${(percent * 100).toFixed(0)}%`}
                </text>
            );
        };
        
       
        return (
            <div>
                <div className="row d-flex justify-content-center text-center">
                <Title level={5}>จำนวนทัวร์ที่สั่งบ่อยที่สุด</Title>
                    <div className="col-md-8">
                        <ResponsiveContainer width={400} height={400} className="text-center">
                            <PieChart width={400} height={400}>
                                <Legend layout="vertical" verticalAlign="top" />
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {data.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        );
    }; 
    
    return(
        <div className="dashboard" >
          <div className="dashboard-page">
            <div className="table-content-management bg-customSkyYellow p-6">
            <Row className="rowgap-vbox" gutter={[24, 0]}>
              {count.map((c , index: number) => (
                <Col
                  key={index}
                  xs={24}
                  sm={24}
                  md={12}
                  lg={6}
                  xl={6}
                  className="mb-24"
                >
                  <Card bordered={false} className="criclebox ">
                    <div className="number">
                      <Row align="middle" gutter={[24, 0]}>
                        <Col xs={18}>
                          <span>{c.today}</span>
                          <Title level={3}>
                            {Number(c.title).toLocaleString()}
                          </Title>
                        </Col>
                        <Col xs={6}>
                          <div className={c.style}><c.icon/></div>
                        </Col>
                      </Row>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>

          <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={16} className="mb-24">
            <Card bordered={false} className="dashboard-card-book">
              <div className="project-ant">
                <div>
                  <Title level={5}>รายการสั่งจองล่าสุด</Title>
                </div>
              </div>
              <div className="ant-list-box table-responsive">
              <Table className="dashboard-book-table-content"
                    columns={columns}
                    dataSource={dataSource}
                    pagination={{
                      pageSize: 5, // Maximum rows per page
                      showSizeChanger: false,
                    }}
                    bordered={true}
                  />
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={8} className="mb-24">
            <Card bordered={true} className="dashboard-card-pie">
            <PieChartComponent />
            </Card>
            </Col>
          </Row>

          <Row gutter={[24, 0]}
          justify="center">
          <Col xs={24} sm={24} md={12} lg={12} xl={16} className="mb-24">
            <Card bordered={false} className="dashboard-card-sale">
              <div className="project-ant">
                <div>
                  <Title level={5}>รายงานประจำเดือน</Title>
                </div>
              </div>
              <div className="ant-list-box table-responsive">
              <Table className="dashboard-sales-table-content"
                    columns={salescolumns}
                    dataSource={SalesdataSource}
                    pagination={{
                      pageSize: 5, // Maximum rows per page
                      showSizeChanger: false,
                    }}
                    bordered={true}
                  />
              <SalesReport />
              </div>
            </Card>
          </Col>
          </Row>
            </div>
          </div>
        </div>
    );
}

export default Dashboard;