// src/components/AdminRoute.jsx
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function AdminRoute({ children }) {
  const { user, loading } = useContext(UserContext);

  if (loading) return <div className="p-10 text-xl">Loading user...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/not-authorized" replace />;

  return children;
}
