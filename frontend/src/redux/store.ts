import { configureStore } from "@reduxjs/toolkit";
import  userReducer  from "../redux/slices/user/userSlice";
import superadminReducer from "../redux/slices/superAdmin/superAdminSlice"
import superAdminWastePlantReducer from "../redux/slices/superAdmin/superAdminWastePlantSlice"
export const store = configureStore({
    reducer : {
        user : userReducer,
        superadmin: superadminReducer,
        superAdminWastePlant: superAdminWastePlantReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;