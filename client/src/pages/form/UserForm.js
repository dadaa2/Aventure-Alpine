import React, { useState, useEffect } from 'react';

function UserForm({ 
  initialValues = {}, 
  onSubmit, 
  submitButtonText = "Enregistrer",
  isAdmin = false 
}) {
  const [formData, setFormData] = useState({
    mail: '',
    pseudo: '',
    password: '',
    passwordConfirm: '',
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    zipCode: '',
    ...initialValues
  });
  
  const [errors, setErrors] = useState({});

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
      [name]: value
    });
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.mail) newErrors.mail = "L'adresse mail est requise";
    if (!formData.pseudo) newErrors.pseudo = "Le pseudo est requis";
    
    // Vérifier le mot de passe seulement s'il s'agit d'une création ou si le champ est rempli pour une mise à jour
    if ((!initialValues.id && !formData.password) || 
        (initialValues.id && formData.password && formData.password.trim() !== '')) {
      if (formData.password !== formData.passwordConfirm) {
        newErrors.passwordConfirm = "Les mots de passe ne correspondent pas";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      // Supprime la confirmation du mot de passe avant d'envoyer les données
      const dataToSubmit = { ...formData };
      delete dataToSubmit.passwordConfirm;
      
      // Si le mot de passe est vide lors d'une mise à jour, ne pas l'envoyer
      if (initialValues.id && (!dataToSubmit.password || dataToSubmit.password.trim() === '')) {
        delete dataToSubmit.password;
      }
      
      onSubmit(dataToSubmit);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="mail" className="form-label">Adresse mail</label>
        <input
          type="email"
          className={`form-control ${errors.mail ? 'is-invalid' : ''}`}
          id="mail"
          name="mail"
          value={formData.mail}
          onChange={handleChange}
        />
        {errors.mail && <div className="invalid-feedback">{errors.mail}</div>}
      </div>
      
      <div className="mb-3">
        <label htmlFor="pseudo" className="form-label">Pseudo</label>
        <input
          type="text"
          className={`form-control ${errors.pseudo ? 'is-invalid' : ''}`}
          id="pseudo"
          name="pseudo"
          value={formData.pseudo}
          onChange={handleChange}
        />
        {errors.pseudo && <div className="invalid-feedback">{errors.pseudo}</div>}
      </div>
      
      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          {initialValues.id ? "Nouveau mot de passe (laisser vide pour ne pas modifier)" : "Mot de passe"}
        </label>
        <input
          type="password"
          className={`form-control ${errors.password ? 'is-invalid' : ''}`}
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
      </div>
      
      <div className="mb-3">
        <label htmlFor="passwordConfirm" className="form-label">Confirmer le mot de passe</label>
        <input
          type="password"
          className={`form-control ${errors.passwordConfirm ? 'is-invalid' : ''}`}
          id="passwordConfirm"
          name="passwordConfirm"
          value={formData.passwordConfirm}
          onChange={handleChange}
        />
        {errors.passwordConfirm && <div className="invalid-feedback">{errors.passwordConfirm}</div>}
      </div>
      
      <div className="mb-3">
        <label htmlFor="firstName" className="form-label">Prénom</label>
        <input
          type="text"
          className="form-control"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
        />
      </div>
      
      <div className="mb-3">
        <label htmlFor="lastName" className="form-label">Nom</label>
        <input
          type="text"
          className="form-control"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
        />
      </div>
      
      <div className="mb-3">
        <label htmlFor="street" className="form-label">Rue</label>
        <input
          type="text"
          className="form-control"
          id="street"
          name="street"
          value={formData.street}
          onChange={handleChange}
        />
      </div>
      
      <div className="mb-3">
        <label htmlFor="city" className="form-label">Ville</label>
        <input
          type="text"
          className="form-control"
          id="city"
          name="city"
          value={formData.city}
          onChange={handleChange}
        />
      </div>
      
      <div className="mb-3">
        <label htmlFor="zipCode" className="form-label">Code postal</label>
        <input
          type="text"
          className="form-control"
          id="zipCode"
          name="zipCode"
          value={formData.zipCode}
          onChange={handleChange}
        />
      </div>
      
      {/* Afficher d'autres champs spécifiques à l'admin si nécessaire */}
      {isAdmin && (
        <div className="mb-3">
          <label htmlFor="role" className="form-label">Rôle</label>
          <select
            className="form-select"
            id="role"
            name="role"
            value={formData.role || 'user'}
            onChange={handleChange}
          >
            <option value="user">Utilisateur</option>
            <option value="admin">Administrateur</option>
          </select>
        </div>
      )}
      
      <button type="submit" className="btn btn-primary">{submitButtonText}</button>
    </form>
  );
}

export default UserForm;