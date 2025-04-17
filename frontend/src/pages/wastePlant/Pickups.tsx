import { useEffect, useState } from "react";
import { Table, Button, Spin, Tag, Popconfirm } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import { fetchPickupReqsts } from "../../redux/slices/wastePlant/wastePlantPickupSlice";
import { useAppDispatch } from "../../redux/hooks";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { formatDateToDDMMYYYY } from "../../utils/formatDate";
import AssignDriverModal from "../../components/wastePlant/AssignDriverModal";

interface PickupRequest {
  _id: string;
  userId: string;
  userName: string;
  location: string;
  wasteType: "Residential" | "Commercial";
  originalPickupDate: string;
  pickupTime: string;
  status: "Pending" | "Scheduled" | "Cancelled";
}

const Pickups = () => {
  const [activeTab, setActiveTab] = useState<"Residential" | "Commercial">(
    "Residential"
  );
  const [selectedPickup, setSelectedPickup] = useState<any | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { pickups, loading, error } = useSelector(
    (state: RootState) => state.wastePlantPickup
  );
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/waste-plant/");
      return;
    }
    dispatch(fetchPickupReqsts(activeTab));
  }, [dispatch, token, activeTab]);

  console.log("pickups", pickups);

  const handleStatusUpdate = (id: string, action: "cancel") => {
    axios
      .patch(`/api/pickup-requests/${id}`, { status: "Cancelled" })
      .then(() => dispatch(fetchPickupReqsts(activeTab)))
      .catch(() => {});
  };

  const filteredData = pickups.filter(
    (item: PickupRequest) => item.wasteType === activeTab
  );

  return (
    <div className="space-y-4">
      {/* Breadcrumbs and Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <Breadcrumbs paths={[{ label: "Pickups" }]} />
          <h1 className="text-xl font-bold text-gray-800">Pickup Requests</h1>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-4">
        <button
          className={`px-4 py-2 rounded-md font-medium ${
            activeTab === "Residential"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => setActiveTab("Residential")}
        >
          Residential
        </button>
        <button
          className={`px-4 py-2 rounded-md font-medium ${
            activeTab === "Commercial"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => setActiveTab("Commercial")}
        >
          Commercial
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Spin size="large" />
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <Table
            dataSource={filteredData}
            rowKey="_id"
            bordered
            className="shadow-sm"
            pagination={{ pageSize: 10 }}
          >
            <Table.Column
              title="User Name"
              dataIndex="userName"
              key="userName"
            />
            <Table.Column
              title="Location"
              dataIndex="location"
              key="location"
            />
            <Table.Column
              title="Pickup Date"
              dataIndex="originalPickupDate"
              key="originalPickupDate"
              render={(date: string) => formatDateToDDMMYYYY(date)}
            />
            <Table.Column
              title="Time"
              dataIndex="pickupTime"
              key="pickupTime"
            />
            <Table.Column
              title="Waste Type"
              dataIndex="wasteType"
              key="wasteType"
            />
            {activeTab === "Commercial" && (
              <>
                <Table.Column
                  title="Business Name"
                  dataIndex="businessName"
                  key="businessName"
                />
                <Table.Column
                  title="Frequency"
                  dataIndex="frequency"
                  key="frequency"
                />
                <Table.Column
                  title="Service"
                  dataIndex="service"
                  key="service"
                />
              </>
            )}
            <Table.Column
              title="Status"
              dataIndex="status"
              key="status"
              render={(status: string) => (
                <Tag
                  color={
                    status === "Pending"
                      ? "orange"
                      : status === "Scheduled"
                      ? "green"
                      : "red"
                  }
                >
                  {status}
                </Tag>
              )}
            />
            <Table.Column
              title="Last Action"
              key="action"
              render={(_: any, record: PickupRequest) =>
                record.status === "Pending" ? (
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="primary"
                      size="small"
                      icon={<CheckOutlined />}
                      onClick={() => {
                        setSelectedPickup(record);
                        setModalVisible(true);
                      }}
                    >
                      Approve
                    </Button>
                    <Popconfirm
                      title="Are you sure you want to cancel this request?"
                      onConfirm={() => handleStatusUpdate(record._id, "cancel")}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button danger size="small" icon={<CloseOutlined />}>
                        Cancel
                      </Button>
                    </Popconfirm>
                  </div>
                ) : null
              }
            />
          </Table>
        </div>
      )}
      <AssignDriverModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        pickup={selectedPickup}
        onSuccess={() => dispatch(fetchPickupReqsts(activeTab))}
      />
    </div>
  );
};

export default Pickups;
