import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWastePlantValidation } from "../../hooks/useWastePlantValidation";
import { ValidationErrors } from "../../types/wastePlantTypes";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../redux/hooks";
import { superAdminSignup } from "../../redux/slices/superAdmin/superAdminSlice";
import { getAxiosErrorMessage } from "../../utils/handleAxiosError";

const SignupSuperAdmin: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const { errors, validateField, setErrors } = useWastePlantValidation();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentErrors: ValidationErrors = {};

    Object.entries(formData).forEach(([name, value]) => {
      const error = validateField(name, value as string);
      if (error) {
        currentErrors[name as keyof ValidationErrors] = error;
      }
    });

    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors);
      return;
    }

    try {
      console.log("Submitted Data:", formData);
      const result = await dispatch(superAdminSignup(formData)).unwrap();
      console.log("result",result);
      
      // if (typeof result.payload === "string") {
      //   showErrorToast(result.payload);
      //   return;
      // }
      toast.success(result?.message);
      setTimeout(() => navigate("/super-admin/"), 1500);

    } catch (error) {
      toast.error(getAxiosErrorMessage(error));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-green-200">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
          Super Admin Signup
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Username"
              className="w-full px-4 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              autoComplete="username"
            />
            {errors.username && (
              <p className="text-red-600 text-sm mt-1">{errors.username}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Email"
              className="w-full px-4 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Password"
              className="w-full px-4 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              autoComplete="new-password"
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md transition-all"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/super-admin/")}
              className="text-green-600 font-medium hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupSuperAdmin;
