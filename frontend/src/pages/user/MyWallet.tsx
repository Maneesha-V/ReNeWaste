import { useEffect, useState } from "react";
import Footer from "../../components/user/Footer";
import Header from "../../components/user/Header";
import AddMoneyModal from "../../components/common/AddMoneyModal";
import {
  createAddMoneyOrder,
  getWallet,
  retryAddMoney,
  verifyWalletAddPayment,
} from "../../redux/slices/user/userWalletSlice";
import { getAxiosErrorMessage } from "../../utils/handleAxiosError";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../redux/hooks";
import { AddMoneyReq } from "../../types/wallet/walletTypes";
import Swal from "sweetalert2";
import { RazorpayResponse } from "../../types/pickupReq/paymentTypes";
import { loadRazorpayScript } from "../../utils/razorpayUtils";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const MyWallet = () => {
  const dispatch = useAppDispatch();
  const [showModal, setShowModal] = useState(false);
  const userWallet = useSelector(
    (state: RootState) => state.userWallet.userWallet
  );
  console.log("userWallet", userWallet);

  useEffect(() => {
    dispatch(getWallet());
  }, [dispatch]);

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
            console.log("response", response);

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
              })
            )
              .unwrap()
              .then((res) => {
                console.log("verify---res", res);
                Swal.fire({
                  icon: "success",
                  title: "Payment Successful!",
                  text: `₹${res.walletVerPayOrder.amount} ${res.message}`,
                  confirmButtonColor: "#28a745",
                });
                dispatch(getWallet());
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

        const razorpay = new (window as any).Razorpay(options);

        razorpay.on("modal.closed", function () {
          console.warn("Razorpay modal closed by user.");
          toast.info("Payment window closed.");
          dispatch(getWallet());
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
        retryAddMoney(transactionId)
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
            console.log("response", response);

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
              })
            )
              .unwrap()
              .then((res) => {
                console.log("verify---res", res);
                Swal.fire({
                  icon: "success",
                  title: "Payment Successful!",
                  text: `₹${res.walletVerPayOrder.amount} ${res.message}`,
                  confirmButtonColor: "#28a745",
                });
                dispatch(getWallet());
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

        const razorpay = new (window as any).Razorpay(options);

        razorpay.on("modal.closed", function () {
          console.warn("Razorpay modal closed by user.");
          toast.info("Payment window closed.");
          dispatch(getWallet());
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
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-6">
        {/* Wallet Balance Card */}
        <div className="bg-white shadow-md rounded-2xl p-6 mb-6 text-center">
          <h2 className="text-xl font-semibold mb-2">My Wallet</h2>
          <p className="text-3xl font-bold text-green-600">
            ₹ {userWallet?.balance?.toFixed(2) ?? 0}
          </p>
          <div className="flex justify-center gap-4 mt-4 flex-wrap">
            <button
              onClick={() => setShowModal(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
            >
              Add Money
            </button>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="p-3 border-b">Date</th>
                  <th className="p-3 border-b">Description</th>
                  <th className="p-3 border-b">Amount</th>
                  <th className="p-3 border-b">Status</th>
                  <th className="p-3 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {userWallet &&
                userWallet.transactions &&
                userWallet.transactions.length > 0 ? (
                  userWallet.transactions.map((txn, idx) => (
                    <tr key={idx}>
                      <td className="p-3 border-b">
                        {txn.paidAt
                          ? new Date(txn.paidAt).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : new Date(txn.updatedAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                      </td>
                      <td className="p-3 border-b">{txn.description}</td>
                      <td
                        className={`p-3 border-b font-medium ${
                          txn.type === "Credit"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {txn.type === "Credit"
                          ? `+ ₹${txn.amount}`
                          : `- ₹${Math.abs(txn.amount)}`}
                      </td>
                      <td
                        className={`p-3 border-b ${
                          txn.status === "Paid"
                            ? "text-green-500"
                            : txn.status === "Pending"
                            ? "text-yellow-500"
                            : txn.status === "InProgress"
                            ? "text-orange-500"
                            : "text-red-500"
                        }`}
                      >
                        {txn.status}
                      </td>
                      <td className="p-3 border-b">
                        {txn.status === "InProgress" && (
                          <button
                            onClick={() => handleRetry(txn._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                          >
                            Retry
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-3 text-center text-gray-500">
                      No transactions yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />

      {/* Add Money Modal */}
      <AddMoneyModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleAddMoney}
      />
    </div>
  );
};

export default MyWallet;
