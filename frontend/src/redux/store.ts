import { configureStore } from "@reduxjs/toolkit";

import superadminReducer from "../redux/slices/superAdmin/superAdminSlice";
import superAdminWastePlantReducer from "../redux/slices/superAdmin/superAdminWastePlantSlice";
import superAdminSubscriptionPlanReducer from "../redux/slices/superAdmin/superAdminSubscriptionPlanSlice";

import wasteplantReducer from "../redux/slices/wastePlant/wastePlantSlice";
import wastePlantDriverReducer from "../redux/slices/wastePlant/wastePlantDriverSlice";
import wastePlantTruckReducer from "../redux/slices/wastePlant/wastePlantTruckSlice";
import wastePlantPickupReducer from "../redux/slices/wastePlant/wastePlantPickupSlice";
import wastePlantChatsReducer from "../redux/slices/wastePlant/wastePlantChatSlice";
import wastePlantDropSpotReducer from "../redux/slices/wastePlant/wastePlantDropSpotSlice";
import wastePlantUserReducer from "../redux/slices/wastePlant/wastePlantUserSlice";
import wastePlantDashboardReducer from "../redux/slices/wastePlant/wastePlantDashboardSlice";
import wastePlantNotificationsReducer from "../redux/slices/wastePlant/wastePlantNotificationSlice";
import wastePlantPaymentsReducer from "../redux/slices/wastePlant/wastePlantPaymentSlice";

import driverReducer from "../redux/slices/driver/driverSlice";
import driverProfileReducer from "../redux/slices/driver/profileDriverSlice";
import userResidentialReducer from "../redux/slices/user/residentialSlice";
import userCommercialReducer from "../redux/slices/user/commercialSlice";
import driverPickupsReducer from "../redux/slices/driver/pickupDriverSlice";
import driverTrucksReducer from "../redux/slices/driver/truckDriverSlice";
import driverChatsReducer from "../redux/slices/driver/chatDriverSlice";
import driverNotificationsReducer from "../redux/slices/driver/driverNotificationSlice";

import  userReducer  from "../redux/slices/user/userSlice";
import userPickupReducer from "../redux/slices/user/userPickupSlice";
import userProfileReducer from "../redux/slices/user/userProfileSlice";
import userPaymentReducer from "../redux/slices/user/userPaymentSlice";
import userDropSpotReducer from "../redux/slices/user/dropSpotSlice";
import userNotificationsReducer from "../redux/slices/user/userNotificationSlice";

export const store = configureStore({
    reducer : {
        user : userReducer,
        userProfile: userProfileReducer,
        userResidential: userResidentialReducer,
        userCommercial: userCommercialReducer,
        userPickups: userPickupReducer,
        userPayment: userPaymentReducer,
        userDropSpot: userDropSpotReducer,
        userNotifications: userNotificationsReducer,
        superadmin: superadminReducer,
        superAdminWastePlant: superAdminWastePlantReducer,
        superAdminSubscriptionPlan: superAdminSubscriptionPlanReducer,
        wasteplant: wasteplantReducer,
        wastePlantDriver: wastePlantDriverReducer,
        wastePlantTruck: wastePlantTruckReducer,
        wastePlantPickup: wastePlantPickupReducer,
        wastePlantChats: wastePlantChatsReducer,
        wastePlantDropSpot: wastePlantDropSpotReducer,
        wastePlantUser: wastePlantUserReducer,
        wastePlantDashboard: wastePlantDashboardReducer,
        wastePlantNotifications: wastePlantNotificationsReducer,
        wastePlantPayments: wastePlantPaymentsReducer,
        driver: driverReducer,
        driverProfile: driverProfileReducer,
        driverPickups: driverPickupsReducer,
        driverTrucks: driverTrucksReducer,
        driverChats: driverChatsReducer,
        driverNotifications: driverNotificationsReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;