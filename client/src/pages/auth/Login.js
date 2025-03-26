import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Modifier cette ligne pour rediriger vers la page d'accueil par défaut
  // ou vers la page admin si c'est un administrateur
  const getDefaultRedirect = () => {
    // Si l'utilisateur venait d'une page spécifique (protégée), y retourner
    if (location.state?.from?.pathname) {
      return location.state.from.pathname;
    }
    
    // Sinon, aller à la page d'accueil
    return '/';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      
      await login(email, password);
      navigate(getDefaultRedirect(), { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      setError('Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow">
            <div className="card-body p-4 p-md-5">
              <h2 className="text-center mb-4">Connexion</h2>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Mot de passe</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Connexion...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faSignInAlt} className="me-2" />
                        Se connecter
                      </>
                    )}
                  </button>
                </div>
              </form>
              
              <div className="text-center mt-3">
                <p>
                  Vous n'avez pas de compte ?{' '}
                  <Link to="/register" className="link-primary">
                    Inscrivez-vous
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

export default Login;