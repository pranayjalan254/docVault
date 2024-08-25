import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = () => {
  const { isAuthenticated, userType } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  if (userType === "institution") {
    return <Navigate to="/insti-dashboard" />;
  } else if (userType === "student") {
    return <Navigate to="/stud-dashboard" />;
  }

  return <Outlet />; // Render child routes if conditions above don’t match
};

export default ProtectedRoute;
