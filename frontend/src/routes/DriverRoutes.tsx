import { Route, Routes } from "react-router-dom"
import ForgotPassword from "../pages/driver/ForgotPassword"
import LoginDriver from "../pages/driver/LoginDriver"

const DriverRoutes = () => {
  return (
    <Routes>
     <Route path="/" element={<LoginDriver />} />
     <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  )
}

export default DriverRoutes