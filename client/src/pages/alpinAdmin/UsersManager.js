import React from 'react'
import axios from 'axios';
import { useEffect, useState } from 'react';

function UsersManager() {
  
  const [listOfUsers, setListOfUsers] = useState([]);
  
  useEffect(() => { 
    axios.get("http://localhost:3002/users").then((response) => {
      setListOfUsers(response.data);
      console.log(response.data);
    });
  }, []);

  return (
    <div>
      {listOfUsers.map((value, key) => { 
      return ( 
        <ul>
          <div className='post'> 
            <div className='title'> { value.mail } </div>
            <div className='mail'> { value.pseudo } </div>
            <div className='mail'> { value.firstName } </div>
            <div className='mail'> { value.lastName } </div>
            <div className='mail'> { value.street } </div>
            <div className='mail'> { value.zipCode } </div>
            <div className='mail'> { value.city } </div>
          </div> 
        </ul>
      )})}
    </div>
  )
}

export default UsersManager