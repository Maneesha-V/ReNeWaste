import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
    allowedRoles: string[];
  }

  export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {

    // const token = localStorage.getItem("token");
    // const storedRole = localStorage.getItem("role");
    const token = sessionStorage.getItem("wasteplant_token");
    const storedRole = sessionStorage.getItem("wasteplant_role");
    console.log({token, storedRole});
    
    const isLoggedIn = !!token;
    const role =  storedRole;
  
    if (!isLoggedIn) {
      return <Navigate to="/waste-plant" replace />;
    }
  
    if (allowedRoles && !allowedRoles.includes(role || "")) {
      return <Navigate to="/waste-plant/unauthorized" replace />;
    }
  
    return <Outlet />;
  };
  
  export const ProtectedAuthRoute = () => {
    // const token = localStorage.getItem("token");
    const token = sessionStorage.getItem("wasteplant_token");
    const isLoggedIn = !!token;
    return isLoggedIn ? <Navigate to="/waste-plant/dashboard" replace /> : <Outlet />;
  };