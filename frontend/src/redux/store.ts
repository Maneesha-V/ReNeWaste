import { configureStore } from "@reduxjs/toolkit";
import  userReducer  from "../redux/slices/user/userSlice";
import superadminReducer from "../redux/slices/superAdmin/superAdminSlice";
import superAdminWastePlantReducer from "../redux/slices/superAdmin/superAdminWastePlantSlice";
import wasteplantReducer from "../redux/slices/wastePlant/wastePlantSlice";
import wastePlantDriverReducer from "../redux/slices/wastePlant/wastePlantDriverSlice";
import wastePlantTruckReducer from "../redux/slices/wastePlant/wastePlantTruckSlice";
import wastePlantPickupReducer from "../redux/slices/wastePlant/wastePlantPickupSlice";
import driverReducer from "../redux/slices/driver/driverSlice";
import driverProfileReducer from "../redux/slices/driver/profileDriverSlice";
import userResidentialReducer from "../redux/slices/user/residentialSlice";
import userCommercialReducer from "../redux/slices/user/commercialSlice";
import driverPickupsReducer from "../redux/slices/driver/pickupDriverSlice";
import userPickupReducer from "../redux/slices/user/userPickupSlice";

export const store = configureStore({
    reducer : {
        user : userReducer,
        userResidential: userResidentialReducer,
        userCommercial: userCommercialReducer,
        userPickups: userPickupReducer,
        superadmin: superadminReducer,
        superAdminWastePlant: superAdminWastePlantReducer,
        wasteplant: wasteplantReducer,
        wastePlantDriver: wastePlantDriverReducer,
        wastePlantTruck: wastePlantTruckReducer,
        wastePlantPickup: wastePlantPickupReducer,
        driver: driverReducer,
        driverProfile: driverProfileReducer,
        driverPickups: driverPickupsReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;