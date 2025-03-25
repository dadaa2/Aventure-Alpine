import React from 'react';

function EscaladeForm({ formData, onChange, errors }) {
  return (
    <div className="mt-4">
      <h5>Détails de l'escalade</h5>
      <div className="row mb-3">
        <div className="col-md-6">
          <label htmlFor="difficulty" className="form-label">Difficulté *</label>
          <select
            className={`form-select ${errors.difficulty ? 'is-invalid' : ''}`}
            id="difficulty"
            name="difficulty"
            value={formData.difficulty || ''}
            onChange={onChange}
          >
            <option value="">Sélectionner une difficulté</option>
            <option value="Débutant">Débutant</option>
            <option value="Intermédiaire">Intermédiaire</option>
            <option value="Avancé">Avancé</option>
            <option value="Expert">Expert</option>
          </select>
          {errors.difficulty && <div className="invalid-feedback">{errors.difficulty}</div>}
        </div>
        <div className="col-md-6">
          <label htmlFor="ascentionTime" className="form-label">Temps d'ascension</label>
          <input
            type="text"
            className="form-control"
            id="ascentionTime"
            name="ascentionTime"
            placeholder="Ex: 2 heures"
            value={formData.ascentionTime || ''}
            onChange={onChange}
          />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md-6">
          <label htmlFor="location" className="form-label">Lieu *</label>
          <input
            type="text"
            className={`form-control ${errors.location ? 'is-invalid' : ''}`}
            id="location"
            name="location"
            value={formData.location || ''}
            onChange={onChange}
          />
          {errors.location && <div className="invalid-feedback">{errors.location}</div>}
        </div>
      </div>
    </div>
  );
}

export default EscaladeForm;