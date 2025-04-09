import axios from "axios";

const API_URL = import.meta.env.VITE_DRIVER_API_URL;

export const getDriverProfile = async () => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${API_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        return response.data;
    } catch (error: any) {
      console.error("err", error);
      throw error.response?.data?.error || "Login failed. Please try again.";
    }
  };
  export const updateProfile = async (formData: FormData, token: string) => {
    try {
      console.log(formData,token);
      
      const response = await axios.patch(`${API_URL}/edit-profile`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("err", error);
      throw error.response?.data?.error || "Updation failed. Please try again.";
    }
  };