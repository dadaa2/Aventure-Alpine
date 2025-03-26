import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

// Route qui nécessite une authentification
const PrivateRoute = () => {
  const { currentUser } = useAuth();
  
  // Si l'utilisateur n'est pas connecté, redirection vers la page de connexion
  // Sinon, render child routes
  return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;