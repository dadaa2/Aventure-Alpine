import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

// Route qui nécessite des droits d'administrateur
const AdminRoute = () => {
  const { currentUser, isAdmin } = useAuth();
  
  // Si l'utilisateur n'est pas connecté, redirection vers la page de connexion
  // Si l'utilisateur n'est pas admin, redirection vers la page d'accueil
  // Sinon, render child routes
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  return isAdmin() ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;