import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GoogleLoginButton from "../../components/user/GoogleLoginButton";
import { LoginRequest } from "../../types/authTypes";
import { login } from "../../redux/slices/user/userSlice";
import { useAppDispatch } from "../../redux/hooks";

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<LoginRequest>({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Login Data:", formData);
      await dispatch(login(formData)).unwrap();
      navigate("/home");
    } catch (error: any) {
      toast.error(error || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 border border-green-100">
        <h2 className="text-3xl font-bold mb-6 text-center text-green-600">
          Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              autoComplete = "off"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              autoComplete="new-password"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            <div className="text-right mt-1">
              <a
                href="/forgot-password"
                className="text-sm text-green-600 hover:underline"
              >
                Forgot Password?
              </a>
            </div>
          </div>
          <button
            type="submit"
            className="w-full font-bold text-lg bg-green-600 text-white p-2 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Login
          </button>
        </form>
        <div className="mt-1 text-center">
          <span className="text-sm text-green-700">Or</span>
          <GoogleLoginButton />
        </div>
        <div className="mt-4 text-start">
          <span className="text-sm text-green-700">
            Don't have an account?{" "}
            <a href="/signup" className="text-green-600 hover:underline">
              Sign Up
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
