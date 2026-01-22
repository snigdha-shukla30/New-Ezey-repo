/**
 * Token Manager - Handles JWT token storage, retrieval, and validation
 * Location: src/utils/tokenManager.js
 */

const TOKEN_KEY = 'ezey_auth_token';
const REFRESH_TOKEN_KEY = 'ezey_refresh_token';
const TOKEN_EXPIRY_KEY = 'ezey_token_expiry';
const USER_KEY = 'ezey_user';

export const tokenManager = {
  /**
   * Save authentication token to localStorage
   * @param {string} token - JWT access token
   * @param {string} refreshToken - JWT refresh token (optional)
   * @param {number} expiresIn - Token expiry time in seconds (default: 3600 = 1 hour)
   */
  setToken(token, refreshToken = null, expiresIn = 3600) {
    localStorage.setItem(TOKEN_KEY, token);
    
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
    
    // Calculate expiry timestamp
    const expiryTime = Date.now() + (expiresIn * 1000);
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
  },

  /**
   * Get authentication token from localStorage
   * @returns {string|null} - JWT token or null
   */
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Get refresh token from localStorage
   * @returns {string|null} - Refresh token or null
   */
  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  /**
   * Check if token is expired
   * @returns {boolean} - True if token is expired
   */
  isTokenExpired() {
    const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY);
    
    if (!expiryTime) {
      return true;
    }
    
    return Date.now() > parseInt(expiryTime, 10);
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} - True if user has valid token
   */
  isAuthenticated() {
    const token = this.getToken();
    return token !== null && !this.isTokenExpired();
  },

  /**
   * Remove all authentication tokens
   */
  clearTokens() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
  },

  /**
   * Get authorization header for API requests
   * @returns {object} - Authorization header object
   */
  getAuthHeader() {
    const token = this.getToken();
    
    if (token) {
      return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
    }
    
    return {
      'Content-Type': 'application/json'
    };
  },

  /**
   * Store user information
   * @param {object} user - User object
   */
  setUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  /**
   * Get stored user information
   * @returns {object|null} - User object or null
   */
  getUser() {
    const userStr = localStorage.getItem(USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        console.error('Error parsing user data:', e);
        return null;
      }
    }
    return null;
  },

  /**
   * Refresh the access token using refresh token
   * @returns {Promise<boolean>} - True if refresh was successful
   */
  async refreshAccessToken() {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      return false;
    }

    try {
      const response = await fetch('http://localhost:5000/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          this.setToken(data.token, refreshToken, data.expiresIn || 3600);
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  }
};

export default tokenManager;
