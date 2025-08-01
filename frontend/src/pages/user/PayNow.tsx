import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  formatDateToDDMMYYYY,
  formatTimeTo12Hour,
} from "../../utils/formatDate";
import { useAppDispatch } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import {
  clearPaymentError,
  createPaymentOrder,
  verifyPayment,
} from "../../redux/slices/user/userPaymentSlice";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  fetchtPickupPlans,
  updatePickupPaymentStatus,
} from "../../redux/slices/user/userPickupSlice";
import { PayNowProps } from "../../types/userTypes";

const PayNow = ({ onClose }: PayNowProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const pickup = useSelector((state: RootState) => state.userPayment.pickup);
  const amount = useSelector((state: RootState) => state.userPayment.amount);
 const { paymentOrder, error } = useSelector(
    (state: RootState) => state.userPayment
  );
  console.log("paymentOrder", paymentOrder);
  console.log("pickup", pickup);
  console.log("amount", amount);
  console.log("pickupId", pickup._id);
useEffect(() => {
  if (error) {
    Swal.fire({
      icon: "error",
      title: "Payment Error",
      text: error,
      confirmButtonColor: "#d33",
    }).then(() => {
      dispatch(clearPaymentError());
      if (
        error.includes("already in progress")
      ) {
        onClose();
      }
    })
    
  }
}, [error, dispatch, onClose]);
  useEffect(() => {
    const initiatePayment = async () => {
      if (!pickup || !amount) {
        navigate("/pickup-plans", { replace: true });
        return;
      }
      const pickupReqId = pickup._id;

      if(pickupReqId) {
        console.log("Dispatching payment:", { amount, pickupReqId });
        await dispatch(createPaymentOrder({ amount, pickupReqId })).unwrap();
      }
      // onClose(); 
    };

    initiatePayment();
  }, [pickup, amount, navigate, dispatch, onClose]);
 

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
    const res = await loadRazorpayScript();
    if (!res) {
      toast("Razorpay SDK failed to load.");
      return;
    }
    if (paymentOrder) {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: paymentOrder.amount * 100,
        currency: paymentOrder.currency,
        name: "Renewaste",
        description: "Payment for pickup request",
        order_id: paymentOrder.orderId,
        handler: function (response: any) {
          console.log("response", response);

          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
            response;

          dispatch(
            verifyPayment({
              razorpay_order_id,
              razorpay_payment_id,
              razorpay_signature,
              pickupReqId: paymentOrder.pickupReqId,
              amount: paymentOrder.amount,
            })
          )
            .unwrap()
            .then((res) => {
              dispatch(
                updatePickupPaymentStatus({
                  pickupReqId: res.updatedPayment.pickupReqId,
                  updatedPayment: res.updatedPayment.payment,
                })
              );
              dispatch(fetchtPickupPlans())
              Swal.fire({
                icon: "success",
                title: "Payment Successful!",
                text: res.message || "Your payment was verified successfully.",
                confirmButtonColor: "#28a745",
              }).then(() => {
                onClose();
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
        prefill: {
          name: pickup?.user?.firstName + " " + pickup?.user?.lastName,
          email: pickup?.user?.email,
          contact: pickup?.user?.phone,
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
    <div className="min-h-screen bg-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-lg overflow-hidden border border-green-500">
        {/* Header */}
        <div className="bg-green-200 text-green-900 text-xl font-semibold px-6 py-4">
          Confirm Your Payment
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-6">
          {/* Pickup Details */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800 bg-green-100 px-2 py-1 rounded">
              Pickup Details
            </h3>
            <div className="space-y-1 text-gray-700 break-words">
              <p>
                <span className="font-medium">Pickup ID:</span>{" "}
                {pickup?.pickupId}
              </p>
              <p>
                <span className="font-medium">Waste Type:</span>{" "}
                {pickup?.wasteType}
              </p>
              <p>
                <span className="font-medium">Pickup Date:</span>{" "}
                {pickup?.rescheduledPickupDate
                  ? formatDateToDDMMYYYY(pickup.rescheduledPickupDate)
                  : formatDateToDDMMYYYY(pickup?.originalPickupDate)}
              </p>
              <p>
                <span className="font-medium">Pickup Time:</span>{" "}
                {pickup?.pickupTime
                  ? formatTimeTo12Hour(pickup?.pickupTime)
                  : "—"}
              </p>
              <p>
                <span className="font-medium">Driver Name:</span>{" "}
                {pickup?.driverId?.name}
              </p>
              <p>
                <span className="font-medium">Driver Contact:</span>{" "}
                {pickup?.driverId?.contact}
              </p>
            </div>
          </div>

          {/* User Details */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800 bg-green-100 px-2 py-1 rounded">
              User Details
            </h3>
            <div className="space-y-1 text-gray-700">
              <p>
                <span className="font-medium">Name:</span>{" "}
                {pickup?.user?.firstName} {pickup?.user?.lastName}
              </p>
              <p>
                <span className="font-medium">Contact:</span>{" "}
                {pickup?.user?.phone}
              </p>
            </div>
          </div>

          {/* Address Info */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800 bg-green-100 px-2 py-1 rounded">
              Pickup Address
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
              {/* Left Address Column */}
              <div className="space-y-1">
                <p>
                  <span className="font-medium">Address Line 1:</span>{" "}
                  {pickup?.address?.addressLine1}
                </p>
                <p>
                  <span className="font-medium">Address Line 2:</span>{" "}
                  {pickup?.address?.addressLine2 || "—"}
                </p>
                <p>
                  <span className="font-medium">Location:</span>{" "}
                  {pickup?.address?.location}
                </p>
                {/* <p>
                  <span className="font-medium">Taluk:</span>{" "}
                  {pickup?.address?.taluk}
                </p> */}
              </div>

              {/* Right Address Column */}
              <div className="space-y-1">
                <p>
                  <span className="font-medium">District:</span>{" "}
                  {pickup?.address?.district}
                </p>
                <p>
                  <span className="font-medium">State:</span>{" "}
                  {pickup?.address?.state}
                </p>
                <p>
                  <span className="font-medium">Pincode:</span>{" "}
                  {pickup?.address?.pincode}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="text-center pt-2">
            <p className="text-xl font-bold text-gray-900 mb-3">
              Amount to Pay: ₹{amount}
            </p>
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded w-full cursor-pointer"
              onClick={handlePayment}
            >
              Pay ₹{amount} Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayNow;
