import React, { useEffect } from "react";
import { Table, Button, Popconfirm, Spin, Tooltip } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  PlusCircleOutlined,
  RedoOutlined,
  StopOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks";
import {
  deleteWastePlant,
  fetchWastePlants,
  sendRechargeNotification,
  sendRenewNotification,
  sendSubscribeNotification,
} from "../../redux/slices/superAdmin/superAdminWastePlantSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import { toast } from "react-toastify";

const WastePlants: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { wastePlant, loading, error } = useSelector(
    (state: RootState) => state.superAdminWastePlant
  );

  useEffect(() => {
    if (!sessionStorage.getItem("admin_token")) {
      navigate("/super-admin/");
      return;
    }
    dispatch(fetchWastePlants());
  }, [dispatch, navigate]);

  const handleEdit = async (id: string) => {
    try {
      navigate(`/super-admin/edit-waste-plant/${id}`);
    } catch (error) {
      console.error(error);
    }
  };
  const handleDelete = async (id: string) => {
    try {
      const response = await dispatch(deleteWastePlant(id)).unwrap();
      toast.success(response.message);
    } catch (error: any) {
      console.error("Delete failed:", error);
    }
  };
  const remindSubscribe = async (id: string) => {
    try {
      await dispatch(sendSubscribeNotification(id)).unwrap();
      toast.success("Renew notification sent successfully");
    } catch (error: any) {
      console.error("Failed to send renew notification:", error);
      toast.error(error || "Failed to send renew notification");
    }
  };

  const remindRenew = async (plantId: string, daysLeft: number) => {
    try {
      await dispatch(sendRenewNotification({plantId, daysLeft})).unwrap();
      toast.success("Renew notification sent successfully");
    } catch (error) {
      console.error("Failed to send renew notification:", error);
      toast.error("Failed to send renew notification");
    }
  };

   const remindRecharge = async (plantId: string) => {
    try {
      await dispatch(sendRechargeNotification(plantId)).unwrap();
      toast.success("Renew notification sent successfully");
    } catch (error) {
      console.error("Failed to send renew notification:", error);
      toast.error("Failed to send renew notification");
    }
  };

  return (
    <div className="space-y-4">
      {/* Breadcrumbs and Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <Breadcrumbs paths={[{ label: "Waste Plants" }]} />
          <h1 className="text-xl font-bold text-gray-800">
            Waste Plants Management
          </h1>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/super-admin/add-waste-plant")}
          className="bg-green-600 hover:bg-green-700"
        >
          Create Waste Plant
        </Button>
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
            dataSource={Array.isArray(wastePlant) ? wastePlant : []}
            rowKey={(record) => record.plantData._id}
            bordered
            className="shadow-sm"
            pagination={{ pageSize: 10 }}
            rowClassName={(record: any) => {
              const daysLeft = record.latestSubscription?.daysLeft;
              if (
                daysLeft !== undefined &&
                daysLeft !== null &&
                daysLeft <= 2
              ) {
                return "blink-row";
              }
              return "";
            }}
          >
            <Table.Column
              title="Name"
              dataIndex={["plantData", "plantName"]}
              key="plantName"
            />
            <Table.Column
              title="Location"
              dataIndex={["plantData", "location"]}
              key="location"
            />
            <Table.Column
              title="Capacity (Kg/Day)"
              dataIndex={["plantData", "capacity"]}
              key="capacity"
            />
            <Table.Column
              title="Contact"
              dataIndex={["plantData", "contactNo"]}
              key="contactNo"
            />
            <Table.Column
              title="Subscription Plan"
              dataIndex={["plantData", "subscriptionPlan"]}
              key="subscriptionPlan"
            />
            <Table.Column
              title="Status"
              dataIndex="status"
              key="status"
              render={(_: any, record: any) => {
                const status = record.plantData.status;
                return (
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      status === "Active"
                        ? "bg-green-100 text-green-800"
                        : status === "Inactive"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {status}
                  </span>
                );
              }}
            />
            <Table.Column
              title="Reminder"
              key="reminder"
              render={(_: any, record: any) => {
                const status = record.plantData.status;
                const daysLeft = record.latestSubscription?.daysLeft ?? null;
                return (
                  <div className="flex flex-wrap gap-2">
                    {status === "Pending" && (
                      <Button
                        type="primary"
                        size="small"
                        icon={<PlusCircleOutlined />}
                        onClick={() => remindSubscribe(record.plantData._id)}
                      >
                        Subscribe
                      </Button>
                    )}
                    {status === "Active" &&
                      daysLeft !== null &&
                      daysLeft <= 2 && (
                        <Tooltip
                          title={`Subscription expires in ${daysLeft} day(s)`}
                        >
                          <Button
                            style={{
                              backgroundColor: "#FAAD14",
                              color: "#fff",
                              border: "none",
                            }}
                            size="small"
                            icon={<RedoOutlined />}
                            onClick={() => remindRenew(record.plantData._id, daysLeft)}
                          >
                            Renew
                          </Button>
                        </Tooltip>
                      )}
                    {status === "Inactive" && (
                      <Tooltip title="Send recharge reminder">
                        <Button
                          type="default"
                          size="small"
                          icon={<ReloadOutlined />}
                          danger
                          onClick={() => remindRecharge(record.plantData._id)}
                        >
                          Recharge
                        </Button>
                      </Tooltip>
                    )}
                  </div>
                );
              }}
            />
            {/* <Table.Column
              title="Reminder"
              key="reminder"
              render={(_: any, record: any) => (
                <div className="flex flex-wrap gap-2">
                <Tooltip title="Send subscription reminder">
                  {record.status === "Pending" && (
                    <Button
                      type="primary"
                      size="small"
                      icon={<PlusCircleOutlined />}
                      onClick={() => remindSubscribe(record._id)}
                    >
                      Subscribe
                    </Button>
                  )}

                  {record.status === "Inactive" && (
                    <Button
                      style={{
                        backgroundColor: "#FAAD14",
                        color: "#fff",
                        border: "none",
                      }}
                      size="small"
                      icon={<RedoOutlined />}
                      onClick={() => remindRenew(record._id)}
                    >
                      Renew
                    </Button>
                  )}

                  {record.status === "Active" && (
                  <Tooltip title="Send rejection reminder">
                    <Button
                      type="default"
                      size="small"
                      icon={<StopOutlined />}
                      danger
                      onClick={() => remindReject(record._id)}
                    >
                      Reject
                    </Button>
                    </Tooltip>
                  )}
                  </Tooltip>
                </div>
              )}
            /> */}
            <Table.Column
              title="Action"
              key="action"
              render={(_: any, record: any) => (
                <div className="flex flex-wrap gap-2">
                  <Button
                    icon={<EditOutlined />}
                    size="small"
                    onClick={() => handleEdit(record.plantData._id)}
                  >
                    Edit
                  </Button>
                  <Popconfirm
                    title="Are you sure you want to delete?"
                    onConfirm={() => handleDelete(record.plantData._id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button icon={<DeleteOutlined />} size="small" danger>
                      Delete
                    </Button>
                  </Popconfirm>
                </div>
              )}
            />
          </Table>
        </div>
      )}
    </div>
  );
};

export default WastePlants;
