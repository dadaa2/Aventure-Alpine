import axios from 'axios';

const API_URL = 'http://localhost:3002/bookings';

class BookingController {
  static async getBookings(page = 1, limit = 10, searchTerm = '') {
    try {
      const params = { page, limit };
      if (searchTerm) params.search = searchTerm;

      const response = await axios.get(API_URL, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  }

  static async getBookingById(id) {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching booking details:', error);
      throw error;
    }
  }

  static async createBooking(bookingData) {
    try {
      const response = await axios.post(API_URL, bookingData);
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  static async updateBooking(id, bookingData) {
    try {
      const response = await axios.put(`${API_URL}/${id}`, bookingData);
      return response.data;
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  }

  static async deleteBooking(id) {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  }

  static async addReview(id, reviewData) {
    try {
      const response = await axios.put(`${API_URL}/${id}/review`, reviewData);
      return response.data;
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  }

  static async getUserBookings(userId) {
    try {
      console.log(`Récupération des réservations pour l'utilisateur ID: ${userId}`);
      // Route vers l'API pour obtenir les réservations d'un utilisateur spécifique
      const response = await axios.get(`${API_URL}/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      throw error;
    }
  }

  // Ajouter cette méthode
  static async cancelBooking(id) {
    try {
      const response = await axios.put(`${API_URL}/${id}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  }
}

export default BookingController;