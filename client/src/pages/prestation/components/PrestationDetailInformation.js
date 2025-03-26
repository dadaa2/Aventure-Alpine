import React from 'react';

const PrestationDetailInformation = () => {
  return (
    <div className="card mb-4">
      <div className="card-header bg-light">
        <h4 className="mb-0">Informations</h4>
      </div>
      <div className="card-body">
        <ul className="list-group list-group-flush">
          <li className="list-group-item d-flex justify-content-between">
            <span>Guide inclus</span>
            <span className="text-success fw-bold">✓</span>
          </li>
          <li className="list-group-item d-flex justify-content-between">
            <span>Équipement fourni</span>
            <span className="text-success fw-bold">✓</span>
          </li>
          <li className="list-group-item d-flex justify-content-between">
            <span>Assurance</span>
            <span className="text-success fw-bold">✓</span>
          </li>
          <li className="list-group-item d-flex justify-content-between">
            <span>Préparation physique</span>
            <span>Recommandée</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PrestationDetailInformation;