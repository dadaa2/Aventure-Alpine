import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function UserEdit() {
  const { id } = useParams();
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
  
  const [originalUser, setOriginalUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    fetchUser();
    fetchRoles();
  }, [id]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`http://localhost:3002/users/${id}`);
      const userData = response.data;
      
      // Ne pas inclure le mot de passe dans les données du formulaire
      setFormData({
        mail: userData.mail,
        pseudo: userData.pseudo,
        password: '',
        passwordConfirm: '',
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        street: userData.street || '',
        city: userData.city || '',
        zipCode: userData.zipCode || '',
        roleId: userData.roleId
      });
      
      setOriginalUser(userData);
      setLoading(false);
    } catch (err) {
      setError('Erreur lors du chargement des données de l\'utilisateur');
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get('http://localhost:3002/roles');
      setRoles(response.data);
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
    
    // Vérification du mot de passe uniquement s'il est fourni (optionnel lors de la modification)
    if (formData.password) {
      if (formData.password.length < 6) errors.password = "Le mot de passe doit contenir au moins 6 caractères";
      if (formData.password !== formData.passwordConfirm) {
        errors.passwordConfirm = "Les mots de passe ne correspondent pas";
      }
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
      setSaving(true);
      setError(null);
      
      // Préparer les données à envoyer
      const dataToSend = { ...formData };
      delete dataToSend.passwordConfirm;
      
      // Si le mot de passe n'est pas modifié, ne pas l'envoyer
      if (!dataToSend.password) {
        delete dataToSend.password;
      }
      
      await axios.put(`http://localhost:3002/users/${id}`, dataToSend);
      navigate('/admin/users');
    } catch (err) {
      setError(err.response?.data?.error || 'Une erreur est survenue lors de la mise à jour de l\'utilisateur');
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

  if (!originalUser) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          Utilisateur non trouvé
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">Modifier l'utilisateur: {originalUser.pseudo}</h3>
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
                <label htmlFor="password" className="form-label">Mot de passe (laisser vide pour ne pas modifier)</label>
                <input
                  type="password"
                  className={`form-control ${validationErrors.password ? 'is-invalid' : ''}`}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
                {validationErrors.password && <div className="invalid-feedback">{validationErrors.password}</div>}
              </div>
              <div className="col-md-6">
                <label htmlFor="passwordConfirm" className="form-label">Confirmer le mot de passe</label>
                <input
                  type="password"
                  className={`form-control ${validationErrors.passwordConfirm ? 'is-invalid' : ''}`}
                  id="passwordConfirm"
                  name="passwordConfirm"
                  value={formData.passwordConfirm}
                  onChange={handleChange}
                  placeholder="••••••••"
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
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Enregistrement...
                  </>
                ) : 'Enregistrer les modifications'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserEdit;