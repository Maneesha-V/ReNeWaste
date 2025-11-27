import React, { useEffect, useMemo } from "react";
import { Card, Space, Typography, Table, Tag, Pagination } from "antd";
import { WalletOutlined, GiftOutlined } from "@ant-design/icons";
import { useAppDispatch } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { getWallet } from "../../redux/slices/driver/walletDriverSlice";
import usePagination from "../../hooks/usePagination";
import debounce from "lodash/debounce";
import PaginationSearch from "../../components/common/PaginationSearch";
import { extractDateAndTime24H } from "../../utils/formatDate";

const { Title, Text } = Typography;

const Wallet: React.FC = () => {
    const dispatch = useAppDispatch();
    const { transactions, balance, total, rewards } = useSelector(
      (state: RootState) => state.driverWallet
    );

    const { currentPage, setCurrentPage, pageSize, search, setSearch } =
    usePagination();
    console.log({ transactions, balance, total, rewards });
  
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

  const columns = [
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (value: number) => <Text>₹{value}</Text>,
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
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type: string) =>
        type === "Reward" ? (
          <Tag color="green">Reward</Tag>
        ) : (
          <Tag color="blue">Transaction</Tag>
        ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
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
          style={{ width: "100%" }}
          size="middle"
        >
          {/* Wallet Balance */}
          <Space align="center">
            <WalletOutlined style={{ fontSize: 32, color: "#1890ff" }} />
            <div>
              <Title level={4} style={{ margin: 0 }}>
                Driver Wallet
              </Title>
              <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
                ₹{balance}
              </Title>
            </div>
          </Space>

          {/* Rewards Box */}
          <Card
            style={{
              backgroundColor: "#f6ffed",
              border: "1px solid #b7eb8f",
              borderRadius: 10,
            }}
          >
            <Space align="center">
              <GiftOutlined style={{ fontSize: 28, color: "green" }} />
              <div>
                <Text strong style={{ fontSize: 16, color: "green" }}>
                  Total Rewards Earned
                </Text>
                <Title level={4} style={{ margin: 0, color: "green" }}>
                  ₹{rewards}
                </Title>
              </div>
            </Space>
          </Card>
        </Space>
      </Card>

      {/* Transaction Table */}
      <Card title={
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
          rowKey={(record) => record._id}
          pagination={false}
          style={{ marginTop: 16 }}
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