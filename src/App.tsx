import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Dashboard from "./pages/dashboard/Dashboard";
import Classes from "./pages/classes/Classes";
import Students from "./pages/students/Students";
import Attendance from "./pages/attendance/Attendance";
import History from "./pages/history/History";

import AdminDashboard from "./pages/adminDashboard/AdminDashboard";
import Unauthorized from "./pages/Unauthorized";

import AppLayout from "./components/layout/AppLayout";
import AdminLayout from "./components/layout/AdminLayout";

import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* TEACHER / USER ROUTES */}
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="classes" element={<Classes />} />
          <Route path="students" element={<Students />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="history" element={<History />} />
        </Route>

        {/* ADMIN ROUTES (SEPARATE LAYOUT) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}