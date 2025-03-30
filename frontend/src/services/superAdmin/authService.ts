import axios from "axios";
import { LoginRequest } from "../../types/authTypes";

const API_URL = import.meta.env.VITE_SUPER_ADMIN_API_URL;

export const loginSuperAdmin = async (superAdminData: LoginRequest) => {
    try {
        const response = await axios.post(`${API_URL}/`,superAdminData)
        if (response.data) {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("role", response.data.admin.role); 
          }  
          return response.data;
    } catch(error: any){
        throw error.response?.data?.error || "Login failed. Please try again.";
    }
}