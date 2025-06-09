import axiosSuperadmin from "../../api/axiosSuperadmin";

// const API_URL = import.meta.env.VITE_SUPER_ADMIN_API_URL;

export const createWastePlant = async (wastePlantData: FormData) => {
  try {
    const response = await axiosSuperadmin.post(
      `/add-waste-plant`,
      wastePlantData,
      // {
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //   },
      // }
    );
    console.log("res", response);
    return response.data;
  } catch (error: any) {
    console.error("Error adding waste plant:", error.response?.data || error);
    throw error;
  }
};
export const getWastePlants = async () => {
  try {
    const response = await axiosSuperadmin.get(`/waste-plants`);
    return response.data.data;
  } catch (error: any) {
    console.error("error", error);
  }
};
export const getWastePlantById = async (id: string) => {
  try {
    const response = await axiosSuperadmin.get(`/edit-waste-plant/${id}`);
    return response.data.data;
  } catch (error: any) {
    console.error("error", error);
  }
};
export const updateWastePlantById = async (id: string, data: FormData) => {
  try {
    // const token = localStorage.getItem("token");
    const response = await axiosSuperadmin.patch(
      `/edit-waste-plant/${id}`,
      data,
      // {
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //   },
      // }
    );
    console.log("res", response);
    return response.data;
  } catch (error: any) {
    console.error("error", error);
    throw error;
  }
};
export const deleteWastePlantById = async (id: string) => {
  try {
    const response = await axiosSuperadmin.delete(`/delete-waste-plant/${id}`);
    console.log("res", response);
    return response.data;
  } catch (error: any) {
    console.error("error", error);
    throw error;
  }
};
