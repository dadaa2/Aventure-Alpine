import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEdit, faTrashAlt, faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import BookingController from '../../../controllers/BookingController';

function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        const data = await BookingController.getBookingById(id);
        setBooking(data);
      } catch (err) {
        console.error('Error fetching booking details:', err);
        setError(`Erreur lors du chargement des détails de la réservation: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBookingDetails();
    }
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
      try {
        await BookingController.deleteBooking(id);
        navigate('/admin/bookings');
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

  // Affiche les étoiles de notation
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesomeIcon 
          key={i}
          icon={i <= rating ? faStar : farStar}
          className={i <= rating ? "text-warning" : "text-muted"}
        />
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
        <button 
          className="btn btn-primary mt-3"
          onClick={() => navigate('/admin/bookings')}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Retour aux réservations
        </button>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">Réservation non trouvée</div>
        <button 
          className="btn btn-primary mt-3"
          onClick={() => navigate('/admin/bookings')}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Retour aux réservations
        </button>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Détails de la réservation</h2>
        <div>
          <Link to="/admin/bookings" className="btn btn-secondary me-2">
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Retour
          </Link>
          <Link to={`/admin/bookings/${id}/edit`} className="btn btn-primary me-2">
            <FontAwesomeIcon icon={faEdit} className="me-2" /> Modifier
          </Link>
          <button className="btn btn-danger" onClick={handleDelete}>
            <FontAwesomeIcon icon={faTrashAlt} className="me-2" /> Supprimer
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4 shadow-sm">
            <div className="card-header bg-primary text-white">
              <h3 className="card-title h5 mb-0">Informations de réservation</h3>
            </div>
            <div className="card-body">
              <p><strong>ID:</strong> {booking.id}</p>
              <p><strong>Date de début:</strong> {formatDate(booking.startPrestation)}</p>
              <p><strong>Date de fin:</strong> {formatDate(booking.endPrestation)}</p>
              <p><strong>Nombre de participants:</strong> {booking.numberPerson}</p>
              
              {booking.star !== null && (
                <div className="mb-3">
                  <p className="mb-1"><strong>Évaluation:</strong></p>
                  <div>
                    {renderStars(booking.star)} <span className="ms-2">({booking.star}/5)</span>
                  </div>
                </div>
              )}
              
              {booking.commentary && (
                <div className="mt-3">
                  <p><strong>Commentaire:</strong></p>
                  <div className="border p-3 bg-light rounded">
                    {booking.commentary}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card mb-4 shadow-sm">
            <div className="card-header bg-info text-white">
              <h3 className="card-title h5 mb-0">Client</h3>
            </div>
            <div className="card-body">
              {booking.user ? (
                <>
                  <p><strong>Nom:</strong> {booking.user.lastName || 'Non renseigné'}</p>
                  <p><strong>Prénom:</strong> {booking.user.firstName || 'Non renseigné'}</p>
                  <p><strong>Email:</strong> {booking.user.mail || 'Non renseigné'}</p>
                  <p><strong>Pseudo:</strong> {booking.user.pseudo || 'Non renseigné'}</p>
                  <Link to={`/admin/users/${booking.userId}`} className="btn btn-outline-primary btn-sm mt-2">
                    Voir le profil client
                  </Link>
                </>
              ) : (
                <p className="text-muted">Informations client non disponibles</p>
              )}
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-header bg-success text-white">
              <h3 className="card-title h5 mb-0">Prestation réservée</h3>
            </div>
            <div className="card-body">
              {booking.prestation ? (
                <>
                  <p><strong>Titre:</strong> {booking.prestation.name}</p>
                  <p><strong>Description:</strong> {booking.prestation.description ? (
                    booking.prestation.description.length > 100 
                      ? booking.prestation.description.substring(0, 100) + '...'
                      : booking.prestation.description
                  ) : 'Non renseigné'}</p>
                  <p><strong>Prix:</strong> {booking.prestation.price ? `${booking.prestation.price} €` : 'Non renseigné'}</p>
                  <Link to={`/admin/prestations/${booking.prestationId}`} className="btn btn-outline-success btn-sm mt-2">
                    Voir la prestation
                  </Link>
                </>
              ) : (
                <p className="text-muted">Informations prestation non disponibles</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingDetail;