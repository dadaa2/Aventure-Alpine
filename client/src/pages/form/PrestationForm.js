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
    ...initialValues
  });
  
  const [errors, setErrors] = useState({});
  const [sports, setSports] = useState([]);
  
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
    }
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' ? parseFloat(value) || '' : value
    });
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name) newErrors.name = "Le nom de la prestation est requis";
    if (!formData.price) newErrors.price = "Le prix est requis";
    else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) 
      newErrors.price = "Le prix doit être un nombre positif";
    if (!formData.description) newErrors.description = "La description est requise";
    if (!formData.sportId) newErrors.sportId = "Veuillez sélectionner un sport";
    
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
      
      onSubmit(dataToSubmit);
    }
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
      
      <button type="submit" className="btn btn-primary">{submitButtonText}</button>
    </form>
  );
}

export default PrestationForm;