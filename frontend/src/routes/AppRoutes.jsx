import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Dashboard from "../pages/common/Dashboard";

// ADMIN
import AdminLayout from "../layouts/AdminLayout.jsx";
import AdminDashboard from "../pages/admin/Dashboard";
import AdminStudentCreate from "../pages/admin/students/Create.jsx";
import AdminStudentList from "../pages/admin/students/List.jsx";
import AdminTeacherCreate from "../pages/admin/teachers/Create.jsx";

// ADMIN → STUDENT PROFILE
import AdminStudentLayout from "../layouts/StudentLayout.jsx";
import StudentOverview from "../pages/student/Overview.jsx";
import StudentFees from "../pages/admin/students/AddFees.jsx";
import StudentReport from "../pages/student/Report.jsx";

// TEACHER
import TeacherLayout from "../layouts/TeacherLayout.jsx";
import TeacherFees from "../pages/teacher/Fees";

// STUDENT
import StudentLayout from "../pages/student/Layout";
import Overview from "../pages/student/Overview";
import Fees from "../pages/student/Fees";
import Report from "../pages/student/Report";

export default function AppRoutes() {
  const token = sessionStorage.getItem("token");

  return (
    <Routes>

      <Route path="/login" element={<Login />} />

      <Route path="/" element={token ? <Dashboard /> : <Navigate to="/login" />} />

      {/* ADMIN */}
      <Route path="/admin" element={token ? <AdminLayout /> : <Navigate to="/login" />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="students/create" element={<AdminStudentCreate />} />
        <Route path="students/list" element={<AdminStudentList />} />
        <Route path="teachers/create" element={<AdminTeacherCreate />} />
      </Route>

      {/* ADMIN → STUDENT PROFILE */}
      <Route path="/admin/students/:id" element={<AdminStudentLayout />}>
        <Route path="overview" element={<StudentOverview />} />
        <Route path="fees" element={<StudentFees />} />
        <Route path="report" element={<StudentReport />} />
      </Route>

      {/* TEACHER */}
      <Route path="/teacher" element={token ? <TeacherLayout /> : <Navigate to="/login" />}>
        <Route path="fees" element={<TeacherFees />} />
      </Route>

      {/* STUDENT */}
      <Route path="/student/:id" element={<StudentLayout/>}>
        <Route path="overview" element={<Overview />} />
        <Route path="fees" element={<Fees />} />
        <Route path="report" element={<Report />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
