import { Route, Routes } from "react-router-dom"
import SuperAdminLogin from "../pages/superAdmin/SuperAdminLogin "
import Dashboard from "../pages/superAdmin/DashboardContent"
import SuperAdminLayout from "../components/superAdmin/SuperAdminLayout"
import WastePlants from "../pages/superAdmin/WastePlants"
import AddWastePlant from "../pages/superAdmin/AddWastePlant"


const SuperAdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<SuperAdminLogin />} />
      <Route element={<SuperAdminLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/waste-plants" element={<WastePlants />} />
        <Route path ="/add-waste-plant" element={<AddWastePlant />} />
      </Route>    
    </Routes>
  )
}

export default SuperAdminRoutes