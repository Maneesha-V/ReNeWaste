import { useEffect, useState } from "react";
import { Table, Button, Spin, Tag, Popconfirm } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { formatDateToDDMMYYYY } from "../../utils/formatDate";
import { useAppDispatch } from "../../redux/hooks";
import {
  fetchDriverPickups,
  markPickupCompleted,
} from "../../redux/slices/driver/pickupDriverSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AllotedPickups = () => {
  const driverCategory = localStorage.getItem("driver_category");
  const [activeTab, setActiveTab] = useState<"Residential" | "Commercial">(
   driverCategory === "Commercial" ? "Commercial" : "Residential"
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, pickups } = useSelector(
    (state: RootState) => state.driverPickups
  );
  const token = localStorage.getItem("driver_token");
  
  console.log("category", driverCategory);

  useEffect(() => {
    if (!token) return;
    dispatch(fetchDriverPickups({ wasteType: activeTab }));
  }, [activeTab, dispatch, token]);
  console.log("pickups", pickups);

  const handleMarkAsCompleted = async (pickupReqId: string) => {
    try {
      await dispatch(markPickupCompleted(pickupReqId)).unwrap();
      toast.success("Marked as completed");
      dispatch(fetchDriverPickups({ wasteType: activeTab }));
    } catch (err: any) {
      toast.error(err || "Failed to mark as completed");
    }
  };

  const filteredPickups = pickups?.filter(
    (item: any) => item.wasteType === activeTab && item.payment?.refundRequested === false
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Allotted Pickups</h2>

      {/* Waste Type Toggle */}
      <div className="flex gap-2">

        {driverCategory === "Residential" && (
          <button
            className={`px-4 py-2 rounded-md border font-medium transition ${
              activeTab === "Residential"
                ? "bg-green-600 text-white border-green-600"
                : "bg-white text-green-600 border-green-600 hover:bg-green-100"
            }`}
            onClick={() => setActiveTab("Residential")}
          >
            Residential
          </button>
        )}
 {driverCategory === "Commercial" && (
    <button
      className={`px-4 py-2 rounded-md border font-medium transition ${
        activeTab === "Commercial"
          ? "bg-green-600 text-white border-green-600"
          : "bg-white text-green-600 border-green-600 hover:bg-green-100"
      }`}
      onClick={() => setActiveTab("Commercial")}
    >
      Commercial
    </button>
  )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Spin />
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <Table
            dataSource={filteredPickups}
            rowKey="_id"
            bordered
            pagination={{ pageSize: 8 }}
          >
            <Table.Column title="Pickup ID" dataIndex="pickupId" />
            <Table.Column title="User Name" dataIndex="userFullName" />
            <Table.Column
              title="Address"
              dataIndex="selectedAddress"
              key="address"
              render={(address) => (
                <>
                  <div>{address?.addressLine1}</div>
                  <div>{address?.addressLine2}</div>
                  <div>
                    {address?.location}, {address?.taluk}
                  </div>
                  <div>
                    {address?.district}, {address?.state} - {address?.pincode}
                  </div>
                </>
              )}
            />
            <Table.Column
              title="Pickup Date"
              dataIndex="originalPickupDate"
              render={(text: string, record: any) => {
                const date =
                  record.rescheduledPickupDate || record.originalPickupDate;
                return formatDateToDDMMYYYY(date);
              }}
            />
            <Table.Column title="Time" dataIndex="pickupTime" />
            {activeTab === "Commercial" && (
              <>
                <Table.Column title="Business Name" dataIndex="businessName" />
                <Table.Column title="Service" dataIndex="service" />
              </>
            )}
            <Table.Column
              title="Status"
              dataIndex="status"
              render={(status: string) => (
                <Tag
                  color={
                    status === "Scheduled"
                      ? "green"
                      : status === "Completed"
                      ? "blue"
                      : "orange"
                  }
                >
                  {status}
                </Tag>
              )}
            />
            <Table.Column
              title="Actions"
              render={(_: any, record: any) => (
                <div className="flex gap-2">
                  <Button
                    type="default"
                    onClick={() =>
                      navigate(`/driver/track-pickup/${record._id}`)
                    }
                  >
                    Go
                  </Button>
                  {record.status !== "Completed" && (
                    <Popconfirm
                      title="Are you sure you want to mark this pickup as completed?"
                      onConfirm={() => handleMarkAsCompleted(record._id)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button type="primary">Mark as Completed</Button>
                    </Popconfirm>
                  )}
                </div>
              )}
            />
          </Table>
        </div>
      )}
    </div>
  );
};

export default AllotedPickups;
