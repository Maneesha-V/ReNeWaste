import { configureStore } from "@reduxjs/toolkit";
import  userReducer  from "../redux/slices/user/userSlice";
import superadminReducer from "../redux/slices/superAdmin/superAdminSlice";
import superAdminWastePlantReducer from "../redux/slices/superAdmin/superAdminWastePlantSlice";
import wasteplantReducer from "../redux/slices/wastePlant/wastePlantSlice";
import wastePlantDriverReducer from "../redux/slices/wastePlant/wastePlantDriverSlice";
import driverReducer from "../redux/slices/driver/driverSlice";
import driverProfileReducer from "../redux/slices/driver/profileDriverSlice";
import userResidentialReducer from "../redux/slices/user/residentialSlice";
import userCommercialReducer from "../redux/slices/user/commercialSlice";

export const store = configureStore({
    reducer : {
        user : userReducer,
        userResidential: userResidentialReducer,
        userCommercial: userCommercialReducer,
        superadmin: superadminReducer,
        superAdminWastePlant: superAdminWastePlantReducer,
        wasteplant: wasteplantReducer,
        wastePlantDriver: wastePlantDriverReducer,
        driver: driverReducer,
        driverProfile: driverProfileReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;