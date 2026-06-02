import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';

import Login from './components/Login';
import CreateAccount from './components/CreateAccount';
import Dashboard from './components/Dashboard';
import Department from './components/Department';
import Employee from './components/Employee';
import Salary from './components/Salary';
import Report from './components/Report';
import NotFound from './components/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import NavBar from './components/NavBar';

function App() {
  return (
    <Router>
      {/* Premium Notification Handler */}
      <Toaster position="top-right" richColors expand={false} />
      
      <div className="min-h-screen bg-zinc-50 text-zinc-950 font-sans antialiased selection:bg-indigo-500 selection:text-white">
        <Routes>
          {/* Public Authentication Endpoints */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<CreateAccount />} />

          {/* Secure Protected Workspace */}
          <Route element={<ProtectedRoute />}>
            {/* LayoutWrapper is placed here as a parent route wrapping child routes layout */}
            <Route element={<LayoutWrapper />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/departments" element={<Department />} />
              <Route path="/employees" element={<Employee />} />
              <Route path="/salaries" element={<Salary />} />
              <Route path="/reports" element={<Report />} />
              {/* Internal redirect pattern */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Route>

          {/* Fallbacks */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

// Fixed LayoutWrapper using an <Outlet /> instead of an nested <Routes> container block
function LayoutWrapper() {
  return (
    <>
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* The Outlet renders whatever child route component is currently active in the address bar */}
        <Outlet />
      </main>
    </>
  );
}

export default App;