import React from 'react'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom'

import Article from './Article'

function ArticlesMain() {
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
        Toutes les articles disponibles
      </div>

      {/* Affichage des articles */}
      
      {listOfArticles.map((value, key) => (
        <div className="card" key={key}>
        <img class="card-img-top" src=""/>

          <div className="card-body">
            <div>
              <h5 className="card-title">{value.title}</h5>
            </div>
            <p className="card-text">{value.contentArticle}</p>
          </div>
          <div>
            <Routes>
              <Route path="/:id" element={<Article />} />
            </Routes>
          </div>


        </div>
      ))}

    </div>
  )
}

export default ArticlesMain