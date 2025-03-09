function Header() {
  let user = "";
    return (
      <>
        <header className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
          <ul className="navbar-nav ms-auto">
            <li className="nav-link">Accueil</li>
            <li className="nav-link">Prestation</li>
            <li className="nav-link">Articles</li>
            if user == admin
              <li className="nav-link">Administation</li>
              avec un drop-down
                <li className="nav-link">Utilisateurs</li>
                <li className="nav-link">Prestations</li>
                <li className="nav-link">Articles</li>
            if user == client
              <li className="nav-link">Mes réservation</li>
              <li className="nav-link">Mon Compte</li>
            if user == none
              <li className="nav-link">Inscription</li>
              <li className="nav-link">Connexion</li>
          </ul>
        </header>
      </>
    )
  }
  
  export default Header
  