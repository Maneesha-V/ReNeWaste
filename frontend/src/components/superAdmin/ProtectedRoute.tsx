import { Navigate, Outlet } from "react-router-dom";
import { ProtectedRouteProps } from "../../types/common/commonTypes";

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
  
  // export const ProtectedAuthRoute = () => {
  //   const token = localStorage.getItem("token");
  //   const role = localStorage.getItem("role");
  //   const isLoggedIn = !!token && !!role;
  //   return isLoggedIn ? <Navigate to="/super-admin/dashboard" replace /> : <Outlet />;
  // };
  export const ProtectedAuthRoute = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    
    if(!token){
      return <Outlet />
    }
    if(role === "superadmin"){
      return <Navigate to="/super-admin/dashboard" replace />
    }
    return <Outlet />;
  };