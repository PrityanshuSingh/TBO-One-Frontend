// src/components/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { isAuthLoading, isAuthenticated } = useContext(AuthContext);

  if (isAuthLoading) {
    return <div>Loading user session...</div>;
  }

  // Once done loading, if not authenticated, redirect
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Auth is valid, show the protected content
  return children;
}

export default ProtectedRoute;
