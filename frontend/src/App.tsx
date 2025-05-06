import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import UserRoutes from "./routes/UserRoutes";
import SuperAdminRoutes from "./routes/SuperAdminRoutes";
import WastePlantRoutes from "./routes/WastePlantRoutes";
import DriverRoutes from "./routes/DriverRoutes";
import { SocketProvider } from "./context/SocketContext";

function App() {

  return (
    <>
     <SocketProvider> 
      <Router>
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
        <Routes>
          <Route path="/*" element={<UserRoutes />} />
          <Route path="/super-admin/*" element={<SuperAdminRoutes />} />
          <Route path="/waste-plant/*" element={<WastePlantRoutes />} />
          <Route path="/driver/*" element={<DriverRoutes />} />
        </Routes>
      </Router>
      </SocketProvider>
    </>
  )
}

export default App
