import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fonction pour vérifier le token au chargement
    const verifyToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Configure axios pour envoyer le token dans toutes les requêtes
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        const response = await axios.get('http://localhost:3002/auth/verify-token');
        setCurrentUser(response.data.user);
      } catch (error) {
        console.error('Error verifying token:', error);
        // Si le token est invalide, déconnexion
        logout();
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  // Fonction de connexion
  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:3002/auth/login', {
        mail: email,
        password: password
      });
      
      const { user, token } = response.data;
      
      setCurrentUser(user);
      setToken(token);
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Fonction d'inscription
  const register = async (userData) => {
    try {
      const response = await axios.post('http://localhost:3002/auth/register', userData);
      
      const { user, token } = response.data;
      
      setCurrentUser(user);
      setToken(token);
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  // Vérifier si l'utilisateur est admin
  const isAdmin = () => {
    return currentUser?.roleId === 3;
  };

  // Valeurs exposées par le context
  const value = {
    currentUser,
    login,
    register,
    logout,
    isAdmin,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};