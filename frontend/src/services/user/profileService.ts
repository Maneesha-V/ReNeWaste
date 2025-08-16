import axiosUser from "../../api/axiosUser";
import { UserProfileReq } from "../../types/user/userTypes";

export const getProfile = async () => {
  const response = await axiosUser.get(`/profile`);
  return response.data;
};
export const getEditProfile = async () => {
  const response = await axiosUser.get(`/edit-profile`);
  console.log("res",response);
  
  return response.data;
};

export const updateUserProfile = async (
  updatedData: UserProfileReq,
  
) => {
  const response = await axiosUser.patch(`/edit-profile`, updatedData, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};
