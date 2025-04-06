import { Route, Routes } from "react-router-dom"
import WastePlantLayout from "../components/wastePlant/WastePlantLayout"
import DashboardWastePlant from "../pages/wastePlant/DashboardWastePlant"
import Pickups from "../pages/wastePlant/Pickups"
import LoginWastePlant from "../pages/wastePlant/LoginWastePlant"
import ForgotPassword from "../pages/wastePlant/ForgotPassword"


const WastePlantRoutes = () => {
  return (
    <Routes>
     <Route path="/" element={<LoginWastePlant />} />
     <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route element={<WastePlantLayout />}>
        <Route path="/dashboard" element={<DashboardWastePlant />} />
        <Route path="/pickups" element={<Pickups />} />
      </Route>    
    </Routes>
  )
}

export default WastePlantRoutes