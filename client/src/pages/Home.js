import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMountain, faHiking, faSkiing, faSnowflake, faCalendarAlt, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

function Home() {
  const [featuredPrestations, setFeaturedPrestations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const fetchFeaturedPrestations = async () => {
      try {
        // Récupération des prestations mises en avant (les 3 premières par exemple)
        const response = await axios.get('http://localhost:3002/prestations', {
          params: {
            limit: 3
          }
        });
        setFeaturedPrestations(response.data.slice(0, 3));
      } catch (error) {
        console.error('Erreur lors du chargement des prestations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedPrestations();
  }, []);

  // Témoignages pour le carrousel
  const testimonials = [
    {
      id: 1,
      name: "Marie Dupont",
      role: "Randonneuse",
      text: "Notre randonnée avec Aventure Alpine était tout simplement incroyable. Le guide était très professionnel et nous a fait découvrir des paysages à couper le souffle.",
      image: "https://via.placeholder.com/80"
    },
    {
      id: 2,
      name: "Pierre Martin",
      role: "Alpiniste débutant",
      text: "Ma première expérience d'alpinisme et certainement pas la dernière ! Équipe passionnée et très attentive à la sécurité. Je recommande vivement.",
      image: "https://via.placeholder.com/80"
    }
  ];

  // Navigation du carrousel de témoignages
  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  return (
    <div className="home-page">
      {/* Section Hero avec image de montagne */}
      <section className="hero bg-dark text-white text-center py-5">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h1 className="display-3 fw-bold mb-4">Aventure Alpine</h1>
              <p className="lead mb-4">
                Découvrez les montagnes françaises avec nos activités guidées par des experts passionnés.
                Randonnée, ski, alpinisme et bien plus pour tous les niveaux.
              </p>
              <div className="mt-5">
                <Link to="/prestations" className="btn btn-primary btn-lg me-3">
                  Découvrir nos activités
                </Link>
                <Link to="/register" className="btn btn-outline-light btn-lg">
                  S'inscrire
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="wave-bottom">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path 
              fill="#ffffff" 
              fillOpacity="1" 
              d="M0,96L48,112C96,128,192,160,288,154.7C384,149,480,107,576,112C672,117,768,171,864,186.7C960,203,1056,181,1152,154.7C1248,128,1344,96,1392,80L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Section Nos activités */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5">Nos Activités en Montagne</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="icon-box mb-4">
                    <FontAwesomeIcon icon={faHiking} className="display-4 text-primary" />
                  </div>
                  <h3 className="h4 mb-3">Randonnée</h3>
                  <p className="card-text">
                    Découvrez des sentiers magnifiques adaptés à tous les niveaux, guidés par nos experts.
                  </p>
                  <Link to="/prestations" className="btn btn-outline-primary mt-3">
                    Voir les randonnées
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="icon-box mb-4">
                    <FontAwesomeIcon icon={faSkiing} className="display-4 text-primary" />
                  </div>
                  <h3 className="h4 mb-3">Ski & Snowboard</h3>
                  <p className="card-text">
                    Des pistes pour tous les niveaux avec des moniteurs qualifiés et passionnés.
                  </p>
                  <Link to="/prestations" className="btn btn-outline-primary mt-3">
                    Explorer les activités
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="icon-box mb-4">
                    <FontAwesomeIcon icon={faMountain} className="display-4 text-primary" />
                  </div>
                  <h3 className="h4 mb-3">Alpinisme</h3>
                  <p className="card-text">
                    Conquérez les sommets avec nos guides alpins expérimentés dans un cadre sécurisé.
                  </p>
                  <Link to="/prestations" className="btn btn-outline-primary mt-3">
                    Voir les expéditions
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Prestations en vedette */}
      <section className="bg-light py-5">
        <div className="container">
          <h2 className="text-center mb-5">Nos Prestations en Vedette</h2>
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {featuredPrestations.map(prestation => (
                <div className="col-md-4" key={prestation.id}>
                  <div className="card h-100 shadow-sm">
                    <div className="card-image-wrapper bg-secondary" style={{height: '200px'}}>
                      {/* Placeholder pour une image - dans une vraie application, vous auriez une vraie image */}
                      <div className="d-flex align-items-center justify-content-center h-100 text-white">
                        <FontAwesomeIcon icon={faSnowflake} size="3x" />
                      </div>
                    </div>
                    <div className="card-body">
                      <h3 className="h5 card-title">{prestation.name}</h3>
                      <p className="card-text">
                        {prestation.description?.length > 100 
                          ? prestation.description.substring(0, 100) + '...' 
                          : prestation.description}
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-bold text-primary">{prestation.price} €</span>
                        <Link to={`/prestations/${prestation.id}`} className="btn btn-sm btn-outline-primary">
                          Détails
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-5">
            <Link to="/prestations" className="btn btn-primary btn-lg">
              Voir toutes nos prestations
            </Link>
          </div>
        </div>
      </section>

      {/* Section Témoignages - Utilise un carrousel Bootstrap standard au lieu de React-Bootstrap */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5">Ce que disent nos clients</h2>
          
          <div className="testimonial-carousel position-relative">
            <div className="testimonial-items">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={testimonial.id}
                  className={`testimonial-item text-center p-4 ${index === activeTestimonial ? 'd-block' : 'd-none'}`}
                >
                  <div className="testimonial-img mb-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="rounded-circle shadow-sm"
                      width="80"
                      height="80"
                    />
                  </div>
                  <p className="mb-4">"{testimonial.text}"</p>
                  <h5 className="mb-1">{testimonial.name}</h5>
                  <p className="text-muted">{testimonial.role}</p>
                </div>
              ))}
            </div>
            
            {/* Contrôles du carrousel */}
            <div className="d-flex justify-content-center mt-4">
              <button 
                className="btn btn-sm btn-outline-primary me-2" 
                onClick={prevTestimonial}
                aria-label="Témoignage précédent"
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              {testimonials.map((_, index) => (
                <button 
                  key={index}
                  className={`btn btn-sm ${index === activeTestimonial ? 'btn-primary' : 'btn-outline-primary'} mx-1`}
                  onClick={() => setActiveTestimonial(index)}
                  aria-label={`Témoignage ${index + 1}`}
                >
                  {index + 1}
                </button>
              ))}
              <button 
                className="btn btn-sm btn-outline-primary ms-2" 
                onClick={nextTestimonial}
                aria-label="Témoignage suivant"
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section CTA (Call to Action) */}
      <section className="bg-primary text-white py-5">
        <div className="container text-center py-4">
          <h2 className="mb-4">Prêt à vivre l'aventure ?</h2>
          <p className="lead mb-4">
            Rejoignez-nous pour une expérience inoubliable au cœur des montagnes françaises.
          </p>
          <Link to="/register" className="btn btn-light btn-lg me-3">
            Créer un compte
          </Link>
          <Link to="/prestations" className="btn btn-outline-light btn-lg">
            <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
            Réserver une activité
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;