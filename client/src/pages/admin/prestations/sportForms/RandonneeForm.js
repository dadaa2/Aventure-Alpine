import React from 'react';

function RandonneeForm({ formData, onChange, errors }) {
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
            value={formData.regionName || ''}
            onChange={onChange}
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="distance" className="form-label">Distance *</label>
          <input
            type="text"
            className={`form-control ${errors.distance ? 'is-invalid' : ''}`}
            id="distance"
            name="distance"
            placeholder="Ex: 5 km"
            value={formData.distance || ''}
            onChange={onChange}
          />
          {errors.distance && <div className="invalid-feedback">{errors.distance}</div>}
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md-6">
          <label htmlFor="startPoint" className="form-label">Point de départ *</label>
          <input
            type="text"
            className={`form-control ${errors.startPoint ? 'is-invalid' : ''}`}
            id="startPoint"
            name="startPoint"
            value={formData.startPoint || ''}
            onChange={onChange}
          />
          {errors.startPoint && <div className="invalid-feedback">{errors.startPoint}</div>}
        </div>
        <div className="col-md-6">
          <label htmlFor="endPoint" className="form-label">Point d'arrivée *</label>
          <input
            type="text"
            className={`form-control ${errors.endPoint ? 'is-invalid' : ''}`}
            id="endPoint"
            name="endPoint"
            value={formData.endPoint || ''}
            onChange={onChange}
          />
          {errors.endPoint && <div className="invalid-feedback">{errors.endPoint}</div>}
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md-6">
          <label htmlFor="praticable" className="form-label">Saison praticable</label>
          <select
            className="form-select"
            id="praticable"
            name="praticable"
            value={formData.praticable || ''}
            onChange={onChange}
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
}

export default RandonneeForm;