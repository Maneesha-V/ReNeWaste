import { Card, Typography, Table, Space, Pagination } from "antd";
import { WalletOutlined } from "@ant-design/icons";
import React, { useEffect, useMemo } from "react";
import { useAppDispatch } from "../../redux/hooks";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { extractDateAndTime24H } from "../../utils/formatDate";
import PaginationSearch from "../../components/common/PaginationSearch";
import usePagination from "../../hooks/usePagination";
import debounce from "lodash/debounce";
import { getWallet } from "../../redux/slices/superAdmin/superAdminWalletSlice";

const { Title, Text } = Typography;

const Wallet: React.FC = () => {
  const dispatch = useAppDispatch();
  const { transactions, balance, total } = useSelector(
    (state: RootState) => state.superAdminWallet,
  );

  const { currentPage, setCurrentPage, pageSize, search, setSearch } =
    usePagination();
  console.log({ transactions, balance, total });

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
      dataIndex: "paidAt",
      key: "paidAt",
      render: (value: string) => {
        const { date, time } = extractDateAndTime24H(value);
        return (
          <Text>
            {date} {time}
          </Text>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (value: string) => (
        <Text style={{ color: value === "Success" ? "green" : "orange" }}>
          {value}
        </Text>
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-6">
      <Title level={3} style={{ marginBottom: 20 }}>
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
        <Space
          direction="vertical"
          align="center"
          size="middle"
          style={{ width: "100%" }}
        >
          <WalletOutlined style={{ fontSize: 40, color: "#1890ff" }} />

          <Title level={4} style={{ margin: 0 }}>
            Wallet Balance
          </Title>

          <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
            ₹{balance}
          </Title>
        </Space>
      </Card>
      {/* Transactions Table */}
      <Card
        title={
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
            style={{ marginTop: 16 }}
            rowKey={(record) => record._id}
            scroll={{ x: 700 }}
          />
        </div>
        <div
          className="flex justify-center sm:justify-end py-4"
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
