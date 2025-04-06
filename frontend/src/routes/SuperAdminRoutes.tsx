import { Route, Routes } from "react-router-dom"
import LoginSuperAdmin from "../pages/superAdmin/LoginSuperAdmin"
import Dashboard from "../pages/superAdmin/DashboardContent"
import SuperAdminLayout from "../components/superAdmin/SuperAdminLayout"
import WastePlants from "../pages/superAdmin/WastePlants"
import AddWastePlant from "../pages/superAdmin/AddWastePlant"
import SignupSuperAdmin from "../pages/superAdmin/SignupSuperAdmin"
import EditWastePlant from "../pages/superAdmin/EditWastePlant"
import ForgotPassword from "../pages/superAdmin/ForgotPassword"


const SuperAdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginSuperAdmin />} />
      <Route path="/signup" element={<SignupSuperAdmin />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route element={<SuperAdminLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/waste-plants" element={<WastePlants />} />
        <Route path ="/add-waste-plant" element={<AddWastePlant />} />
        <Route path="/edit-waste-plant/:id" element={<EditWastePlant />} />
      </Route>    
    </Routes>
  )
}

export default SuperAdminRoutes