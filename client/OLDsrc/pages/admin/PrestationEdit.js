import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PrestationForm from '../../components/form/PrestationForm';

function PrestationEdit() {
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

  const handleSubmit = async (formData) => {
    try {
      await axios.put(`http://localhost:3002/prestations/${id}`, formData);
      navigate(`/admin/prestations/${id}`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la prestation:", error);
      alert("Une erreur est survenue lors de la mise à jour de la prestation.");
    }
  };

  if (loading) return <div className="container mt-5 text-center"><div className="spinner-border text-primary" role="status"></div></div>;
  if (error) return <div className="container mt-5 alert alert-danger">{error}</div>;
  if (!prestation) return <div className="container mt-5 alert alert-warning">Prestation non trouvée</div>;

  // Formatage des données pour le formulaire
  const initialValues = {
    ...prestation,
    // Ajout des détails spécifiques au sport
    ski: prestation.sportDetails && prestation.Sport.name.toLowerCase() === 'ski' ? prestation.sportDetails : {},
    randonnee: prestation.sportDetails && prestation.Sport.name.toLowerCase() === 'randonnée' ? prestation.sportDetails : {},
    escalade: prestation.sportDetails && prestation.Sport.name.toLowerCase() === 'escalade' ? prestation.sportDetails : {}
  };

  return (
    <div className="container my-5">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">Modification de la prestation</h3>
        </div>
        <div className="card-body">
          <PrestationForm 
            initialValues={initialValues} 
            onSubmit={handleSubmit} 
            submitButtonText="Enregistrer les modifications" 
          />
        </div>
      </div>
    </div>
  );
}

export default PrestationEdit;