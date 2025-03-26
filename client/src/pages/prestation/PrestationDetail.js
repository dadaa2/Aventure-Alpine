import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faPersonHiking, 
  faMountain, 
  faSnowflake,
  faEuroSign
} from '@fortawesome/free-solid-svg-icons';

// Import du contrôleur
import PrestationController from '../../controllers/PrestationController';

// Composants importés
import PrestationDetailBookForm from './components/PrestationDetailBookForm';
import PrestationDetailInformation from './components/PrestationDetailInformation';
import PrestationDetailQuestion from './components/PrestationDetailQuestion';
import PrestationDetailSport from './components/PrestationDetailSport';

function PrestationDetail() {
  const { id } = useParams();
  const [prestation, setPrestation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchPrestation = async () => {
      try {
        setLoading(true);
        // Utilisation du contrôleur au lieu d'axios direct
        const data = await PrestationController.getPrestationById(id);
        setPrestation(data);
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
            <PrestationDetailSport prestation={prestation} />
          </div>

          <div className="col-lg-4">
            {/* Formulaire de réservation */}
            <PrestationDetailBookForm prestation={prestation} currentUser={currentUser} />

            {/* Informations complémentaires */}
            <PrestationDetailInformation />

            {/* Contacter pour plus d'informations */}
            <PrestationDetailQuestion />
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