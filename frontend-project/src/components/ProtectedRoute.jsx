import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Check express-session context simulation via localstorage/cookie validation check
  // In production, sync this state via an AuthContext pulling from your /api/auth base verification route
  const isAuthenticated = document.cookie.includes('connect.sid') || localStorage.getItem('isLoggedIn') === 'true';

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;