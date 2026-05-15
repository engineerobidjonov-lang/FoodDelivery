import apiClient from '@/api';

export const orderService = {
  /**
   * Yangi buyurtma yaratish
   * @param {Object} orderData - { items: [{ foodId, quantity }], address: { street, city } }
   */
  async createOrder(orderData) {
    try {
      const response = await apiClient.post('/orders/create', orderData);
      return response.data; // Server qaytargan { _id, status, items, ... }
    } catch (error) {
      throw error.response?.data?.message || 'Buyurtma yaratishda xatolik yuz berdi.';
    }
  },

  /**
   * Foydalanuvchining barcha buyurtmalarini olish
   */
  async getMyOrders() {
    try {
      const response = await apiClient.get('/orders');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Buyurtmalarni yuklashda xatolik yuz berdi.';
    }
  },

  /**
   * ID bo'yicha buyurtmani olish
   */
  async getOrderById(id) {
    try {
      const response = await apiClient.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Buyurtma topilmadi.';
    }
  }
};
