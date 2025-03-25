import axios from 'axios';

const API_URL = 'http://localhost:3002/users';

class UserController {
  // Récupérer toutes les users
  static async getAllUsers() {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  // Récupérer une user par ID
  static async getuserById(id) {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user with id ${id}:`, error);
      throw error;
    }
  }

  // Créer une nouvelle user
  static async createUser(userData) {
    try {
      const response = await axios.post(API_URL, userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Mettre à jour une user
  static async updateUser(id, userData) {
    try {
      const response = await axios.put(`${API_URL}/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error(`Error updating user with id ${id}:`, error);
      throw error;
    }
  }

  // Supprimer une user
  static async deleteUser(id) {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting user with id ${id}:`, error);
      throw error;
    }
  }

  // Remplacer pour les rôle de l'utilisateur
  static async getAllRoles() {
    try {
      const response = await axios.get(`${API_URL}/roles/all`);
      return response.data;
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  }
}

export default UserController;