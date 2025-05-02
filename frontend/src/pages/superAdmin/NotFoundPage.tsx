import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoDashboard = () => {
    navigate("/super-admin/dashboard"); 
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-800">404</h1>
        <p className="text-2xl text-gray-600 mt-4">Oops! Page not found.</p>
        <button
          onClick={handleGoDashboard}
          className="mt-8 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Go Dashboard
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;