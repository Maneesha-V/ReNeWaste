import { Navigate, Outlet } from "react-router-dom";
import { ProtectedRouteProps } from "../../types/commonTypes";

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    console.log({token,storedRole});

    const isLoggedIn = !!token;
    const role =  storedRole;

    if(!isLoggedIn){
        return <Navigate to="/" replace />
    }

    if(allowedRoles && !allowedRoles.includes(role || "")){
        return <Navigate to="/unauthorized" replace />
    }
    return <Outlet />
}

export const ProtectedAuthRoute = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const isLoggedIn = !!token && !!role;
    return isLoggedIn ? <Navigate to="/home" replace /> : <Outlet />;
  };