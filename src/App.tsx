import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HRMSProvider } from './context/HRMSContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AppShell } from './components/layout/AppShell';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Employee Pages
import { EmployeeDashboard } from './pages/employee/EmployeeDashboard';
import { EmployeeProfile } from './pages/employee/EmployeeProfile';
import { EmployeeAttendance } from './pages/employee/EmployeeAttendance';
import { EmployeeLeave } from './pages/employee/EmployeeLeave';
import { EmployeePayroll } from './pages/employee/EmployeePayroll';
import { EmployeeNotifications } from './pages/employee/EmployeeNotifications';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminEmployees } from './pages/admin/AdminEmployees';
import { AdminAttendance } from './pages/admin/AdminAttendance';
import { AdminLeave } from './pages/admin/AdminLeave';
import { AdminPayroll } from './pages/admin/AdminPayroll';
import { AdminReports } from './pages/admin/AdminReports';

const RootRedirect: React.FC = () => {
  const { isAuthenticated, currentRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (currentRole === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Navigate to="/employee/dashboard" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <HRMSProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<RootRedirect />} />

            {/* Employee Protected Routes */}
            <Route
              path="/employee"
              element={
                <ProtectedRoute allowedRole="employee">
                  <AppShell />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<EmployeeDashboard />} />
              <Route path="profile" element={<EmployeeProfile />} />
              <Route path="attendance" element={<EmployeeAttendance />} />
              <Route path="leave" element={<EmployeeLeave />} />
              <Route path="payroll" element={<EmployeePayroll />} />
              <Route path="notifications" element={<EmployeeNotifications />} />
              <Route index element={<Navigate to="/employee/dashboard" replace />} />
            </Route>

            {/* Admin Protected Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRole="admin">
                  <AppShell />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="employees" element={<AdminEmployees />} />
              <Route path="attendance" element={<AdminAttendance />} />
              <Route path="leave" element={<AdminLeave />} />
              <Route path="payroll" element={<AdminPayroll />} />
              <Route path="analytics" element={<AdminReports />} />
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<RootRedirect />} />
          </Routes>
        </BrowserRouter>
      </HRMSProvider>
    </AuthProvider>
  );
}
