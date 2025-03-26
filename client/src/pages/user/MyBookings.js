import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import BookingController from '../../controllers/BookingController';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarCheck, faEye, faTimes, faStar, 
  faCalendarAlt, faSort, faExclamationCircle,
  faCheckCircle, faHistory
} from '@fortawesome/free-solid-svg-icons';
import { format, isAfter, parseISO } from 'date-fns';
import fr from 'date-fns/locale/fr';

function MyBookings() {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, upcoming, past
  const [sortBy, setSortBy] = useState('dateDesc'); // dateDesc, dateAsc, priceDesc, priceAsc
  const [confirmCancelId, setConfirmCancelId] = useState(null);
  const [cancelSuccess, setCancelSuccess] = useState('');
  const [cancelError, setCancelError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await BookingController.getUserBookings(currentUser.id);
        setBookings(response);
        
        // Appliquer les filtres initiaux
        applyFilters(response, filter, sortBy);
        
      } catch (err) {
        console.error('Erreur lors du chargement des réservations:', err);
        setError('Une erreur est survenue lors du chargement de vos réservations. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };
    
    if (currentUser) {
      fetchBookings();
    }
  }, [currentUser]);

  // Appliquer les filtres et le tri
  const applyFilters = (bookingsToFilter = bookings, activeFilter = filter, activeSortBy = sortBy) => {
    let result = [...bookingsToFilter];
    
    // Filtrer
    if (activeFilter === 'upcoming') {
      result = result.filter(booking => isAfter(parseISO(booking.startPrestation), new Date()));
    } else if (activeFilter === 'past') {
      result = result.filter(booking => !isAfter(parseISO(booking.startPrestation), new Date()));
    }
    
    // Trier
    result.sort((a, b) => {
      // Fonction helper pour calculer le prix total
      const calculateTotal = (booking) => {
        if (booking.prestation?.price && booking.numberPerson) {
          return parseFloat(booking.prestation.price) * parseInt(booking.numberPerson);
        }
        return 0; // Valeur par défaut si le calcul est impossible
      };

      switch (activeSortBy) {
        case 'dateAsc':
          return parseISO(a.startPrestation) - parseISO(b.startPrestation);
        case 'priceDesc':
          return calculateTotal(b) - calculateTotal(a);
        case 'priceAsc':
          return calculateTotal(a) - calculateTotal(b);
        case 'dateDesc':
        default:
          return parseISO(b.startPrestation) - parseISO(a.startPrestation);
      }
    });
    
    setFilteredBookings(result);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    applyFilters(bookings, newFilter, sortBy);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    applyFilters(bookings, filter, newSortBy);
  };
  
  const handleCancelClick = (id) => {
    setConfirmCancelId(id);
  };
  
  const handleConfirmCancel = async () => {
    try {
      setCancelSuccess('');
      setCancelError('');
      
      await BookingController.cancelBooking(confirmCancelId);
      
      // Mettre à jour l'état local
      const updatedBookings = bookings.map(booking => 
        booking.id === confirmCancelId 
          ? { ...booking, status: 'cancelled' } 
          : booking
      );
      
      setBookings(updatedBookings);
      applyFilters(updatedBookings, filter, sortBy);
      
      setCancelSuccess('Votre réservation a été annulée avec succès.');
      setConfirmCancelId(null);
    } catch (err) {
      console.error('Erreur lors de l\'annulation:', err);
      setCancelError('Une erreur est survenue lors de l\'annulation de votre réservation.');
    }
  };

  const getStatusBadge = (status, startDate) => {
    const isPast = !isAfter(parseISO(startDate), new Date());
    
    if (status === 'cancelled') {
      return <span className="badge bg-danger">Annulée</span>;
    } else if (status === 'completed' || isPast) {
      return <span className="badge bg-success">Terminée</span>;
    } else if (status === 'confirmed') {
      return <span className="badge bg-primary">Confirmée</span>;
    } else {
      return <span className="badge bg-warning text-dark">En attente</span>;
    }
  };
  
  return (
    <div className="my-bookings-page py-5">
      <div className="container">
        <div className="row mb-4">
          <div className="col">
            <h1 className="mb-3">Mes Réservations</h1>
            <p className="text-muted">
              Consultez et gérez toutes vos réservations d'activités de montagne.
            </p>
          </div>
        </div>
        
        {/* Filtres et tri */}
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="btn-group" role="group" aria-label="Filtres">
              <button 
                type="button" 
                className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => handleFilterChange('all')}
              >
                <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                Toutes
              </button>
              <button 
                type="button" 
                className={`btn ${filter === 'upcoming' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => handleFilterChange('upcoming')}
              >
                <FontAwesomeIcon icon={faCalendarCheck} className="me-2" />
                À venir
              </button>
              <button 
                type="button" 
                className={`btn ${filter === 'past' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => handleFilterChange('past')}
              >
                <FontAwesomeIcon icon={faHistory} className="me-2" />
                Passées
              </button>
            </div>
          </div>
          <div className="col-md-6 text-end">
            <div className="dropdown">
              <button className="btn btn-outline-secondary dropdown-toggle" type="button" id="sortDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                <FontAwesomeIcon icon={faSort} className="me-2" />
                Trier par
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="sortDropdown">
                <li>
                  <button 
                    className="dropdown-item" 
                    onClick={() => handleSortChange('dateDesc')}
                  >
                    Date (récent → ancien)
                  </button>
                </li>
                <li>
                  <button 
                    className="dropdown-item" 
                    onClick={() => handleSortChange('dateAsc')}
                  >
                    Date (ancien → récent)
                  </button>
                </li>
                <li>
                  <button 
                    className="dropdown-item" 
                    onClick={() => handleSortChange('priceDesc')}
                  >
                    Prix (décroissant)
                  </button>
                </li>
                <li>
                  <button 
                    className="dropdown-item" 
                    onClick={() => handleSortChange('priceAsc')}
                  >
                    Prix (croissant)
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Messages */}
        {error && (
          <div className="alert alert-danger" role="alert">
            <FontAwesomeIcon icon={faExclamationCircle} className="me-2" />
            {error}
          </div>
        )}
        
        {cancelSuccess && (
          <div className="alert alert-success" role="alert">
            <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
            {cancelSuccess}
          </div>
        )}
        
        {cancelError && (
          <div className="alert alert-danger" role="alert">
            <FontAwesomeIcon icon={faExclamationCircle} className="me-2" />
            {cancelError}
          </div>
        )}
        
        {/* Affichage des réservations */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="card">
            <div className="card-body text-center py-5">
              <div className="display-6 text-muted mb-3">
                <FontAwesomeIcon icon={faCalendarAlt} size="lg" />
              </div>
              <h3 className="mb-3">Aucune réservation trouvée</h3>
              <p className="mb-4">
                {filter === 'all' 
                  ? "Vous n'avez pas encore effectué de réservation." 
                  : filter === 'upcoming'
                    ? "Vous n'avez pas de réservations à venir."
                    : "Vous n'avez pas de réservations passées."
                }
              </p>
              <Link to="/prestations" className="btn btn-primary">
                Découvrir nos prestations
              </Link>
            </div>
          </div>
        ) : (
          <div className="row">
            {filteredBookings.map(booking => {
              const isUpcoming = isAfter(parseISO(booking.startPrestation), new Date());
              const canCancel = isUpcoming && booking.status !== 'cancelled';
              const canReview = !isUpcoming && booking.status !== 'cancelled';
              
              return (
                <div className="col-md-6 col-lg-4 mb-4" key={booking.id}>
                  <div className="card h-100 shadow-sm">
                    <div className="card-header">
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0 text-truncate" title={booking.prestation?.name}>
                          {booking.prestation?.name || "Activité"}
                        </h5>
                        {getStatusBadge(booking.status, booking.startPrestation)}
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <div className="small text-muted mb-1">Dates</div>
                        <div>
                          <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                          Du {format(parseISO(booking.startPrestation), 'dd MMM yyyy', {locale: fr})} 
                          {' '} au {format(parseISO(booking.endPrestation), 'dd MMM yyyy', {locale: fr})}
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="small text-muted mb-1">Participants</div>
                        <div>{booking.numberPerson} personne(s)</div>
                      </div>
                      <div>
                        <div className="small text-muted mb-1">Prix total</div>
                        <div className="fw-bold">
                          {booking.prestation && booking.prestation.price && booking.numberPerson
                            ? `${(parseFloat(booking.prestation.price) * parseInt(booking.numberPerson)).toFixed(2)} €`
                            : "Prix non disponible"}
                        </div>
                      </div>
                    </div>
                    <div className="card-footer bg-white border-top-0">
                      <div className="d-flex justify-content-between">
                        <Link to={`/prestations/${booking.prestationId}`} className="btn btn-sm btn-outline-primary">
                          <FontAwesomeIcon icon={faEye} className="me-2" />
                          Détails
                        </Link>
                        <div>
                          {canCancel && (
                            <button 
                              className="btn btn-sm btn-outline-danger" 
                              onClick={() => handleCancelClick(booking.id)}
                            >
                              <FontAwesomeIcon icon={faTimes} className="me-2" />
                              Annuler
                            </button>
                          )}
                          {canReview && !booking.hasReview && (
                            <Link to={`/user/reviews/add/${booking.prestationId}`} className="btn btn-sm btn-outline-warning ms-2">
                              <FontAwesomeIcon icon={faStar} className="me-2" />
                              Évaluer
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Modal de confirmation d'annulation */}
      {confirmCancelId && (
        <div className="modal fade show" style={{display: 'block', backgroundColor: 'rgba(0,0,0,0.5)'}} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmer l'annulation</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setConfirmCancelId(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Êtes-vous sûr de vouloir annuler cette réservation ?</p>
                <p className="text-danger">
                  <FontAwesomeIcon icon={faExclamationCircle} className="me-2" />
                  Cette action est irréversible.
                </p>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setConfirmCancelId(null)}
                >
                  Retour
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={handleConfirmCancel}
                >
                  Confirmer l'annulation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyBookings;