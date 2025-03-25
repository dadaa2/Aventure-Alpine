import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { format, addDays } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave, faCalendar, faUser, faPersonHiking } from '@fortawesome/free-solid-svg-icons';
import BookingController from '../../../controllers/BookingController';
import UserController from '../../../controllers/UserController';
import axios from 'axios';

function BookingCreate() {
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
    startPrestation: format(new Date(), 'yyyy-MM-dd'),
    endPrestation: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    numberPerson: 1,
    star: null,
    commentary: ''
  });

  // Rechercher les utilisateurs et prestations au chargement
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Récupérer les utilisateurs
        const usersData = await UserController.getUsers();
        setUsers(usersData.rows || []);
        
        // Récupérer les prestations
        const prestationsResponse = await axios.get('http://localhost:3002/prestations');
        setPrestations(prestationsResponse.data || []);
      } catch (err) {
        console.error('Error fetching form data:', err);
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: parseInt(value, 10) });
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
      await BookingController.createBooking(formData);
      setSuccess('Réservation créée avec succès');
      
      // Rediriger vers la liste des réservations après un court délai
      setTimeout(() => {
        navigate('/admin/bookings');
      }, 1500);
    } catch (err) {
      console.error('Error creating booking:', err);
      setError('Erreur lors de la création de la réservation');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Créer une nouvelle réservation</h2>
        <Link to="/admin/bookings" className="btn btn-secondary">
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Retour
        </Link>
      </div>
      
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h3 className="card-title h5 mb-0">Formulaire de réservation</h3>
        </div>
        <div className="card-body">
          {error && (
            <div className="alert alert-danger mb-4">{error}</div>
          )}
          
          {success && (
            <div className="alert alert-success mb-4">{success}</div>
          )}
          
          {loading ? (
            <div className="text-center my-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
              <p className="mt-2">Chargement des données...</p>
            </div>
          ) : (
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
              
              {/* Commentaire (optionnel) */}
              <div className="mb-4">
                <label htmlFor="commentary" className="form-label">Commentaire</label>
                <textarea 
                  className="form-control" 
                  id="commentary"
                  name="commentary"
                  value={formData.commentary}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Ajoutez un commentaire (optionnel)"
                />
              </div>
              
              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <button 
                  type="button" 
                  className="btn btn-secondary me-md-2"
                  onClick={() => navigate('/admin/bookings')}
                >
                  Annuler
                </button>
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
                      <FontAwesomeIcon icon={faSave} className="me-2" /> Créer la réservation
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingCreate;