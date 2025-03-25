import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import PrestationController from '../../../controllers/PrestationController';
import SkiForm from './sportForms/SkiForm';
import RandonneeForm from './sportForms/RandonneeForm';
import EscaladeForm from './sportForms/EscaladeForm';

// Fonction utilitaire pour normaliser les noms de sport (déplacer les accents, mettre en minuscules)
const normalizeSportName = (sportName) => {
  if (!sportName) return '';
  return sportName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
};

function PrestationEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  // États
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    sportId: '',
    sportDetails: {}
  });
  const [selectedSport, setSelectedSport] = useState(null);
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Effet pour charger les données initiales
  useEffect(() => {
    fetchData();
  }, [id]);

  // Fonctions de gestion des données
  const fetchData = async () => {
    try {
      setLoading(true);
      console.log("Début du chargement des données");
      
      // Charger les sports
      const sportsData = await PrestationController.getAllSports();
      setSports(sportsData);

      // Charger les données de la prestation en mode édition
      if (id) {
        const prestationData = await PrestationController.getPrestationById(id);
        
        // Trouver le sport correspondant
        const sport = sportsData.find(s => s.id === prestationData.sportId);
        const sportType = sport ? sport.name.toLowerCase() : null;
        setSelectedSport(sportType);
        
        // Formater les données de la prestation pour le formulaire
        setFormData({
          name: prestationData.name || '',
          description: prestationData.description || '',
          price: prestationData.price || '',
          sportId: prestationData.sportId || '',
          sportDetails: prestationData.sportDetails || {}
        });
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
      setError('Erreur lors du chargement des données. Veuillez réessayer.');
      setLoading(false);
    }
  };

  // Gestionnaires d'événements
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    // Gestion spéciale pour le changement de sport
    if (name === 'sportId') {
      const sport = sports.find(s => s.id === parseInt(value));
      setSelectedSport(sport ? sport.name.toLowerCase() : null);
      setFormData(prev => ({ 
        ...prev, 
        sportId: value,
        sportDetails: {} 
      }));
      return;
    }
    
    // Traiter les valeurs numériques
    if (type === 'number') {
      const numValue = value === '' ? '' : Number(value);
      setFormData(prev => ({ ...prev, [name]: numValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Effacer les erreurs de validation
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSportDetailsChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      sportDetails: {
        ...prev.sportDetails,
        [name]: value
      }
    }));
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Validation
  const validate = () => {
    const errors = {};
    
    // Validation des champs communs
    if (!formData.name?.trim()) 
      errors.name = 'Le nom est requis';
    
    if (!formData.description?.trim()) 
      errors.description = 'La description est requise';
    
    if (!formData.price || formData.price <= 0) 
      errors.price = 'Le prix doit être supérieur à 0';
    
    if (!formData.sportId) 
      errors.sportId = 'Le sport est requis';
    
    // Validation des champs spécifiques au sport
    if (selectedSport) {
      const normalizedSport = normalizeSportName(selectedSport);
      
      if (normalizedSport === 'ski') {
        if (!formData.sportDetails.snowCondition) 
          errors.snowCondition = "Les conditions de neige sont requises";
        if (!formData.sportDetails.pistColor) 
          errors.pistColor = "La couleur de piste est requise";
      } else if (normalizedSport === 'randonnee') {
        if (!formData.sportDetails.distance) 
          errors.distance = "La distance est requise";
        if (!formData.sportDetails.startPoint) 
          errors.startPoint = "Le point de départ est requis";
        if (!formData.sportDetails.endPoint) 
          errors.endPoint = "Le point d'arrivée est requis";
      } else if (normalizedSport === 'escalade') {
        if (!formData.sportDetails.difficulty) 
          errors.difficulty = "La difficulté est requise";
        if (!formData.sportDetails.location) 
          errors.location = "Le lieu est requis";
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    try {
      setSaving(true);
      
      // Préparer les données à envoyer
      const dataToSend = { ...formData };
      
      if (id) {
        await PrestationController.updatePrestation(id, dataToSend);
      } else {
        await PrestationController.createPrestation(dataToSend);
      }
      
      navigate('/admin/prestations');
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement:', err);
      setError('Erreur lors de l\'enregistrement. Veuillez réessayer.');
      setSaving(false);
    }
  };

  // Rendu des champs spécifiques au sport sélectionné
  const renderSportSpecificFields = () => {
    if (!selectedSport) return null;
    
    const normalizedSport = normalizeSportName(selectedSport);
    
    const commonProps = {
      formData: formData.sportDetails,
      onChange: handleSportDetailsChange,
      errors: validationErrors
    };
    
    switch (normalizedSport) {
      case 'ski':
        return <SkiForm {...commonProps} />;
      case 'randonnee':
        return <RandonneeForm {...commonProps} />;
      case 'escalade':
        return <EscaladeForm {...commonProps} />;
      default:
        return null;
    }
  };

  // Affichage du chargement
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
      {/* En-tête */}
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <Link to="/admin/prestations" className="btn btn-outline-secondary">
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
          Retour à la liste
        </Link>
        <h2 className="mb-0">{id ? 'Modifier la prestation' : 'Nouvelle prestation'}</h2>
        <div style={{ width: '100px' }}></div>
      </div>
      
      {/* Message d'erreur */}
      {error && (
        <div className="alert alert-danger">
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
          {error}
        </div>
      )}
      
      {/* Formulaire */}
      <div className="card shadow">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Champs communs */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="name" className="form-label">Nom de la prestation *</label>
                <input
                  type="text"
                  className={`form-control ${validationErrors.name ? 'is-invalid' : ''}`}
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
                {validationErrors.name && (
                  <div className="invalid-feedback">{validationErrors.name}</div>
                )}
              </div>
              
              <div className="col-md-6">
                <label htmlFor="sportId" className="form-label">Sport *</label>
                <select
                  className={`form-select ${validationErrors.sportId ? 'is-invalid' : ''}`}
                  id="sportId"
                  name="sportId"
                  value={formData.sportId}
                  onChange={handleChange}
                >
                  <option value="">Sélectionner un sport</option>
                  {sports.map(sport => (
                    <option key={sport.id} value={sport.id}>
                      {sport.name}
                    </option>
                  ))}
                </select>
                {validationErrors.sportId && (
                  <div className="invalid-feedback">{validationErrors.sportId}</div>
                )}
              </div>
            </div>
            
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description *</label>
              <textarea
                className={`form-control ${validationErrors.description ? 'is-invalid' : ''}`}
                id="description"
                name="description"
                rows="5"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
              {validationErrors.description && (
                <div className="invalid-feedback">{validationErrors.description}</div>
              )}
            </div>
            
            <div className="mb-3">
              <label htmlFor="price" className="form-label">Prix (€) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className={`form-control ${validationErrors.price ? 'is-invalid' : ''}`}
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
              />
              {validationErrors.price && (
                <div className="invalid-feedback">{validationErrors.price}</div>
              )}
            </div>
            
            {/* Champs spécifiques au sport */}
            {renderSportSpecificFields()}
            
            {/* Boutons d'action */}
            <div className="d-flex justify-content-between mt-4">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/admin/prestations')}
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
                    <FontAwesomeIcon icon={faSave} className="me-2" />
                    {id ? 'Mettre à jour' : 'Créer la prestation'}
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

export default PrestationEdit;