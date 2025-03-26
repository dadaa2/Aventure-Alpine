import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendar, faUsers, faShoppingCart, 
  faExclamationTriangle, faCheckCircle, faCalendarXmark
} from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';
import BookingController from '../../../controllers/BookingController';

const PrestationDetailFormBook = ({ prestation, currentUser }) => {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState({
    startPrestation: format(new Date(), 'yyyy-MM-dd'),
    endPrestation: format(new Date(new Date().setDate(new Date().getDate() + 1)), 'yyyy-MM-dd'),
    numberPerson: 1
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [bookingErrorType, setBookingErrorType] = useState(null);

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: name === 'numberPerson' ? parseInt(value) : value
    }));
  };

  const calculateDays = () => {
    const start = new Date(bookingData.startPrestation);
    const end = new Date(bookingData.endPrestation);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1; // Minimum 1 jour
  };

  const calculateTotalPrice = () => {
    const days = calculateDays();
    return prestation.price * bookingData.numberPerson * days;
  };
  
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      navigate('/login', { state: { from: `/prestations/${prestation.id}` } });
      return;
    }
    
    try {
      setBookingLoading(true);
      setBookingError('');
      setBookingSuccess('');
      setBookingErrorType(null);
      
      const newBooking = {
        userId: currentUser.id,
        prestationId: parseInt(prestation.id),
        startPrestation: bookingData.startPrestation,
        endPrestation: bookingData.endPrestation,
        numberPerson: parseInt(bookingData.numberPerson),
        totalPrice: calculateTotalPrice()
      };
      
      console.log('Envoi des données de réservation:', newBooking);
      
      const result = await BookingController.createBooking(newBooking);
      
      console.log('Réservation créée avec succès:', result);
      setBookingSuccess('Votre réservation a été effectuée avec succès!');
      
      setTimeout(() => {
        navigate('/user/bookings');
      }, 2000);
      
    } catch (err) {
      console.error('Erreur lors de la réservation:', err);
      
      // Déterminer le type d'erreur
      if (err.response?.data?.code === 'BOOKING_DATE_CONFLICT') {
        setBookingErrorType('DATE_CONFLICT');
        setBookingError(
          "Vous avez déjà une réservation pour cette prestation aux dates sélectionnées. " +
          "Veuillez choisir d'autres dates."
        );
      } else if (err.response?.status === 404) {
        setBookingErrorType('NOT_FOUND');
        setBookingError("L'utilisateur ou la prestation n'a pas été trouvé. Veuillez vous reconnecter.");
      } else {
        setBookingErrorType('GENERAL');
        setBookingError(err.response?.data?.error || 'Une erreur est survenue lors de la réservation. Veuillez réessayer.');
      }
    } finally {
      setBookingLoading(false);
    }
  };

  if (currentUser) {
    return (
      <div className="card shadow mb-4">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">Réserver cette activité</h4>
        </div>
        <div className="card-body">
          {bookingError && (
            <div className={`alert ${bookingErrorType === 'DATE_CONFLICT' ? 'alert-warning' : 'alert-danger'}`}>
              <FontAwesomeIcon 
                icon={bookingErrorType === 'DATE_CONFLICT' ? faCalendarXmark : faExclamationTriangle} 
                className="me-2" 
              />
              {bookingError}
              
              {bookingErrorType === 'DATE_CONFLICT' && (
                <div className="mt-2">
                  <small>
                    Conseil: Vérifiez vos réservations actuelles dans votre espace personnel ou 
                    <Link to="/user/bookings" className="ms-1 text-decoration-underline">cliquez ici</Link>.
                  </small>
                </div>
              )}
            </div>
          )}
          
          {bookingSuccess && (
            <div className="alert alert-success">
              <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
              {bookingSuccess}
            </div>
          )}
          
          <form onSubmit={handleBookingSubmit}>
            <div className="mb-3">
              <label htmlFor="startPrestation" className="form-label">Date de début</label>
              <div className="input-group">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faCalendar} />
                </span>
                <input
                  type="date"
                  className="form-control"
                  id="startPrestation"
                  name="startPrestation"
                  value={bookingData.startPrestation}
                  onChange={handleBookingChange}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  required
                />
              </div>
            </div>
            
            <div className="mb-3">
              <label htmlFor="endPrestation" className="form-label">Date de fin</label>
              <div className="input-group">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faCalendar} />
                </span>
                <input
                  type="date"
                  className="form-control"
                  id="endPrestation"
                  name="endPrestation"
                  value={bookingData.endPrestation}
                  onChange={handleBookingChange}
                  min={bookingData.startPrestation}
                  required
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="numberPerson" className="form-label">Nombre de participants</label>
              <div className="input-group">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faUsers} />
                </span>
                <input
                  type="number"
                  className="form-control"
                  id="numberPerson"
                  name="numberPerson"
                  value={bookingData.numberPerson}
                  onChange={handleBookingChange}
                  min="1"
                  max="10"
                  required
                />
              </div>
            </div>
            
            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={bookingLoading}
              >
                {bookingLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Réservation en cours...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
                    Réserver pour {calculateTotalPrice()}€
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  } else {
    return (
      <div className="card shadow mb-4">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">Réserver cette activité</h4>
        </div>
        <div className="card-body">
          <p>Pour réserver cette prestation, connectez-vous ou créez un compte.</p>
          <div className="d-grid gap-2">
            <Link to="/login" state={{ from: { pathname: `/prestations/${prestation.id}` } }} className="btn btn-primary">
              Se connecter
            </Link>
            <Link to="/register" className="btn btn-outline-primary">
              Créer un compte
            </Link>
          </div>
        </div>
      </div>
    );
  }
};

export default PrestationDetailFormBook;