import React from 'react';
import axios from 'axios';
import PrestationForm from '../../components/form/PrestationForm';

function PrestationsCreate({ onPrestationCreated }) {
  const handleSubmit = async (formData) => {
    try {
      const response = await axios.post('http://localhost:3002/prestations', formData);
      console.log("Prestation créée avec succès:", response.data);
      
      // Si une fonction de callback est fournie, l'appeler pour rafraîchir la liste
      if (onPrestationCreated && typeof onPrestationCreated === 'function') {
        onPrestationCreated();
      }
      
      // Réinitialiser le formulaire en fermant l'accordéon
      const accordionButton = document.querySelector('#accordionPrestationCreate .accordion-button');
      if (accordionButton && !accordionButton.classList.contains('collapsed')) {
        accordionButton.click();
      }
    } catch (error) {
      console.error("Erreur lors de la création de la prestation:", error);
      alert("Une erreur est survenue lors de la création de la prestation.");
    }
  };

  return (
    <div className="mb-4">
      <div className="accordion" id="accordionPrestationCreate">
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button 
              className="accordion-button collapsed" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#collapsePrestationCreate" 
              aria-expanded="false" 
              aria-controls="collapsePrestationCreate"
            >
              Créer une nouvelle prestation
            </button>
          </h2>
          <div 
            id="collapsePrestationCreate" 
            className="accordion-collapse collapse" 
            data-bs-parent="#accordionPrestationCreate"
          >
            <div className="accordion-body">
              <PrestationForm 
                onSubmit={handleSubmit} 
                submitButtonText="Créer la prestation" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrestationsCreate;