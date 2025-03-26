import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

function Register() {
  const [formData, setFormData] = useState({
    mail: '',
    pseudo: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    zipCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation basique
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      
      // Enlever confirmPassword avant d'envoyer au serveur
      const { confirmPassword, ...userData } = formData;
      
      await register(userData);
      navigate('/user/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.response?.data?.error || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-7">
          <div className="card shadow">
            <div className="card-body p-4 p-md-5">
              <h2 className="text-center mb-4">Créer un compte</h2>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  {/* Informations de compte */}
                  <div className="col-12">
                    <h5>Informations de compte</h5>
                  </div>
                  
                  <div className="col-md-6">
                    <label htmlFor="mail" className="form-label">Email*</label>
                    <input
                      type="email"
                      className="form-control"
                      id="mail"
                      name="mail"
                      value={formData.mail}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="col-md-6">
                    <label htmlFor="pseudo" className="form-label">Pseudo*</label>
                    <input
                      type="text"
                      className="form-control"
                      id="pseudo"
                      name="pseudo"
                      value={formData.pseudo}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="col-md-6">
                    <label htmlFor="password" className="form-label">Mot de passe*</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="col-md-6">
                    <label htmlFor="confirmPassword" className="form-label">Confirmer le mot de passe*</label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  {/* Informations personnelles */}
                  <div className="col-12 mt-4">
                    <h5>Informations personnelles</h5>
                    <p className="text-muted small">Ces informations sont facultatives mais recommandées</p>
                  </div>
                  
                  <div className="col-md-6">
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
                  
                  <div className="col-md-6">
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
                  
                  {/* Adresse */}
                  <div className="col-12">
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
                  
                  <div className="col-md-8">
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
                  
                  <div className="col-md-4">
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
                  
                  <div className="col-12 mt-4">
                    <div className="d-grid">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Création du compte...
                          </>
                        ) : (
                          <>
                            <FontAwesomeIcon icon={faUserPlus} className="me-2" />
                            S'inscrire
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
              
              <div className="text-center mt-3">
                <p>
                  Déjà inscrit ?{' '}
                  <Link to="/login" className="link-primary">
                    Connectez-vous
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;