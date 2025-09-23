import { useEffect } from "react";
import { Table, Button, Tag, Popconfirm } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { formatDateToDDMMYYYY } from "../../utils/formatDate";
import { useAppDispatch } from "../../redux/hooks";
import {
  fetchDriverPickups,
  markPickupCompleted,
  updatePickupCompletnStatus,
} from "../../redux/slices/driver/pickupDriverSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAxiosErrorMessage } from "../../utils/handleAxiosError";
import { PickupPlansResp } from "../../types/pickupReq/pickupTypes";

const AllotedPickups = () => {
  const driverCategory = localStorage.getItem("driver_category") || "Residential";

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { error, pickups } = useSelector(
    (state: RootState) => state.driverPickups
  );

  console.log("category", driverCategory);

  useEffect(() => {
    dispatch(fetchDriverPickups({wasteType: driverCategory}));
  }, [driverCategory, dispatch]);
  console.log("pickups", pickups);

  const handleMarkAsCompleted = async (pickupReqId: string) => {
    try {
      const res = await dispatch(markPickupCompleted(pickupReqId)).unwrap();
      toast.success(res?.message);
      dispatch(updatePickupCompletnStatus(res?.pickupStatus))
    } catch (err) {
      toast.error(getAxiosErrorMessage(err));
    }
  };

  const filteredPickups = pickups?.filter(
    (item: PickupPlansResp) =>
      item.wasteType === driverCategory && item.payment?.refundRequested === false
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Allotted Pickups</h2>
      <div className="flex gap-2">
        {driverCategory && (
          <span className="px-4 py-2 rounded-md border font-medium bg-green-600 text-white border-green-600">
            {driverCategory}
          </span>
        )}
      </div>

      {error ? (
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
            <Table.Column title="User Name" dataIndex="userName" />
            <Table.Column
              title="Address"
              dataIndex="userAddress"
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
              render={(_, record: PickupPlansResp) => {
                const date =
                  record.rescheduledPickupDate || record.originalPickupDate;
                return formatDateToDDMMYYYY(date);
              }}
            />
            <Table.Column title="Time" dataIndex="pickupTime" />
            {driverCategory === "Commercial" && (
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
              render={(_, record: PickupPlansResp) => (
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
