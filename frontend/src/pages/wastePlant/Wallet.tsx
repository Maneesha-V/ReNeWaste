import { Card, Typography, Button, Table, Space, Pagination } from "antd";
import {
  WalletOutlined,
  ReloadOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import React, { useEffect, useMemo } from "react";
import { useAppDispatch } from "../../redux/hooks";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { getWallet } from "../../redux/slices/wastePlant/wastePlantWalletSlice";
import { extractDateAndTime24H } from "../../utils/formatDate";
import PaginationSearch from "../../components/common/PaginationSearch";
import usePagination from "../../hooks/usePagination";
import debounce from "lodash/debounce";
import { TransactionDTO } from "../../types/wallet/walletTypes";

const { Title, Text } = Typography;

const Wallet: React.FC = () => {
  const dispatch = useAppDispatch();
  const { transactions, balance, total, earnings } = useSelector(
    (state: RootState) => state.wastePlantWallet,
  );

  const { currentPage, setCurrentPage, pageSize, search, setSearch } =
    usePagination();
  console.log({ transactions, balance, total, earnings });

  const debouncedFetchWallet = useMemo(
    () =>
      debounce((page: number, limit: number, query: string) => {
        dispatch(getWallet({ page, limit, search: query }));
      }, 500),
    [],
  );
  useEffect(() => {
    debouncedFetchWallet(currentPage, pageSize, search);

    return () => {
      debouncedFetchWallet.cancel();
    };
  }, [currentPage, pageSize, search]);

  const columns = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (value: string) => (
        <Text strong style={{ color: value === "Credit" ? "green" : "red" }}>
          {value}
        </Text>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (value: number) => <Text>₹{value}</Text>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Date",
      key: "date",
      render: (record: TransactionDTO) => {
        const dateValue = record.refundAt || record.paidAt;
        if (!dateValue) return "-";
        const { date, time } = extractDateAndTime24H(dateValue);
        return (
          <Text>
            {date} {time}
          </Text>
        );
      },
    },
    {
      title: "Status",
      key: "status",
      render: (record: TransactionDTO) => {
        const statusValue = record.refundStatus || record.status;
        return (
          <Text
            style={{
              color:
                statusValue === "Paid" || statusValue === "Refund"
                  ? "green"
                  : "orange",
            }}
          >
            {statusValue}
          </Text>
        );
      },
    },
  ];

  return (
    <div className="p-3 sm:p-5">
      <Title level={3} className="!mb-5 text-center sm:text-left">
        My Wallet
      </Title>

      {/* Wallet Card */}
      <Card
        style={{
          marginBottom: 24,
          borderRadius: 10,
          padding: 20,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div className="flex items-center gap-3">
              <WalletOutlined style={{ fontSize: 32, color: "#1890ff" }} />
              <Title level={4} style={{ margin: 0 }}>
                Wallet Balance
              </Title>
              </div>

             <div className="flex items-center gap-3">
              <RiseOutlined style={{ fontSize: 24, color: "green" }} />
              <Title level={5} style={{ margin: 0, color: "green" }}>
                Earnings: ₹{earnings}
              </Title>
              </div>
          </div>

          <Title level={2} className="!m-0 !text-blue-500 text-3xl sm:text-4xl">
            ₹{balance}
          </Title>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Add money button optional for wasteplant */}
            <Button type="primary"  className="w-full sm:w-auto">Add Money</Button>

            <Button type="default" icon={<ReloadOutlined />}  className="w-full sm:w-auto">
              Refresh
            </Button>
          </div>
        </Space>
      </Card>

      {/* Transactions Table */}
      <Card
        title={
          // <div className="flex justify-between items-center">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <span>Transaction History</span>
            <PaginationSearch onSearchChange={setSearch} searchValue={search} />
          </div>
        }
        style={{
          borderRadius: 10,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          paddingBottom: 0,
        }}
      >
        <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={transactions}
          pagination={false}
          scroll={{ x: "max-content" }}
          style={{ marginTop: 16 }}
          rowKey={(record) => record._id}
        />
        </div>
        <div
          className="flex justify-center sm:justify-end items-center py-4"
          style={{ borderTop: "1px solid #f0f0f0" }}
        >
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={total}
            onChange={setCurrentPage}
            showSizeChanger={false}
          />
        </div>
      </Card>
    </div>
  );
};

export default Wallet;
