import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UsersCreate from './UsersCreate';

function UsersManager() {
  const [listOfUsers, setListOfUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3002/users');
      setListOfUsers(response.data.rows); // Assuming pagination is used
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3002/users/${id}`);
      fetchUsers(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const handleUpdate = async (updatedUser) => {
    try {
      await axios.put(`http://localhost:3002/users/${updatedUser.id}`, updatedUser);
      setEditingUser(null);
      fetchUsers(); // Refresh the list after update
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

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
            {listOfUsers.map((user) => (
              <tr key={user.id}>
                <td className="text-start align-middle">{user.mail}</td>
                <td className="text-start align-middle">{user.pseudo}</td>
                <td className="text-start align-middle">{user.firstName}</td>
                <td className="text-start align-middle">{user.lastName}</td>
                <td className="text-start align-middle">{user.street}</td>
                <td className="text-start align-middle">{user.city}</td>
                <td className="text-end align-middle">{user.zipCode}</td>
                <td className="text-center align-middle">
                  <button
                    className="btn btn-warning btn-sm mx-1"
                    onClick={() => handleEdit(user)}
                  >
                    Modifier
                  </button>
                  <button
                    className="btn btn-danger btn-sm mx-1"
                    onClick={() => handleDelete(user.id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Formulaire de modification */}
      {editingUser && (
        <div className="mt-4">
          <h3>Modifier l'utilisateur</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdate(editingUser);
            }}
          >
            <div className="mb-3">
              <label>Adresse mail</label>
              <input
                type="email"
                className="form-control"
                value={editingUser.mail}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, mail: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label>Pseudo</label>
              <input
                type="text"
                className="form-control"
                value={editingUser.pseudo}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, pseudo: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label>Prénom</label>
              <input
                type="text"
                className="form-control"
                value={editingUser.firstName}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, firstName: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label>Nom</label>
              <input
                type="text"
                className="form-control"
                value={editingUser.lastName}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, lastName: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label>Rue</label>
              <input
                type="text"
                className="form-control"
                value={editingUser.street}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, street: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label>Ville</label>
              <input
                type="text"
                className="form-control"
                value={editingUser.city}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, city: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label>Code postal</label>
              <input
                type="text"
                className="form-control"
                value={editingUser.zipCode}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, zipCode: e.target.value })
                }
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Enregistrer
            </button>
            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={() => setEditingUser(null)}
            >
              Annuler
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default UsersManager;