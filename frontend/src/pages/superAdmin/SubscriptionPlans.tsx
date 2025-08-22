import { useCallback, useEffect } from "react";
import { Table, Button, Popconfirm, Tag, Pagination } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  fetchSubscriptionPlans,
  deleteSubscriptionPlan,
  updateDeleteSubscription,
} from "../../redux/slices/superAdmin/superAdminSubscriptionPlanSlice";
import { toast } from "react-toastify";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import { getAxiosErrorMessage } from "../../utils/handleAxiosError";
import PaginationSearch from "../../components/common/PaginationSearch";
import usePagination from "../../hooks/usePagination";
import { debounce } from "lodash";

const SubscriptionPlans = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { subscriptionPlans, error, total } = useSelector(
    (state: RootState) => state.superAdminSubscriptionPlan
  );

  const { currentPage, setCurrentPage, pageSize, search, setSearch } =
    usePagination();
  const debouncedFetchSubscriptionPlans = useCallback(
    debounce((page: number, limit: number, query: string) => {
      dispatch(fetchSubscriptionPlans({ page, limit, search: query }));
    }, 500),
    [dispatch]
  );
  useEffect(() => {
    debouncedFetchSubscriptionPlans(currentPage, pageSize, search);
    return () => {
      debouncedFetchSubscriptionPlans.cancel();
    };
  }, [currentPage, pageSize, search, debouncedFetchSubscriptionPlans]);

  const handleEdit = (planId: string) => {
    try {
      navigate(`/super-admin/edit-subscription-plan/${planId}`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (planId: string) => {
    try {
      const res = await dispatch(deleteSubscriptionPlan(planId)).unwrap();
      toast.success(res?.message);
      dispatch(updateDeleteSubscription(planId));
    } catch (error) {
      const msg = getAxiosErrorMessage(error);
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-4">
      {/* Breadcrumbs and Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <Breadcrumbs paths={[{ label: "Subscription Plans" }]} />
          <h1 className="text-2xl font-bold text-gray-800">
            Subscription Plan Management
          </h1>
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
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <PaginationSearch onSearchChange={setSearch} searchValue={search} />
          <Table
            dataSource={
              Array.isArray(subscriptionPlans) ? subscriptionPlans : []
            }
            rowKey="_id"
            bordered
            className="shadow-sm"
            pagination={false}
          >
            <Table.Column
              title="Plan Name"
              dataIndex="planName"
              key="planName"
            />
            <Table.Column title="Price (₹)" dataIndex="price" key="price" />
            <Table.Column
              title="Billing Cycle"
              dataIndex="billingCycle"
              key="billingCycle"
              render={(cycle: string) => (
                <Tag color={cycle === "Monthly" ? "blue" : "purple"}>
                  {cycle}
                </Tag>
              )}
            />
            <Table.Column
              title="Drivers"
              dataIndex="driverLimit"
              key="driverLimit"
            />
            <Table.Column title="Users" dataIndex="userLimit" key="userLimit" />
            <Table.Column
              title="Trucks"
              dataIndex="truckLimit"
              key="truckLimit"
            />
            {/* <Table.Column title="Trial Days" dataIndex="trialDays" key="trialDays" /> */}
            <Table.Column
              title="Status"
              dataIndex="status"
              key="status"
              render={(status: string) => (
                <Tag
                  color={
                    status === "Active"
                      ? "green"
                      : status === "Inactive"
                      ? "red"
                      : "orange"
                  }
                >
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
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={total}
            onChange={setCurrentPage}
            style={{ marginTop: 16, textAlign: "right" }}
          />
        </div>
      )}
    </div>
  );
};

export default SubscriptionPlans;
