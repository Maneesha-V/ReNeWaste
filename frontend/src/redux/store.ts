import { configureStore } from "@reduxjs/toolkit";
import  userReducer  from "../redux/slices/user/userSlice";
import superadminReducer from "../redux/slices/superAdmin/superAdminSlice";
import superAdminWastePlantReducer from "../redux/slices/superAdmin/superAdminWastePlantSlice";
import wasteplantReducer from "../redux/slices/wastePlant/wastePlantSlice";
import wastePlantDriverReducer from "../redux/slices/wastePlant/wastePlantDriverSlice";
import wastePlantTruckReducer from "../redux/slices/wastePlant/wastePlantTruckSlice";
import wastePlantPickupReducer from "../redux/slices/wastePlant/wastePlantPickupSlice";
import wastePlantChatsReducer from "../redux/slices/wastePlant/wastePlantChatSlice";
import driverReducer from "../redux/slices/driver/driverSlice";
import driverProfileReducer from "../redux/slices/driver/profileDriverSlice";
import userResidentialReducer from "../redux/slices/user/residentialSlice";
import userCommercialReducer from "../redux/slices/user/commercialSlice";
import driverPickupsReducer from "../redux/slices/driver/pickupDriverSlice";
import driverTrucksReducer from "../redux/slices/driver/truckDriverSlice";
import driverChatsReducer from "../redux/slices/driver/chatDriverSlice";
import userPickupReducer from "../redux/slices/user/userPickupSlice";
import userProfileReducer from "../redux/slices/user/userProfileSlice";

export const store = configureStore({
    reducer : {
        user : userReducer,
        userProfile: userProfileReducer,
        userResidential: userResidentialReducer,
        userCommercial: userCommercialReducer,
        userPickups: userPickupReducer,
        superadmin: superadminReducer,
        superAdminWastePlant: superAdminWastePlantReducer,
        wasteplant: wasteplantReducer,
        wastePlantDriver: wastePlantDriverReducer,
        wastePlantTruck: wastePlantTruckReducer,
        wastePlantPickup: wastePlantPickupReducer,
        wastePlantChats: wastePlantChatsReducer,
        driver: driverReducer,
        driverProfile: driverProfileReducer,
        driverPickups: driverPickupsReducer,
        driverTrucks: driverTrucksReducer,
        driverChats: driverChatsReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;