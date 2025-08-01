import { Route, Routes } from "react-router-dom";
import ForgotPassword from "../pages/driver/ForgotPassword";
import LoginDriver from "../pages/driver/LoginDriver";
import DriverLayout from "../components/driver/DriverLayout";
import DashboardDriver from "../pages/driver/DashboardDriver";
import ProfileDriver from "../pages/driver/ProfileDriver";
import EditProfileDriver from "../pages/driver/EditProfileDriver";
import AllotedPickups from "../pages/driver/AllotedPickups";
import TrackPickup from "../pages/driver/TrackPickup";
import AssignedTrucks from "../pages/driver/AssignedTrucks";
import {
  ProtectedAuthRoute,
  ProtectedRoute,
} from "../components/driver/ProtectedRoute";
import Unauthorized from "../pages/driver/Unauthorized";
import NotFoundPage from "../pages/driver/NotFoundPage";
import DriverChat from "../pages/driver/DriverChat";
import Support from "../pages/driver/Support";

const DriverRoutes = () => {
  return (
    <Routes>
      {/* ProtectedAuthRoute */}
      <Route element={<ProtectedAuthRoute />}>
        <Route path="/" element={<LoginDriver />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Protected routes */}
      <Route element={<ProtectedRoute allowedRoles={["driver"]} />}>
        <Route element={<DriverLayout />}>
          <Route path="/dashboard" element={<DashboardDriver />} />
          <Route path="/profile" element={<ProfileDriver />} />
          <Route path="/edit-profile" element={<EditProfileDriver />} />
          <Route path="/alloted-pickups" element={<AllotedPickups />} />
          <Route path="/track-pickup/:pickupReqId" element={<TrackPickup />} />
          <Route path="/assigned-trucks" element={<AssignedTrucks />} />        
          <Route path="/chat" element={<DriverChat />} />
          <Route path="/support" element={<Support />} />
        </Route>
      </Route>
      
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFoundPage />} />  
    </Routes>
  );
};

export default DriverRoutes;
