import { axiosWasteplant } from "../../config/axiosClients";

export const filterReportsService = async (from: string, to: string) => {
    const response = await axiosWasteplant.get(`/waste-reports/from=${from}&to=${to}`);
    console.log("res", response);
    return response.data;
};

export const fetchWasteReportsService = async () => {
    const response = await axiosWasteplant.get(`/waste-reports`);
    console.log("res", response);
    return response.data;
};