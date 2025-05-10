import { useEffect, useState } from "react";
import { Table, Button, Space, Modal, Typography, Select } from "antd";
import { useAppDispatch } from "../../redux/hooks";
import {assignTruckToDriver, fetchTruckRequests, fetchTrucksForDriver } from "../../redux/slices/wastePlant/wastePlantTruckSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const { Title } = Typography;
const { Option } = Select;

const AssignNewTruck = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [selectedDriverName, setSelectedDriverName] = useState<string | null>(null);
  const [selectedTruckId, setSelectedTruckId] = useState<string | null>(null);
  const [prevTruckId, setPrevTruckId] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const truckRequests = useSelector((state: RootState) => state.wastePlantTruck.truckRequests);
  const availableTrucks = useSelector((state: RootState) => state.wastePlantTruck.availableTrucks);

  useEffect(() => {
    dispatch(fetchTruckRequests());
  }, [dispatch]);

  const showAssignModal = (driverId: string, driverName: string, truckId: string) => {
    setSelectedDriverId(driverId);
    setSelectedDriverName(driverName);
    setPrevTruckId(truckId);
    setIsModalVisible(true);
    dispatch(fetchTrucksForDriver());
  };

  const handleAssign = () => {
    if (selectedDriverId && selectedTruckId && prevTruckId) {
      dispatch(assignTruckToDriver({
        driverId: selectedDriverId,
        truckId: selectedTruckId,
        prevTruckId
      }));
      setIsModalVisible(false);
      setSelectedTruckId(null);
      setSelectedDriverId(null);
      setSelectedDriverName(null);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedTruckId(null);
    setSelectedDriverId(null);
    setSelectedDriverName(null);
  };

  const columns = [
    {
      title: "Driver Name",
      dataIndex: ["assignedDriver", "name"],
      key: "driverName",
    },
    {
      title: "Driver Zone",
      dataIndex: ["assignedDriver", "assignedZone"],
      key: "assignedZone",
    },
    {
      title: "Current Truck Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <span style={{ color: status === "Pending" ? "#fa8c16" : "#52c41a" }}>
          {status}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="primary"
            onClick={() => showAssignModal(record.assignedDriver._id, record.assignedDriver.name, record._id)}
          >
            Assign
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Title level={3}>Drivers Needing Truck Assignment</Title>
      <Table
        columns={columns}
        dataSource={truckRequests}
        rowKey="_id"
        pagination={false}
        bordered
      />

      <Modal
        title={`Assign Truck to ${selectedDriverName}`}
        visible={isModalVisible}
        onOk={handleAssign}
        onCancel={handleCancel}
        okText="Assign"
        cancelText="Cancel"
      >
        
        <Select
          style={{ width: "100%" }}
          placeholder="Select a truck"
          onChange={(value) => setSelectedTruckId(value)}
          value={selectedTruckId || undefined}
        >
          {availableTrucks.map((truck: any) => (
            <Option key={truck._id} value={truck._id}>
              {truck.name}
            </Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
};

export default AssignNewTruck;
