import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faStar, faSnowflake, faPersonHiking, faEye } from '@fortawesome/free-solid-svg-icons';

function PrestationsMain() {
  const [prestations, setPrestations] = useState([]);
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    sportId: '',
    priceMin: '',
    priceMax: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchPrestations = async () => {
      try {
        setLoading(true);
        const params = {
          page: currentPage,
          limit: 9,
          ...filters
        };
        
        // Supprime les filtres vides
        Object.keys(params).forEach(key => {
          if (params[key] === '') delete params[key];
        });
        
        const response = await axios.get('http://localhost:3002/prestations', { params });
        
        setPrestations(response.data.rows || response.data);
        
        if (response.data.count) {
          setTotalCount(response.data.count);
          setTotalPages(Math.ceil(response.data.count / 9));
        } else {
          setTotalCount(response.data.length);
          setTotalPages(1);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des prestations:', err);
        setError('Une erreur est survenue lors du chargement des prestations. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    const fetchSports = async () => {
      try {
        const response = await axios.get('http://localhost:3002/sports');
        setSports(response.data);
      } catch (err) {
        console.error('Erreur lors du chargement des sports:', err);
      }
    };

    fetchPrestations();
    fetchSports();
  }, [currentPage, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitFilters = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Retour à la première page lors de l'application des filtres
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      sportId: '',
      priceMin: '',
      priceMax: ''
    });
    setCurrentPage(1);
  };

  const renderPrestationIcon = (sportName) => {
    if (!sportName) return <FontAwesomeIcon icon={faPersonHiking} />;
    
    const sportNameLower = sportName.toLowerCase();
    if (sportNameLower.includes('ski')) {
      return <FontAwesomeIcon icon={faSnowflake} />;
    } else {
      return <FontAwesomeIcon icon={faPersonHiking} />;
    }
  };

  return (
    <div className="prestations-page py-5">
      <div className="container">
        <div className="row mb-5">
          <div className="col-lg-8 mx-auto text-center">
            <h1 className="display-5 fw-bold mb-4">Nos Prestations</h1>
            <p className="lead mb-0">
              Découvrez notre sélection d'activités pour explorer les montagnes françaises avec des 
              guides expérimentés et passionnés. De la randonnée au ski, trouvez l'aventure qui vous convient.
            </p>
          </div>
        </div>

        {/* Filtres */}
        <div className="row mb-4">
          <div className="col-lg-12">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-3">
                  <FontAwesomeIcon icon={faFilter} className="me-2" /> Filtrer les prestations
                </h5>
                <form onSubmit={handleSubmitFilters}>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <div className="input-group">
                        <span className="input-group-text">
                          <FontAwesomeIcon icon={faSearch} />
                        </span>
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="Rechercher..." 
                          name="search"
                          value={filters.search}
                          onChange={handleFilterChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <select 
                        className="form-select" 
                        name="sportId"
                        value={filters.sportId}
                        onChange={handleFilterChange}
                      >
                        <option value="">Tous les sports</option>
                        {sports.map(sport => (
                          <option key={sport.id} value={sport.id}>
                            {sport.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-2">
                      <input 
                        type="number" 
                        className="form-control" 
                        placeholder="Prix min" 
                        name="priceMin"
                        value={filters.priceMin}
                        onChange={handleFilterChange}
                        min="0"
                      />
                    </div>
                    <div className="col-md-2">
                      <input 
                        type="number" 
                        className="form-control" 
                        placeholder="Prix max" 
                        name="priceMax"
                        value={filters.priceMax}
                        onChange={handleFilterChange}
                        min="0"
                      />
                    </div>
                    <div className="col-md-1 d-flex">
                      <button type="submit" className="btn btn-primary w-100">
                        Filtrer
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 text-end">
                    <button 
                      type="button" 
                      className="btn btn-link btn-sm"
                      onClick={handleResetFilters}
                    >
                      Réinitialiser les filtres
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Résultats */}
        <div className="row mb-4">
          <div className="col-12">
            <p className="mb-0">
              {loading 
                ? 'Chargement des résultats...' 
                : `${totalCount} prestation(s) trouvée(s)`
              }
            </p>
          </div>
        </div>

        {/* Liste des prestations */}
        {error && (
          <div className="alert alert-danger">{error}</div>
        )}

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
          </div>
        ) : prestations.length === 0 ? (
          <div className="alert alert-info">
            Aucune prestation ne correspond à vos critères. Essayez de modifier vos filtres.
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-4">
            {prestations.map(prestation => (
              <div className="col" key={prestation.id}>
                <div className="card h-100 shadow-sm hover-card">
                  <div className="card-img-top bg-light text-center py-4">
                    <div className="display-4">
                      {renderPrestationIcon(prestation.sport?.name)}
                    </div>
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">{prestation.name}</h5>
                    <p className="card-text small text-muted mb-2">
                      {prestation.sport?.name || 'Sport non spécifié'}
                    </p>
                    <p className="card-text">
                      {prestation.description?.length > 100 
                        ? prestation.description.substring(0, 100) + '...' 
                        : prestation.description}
                    </p>
                  </div>
                  <div className="card-footer bg-white border-top-0">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold text-primary">{prestation.price} €</span>
                      <Link to={`/prestations/${prestation.id}`} className="btn btn-outline-primary">
                        <FontAwesomeIcon icon={faEye} className="me-2" />
                        Détails
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <nav aria-label="Navigation des prestations">
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  >
                    Précédent
                  </button>
                </li>
                
                {[...Array(totalPages).keys()].map(i => (
                  <li 
                    key={i} 
                    className={`page-item ${i + 1 === currentPage ? 'active' : ''}`}
                  >
                    <button 
                      className="page-link" 
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
                
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  >
                    Suivant
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}

        {/* Section d'appel à l'action */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="bg-primary text-white rounded-3 p-5 text-center">
              <h3 className="fw-bold mb-3">Envie de vivre une expérience unique ?</h3>
              <p className="lead mb-4">
                Nos guides expérimentés sont prêts à vous faire découvrir les merveilles de la montagne.
                Réservez dès maintenant pour garantir votre place !
              </p>
              <Link to="/register" className="btn btn-light btn-lg">
                S'inscrire pour réserver
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrestationsMain;