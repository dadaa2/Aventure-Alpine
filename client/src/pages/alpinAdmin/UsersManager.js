import React from 'react'
import axios from 'axios';
import { useEffect, useState } from 'react';
import UsersCreate from './UsersCreate';

function UsersManager() {
  
  const [listOfUsers, setListOfUsers] = useState([]);
  useEffect(() => { 
    axios.get("http://localhost:3002/users").then((response) => {
      setListOfUsers(response.data);
      /* console.log(response.data); */
    });
  }, []);

  return (
    <div className="container my-5">
      {/* Création des utilisateurs */}
      <div className="mb-4">
        <UsersCreate />
      </div>

      {/* Affichage des utilisateurs */}
      <div className="table-responsive">
        <table className="table table-bordered table-striped table-hover">
          <thead className="table-dark">
            <tr className="text-center">
              <th>Adresse mail</th>
              <th>Pseudo</th>
              <th>Prénom</th>
              <th>Nom</th>
              <th>Rue</th>
              <th>Ville</th>
              <th>Code postal</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {listOfUsers.map((value, key) => (
              <tr key={key}>
                <td className="text-start align-middle">{value.mail}</td>
                <td className="text-start align-middle">{value.pseudo}</td>
                <td className="text-start align-middle">{value.firstName}</td>
                <td className="text-start align-middle">{value.lastName}</td>
                <td className="text-start align-middle">{value.street}</td>
                <td className="text-start align-middle">{value.city}</td>
                <td className="text-end align-middle">{value.zipCode}</td>
                <td className="text-center align-middle">
                  <button className="btn btn-warning btn-sm mx-1">Modifier</button>
                  <button className="btn btn-danger btn-sm mx-1">Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UsersManager