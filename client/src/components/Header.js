/* Import de librairie */
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();

  // Fonction simplifiée pour naviguer
  const handleNavigation = (path, event) => {
    // Empêcher la navigation par défaut du lien
    if (event) event.preventDefault();
    
    // Fermer tous les dropdowns ouverts
    const dropdowns = document.querySelectorAll('.dropdown-menu.show');
    dropdowns.forEach(dropdown => {
      dropdown.classList.remove('show');
    });
    
    // Utiliser navigate pour changer de page
    navigate(path);
  };

  return (
    <div className='header'>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand">
            <img src="/logo.png" alt="Aventure Alpine" height="40" />
          </Link>
          
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link to="/" className='nav-link' onClick={(e) => handleNavigation('/', e)}>Accueil</Link>  
              </li>
              <li className="nav-item">
                <Link to="/prestations" className='nav-link' onClick={(e) => handleNavigation('/prestations', e)}>Prestations</Link>
              </li>
              <li className="nav-item">
                <Link to="/articles" className='nav-link' onClick={(e) => handleNavigation('/articles', e)}>Articles</Link>
              </li>

              {/* Menu Admin - accessible à tous */}
              <li className="nav-item dropdown">
                <a href="#" className='nav-link dropdown-toggle' 
                  id="adminDropdown" 
                  role="button" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false">
                  Administration
                </a>
                <ul className='dropdown-menu' aria-labelledby="adminDropdown">
                  <li>
                    <Link to="/admin/users" className="dropdown-item" onClick={(e) => handleNavigation('/admin/users', e)}>
                      Gestion utilisateurs
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/articles" className="dropdown-item" onClick={(e) => handleNavigation('/admin/articles', e)}>
                      Gestion articles
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/prestations" className="dropdown-item" onClick={(e) => handleNavigation('/admin/prestations', e)}>
                      Gestion prestations
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/bookings" className="dropdown-item" onClick={(e) => handleNavigation('/admin/bookings', e)}>
                      Gestion réservations
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Menu utilisateur - accessible à tous */}
              <li className="nav-item dropdown">
                <a href="#" className='nav-link dropdown-toggle' 
                  id="userDropdown" 
                  role="button" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false">
                  Mon compte
                </a>
                <ul className='dropdown-menu' aria-labelledby="userDropdown">
                  <li>
                    <Link to="/user/profile" className="dropdown-item" onClick={(e) => handleNavigation('/user/profile', e)}>
                      Mon profil
                    </Link>
                  </li>
                  <li>
                    <Link to="/user/bookings" className="dropdown-item" onClick={(e) => handleNavigation('/user/bookings', e)}>
                      Mes réservations
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider"/></li>
                  <li>
                    <Link to="/user/settings" className="dropdown-item" onClick={(e) => handleNavigation('/user/settings', e)}>
                      Paramètres
                    </Link>
                  </li>
                  <li>
                    <Link to="/login" className="dropdown-item" onClick={(e) => handleNavigation('/login', e)}>
                      Connexion
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>  
    </div>
  );
}

export default Header;