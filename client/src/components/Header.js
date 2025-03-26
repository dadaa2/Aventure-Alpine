import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../pages/auth/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, faSignOutAlt, faUserShield, faHome, faHiking, faBookOpen,
  faUsers, faMountain, faCalendarCheck
} from '@fortawesome/free-solid-svg-icons';

function Header() {
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-light py-3 shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">
            Aventure Alpine
          </Link>
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav" 
            aria-controls="navbarNav" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  <FontAwesomeIcon icon={faHome} className="me-1" /> Accueil
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/prestations">
                  <FontAwesomeIcon icon={faHiking} className="me-1" /> Prestations
                </Link>
              </li>
              {/* Menu admin directement accessible */}
              {currentUser && isAdmin() && (
                <li className="nav-item dropdown">
                  <a 
                    className="nav-link dropdown-toggle" 
                    href="#" 
                    id="adminDropdown" 
                    role="button" 
                    data-bs-toggle="dropdown" 
                    aria-expanded="false"
                  >
                    <FontAwesomeIcon icon={faUserShield} className="me-1" />
                    Administration
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="adminDropdown">

                    {/* <li>
                      <Link className="dropdown-item" to="/admin">
                        <FontAwesomeIcon icon={faTachometerAlt} className="me-2" /> Tableau de bord
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li> */}

                    <li>
                      <Link className="dropdown-item" to="/admin/users">
                        <FontAwesomeIcon icon={faUsers} className="me-2" /> Gestion des utilisateurs
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/admin/prestations">
                        <FontAwesomeIcon icon={faMountain} className="me-2" /> Gestion des prestations
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/admin/bookings">
                        <FontAwesomeIcon icon={faCalendarCheck} className="me-2" /> Gestion des réservations
                      </Link>
                    </li>
                    {/* <li><hr className="dropdown-divider" /></li>
                    <li>
                      <Link className="dropdown-item" to="/admin/stats">
                        <FontAwesomeIcon icon={faChartLine} className="me-2" /> Statistiques
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/admin/settings">
                        <FontAwesomeIcon icon={faCog} className="me-2" /> Paramètres
                      </Link>
                    </li> */}
                  </ul>
                </li>
              )}
            </ul>
            
            <div className="navbar-nav">
              {currentUser ? (
                <li className="nav-item dropdown">
                  <a 
                    className="nav-link dropdown-toggle" 
                    href="#" 
                    id="navbarDropdown" 
                    role="button" 
                    data-bs-toggle="dropdown" 
                    aria-expanded="false"
                  >
                    <FontAwesomeIcon icon={faUser} className="me-1" />
                    {currentUser.pseudo || 'Mon compte'}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                    {/* <li>
                      <Link className="dropdown-item" to="/user/profile">
                        Mon profil
                      </Link>
                    </li> */}
                    <li>
                      <Link className="dropdown-item" to="/user/bookings">
                        <FontAwesomeIcon icon={faBookOpen} className="me-1" /> Mes réservations
                      </Link>
                    </li>
                    {/* {isAdmin() && (
                      <>
                        <li><hr className="dropdown-divider" /></li>
                        <li>
                          <Link className="dropdown-item" to="/admin">
                            <FontAwesomeIcon icon={faUserShield} className="me-1" /> Administration
                          </Link>
                        </li>
                      </>
                    )} */}
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button 
                        className="dropdown-item" 
                        onClick={handleLogout}
                      >
                        <FontAwesomeIcon icon={faSignOutAlt} className="me-1" /> Déconnexion
                      </button>
                    </li>
                  </ul>
                </li>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link btn btn-outline-primary me-2" to="/login">
                      Connexion
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link btn btn-primary" to="/register">
                      Inscription
                    </Link>
                  </li>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;