import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./src/context/authContext";

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!currentUser) {
    return <Navigate to="/loginsignup" replace />;
  }

  return children;
};

export default ProtectedRoute;
