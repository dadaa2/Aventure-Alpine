import axios from 'axios';

const API_URL = 'http://localhost:3002/prestations';

class PrestationController {
  // Récupérer toutes les prestations avec pagination
  static async getPrestations(page = 1, limit = 10, searchTerm = '') {
    try {
      const params = { page, limit };
      if (searchTerm) params.search = searchTerm;
      
      const response = await axios.get(API_URL, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching prestations:', error);
      throw error;
    }
  }

  // Récupérer une prestation par ID
  static async getPrestationById(id) {
    console.log(`Tentative de récupération de la prestation avec ID: ${id}`);
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      console.log('Réponse reçue:', response);
      console.log('Données de la prestation:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la prestation ${id}:`);
      if (error.response) {
        console.error('Données de réponse:', error.response.data);
        console.error('Statut:', error.response.status);
        console.error('Headers:', error.response.headers);
      } else if (error.request) {
        console.error('Requête sans réponse:', error.request);
      } else {
        console.error('Erreur:', error.message);
      }
      console.error('Configuration:', error.config);
      throw error;
    }
  }

  // Créer une nouvelle prestation
  static async createPrestation(prestationData) {
    try {
      const response = await axios.post(API_URL, prestationData);
      return response.data;
    } catch (error) {
      console.error('Error creating prestation:', error);
      throw error;
    }
  }

  // Mettre à jour une prestation
  static async updatePrestation(id, prestationData) {
    try {
      const response = await axios.put(`${API_URL}/${id}`, prestationData);
      return response.data;
    } catch (error) {
      console.error(`Error updating prestation with id ${id}:`, error);
      throw error;
    }
  }

  // Supprimer une prestation
  static async deletePrestation(id) {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting prestation with id ${id}:`, error);
      throw error;
    }
  }

  // Récupérer toutes les catégories
  static async getAllCategories() {
    console.log('Tentative de récupération des catégories');
    try {
      const response = await axios.get('http://localhost:3002/categories');
      console.log('Catégories récupérées:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:');
      if (error.response) {
        console.error('Données de réponse:', error.response.data);
        console.error('Statut:', error.response.status);
      }
      throw error;
    }
  }

  // Récupérer les réservations d'une prestation
  static async getPrestationBookings(prestationId) {
    try {
      const response = await axios.get(`http://localhost:3002/books/prestation/${prestationId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching bookings for prestation ${prestationId}:`, error);
      throw error;
    }
  }

  // Télécharger une image
  static async uploadImage(file) {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await axios.post('http://localhost:3002/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  static async getAllSports() {
    try {
      const response = await axios.get('http://localhost:3002/sports');
      return response.data;
    } catch (error) {
      console.error('Error fetching sports:', error);
      throw error;
    }
  }
}

export default PrestationController;