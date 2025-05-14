import { Route, Routes } from "react-router-dom";
import WastePlantLayout from "../components/wastePlant/WastePlantLayout";
import DashboardWastePlant from "../pages/wastePlant/DashboardWastePlant";
import Pickups from "../pages/wastePlant/Pickups";
import LoginWastePlant from "../pages/wastePlant/LoginWastePlant";
import ForgotPassword from "../pages/wastePlant/ForgotPassword";
import Drivers from "../pages/wastePlant/Drivers";
import AddDriver from "../pages/wastePlant/AddDriver";
import EditDriver from "../pages/wastePlant/EditDriver";
import { ProtectedAuthRoute, ProtectedRoute} from "../components/wastePlant/ProtectedRoute";
import Trucks from "../pages/wastePlant/Trucks";
import AddTruck from "../pages/wastePlant/AddTruck";
import EditTruck from "../pages/wastePlant/EditTruck";
import Unauthorized from "../pages/wastePlant/Unauthorized";
import NotFoundPage from "../pages/wastePlant/NotFoundPage";
import WastePlantChat from "../pages/wastePlant/WastePlantChat";
import AssignNewTruck from "../pages/wastePlant/AssignNewTruck";
import AddDropSpot from "../pages/wastePlant/AddDropSpot";
import DropSpots from "../pages/wastePlant/DropSpots";

const WastePlantRoutes = () => {
  return (
    <Routes>

      {/* ProtectedAuthRoute */}
      <Route element={<ProtectedAuthRoute />}>
        <Route path="/" element={<LoginWastePlant />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Protected routes */}
      <Route element={<ProtectedRoute allowedRoles={["wasteplant"]} />}>
        <Route element={<WastePlantLayout />}>
          <Route path="/dashboard" element={<DashboardWastePlant />} />
          <Route path="/pickups" element={<Pickups />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/add-driver" element={<AddDriver />} />
          <Route path="/edit-driver/:driverId" element={<EditDriver />} />
          <Route path="/trucks" element={<Trucks />} />
          <Route path="/add-truck" element={<AddTruck />} />
          <Route path="/edit-truck/:truckId" element={<EditTruck />} />
          <Route path="/assign-new-truck" element={<AssignNewTruck />} />
          <Route path="/drop-spots" element={<DropSpots />} />
          <Route path="/add-drop-spot" element={<AddDropSpot />} />
          <Route path="/chat" element={<WastePlantChat />} />
        </Route>
      </Route>
      
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default WastePlantRoutes;
