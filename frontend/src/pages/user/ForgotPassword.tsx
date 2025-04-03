import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  resendOtp,
  resetPassword,
  sendOtp,
  verifyOtp,
} from "../../redux/slices/user/userSlice";
import { useAppDispatch } from "../../redux/hooks";
import { Eye, EyeOff } from "lucide-react";
import { validatePassword } from "../../utils/passwordValidator";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(30); 
  const [canResend, setCanResend] = useState(false);
  // const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { loading } = useSelector((state: any) => state.user);

  useEffect(() => {
    let countdown: NodeJS.Timeout;
    if (timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(countdown);
  }, [timer]);
  
  const handleSendOtp = () => {
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    setError("");
    dispatch(sendOtp(email)).then((res: any) => {
      console.log("ressendOtp", res);
      if (res.payload?.message) {
        toast.success("OTP sent successfully!");
        setStep(2);
        setTimer(30);
        setCanResend(false);
      } else {
        setError(res.payload || "Failed to send OTP");
      }
    });
  };
  const handleVerifyOtp = () => {
    if (!otp.trim()) {
      setError("OTP is required")
      return;
    }
    setError("");
    dispatch(verifyOtp({ email, otp })).then((res: any) => {
      if (res.error) {
        setError(res.payload || "Invalid OTP");
        setOtp("")
      } else {
        toast.success("OTP verified successfully!");
        setStep(3);
      }
    });
  };
  const handleResendOtp = async () => {
    if (!canResend) return;
    setResendLoading(true);
    dispatch(resendOtp(email))
    .then((res: any) => {
      if (res.payload?.message) {
        toast.success("OTP resent successfully!");
        setTimer(30);
        setCanResend(false);
        setOtp("");
      } else {
        setError(res.payload || "Failed to resend OTP");
      }
    })
    .finally(() => setResendLoading(false));
  };
  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError("Both password fields are required");
      return;
    }

    const validationError = validatePassword(newPassword);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    dispatch(resetPassword({ email, password: newPassword })).then(
      (res: any) => {
        if (res.payload?.message) {
          toast.success("Password reset successfully!");
          setStep(4);
          setTimeout(() => {
            navigate("/");
          }, 3000);
        } else {
          setError(res.payload || "Failed to reset password");
        }
      }
    );
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-center text-green-600 mb-4">
          Forgot Password
        </h2>
        {error && <p className="text-red-500 text-center mb-2">{error}</p>}
        {step === 1 && (
          <div>
            <input
              type="email"
              className="border p-2 w-full mb-3 rounded"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={handleSendOtp}
              className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </div>
        )}
        {step === 2 && (
          <div>
            <input
              type="text"
              className="border p-2 w-full mb-3 rounded"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-green-600 text-white p-2 mb-3 rounded hover:bg-green-700"
            >
              {loading ? "Verifying..." : "Verify OTP"}
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
              {resendLoading ? "Resending..." : canResend ? "Resend OTP" : `Resend OTP (${timer}s)`}
            </button>
          </div>
        )}
        {step === 3 && (
          <div>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                className="border p-2 w-full mb-3 rounded pr-10"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-3"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="border p-2 w-full mb-3 rounded pr-10"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-3"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              onClick={handleResetPassword}
              className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        )}

        {step === 4 && (
          <p className="text-center text-green-500">
            Password reset successfully!
          </p>
        )}

        <div className="mt-4">
          <button
            onClick={() => navigate("/")}
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-700"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
