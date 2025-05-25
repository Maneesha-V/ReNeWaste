import { Navigate, Outlet } from "react-router-dom";
import { ProtectedRouteProps } from "../../types/commonTypes";

  export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {

    const token = sessionStorage.getItem("admin_token");
    const storedRole = sessionStorage.getItem("admin_role");
    console.log({token, storedRole});
    
    const isLoggedIn = !!token;
    const role =  storedRole;
  
    if (!isLoggedIn) {
      return <Navigate to="/super-admin" replace />;
    }
  
    if (allowedRoles && !allowedRoles.includes(role || "")) {
      return <Navigate to="/super-admin/unauthorized" replace />;
    }
  
    return <Outlet />;
  };
  
  export const ProtectedAuthRoute = () => {
    const token = sessionStorage.getItem("admin_token");
    const isLoggedIn = !!token;
    return isLoggedIn ? <Navigate to="/super-admin/dashboard" replace /> : <Outlet />;
  };