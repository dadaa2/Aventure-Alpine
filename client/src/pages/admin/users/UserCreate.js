import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserController from '../../../controllers/UserController';

function UserCreate() {
  const navigate = useNavigate();
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
    roleId: 1
  });
  
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const data = await UserController.getAllRoles();
      setRoles(data);
    } catch (err) {
      console.error('Erreur lors du chargement des rôles:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
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

  const validate = () => {
    const errors = {};
    
    if (!formData.mail) errors.mail = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(formData.mail)) errors.mail = "L'email est invalide";
    
    if (!formData.pseudo) errors.pseudo = "Le pseudo est requis";
    
    if (!formData.password) errors.password = "Le mot de passe est requis";
    else if (formData.password.length < 6) errors.password = "Le mot de passe doit contenir au moins 6 caractères";
    
    if (formData.password !== formData.passwordConfirm) {
      errors.passwordConfirm = "Les mots de passe ne correspondent pas";
    }
    
    if (!formData.firstName) errors.firstName = "Le prénom est requis";
    if (!formData.lastName) errors.lastName = "Le nom est requis";
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Exclure passwordConfirm avant d'envoyer les données
      const { passwordConfirm, ...dataToSend } = formData;
      
      await UserController.createUser(dataToSend);
      navigate('/admin/users');
    } catch (err) {
      setError(err.response?.data?.error || 'Une erreur est survenue lors de la création de l\'utilisateur');
      setLoading(false);
    }
  };

  // Le reste du code reste identique
  return (
    <div className="container my-5">
      {/* ... le reste du JSX reste inchangé ... */}
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">Créer un nouvel utilisateur</h3>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="mail" className="form-label">Email *</label>
                <input
                  type="email"
                  className={`form-control ${validationErrors.mail ? 'is-invalid' : ''}`}
                  id="mail"
                  name="mail"
                  value={formData.mail}
                  onChange={handleChange}
                />
                {validationErrors.mail && <div className="invalid-feedback">{validationErrors.mail}</div>}
              </div>
              <div className="col-md-6">
                <label htmlFor="pseudo" className="form-label">Pseudo *</label>
                <input
                  type="text"
                  className={`form-control ${validationErrors.pseudo ? 'is-invalid' : ''}`}
                  id="pseudo"
                  name="pseudo"
                  value={formData.pseudo}
                  onChange={handleChange}
                />
                {validationErrors.pseudo && <div className="invalid-feedback">{validationErrors.pseudo}</div>}
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="password" className="form-label">Mot de passe *</label>
                <input
                  type="password"
                  className={`form-control ${validationErrors.password ? 'is-invalid' : ''}`}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                {validationErrors.password && <div className="invalid-feedback">{validationErrors.password}</div>}
              </div>
              <div className="col-md-6">
                <label htmlFor="passwordConfirm" className="form-label">Confirmer le mot de passe *</label>
                <input
                  type="password"
                  className={`form-control ${validationErrors.passwordConfirm ? 'is-invalid' : ''}`}
                  id="passwordConfirm"
                  name="passwordConfirm"
                  value={formData.passwordConfirm}
                  onChange={handleChange}
                />
                {validationErrors.passwordConfirm && <div className="invalid-feedback">{validationErrors.passwordConfirm}</div>}
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="firstName" className="form-label">Prénom *</label>
                <input
                  type="text"
                  className={`form-control ${validationErrors.firstName ? 'is-invalid' : ''}`}
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {validationErrors.firstName && <div className="invalid-feedback">{validationErrors.firstName}</div>}
              </div>
              <div className="col-md-6">
                <label htmlFor="lastName" className="form-label">Nom *</label>
                <input
                  type="text"
                  className={`form-control ${validationErrors.lastName ? 'is-invalid' : ''}`}
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
                {validationErrors.lastName && <div className="invalid-feedback">{validationErrors.lastName}</div>}
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-12">
                <label htmlFor="street" className="form-label">Adresse</label>
                <input
                  type="text"
                  className="form-control"
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
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
              <div className="col-md-6">
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
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="roleId" className="form-label">Rôle</label>
                <select
                  className="form-select"
                  id="roleId"
                  name="roleId"
                  value={formData.roleId}
                  onChange={handleChange}
                >
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>
                      {role.roleName} - {role.roleDescription}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="d-flex justify-content-between mt-4">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/admin/users')}
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
                ) : 'Créer l\'utilisateur'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserCreate;