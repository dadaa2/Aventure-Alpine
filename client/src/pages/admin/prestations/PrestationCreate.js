import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PrestationController from '../../../controllers/PrestationController';

function PrestationCreate() {
  const navigate = useNavigate();
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    sportId: '',
    sportDetails: {}
  });
  const [selectedSport, setSelectedSport] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    fetchSports();
  }, []);

  const fetchSports = async () => {
    try {
      const data = await PrestationController.getAllSports();
      setSports(data);
      if (data.length > 0) {
        setFormData(prev => ({
          ...prev,
          sportId: data[0].id
        }));
        setSelectedSport(data[0].name.toLowerCase());
      }
    } catch (err) {
      console.error('Erreur lors du chargement des sports:', err);
      setError('Erreur lors du chargement des sports');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Gestion spéciale pour le sportId car nous devons également mettre à jour le sport sélectionné
    if (name === 'sportId') {
      const sport = sports.find(s => s.id === parseInt(value));
      setSelectedSport(sport ? sport.name.toLowerCase() : null);
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Effacer les erreurs de validation lorsque l'utilisateur modifie un champ
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: null
      });
    }
  };

  const handleSportDetailsChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      sportDetails: {
        ...formData.sportDetails,
        [name]: value
      }
    });
  };

  const validate = () => {
    const errors = {};
    
    if (!formData.name) errors.name = "Le nom est requis";
    if (!formData.price) errors.price = "Le prix est requis";
    else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) 
      errors.price = "Le prix doit être un nombre positif";
    
    if (!formData.description) errors.description = "La description est requise";
    if (!formData.sportId) errors.sportId = "Le sport est requis";
    
    // Validation spécifique selon le sport sélectionné
    if (selectedSport === 'ski') {
      if (!formData.sportDetails.snowCondition) 
        errors.snowCondition = "Les conditions de neige sont requises";
      if (!formData.sportDetails.pistColor) 
        errors.pistColor = "La couleur de piste est requise";
    } else if (selectedSport === 'randonnée') {
      if (!formData.sportDetails.distance) 
        errors.distance = "La distance est requise";
      if (!formData.sportDetails.startPoint) 
        errors.startPoint = "Le point de départ est requis";
      if (!formData.sportDetails.endPoint) 
        errors.endPoint = "Le point d'arrivée est requis";
    } else if (selectedSport === 'escalade') {
      if (!formData.sportDetails.difficulty) 
        errors.difficulty = "La difficulté est requise";
      if (!formData.sportDetails.location) 
        errors.location = "Le lieu est requis";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Conversion du prix en nombre
      const dataToSend = {
        ...formData,
        price: parseFloat(formData.price)
      };
      
      await PrestationController.createPrestation(dataToSend);
      navigate('/admin/prestations');
    } catch (err) {
      setError(err.response?.data?.error || 'Une erreur est survenue lors de la création de la prestation');
      setLoading(false);
    }
  };

  // Rendu des champs spécifiques selon le sport sélectionné
  const renderSportSpecificFields = () => {
    if (!selectedSport) return null;
    
    if (selectedSport === 'ski') {
      return (
        <div className="mt-4">
          <h5>Détails du ski</h5>
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="snowCondition" className="form-label">Conditions de neige *</label>
              <input
                type="text"
                className={`form-control ${validationErrors.snowCondition ? 'is-invalid' : ''}`}
                id="snowCondition"
                name="snowCondition"
                value={formData.sportDetails.snowCondition || ''}
                onChange={handleSportDetailsChange}
              />
              {validationErrors.snowCondition && <div className="invalid-feedback">{validationErrors.snowCondition}</div>}
            </div>
            <div className="col-md-6">
              <label htmlFor="skiLift" className="form-label">Remontées mécaniques</label>
              <input
                type="text"
                className="form-control"
                id="skiLift"
                name="skiLift"
                value={formData.sportDetails.skiLift || ''}
                onChange={handleSportDetailsChange}
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="pistColor" className="form-label">Couleur de piste *</label>
              <select
                className={`form-select ${validationErrors.pistColor ? 'is-invalid' : ''}`}
                id="pistColor"
                name="pistColor"
                value={formData.sportDetails.pistColor || ''}
                onChange={handleSportDetailsChange}
              >
                <option value="">Sélectionner une couleur</option>
                <option value="verte">Verte</option>
                <option value="bleue">Bleue</option>
                <option value="rouge">Rouge</option>
                <option value="noire">Noire</option>
              </select>
              {validationErrors.pistColor && <div className="invalid-feedback">{validationErrors.pistColor}</div>}
            </div>
          </div>
        </div>
      );
    } else if (selectedSport === 'randonnée') {
      return (
        <div className="mt-4">
          <h5>Détails de la randonnée</h5>
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="regionName" className="form-label">Région</label>
              <input
                type="text"
                className="form-control"
                id="regionName"
                name="regionName"
                value={formData.sportDetails.regionName || ''}
                onChange={handleSportDetailsChange}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="distance" className="form-label">Distance *</label>
              <input
                type="text"
                className={`form-control ${validationErrors.distance ? 'is-invalid' : ''}`}
                id="distance"
                name="distance"
                placeholder="Ex: 5 km"
                value={formData.sportDetails.distance || ''}
                onChange={handleSportDetailsChange}
              />
              {validationErrors.distance && <div className="invalid-feedback">{validationErrors.distance}</div>}
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="startPoint" className="form-label">Point de départ *</label>
              <input
                type="text"
                className={`form-control ${validationErrors.startPoint ? 'is-invalid' : ''}`}
                id="startPoint"
                name="startPoint"
                value={formData.sportDetails.startPoint || ''}
                onChange={handleSportDetailsChange}
              />
              {validationErrors.startPoint && <div className="invalid-feedback">{validationErrors.startPoint}</div>}
            </div>
            <div className="col-md-6">
              <label htmlFor="endPoint" className="form-label">Point d'arrivée *</label>
              <input
                type="text"
                className={`form-control ${validationErrors.endPoint ? 'is-invalid' : ''}`}
                id="endPoint"
                name="endPoint"
                value={formData.sportDetails.endPoint || ''}
                onChange={handleSportDetailsChange}
              />
              {validationErrors.endPoint && <div className="invalid-feedback">{validationErrors.endPoint}</div>}
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="praticable" className="form-label">Saison praticable</label>
              <select
                className="form-select"
                id="praticable"
                name="praticable"
                value={formData.sportDetails.praticable || ''}
                onChange={handleSportDetailsChange}
              >
                <option value="">Sélectionner une saison</option>
                <option value="Printemps">Printemps</option>
                <option value="Été">Été</option>
                <option value="Automne">Automne</option>
                <option value="Hiver">Hiver</option>
                <option value="Toute l'année">Toute l'année</option>
              </select>
            </div>
          </div>
        </div>
      );
    } else if (selectedSport === 'escalade') {
      return (
        <div className="mt-4">
          <h5>Détails de l'escalade</h5>
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="difficulty" className="form-label">Difficulté *</label>
              <select
                className={`form-select ${validationErrors.difficulty ? 'is-invalid' : ''}`}
                id="difficulty"
                name="difficulty"
                value={formData.sportDetails.difficulty || ''}
                onChange={handleSportDetailsChange}
              >
                <option value="">Sélectionner une difficulté</option>
                <option value="Débutant">Débutant</option>
                <option value="Intermédiaire">Intermédiaire</option>
                <option value="Avancé">Avancé</option>
                <option value="Expert">Expert</option>
              </select>
              {validationErrors.difficulty && <div className="invalid-feedback">{validationErrors.difficulty}</div>}
            </div>
            <div className="col-md-6">
              <label htmlFor="ascentionTime" className="form-label">Temps d'ascension</label>
              <input
                type="text"
                className="form-control"
                id="ascentionTime"
                name="ascentionTime"
                placeholder="Ex: 2 heures"
                value={formData.sportDetails.ascentionTime || ''}
                onChange={handleSportDetailsChange}
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="location" className="form-label">Lieu *</label>
              <input
                type="text"
                className={`form-control ${validationErrors.location ? 'is-invalid' : ''}`}
                id="location"
                name="location"
                value={formData.sportDetails.location || ''}
                onChange={handleSportDetailsChange}
              />
              {validationErrors.location && <div className="invalid-feedback">{validationErrors.location}</div>}
            </div>
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="container my-5">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">Créer une nouvelle prestation</h3>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          
          <form onSubmit={handleSubmit}>
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
                {validationErrors.name && <div className="invalid-feedback">{validationErrors.name}</div>}
              </div>
              <div className="col-md-6">
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
                {validationErrors.price && <div className="invalid-feedback">{validationErrors.price}</div>}
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description *</label>
              <textarea
                className={`form-control ${validationErrors.description ? 'is-invalid' : ''}`}
                id="description"
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
              {validationErrors.description && <div className="invalid-feedback">{validationErrors.description}</div>}
            </div>

            <div className="mb-3">
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
              {validationErrors.sportId && <div className="invalid-feedback">{validationErrors.sportId}</div>}
            </div>

            {renderSportSpecificFields()}

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
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Création en cours...
                  </>
                ) : 'Créer la prestation'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PrestationCreate;