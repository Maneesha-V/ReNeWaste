import  { useEffect } from "react";
import { Table, Button, Popconfirm, Spin, Tag } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { fetchSubscriptionPlans, deleteSubscriptionPlan } from "../../redux/slices/superAdmin/superAdminSubscriptionPlanSlice";
import { toast } from "react-toastify";
import Breadcrumbs from "../../components/common/Breadcrumbs";

const SubscriptionPlans = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { subscriptionPlans, loading, error } = useSelector(
    (state: RootState) => state.superAdminSubscriptionPlan
  );

  useEffect(() => {
    dispatch(fetchSubscriptionPlans());
  }, [dispatch]);

  const handleEdit = (planId: string) => {
    try {
    navigate(`/super-admin/edit-subscription-plan/${planId}`);
    } catch(error){
      console.error(error);
    }
  };

  const handleDelete = async (planId: string) => {
    try {
      await dispatch(deleteSubscriptionPlan(planId)).unwrap();
      toast.success("Subscription plan deleted successfully");
      dispatch(fetchSubscriptionPlans());
    } catch (error) {
      toast.error("Failed to delete subscription plan");
    }
  };

  return (
    <div className="space-y-4">
      {/* Breadcrumbs and Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <Breadcrumbs paths={[{ label: "Subscription Plans" }]} />
          <h1 className="text-2xl font-bold text-gray-800">Subscription Plan Management</h1>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/super-admin/add-subscription-plan")}
          className="bg-green-600 hover:bg-green-700"
        >
          Create Plan
        </Button>
      </div>

      {/* Table Section */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Spin size="large" />
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <Table
            dataSource={Array.isArray(subscriptionPlans) ? subscriptionPlans : []}
            rowKey="_id"
            bordered
            className="shadow-sm"
            pagination={{ pageSize: 10 }}
          >
            <Table.Column title="Plan Name" dataIndex="planName" key="planName" />
            <Table.Column title="Price (₹)" dataIndex="price" key="price" />
            <Table.Column
              title="Billing Cycle"
              dataIndex="billingCycle"
              key="billingCycle"
              render={(cycle: string) => (
                <Tag color={cycle === "Monthly" ? "blue" : "purple"}>{cycle}</Tag>
              )}
            />
            <Table.Column title="Drivers" dataIndex="driverLimit" key="driverLimit" />
            <Table.Column title="Users" dataIndex="userLimit" key="userLimit" />
            <Table.Column title="Trucks" dataIndex="truckLimit" key="truckLimit" />
            {/* <Table.Column title="Trial Days" dataIndex="trialDays" key="trialDays" /> */}
            <Table.Column
              title="Status"
              dataIndex="status"
              key="status"
              render={(status: string) => (
                <Tag color={status === "Active" ? "green" : status === "Inactive" ? "red" : "orange"}>
                  {status}
                </Tag>
              )}
            />
            <Table.Column
              title="Actions"
              key="actions"
              render={(_, record: any) => (
                <div className="flex flex-wrap gap-2">
                  <Button
                    icon={<EditOutlined />}
                    size="small"
                    onClick={() => handleEdit(record._id)}
                  >
                    Edit
                  </Button>
                  <Popconfirm
                    title="Are you sure to delete this plan?"
                    onConfirm={() => handleDelete(record._id)}
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

export default SubscriptionPlans;
