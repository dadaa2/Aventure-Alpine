import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSnowflake, faMountainSun, faChevronRight,
  faRulerHorizontal, faCalendarAlt, faMapMarkerAlt, faMountain
} from '@fortawesome/free-solid-svg-icons';

const PrestationDetailSport = ({ prestation }) => {
  if (!prestation?.sport || !prestation.sportDetails) return null;
  
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

export default PrestationDetailSport;