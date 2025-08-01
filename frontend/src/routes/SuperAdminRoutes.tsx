import { Route, Routes } from "react-router-dom"
import LoginSuperAdmin from "../pages/superAdmin/LoginSuperAdmin"
import SuperadminDashboard from "../pages/superAdmin/SuperadminDashboard"
import SuperAdminLayout from "../components/superAdmin/SuperAdminLayout"
import WastePlants from "../pages/superAdmin/WastePlants"
import AddWastePlant from "../pages/superAdmin/AddWastePlant"
import SignupSuperAdmin from "../pages/superAdmin/SignupSuperAdmin"
import EditWastePlant from "../pages/superAdmin/EditWastePlant"
import ForgotPassword from "../pages/superAdmin/ForgotPassword"
import Unauthorized from "../pages/superAdmin/Unauthorized"
import NotFoundPage from "../pages/superAdmin/NotFoundPage"
import { ProtectedAuthRoute, ProtectedRoute } from "../components/superAdmin/ProtectedRoute"
import SubscriptionPlans from "../pages/superAdmin/SubscriptionPlans"
import AddSubscriptionPlan from "../pages/superAdmin/AddSubscriptionPlan"
import EditSubscriptionPlan from "../pages/superAdmin/EditSubscriptionPlan"
import PaymentHistory from "../pages/superAdmin/PaymentHistory"


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
          <Route path="/dashboard" element={<SuperadminDashboard  />} />
          <Route path="/waste-plants" element={<WastePlants />} />
          <Route path="/add-waste-plant" element={<AddWastePlant />} />
          <Route path="/edit-waste-plant/:id" element={<EditWastePlant />} />
          <Route path="/subscription-plans" element={<SubscriptionPlans />} />
          <Route path="/add-subscription-plan" element={<AddSubscriptionPlan />} />
          <Route path="/edit-subscription-plan/:id" element={<EditSubscriptionPlan />} />
          <Route path="/payment-history" element={<PaymentHistory />} />
        </Route>
      </Route>

      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFoundPage />} />     
    </Routes>
  )
}

export default SuperAdminRoutes