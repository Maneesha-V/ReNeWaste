import { useEffect } from "react";
import { Modal } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  createSubscriptionOrder,
  fetchSubscrptnPayments,
  verifySubscriptionPayment,
} from "../../redux/slices/wastePlant/wastePlantPaymentSlice";
import Swal from "sweetalert2";
import { useAppDispatch } from "../../redux/hooks";
import { SubcptnPaymtPayload } from "../../types/subscriptionTypes";

interface SubscriptionPayModalProps {
  visible: boolean;
  onClose: () => void;
  plan: SubcptnPaymtPayload;
}

const SubscriptionPayModal = ({
  visible,
  onClose,
  plan,
}: SubscriptionPayModalProps) => {
  const dispatch = useAppDispatch();
  const paymentOrder = useSelector(
    (state: RootState) => state.wastePlantPayments.paymentOrder
  );

  useEffect(() => {
    if (visible && plan) {
      dispatch(
        createSubscriptionOrder({
          planId: plan._id,
          amount: plan.price,
          plantName: plan.plantName,
        })
      );
    }
  }, [visible, plan, dispatch]);
  if (!plan) return null;
  console.log("plan", plan);

  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => reject("Razorpay SDK failed to load.");
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    console.log("handlePayment called");
    const res = await loadRazorpayScript();
    console.log("Razorpay script load result:", res);
    if (!res) {
      Swal.fire("Error", "Razorpay SDK failed to load.", "error");
      return;
    }
    console.log("paymentOrder", paymentOrder);

    if (paymentOrder) {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        name: "ReNeWaste",
        description: "Subscription Payment",
        order_id: paymentOrder.orderId,
        handler: function (response: any) {
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
            response;

          dispatch(
            verifySubscriptionPayment({
              razorpay_order_id,
              razorpay_payment_id,
              razorpay_signature,
              planId: plan._id,
              amount: plan.price,
              billingCycle: plan.billingCycle,
            })
          )
            .unwrap()
            .then(() => {
              dispatch(fetchSubscrptnPayments());

              Swal.fire("Success", "Payment successful!", "success").then(
                () => {
                  onClose();
                }
              );
            })
            .catch(() => {
              Swal.fire("Error", "Payment verification failed.", "error");
            });
        },
        prefill: {
          name: plan.plantName,
        },
        theme: {
          color: "#28a745",
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    }
  };

  return (
    <Modal
      title="Confirm Subscription Payment"
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
    >
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-5 text-gray-800">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-700 mb-1">
            Confirm Your Subscription
          </h2>
          <p className="text-sm text-gray-500">
            Please review the details before proceeding with payment.
          </p>
        </div>
        {/* plant details */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-1 mb-3">
            🏭 Plant Details
          </h3>
          <div className="grid gap-3">
            <div className="flex justify-between">
              <span className="font-semibold">Wasteplant Name:</span>
              <span>{plan.plantName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Wasteplant License:</span>
              <span>{plan.license}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Owner Name:</span>
              <span>{plan.ownerName}</span>
            </div>
          </div>
        </div>
        {/* subscription details */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-1 mb-3">
            📦 Subscription Details
          </h3>
          <div className="grid gap-3">
            <div className="flex justify-between">
              <span className="font-semibold">Subscription Plan:</span>
              <span>{plan.planName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Billing Cycle:</span>
              <span>{plan.billingCycle}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Amount:</span>
              <span className="text-lg font-bold text-green-700">
                ₹{plan.price}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={handlePayment}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
        >
          Pay ₹{plan.price} Now
        </button>
      </div>
    </Modal>
  );
};

export default SubscriptionPayModal;
