import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import UserRoutes from "./routes/UserRoutes";
import SuperAdminRoutes from "./routes/SuperAdminRoutes";
import WastePlantRoutes from "./routes/WastePlantRoutes";

function App() {

  return (
    <>
      <Router>
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
        <Routes>
          <Route path="/*" element={<UserRoutes />} />
          <Route path="/super-admin/*" element={<SuperAdminRoutes />} />
          <Route path="/waste-plant/*" element={<WastePlantRoutes />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
