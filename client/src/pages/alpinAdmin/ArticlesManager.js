import React from 'react'
import axios from 'axios';
import { useEffect, useState } from 'react';
/* import UsersCreate from './UsersCreate';
 */
function ArticlesManager() {
  const [listOfArticles, setListOfArticles] = useState([]);
  useEffect(() => { 
    axios.get("http://localhost:3002/articles").then((response) => {
      setListOfArticles(response.data);
      /* console.log(response.data); */
    });
  }, []);

  return (
    <div className="container my-5">
      <div className="mb-4">
        Section création d'article ? ou un renvoie vers la page de création d'article
        {/* <UsersCreate /> */}
      </div>

      {/* Affichage des articles */}
      
      {listOfArticles.map((value, key) => (

        <div className="card" key={key}>
        <img class="card-img-top" src=""/>

          <div className="card-body">
            <div>
              <h5 className="card-title">{value.title}</h5>
              <button className="btn btn-warning btn-sm mx-1">Modifier</button>
              <button className="btn btn-danger btn-sm mx-1">Supprimer</button>
            </div>
            <p className="card-text">{value.contentArticle}</p>
          </div>




        {/* <img class="card-img-top" src="{value.mainPicture}" si image n'est pas chargé alt="Card image cap" />
          <div class="card-body">
            <h5 class="card-title">{validateYupSchema.listOfArticles}</h5>
            <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            <a href="#" class="btn btn-primary">Go somewhere</a>
          </div> */}

        </div>
      ))}





    </div>
  );
}

export default ArticlesManager