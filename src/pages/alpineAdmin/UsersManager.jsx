import { useEffect, useState } from 'react';
import { fetchUsers } from '../../services/UsersServices';

function UsersManager() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function loadUsers() {
      try {
        const usersData = await fetchUsers();
        setUsers(usersData);
      } catch (error) {
        console.error('Failed to load users', error);
      }
    }

    loadUsers();
  }, []);

  return (
    <>
    <div>
      Partie rechercher 
    </div>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Id</th>
            <th>FirstName</th>
            <th>LastName</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>Modifier Supprimer</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default UsersManager;