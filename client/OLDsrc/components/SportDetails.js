import React from 'react';

const SportDetails = ({ sportType, details }) => {
  if (!details) return null;

  const renderSkiDetails = () => (
    <div className="sport-details ski-details mt-3">
      <h5 className="mb-3">Détails de la piste</h5>
      <div className="table-responsive">
        <table className="table table-bordered">
          <tbody>
            <tr>
              <th scope="row">État de la neige</th>
              <td>{details.snowCondition}</td>
            </tr>
            <tr>
              <th scope="row">Remontées mécaniques</th>
              <td>{details.skiLift}</td>
            </tr>
            <tr>
              <th scope="row">Niveau de la piste</th>
              <td>
                <span className={`badge ${
                  details.pistColor === 'verte' ? 'bg-success' :
                  details.pistColor === 'bleue' ? 'bg-primary' :
                  details.pistColor === 'rouge' ? 'bg-danger' :
                  details.pistColor === 'noire' ? 'bg-dark' : 'bg-secondary'
                }`}>
                  {details.pistColor.charAt(0).toUpperCase() + details.pistColor.slice(1)}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderRandonneeDetails = () => (
    <div className="sport-details hike-details mt-3">
      <h5 className="mb-3">Détails du parcours</h5>
      <div className="table-responsive">
        <table className="table table-bordered">
          <tbody>
            {details.regionName && (
              <tr>
                <th scope="row">Région</th>
                <td>{details.regionName}</td>
              </tr>
            )}
            <tr>
              <th scope="row">Départ</th>
              <td>{details.startPoint}</td>
            </tr>
            <tr>
              <th scope="row">Arrivée</th>
              <td>{details.endPoint}</td>
            </tr>
            <tr>
              <th scope="row">Distance</th>
              <td>{details.distance}</td>
            </tr>
            {details.praticable && (
              <tr>
                <th scope="row">Praticable</th>
                <td>{details.praticable}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderEscaladeDetails = () => (
    <div className="sport-details climbing-details mt-3">
      <h5 className="mb-3">Caractéristiques de la voie</h5>
      <div className="table-responsive">
        <table className="table table-bordered">
          <tbody>
            <tr>
              <th scope="row">Difficulté</th>
              <td>{details.difficulty}</td>
            </tr>
            <tr>
              <th scope="row">Temps d'ascension</th>
              <td>{details.ascentionTime}</td>
            </tr>
            <tr>
              <th scope="row">Lieu</th>
              <td>{details.location}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  switch (sportType.toLowerCase()) {
    case 'ski':
      return renderSkiDetails();
    case 'randonnée':
      return renderRandonneeDetails();
    case 'escalade':
      return renderEscaladeDetails();
    default:
      return null;
  }
};

export default SportDetails;