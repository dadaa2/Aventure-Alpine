import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PrestationsCreate from './PrestationsCreate';
import PrestationForm from '../form/PrestationForm';

function PrestationsManager() {
  const [listOfPrestations, setListOfPrestations] = useState([]);
  const [editingPrestation, setEditingPrestation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshData, setRefreshData] = useState(0);

  useEffect(() => {
    fetchPrestations();
    // Ne rafraîchit que lorsque refreshData change
  }, [refreshData])

  // Fonction pour récupérer les prestations depuis l'API
  const fetchPrestations = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3002/prestations');
      setListOfPrestations(response.data.rows);
      setError(null);
    } catch (error) {
      console.error('Erreur lors du chargement des prestations:', error);
      setError('Impossible de charger les prestations. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour supprimer une prestation
  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette prestation ?')) {
      try {
        await axios.delete(`http://localhost:3002/prestations/${id}`);
        setRefreshData(prev => prev + 1);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Une erreur est survenue lors de la suppression de la prestation.');
      }
    }
  };

  // Fonction pour modifier une prestation
  const handleEdit = (prestation) => {
    setEditingPrestation(prestation);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  // Fonction pour mettre à jour une prestation
  const handleUpdate = async (updatedPrestation) => {
    try {
      await axios.put(`http://localhost:3002/prestations/${updatedPrestation.id}`, updatedPrestation);
      setEditingPrestation(null);
      setRefreshData(prev => prev + 1); // Rafraîchir la liste
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert('Une erreur est survenue lors de la mise à jour de la prestation.');
    }
  };

  const handlePrestationCreated = () => {
    setRefreshData(prev => prev + 1);
  };
  // Fonction pour formater le prix en euros
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
  };

  if (loading) return <div className="text-center my-5"><div className="spinner-border" role="status"></div></div>;
  if (error) return <div className="alert alert-danger my-3">{error}</div>;

  return (
    <div className="container my-5">
      <h2 className="mb-4">Gestion des Prestations</h2>
      
      {/* Création de prestations */}
      <PrestationsCreate onPrestationCreated={handlePrestationCreated} />

      {/* Affichage des prestations */}
      {listOfPrestations.length === 0 ? (
        <div className="alert alert-info">Aucune prestation trouvée.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped table-hover">
            <thead className="table-dark">
              <tr className="text-center">
                <th>Nom</th>
                <th>Prix</th>
                <th>Sport</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {listOfPrestations.map((prestation) => (
                <tr key={prestation.id}>
                  <td className="text-start align-middle">{prestation.name}</td>
                  <td className="text-end align-middle">{formatPrice(prestation.price)}</td>
                  <td className="text-center align-middle">{prestation.sport?.name || 'N/A'}</td>
                  <td className="text-start align-middle">
                    {prestation.description.length > 100 
                      ? `${prestation.description.substring(0, 100)}...` 
                      : prestation.description}
                  </td>
                  <td className="text-center align-middle">
                    <button
                      className="btn btn-warning btn-sm mx-1"
                      onClick={() => handleEdit(prestation)}
                    >
                      Modifier
                    </button>
                    <button
                      className="btn btn-danger btn-sm mx-1"
                      onClick={() => handleDelete(prestation.id)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Formulaire de modification */}
      {editingPrestation && (
        <div className="mt-4 p-3 border rounded bg-light">
          <h3>Modifier la prestation</h3>
          <PrestationForm 
            initialValues={editingPrestation}
            onSubmit={handleUpdate}
            submitButtonText="Enregistrer les modifications" 
          />
          <button
            className="btn btn-secondary mt-2"
            onClick={() => setEditingPrestation(null)}
          >
            Annuler
          </button>
        </div>
      )}
    </div>
  );
}

export default PrestationsManager;