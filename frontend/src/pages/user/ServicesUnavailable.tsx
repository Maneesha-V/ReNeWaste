import { useNavigate } from "react-router-dom";

export default function ServicesUnavailable() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center border border-green-100">
        <div className="mb-4">
          {/* Icon / Illustration */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-green-500 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.662 1.732-3L13.732 4c-.77-1.338-2.694-1.338-3.464 0L4.34 16c-.77 1.338.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-green-700">
          Services are not available
        </h2>
        <p className="text-green-600 mt-2">
          The waste plant linked to your account is currently blocked.  
          Please try again later.
        </p>

        <button
          onClick={() => navigate(-1)}
          className="mt-6 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow transition duration-200"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
