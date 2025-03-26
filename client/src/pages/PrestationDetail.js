import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendar, faUsers, faShoppingCart, 
  faExclamationTriangle, faCheckCircle,
  faArrowLeft, 
  faSnowflake, 
  faPersonHiking, 
  faMountain, 
  faEuroSign, 
  faCalendarAlt,
  faMapMarkerAlt,
  faRulerHorizontal,
  faMountainSun,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import { format, addDays } from 'date-fns';

function PrestationDetail() {
  const { id } = useParams();
  const [prestation, setPrestation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // États pour la réservation
  const [bookingData, setBookingData] = useState({
    startPrestation: format(new Date(), 'yyyy-MM-dd'),
    endPrestation: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    numberPerson: 1
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');

  useEffect(() => {
    const fetchPrestation = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3002/prestations/${id}`);
        setPrestation(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement de la prestation:", err);
        setError("Impossible de charger les détails de cette prestation.");
        setLoading(false);
      }
    };

    fetchPrestation();
  }, [id]);

  // Icon pour le type de sport
  const getSportIcon = (sportName) => {
    if (!sportName) return <FontAwesomeIcon icon={faPersonHiking} />;
    
    const sportNameLower = sportName.toLowerCase();
    if (sportNameLower.includes('ski')) {
      return <FontAwesomeIcon icon={faSnowflake} />;
    } else if (sportNameLower.includes('escalade')) {
      return <FontAwesomeIcon icon={faMountain} />;
    } else {
      return <FontAwesomeIcon icon={faPersonHiking} />;
    }
  };

  // Afficher les détails spécifiques au sport
  const renderSportDetails = () => {
    if (!prestation?.sport || !prestation.sportDetails) return null;
    
    const sportType = prestation.sport.name.toLowerCase();
    
    if (sportType.includes('ski')) {
      return (
        <div className="card mb-4">
          <div className="card-header bg-light">
            <h4 className="mb-0">Détails du ski</h4>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <div className="d-flex align-items-center">
                  <div className="feature-icon bg-light rounded-circle p-3 me-3">
                    <FontAwesomeIcon icon={faSnowflake} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-muted mb-0">Conditions de neige</p>
                    <h5>{prestation.sportDetails.snowCondition}</h5>
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <div className="d-flex align-items-center">
                  <div className={`feature-icon bg-${getPistColorClass(prestation.sportDetails.pistColor)} rounded-circle p-3 me-3`}>
                    <FontAwesomeIcon icon={faMountainSun} className="text-white" />
                  </div>
                  <div>
                    <p className="text-muted mb-0">Couleur de piste</p>
                    <h5 className={`text-${getPistColorClass(prestation.sportDetails.pistColor)}`}>
                      {formatPistColor(prestation.sportDetails.pistColor)}
                    </h5>
                  </div>
                </div>
              </div>
              {prestation.sportDetails.skiLift && (
                <div className="col-md-6 mb-3">
                  <div className="d-flex align-items-center">
                    <div className="feature-icon bg-light rounded-circle p-3 me-3">
                      <FontAwesomeIcon icon={faChevronRight} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-muted mb-0">Remontées mécaniques</p>
                      <h5>{prestation.sportDetails.skiLift}</h5>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    } else if (sportType.includes('randonn')) {
      return (
        <div className="card mb-4">
          <div className="card-header bg-light">
            <h4 className="mb-0">Détails de la randonnée</h4>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <div className="d-flex align-items-center">
                  <div className="feature-icon bg-light rounded-circle p-3 me-3">
                    <FontAwesomeIcon icon={faRulerHorizontal} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-muted mb-0">Distance</p>
                    <h5>{prestation.sportDetails.distance}</h5>
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <div className="d-flex align-items-center">
                  <div className="feature-icon bg-light rounded-circle p-3 me-3">
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-muted mb-0">Saison praticable</p>
                    <h5>{prestation.sportDetails.praticable}</h5>
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <div className="d-flex align-items-center">
                  <div className="feature-icon bg-success rounded-circle p-3 me-3">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-white" />
                  </div>
                  <div>
                    <p className="text-muted mb-0">Départ</p>
                    <h5>{prestation.sportDetails.startPoint}</h5>
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <div className="d-flex align-items-center">
                  <div className="feature-icon bg-danger rounded-circle p-3 me-3">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-white" />
                  </div>
                  <div>
                    <p className="text-muted mb-0">Arrivée</p>
                    <h5>{prestation.sportDetails.endPoint}</h5>
                  </div>
                </div>
              </div>
              {prestation.sportDetails.regionName && (
                <div className="col-md-6 mb-3">
                  <div className="d-flex align-items-center">
                    <div className="feature-icon bg-light rounded-circle p-3 me-3">
                      <FontAwesomeIcon icon={faMountainSun} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-muted mb-0">Région</p>
                      <h5>{prestation.sportDetails.regionName}</h5>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    } else if (sportType.includes('escalade')) {
      return (
        <div className="card mb-4">
          <div className="card-header bg-light">
            <h4 className="mb-0">Détails de l'escalade</h4>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <div className="d-flex align-items-center">
                  <div className="feature-icon bg-light rounded-circle p-3 me-3">
                    <FontAwesomeIcon icon={faMountain} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-muted mb-0">Difficulté</p>
                    <h5>{prestation.sportDetails.difficulty}</h5>
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <div className="d-flex align-items-center">
                  <div className="feature-icon bg-light rounded-circle p-3 me-3">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-muted mb-0">Lieu</p>
                    <h5>{prestation.sportDetails.location}</h5>
                  </div>
                </div>
              </div>
              {prestation.sportDetails.ascentionTime && (
                <div className="col-md-6 mb-3">
                  <div className="d-flex align-items-center">
                    <div className="feature-icon bg-light rounded-circle p-3 me-3">
                      <FontAwesomeIcon icon={faCalendarAlt} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-muted mb-0">Temps d'ascension</p>
                      <h5>{prestation.sportDetails.ascentionTime}</h5>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }
    
    return null;
  };

  // Fonctions d'aide
  const getPistColorClass = (color) => {
    if (!color) return 'primary';
    switch (color.toLowerCase()) {
      case 'verte': return 'success';
      case 'bleue': return 'primary';
      case 'rouge': return 'danger';
      case 'noire': return 'dark';
      default: return 'primary';
    }
  };

  const formatPistColor = (color) => {
    if (!color) return 'Non spécifiée';
    return color.charAt(0).toUpperCase() + color.slice(1);
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: name === 'numberPerson' ? parseInt(value) : value
    }));
  };
  
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      navigate('/login', { state: { from: { pathname: `/prestations/${id}` } } });
      return;
    }
    
    setBookingLoading(true);
    setBookingError('');
    setBookingSuccess('');
    
    try {
      // Vérification des dates
      if (bookingData.startPrestation >= bookingData.endPrestation) {
        throw new Error('La date de fin doit être après la date de début');
      }
      
      // Création de la réservation
      const response = await axios.post('http://localhost:3002/books', {
        userId: currentUser.id,
        prestationId: prestation.id,
        startPrestation: bookingData.startPrestation,
        endPrestation: bookingData.endPrestation,
        numberPerson: bookingData.numberPerson
      });
      
      setBookingSuccess('Votre réservation a été créée avec succès !');
      
      // Rediriger vers les détails de la réservation après un délai
      setTimeout(() => {
        navigate(`/user/bookings/${response.data.id}`);
      }, 2000);
    } catch (err) {
      console.error('Error creating booking:', err);
      setBookingError(err.response?.data?.error || err.message || 'Erreur lors de la création de la réservation');
    } finally {
      setBookingLoading(false);
    }
  };

  // États de chargement et d'erreur
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
        <p className="mt-3">Chargement des détails de la prestation...</p>
      </div>
    );
  }

  if (error || !prestation) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger mb-4">
          {error || "Cette prestation n'existe pas ou a été supprimée."}
        </div>
        <Link to="/prestations" className="btn btn-primary">
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
          Retour aux prestations
        </Link>
      </div>
    );
  }

  // Section formulaire de réservation
  const renderBookingSection = () => {
    if (currentUser) {
      return (
        <div className="card shadow mb-4">
          <div className="card-header bg-primary text-white">
            <h4 className="mb-0">Réserver cette activité</h4>
          </div>
          <div className="card-body">
            {bookingError && (
              <div className="alert alert-danger">
                <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                {bookingError}
              </div>
            )}
            
            {bookingSuccess && (
              <div className="alert alert-success">
                <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                {bookingSuccess}
              </div>
            )}
            
            <form onSubmit={handleBookingSubmit}>
              <div className="mb-3">
                <label htmlFor="startPrestation" className="form-label">Date de début</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FontAwesomeIcon icon={faCalendar} />
                  </span>
                  <input
                    type="date"
                    className="form-control"
                    id="startPrestation"
                    name="startPrestation"
                    value={bookingData.startPrestation}
                    onChange={handleBookingChange}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    required
                  />
                </div>
              </div>
              
              <div className="mb-3">
                <label htmlFor="endPrestation" className="form-label">Date de fin</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FontAwesomeIcon icon={faCalendar} />
                  </span>
                  <input
                    type="date"
                    className="form-control"
                    id="endPrestation"
                    name="endPrestation"
                    value={bookingData.endPrestation}
                    onChange={handleBookingChange}
                    min={bookingData.startPrestation}
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="numberPerson" className="form-label">Nombre de participants</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FontAwesomeIcon icon={faUsers} />
                  </span>
                  <input
                    type="number"
                    className="form-control"
                    id="numberPerson"
                    name="numberPerson"
                    value={bookingData.numberPerson}
                    onChange={handleBookingChange}
                    min="1"
                    max="10"
                    required
                  />
                </div>
              </div>
              
              <div className="d-grid">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={bookingLoading}
                >
                  {bookingLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Réservation en cours...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
                      Réserver pour {prestation.price * bookingData.numberPerson}€
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    } else {
      return (
        <div className="card shadow mb-4">
          <div className="card-header bg-primary text-white">
            <h4 className="mb-0">Réserver cette activité</h4>
          </div>
          <div className="card-body">
            <p>Pour réserver cette prestation, connectez-vous ou créez un compte.</p>
            <div className="d-grid gap-2">
              <Link to="/login" state={{ from: { pathname: `/prestations/${id}` } }} className="btn btn-primary">
                Se connecter
              </Link>
              <Link to="/register" className="btn btn-outline-primary">
                Créer un compte
              </Link>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="prestation-detail-page py-5">
      <div className="container">
        {/* Fil d'ariane */}
        <div className="row mb-4">
          <div className="col-12">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/">Accueil</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/prestations">Prestations</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {prestation.name}
                </li>
              </ol>
            </nav>
          </div>
        </div>

        {/* En-tête */}
        <div className="row mb-5">
          <div className="col-12">
            <Link to="/prestations" className="btn btn-outline-secondary mb-4">
              <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
              Retour aux prestations
            </Link>
            <div className="d-flex align-items-center justify-content-between">
              <h1 className="display-5 fw-bold">{prestation.name}</h1>
              <div className="price-badge">
                <span className="badge bg-primary p-3 fs-4">
                  <FontAwesomeIcon icon={faEuroSign} className="me-2" />
                  {parseFloat(prestation.price).toFixed(2)} €
                </span>
              </div>
            </div>
            {prestation.sport && (
              <div className="mb-3">
                <span className="badge bg-secondary p-2 fs-6">
                  {getSportIcon(prestation.sport.name)}
                  <span className="ms-2">{prestation.sport.name}</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Contenu principal */}
        <div className="row">
          <div className="col-lg-8">
            {/* Image ou icône représentative */}
            <div className="card mb-4">
              <div className="card-body bg-light p-5 text-center">
                <div className="display-1 mb-3 text-primary">
                  {getSportIcon(prestation.sport?.name)}
                </div>
                <h3 className="card-subtitle mb-2 text-muted">
                  {prestation.sport?.name || 'Aventure en montagne'}
                </h3>
              </div>
            </div>

            {/* Description */}
            <div className="card mb-4">
              <div className="card-header bg-light">
                <h4 className="mb-0">Description</h4>
              </div>
              <div className="card-body">
                <p className="card-text">{prestation.description}</p>
              </div>
            </div>

            {/* Détails du sport */}
            {renderSportDetails()}
          </div>

          <div className="col-lg-4">
            {/* Formulaire de réservation ou appel à l'action */}
            {renderBookingSection()}

            {/* Informations complémentaires */}
            <div className="card mb-4">
              <div className="card-header bg-light">
                <h4 className="mb-0">Informations</h4>
              </div>
              <div className="card-body">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between">
                    <span>Guide inclus</span>
                    <span className="text-success fw-bold">✓</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <span>Équipement fourni</span>
                    <span className="text-success fw-bold">✓</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <span>Assurance</span>
                    <span className="text-success fw-bold">✓</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <span>Préparation physique</span>
                    <span>Recommandée</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Contacter pour plus d'informations */}
            <div className="card bg-light">
              <div className="card-body text-center">
                <h5 className="card-title">Des questions?</h5>
                <p className="card-text">Notre équipe est disponible pour répondre à toutes vos questions.</p>
                <Link to="/contact" className="btn btn-outline-secondary">Nous contacter</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Prestations similaires */}
        <div className="mt-5 pt-3 border-top">
          <h2 className="mb-4">Vous pourriez aussi aimer</h2>
          <div className="row">
            <div className="col-12 text-center">
              <Link to="/prestations" className="btn btn-primary btn-lg">
                Découvrir toutes nos prestations
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrestationDetail;