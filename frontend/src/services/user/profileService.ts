import { axiosUser } from "../../config/axiosClients";
import { API_ROUTES } from "../../constants/apiRoutes";
import { UserProfileReq } from "../../types/user/userTypes";

export const getProfile = async () => {
  const response = await axiosUser.get(API_ROUTES.USER.PROFILE);
  return response.data;
};
export const getEditProfile = async () => {
  const response = await axiosUser.get(API_ROUTES.USER.EDIT_PROFILE);
  return response.data;
};

export const updateUserProfile = async (
  updatedData: UserProfileReq,
  
) => {
  const response = await axiosUser.patch(API_ROUTES.USER.EDIT_PROFILE, updatedData, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};
