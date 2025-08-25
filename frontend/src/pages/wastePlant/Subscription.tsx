import { useEffect, useState } from "react";
import { Table, Button, Space, Modal, Typography, Popconfirm } from "antd";
import { useAppDispatch } from "../../redux/hooks";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  cancelSubPayReq,
  fetchSubscriptionPlan,
  updateSubPaymentStatus,
} from "../../redux/slices/wastePlant/wastePlantSubscriptionSlice";
import {
  repay,
  verifySubscriptionPayment,
} from "../../redux/slices/wastePlant/wastePlantPaymentSlice";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { loadRazorpayScript } from "../../utils/razorpayUtils";
import { RazorpayResponse } from "../../types/pickupReq/paymentTypes";
import { formatDateToDDMMYYYY } from "../../utils/formatDate";
import { SubscriptionPaymentHisDTO } from "../../types/subscriptionPayment/paymentTypes";
import { getAxiosErrorMessage } from "../../utils/handleAxiosError";
import { SubcptnPaymtPayload } from "../../types/subscription/subscriptionTypes";
import SubscriptionPayModal from "../../components/wastePlant/SubscriptionPayModal";
import CancelSubptnModal from "../../components/wastePlant/CancelSubptnModal";

const { Title } = Typography;

const Subscription = () => {
  const dispatch = useAppDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPayNowModalOpen, setIsPayNowModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubcptnPaymtPayload | null>(
    null
  );
  const [viewData, setViewData] = useState({
    description: "",
    truckLimit: 0,
    driverLimit: 0,
    userLimit: 0,
  });
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancelSubsptn, setCancelSubsptn] = useState<string | null>(null);

  const { subscriptionData, plantData } = useSelector(
    (state: RootState) => state.wastePlantSubscription.selectedPlan
  );
  
  const payments = useSelector(
    (state: RootState) => state.wastePlantSubscription.subPaymentsHis
  );

  console.log("subscriptionData", subscriptionData);
  console.log("plantData", plantData);
  console.log("payments", payments);
  useEffect(() => {
    dispatch(fetchSubscriptionPlan());
  }, [dispatch]);

  const handleViewDetails = () => {
    if (subscriptionData) {
      const { truckLimit, driverLimit, userLimit, description } =
        subscriptionData;
      setViewData({ truckLimit, driverLimit, userLimit, description });
      setIsModalVisible(true);
    }
  };
  const handlePay = (plan: SubcptnPaymtPayload) => {
    console.log("plan", plan);
    setSelectedPlan(plan);
    setIsPayNowModalOpen(true);
  };
  const handleCancel = (paymtId: string) => {
    setCancelSubsptn(paymtId);
    setCancelModalVisible(true);
  };
  const handleRetryPayment = async (
    planId: string,
    amount: number,
    subPaymtId: string,
    billingCycle: string
  ) => {
    try {
      const response = await dispatch(
        repay({ planId, amount, subPaymtId })
      ).unwrap();

      const {
        orderId,
        amount: repayAmt,
        currency,
        planId: subPlanId,
      } = response;

      const res = await loadRazorpayScript();
      if (!res) {
        toast("Razorpay SDK failed to load.");
        return;
      }
      if (orderId && repayAmt) {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: repayAmt,
          currency: currency,
          name: "Your Company Name",
          description: "Payment for Pickup Request",
          order_id: orderId,
          handler: function (response: RazorpayResponse) {
            console.log("Payment successful", response);
            const {
              razorpay_order_id,
              razorpay_payment_id,
              razorpay_signature,
            } = response;
            dispatch(
              verifySubscriptionPayment({
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
                planId: subPlanId,
                amount: repayAmt,
                billingCycle,
              })
            )
              .unwrap()
              .then((res) => {
                console.log("res", res);

                dispatch(updateSubPaymentStatus(res.updatePayment));
                Swal.fire({
                  icon: "success",
                  title: "Payment Successful!",
                  text: "Your payment was verified successfully.",
                  confirmButtonColor: "#28a745",
                });
              })
              .catch(() => {
                Swal.fire({
                  icon: "error",
                  title: "Payment Failed",
                  text: "Payment verification failed. Please try again.",
                  confirmButtonColor: "#d33",
                });
              });
          },
          modal: {
            ondismiss: function () {
              setIsPayNowModalOpen(false);
            },
          },
          prefill: {
            name: "Your Name",
            email: "your-email@example.com",
            contact: "9999999999",
          },
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
      }
    } catch (err) {
      const msg = getAxiosErrorMessage(err);
      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text: msg,
        confirmButtonColor: "#d33",
      });
    }
  };
  const subActionColumn = {
    title: "Action",
    key: "action",
    render: (record: any) => {
      const createdAt = new Date(record.createdAt);
      const now = new Date();
      const isAfter24Hours =
        now.getTime() - createdAt.getTime() > 24 * 60 * 60 * 1000;
      const hasPendingPayment = payments.some(
        (p: SubscriptionPaymentHisDTO) =>
          p.status?.trim().toLowerCase() === "pending"
      );
      const hasSuccessfulPayment = payments.some(
        (p: SubscriptionPaymentHisDTO) =>
          p.status?.trim().toLowerCase() === "paid"
      );
      if (!isAfter24Hours) {
        return (
          <span style={{ color: "#8c8c8c" }}>Pay available after 24h</span>
        );
      }

      if (hasPendingPayment) {
        return <span style={{ color: "#fa8c16" }}>Payment Pending</span>;
      }
      if (hasSuccessfulPayment && plantData?.status === "Active") {
        return (
          <span style={{ color: "#52c41a", fontWeight: "bold" }}>
            Subscribed
          </span>
        );
      }
      return null;
      // return (
      //   <Space>
      //     <Button
      //       type="primary"
      //       onClick={() =>
      //         handlePay({
      //           _id: subscriptionData?._id,
      //           planName: subscriptionData?.planName,
      //           billingCycle: subscriptionData?.billingCycle,
      //           price: subscriptionData?.price,
      //           plantName: plantData?.plantName,
      //           ownerName: plantData?.ownerName,
      //           license: plantData?.license,
      //         })
      //       }
      //     >
      //       Pay
      //     </Button>
      //   </Space>
      // );
    },
  };

  // const firstPayment = payments?.paymentData?.[0];
  // const expiredAt = firstPayment?.expiredAt || null;

  const expiryColumn = {
    title: "Expired At",
    dataIndex: "expiryDate",
    key: "expiryDate",
    render: (_: any, record: any) => {
      console.log("record", record);
      const expiryDate = record.expiredAt;
      return (
        <span style={{ color: "red", fontWeight: "bold" }}>
          {expiryDate ? formatDateToDDMMYYYY(expiryDate) : "N/A"}
        </span>
      );
    },
  };

  const subPlanColumns = [
    {
      title: "Plan Name",
      dataIndex: "planName",
      key: "planName",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `₹${price}`,
    },
    {
      title: "Billing Cycle",
      dataIndex: "billingCycle",
      key: "billingCycle",
    },
    {
      title: "Description",
      key: "description",
      render: () => (
        <Button type="link" onClick={handleViewDetails}>
          View
        </Button>
      ),
    },
    {
      title: "Status",
      dataIndex: "plantStatus",
      key: "plantStatus",
      render: (plantStatus: string) => {
        let color = "#000";

        switch (plantStatus) {
          case "Pending":
            color = "#fa8c16";
            break;
          case "Active":
            color = "#52c41a";
            break;
          case "Inactive":
            color = "#8c8c8c";
            break;
          case "Rejected":
            color = "#f5222d";
            break;
        }

        return <span style={{ color }}>{plantStatus}</span>;
      },
    },
  ];
  const paidAtColumn = [
    {
      title: "Paid At",
      dataIndex: "paidAt",
      key: "paidAt",
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: "Action",
      key: "action",
      render: (record: SubscriptionPaymentHisDTO) => {
        if (record.refundRequested) {
          return <span className="text-red-500">Refund Requested</span>
        } else if (record.status?.trim().toLowerCase() === "paid" && !record.refundRequested) {
          return (
            <Popconfirm
              title="Are you sure to cancel this pickup?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => handleCancel(record._id)}
              okType="danger"
            >
              <Button type="default" danger>
                Cancel
              </Button>
            </Popconfirm>
          );
        }
        return null;
      },
    },
  ];
  const paymtHistActionColumn = {
    title: "Action",
    key: "action",
    render: (record: SubscriptionPaymentHisDTO) => {
      if (record.status?.trim().toLowerCase() === "pending" && !record.refundRequested) {
        return (
          <Button
            type="primary"
            onClick={() =>
              handleRetryPayment(
                record.planId._id,
                record.amount,
                record._id,
                record.planId.billingCycle
              )
            }
          >
            Retry Payment
          </Button>
        );
      }
      return null;
    },
  };
  const paymentColumns = [
    {
      title: "Plant Details",
      key: "plantDetails",
      render: (record: SubscriptionPaymentHisDTO) => {
        return (
          <>
            <div>
              <strong>Plan:</strong> {record.planId.planName}
            </div>
            <div>
              <strong>Plant:</strong> {record.wasteplantId.plantName}
            </div>
            <div>
              <strong>Owner:</strong> {record.wasteplantId.ownerName}
            </div>
          </>
        );
      },
    },
    {
      title: "Order ID",
      dataIndex: "razorpayOrderId",
      key: "razorpayOrderId",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => `₹${amount}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <span style={{ color: status === "Pending" ? "orange" : "green" }}>
          {status}
        </span>
      ),
    },
  ];
  const showPaidAtColumn = payments.some(
    (payment: SubscriptionPaymentHisDTO) => payment.status === "Paid"
  );
  const showPaymtHistActionColumn = payments.some(
    (payment: SubscriptionPaymentHisDTO) => payment.status !== "Paid"
  );

  const columns =
    plantData?.status === "Active"
      ? [...subPlanColumns, expiryColumn]
      : [...subPlanColumns, subActionColumn];
  const payHistoryColumns = [
    ...paymentColumns,
    ...(showPaidAtColumn ? paidAtColumn : []),
    ...(showPaymtHistActionColumn ? [paymtHistActionColumn] : []),
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Title level={3}>Your Subscription Plan</Title>
      {subscriptionData ?  (
      <Table
        columns={columns}
        dataSource={[
          {
            ...subscriptionData,
            createdAt: plantData?.createdAt,
            expiredAt: plantData?.expiredAt,
            plantStatus: plantData?.status,
          },
        ]}
        rowKey="_id"
        pagination={false}
        bordered
        scroll={{ x: "max-content" }}
      />
      ) : (
        <p style={{color: "gray"}}>No active subscription found.</p>
      )}

      <Title level={4} style={{ marginTop: "32px" }}>
        Payment History
      </Title>
      <Table
        columns={payHistoryColumns}
        dataSource={payments}
        rowKey="_id"
        bordered
        pagination={{ pageSize: 5 }}
        scroll={{ x: "max-content" }}
      />
      <Modal
        title="Subscription Details"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <p>
          <strong>Description:</strong> {viewData.description}
        </p>
        <p>
          <strong>Total Trucks:</strong> {viewData.truckLimit}
        </p>
        <p>
          <strong>Total Drivers:</strong> {viewData.driverLimit}
        </p>
        <p>
          <strong>Total Users:</strong> {viewData.userLimit}
        </p>
      </Modal>
      <SubscriptionPayModal
        visible={isPayNowModalOpen}
        onClose={() => setIsPayNowModalOpen(false)}
        plan={selectedPlan}
      />
      <CancelSubptnModal
        visible={cancelModalVisible}
        onClose={() => setCancelModalVisible(false)}
        subPayId={cancelSubsptn}
        cancelAction={cancelSubPayReq}
      />
    </div>
  );
};

export default Subscription;
