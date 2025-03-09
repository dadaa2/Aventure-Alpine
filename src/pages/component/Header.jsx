function Header() {
    return (
      <>
        <li>
          <ul>Accueil</ul>
          <ul>Prestation</ul>
          <ul>Articles</ul>
          if user == admin
            <ul>Administation</ul>
          elsif user == client
            <ul>Mes réservation</ul>
            <ul>Mon Compte</ul>
          <ul>Contact</ul>
        </li>
      </>
    )
  }
  
  export default Header
  