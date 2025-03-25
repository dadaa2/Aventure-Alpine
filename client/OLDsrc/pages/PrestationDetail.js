import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSkiing, faHiking, faMountain } from '@fortawesome/free-solid-svg-icons';
import SportDetails from '../components/SportDetails';

function PrestationDetail() {
  const [prestation, setPrestation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchPrestation = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/prestations/${id}`);
        setPrestation(response.data);
        setLoading(false);
      } catch (err) {
        setError('Impossible de charger les détails de la prestation.');
        setLoading(false);
        console.error(err);
      }
    };

    fetchPrestation();
  }, [id]);

  const getSportIcon = (sportName) => {
    switch (sportName.toLowerCase()) {
      case 'ski':
        return <FontAwesomeIcon icon={faSkiing} className="me-2" />;
      case 'randonnée':
        return <FontAwesomeIcon icon={faHiking} className="me-2" />;
      case 'escalade':
        return <FontAwesomeIcon icon={faMountain} className="me-2" />;
      default:
        return null;
    }
  };

  if (loading) return <div className="container mt-5"><div className="spinner-border text-primary" role="status"></div></div>;
  if (error) return <div className="container mt-5 alert alert-danger">{error}</div>;
  if (!prestation) return <div className="container mt-5 alert alert-warning">Prestation non trouvée</div>;

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">{prestation.name}</h2>
              
              <div className="d-flex justify-content-between align-items-center mb-4">
                <span className="badge bg-primary fs-5">
                  {getSportIcon(prestation.Sport.name)}
                  {prestation.Sport.name}
                </span>
                <h3 className="text-success mb-0">{prestation.price.toFixed(2)} €</h3>
              </div>
              
              <div className="card-text mb-4">
                <p className="lead">{prestation.description}</p>
              </div>
              
              {/* Affichage des détails spécifiques au sport */}
              {prestation.sportDetails && (
                <SportDetails 
                  sportType={prestation.Sport.name} 
                  details={prestation.sportDetails} 
                />
              )}
              
              <div className="text-center mt-4">
                <Link to="/prestations" className="btn btn-outline-secondary me-2">
                  Retour aux prestations
                </Link>
                <button className="btn btn-primary">
                  Réserver maintenant
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrestationDetail;