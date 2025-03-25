import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave, faCalendar, faUser, faPersonHiking, faStar } from '@fortawesome/free-solid-svg-icons';
import BookingController from '../../../controllers/BookingController';
import UserController from '../../../controllers/UserController';
import axios from 'axios';

function BookingEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
  const [prestations, setPrestations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    userId: '',
    prestationId: '',
    startPrestation: '',
    endPrestation: '',
    numberPerson: 1,
    star: null,
    commentary: ''
  });

  // Charger les données de la réservation et les listes déroulantes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Charger la réservation
        const bookingData = await BookingController.getBookingById(id);
        
        // Formater les dates pour l'affichage dans les champs de formulaire
        const formattedData = {
          ...bookingData,
          startPrestation: bookingData.startPrestation ? format(new Date(bookingData.startPrestation), 'yyyy-MM-dd') : '',
          endPrestation: bookingData.endPrestation ? format(new Date(bookingData.endPrestation), 'yyyy-MM-dd') : '',
        };
        
        setFormData(formattedData);
        
        // Récupérer les utilisateurs
        const usersData = await UserController.getUsers();
        setUsers(usersData.rows || []);
        
        // Récupérer les prestations
        const prestationsResponse = await axios.get('http://localhost:3002/prestations');
        setPrestations(prestationsResponse.data || []);
      } catch (err) {
        console.error('Error fetching booking data:', err);
        setError(`Erreur lors du chargement des données: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: parseInt(value, 10) || null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      // Validation des champs obligatoires
      if (!formData.userId || !formData.prestationId || !formData.startPrestation || !formData.endPrestation) {
        setError('Veuillez remplir tous les champs obligatoires');
        setSaving(false);
        return;
      }
      
      // Vérification que la date de fin est après la date de début
      if (formData.startPrestation >= formData.endPrestation) {
        setError('La date de fin doit être après la date de début');
        setSaving(false);
        return;
      }
      
      // Envoyer les données au serveur
      await BookingController.updateBooking(id, formData);
      setSuccess('Réservation mise à jour avec succès');
      
      // Rediriger vers la page de détail après un court délai
      setTimeout(() => {
        navigate(`/admin/bookings/${id}`);
      }, 1500);
    } catch (err) {
      console.error('Error updating booking:', err);
      setError(`Erreur lors de la mise à jour: ${err.message}`);
    } finally {
      setSaving(false);
    }
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
        <h2 className="mb-0">Modifier la réservation</h2>
        <div>
          <Link to={`/admin/bookings/${id}`} className="btn btn-secondary me-2">
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Annuler
          </Link>
        </div>
      </div>
      
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h3 className="card-title h5 mb-0">Formulaire de modification</h3>
        </div>
        <div className="card-body">
          {error && (
            <div className="alert alert-danger mb-4">{error}</div>
          )}
          
          {success && (
            <div className="alert alert-success mb-4">{success}</div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="row mb-4">
              <div className="col-md-6">
                {/* Sélection du client */}
                <div className="mb-3">
                  <label htmlFor="userId" className="form-label">Client <span className="text-danger">*</span></label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FontAwesomeIcon icon={faUser} />
                    </span>
                    <select 
                      id="userId"
                      name="userId"
                      className="form-select"
                      value={formData.userId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Sélectionnez un client...</option>
                      {users.map(user => (
                        <option key={user.id} value={user.id}>
                          {user.firstName} {user.lastName} ({user.mail})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Sélection de la prestation */}
                <div className="mb-3">
                  <label htmlFor="prestationId" className="form-label">Prestation <span className="text-danger">*</span></label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FontAwesomeIcon icon={faPersonHiking} />
                    </span>
                    <select 
                      id="prestationId"
                      name="prestationId"
                      className="form-select"
                      value={formData.prestationId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Sélectionnez une prestation...</option>
                      {prestations.map(prestation => (
                        <option key={prestation.id} value={prestation.id}>
                          {prestation.name} ({prestation.price ? `${prestation.price} €` : 'Prix non défini'})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6">
                {/* Date de début */}
                <div className="mb-3">
                  <label htmlFor="startPrestation" className="form-label">Date de début <span className="text-danger">*</span></label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FontAwesomeIcon icon={faCalendar} />
                    </span>
                    <input 
                      type="date" 
                      className="form-control" 
                      id="startPrestation"
                      name="startPrestation"
                      value={formData.startPrestation}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                {/* Date de fin */}
                <div className="mb-3">
                  <label htmlFor="endPrestation" className="form-label">Date de fin <span className="text-danger">*</span></label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FontAwesomeIcon icon={faCalendar} />
                    </span>
                    <input 
                      type="date" 
                      className="form-control" 
                      id="endPrestation"
                      name="endPrestation"
                      value={formData.endPrestation}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Nombre de participants */}
            <div className="mb-3">
              <label htmlFor="numberPerson" className="form-label">Nombre de participants <span className="text-danger">*</span></label>
              <input 
                type="number" 
                className="form-control" 
                id="numberPerson"
                name="numberPerson"
                value={formData.numberPerson}
                onChange={handleNumberChange}
                min="1"
                required
              />
            </div>

            {/* Évaluation */}
            <div className="mb-3">
              <label htmlFor="star" className="form-label">Évaluation (étoiles)</label>
              <div className="input-group">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faStar} />
                </span>
                <select 
                  id="star"
                  name="star"
                  className="form-select"
                  value={formData.star !== null ? formData.star : ''}
                  onChange={handleNumberChange}
                >
                  <option value="">Non évalué</option>
                  <option value="1">1 - Très insatisfait</option>
                  <option value="2">2 - Insatisfait</option>
                  <option value="3">3 - Moyen</option>
                  <option value="4">4 - Satisfait</option>
                  <option value="5">5 - Très satisfait</option>
                </select>
              </div>
            </div>
            
            {/* Commentaire (optionnel) */}
            <div className="mb-4">
              <label htmlFor="commentary" className="form-label">Commentaire</label>
              <textarea 
                className="form-control" 
                id="commentary"
                name="commentary"
                value={formData.commentary || ''}
                onChange={handleChange}
                rows="3"
                placeholder="Avis ou commentaire sur la prestation"
              />
            </div>
            
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <Link 
                to={`/admin/bookings/${id}`}
                className="btn btn-secondary me-md-2"
              >
                Annuler
              </Link>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSave} className="me-2" /> Mettre à jour
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BookingEdit;