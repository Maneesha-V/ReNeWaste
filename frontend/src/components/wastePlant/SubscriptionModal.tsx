import React, { useEffect, useState } from "react";
import { Modal, Radio } from "antd";
import { useAppDispatch } from "../../redux/hooks";
import { fetchSubscriptionPlans } from "../../redux/slices/wastePlant/wastePlantSubscriptionSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import clsx from "clsx";
import { SubsptnPlans } from "../../types/subscription/subscriptionTypes";
import { SubscriptionModalProps } from "../../types/common/modalTypes";
import {
  createSubscriptionOrder,
  verifySubscriptionPayment,
} from "../../redux/slices/wastePlant/wastePlantPaymentSlice";
import { getAxiosErrorMessage } from "../../utils/handleAxiosError";
import { loadRazorpayScript } from "../../utils/razorpayUtils";
import Swal from "sweetalert2";
import { RazorpayResponse } from "../../types/pickupReq/paymentTypes";

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  visible,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchSubscriptionPlans());
  }, [dispatch]);

  const plans = useSelector(
    (state: RootState) => state.wastePlantSubscription.subscriptionPlans
  );

  const handleSubscribe = async (selectedPlan: SubsptnPlans) => {
    try {
      console.log("User selected plan:", selectedPlan);
      const { paymentOrder } = await dispatch(
        createSubscriptionOrder(selectedPlan._id)
      ).unwrap();
      console.log("orderResp", paymentOrder);

      if (!paymentOrder || !paymentOrder.orderId) {
        Swal.fire("Failed to create Razorpay order");
        return;
      }

      // 2. Load Razorpay script
      await loadRazorpayScript();

      // 3. Setup Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: paymentOrder.amount, // amount in paise
        currency: paymentOrder.currency,
        name: "ReNeWaste",
        description: selectedPlan.planName,
        order_id: paymentOrder.orderId,
        handler: async function (response: RazorpayResponse) {
          // 4. On success → verify payment
          console.log("response",response);
          
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
            response;

          dispatch(
            verifySubscriptionPayment({
              razorpay_order_id,
              razorpay_payment_id,
              razorpay_signature,
              planId: selectedPlan._id,
              amount: selectedPlan.price,
              billingCycle: selectedPlan.billingCycle,
            })
          )
            .unwrap()
            .then((res) => {
              Swal.fire("Success", res?.message, "success").then(
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
          email: "user@example.com",
        },
        theme: { color: "#4CAF50" },
      };

      // 5. Open Razorpay Checkout
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
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

  const handleOk = () => {
    const selected = plans.find((plan) => plan._id === selectedPlanId);
    if (selected) {
      handleSubscribe(selected);
    }
  };

  return (
    <Modal
      title="🌱 Choose a Subscription Plan"
      open={visible}
      onCancel={onClose}
      onOk={handleOk}
      okText="Pay"
      okButtonProps={{ disabled: !selectedPlanId }}
      className="w-full max-w-4xl"
      width={800}
    >
      <div className="w-full">
        <Radio.Group
          onChange={(e) => setSelectedPlanId(e.target.value)}
          value={selectedPlanId}
          className="w-full"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plans.map((plan) => {
              const isSelected = selectedPlanId === plan._id;

              return (
                <label key={plan._id}>
                  <div
                    className={clsx(
                      "border p-4 rounded-xl shadow transition-all cursor-pointer",
                      {
                        "border-green-500 bg-green-50": isSelected,
                        "hover:border-green-400 hover:bg-green-100":
                          !isSelected,
                      }
                    )}
                  >
                    <Radio value={plan._id} className="hidden" />
                    <h3 className="text-lg font-semibold text-green-700">
                      {plan.planName}
                    </h3>
                    <p className="text-sm text-gray-600">{plan.description}</p>
                    <p className="mt-2 text-base font-medium text-black">
                      ₹{plan.price} / {plan.billingCycle}
                    </p>
                    <ul className="mt-2 text-xs text-gray-500 list-disc list-inside">
                      <li>Users: {plan.userLimit}</li>
                      <li>Drivers: {plan.driverLimit}</li>
                      <li>Trucks: {plan.truckLimit}</li>
                      <li>Trial Days: {plan.trialDays}</li>
                    </ul>
                  </div>
                </label>
              );
            })}
          </div>
        </Radio.Group>
      </div>
    </Modal>
  );
};

export default SubscriptionModal;
