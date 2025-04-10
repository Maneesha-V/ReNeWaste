import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { resendOtp, verifyOtp, signup, verifyOtpSignup, resendOtpSignup } from "../../redux/slices/user/userSlice";
import { useAppDispatch } from "../../redux/hooks";
import { useNavigate } from "react-router-dom";

const OtpVerification = ({ formData }: { formData: any }) => {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const [resendLoading, setResendLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const canResend = timer === 0;

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async () => {
    try {
      await dispatch(verifyOtpSignup({ email: formData.email, otp })).unwrap();
      await dispatch(signup(formData)).unwrap();
      toast.success("Account created successfully!");
      navigate("/");
    } catch (error: any) {
      toast.error(error || "Failed to verify OTP");
      setOtp("");       
      setTimer(0);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    try {
      setResendLoading(true);
      await dispatch(resendOtpSignup(formData.email)).unwrap();
      toast.info("OTP resent!");
      setOtp("");       // Clear OTP field
      setTimer(30);     // Restart timer
    } catch (error: any) {
      toast.error(error || "Resend failed");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center text-green-600 mb-4">
          OTP Verification
        </h2>
        <p className="text-center text-sm text-gray-600 mb-2">
          Enter the OTP sent to <strong>{formData.email}</strong>
        </p>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full p-2 mb-4 border rounded focus:ring-green-500"
          placeholder="Enter OTP"
        />
        <button
          onClick={handleVerify}
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 mb-2"
        >
          Verify OTP
        </button>

        <button
          onClick={handleResendOtp}
          className={`w-full text-white p-2 rounded ${
            canResend
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!canResend || resendLoading}
        >
          {resendLoading
            ? "Resending..."
            : canResend
            ? "Resend OTP"
            : `Resend OTP (${timer}s)`}
        </button>
      </div>
    </div>
  );
};

export default OtpVerification;
