import { Table, Tag, Typography, Spin, Alert, Breakpoint } from "antd";
import { useCallback, useEffect } from "react";
import { useAppDispatch } from "../../redux/hooks";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { fetchPaymentHistory } from "../../redux/slices/superAdmin/superAdminPaymentSlice";
import PaginationSearch from "../../components/common/PaginationSearch";
import usePagination from "../../hooks/usePagination";
import { debounce } from "lodash";
import { SubscriptionPaymentHisDTO } from "../../types/subscriptionPayment/paymentTypes";

const { Title } = Typography;

const PaymentHistory = () => {
  const dispatch = useAppDispatch();
  const { payments, total, loading, error } = useSelector(
    (state: RootState) => state.superAdminPayments
  );
  const { currentPage, setCurrentPage, pageSize, search, setSearch } =
    usePagination();
  const debouncedFetchPayments = useCallback(
    debounce((page: number, limit: number, query: string) => {
      dispatch(fetchPaymentHistory({ page, limit, search: query }));
    }, 500),
    [dispatch]
  );
  useEffect(() => {
    debouncedFetchPayments(currentPage, pageSize, search);
    return () => {
      debouncedFetchPayments.cancel();
    };
  }, [currentPage, pageSize, search, debouncedFetchPayments]);

  const columns = [
    {
      title: "Waste Plant",
      dataIndex: ["wasteplantId", "plantName"],
      key: "plantName",
      responsive: ["xs", "sm", "md"] as Breakpoint[],
    },
    {
      title: "Plan",
      dataIndex: ["planId", "planName"],
      key: "planName",
      responsive: ["xs", "sm", "md"] as Breakpoint[],
    },
    {
      title: "Amount (₹)",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => `₹${amount}`,
      responsive: ["sm", "md"] as Breakpoint[],
    },
    {
      title: "Paid Date",
      dataIndex: "paidAt",
      key: "paidAt",
      render: (date: string | null) =>
        date ? new Date(date).toLocaleDateString() : "-",
    },
        {
      title: "Expiry Date",
      dataIndex: "expiredAt",
      key: "expiredAt",
      render: (date: string | null) =>
        date ? new Date(date).toLocaleDateString() : "-",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "Paid" ? "green" : "red"}>{status}</Tag>
      ),
    },
  ];

  return (
    <div style={{ padding: "16px" }}>
      <Title level={4}>Subscription Payment History</Title>

      {error ? (
        <Alert message="Error" description={error} type="error" showIcon />
      ) : (
        <>
          <PaginationSearch
            total={total}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onSearchChange={setSearch}
            searchValue={search}
          />
           <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={payments.map((item: SubscriptionPaymentHisDTO) => ({
              ...item,
              key: item._id,
            }))}
            pagination={false}
            scroll={{ x: "max-content" }}
            bordered
          />
          </Spin>
        </>
      )}
    </div>
  );
};

export default PaymentHistory;
