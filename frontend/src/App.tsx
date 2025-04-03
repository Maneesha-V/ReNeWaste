import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import UserRoutes from "./routes/UserRoutes";
import SuperAdminRoutes from "./routes/SuperAdminRoutes";

function App() {

  return (
    <>
      <Router>
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
        <Routes>
          <Route path="/*" element={<UserRoutes />} />
          <Route path="/super-admin/*" element={<SuperAdminRoutes />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
