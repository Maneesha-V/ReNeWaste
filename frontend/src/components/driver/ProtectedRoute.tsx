import { Navigate, Outlet } from "react-router-dom";
import { ProtectedRouteProps } from "../../types/commonTypes";

  export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {

    const token = sessionStorage.getItem("driver_token");
    const storedRole = sessionStorage.getItem("driver_role");
    console.log({token, storedRole});
    
    const isLoggedIn = !!token;
    const role =  storedRole;
  
    if (!isLoggedIn) {
      return <Navigate to="/driver" replace />;
    }
  
    if (allowedRoles && !allowedRoles.includes(role || "")) {
      return <Navigate to="/driver/unauthorized" replace />;
    }
  
    return <Outlet />;
  };
  
  export const ProtectedAuthRoute = () => {
    const token = sessionStorage.getItem("driver_token");
    const isLoggedIn = !!token;
    return isLoggedIn ? <Navigate to="/driver/dashboard" replace /> : <Outlet />;
  };