// import React, { useEffect, useState } from "react";
// import { Modal, Radio, Button, Card, Row, Col } from "antd";
// import { useAppDispatch } from "../../redux/hooks";
// import { fetchSubscriptionPlans } from "../../redux/slices/wastePlant/wastePlantSubscriptionSlice";
// import { useSelector } from "react-redux";
// import { RootState } from "../../redux/store";

// interface Plan {
//   id: string;
//   name: string;
//   price: number;
//   duration: string;
//   description?: string;
// }

// interface SubscriptionModalProps {
//   visible: boolean;
//   onClose: () => void;
// }

// const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
//   visible,
//   onClose
// }) => {
//   const dispatch = useAppDispatch();
//   const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
//     useEffect(() => {
//       dispatch(fetchSubscriptionPlans());
//     }, [dispatch]);
//       const plans  = useSelector(
//         (state: RootState) => state.wastePlantSubscription.subscriptionPlans
//       );
//   //  const plans = [
//   //   { id: "basic", name: "Basic", price: 199, duration: "month", description: "Access to basic features" },
//   //   { id: "premium", name: "Premium", price: 499, duration: "month", description: "Premium support and features" },
//   // ];

//   const handleSubscribe = (selectedPlan: any) => {
//     console.log("User selected plan:", selectedPlan);
//     // Call payment gateway or API here
//   };
//   const handleOk = () => {
//     const selected = plans.find((plan) => plan._id === selectedPlanId);
//     if (selected) {
//       handleSubscribe(selected);
//     }
//   };

//   return (
//     <Modal
//       title="Choose a Subscription Plan"
//       visible={visible}
//       onCancel={onClose}
//       onOk={handleOk}
//       okButtonProps={{ disabled: !selectedPlanId }}
//     >
//       <Radio.Group
//         onChange={(e) => setSelectedPlanId(e.target.value)}
//         value={selectedPlanId}
//         style={{ width: "100%" }}
//       >
//         <Row gutter={[16, 16]}>
//           {plans.map((plan) => (
//             <Col span={24} key={plan._id}>
//               <Card bordered>
//                 <Radio value={plan._id}>
//                   <div>
//                     <strong>{plan.planName}</strong> - ₹{plan.price} / {plan.billingCycle}
//                     <p style={{ margin: "5px 0" }}>{plan.description}</p>
//                   </div>
//                 </Radio>
//               </Card>
//             </Col>
//           ))}
//         </Row>
//       </Radio.Group>
//     </Modal>
//   );
// };

// export default SubscriptionModal;
import React, { useEffect, useState } from "react";
import { Modal, Radio } from "antd";
import { useAppDispatch } from "../../redux/hooks";
import { fetchSubscriptionPlans } from "../../redux/slices/wastePlant/wastePlantSubscriptionSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import clsx from "clsx"; 
import { SubsptnPlans } from "../../types/subscription/subscriptionTypes";

interface SubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  visible,
  onClose
}) => {
  const dispatch = useAppDispatch();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchSubscriptionPlans());
  }, [dispatch]);

  const plans = useSelector(
    (state: RootState) => state.wastePlantSubscription.subscriptionPlans
  );

  const handleSubscribe = (selectedPlan: SubsptnPlans) => {
    console.log("User selected plan:", selectedPlan);
    // Trigger payment gateway or API
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
                        "hover:border-green-400 hover:bg-green-100": !isSelected
                      }
                    )}
                  >
                    <Radio value={plan._id} className="hidden" />
                    <h3 className="text-lg font-semibold text-green-700">{plan.planName}</h3>
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
