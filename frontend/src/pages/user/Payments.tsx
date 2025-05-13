import Header from "../../components/user/Header";
import Footer from "../../components/user/Footer";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useEffect } from "react";
import {
  getAllPayments,
  repay,
  verifyPayment,
} from "../../redux/slices/user/userPaymentSlice";
import { formatDateToDDMMYYYY } from "../../utils/formatDate";
import { useAppDispatch } from "../../redux/hooks";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Payments = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const payments = useSelector(
    (state: RootState) => state.userPayment.payments
  );

  useEffect(() => {
    dispatch(getAllPayments());
  }, [dispatch]);
  console.log("payments", payments);
  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => reject("Razorpay SDK failed to load.");
      document.body.appendChild(script);
    });
  };
  const handleRetry = async (pickupReqId: string, amount: number) => {
    const response = await dispatch(repay({ pickupReqId, amount }));
    console.log("respp", response);

    const {
      orderId,
      amount: repayAmt,
      pickupReqId: pickupId,
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
        currency: "INR",
        name: "Your Company Name",
        description: "Payment for Pickup Request",
        order_id: orderId,
        handler: function (response: any) {
          console.log("Payment successful", response);
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
            response;
          dispatch(
            verifyPayment({
              razorpay_order_id,
              razorpay_payment_id,
              razorpay_signature,
              pickupReqId: pickupId,
              amount: repayAmt 
            })
          )
            .unwrap()
            .then(() => {
              Swal.fire({
                icon: "success",
                title: "Payment Successful!",
                text: "Your payment was verified successfully.",
                confirmButtonColor: "#28a745",
              }).then(() => {
                dispatch(getAllPayments());
                navigate("/payment-history");
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

  return (
    <div className="min-h-screen bg-green-50">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-green-700 mb-6">
          Your Payments
        </h1>

        {payments && payments.length > 0 ? (
          <div className="grid md:grid-cols-1 gap-6">
            {payments.map((payment: any) => (
              <div
                key={payment._id}
                className="bg-white border border-green-300 rounded-lg shadow p-6 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-green-800">
                    Amount: ₹{payment?.payment?.amount}
                  </h2>
                  <span
                    className={`px-3 py-1 text-sm rounded-full font-medium ${
                      payment?.payment?.status === "Paid"
                        ? "bg-green-100 text-green-700 border border-green-500"
                        : "bg-red-100 text-red-700 border border-red-500"
                    }`}
                  >
                    {payment.status}
                  </span>
                </div>

                <div className="text-gray-700">
                  <p>
                    <strong>Order ID:</strong>{" "}
                    {payment?.payment?.razorpayOrderId}
                  </p>
                  {payment?.payment?.razorpayPaymentId && (
                    <p>
                      <strong>Payment ID:</strong>{" "}
                      {payment.payment.razorpayPaymentId}
                    </p>
                  )}

                  <p>
                    <strong>Pickup ID:</strong> {payment.pickupId}
                  </p>
                  <p>
                    <strong>Waste Type:</strong> {payment.wasteType}
                  </p>
                  <p>
                    <strong>Payment Date:</strong>{" "}
                    {formatDateToDDMMYYYY(payment?.payment?.paidAt)}
                  </p>
                </div>

                {payment?.payment?.status !== "Paid" && (
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded"
                    onClick={() =>
                      handleRetry(payment._id, payment?.payment?.amount)
                    }
                  >
                    Retry Payment
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No payments found.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Payments;
