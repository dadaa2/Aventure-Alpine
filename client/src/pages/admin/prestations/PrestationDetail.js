import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faArrowLeft, faCalendarAlt, faMapMarkerAlt, faTag, faEuroSign, faInfo } from '@fortawesome/free-solid-svg-icons';
import PrestationController from '../../../controllers/PrestationController';

function PrestationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [prestation, setPrestation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPrestation();
  }, [id]);

  const fetchPrestation = async () => {
    try {
      const data = await PrestationController.getPrestationById(id);
      setPrestation(data);
      setLoading(false);
    } catch (err) {
      setError('Erreur lors du chargement de la prestation');
      setLoading(false);
      console.error(err);
    }
  };

  const getSportDetailsContent = () => {
    if (!prestation.sportDetails || !prestation.sport) return null;
    
    const sportType = prestation.sport.name.toLowerCase();
    
    if (sportType === 'ski') {
      return (
        <div className="mt-4">
          <h5>Informations sur le ski</h5>
          <ul className="list-group">
            <li className="list-group-item d-flex justify-content-between align-items-center">
              Conditions de neige
              <span className="badge bg-primary rounded-pill">{prestation.sportDetails.snowCondition}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              Remontées mécaniques
              <span className="badge bg-primary rounded-pill">{prestation.sportDetails.skiLift}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              Couleur de piste
              <span className={`badge bg-${prestation.sportDetails.pistColor === 'verte' ? 'success' : prestation.sportDetails.pistColor === 'bleue' ? 'info' : prestation.sportDetails.pistColor === 'rouge' ? 'danger' : 'dark'} rounded-pill`}>
                {prestation.sportDetails.pistColor}
              </span>
            </li>
          </ul>
        </div>
      );
    } else if (sportType === 'randonnée') {
      return (
        <div className="mt-4">
          <h5>Informations sur la randonnée</h5>
          <ul className="list-group">
            <li className="list-group-item d-flex justify-content-between align-items-center">
              Région
              <span className="badge bg-primary rounded-pill">{prestation.sportDetails.regionName}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              Distance
              <span className="badge bg-primary rounded-pill">{prestation.sportDetails.distance}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              Départ
              <span className="badge bg-success rounded-pill">{prestation.sportDetails.startPoint}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              Arrivée
              <span className="badge bg-danger rounded-pill">{prestation.sportDetails.endPoint}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              Saison praticable
              <span className="badge bg-info rounded-pill">{prestation.sportDetails.praticable}</span>
            </li>
          </ul>
        </div>
      );
    } else if (sportType === 'escalade') {
      return (
        <div className="mt-4">
          <h5>Informations sur l'escalade</h5>
          <ul className="list-group">
            <li className="list-group-item d-flex justify-content-between align-items-center">
              Difficulté
              <span className="badge bg-primary rounded-pill">{prestation.sportDetails.difficulty}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              Temps d'ascension
              <span className="badge bg-primary rounded-pill">{prestation.sportDetails.ascentionTime}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              Lieu
              <span className="badge bg-primary rounded-pill">{prestation.sportDetails.location}</span>
            </li>
          </ul>
        </div>
      );
    }
    
    return null;
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

  if (error || !prestation) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          {error || "Prestation non trouvée"}
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => navigate('/admin/prestations')}
        >
          Retour à la liste
        </button>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="mb-4">
        <Link to="/admin/prestations" className="btn btn-outline-secondary">
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
          Retour à la liste
        </Link>
      </div>
      
      <div className="card shadow">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h4 className="mb-0">{prestation.name}</h4>
          <Link to={`/admin/prestations/edit/${prestation.id}`} className="btn btn-light btn-sm">
            <FontAwesomeIcon icon={faEdit} className="me-1" /> Modifier
          </Link>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-8">
              <div className="d-flex mb-3 align-items-center">
                {prestation.sport && (
                  <div className="me-3">
                    <span className="badge bg-primary fs-5 p-2">
                      <FontAwesomeIcon icon={faTag} className="me-2" />
                      {prestation.sport.name}
                    </span>
                  </div>
                )}
                <div>
                  <span className="badge bg-success fs-5 p-2">
                    <FontAwesomeIcon icon={faEuroSign} className="me-2" />
                    {parseFloat(prestation.price).toFixed(2)} €
                  </span>
                </div>
              </div>
              
              <div className="mb-4">
                <h5>Description</h5>
                <p className="card-text">{prestation.description}</p>
              </div>
              
              {getSportDetailsContent()}
            </div>
            
            <div className="col-md-4">
              <div className="card bg-light">
                <div className="card-body">
                  <h5 className="card-title">
                    <FontAwesomeIcon icon={faInfo} className="me-2 text-primary" />
                    Informations
                  </h5>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item bg-light d-flex justify-content-between">
                      <span>ID:</span>
                      <strong>{prestation.id}</strong>
                    </li>
                    <li className="list-group-item bg-light d-flex justify-content-between">
                      <span>Sport ID:</span>
                      <strong>{prestation.sportId}</strong>
                    </li>
                    <li className="list-group-item bg-light d-flex justify-content-between">
                      <span>Date de création:</span>
                      <strong>{new Date(prestation.createdAt).toLocaleDateString()}</strong>
                    </li>
                    <li className="list-group-item bg-light d-flex justify-content-between">
                      <span>Dernière mise à jour:</span>
                      <strong>{new Date(prestation.updatedAt).toLocaleDateString()}</strong>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrestationDetail;