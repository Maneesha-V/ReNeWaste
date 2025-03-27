import { Route, Routes } from "react-router-dom"
import Signup from "../pages/user/Signup"
import Login from "../pages/user/Login"
import Home from "../pages/user/Home"
import ProfilePage from "../pages/user/Profile"
import EditProfile from "../pages/user/EditProfile"
import NotFoundPage from "../pages/user/NotFoundPage"
import ProtectedRoute from "../components/user/ProtectedRoute"
import ForgotPassword from "../pages/user/ForgotPassword"

const UserRoutes = () => {
  return (
    <Routes>
        <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/edit-profile" element={<EditProfile />} />
          </Route>
                  <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default UserRoutes