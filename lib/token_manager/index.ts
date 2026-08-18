// Token Manager for handling authentication tokens with automatic refresh
const ACCESS_TOKEN_KEY = 'norest_access_token';
const REFRESH_TOKEN_KEY = 'norest_refresh_token';
const USER_ID_KEY = 'norest_user_id';
const EMAIL_KEY = 'norest_email';
const EXPIRES_AT_KEY = 'norest_expires_at';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Refresh token 5 minutes before expiration
const REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes in milliseconds
const CHECK_INTERVAL = 60 * 1000; // Check every minute

let refreshInterval: NodeJS.Timeout | null = null;
let isRefreshing = false;

export interface TokenData {
  access_token: string;
  refresh_token: string;
  id: string;
  email: string;
  expires_in: number;
}

export interface RefreshResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

// Helper function to decode JWT and get expiration time
function getTokenExpiration(token: string): number | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    const payload = JSON.parse(jsonPayload);
    if (payload.exp) {
      return payload.exp * 1000; // Convert to milliseconds
    }
  } catch (error) {
    console.error('Error decoding token:', error);
  }
  return null;
}

// Calculate expiration time from expires_in
function calculateExpirationTime(expiresIn: number): number {
  // Default to 15 minutes if expires_in is invalid or missing
  const validExpiresIn = (expiresIn && expiresIn > 0) ? expiresIn : 900;
  return Date.now() + (validExpiresIn * 1000);
}

export const tokenManager = {
  // Store tokens with expiration tracking
  setTokens: (tokenData: TokenData) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ACCESS_TOKEN_KEY, tokenData.access_token);
      localStorage.setItem(REFRESH_TOKEN_KEY, tokenData.refresh_token);
      localStorage.setItem(USER_ID_KEY, tokenData.id);
      localStorage.setItem(EMAIL_KEY, tokenData.email);
      
      // Calculate and store expiration time
      const expiresAt = calculateExpirationTime(tokenData.expires_in);
      localStorage.setItem(EXPIRES_AT_KEY, expiresAt.toString());
      
      console.log('Tokens stored with expiration:', new Date(expiresAt).toISOString());
    }
  },

  // Save tokens (alternative signature for compatibility)
  saveTokens: (accessToken: string, refreshToken: string, expiresIn: number, id?: string, email?: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      
      // Calculate and store expiration time
      const expiresAt = calculateExpirationTime(expiresIn);
      localStorage.setItem(EXPIRES_AT_KEY, expiresAt.toString());
      
      if (id) localStorage.setItem(USER_ID_KEY, id);
      if (email) localStorage.setItem(EMAIL_KEY, email);
      
      console.log('Tokens saved with expiration:', new Date(expiresAt).toISOString());
    }
  },

  // Get access token
  getAccessToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(ACCESS_TOKEN_KEY);
    }
    return null;
  },

  // Get refresh token
  getRefreshToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    }
    return null;
  },

  // Get user ID
  getUserId: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(USER_ID_KEY);
    }
    return null;
  },

  // Get email
  getEmail: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(EMAIL_KEY);
    }
    return null;
  },

  // Get expiration time
  getExpiresAt: (): number | null => {
    if (typeof window !== 'undefined') {
      const expiresAt = localStorage.getItem(EXPIRES_AT_KEY);
      return expiresAt ? parseInt(expiresAt, 10) : null;
    }
    return null;
  },

  // Check if token is expiring soon (within 5 minutes)
  isTokenExpiringSoon: (): boolean => {
    const expiresAt = tokenManager.getExpiresAt();
    if (!expiresAt) return false;
    
    const timeUntilExpiration = expiresAt - Date.now();
    return timeUntilExpiration <= REFRESH_THRESHOLD;
  },

  // Check if token is expired
  isTokenExpired: (): boolean => {
    const expiresAt = tokenManager.getExpiresAt();
    if (!expiresAt) return true;
    
    return Date.now() >= expiresAt;
  },

  // Clear all tokens
  clearTokens: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_ID_KEY);
      localStorage.removeItem(EMAIL_KEY);
      localStorage.removeItem(EXPIRES_AT_KEY);
      console.log('All tokens cleared');
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const hasToken = !!tokenManager.getAccessToken();
    const notExpired = !tokenManager.isTokenExpired();
    return hasToken && notExpired;
  },

  // Refresh access token using refresh token
  refreshAccessToken: async (): Promise<boolean> => {
    if (isRefreshing) {
      console.log('Token refresh already in progress');
      return false;
    }

    const refreshToken = tokenManager.getRefreshToken();
    if (!refreshToken) {
      console.error('No refresh token available');
      return false;
    }

    isRefreshing = true;
    console.log('Attempting to refresh access token...');

    try {
      const response = await fetch(`${API_BASE_URL}/v1/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        throw new Error(`Refresh failed: ${response.status} ${response.statusText}`);
      }

      const data: RefreshResponse = await response.json();
      
      // Update tokens with new data
      tokenManager.saveTokens(
        data.access_token,
        data.refresh_token,
        data.expires_in
      );
      
      console.log('Token refreshed successfully, new expiration:', 
        new Date(calculateExpirationTime(data.expires_in)).toISOString());
      
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      // If refresh fails, clear tokens to force re-login
      tokenManager.clearTokens();
      return false;
    } finally {
      isRefreshing = false;
    }
  },

  // Logout user
  logout: async (): Promise<boolean> => {
    const accessToken = tokenManager.getAccessToken();
    
    try {
      if (accessToken) {
        // Call logout endpoint to invalidate session on server
        await fetch(`${API_BASE_URL}/v1/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({}),
        });
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Continue with local cleanup even if API call fails
    } finally {
      // Always clear local tokens
      tokenManager.clearTokens();
      console.log('User logged out');
    }
    
    return true;
  },

  // Setup automatic token refresh
  setupTokenRefresh: () => {
    if (typeof window === 'undefined') return;
    
    // Clear any existing interval
    tokenManager.clearTokenRefresh();
    
    console.log('Setting up automatic token refresh...');
    
    // Check token expiration periodically
    refreshInterval = setInterval(() => {
      if (!tokenManager.isAuthenticated()) {
        console.log('User not authenticated, skipping token refresh check');
        return;
      }

      if (tokenManager.isTokenExpiringSoon()) {
        console.log('Token expiring soon, initiating refresh...');
        tokenManager.refreshAccessToken();
      }
    }, CHECK_INTERVAL);
  },

  // Clear token refresh interval
  clearTokenRefresh: () => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
      refreshInterval = null;
      console.log('Token refresh interval cleared');
    }
  }
};

// Export individual functions for compatibility
export const getAccessToken = tokenManager.getAccessToken;
export const clearTokens = tokenManager.clearTokens;
export const refreshAccessToken = tokenManager.refreshAccessToken;
export const isTokenExpiringSoon = tokenManager.isTokenExpiringSoon;
export const setupTokenRefresh = tokenManager.setupTokenRefresh;
export const clearTokenRefresh = tokenManager.clearTokenRefresh;
export const setTokens = tokenManager.setTokens;
export const saveTokens = tokenManager.saveTokens;
export const logout = tokenManager.logout;
