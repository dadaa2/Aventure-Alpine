import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faSkiing, faHiking, faMountain, faEye } from '@fortawesome/free-solid-svg-icons';
import PrestationsCreate from './PrestationsCreate';

function PrestationsManager() {
  const [prestations, setPrestations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPrestations();
  }, []);

  const fetchPrestations = async () => {
    try {
      const response = await axios.get('http://localhost:3002/prestations');
      setPrestations(response.data);
      setLoading(false);
    } catch (err) {
      setError('Erreur lors du chargement des prestations');
      setLoading(false);
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette prestation ?')) {
      try {
        await axios.delete(`http://localhost:3002/prestations/${id}`);
        fetchPrestations();
      } catch (err) {
        setError('Erreur lors de la suppression de la prestation');
        console.error(err);
      }
    }
  };

  const getSportIcon = (sportName) => {
    switch (sportName.toLowerCase()) {
      case 'ski':
        return <FontAwesomeIcon icon={faSkiing} />;
      case 'randonnée':
        return <FontAwesomeIcon icon={faHiking} />;
      case 'escalade':
        return <FontAwesomeIcon icon={faMountain} />;
      default:
        return null;
    }
  };

  // Fonction pour obtenir un résumé des détails du sport
  const getSportDetailsPreview = (prestation) => {
    if (!prestation.sportDetails) return "Aucun détail";
    
    const sportType = prestation.Sport.name.toLowerCase();
    
    if (sportType === 'ski') {
      return `${prestation.sportDetails.pistColor.charAt(0).toUpperCase() + prestation.sportDetails.pistColor.slice(1)} - ${prestation.sportDetails.snowCondition.split('-')[0].trim()}`;
    } else if (sportType === 'randonnée') {
      return `${prestation.sportDetails.distance} - ${prestation.sportDetails.startPoint}`;
    } else if (sportType === 'escalade') {
      return `${prestation.sportDetails.difficulty} - ${prestation.sportDetails.location}`;
    }
    
    return "Détails disponibles";
  };

  if (loading) return <div className="container mt-5 text-center"><div className="spinner-border text-primary" role="status"></div></div>;
  if (error) return <div className="container mt-5 alert alert-danger">{error}</div>;

  return (
    <div className="container my-5">
      {/* Composant de création de prestation avec callback pour rafraîchir la liste */}
      <PrestationsCreate onPrestationCreated={fetchPrestations} />
      
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">Gestion des prestations</h3>
        </div>
        
        <div className="card-body">
          {prestations.length === 0 ? (
            <div className="alert alert-info">Aucune prestation trouvée</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Nom</th>
                    <th>Sport</th>
                    <th>Détails du sport</th>
                    <th>Prix</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {prestations.map((prestation) => (
                    <tr key={prestation.id}>
                      <td>{prestation.name}</td>
                      <td>
                        <span className="badge bg-primary">
                          {getSportIcon(prestation.Sport.name)} {' '}
                          {prestation.Sport.name}
                        </span>
                      </td>
                      <td>{getSportDetailsPreview(prestation)}</td>
                      <td>{prestation.price.toFixed(2)} €</td>
                      <td>
                        <Link to={`/admin/prestations/${prestation.id}`} className="btn btn-sm btn-outline-info me-1" title="Voir">
                          <FontAwesomeIcon icon={faEye} />
                        </Link>
                        <Link to={`/admin/prestations/edit/${prestation.id}`} className="btn btn-sm btn-outline-primary me-1" title="Modifier">
                          <FontAwesomeIcon icon={faEdit} />
                        </Link>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(prestation.id)}
                          title="Supprimer"
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PrestationsManager;