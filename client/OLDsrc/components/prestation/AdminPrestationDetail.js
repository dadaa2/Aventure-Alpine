import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSkiing, faHiking, faMountain, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import SportDetails from '../SportDetails';

function PrestationDetailsView({ 
  prestation, 
  isAdmin = false,
  onEdit,
  onDelete 
}) {
  const getSportIcon = (sportName) => {
    switch (sportName.toLowerCase()) {
      case 'ski': return <FontAwesomeIcon icon={faSkiing} className="me-2" />;
      case 'randonnée': return <FontAwesomeIcon icon={faHiking} className="me-2" />;
      case 'escalade': return <FontAwesomeIcon icon={faMountain} className="me-2" />;
      default: return null;
    }
  };

  return (
    <div className="card shadow">
      {isAdmin && (
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h3 className="mb-0">Détails de la prestation</h3>
          {onEdit && onDelete && (
            <div>
              <button className="btn btn-sm btn-light me-2" onClick={onEdit}>
                <FontAwesomeIcon icon={faEdit} className="me-1" /> Modifier
              </button>
              <button className="btn btn-sm btn-danger" onClick={onDelete}>
                <FontAwesomeIcon icon={faTrashAlt} className="me-1" /> Supprimer
              </button>
            </div>
          )}
        </div>
      )}
      
      <div className="card-body">
        <div className="row mb-4">
          <div className="col-md-6">
            <h2>{prestation.name}</h2>
            <span className="badge bg-primary fs-5 mb-3">
              {getSportIcon(prestation.Sport.name)}
              {prestation.Sport.name}
            </span>
            <p className="lead">{prestation.description}</p>
          </div>
          
          <div className="col-md-6">
            <div className="card h-100">
              <div className="card-body">
                <h4 className="card-title">Informations</h4>
                <table className="table">
                  <tbody>
                    <tr>
                      <th scope="row">Prix</th>
                      <td className="text-success fw-bold">{prestation.price.toFixed(2)} €</td>
                    </tr>
                    <tr>
                      <th scope="row">Sport</th>
                      <td>{prestation.Sport.name}</td>
                    </tr>
                    {isAdmin && (
                      <>
                        <tr>
                          <th scope="row">ID</th>
                          <td>{prestation.id}</td>
                        </tr>
                        <tr>
                          <th scope="row">Date de création</th>
                          <td>{new Date(prestation.createdAt).toLocaleDateString()}</td>
                        </tr>
                        <tr>
                          <th scope="row">Dernière modification</th>
                          <td>{new Date(prestation.updatedAt).toLocaleDateString()}</td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        {/* Affichage des détails spécifiques au sport */}
        {prestation.sportDetails && (
          <div className="mb-4">
            {isAdmin && <h4>Caractéristiques du sport</h4>}
            <SportDetails 
              sportType={prestation.Sport.name} 
              details={prestation.sportDetails} 
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default PrestationDetailsView;