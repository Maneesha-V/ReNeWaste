import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleGoLogin = () => {
    navigate("/waste-plant");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-800">403</h1>
        <p className="text-2xl text-gray-600 mt-4">Unauthorized Access</p>
        <p className="text-gray-500 mt-2">You don't have permission to view this page.</p>
        <button
          onClick={handleGoLogin}
          className="mt-8 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
