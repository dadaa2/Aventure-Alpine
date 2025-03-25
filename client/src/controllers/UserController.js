import axios from 'axios';

const API_URL = 'http://localhost:3002/users';

class UserController {
  // Récupérer tous les utilisateurs avec pagination
  static async getUsers(page = 1, limit = 10, searchTerm = '') {
    try {
      const params = { page, limit };
      if (searchTerm) params.search = searchTerm;
      
      const response = await axios.get(API_URL, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  // Récupérer un utilisateur par ID
  static async getUserById(id) {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user with id ${id}:`, error);
      throw error;
    }
  }

  // Créer un nouvel utilisateur
  static async createUser(userData) {
    try {
      const response = await axios.post(`${API_URL}/create`, userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Mettre à jour un utilisateur
  static async updateUser(id, userData) {
    try {
      const response = await axios.put(`${API_URL}/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error(`Error updating user with id ${id}:`, error);
      throw error;
    }
  }

  // Supprimer un utilisateur
  static async deleteUser(id) {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting user with id ${id}:`, error);
      throw error;
    }
  }

  // Récupérer les réservations d'un utilisateur
  static async getUserBookings(userId) {
    try {
      const response = await axios.get(`http://localhost:3002/books/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching bookings for user ${userId}:`, error);
      throw error;
    }
  }

  // Récupérer tous les rôles
  static async getAllRoles() {
    try {
      const response = await axios.get('http://localhost:3002/roles');
      return response.data;
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  }
}

export default UserController;