import { toast } from "react-toastify"

export const showErrorToast = (message: any) => {
    if(typeof message === "string"){
        toast.error(message)
    }else{
        toast.error("Something went wrong.")
    }
}