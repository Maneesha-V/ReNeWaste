import Header from "../../components/user/Header";
import Footer from "../../components/user/Footer";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useEffect, useMemo } from "react";
import {
  clearPaymentError,
  downloadReceipt,
  getAllPayments,
  repay,
  updateRetryPickupPaymentStatus,
  verifyPayment,
} from "../../redux/slices/user/userPaymentSlice";
import { formatDateToDDMMYYYY } from "../../utils/formatDate";
import { useAppDispatch } from "../../redux/hooks";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  PaymentSummary,
  RazorpayResponse,
} from "../../types/pickupReq/paymentTypes";
import usePagination from "../../hooks/usePagination";
import { debounce } from "lodash";
import PaginationSearch from "../../components/common/PaginationSearch";
import { Pagination } from "antd";
import { loadRazorpayScript } from "../../utils/razorpayUtils";

const Payments = () => {
  const dispatch = useAppDispatch();
  const { payments, total, error } = useSelector(
    (state: RootState) => state.userPayment,
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
  const {
    currentPage,
    setCurrentPage,
    pageSize,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
  } = usePagination();

  const debouncedFetchPayments = useMemo(
    () =>
      debounce(
        (page: number, limit: number, query: string, filter?: string) => {
          dispatch(getAllPayments({ page, limit, search: query, filter }));
        },
        500,
      ),
    [],
  );
  useEffect(() => {
    debouncedFetchPayments(currentPage, pageSize, search, statusFilter);
    return () => {
      debouncedFetchPayments.cancel();
    };
  }, [currentPage, pageSize, search, statusFilter]);

  console.log("payments", payments);

  const handleRetry = async (pickupReqId: string, amount: number) => {
    const response = await dispatch(
      repay({ pickupReqId, amount }),
    ).unwrap();

    const {
      orderId,
      amount: repayAmt,
      pickupReqId: pickupId,
    } = response;

    console.log("razorpayOrderId", repayAmt, orderId);

    const loaded = await loadRazorpayScript();

    if (!loaded) {
      toast("Razorpay SDK failed to load.");
      return;
    }

    if (!orderId || !repayAmt || !pickupId) {
      toast("Invalid payment details.");
      return;
    }

    const options: RazorpayOptions = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: repayAmt * 100,
      currency: "INR",
      name: "ReNeWaste",
      description: "Payment for Pickup Request",
      order_id: orderId,

      handler: async (response: RazorpayResponse) => {
        try {
          console.log("Payment successful", response);

          const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
          } = response;

          const result = await dispatch(
            verifyPayment({
              razorpay_order_id,
              razorpay_payment_id,
              razorpay_signature,
              pickupReqId: pickupId,
              amount: repayAmt,
            }),
          ).unwrap();

          console.log("resss", result);

          await dispatch(
            updateRetryPickupPaymentStatus({
              pickupReqId: result.updatedPayment.pickupReqId,
              payment: result.updatedPayment.payment,
            }),
          );

          await Swal.fire({
            icon: "success",
            title: "Payment Successful!",
            text:
              result.message ||
              "Your payment was verified successfully.",
            confirmButtonColor: "#28a745",
          });

          // navigate("/payment-history");
        } catch (error) {
          console.error("Payment verification failed:", error);

          Swal.fire({
            icon: "error",
            title: "Payment Failed",
            text:
              typeof error === "string"
                ? error
                : "Payment verification failed. Please try again.",
            confirmButtonColor: "#d33",
          });
        }
      },

      prefill: {
        name: "Renewaste",
        email: "renewaste@example.com",
        contact: "9999999999",
      },

      notes: {},
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
};
  const handleDownload = async (pickupReqId: string, pickupId: string) => {
    const blob = await dispatch(downloadReceipt(pickupReqId)).unwrap();

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = `Receipt-${pickupId}.pdf`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  };
  return (
    <div className="min-h-screen bg-green-50">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-green-700 mb-6">
          Your Payments
        </h1>

        <PaginationSearch
          searchValue={search}
          onSearchChange={setSearch}
          paymentStatusFilterValue={statusFilter}
          onPaymentStatusFilterChange={setStatusFilter}
        />

{payments && payments.length > 0 ? (
  <div className="space-y-5">
    {payments.map((payment: PaymentSummary) => {
      const status = payment?.payment?.status;

      const expiresAt = payment?.payment?.inProgressExpiresAt
        ? new Date(payment.payment.inProgressExpiresAt)
        : null;

      const now = new Date();

      const isPaymentWaiting =
        status === "Pending" &&
        expiresAt &&
        expiresAt > now;

      const isRetryAvailable =
        status === "Pending" &&
        (!expiresAt || expiresAt <= now);

      const isRefund =
        payment?.payment?.refundStatus !== null;

      return (
        <div
          key={payment._id}
          className="overflow-hidden bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
        >
          {/* =====================================================
              PAYMENT HEADER
          ====================================================== */}
          <div className="relative overflow-hidden bg-green-600 px-5 py-4">
            {/* Decorative circles */}
            <div className="absolute -right-5 -top-8 h-28 w-28 rounded-full bg-white/10" />
            <div className="absolute right-20 -bottom-10 h-24 w-24 rounded-full bg-white/10" />

            <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

              {/* LEFT */}
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm text-2xl">
                  💳
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-green-50 mb-1">
                    Payment Transaction
                  </p>

                  <h2 className="text-xl md:text-2xl font-bold text-white m-0">
                    ₹{payment?.payment?.amount}
                  </h2>
                </div>
              </div>

              {/* STATUS */}
              <div>
                {isRefund ? (
                  <span
                    className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold bg-white ${
                      payment?.payment?.refundStatus === "Pending"
                        ? "text-yellow-600"
                        : payment?.payment?.refundStatus === "Processing"
                          ? "text-blue-600"
                          : "text-purple-600"
                    }`}
                  >
                    ↩ Refund: {payment?.payment?.refundStatus}
                  </span>
                ) : (
                  <span
                    className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold bg-white ${
                      status === "Paid"
                        ? "text-green-700"
                        : status === "Pending"
                          ? "text-orange-600"
                          : "text-red-600"
                    }`}
                  >
                    {status === "Paid"
                      ? "✓ Payment Successful"
                      : status === "Pending"
                        ? "⏳ Payment Pending"
                        : status}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* =====================================================
              PAYMENT CONTENT
          ====================================================== */}
          <div className="p-5 md:p-6">

            {/* TRANSACTION DETAILS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

              {/* ORDER ID */}
              {(payment?.payment?.walletOrderId ||
                payment?.payment?.razorpayOrderId) && (
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
                  <p className="text-xs uppercase tracking-wide text-emerald-600 mb-2">
                    Order ID
                  </p>

                  <p className="text-sm font-semibold text-gray-700 break-all m-0">
                    {payment?.payment?.walletOrderId ||
                      payment?.payment?.razorpayOrderId}
                  </p>
                </div>
              )}

              {/* PICKUP ID */}
              <div className="rounded-xl border border-teal-100 bg-teal-50/60 p-4">
                <p className="text-xs uppercase tracking-wide text-teal-600 mb-2">
                  Pickup ID
                </p>

                <p className="text-sm font-semibold text-gray-700 m-0">
                  {payment.pickupId}
                </p>
              </div>

              {/* WASTE TYPE */}
              <div className="rounded-xl border border-lime-100 bg-lime-50/60 p-4">
                <p className="text-xs uppercase tracking-wide text-lime-600 mb-2">
                  Waste Type
                </p>

                <p className="text-sm font-semibold text-gray-700 m-0">
                  ♻️ {payment.wasteType}
                </p>
              </div>

              {/* PAYMENT METHOD */}
              <div className="rounded-xl border border-cyan-100 bg-cyan-50/60 p-4">
                <p className="text-xs uppercase tracking-wide text-cyan-600 mb-2">
                  Payment Method
                </p>

                <p className="text-sm font-semibold text-gray-700 m-0">
                  {payment?.payment?.method || "N/A"}
                </p>
              </div>
            </div>

            {/* =================================================
                DATE
            ================================================== */}
            {payment.payment.status === "Paid" && (
              <div className="mt-4 rounded-xl bg-gray-50 border border-gray-100 p-4">

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
                    📅
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 m-0">
                      {payment.payment.refundRequested &&
                      payment.payment.refundStatus !== null
                        ? "Refund Date"
                        : "Payment Date"}
                    </p>

                    <p className="font-semibold text-gray-700 m-0">
                      {payment.payment.refundRequested &&
                      payment.payment.refundStatus !== null
                        ? formatDateToDDMMYYYY(
                            payment?.payment?.refundAt
                          )
                        : formatDateToDDMMYYYY(
                            payment?.payment?.paidAt
                          )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* =================================================
                PAYMENT WAITING
            ================================================== */}
            {isPaymentWaiting && (
              <div className="mt-4 flex items-start gap-3 rounded-xl border border-orange-200 bg-orange-50 p-4">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600 text-lg">
                  ⏳
                </div>

                <div>
                  <p className="text-sm font-semibold text-orange-800 m-0">
                    Payment already initiated
                  </p>

                  {!isNaN(expiresAt!.getTime()) && (
                    <p className="text-xs text-orange-700 mt-1 mb-0">
                      Please wait until{" "}
                      <strong>
                        {expiresAt!.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </strong>{" "}
                      before trying again.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* =================================================
                ACTIONS
            ================================================== */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-5 pt-4 border-t border-gray-100">

              {/* ECO MESSAGE */}
              <div className="flex items-center gap-2 text-sm text-green-600">
                <span className="text-lg">🌱</span>

                <span className="font-medium">
                  Thank you for supporting sustainable waste management
                </span>
              </div>

              {/* BUTTONS */}
              <div className="flex flex-wrap gap-2">

                {/* DOWNLOAD RECEIPT */}
                {payment?.payment?.status === "Paid" && (
                  <button
                    onClick={() =>
                      handleDownload(
                        payment._id,
                        payment.pickupId
                      )
                    }
                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition"
                  >
                    📄 Download Receipt
                  </button>
                )}

                {/* RETRY */}
                {isRetryAvailable && (
                  <button
                    className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition"
                    onClick={() =>
                      handleRetry(
                        payment._id,
                        payment?.payment?.amount
                      )
                    }
                  >
                    🔄 Retry Payment
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    })}
  </div>
) : (
  <div className="flex flex-col items-center justify-center py-16 text-gray-500">
    <div className="text-5xl mb-3">💳</div>

    <p className="text-lg font-medium">
      No payments found
    </p>

    <p className="text-sm text-gray-400">
      Your payment transactions will appear here.
    </p>
  </div>
)}
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={total}
          onChange={setCurrentPage}
          showSizeChanger={false}
          style={{ marginTop: 16, textAlign: "right" }}
        />
      </div>
      <Footer />
    </div>
  );
};

export default Payments;
