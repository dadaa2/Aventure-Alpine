import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrashAlt, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import UserController from '../../../controllers/UserController';

function UsersManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [page]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await UserController.getUsers(page, 10, searchTerm);
      setUsers(data.rows);
      setTotalPages(Math.ceil(data.count / 10));
      setLoading(false);
    } catch (err) {
      setError('Erreur lors du chargement des utilisateurs');
      setLoading(false);
      console.error(err);
    }
  };

  const fetchRoles = async () => {
    try {
      const data = await UserController.getAllRoles();
      setRoles(data);
    } catch (err) {
      console.error('Erreur lors du chargement des rôles:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await UserController.deleteUser(id);
        fetchUsers();
      } catch (err) {
        setError('Erreur lors de la suppression de l\'utilisateur');
        console.error(err);
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const getRoleName = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.roleName : 'Utilisateur';
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  if (loading) return (
    <div className="container mt-5 text-center">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Chargement...</span>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="container mt-5 alert alert-danger">
      {error}
    </div>
  );

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Gestion des utilisateurs</h2>
        <Link to="/admin/users/create" className="btn btn-success">
          <FontAwesomeIcon icon={faPlus} /> Nouvel utilisateur
        </Link>
      </div>

      <div className="card shadow mb-4">
        <div className="card-header bg-primary text-white py-3 d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Liste des utilisateurs</h5>
          <form className="d-flex" onSubmit={handleSearch}>
            <input 
              type="text" 
              className="form-control me-2" 
              placeholder="Rechercher..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-light" type="submit">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </form>
        </div>
        <div className="card-body">
          {users.length === 0 ? (
            <div className="alert alert-info">Aucun utilisateur trouvé</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Pseudo</th>
                    <th>Email</th>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Rôle</th>
                    <th>Ville</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.pseudo}</td>
                      <td>{user.mail}</td>
                      <td>{user.lastName}</td>
                      <td>{user.firstName}</td>
                      <td>
                        <span className={`badge bg-${user.roleId === 3 ? 'danger' : user.roleId === 2 ? 'warning' : 'info'}`}>
                          {getRoleName(user.roleId)}
                        </span>
                      </td>
                      <td>{user.city}</td>
                      <td>
                        <div className="btn-group" role="group">
                          <Link to={`/admin/users/${user.id}`} className="btn btn-sm btn-outline-info" title="Voir">
                            <FontAwesomeIcon icon={faEye} />
                          </Link>
                          <Link to={`/admin/users/edit/${user.id}`} className="btn btn-sm btn-outline-primary" title="Modifier">
                            <FontAwesomeIcon icon={faEdit} />
                          </Link>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(user.id)}
                            title="Supprimer"
                          >
                            <FontAwesomeIcon icon={faTrashAlt} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Pagination */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
              <span>Page {page} sur {totalPages}</span>
            </div>
            <nav>
              <ul className="pagination">
                <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={handlePreviousPage}>Précédent</button>
                </li>
                <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={handleNextPage}>Suivant</button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UsersManager;