import axiosSuperadmin from "../../api/axiosSuperadmin";

export const getNotifications = async () => {
  const response = await axiosSuperadmin.get(`/notifications`);
  return response.data;
};
export const markAsReadService = async (id: string) => {
  const response = await axiosSuperadmin.patch(`/notifications/${id}/read`);
  return response.data;
}