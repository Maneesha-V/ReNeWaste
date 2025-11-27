import { Card, Typography, Button, Table, Space, Pagination } from "antd";
import { WalletOutlined, ReloadOutlined, RiseOutlined } from "@ant-design/icons";
import React, { useEffect, useMemo } from "react";
import { useAppDispatch } from "../../redux/hooks";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { getWallet } from "../../redux/slices/wastePlant/wastePlantWalletSlice";
import { extractDateAndTime24H } from "../../utils/formatDate";
import PaginationSearch from "../../components/common/PaginationSearch";
import usePagination from "../../hooks/usePagination";
import debounce from "lodash/debounce";

const { Title, Text } = Typography;

const Wallet: React.FC = () => {
  
  const dispatch = useAppDispatch();
  const { transactions, balance, total, earnings } = useSelector(
    (state: RootState) => state.wastePlantWallet
  );

  const { currentPage, setCurrentPage, pageSize, search, setSearch } =
  usePagination();
  console.log({ transactions, balance, total, earnings });

    const debouncedFetchWallet = useMemo(
      () =>
      debounce((page: number, limit: number, query: string) => {
        dispatch(getWallet({ page, limit, search: query }));
      }, 500),
      []
    );
    useEffect(() => {
      debouncedFetchWallet(currentPage, pageSize, search);
  
      return () => {
        debouncedFetchWallet.cancel();
      };
    }, [currentPage, pageSize, search]);
    
  // useEffect(() => {
  //   dispatch(getWallet());
  // }, [dispatch]);
 

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
        const { date, time } = extractDateAndTime24H(value)
        return <Text>{date} {time}</Text>
      } 
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
    <div style={{ padding: "20px" }}>
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
        <Space direction="vertical" style={{ width: "100%" }}>
        <Space align="center" style={{ justifyContent: "space-between", width: "100%" }}>
          <Space align="center">
            <WalletOutlined style={{ fontSize: 32, color: "#1890ff" }} />
            <Title level={4} style={{ margin: 0 }}>
              Wallet Balance
            </Title>
          </Space>

          <Space align="center">
        <RiseOutlined style={{ fontSize: 24, color: "green" }} />
        <Title level={5} style={{ margin: 0, color: "green" }}>
          Earnings: ₹{earnings}
        </Title>
      </Space>
    </Space>
          <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
            ₹{balance}
          </Title>

          <Space>
            {/* Add money button optional for wasteplant */}
            <Button type="primary">Add Money</Button>

            <Button type="default" icon={<ReloadOutlined />}>
              Refresh
            </Button>
          </Space>
        </Space>
      </Card>

      {/* Transactions Table */}
      <Card
        title={
          <div className="flex justify-between items-center">
            <span>Transaction History</span>
            <PaginationSearch
              onSearchChange={setSearch}
              searchValue={search}
            />
          </div>
        }
        style={{
          borderRadius: 10,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          paddingBottom: 0,
        }}
      >
        <Table
          columns={columns}
          dataSource={transactions}
          pagination={false}
          style={{ marginTop: 16 }}
    rowKey={(record) => record._id}
        />
        <div
    className="flex justify-end items-center py-4"
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
