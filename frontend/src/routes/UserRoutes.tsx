import { Route, Routes } from "react-router-dom";
import Login from "../pages/user/Login";
import Home from "../pages/user/Home";
import ProfilePage from "../pages/user/Profile";
import EditProfile from "../pages/user/EditProfile";
import NotFoundPage from "../pages/user/NotFoundPage";
import { ProtectedAuthRoute, ProtectedRoute} from "../components/user/ProtectedRoute";
import ForgotPassword from "../pages/user/ForgotPassword";
import OtpVerificationWrapper from "../components/user/OtpVerificationWrapper";
import Residential from "../pages/user/Residential";
import Commercial from "../pages/user/Commercial";
import PickupPlans from "../pages/user/PickupPlans";
import Unauthorized from "../pages/user/Unauthorized";
import Payments from "../pages/user/Payments";
import ErrorBoundary from "../components/common/ErrorBoundary";
import DropSpotMap from "../pages/user/DropSpotMap";
import Blocked from "../pages/user/Blocked";
import ServicesUnavailable from "../pages/user/ServicesUnavailable";

const UserRoutes = () => {
  return (
    <Routes>
      {/* ProtectedAuthRoute */}
      <Route element={<ProtectedAuthRoute />}>
        <Route path="/signup" element={<OtpVerificationWrapper />} />
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Protected routes */}
      <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/residential" element={<Residential />} />
        <Route path="/commercial" element={<Commercial />} />
        <Route path="/pickup-plans" element={<PickupPlans />} />     
        <Route path="/payment-history" element={<Payments />} />
        <Route path="/drop-spots" element={<DropSpotMap/>} />
      </Route>

      <Route path="/services-unavailable" element={<ServicesUnavailable />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/blocked" element={<Blocked />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default UserRoutes;
