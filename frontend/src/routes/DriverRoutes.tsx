import { Route, Routes } from "react-router-dom"
import ForgotPassword from "../pages/driver/ForgotPassword"
import LoginDriver from "../pages/driver/LoginDriver"
import DriverLayout from "../components/driver/DriverLayout"
import DashboardDriver from "../pages/driver/DashboardDriver"
import ProfileDriver from "../pages/driver/ProfileDriver"
import EditProfileDriver from "../pages/driver/EditProfileDriver"

const DriverRoutes = () => {
  return (
    <Routes>
     <Route path="/" element={<LoginDriver />} />
     <Route path="/forgot-password" element={<ForgotPassword />} />
     <Route element={<DriverLayout />}>
        <Route path="/dashboard" element={<DashboardDriver />} />
        <Route path="/profile" element={<ProfileDriver />} />
        <Route path="/edit-profile" element={<EditProfileDriver />} />
      </Route>  
    </Routes>
  )
}

export default DriverRoutes