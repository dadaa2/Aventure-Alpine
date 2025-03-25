import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faArrowLeft, faSkiing, faHiking, faMountain } from '@fortawesome/free-solid-svg-icons';
import SportDetails from '../../components/SportDetails';

function AdminPrestationDetail() {
  const [prestation, setPrestation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

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

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette prestation ?')) {
      try {
        await axios.delete(`http://localhost:3002/prestations/${id}`);
        navigate('/admin/prestations');
      } catch (err) {
        setError('Erreur lors de la suppression de la prestation');
        console.error(err);
      }
    }
  };

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
      <div className="card shadow">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h3 className="mb-0">Détails de la prestation</h3>
          <div>
            <Link to={`/admin/prestations/edit/${id}`} className="btn btn-sm btn-light me-2">
              <FontAwesomeIcon icon={faEdit} className="me-1" /> Modifier
            </Link>
            <button className="btn btn-sm btn-danger" onClick={handleDelete}>
              <FontAwesomeIcon icon={faTrashAlt} className="me-1" /> Supprimer
            </button>
          </div>
        </div>
        
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
                        <th scope="row">ID</th>
                        <td>{prestation.id}</td>
                      </tr>
                      <tr>
                        <th scope="row">Prix</th>
                        <td className="text-success fw-bold">{prestation.price.toFixed(2)} €</td>
                      </tr>
                      <tr>
                        <th scope="row">Sport</th>
                        <td>{prestation.Sport.name}</td>
                      </tr>
                      <tr>
                        <th scope="row">Date de création</th>
                        <td>{new Date(prestation.createdAt).toLocaleDateString()}</td>
                      </tr>
                      <tr>
                        <th scope="row">Dernière modification</th>
                        <td>{new Date(prestation.updatedAt).toLocaleDateString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          
          {/* Affichage des détails spécifiques au sport */}
          {prestation.sportDetails && (
            <div className="mb-4">
              <h4>Caractéristiques du sport</h4>
              <SportDetails 
                sportType={prestation.Sport.name} 
                details={prestation.sportDetails} 
              />
            </div>
          )}
          
          <div className="mt-4">
            <Link to="/admin/prestations" className="btn btn-outline-secondary">
              <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
              Retour à la liste
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPrestationDetail;