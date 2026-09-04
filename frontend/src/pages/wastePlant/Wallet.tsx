import { Card, Typography, Button, Table, Space, Pagination } from "antd";
import {
  WalletOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import React, { useEffect, useMemo, useState } from "react";
import { useAppDispatch } from "../../redux/hooks";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  createAddMoneyOrder,
  getWallet,
  retryAddMoney,
  updateWPWalletRetryTransactionStatus,
  updateWPWalletTransactionStatus,
  verifyWalletAddPayment,
} from "../../redux/slices/wastePlant/wastePlantWalletSlice";
import { extractDateAndTime24H } from "../../utils/formatDate";
import PaginationSearch from "../../components/common/PaginationSearch";
import usePagination from "../../hooks/usePagination";
import debounce from "lodash/debounce";
import { AddMoneyReq, TransactionDTO } from "../../types/wallet/walletTypes";
import AddMoneyModal from "../../components/common/AddMoneyModal";
import { loadRazorpayScript } from "../../utils/razorpayUtils";
import { toast } from "react-toastify";
import { RazorpayResponse } from "../../types/pickupReq/paymentTypes";
import Swal from "sweetalert2";
import { getAxiosErrorMessage } from "../../utils/handleAxiosError";

const { Title, Text } = Typography;

const Wallet: React.FC = () => {
  const dispatch = useAppDispatch();
  const { transactions, balance, total, earnings } = useSelector(
    (state: RootState) => state.wastePlantWallet,
  );

  const { currentPage, setCurrentPage, pageSize, search, setSearch } =
    usePagination();
  const [showModal, setShowModal] = useState(false);
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

  const handleAddMoney = async (data: AddMoneyReq) => {
    try {
      const orderResp = await dispatch(createAddMoneyOrder(data)).unwrap();
      const sdkLoaded = await loadRazorpayScript();
      if (!sdkLoaded) {
        toast("Razorpay SDK failed to load.");
        return;
      }
      if (orderResp) {
        const { orderId, amount, currency, walletId } = orderResp;
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: amount * 100,
          currency: currency,
          name: "Renewaste",
          description: "Wallet payment.",
          order_id: orderId,
          handler: function (response: RazorpayResponse) {
            const {
              razorpay_order_id,
              razorpay_payment_id,
              razorpay_signature,
            } = response;

            dispatch(
              verifyWalletAddPayment({
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
                walletId,
                amount,
              }),
            )
              .unwrap()
              .then((res) => {
                dispatch(
                  updateWPWalletTransactionStatus({
                    balance: res.walletVerPayOrder.balance,
                    transaction: res.walletVerPayOrder.transaction,
                  }),
                );
                Swal.fire({
                  icon: "success",
                  title: "Payment Successful!",
                  text: `₹${res.walletVerPayOrder.amount} ${res.message}`,
                  confirmButtonColor: "#28a745",
                });
              })
              .then(() => {
                setShowModal(false);
              })
              .catch((err) => {
                Swal.fire({
                  icon: "error",
                  title: "Wallet Payment Failed",
                  text:
                    err?.error ||
                    "Payment verification failed. Please try again.",
                  confirmButtonColor: "#d33",
                });
              });
          },
          prefill: {},
          theme: {
            color: "#28a745",
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.on("modal.closed", function () {
          console.warn("Razorpay modal closed by user.");
          toast.info("Payment window closed.");
        });

        razorpay.open();
        setShowModal(false);
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Unexpected error",
        text: getAxiosErrorMessage(err),
        confirmButtonColor: "#d33",
      });
    }
  };
  const handleRetry = async (transactionId: string) => {
    try {
      const retryOrderResp = await dispatch(
        retryAddMoney(transactionId),
      ).unwrap();

      const sdkLoaded = await loadRazorpayScript();
      if (!sdkLoaded) {
        toast("Razorpay SDK failed to load.");
        return;
      }
      if (retryOrderResp) {
        const { orderId, amount, currency, walletId } = retryOrderResp;
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: amount * 100,
          currency: currency,
          name: "Renewaste",
          description: "Wallet payment.",
          order_id: orderId,
          handler: function (response: RazorpayResponse) {
            const {
              razorpay_order_id,
              razorpay_payment_id,
              razorpay_signature,
            } = response;

            dispatch(
              verifyWalletAddPayment({
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
                walletId,
                amount,
              }),
            )
              .unwrap()
              .then((res) => {
                dispatch(
                  updateWPWalletRetryTransactionStatus({
                    balance: res.walletVerPayOrder.balance,
                    transactionId: res.walletVerPayOrder.transactionId,
                    transaction: res.walletVerPayOrder.transaction,
                  }),
                );
                Swal.fire({
                  icon: "success",
                  title: "Payment Successful!",
                  text: `₹${res.walletVerPayOrder.amount} ${res.message}`,
                  confirmButtonColor: "#28a745",
                });
              })
              .catch((err) => {
                Swal.fire({
                  icon: "error",
                  title: "Payment Failed",
                  text:
                    err?.error ||
                    "Payment verification failed. Please try again.",
                  confirmButtonColor: "#d33",
                });
              });
          },
          prefill: {},
          theme: {
            color: "#28a745",
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.on("modal.closed", function () {
          console.warn("Razorpay modal closed by user.");
          toast.info("Payment window closed.");
        });

        razorpay.open();
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Unexpected error",
        text: getAxiosErrorMessage(err),
        confirmButtonColor: "#d33",
      });
    }
  };

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
        const dateValue = record.paidAt ? record.paidAt : record.updatedAt;
        
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
                statusValue === "Paid" || statusValue === "Refunded"
                  ? "green"
                  : statusValue === "Pending"
                    ? "orange"
                    : statusValue === "InProgress"
                      ? "#f97316"
                      : "red",
            }}
          >
            {statusValue}
          </Text>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (record: TransactionDTO) => {
        return record.status === "InProgress" ? (
          <Button
            type="primary"
            danger
            size="small"
            onClick={() => handleRetry(record._id)}
          >
            Retry
          </Button>
        ) : null;
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
            <Button
              onClick={() => setShowModal(true)}
              type="primary"
              className="w-full sm:w-auto"
            >
              Add Money
            </Button>

            {/* <Button type="default" icon={<ReloadOutlined />}  className="w-full sm:w-auto">
              Refresh
            </Button> */}
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

      <AddMoneyModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleAddMoney}
      />
    </div>
  );
};

export default Wallet;
