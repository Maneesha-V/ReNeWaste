import React from "react";
import { useNavigate } from "react-router-dom";

const Blocked: React.FC = () => {
  const navigate = useNavigate();

  const handleGoToLogin = () => {
    navigate("/waste-plant");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-700 mb-6">
          Your account has been <span className="font-semibold">blocked</span> by the superadmin
          management. If you believe this is a mistake, please contact support.
        </p>
        <button
          onClick={handleGoToLogin}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default Blocked;
