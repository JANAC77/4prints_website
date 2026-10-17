import { apiRequest, setAuthToken } from './client.js';

export const authApi = {
  /**
   * Register new customer
   * @param {{ name: string, email: string, password: string, mobileNo?: number, countryCode?: string }} data
   */
  async register(data) {
    const res = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res?.token) {
      setAuthToken(res.token);
    }
    return res;
  },

  /**
   * Login with email and password
   * @param {{ email: string, password: string }} credentials
   */
  async loginEmail(credentials) {
    const res = await apiRequest('/auth/login/email', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (res?.token) {
      setAuthToken(res.token);
    }
    return res;
  },

  /**
   * Login with Google idToken
   * @param {string} idToken
   */
  async loginGoogle(idToken) {
    const res = await apiRequest('/auth/login/google', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    });
    if (res?.token) {
      setAuthToken(res.token);
    }
    return res;
  },

  /**
   * Request OTP login
   * @param {string} email
   */
  async requestEmailOtp(email) {
    return apiRequest('/auth/login/email/otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  /**
   * Clear local token on logout
   */
  logout() {
    setAuthToken(null);
  },
};
