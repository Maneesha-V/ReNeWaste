import axiosSuperadmin from "../../api/axiosSuperadmin";
import { PaginationPayload } from "../../types/common/commonTypes";
import { RenewNotificationPayload } from "../../types/wastePlantTypes";

export const createWastePlant = async (wastePlantData: FormData) => {
    const response = await axiosSuperadmin.post(
      `/add-waste-plant`,
      wastePlantData
    );
    console.log("res", response);
    return response.data;
};
export const getWastePlants = async ({ page, limit, search }: PaginationPayload) => {
    const response = await axiosSuperadmin.get(`/waste-plants`,{
      params: { page, limit, search },
    });
    return response.data;
};
export const getWastePlantById = async (id: string) => {
    const response = await axiosSuperadmin.get(`/edit-waste-plant/${id}`);
    return response.data.data;
};
export const updateWastePlantById = async (id: string, data: FormData) => {
    // const token = localStorage.getItem("token");
    const response = await axiosSuperadmin.patch(
      `/edit-waste-plant/${id}`,
      data
      // {
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //   },
      // }
    );
    console.log("res", response);
    return response.data;
};
export const deleteWastePlantById = async (id: string) => {
  const response = await axiosSuperadmin.delete(`/delete-waste-plant/${id}`);
  console.log("res", response);
  return response.data;
};
export const sendSubscribeNotificationById = async (id: string) => {
  const response = await axiosSuperadmin.post(
    `/notification/subscribe-remind/${id}`
  );
  console.log("res", response);
  return response.data;
};

export const sendRenewNotificationService = async (
  data: RenewNotificationPayload
) => {
  const response = await axiosSuperadmin.post(
    `/notification/renew-remind`,
    data
  );
  console.log("res", response);
  return response.data;
};

export const sendRechargeNotificationService = async (plantId: string) => {
  const response = await axiosSuperadmin.post(`/notification/recharge-remind`, {
    plantId,
  });
  console.log("res", response);
  return response.data;
};
export const getPostOffices = async (pincode: string) => {
  const response = await axiosSuperadmin.post(`/location/${pincode}`);
  console.log("res", response);
  return response.data;
};
