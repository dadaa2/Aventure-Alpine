import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

// Pages publiques
import Home from './pages/Home';
import PrestationsMain from './pages/PrestationsMain';
import PrestationDetail from './pages/PrestationDetail';
import ArticlesMain from './pages/ArticlesMain';
import ArticleDetail from './pages/ArticleDetail';

// Pages d'authentification
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Pages utilisateur
import UserProfile from './pages/user/Profile';
import UserBookings from './pages/user/MyBookings';
import UserSettings from './pages/user/Settings';

// Pages admin
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/users/UsersManager';
import AdminUserDetail from './pages/admin/users/UserDetail';
import AdminUserCreate from './pages/admin/users/UserCreate';
import AdminUserEdit from './pages/admin/users/UserEdit';
import AdminPrestations from './pages/admin/prestations/PrestationsManager';
import AdminPrestationCreate from './pages/admin/prestations/PrestationCreate';
import AdminPrestationEdit from './pages/admin/prestations/PrestationEdit';
import AdminPrestationDetail from './pages/admin/prestations/PrestationDetail';
import AdminBookings from './pages/admin/bookings/BookingsManager';
import AdminBookingDetail from './pages/admin/bookings/BookingDetail';
import AdminBookingCreate from './pages/admin/bookings/BookingCreate';
import AdminBookingEdit from './pages/admin/bookings/BookingEdit';

// Routes protégées
import PrivateRoute from './pages/auth/PrivateRoute';
import AdminRoute from './pages/auth/AdminRoute';

function App() {
  const location = useLocation();
  const [key, setKey] = useState(0);
  
  useEffect(() => {
    setKey(prevKey => prevKey + 1);
    console.log('Location changed to:', location.pathname);
  }, [location.pathname]);

  return (
    <div className="App">
      <Header />
      <div className="container" key={key}>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<Home />} />
          <Route path="/prestations" element={<PrestationsMain />} />
          <Route path="/prestations/:id" element={<PrestationDetail />} />
          <Route path="/articles" element={<ArticlesMain />} />
          <Route path="/articles/:id" element={<ArticleDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Routes utilisateur protégées */}
          <Route element={<PrivateRoute />}>
            <Route path="/user/profile" element={<UserProfile />} />
            <Route path="/user/bookings" element={<UserBookings />} />
            <Route path="/user/settings" element={<UserSettings />} />
          </Route>
          
          {/* Routes admin protégées */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/users/:id" element={<AdminUserDetail />} />
            <Route path="/admin/users/create" element={<AdminUserCreate />} />
            <Route path="/admin/users/edit/:id" element={<AdminUserEdit />} />
            
            <Route path="/admin/prestations" element={<AdminPrestations />} />
            <Route path="/admin/prestations/create" element={<AdminPrestationCreate />} />
            <Route path="/admin/prestations/edit/:id" element={<AdminPrestationEdit />} />
            <Route path="/admin/prestations/:id" element={<AdminPrestationDetail />} />

            <Route path="/admin/bookings" element={<AdminBookings />} />
            <Route path="/admin/bookings/create" element={<AdminBookingCreate />} />
            <Route path="/admin/bookings/:id" element={<AdminBookingDetail />} />
            <Route path="/admin/bookings/:id/edit" element={<AdminBookingEdit />} />
          </Route>
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;