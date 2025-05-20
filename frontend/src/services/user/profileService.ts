import { UserProfile } from "../../types/profileTypes";
import axiosUser from "../../api/axiosUser";

export const getProfile = async () => {
  const response = await axiosUser.get(`/profile`);
  console.log("res",response);
  
  return response.data.user;
};
export const getEditProfile = async () => {
  const response = await axiosUser.get(`/edit-profile`);
  console.log("res",response);
  
  return response.data.user;
};

export const updateUserProfile = async (
  updatedData: UserProfile
) => {
  const response = await axiosUser.patch(`/edit-profile`, updatedData, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};
