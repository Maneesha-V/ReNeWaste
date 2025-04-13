import axios from "axios";
import { UserProfile } from "../../types/profileTypes";

const API_URL = import.meta.env.VITE_API_URL;

export const getProfile = async (token: string) => {
  const response = await axios.get(`${API_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data.user;
};
export const getEditProfile = async (token: string) => {
  const response = await axios.get(`${API_URL}/edit-profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data.user;
};

export const updateUserProfile = async (
  token: string,
  updatedData: UserProfile
) => {
  const response = await axios.patch(`${API_URL}/edit-profile`, updatedData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};
