import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import GoogleSignUpButton from "../../components/user/GoogleSignUpButton";
import { signup } from "../../redux/slices/user/userSlice"
import { useAppDispatch } from "../../redux/hooks";
import { validateForm } from "../../services/common/validationServices"
import { SignupRequest } from "../../types/authTypes";

const Signup = () => {
  const [formData, setFormData] = useState<SignupRequest>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    agreeToTerms: false,
  });
  const dispatch = useAppDispatch();
  const { loading, error } = useSelector((state: any) => state.user);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const {isValid, errors} = validateForm(formData)
    if(!isValid){
      Object.values(errors).forEach((errorMessage) => {
        if(errorMessage){
          toast.error(errorMessage);
        }
      });
      return;
    }
    try {
      await dispatch(signup(formData)).unwrap();
      toast.success("Signup successful!");
      setTimeout(()=>{
        navigate("/");
      },5000)
      
    } catch (error: any) {
      toast.error(error.payload || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 border border-green-100">
        <h2 className="text-3xl font-bold mb-6 text-center text-green-600">
          Sign Up
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="mr-2 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-green-700">
                I agree to the terms and conditions of ReNeWaste.
              </span>
            </label>
          </div>
          <button
            type="submit"
            className="w-full font-bold text-lg bg-green-600 text-white p-2 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <span className="text-sm text-green-700">Or</span>
          <GoogleSignUpButton />
        </div>
        <div className="mt-4 text-center">
          <span className="text-sm text-green-700">
            Already have an account?{" "}
            <Link to="/" className="text-green-600 hover:underline">
              Login
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Signup;
