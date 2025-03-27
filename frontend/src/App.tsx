import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import UserRoutes from "./routes/UserRoutes";

function App() {

  return (
    <>
      <Router>
        <ToastContainer position="top-right" autoClose={5000} theme="colored" />
        <Routes>
          <Route path="/*" element={<UserRoutes />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
