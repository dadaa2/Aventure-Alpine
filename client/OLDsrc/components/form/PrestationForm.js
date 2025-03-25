import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PrestationForm({ 
  initialValues = {}, 
  onSubmit, 
  submitButtonText = "Enregistrer"
}) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    sportId: '',
    // Caractéristiques spécifiques aux sports
    ski: {
      snowCondition: '',
      skiLift: '',
      pistColor: ''
    },
    randonnee: {
      regionName: '',
      startPoint: '',
      endPoint: '',
      distance: '',
      praticable: ''
    },
    escalade: {
      difficulty: '',
      ascentionTime: '',
      location: ''
    },
    ...initialValues
  });
  
  const [errors, setErrors] = useState({});
  const [sports, setSports] = useState([]);
  const [selectedSportType, setSelectedSportType] = useState(null);
  
  // Chargement des sports pour le dropdown
  useEffect(() => {
    axios.get("http://localhost:3002/prestations/sports/all")
      .then(response => {
        setSports(response.data);
      })
      .catch(error => {
        console.error("Erreur lors du chargement des sports:", error);
      });
  }, []);

  // Mettre à jour le formulaire si initialValues change
  useEffect(() => {
    if (initialValues) {
      setFormData(prev => ({
        ...prev,
        ...initialValues
      }));
      
      // Si nous avons un sportId dans les valeurs initiales, définir le type de sport
      if (initialValues.sportId) {
        const sport = sports.find(s => s.id === parseInt(initialValues.sportId));
        if (sport) {
          setSelectedSportType(sport.name.toLowerCase());
        }
      }
    }
  }, [initialValues, sports]);
  
  // Mettre à jour le type de sport sélectionné lorsque sportId change
  useEffect(() => {
    if (formData.sportId) {
      const sport = sports.find(s => s.id === parseInt(formData.sportId));
      if (sport) {
        setSelectedSportType(sport.name.toLowerCase());
      } else {
        setSelectedSportType(null);
      }
    } else {
      setSelectedSportType(null);
    }
  }, [formData.sportId, sports]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Gestion des champs spécifiques aux sports
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'price' ? parseFloat(value) || '' : value
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name) newErrors.name = "Le nom de la prestation est requis";
    if (!formData.price) newErrors.price = "Le prix est requis";
    else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) 
      newErrors.price = "Le prix doit être un nombre positif";
    if (!formData.description) newErrors.description = "La description est requise";
    if (!formData.sportId) newErrors.sportId = "Veuillez sélectionner un sport";
    
    // Validation des champs spécifiques au sport sélectionné
    if (selectedSportType === 'ski') {
      if (!formData.ski.snowCondition) newErrors['ski.snowCondition'] = "L'état de la neige est requis";
      if (!formData.ski.skiLift) newErrors['ski.skiLift'] = "Les remontées mécaniques sont requises";
      if (!formData.ski.pistColor) newErrors['ski.pistColor'] = "La couleur de la piste est requise";
    } else if (selectedSportType === 'randonnée') {
      if (!formData.randonnee.startPoint) newErrors['randonnee.startPoint'] = "Le point de départ est requis";
      if (!formData.randonnee.endPoint) newErrors['randonnee.endPoint'] = "Le point d'arrivée est requis";
      if (!formData.randonnee.distance) newErrors['randonnee.distance'] = "La distance est requise";
    } else if (selectedSportType === 'escalade') {
      if (!formData.escalade.difficulty) newErrors['escalade.difficulty'] = "La difficulté est requise";
      if (!formData.escalade.ascentionTime) newErrors['escalade.ascentionTime'] = "Le temps d'ascension est requis";
      if (!formData.escalade.location) newErrors['escalade.location'] = "Le lieu est requis";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      // Conversion du prix en nombre
      const dataToSubmit = {
        ...formData,
        price: parseFloat(formData.price)
      };
      
      // Ajouter les données spécifiques au sport
      if (selectedSportType === 'ski') {
        dataToSubmit.sportDetails = formData.ski;
      } else if (selectedSportType === 'randonnée') {
        dataToSubmit.sportDetails = formData.randonnee;
      } else if (selectedSportType === 'escalade') {
        dataToSubmit.sportDetails = formData.escalade;
      }
      
      onSubmit(dataToSubmit);
    }
  };

  // Fonction de rendu des champs spécifiques au sport
  const renderSportSpecificFields = () => {
    if (selectedSportType === 'ski') {
      return (
        <div className="border p-3 mt-4 mb-3 bg-light rounded">
          <h4 className="mb-3">Détails du ski</h4>
          <div className="mb-3">
            <label htmlFor="snowCondition" className="form-label">État de la neige</label>
            <input
              type="text"
              className={`form-control ${errors['ski.snowCondition'] ? 'is-invalid' : ''}`}
              id="snowCondition"
              name="ski.snowCondition"
              value={formData.ski.snowCondition}
              onChange={handleChange}
            />
            {errors['ski.snowCondition'] && <div className="invalid-feedback">{errors['ski.snowCondition']}</div>}
          </div>
          
          <div className="mb-3">
            <label htmlFor="skiLift" className="form-label">Remontées mécaniques</label>
            <input
              type="text"
              className={`form-control ${errors['ski.skiLift'] ? 'is-invalid' : ''}`}
              id="skiLift"
              name="ski.skiLift"
              value={formData.ski.skiLift}
              onChange={handleChange}
            />
            {errors['ski.skiLift'] && <div className="invalid-feedback">{errors['ski.skiLift']}</div>}
          </div>
          
          <div className="mb-3">
            <label htmlFor="pistColor" className="form-label">Couleur de la piste</label>
            <select
              className={`form-select ${errors['ski.pistColor'] ? 'is-invalid' : ''}`}
              id="pistColor"
              name="ski.pistColor"
              value={formData.ski.pistColor}
              onChange={handleChange}
            >
              <option value="">Sélectionnez une couleur</option>
              <option value="verte">Verte (débutant)</option>
              <option value="bleue">Bleue (intermédiaire)</option>
              <option value="rouge">Rouge (confirmé)</option>
              <option value="noire">Noire (expert)</option>
            </select>
            {errors['ski.pistColor'] && <div className="invalid-feedback">{errors['ski.pistColor']}</div>}
          </div>
        </div>
      );
    } else if (selectedSportType === 'randonnée') {
      return (
        <div className="border p-3 mt-4 mb-3 bg-light rounded">
          <h4 className="mb-3">Détails de la randonnée</h4>
          <div className="mb-3">
            <label htmlFor="regionName" className="form-label">Nom de la région</label>
            <input
              type="text"
              className={`form-control ${errors['randonnee.regionName'] ? 'is-invalid' : ''}`}
              id="regionName"
              name="randonnee.regionName"
              value={formData.randonnee.regionName}
              onChange={handleChange}
            />
            {errors['randonnee.regionName'] && <div className="invalid-feedback">{errors['randonnee.regionName']}</div>}
          </div>
          
          <div className="mb-3">
            <label htmlFor="startPoint" className="form-label">Point de départ</label>
            <input
              type="text"
              className={`form-control ${errors['randonnee.startPoint'] ? 'is-invalid' : ''}`}
              id="startPoint"
              name="randonnee.startPoint"
              value={formData.randonnee.startPoint}
              onChange={handleChange}
            />
            {errors['randonnee.startPoint'] && <div className="invalid-feedback">{errors['randonnee.startPoint']}</div>}
          </div>
          
          <div className="mb-3">
            <label htmlFor="endPoint" className="form-label">Point d'arrivée</label>
            <input
              type="text"
              className={`form-control ${errors['randonnee.endPoint'] ? 'is-invalid' : ''}`}
              id="endPoint"
              name="randonnee.endPoint"
              value={formData.randonnee.endPoint}
              onChange={handleChange}
            />
            {errors['randonnee.endPoint'] && <div className="invalid-feedback">{errors['randonnee.endPoint']}</div>}
          </div>
          
          <div className="mb-3">
            <label htmlFor="distance" className="form-label">Distance</label>
            <input
              type="text"
              className={`form-control ${errors['randonnee.distance'] ? 'is-invalid' : ''}`}
              id="distance"
              name="randonnee.distance"
              value={formData.randonnee.distance}
              onChange={handleChange}
            />
            {errors['randonnee.distance'] && <div className="invalid-feedback">{errors['randonnee.distance']}</div>}
          </div>
          
          <div className="mb-3">
            <label htmlFor="praticable" className="form-label">Praticable</label>
            <input
              type="text"
              className={`form-control ${errors['randonnee.praticable'] ? 'is-invalid' : ''}`}
              id="praticable"
              name="randonnee.praticable"
              value={formData.randonnee.praticable}
              onChange={handleChange}
              placeholder="Ex: Toute l'année, Été uniquement, etc."
            />
            {errors['randonnee.praticable'] && <div className="invalid-feedback">{errors['randonnee.praticable']}</div>}
          </div>
        </div>
      );
    } else if (selectedSportType === 'escalade') {
      return (
        <div className="border p-3 mt-4 mb-3 bg-light rounded">
          <h4 className="mb-3">Détails de l'escalade</h4>
          <div className="mb-3">
            <label htmlFor="difficulty" className="form-label">Difficulté</label>
            <input
              type="text"
              className={`form-control ${errors['escalade.difficulty'] ? 'is-invalid' : ''}`}
              id="difficulty"
              name="escalade.difficulty"
              value={formData.escalade.difficulty}
              onChange={handleChange}
            />
            {errors['escalade.difficulty'] && <div className="invalid-feedback">{errors['escalade.difficulty']}</div>}
          </div>
          
          <div className="mb-3">
            <label htmlFor="ascentionTime" className="form-label">Temps d'ascension</label>
            <input
              type="text"
              className={`form-control ${errors['escalade.ascentionTime'] ? 'is-invalid' : ''}`}
              id="ascentionTime"
              name="escalade.ascentionTime"
              value={formData.escalade.ascentionTime}
              onChange={handleChange}
            />
            {errors['escalade.ascentionTime'] && <div className="invalid-feedback">{errors['escalade.ascentionTime']}</div>}
          </div>
          
          <div className="mb-3">
            <label htmlFor="location" className="form-label">Lieu</label>
            <input
              type="text"
              className={`form-control ${errors['escalade.location'] ? 'is-invalid' : ''}`}
              id="location"
              name="escalade.location"
              value={formData.escalade.location}
              onChange={handleChange}
            />
            {errors['escalade.location'] && <div className="invalid-feedback">{errors['escalade.location']}</div>}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">Nom de la prestation</label>
        <input
          type="text"
          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
      </div>
      
      <div className="mb-3">
        <label htmlFor="price" className="form-label">Prix (€)</label>
        <input
          type="number"
          step="0.01"
          min="0"
          className={`form-control ${errors.price ? 'is-invalid' : ''}`}
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
        />
        {errors.price && <div className="invalid-feedback">{errors.price}</div>}
      </div>
      
      <div className="mb-3">
        <label htmlFor="sportId" className="form-label">Sport</label>
        <select
          className={`form-select ${errors.sportId ? 'is-invalid' : ''}`}
          id="sportId"
          name="sportId"
          value={formData.sportId}
          onChange={handleChange}
        >
          <option value="">Sélectionnez un sport</option>
          {sports.map(sport => (
            <option key={sport.id} value={sport.id}>{sport.name}</option>
          ))}
        </select>
        {errors.sportId && <div className="invalid-feedback">{errors.sportId}</div>}
      </div>
      
      <div className="mb-3">
        <label htmlFor="description" className="form-label">Description</label>
        <textarea
          className={`form-control ${errors.description ? 'is-invalid' : ''}`}
          id="description"
          name="description"
          rows="3"
          value={formData.description}
          onChange={handleChange}
        ></textarea>
        {errors.description && <div className="invalid-feedback">{errors.description}</div>}
      </div>
      
      {/* Rendu des champs spécifiques au sport */}
      {renderSportSpecificFields()}
      
      <button type="submit" className="btn btn-primary">{submitButtonText}</button>
    </form>
  );
}

export default PrestationForm;