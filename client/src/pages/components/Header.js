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

          <li className="nav-item dropdown">
            <a 
              className='nav-link dropdown toggle' 
              id="navbarDropdown" 
              role="button" 
              data-toggle="dropdown"
              aria-haspopup="true" 
              aria-expanded="false"
              >
              Administration
            </a>
            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
              <li className="dropdown-item">
                 <Link to="/admin/users">Gestion utilisateurs</Link>
              </li>
              <li className="dropdown-item">
                <Link to="/admin/articles">Gestion articles</Link>
              </li>
            </div>
          </li>





          <li className="nav-item">
            <Link to="/reservation" className='nav-link'> Mes réservation </Link>
          </li>
          <li className="nav-item"><Link to="/my-account">Mon compte</Link></li>
            <li className="nav-item">Inscription</li>
            <li className="nav-item">Connexion</li>
        </ul>
      </nav>
    </div>
  )
}

export default Header