import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminRoute = ({ children }) => {
  const { currentUser, isAdmin } = useAuth();

  if (!currentUser || !isAdmin) {
    // If not logged in or not an admin, redirect to home
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
