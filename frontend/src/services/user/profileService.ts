import axios from "axios";
import { UserProfile } from "../../types/profileTypes";

const API_URL = import.meta.env.VITE_API_URL; 

export const getProfile = async (token: string) => {
    try {
      console.log("Fetching profile with token:", token);
  
      const response = await axios.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log("Profile Response:", response.data);
      return response.data.user;
    } catch (error: any) {
      console.error("Error fetching profile:", error.response?.data || error);
      throw error;
    }
  };
  export const getEditProfile = async (token: string) => {
    try {
      console.log("Fetching profile with token:", token);
  
      const response = await axios.get(`${API_URL}/edit-profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log("Profile Response:", response.data);
      return response.data.user;
    } catch (error: any) {
      console.error("Error fetching profile:", error.response?.data || error);
      throw error;
    }
  };

  export const updateUserProfile = async (token: string, updatedData: UserProfile) => {
    try {
      console.log("Updating profile with data:", updatedData);
  
      const response = await axios.put(`${API_URL}/edit-profile`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      console.log("Update Response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error updating profile:", error.response?.data || error);
      throw error;
    }
  };
  