import { useEffect, useState } from "react";
import { Table, Button, Spin, Tag, Popconfirm } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  cancelPickupReq,
  fetchPickupReqsts,
} from "../../redux/slices/wastePlant/wastePlantPickupSlice";
import { useAppDispatch } from "../../redux/hooks";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { formatDateToDDMMYYYY } from "../../utils/formatDate";
import AssignDriverModal from "../../components/wastePlant/AssignDriverModal";
import ReschedulePickupModal from "../../components/wastePlant/ReschedulePickupModal";
import { PickupRequest } from "../../types/wastePlantTypes";


const Pickups = () => {
  const [activeTab, setActiveTab] = useState<"Residential" | "Commercial">(
    "Residential"
  );
  const [statusTab, setStatusTab] = useState<
    "Pending" | "Scheduled" | "Completed" | "Cancelled"| "Rescheduled"
  >("Pending");
  const [selectedPickup, setSelectedPickup] = useState<any | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [rescheduleModalVisible, setRescheduleModalVisible] = useState(false);
  const [pickupToReschedule, setPickupToReschedule] = useState<any | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useSelector(
    (state: RootState) => state.wastePlantPickup
  );
  const rawPickups = useSelector((state: RootState) => state.wastePlantPickup.pickups);
  const pickups = Array.isArray(rawPickups) ? rawPickups : rawPickups ? [rawPickups] : [];
  const token = sessionStorage.getItem("wasteplant_token");

  useEffect(() => {
    if (!token) {
      navigate("/waste-plant/");
      return;
    }
    dispatch(fetchPickupReqsts({ wasteType: activeTab, status: statusTab }));
  }, [dispatch, token, activeTab, statusTab]);

  console.log("pickups", pickups);

  const handleCancel = async (pickupReqId: string) => {
    try {
      await dispatch(
        cancelPickupReq({ pickupReqId, status: "Cancelled" })
      ).unwrap();
      await dispatch(
        fetchPickupReqsts({ wasteType: activeTab, status: statusTab })
      );
    } catch (error: any) {
      console.error("Cancel failed:", error);
    }
  };
  const handleReschedule = async (pickup: PickupRequest) => {
    setPickupToReschedule(pickup);
    setRescheduleModalVisible(true);
  };
  const filteredData = pickups.filter(
    (item: PickupRequest) => item.wasteType === activeTab
  );

  return (
    <div className="space-y-4">
      {/* Breadcrumbs and Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          {/* <Breadcrumbs
            paths={[
              // {
              //   label: "Scheduled Pickups",
              //   path: "/waste-plant/scheduled-pickups",
              // },
              { label: "Pickups" },
            ]}
          /> */}
          <h1 className="text-xl font-bold text-gray-800">Pickup Requests</h1>
        </div>
      </div>

      {/* Waste Type Tabs */}
      <div className="flex gap-2">
        <button
          className={`px-4 py-2 rounded-md font-medium border transition ${
            activeTab === "Residential"
              ? "bg-green-600 text-white border-green-600"
              : "bg-white text-green-600 border-green-600 hover:bg-green-50"
          }`}
          onClick={() => setActiveTab("Residential")}
        >
          Residential
        </button>
        <button
          className={`px-4 py-2 rounded-md font-medium border transition ${
            activeTab === "Commercial"
              ? "bg-green-600 text-white border-green-600"
              : "bg-white text-green-600 border-green-600 hover:bg-green-50"
          }`}
          onClick={() => setActiveTab("Commercial")}
        >
          Commercial
        </button>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2">
        {["Pending", "Scheduled", "Completed", "Cancelled","Rescheduled"].map((status) => (
          <button
            key={status}
            className={`px-4 py-2 rounded-md font-medium border transition ${
              statusTab === status
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-blue-600 border-blue-600 hover:bg-blue-50"
            }`}
            onClick={() =>
              setStatusTab(
                status as "Pending" | "Scheduled" | "Completed" | "Cancelled" | "Rescheduled"
              )
            }
          >
            {status}
          </button>
        ))}
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
              title="Pickup ID"
              dataIndex="pickupId"
              key="pickupId"
            />
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
              render={(text: string,record: any) => {
                const dateToDisplay = record.rescheduledDate || record.originalPickupDate;
                return formatDateToDDMMYYYY(dateToDisplay);
              }}
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
            {statusTab === "Scheduled" && (
              <>
                <Table.Column
                  title="Assigned Driver"
                  dataIndex="driverName"
                  key="driverName"
                />
                <Table.Column
                  title="Assigned Zone"
                  dataIndex="assignedZone"
                  key="assignedZone"
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
                       : status === "Rescheduled"
                      ? "blue"
                      : "red"
                  }
                >
                  {status}
                </Tag>
              )}
            />
            {(statusTab === "Pending" || statusTab === "Scheduled") && (
              <Table.Column
                title="Action"
                key="action"
                render={(_: any, record: PickupRequest) => {
                  if (record.status === "Pending") {
                    return (
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
                          onConfirm={() => handleCancel(record._id)}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button danger size="small" icon={<CloseOutlined />}>
                            Cancel
                          </Button>
                        </Popconfirm>
                      </div>
                    );
                  } else if (record.status === "Scheduled") {
                    return (
                      <Popconfirm
                        title="Are you sure to reschedule this request?"
                        onConfirm={() => handleReschedule(record)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button type="dashed" size="small">
                          Reschedule
                        </Button>
                      </Popconfirm>
                    );
                  }
                  return null;
                }}
              />
            )}
          </Table>
        </div>
      )}
      <AssignDriverModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        pickup={selectedPickup}
        onSuccess={() =>
          dispatch(
            fetchPickupReqsts({ wasteType: activeTab, status: statusTab })
          )
        }
      />
      <ReschedulePickupModal
  visible={rescheduleModalVisible}
  onClose={() => setRescheduleModalVisible(false)}
  pickup={pickupToReschedule}
  onSubmit={() => {
    dispatch(fetchPickupReqsts({ wasteType: activeTab, status: statusTab }));
  }}
/>

    </div>
  );
};

export default Pickups;
