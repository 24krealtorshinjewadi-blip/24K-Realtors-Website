import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Portal } from './pages/Portal';
import { Login } from './pages/Login';
import { Overview } from './pages/Overview';
import { Employees } from './pages/Employees';
import { Attendance } from './pages/Attendance';
import { Leaves } from './pages/Leaves';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './layouts/DashboardLayout';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public Website */}
          <Route path="/" element={<Portal />} />
          
          {/* Operator Login */}
          <Route path="/login" element={<Login />} />

          {/* Secure CRM / HRMS Workspace */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Overview />} />
              <Route path="/dashboard/employees" element={<Employees />} />
              <Route path="/dashboard/attendance" element={<Attendance />} />
              <Route path="/dashboard/leaves" element={<Leaves />} />
              {/* Other modules will be routed here */}
              <Route path="/dashboard/*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
