import Header from "../../components/user/Header";
import Footer from "../../components/user/Footer";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import {
  clearPaymentError,
  getAllPayments,
  repay,
  verifyPayment,
} from "../../redux/slices/user/userPaymentSlice";
import { formatDateToDDMMYYYY } from "../../utils/formatDate";
import { useAppDispatch } from "../../redux/hooks";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { RazorpayResponse } from "../../types/pickupReq/paymentTypes";


const Payments = () => {
  const [activeTab, setActiveTab] = useState<"paid" | "refund" | "pending">(
    "paid"
  );
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { payments, error } = useSelector(
    (state: RootState) => state.userPayment
  );
 

  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: "error",
        title: "Retry Failed",
        text: error,
        confirmButtonColor: "#d33",
      });
      dispatch(clearPaymentError());
    }
  }, [error, dispatch]);
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
    const response = await dispatch(repay({ pickupReqId, amount })).unwrap();

    const { orderId, amount: repayAmt, pickupReqId: pickupId } = response;
    console.log("razorpayOrderId", repayAmt, orderId);
    const res = await loadRazorpayScript();
    if (!res) {
      toast("Razorpay SDK failed to load.");
      return;
    }
    if (orderId && repayAmt) {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: repayAmt * 100,
        currency: "INR",
        name: "ReNeWaste",
        description: "Payment for Pickup Request",
        order_id: orderId,
        handler: function (response: RazorpayResponse) {
          console.log("Payment successful", response);
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
            response;
          dispatch(
            verifyPayment({
              razorpay_order_id,
              razorpay_payment_id,
              razorpay_signature,
              pickupReqId: pickupId,
              amount: repayAmt,
            })
          )
            .unwrap()
            .then((res) => {
              console.log("resss",res);
              
              Swal.fire({
                icon: "success",
                title: "Payment Successful!",
                text: res.message || "Your payment was verified successfully.",
                confirmButtonColor: "#28a745",
              })

              .then(() => {
                dispatch(getAllPayments());
                navigate("/payment-history");
              });
            })
            .catch((error) => {
              Swal.fire({
                icon: "error",
                title: "Payment Failed",
                text: error || "Payment verification failed. Please try again.",
                confirmButtonColor: "#d33",
              });
            });
        },
        prefill: {
          name: "Renewaste",
          email: "renewaste@example.com",
          contact: "9999999999",
        },
        notes: {},
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
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab("paid")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === "paid"
                ? "bg-green-600 text-white"
                : "bg-green-100 text-green-700"
            }`}
          >
            Paid Transactions
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === "pending"
                ? "bg-orange-600 text-white"
                : "bg-orange-100 text-orange-700"
            }`}
          >
            Pending Payments
          </button>
          <button
            onClick={() => setActiveTab("refund")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === "refund"
                ? "bg-purple-600 text-white"
                : "bg-purple-100 text-purple-700"
            }`}
          >
            Refunded/Cancelled Transactions
          </button>
        </div>

        {payments && payments.length > 0 ? (
          <div className="grid md:grid-cols-1 gap-6">
            {payments
              .filter((payment: any) => {
                if (activeTab === "paid") {
                  return (
                    payment?.payment?.status === "Paid" &&
                    payment?.payment?.refundStatus === null
                  );
                } else if (activeTab === "pending") {
                  return (
                    payment?.payment?.status === "Pending" ||
                    payment?.payment?.status === "InProgress"
                  );
                  // return payment?.payment?.status === "Pending";
                } else {
                  return payment?.payment?.refundStatus !== null;
                }
              })
              .map((payment: any) => (
                <div
                  key={payment._id}
                  className="bg-white border border-green-300 rounded-lg shadow p-6 space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-green-800">
                      Amount: ₹{payment?.payment?.amount}
                    </h2>

                    {payment?.payment?.refundStatus === null ? (
                      <span
                        className={`px-3 py-1 text-sm rounded-full font-medium ${
                          payment?.payment?.status === "Paid"
                            ? "bg-green-100 text-green-700 border border-green-500"
                            : "bg-red-100 text-red-700 border border-red-500"
                        }`}
                      >
                        {payment?.payment?.status}
                      </span>
                    ) : (
                      <span
                        className={`px-3 py-1 text-sm rounded-full font-medium ${
                          payment?.payment?.refundStatus === "Pending"
                            ? "bg-yellow-100 text-yellow-700 border border-yellow-500"
                            : payment?.payment?.refundStatus === "Processing"
                            ? "bg-blue-100 text-blue-700 border border-blue-500"
                            : "bg-purple-100 text-purple-700 border border-purple-500"
                        }`}
                      >
                        Refund Status: {payment?.payment?.refundStatus}
                      </span>
                    )}
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
                    {payment.payment.status === "Paid" && (
                      <>
                        {payment.payment.refundRequested ? (
                          <p>
                            <strong>Refund Date:</strong>{" "}
                            {formatDateToDDMMYYYY(payment?.payment?.refundAt)}
                          </p>
                        ) : (
                          <p>
                            <strong>Payment Date:</strong>{" "}
                            {formatDateToDDMMYYYY(payment?.payment?.paidAt)}
                          </p>
                        )}
                      </>
                    )}
                  </div>

                  {/* {payment?.payment?.status === "Pending" || payment?.payment?.status === "InProgress" && (
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded"
                      onClick={() =>
                        handleRetry(payment._id, payment?.payment?.amount)
                      }
                    >
                      Retry Payment
                    </button>
                  )} */}
                  {(() => {
                    const status = payment?.payment?.status;
                    const expiresAt = payment?.payment?.inProgressExpiresAt;
                    const now = new Date();
                    const expired =
                      status === "InProgress" &&
                      expiresAt &&
                      new Date(expiresAt) <= now;

                    if (status === "Pending" || expired) {
                      return (
                        <button
                          className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded"
                          onClick={() =>
                            handleRetry(payment._id, payment?.payment?.amount)
                          }
                        >
                          Retry Payment
                        </button>
                      );
                    } else if (status === "InProgress") {
                      return (
                        <p className="text-sm text-orange-600">
                          You’ve already initiated a payment. Please wait a few
                          minutes (until{" "}
                          <strong>
                            {new Date(expiresAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </strong>{" "}
                          ) to retry.
                        </p>
                      );
                    }
                    return null;
                  })()}
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
