import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PrestationForm from '../../components/form/PrestationForm';

function PrestationCreate() {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      const response = await axios.post('http://localhost:3002/prestations', formData);
      navigate(`/admin/prestations/${response.data.id}`);
    } catch (error) {
      console.error("Erreur lors de la création de la prestation:", error);
      alert("Une erreur est survenue lors de la création de la prestation.");
    }
  };

  return (
    <div className="container my-5">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">Nouvelle prestation</h3>
        </div>
        <div className="card-body">
          <PrestationForm 
            onSubmit={handleSubmit} 
            submitButtonText="Créer la prestation" 
          />
        </div>
      </div>
    </div>
  );
}

export default PrestationCreate;