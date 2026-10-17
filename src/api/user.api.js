import { apiRequest } from './client.js';

export const userApi = {
  /**
   * Get logged-in user profile from backend
   */
  async getProfile() {
    const res = await apiRequest('/user/profile');
    return res?.customer || null;
  },

  /**
   * Update profile (name, profileUrl) in backend
   */
  async updateProfile(data) {
    const res = await apiRequest('/user/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return res?.customer;
  },

  /**
   * Add new shipping address in backend
   */
  async addAddress(addressData) {
    const res = await apiRequest('/user/profile/address', {
      method: 'POST',
      body: JSON.stringify(addressData),
    });
    return res?.customer;
  },

  /**
   * Update existing shipping address in backend
   */
  async updateAddress(addressData) {
    const res = await apiRequest('/user/profile/address', {
      method: 'PATCH',
      body: JSON.stringify(addressData),
    });
    return res?.customer;
  },

  /**
   * Delete address in backend
   */
  async deleteAddress(addressId) {
    const res = await apiRequest('/user/profile/address', {
      method: 'DELETE',
      body: JSON.stringify({ addressId }),
    });
    return res?.customer;
  },
};
