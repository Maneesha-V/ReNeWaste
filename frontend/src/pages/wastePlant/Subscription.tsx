import { useEffect, useState } from "react";
import { Table, Button, Space, Modal, Typography } from "antd";
import { useAppDispatch } from "../../redux/hooks";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { fetchSubscriptionPlan } from "../../redux/slices/wastePlant/wastePlantSubscriptionSlice";
import SubscriptionPayModal from "../../components/wastePlant/SubscriptionPayModal";
import { SubcptnPaymtPayload } from "../../types/subscriptionTypes";
import {
  fetchSubscrptnPayments,
  repay,
  verifySubscriptionPayment,
} from "../../redux/slices/wastePlant/wastePlantPaymentSlice";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { loadRazorpayScript } from "../../utils/razorpayUtils";

const { Title } = Typography;

const Subscription = () => {
  const dispatch = useAppDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPayNowModalOpen, setIsPayNowModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [viewData, setViewData] = useState({
    description: "",
    truckLimit: 0,
    driverLimit: 0,
    userLimit: 0,
  });
  const [paymentRows, setPaymentRows] = useState<any[]>([]);
  const subscriptionPlan = useSelector(
    (state: RootState) => state.wastePlantSubscription.selectedPlan
  );
  const subscriptionData = subscriptionPlan?.subscriptionData;
  const plantData = subscriptionPlan?.plantData;
  console.log("subscriptionData", subscriptionData);
  console.log("plantData", plantData);
  
  useEffect(() => {
    dispatch(fetchSubscriptionPlan());
    dispatch(fetchSubscrptnPayments());
  }, [dispatch]);

  const payments = useSelector(
    (state: RootState) => state.wastePlantPayments.payments
  );
  console.log("payments", payments);
  useEffect(() => {
    if (payments?.paymentData?.length) {
      setPaymentRows(
        payments.paymentData.map((payment: any) => ({
          ...payment,
          plantData: payments.planData,
        }))
      );
    }
  }, [payments]);
  const handleViewDetails = () => {
    if (subscriptionPlan.subscriptionData) {
      const { truckLimit, driverLimit, userLimit, description } =
        subscriptionPlan.subscriptionData;
      setViewData({ truckLimit, driverLimit, userLimit, description });
      setIsModalVisible(true);
    }
  };
  const handlePay = (plan: SubcptnPaymtPayload) => {
    console.log("plan", plan);
    setSelectedPlan(plan);
    setIsPayNowModalOpen(true);
  };

  const handleRetryPayment = async (
    planId: string,
    amount: number,
    subPaymtId: string,
    billingCycle: string
  ) => {
    console.log("billingCycle", billingCycle);

    const response = await dispatch(repay({ planId, amount, subPaymtId }));
    console.log("respp", response);

    const {
      orderId,
      amount: repayAmt,
      currency,
      planId: subPlanId,
    } = response.payload;
    console.log("razorpayOrderId", repayAmt, orderId);
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
        handler: function (response: any) {
          console.log("Payment successful", response);
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
            response;
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
            .then(() => {
              dispatch(fetchSubscrptnPayments()).then(() => {
                Swal.fire({
                  icon: "success",
                  title: "Payment Successful!",
                  text: "Your payment was verified successfully.",
                  confirmButtonColor: "#28a745",
                });
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
        prefill: {
          name: "Your Name",
          email: "your-email@example.com",
          contact: "9999999999",
        },
        notes: {
          // You can add additional notes if needed
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    }
  };
  const subActionColumn = {
    title: "Action",
    key: "action",
    render: (_: any, record: any) => {
      const createdAt = new Date(record.createdAt);
      const now = new Date();
      const isAfter24Hours =
        now.getTime() - createdAt.getTime() > 24 * 60 * 60 * 1000;
      const hasPendingPayment = payments?.paymentData?.some(
        (p: any) => p.status?.trim().toLowerCase() === "pending"
      );
       const hasSuccessfulPayment = payments?.paymentData?.some(
      (p: any) => p.status?.trim().toLowerCase() === "paid"
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
      return (
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handlePay({
                _id: subscriptionData?._id,
                planName: subscriptionData?.planName,
                billingCycle: subscriptionData?.billingCycle,
                price: subscriptionData?.price,
                plantName: plantData?.plantName,
                ownerName: plantData?.ownerName,
                license: plantData?.license,
              })
            }
          >
            Pay
          </Button>
        </Space>
      );
      // return (
      //   <Space>
      //     {isAfter24Hours ? (
      //       <Button
      //         type="primary"
      //         onClick={() =>
      //           handlePay({
      //             _id: subscriptionData?._id,
      //             planName: subscriptionData?.planName,
      //             billingCycle: subscriptionData?.billingCycle,
      //             price: subscriptionData?.price,
      //             plantName: plantData?.plantName,
      //             ownerName: plantData?.ownerName,
      //             license: plantData?.license,
      //           })
      //         }
      //       >
      //         Pay
      //       </Button>
      //     ) : (
      //       <span style={{ color: "#8c8c8c" }}>Pay available after 24h</span>
      //     )}
      //   </Space>
      // );
    },
  };
  

const firstPayment = payments?.paymentData?.[0];
const expiredAt = firstPayment?.expiredAt || null;


 const expiryColumn = {
  title: "Expired At",
  dataIndex: "expiryDate",
  key: "expiryDate",
  render: (_: any, record: any) => {
    console.log("record",record);
    const expiryDate = record.expiredAt
    return (
      <span style={{ color: "red", fontWeight: "bold" }}>
        {expiryDate ? new Date(expiryDate).toLocaleDateString() : "N/A"}
      </span>
    );
  }
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
  const paidAtColumn = {
    title: "Paid At",
    dataIndex: "paidAt",
    key: "paidAt",
    render: (text: string) => new Date(text).toLocaleString(),
  };
  const paymtHistActionColumn = {
    title: "Action",
    key: "action",
    render: (_: any, record: any) => {
      if (record.status?.trim().toLowerCase() === "pending") {
        return (
          <Button
            type="primary"
            onClick={() =>
              handleRetryPayment(
                record.planId,
                record.amount,
                record._id,
                record.billingCycle
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
      render: (_: any, record: any) => {
        const plant = record.plantData;
        return (
          <>
            <div>
              <strong>Plan:</strong> {plant?.planName}
            </div>
            <div>
              <strong>Plant:</strong> {plant?.plantName}
            </div>
            <div>
              <strong>Owner:</strong> {plant?.ownerName}
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
  const showPaidAtColumn = payments?.paymentData?.some(
    (payment: any) => payment.status === "Paid"
  );
  const showPaymtHistActionColumn = payments?.paymentData?.some(
    (payment: any) => payment.status !== "Paid"
  );

  const columns =
    plantData?.status === "Active"
      ? [...subPlanColumns, expiryColumn]
      : [...subPlanColumns, subActionColumn];
  const payHistoryColumns = [
    ...paymentColumns,
    ...(showPaidAtColumn ? [paidAtColumn] : []),
    ...(showPaymtHistActionColumn ? [paymtHistActionColumn] : []),
  ];

  console.log("paymentData is array:", Array.isArray(payments?.paymentData));
  console.log("paymentData length:", payments?.paymentData?.length);
  console.log("planData", payments?.planData);

  return (
    <div style={{ padding: "24px" }}>
      <Title level={3}>Subscription Plan</Title>
      <Table
        columns={columns}
        dataSource={[
          {
            ...subscriptionData,
            createdAt: plantData?.createdAt,
            expiredAt: expiredAt,
            plantStatus: plantData?.status,
          },
        ]}
        rowKey="_id"
        pagination={false}
        bordered
      />
      <Title level={4} style={{ marginTop: "32px" }}>
        Payment History
      </Title>
      <Table
        columns={payHistoryColumns}
        // dataSource={
        //   payments?.paymentData?.map((payment: any) => ({
        //     ...payment,
        //     plantData: payments.planData,
        //   })) || []
        // }
        dataSource={paymentRows}
        rowKey="_id"
        bordered
        pagination={{ pageSize: 5 }}
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
    </div>
  );
};

export default Subscription;
