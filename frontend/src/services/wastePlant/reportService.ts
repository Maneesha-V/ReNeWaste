import axiosWasteplant from "../../api/axiosWasteplant";

export const filterReportsService = async (from: string, to: string) => {
  try {
    const response = await axiosWasteplant.get(`/waste-reports/from=${from}&to=${to}`);
    console.log("res", response);
    return response.data;
  } catch (error: any) {
    console.error("error", error);
  }
};

export const fetchWasteReportsService = async () => {
  try {
    const response = await axiosWasteplant.get(`/waste-reports`);
    console.log("res", response);
    return response.data;
  } catch (error: any) {
    console.error("error", error);
  }
};