import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BookingController from '../../../controllers/BookingController';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faArrowLeft, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select'; // Ajoutez cette importation

function BookingEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Initialiser prestations comme un tableau vide
  const [prestations, setPrestations] = useState([]);
  const [users, setUsers] = useState([]);
  const [booking, setBooking] = useState({
    userId: '',
    prestationId: '',
    startPrestation: '',
    endPrestation: '',
    numberPerson: 1,
    status: 'pending'
  });
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Récupérer les données de la réservation si ID est présent
        if (id) {
          const bookingData = await BookingController.getBookingById(id);
          setBooking({
            userId: bookingData.userId || '',
            prestationId: bookingData.prestationId || '',
            startPrestation: bookingData.startPrestation ? bookingData.startPrestation.split('T')[0] : '',
            endPrestation: bookingData.endPrestation ? bookingData.endPrestation.split('T')[0] : '',
            numberPerson: bookingData.numberPerson || 1,
            status: bookingData.status || 'pending'
          });
        }
        
        // Récupérer la liste des prestations
        const prestationsResponse = await axios.get('http://localhost:3002/prestations');
        // Vérifier la structure de la réponse et s'assurer que nous avons un tableau
        const prestationsData = Array.isArray(prestationsResponse.data) 
          ? prestationsResponse.data 
          : (prestationsResponse.data.rows || []);
          
        setPrestations(prestationsData);
        
        // Récupérer la liste des utilisateurs
        const usersResponse = await axios.get('http://localhost:3002/users');
        // Vérifier la structure de la réponse et s'assurer que nous avons un tableau
        const usersData = Array.isArray(usersResponse.data) 
          ? usersResponse.data 
          : (usersResponse.data.rows || []);
          
        setUsers(usersData);
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(`Erreur lors du chargement des données: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  const handleChange = (e) => {
    setBooking({
      ...booking,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError('');
      
      if (id) {
        await BookingController.updateBooking(id, booking);
      } else {
        await BookingController.createBooking(booking);
      }
      
      navigate('/admin/bookings');
      
    } catch (err) {
      console.error('Error saving booking:', err);
      setError(`Erreur lors de l'enregistrement: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };
  
  // Options formatées pour react-select
  const userOptions = Array.isArray(users) 
    ? users.map(user => ({
        value: user.id,
        label: `${user.mail} ${user.firstName ? `(${user.firstName} ${user.lastName})` : ''}`
      }))
    : [];
  
  // Trouver l'option sélectionnée
  const selectedUserOption = userOptions.find(option => option.value === booking.userId) || null;
  
  const handleUserChange = (selectedOption) => {
    setBooking({
      ...booking,
      userId: selectedOption ? selectedOption.value : ''
    });
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
  
  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{id ? 'Modifier la réservation' : 'Nouvelle réservation'}</h2>
        <button 
          className="btn btn-secondary"
          onClick={() => navigate('/admin/bookings')}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Retour
        </button>
      </div>
      
      {error && (
        <div className="alert alert-danger mb-4">
          <FontAwesomeIcon icon={faExclamationCircle} className="me-2" />
          {error}
        </div>
      )}
      
      <div className="card shadow-sm">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="userId" className="form-label">Client</label>
              <Select
                id="userId"
                name="userId"
                value={selectedUserOption}
                onChange={handleUserChange}
                options={userOptions}
                placeholder="Rechercher un client..."
                noOptionsMessage={() => "Aucun client trouvé"}
                isClearable
                isSearchable
                className="basic-single"
                classNamePrefix="select"
              />
              {!booking.userId && <div className="text-danger mt-1">Veuillez sélectionner un client</div>}
            </div>
            
            <div className="mb-3">
              <label htmlFor="prestationId" className="form-label">Prestation</label>
              <select 
                id="prestationId"
                name="prestationId"
                className="form-select"
                value={booking.prestationId}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionner une prestation</option>
                {/* Vérifier que prestations est un tableau avant d'utiliser .map() */}
                {Array.isArray(prestations) && prestations.map(prestation => (
                  <option key={prestation.id} value={prestation.id}>
                    {prestation.name} ({prestation.price} €)
                  </option>
                ))}
              </select>
            </div>
            
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="startPrestation" className="form-label">Date de début</label>
                <input 
                  type="date"
                  id="startPrestation"
                  name="startPrestation"
                  className="form-control"
                  value={booking.startPrestation}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="col-md-6 mb-3">
                <label htmlFor="endPrestation" className="form-label">Date de fin</label>
                <input 
                  type="date"
                  id="endPrestation"
                  name="endPrestation"
                  className="form-control"
                  value={booking.endPrestation}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="mb-3">
              <label htmlFor="numberPerson" className="form-label">Nombre de participants</label>
              <input 
                type="number"
                id="numberPerson"
                name="numberPerson"
                className="form-control"
                value={booking.numberPerson}
                onChange={handleChange}
                min="1"
                required
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="status" className="form-label">Statut</label>
              <select 
                id="status"
                name="status"
                className="form-select"
                value={booking.status}
                onChange={handleChange}
              >
                <option value="pending">En attente</option>
                <option value="confirmed">Confirmé</option>
                <option value="cancelled">Annulé</option>
                <option value="completed">Terminé</option>
              </select>
            </div>
            
            <div className="mt-4">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={submitting}
              >
                <FontAwesomeIcon icon={faSave} className="me-2" />
                {submitting ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BookingEdit;