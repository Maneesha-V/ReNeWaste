import { useState } from "react";
import { LoginRequest } from "../../types/authTypes";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks";
import { superAdminLogin } from "../../redux/slices/superAdmin/superAdminSlice";

const SuperAdminLogin = () => {
  const [formData, setFormData] = useState<LoginRequest>({
    email : "",
    password : "",
  });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    setFormData({
      ...formData,
      [name] : value,
    })
  }

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(superAdminLogin(formData));
      navigate("/super-admin/dashboard")
    } catch(error: any){
      toast.error(error || "Login failed. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-green-100 px-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg border border-green-300">
        <h2 className="text-2xl font-bold text-center mb-6 text-green-700">Super Admin Login</h2>
        <form onSubmit={handleSubmit} >
          <div className="mb-4">
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full px-4 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required 
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required 
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-all"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default SuperAdminLogin;
