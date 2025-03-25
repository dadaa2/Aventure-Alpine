import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrashAlt, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import BookingController from '../../../controllers/BookingController';

function BookingsManager() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSearchTerm, setCurrentSearchTerm] = useState(''); // Nouveau state pour le champ de recherche
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  
  useEffect(() => {
    fetchBookings();
  }, [page, searchTerm]); // Cette dépendance déclenchera l'effet

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await BookingController.getBookings(page, 10, searchTerm);
      setBookings(data.rows);
      setTotalPages(Math.ceil(data.count / 10));
    } catch (err) {
      setError('Erreur lors du chargement des réservations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setCurrentSearchTerm(e.target.value); // Met à jour le champ de recherche sans déclencher de requête
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Retour à la première page
    setSearchTerm(currentSearchTerm); // Mettre à jour searchTerm déclenchera useEffect et fetchBookings
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

  const handleViewBooking = (id) => {
    navigate(`/admin/bookings/${id}`);
  };

  const handleEditBooking = (id) => {
    navigate(`/admin/bookings/${id}/edit`);
  };

  const handleDeleteBooking = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
      try {
        await BookingController.deleteBooking(id);
        fetchBookings();
      } catch (err) {
        console.error('Error deleting booking:', err);
        alert('Erreur lors de la suppression de la réservation.');
      }
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'dd MMMM yyyy', { locale: fr });
    } catch (e) {
      return 'Date invalide';
    }
  };

  if (loading && bookings.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Gestion des réservations</h2>
        <Link to="/admin/bookings/create" className="btn btn-success">
          <FontAwesomeIcon icon={faPlus} /> Nouvelle réservation
        </Link>
      </div>

      <div className="card shadow mb-4">
        <div className="card-header bg-primary text-white py-3 d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Liste des réservations</h5>
          <form className="d-flex" onSubmit={handleSearch}>
            <input 
              type="text" 
              className="form-control me-2" 
              placeholder="Rechercher..." 
              value={currentSearchTerm} // Utilise currentSearchTerm ici
              onChange={handleSearchChange}
            />
            <button className="btn btn-light" type="submit">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </form>
        </div>
        
        <div className="card-body">
          {error && (
            <div className="alert alert-danger mb-3">
              {error}
            </div>
          )}
          
          {bookings.length === 0 ? (
            <div className="alert alert-info">Aucune réservation trouvée</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Client</th>
                    <th>Prestation</th>
                    <th>Date début</th>
                    <th>Date fin</th>
                    <th>Participants</th>
                    <th>Évaluation</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>{booking.id.substring(0, 8)}...</td>
                      <td>{booking.user?.firstName || 'N/A'} {booking.user?.lastName || ''}</td>
                      <td>{booking.prestation?.name || 'N/A'}</td>
                      <td>{formatDate(booking.startPrestation)}</td>
                      <td>{formatDate(booking.endPrestation)}</td>
                      <td>{booking.numberPerson}</td>
                      <td>
                        {booking.star !== null ? (
                          <span className={`badge bg-${
                            booking.star >= 4 ? 'success' : 
                            booking.star >= 3 ? 'warning' : 'danger'
                          }`}>
                            {booking.star}/5
                          </span>
                        ) : (
                          <span className="badge bg-secondary">Non évalué</span>
                        )}
                      </td>
                      <td>
                        <div className="btn-group" role="group">
                          <button 
                            className="btn btn-sm btn-outline-info"
                            onClick={() => handleViewBooking(booking.id)}
                            title="Voir les détails"
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEditBooking(booking.id)}
                            title="Modifier"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteBooking(booking.id)}
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

export default BookingsManager;