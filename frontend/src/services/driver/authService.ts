import axios from "axios";
import { LoginRequest } from "../../types/authTypes";

const API_URL = import.meta.env.VITE_DRIVER_API_URL;

export const loginDriver = async (driverData: LoginRequest) => {
  try {
    const response = await axios.post(`${API_URL}/`, driverData);
    console.log("res",response);
    
    if (response.data) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.driver.role);
    }
    console.log(response);

    return response.data;
  } catch (error: any) {
    console.error("err", error);
    throw error.response?.data?.error || "Login failed. Please try again.";
  }
};