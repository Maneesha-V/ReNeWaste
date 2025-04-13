import { Route, Routes } from "react-router-dom";
import Login from "../pages/user/Login";
import Home from "../pages/user/Home";
import ProfilePage from "../pages/user/Profile";
import EditProfile from "../pages/user/EditProfile";
import NotFoundPage from "../pages/user/NotFoundPage";
import ProtectedRoute from "../components/user/ProtectedRoute";
import ForgotPassword from "../pages/user/ForgotPassword";
import OtpVerificationWrapper from "../components/user/OtpVerificationWrapper";
import Residential from "../pages/user/Residential";
import Commercial from "../pages/user/Commercial";

const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/signup" element={<OtpVerificationWrapper />} />
      <Route path="/" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/residential" element={<Residential />} />
        <Route path="/residential" element={<Commercial />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default UserRoutes;
