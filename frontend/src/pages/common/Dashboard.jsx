// src/pages/Dashboard.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function Dashboard() {
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

  // Not logged in
  if (!user.role) return <Navigate to="/login" />;

  // Role-based redirect
  if (user.role === "admin") return <Navigate to="/admin/dashboard" />;
  if (user.role === "teacher") return <Navigate to="/teacher/fees" />;
  if (user.role === "student") return <Navigate to={`/student/${user.studentId}/overview`} />;

  return <Navigate to="/login" />;
}
