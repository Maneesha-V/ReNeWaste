import { Route, Routes } from "react-router-dom"
import WastePlantLayout from "../components/wastePlant/WastePlantLayout"
import DashboardWastePlant from "../pages/wastePlant/DashboardWastePlant"
import Pickups from "../pages/wastePlant/Pickups"
import LoginWastePlant from "../pages/wastePlant/LoginWastePlant"
import ForgotPassword from "../pages/wastePlant/ForgotPassword"
import Drivers from "../pages/wastePlant/Drivers"
import AddDriver from "../pages/wastePlant/AddDriver"
import EditDriver from "../pages/wastePlant/EditDriver"
import ProtectedRoute from "../components/wastePlant/ProtectedRoute"
import Trucks from "../pages/wastePlant/Trucks"
import AddTruck from "../pages/wastePlant/AddTruck"
import EditTruck from "../pages/wastePlant/EditTruck"

const WastePlantRoutes = () => {
  return (
    <Routes>
     <Route path="/" element={<LoginWastePlant />} />
     <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route element={<WastePlantLayout />}>
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardWastePlant />} />
        <Route path="/pickups" element={<Pickups />} />
        <Route path="/drivers" element={<Drivers />} />
        <Route path="/add-driver" element={<AddDriver />} />
        <Route path="/edit-driver/:driverId" element={<EditDriver />} />
        <Route path="/trucks" element={<Trucks />} />
        <Route path="/add-truck" element={<AddTruck />} />
        <Route path="/edit-truck/:truckId" element={<EditTruck />} />
        </Route>
      </Route>    
    </Routes>
  )
}

export default WastePlantRoutes