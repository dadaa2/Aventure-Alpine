import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PrestationsMain() {
  const [prestations, setPrestations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSport, setSelectedSport] = useState('all');
  const [sports, setSports] = useState([]);

  useEffect(() => {
    const fetchPrestations = async () => {
      try {
        const response = await axios.get('http://localhost:3002/prestations');
        setPrestations(response.data.rows);
        
        // Extraire les sports uniques des prestations
        const uniqueSports = [...new Set(response.data.rows
          .map(prestation => prestation.sport?.name)
          .filter(sport => sport))];
        
        setSports(uniqueSports);
      } catch (error) {
        console.error('Erreur lors du chargement des prestations:', error);
        setError('Impossible de charger les prestations. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchPrestations();
  }, []);

  const filteredPrestations = selectedSport === 'all' 
    ? prestations 
    : prestations.filter(prestation => prestation.sport?.name === selectedSport);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
  };

  if (loading) return (
    <div className="container my-5 text-center">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Chargement...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="container my-5">
      <div className="alert alert-danger">{error}</div>
    </div>
  );

  return (
    <div className="container my-5">
      <h1 className="mb-4 text-center">Nos Prestations</h1>
      
      <div className="mb-4">
        <p className="lead text-center">
          Découvrez notre sélection d'activités en montagne, encadrées par des professionnels passionnés.
        </p>
      </div>
      
      {/* Filtres */}
      <div className="mb-4">
        <div className="d-flex justify-content-center">
          <div className="btn-group" role="group">
            <button 
              type="button" 
              className={`btn ${selectedSport === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setSelectedSport('all')}
            >
              Toutes les activités
            </button>
            {sports.map(sport => (
              <button 
                key={sport} 
                type="button" 
                className={`btn ${selectedSport === sport ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setSelectedSport(sport)}
              >
                {sport}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Affichage des prestations */}
      {filteredPrestations.length === 0 ? (
        <div className="alert alert-info text-center">Aucune prestation disponible pour le moment.</div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {filteredPrestations.map((prestation) => (
            <div className="col" key={prestation.id}>
              <div className="card h-100 shadow-sm">
                <div className="card-header bg-transparent">
                  <span className="badge bg-info float-end">{prestation.sport?.name}</span>
                  <h5 className="card-title mb-0">{prestation.name}</h5>
                </div>
                <div className="card-body">
                  <p className="card-text">{prestation.description}</p>
                </div>
                <div className="card-footer bg-transparent d-flex justify-content-between align-items-center">
                  <span className="fs-5 fw-bold text-primary">{formatPrice(prestation.price)}</span>
                  <button className="btn btn-outline-primary">
                    Réserver
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PrestationsMain;