import React from 'react';
import { Link } from 'react-router-dom';

const PrestationDetailQuestion = () => {
  return (
    <div className="card bg-light">
      <div className="card-body text-center">
        <h5 className="card-title">Des questions?</h5>
        <p className="card-text">Notre équipe est disponible pour répondre à toutes vos questions.</p>
        <Link to="/contact" className="btn btn-outline-secondary">Nous contacter</Link>
      </div>
    </div>
  );
};

export default PrestationDetailQuestion;