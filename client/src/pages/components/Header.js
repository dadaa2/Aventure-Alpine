/* Import de librairie */
import React from 'react'
import { Link } from 'react-router-dom'

/* 
import PrestationsMain from '../PrestationsMain'
 */

function Header() {
  return (
    <div className='header'>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <Link to="/" className='nav-link'>Accueil</Link>  
          </li>
          <li className="nav-item">
            <Link to="/prestations" className='nav-link'>Prestations</Link>
          </li>
          <li className="nav-item">
            <Link to="/articles" className='nav-link'>Articles</Link>
          </li>

          <li className="nav-item">
            <div className='dropdown'>
              <a href="#" className='nav-link dropdown-toggle' 
                id="adminDropdown" 
                role="button" 
                data-bs-toggle="dropdown" 
                aria-expanded="false">
                Administration
              </a>
              <ul className='dropdown-menu' aria-labelledby="adminDropdown">
                <li>
                   <Link to="/admin/users" className="dropdown-item">Gestion utilisateurs</Link>
                </li>
                <li>
                  <Link to="/admin/articles" className="dropdown-item">Gestion articles</Link>
                </li>
              </ul>
            </div>
          </li>
          <li className="nav-item">
            <div className='dropdown'>
              <a href="#" className='nav-link dropdown-toggle' 
                id="userDropdown" 
                role="button" 
                data-bs-toggle="dropdown" 
                aria-expanded="false">
                Mon compte
              </a>
              <ul className='dropdown-menu' aria-labelledby="userDropdown">
                <li>
                   <Link to="/user/profile" className="dropdown-item">Mon profil</Link>
                </li>

                <li>
                   <Link to="/user/booking" className="dropdown-item">Mes réservations</Link>
                </li>
                <li><hr class="dropdown-divider"/>
                </li>
                <li>
                   <Link to="/user/parameter" className="dropdown-item">Paramètre</Link>
                </li>
                <li>
                  <Link to="/user/deconnection" className="dropdown-item">Déconnexion</Link>
                </li>
              </ul>
            </div>
          </li>         

          
        </ul>
      </nav>  
    </div>
  )
}

export default Header