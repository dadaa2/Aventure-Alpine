import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import PrestationController from '../../../controllers/PrestationController';
import PrestationDetailsView from '../../../components/prestation/PrestationDetailsView';

function AdminPrestationDetail() {
  const [prestation, setPrestation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrestation = async () => {
      try {
        const data = await PrestationController.getPrestationById(id);
        setPrestation(data);
        setLoading(false);
      } catch (err) {
        setError('Impossible de charger les détails de la prestation.');
        setLoading(false);
      }
    };

    fetchPrestation();
  }, [id]);

  const handleEdit = () => {
    navigate(`/admin/prestations/edit/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette prestation ?')) {
      try {
        await PrestationController.deletePrestation(id);
        navigate('/admin/prestations');
      } catch (err) {
        setError('Erreur lors de la suppression de la prestation');
      }
    }
  };

  if (loading) return <div className="container mt-5"><div className="spinner-border text-primary" role="status"></div></div>;
  if (error) return <div className="container mt-5 alert alert-danger">{error}</div>;
  if (!prestation) return <div className="container mt-5 alert alert-warning">Prestation non trouvée</div>;

  return (
    <div className="container my-5">
      <PrestationDetailsView
        prestation={prestation}
        isAdmin={true}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      
      <div className="mt-4">
        <Link to="/admin/prestations" className="btn btn-outline-secondary">
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
          Retour à la liste
        </Link>
      </div>
    </div>
  );
}

export default AdminPrestationDetail;