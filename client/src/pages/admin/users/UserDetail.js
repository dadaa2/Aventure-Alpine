import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faArrowLeft, faUser, faEnvelope, faMapMarkerAlt, faIdCard, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import UserController from '../../../controllers/UserController';
import axios from 'axios';

function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [role, setRole] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      // Utiliser le UserController pour récupérer l'utilisateur
      const userData = await UserController.getUserById(id);
      setUser(userData);
      
      // Charger le rôle
      if (userData.roleId) {
        try {
          const roleResponse = await axios.get(`http://localhost:3002/roles/${userData.roleId}`);
          setRole(roleResponse.data);
        } catch (err) {
          console.error('Erreur lors du chargement du rôle:', err);
        }
      }
      
      // Utiliser le UserController pour récupérer les réservations
      try {
        const bookingsData = await UserController.getUserBookings(id);
        setBookings(bookingsData);
      } catch (err) {
        console.error('Erreur lors du chargement des réservations:', err);
      }
      
      setLoading(false);
    } catch (err) {
      setError('Erreur lors du chargement des données de l\'utilisateur');
      setLoading(false);
    }
  };

  // Le reste du code reste identique
  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          {error || "Utilisateur non trouvé"}
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => navigate('/admin/users')}
        >
          Retour à la liste
        </button>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="mb-4">
        <Link to="/admin/users" className="btn btn-outline-secondary">
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
          Retour à la liste
        </Link>
      </div>
      
      <div className="row">
        <div className="col-md-6">
          <div className="card shadow mb-4">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h4 className="mb-0">
                <FontAwesomeIcon icon={faUser} className="me-2" />
                Détails de l'utilisateur
              </h4>
              <Link to={`/admin/users/edit/${user.id}`} className="btn btn-light btn-sm">
                <FontAwesomeIcon icon={faEdit} className="me-1" /> Modifier
              </Link>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-light rounded-circle p-3 me-3">
                    <FontAwesomeIcon icon={faUser} size="2x" className="text-primary" />
                  </div>
                  <div>
                    <h5 className="mb-0">{user.firstName} {user.lastName}</h5>
                    <p className="text-muted mb-0">@{user.pseudo}</p>
                  </div>
                </div>
                
                <div className="d-flex mb-2">
                  <div className="me-3 text-primary">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </div>
                  <div>
                    <strong>Email:</strong> {user.mail}
                  </div>
                </div>
                
                <div className="d-flex mb-2">
                  <div className="me-3 text-primary">
                    <FontAwesomeIcon icon={faShieldAlt} />
                  </div>
                  <div>
                    <strong>Rôle:</strong> {' '}
                    <span className={`badge bg-${user.roleId === 3 ? 'danger' : user.roleId === 2 ? 'warning' : 'info'}`}>
                      {role ? role.roleName : `Rôle #${user.roleId}`}
                    </span>
                  </div>
                </div>
                
                <div className="d-flex mb-2">
                  <div className="me-3 text-primary">
                    <FontAwesomeIcon icon={faIdCard} />
                  </div>
                  <div>
                    <strong>ID:</strong> {user.id}
                  </div>
                </div>
              </div>
              
              <hr />
              
              <div className="mb-3">
                <h5 className="mb-3">Adresse</h5>
                <div className="d-flex mb-2">
                  <div className="me-3 text-primary">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                  </div>
                  <div>
                    {user.street && <div>{user.street}</div>}
                    {user.zipCode && user.city && <div>{user.zipCode} {user.city}</div>}
                    {!user.street && !user.zipCode && !user.city && <em>Aucune adresse renseignée</em>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-header bg-info text-white">
              <h4 className="mb-0">Statistiques</h4>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-6 mb-3">
                  <div className="card bg-light">
                    <div className="card-body text-center">
                      <h3 className="display-4">{bookings.length}</h3>
                      <p className="mb-0">Réservations</p>
                    </div>
                  </div>
                </div>
                
                <div className="col-6 mb-3">
                  <div className="card bg-light">
                    <div className="card-body text-center">
                      <h3 className="display-4">0</h3>
                      <p className="mb-0">Articles</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <h5 className="mt-3 mb-3">Dernières activités</h5>
              {bookings.length > 0 ? (
                <div className="list-group">
                  {bookings.slice(0, 5).map(booking => (
                    <div key={booking.id} className="list-group-item list-group-item-action">
                      <div className="d-flex justify-content-between">
                        <h6 className="mb-1">Réservation #{booking.id.substring(0, 8)}</h6>
                        <small>{new Date(booking.createdAt).toLocaleDateString()}</small>
                      </div>
                      <p className="mb-1">
                        {booking.prestation ? booking.prestation.name : "Prestation inconnue"}
                      </p>
                      <small>
                        {new Date(booking.startPrestation).toLocaleDateString()} - 
                        {new Date(booking.endPrestation).toLocaleDateString()}
                      </small>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="alert alert-light">
                  Aucune activité récente
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDetail;