import axios from 'axios';

const API_URL = 'http://localhost:3002/prestations';

class PrestationController {
  // Récupérer toutes les prestations
  static async getAllPrestations() {
    try {
      const response = await axios.get(API_URL);
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

  // Récupérer tous les sports
  static async getAllSports() {
    try {
      const response = await axios.get(`${API_URL}/sports/all`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sports:', error);
      throw error;
    }
  }
}

export default PrestationController;