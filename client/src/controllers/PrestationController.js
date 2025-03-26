import axios from 'axios';

const BASE_URL = 'http://localhost:3002';
const API_URL = `${BASE_URL}/prestations`;
const CATEGORIES_URL = `${BASE_URL}/categories`;
const SPORTS_URL = `${BASE_URL}/sports`;

class PrestationController {
  // Méthode modifiée pour supporter tous les filtres
  static async getPrestations(page = 1, limit = 10, searchTerm = '', additionalParams = {}) {
    try {
      const params = { 
        page, 
        limit,
        ...additionalParams
      };
      
      if (searchTerm) params.search = searchTerm;
      
      console.log('PrestationController - Requête au serveur avec paramètres:', params);
      console.log('PrestationController - URL complète:', `${API_URL}?` + new URLSearchParams(params).toString());
      
      const response = await axios.get(API_URL, { 
        params,
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });
      
      console.log('PrestationController - Réponse reçue:', {
        status: response.status,
        dataType: typeof response.data,
        hasRows: !!response.data.rows,
        rowsLength: response.data.rows ? response.data.rows.length : 0,
        count: response.data.count || 0
      });
      
      return response.data;
    } catch (error) {
      console.error('PrestationController - Erreur détaillée:');
      if (error.response) {
        // La requête a été effectuée et le serveur a répondu avec un code d'état
        console.error('Réponse d\'erreur:', {
          data: error.response.data,
          status: error.response.status,
          headers: error.response.headers,
        });
      } else if (error.request) {
        // La requête a été effectuée mais aucune réponse n'a été reçue
        console.error('Requête sans réponse:', error.request);
      } else {
        // Une erreur s'est produite lors de la configuration de la requête
        console.error('Erreur de requête:', error.message);
      }
      
      // Re-throw pour permettre au composant de gérer l'erreur
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
      const response = await axios.get(CATEGORIES_URL);
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

  /* // Pas d'image encore
  // Télécharger une image
  static async uploadImage(file) {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await axios.post(UPLOAD_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  } */

  static async getAllSports() {
    try {
      const response = await axios.get(SPORTS_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching sports:', error);
      throw error;
    }
  }
}

export default PrestationController;