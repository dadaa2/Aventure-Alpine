import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave, faUpload, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import PrestationController from '../../../controllers/PrestationController';

function PrestationEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    maxParticipants: '',
    duration: '',
    categoryId: '',
    difficulty: 'facile',
    image: '',
    isActive: true
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Niveaux de difficulté disponibles
  const difficultyLevels = ['facile', 'modéré', 'difficile', 'expert'];

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Charger les catégories
      const categoriesData = await PrestationController.getAllCategories();
      setCategories(categoriesData);

      // Charger les données de la prestation si en mode édition
      if (id) {
        const prestationData = await PrestationController.getPrestationById(id);
        
        // Formater les données de la prestation pour le formulaire
        setFormData({
          name: prestationData.name || '',
          description: prestationData.description || '',
          shortDescription: prestationData.shortDescription || '',
          price: prestationData.price || '',
          maxParticipants: prestationData.maxParticipants || '',
          duration: prestationData.duration || '',
          categoryId: prestationData.categoryId || '',
          difficulty: prestationData.difficulty || 'facile',
          image: prestationData.image || '',
          isActive: prestationData.isActive !== undefined ? prestationData.isActive : true
        });
        
        // Prévisualisation de l'image existante
        if (prestationData.image) {
          setImagePreview(prestationData.image);
        }
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
      setError('Erreur lors du chargement des données. Veuillez réessayer.');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Traiter les valeurs numériques
    if (type === 'number') {
      const numValue = value === '' ? '' : Number(value);
      setFormData(prev => ({ ...prev, [name]: numValue }));
    }
    // Traiter les cases à cocher
    else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    }
    // Traiter les autres champs
    else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Effacer les erreurs de validation lors de la modification
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      
      // Créer une prévisualisation de l'image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const errors = {};
    
    if (!formData.name || formData.name.trim() === '') 
      errors.name = 'Le nom est requis';
    
    if (!formData.shortDescription || formData.shortDescription.trim() === '') 
      errors.shortDescription = 'La description courte est requise';
    
    if (!formData.description || formData.description.trim() === '') 
      errors.description = 'La description est requise';
    
    if (!formData.price || formData.price <= 0) 
      errors.price = 'Le prix doit être supérieur à 0';
    
    if (!formData.maxParticipants || formData.maxParticipants <= 0) 
      errors.maxParticipants = 'Le nombre maximum de participants doit être supérieur à 0';
    
    if (!formData.duration || formData.duration <= 0) 
      errors.duration = 'La durée doit être supérieure à 0';
    
    if (!formData.categoryId) 
      errors.categoryId = 'La catégorie est requise';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    try {
      setSaving(true);
      
      // Préparer les données à envoyer
      let dataToSend = { ...formData };
      
      // Traiter l'upload d'image si une nouvelle image est sélectionnée
      if (imageFile) {
        const uploadResult = await PrestationController.uploadImage(imageFile);
        if (uploadResult && uploadResult.imageUrl) {
          dataToSend.image = uploadResult.imageUrl;
        }
      }
      
      if (id) {
        // Mode édition
        await PrestationController.updatePrestation(id, dataToSend);
      } else {
        // Mode création
        await PrestationController.createPrestation(dataToSend);
      }
      
      // Rediriger vers la liste des prestations
      navigate('/admin/prestations');
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement:', err);
      setError('Erreur lors de l\'enregistrement. Veuillez réessayer.');
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
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <Link to="/admin/prestations" className="btn btn-outline-secondary">
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
          Retour à la liste
        </Link>
        <h2 className="mb-0">{id ? 'Modifier la prestation' : 'Nouvelle prestation'}</h2>
        <div style={{ width: '100px' }}></div> {/* Spacer pour centrer le titre */}
      </div>
      
      {error && (
        <div className="alert alert-danger">
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
          {error}
        </div>
      )}
      
      <div className="card shadow">
        <div className="card-body">
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
                {validationErrors.name && (
                  <div className="invalid-feedback">{validationErrors.name}</div>
                )}
              </div>
              
              <div className="col-md-6">
                <label htmlFor="categoryId" className="form-label">Catégorie *</label>
                <select
                  className={`form-select ${validationErrors.categoryId ? 'is-invalid' : ''}`}
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {validationErrors.categoryId && (
                  <div className="invalid-feedback">{validationErrors.categoryId}</div>
                )}
              </div>
            </div>
            
            <div className="mb-3">
              <label htmlFor="shortDescription" className="form-label">Description courte *</label>
              <input
                type="text"
                className={`form-control ${validationErrors.shortDescription ? 'is-invalid' : ''}`}
                id="shortDescription"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
              />
              {validationErrors.shortDescription && (
                <div className="invalid-feedback">{validationErrors.shortDescription}</div>
              )}
            </div>
            
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description détaillée *</label>
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
            
            <div className="row mb-3">
              <div className="col-md-4">
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
              
              <div className="col-md-4">
                <label htmlFor="duration" className="form-label">Durée (heures) *</label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  className={`form-control ${validationErrors.duration ? 'is-invalid' : ''}`}
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                />
                {validationErrors.duration && (
                  <div className="invalid-feedback">{validationErrors.duration}</div>
                )}
              </div>
              
              <div className="col-md-4">
                <label htmlFor="maxParticipants" className="form-label">Nombre max. de participants *</label>
                <input
                  type="number"
                  min="1"
                  className={`form-control ${validationErrors.maxParticipants ? 'is-invalid' : ''}`}
                  id="maxParticipants"
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={handleChange}
                />
                {validationErrors.maxParticipants && (
                  <div className="invalid-feedback">{validationErrors.maxParticipants}</div>
                )}
              </div>
            </div>
            
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="difficulty" className="form-label">Niveau de difficulté</label>
                <select
                  className="form-select"
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                >
                  {difficultyLevels.map(level => (
                    <option key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="col-md-6">
                <div className="form-check form-switch mt-4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="isActive">
                    Prestation active
                  </label>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="image" className="form-label">Image</label>
              <div className="input-group">
                <input
                  type="file"
                  className="form-control"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <label className="input-group-text" htmlFor="image">
                  <FontAwesomeIcon icon={faUpload} className="me-2" />
                  Choisir une image
                </label>
              </div>
              <small className="text-muted">Format recommandé: JPEG ou PNG, max 2MB</small>
              
              {imagePreview && (
                <div className="mt-2">
                  <img 
                    src={imagePreview} 
                    alt="Prévisualisation" 
                    className="img-thumbnail mt-2" 
                    style={{ maxHeight: '200px' }} 
                  />
                </div>
              )}
            </div>
            
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