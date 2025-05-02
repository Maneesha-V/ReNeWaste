import { Route, Routes } from "react-router-dom"
import LoginSuperAdmin from "../pages/superAdmin/LoginSuperAdmin"
import Dashboard from "../pages/superAdmin/DashboardContent"
import SuperAdminLayout from "../components/superAdmin/SuperAdminLayout"
import WastePlants from "../pages/superAdmin/WastePlants"
import AddWastePlant from "../pages/superAdmin/AddWastePlant"
import SignupSuperAdmin from "../pages/superAdmin/SignupSuperAdmin"
import EditWastePlant from "../pages/superAdmin/EditWastePlant"
import ForgotPassword from "../pages/superAdmin/ForgotPassword"
import Unauthorized from "../pages/superAdmin/Unauthorized"
import NotFoundPage from "../pages/superAdmin/NotFoundPage"
import { ProtectedAuthRoute, ProtectedRoute } from "../components/superAdmin/ProtectedRoute"


const SuperAdminRoutes = () => {
  return (
    <Routes>
       {/* ProtectedAuthRoute */}
       <Route element={<ProtectedAuthRoute />}>
        <Route path="/" element={<LoginSuperAdmin />} />
        <Route path="/signup" element={<SignupSuperAdmin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>
        
      {/* Protected routes */}
      <Route element={<ProtectedRoute allowedRoles={["superadmin"]} />}>
        <Route element={<SuperAdminLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/waste-plants" element={<WastePlants />} />
          <Route path="/add-waste-plant" element={<AddWastePlant />} />
          <Route path="/edit-waste-plant/:id" element={<EditWastePlant />} />
        </Route>
      </Route>

      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFoundPage />} />     
    </Routes>
  )
}

export default SuperAdminRoutes