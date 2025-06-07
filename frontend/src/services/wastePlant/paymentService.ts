import axiosWasteplant from "../../api/axiosWasteplant";


  export const fetchPaymentsService = async () => {
    try {
      const response = await axiosWasteplant.get(`/payment`);
        console.log("res",response);
        
      return response.data;
    } catch (error: any) {
      console.error("error", error);
    }
  };