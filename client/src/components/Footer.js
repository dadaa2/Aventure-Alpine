import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-light py-4 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h5>Aventure Alpine</h5>
            <p>Découvrez des expériences inoubliables en montagne</p>
          </div>
          <div className="col-md-4">
            <h5>Liens utiles</h5>
            <ul className="list-unstyled">
              <li><Link to="/">Accueil</Link></li>
              <li><Link to="/prestations">Prestations</Link></li>
              <li><Link to="/articles">Articles</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5>Contact</h5>
            <address>
              <p>123 Route des Montagnes<br />
              74000 Annecy<br />
              contact@aventure-alpine.fr<br />
              01 23 45 67 89</p>
            </address>
          </div>
        </div>
        <hr />
        <div className="text-center">
          <p>&copy; {new Date().getFullYear()} Aventure Alpine. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;