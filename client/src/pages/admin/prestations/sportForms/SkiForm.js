import React from 'react';

function SkiForm({ formData, onChange, errors }) {
  return (
    <div className="mt-4">
      <h5>Détails du ski</h5>
      <div className="row mb-3">
        <div className="col-md-6">
          <label htmlFor="snowCondition" className="form-label">Conditions de neige *</label>
          <input
            type="text"
            className={`form-control ${errors.snowCondition ? 'is-invalid' : ''}`}
            id="snowCondition"
            name="snowCondition"
            value={formData.snowCondition || ''}
            onChange={onChange}
          />
          {errors.snowCondition && <div className="invalid-feedback">{errors.snowCondition}</div>}
        </div>
        <div className="col-md-6">
          <label htmlFor="skiLift" className="form-label">Remontées mécaniques</label>
          <input
            type="text"
            className="form-control"
            id="skiLift"
            name="skiLift"
            value={formData.skiLift || ''}
            onChange={onChange}
          />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md-6">
          <label htmlFor="pistColor" className="form-label">Couleur de piste *</label>
          <select
            className={`form-select ${errors.pistColor ? 'is-invalid' : ''}`}
            id="pistColor"
            name="pistColor"
            value={formData.pistColor || ''}
            onChange={onChange}
          >
            <option value="">Sélectionner une couleur</option>
            <option value="verte">Verte</option>
            <option value="bleue">Bleue</option>
            <option value="rouge">Rouge</option>
            <option value="noire">Noire</option>
          </select>
          {errors.pistColor && <div className="invalid-feedback">{errors.pistColor}</div>}
        </div>
      </div>
    </div>
  );
}

export default SkiForm;