import { JSX } from "react";
import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
    allowedRoles: string[];
  }

  export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {

    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
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
    const token = localStorage.getItem("token");
    const isLoggedIn = !!token;
    return isLoggedIn ? <Navigate to="/super-admin/dashboard" replace /> : <Outlet />;
  };