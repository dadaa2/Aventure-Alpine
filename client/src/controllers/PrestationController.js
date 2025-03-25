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
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching prestation with id ${id}:`, error);
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
    try {
      const response = await axios.get('http://localhost:3002/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
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
}

export default PrestationController;