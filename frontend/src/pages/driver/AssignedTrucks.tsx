import React, { useEffect } from 'react';
import { Table, Button, Typography, Card, Space, Empty } from 'antd';
import { useAppDispatch } from '../../redux/hooks';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { toast } from 'react-toastify';
import { fetchDriverTrucks, reqTruckByDriver } from '../../redux/slices/driver/truckDriverSlice';
import { fetchDriverProfile } from '../../redux/slices/driver/profileDriverSlice';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const AssignedTrucks: React.FC = () => {
const navigate = useNavigate();
const dispatch = useAppDispatch();
 const { driver } = useSelector((state: RootState) => state.driverProfile);
 const { trucks } = useSelector((state: RootState) => state.driverTrucks);
 const hasRequested  = useSelector((state: RootState) => state.driverTrucks.hasRequestedTruck);
 console.log("driver",driver);
 console.log("trucks",trucks);

 useEffect(() => {
  if (!driver) {
    dispatch(fetchDriverProfile());
  }
}, [dispatch]);

useEffect(() => {
  if (driver && driver._id) {
    dispatch(fetchDriverTrucks(driver._id));
  }
}, [dispatch, driver]);

const handleRequestTruck = () => {
  dispatch(reqTruckByDriver()) 
  .unwrap()
  .then(() => {
    toast.success('Truck request sent!');
  })
  .catch((err) => {
    toast.error(err.message || "Failed to send request");
  });
};

const columns = [
  {
    title: 'Truck Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Vehicle Number',
    dataIndex: 'vehicleNumber',
    key: 'vehicleNumber',
  },
  {
    title: 'Address',
    key: 'address',
    render: (_: any, record: any) => {
      const wp = record.wasteplantId;
      return wp
        ? `${wp.plantName}, ${wp.location}, ${wp.taluk}, ${wp.district}, ${wp.state} - ${wp.pincode}`
        : 'N/A';
    },
  },
    {
      title: 'Status',
      key: 'status',
      render: (_: any, record: any) => {
        if (record.status === 'Maintenance') {
          return (
            <Button type="primary" onClick={() => handleRequestTruck()}  disabled={hasRequested}>
            {/* <Button type="primary" onClick={() => navigate("/driver/chat")}> */}
            {hasRequested ? "Request Sent" : "Request Truck"}
            </Button>
          );
        }
        return <span style={{ color: 'green' }}>{record.status}</span>;
      },
    },

];
  return (
    <div className="w-full">
      <Title level={3} style={{ textAlign: 'center', marginBottom: '24px' }}>
        Assigned Trucks
      </Title>

      <Card bodyStyle={{ padding: '16px' }} bordered={false}>
        {trucks && trucks.length > 0 ? (
          <Table
          columns={columns}
          dataSource={trucks.map((truck: any, index: number) => ({
            ...truck,
            key: index.toString(),
          }))}
          pagination={false}
        />
        ) : (
          <Space
            direction="vertical"
            size="large"
            style={{ width: '100%', textAlign: 'center', marginTop: '40px' }}
          >
            <Empty
              description={<Text type="secondary">No trucks are assigned</Text>}
            />
          </Space>
        )}
      </Card>
    </div>
  );
};

export default AssignedTrucks;
