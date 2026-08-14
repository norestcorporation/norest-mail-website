import { refreshToken } from './auth_api';

const TOKEN_REFRESH_THRESHOLD = 10 * 60 * 1000; // 10 minutes in milliseconds
const STORAGE_KEY_ACCESS_TOKEN = 'accessToken';
const STORAGE_KEY_REFRESH_TOKEN = 'refreshToken';
const STORAGE_KEY_TOKEN_EXPIRES_AT = 'tokenExpiresAt';

export interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export function saveTokens(accessToken: string, refreshToken: string, expiresIn: number): void {
  const expiresAt = Date.now() + (expiresIn * 1000);

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY_ACCESS_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEY_REFRESH_TOKEN, refreshToken);
    localStorage.setItem(STORAGE_KEY_TOKEN_EXPIRES_AT, expiresAt.toString());

    // Also set cookies for middleware access
    const accessDate = new Date(Date.now() + (expiresIn * 1000));
    const refreshDate = new Date(Date.now() + (expiresIn * 2 * 1000));

    document.cookie = `accessToken=${accessToken}; path=/; expires=${accessDate.toUTCString()}; SameSite=Lax`;
    document.cookie = `refreshToken=${refreshToken}; path=/; expires=${refreshDate.toUTCString()}; SameSite=Lax`;
  }
}

export function getTokens(): TokenData | null {
  if (typeof window === "undefined") return null;
  
  const accessToken = localStorage.getItem(STORAGE_KEY_ACCESS_TOKEN);
  const refreshToken = localStorage.getItem(STORAGE_KEY_REFRESH_TOKEN);
  const expiresAt = localStorage.getItem(STORAGE_KEY_TOKEN_EXPIRES_AT);
  
  if (!accessToken || !refreshToken || !expiresAt) {
    return null;
  }
  
  return {
    accessToken,
    refreshToken,
    expiresAt: parseInt(expiresAt, 10),
  };
}

export function clearTokens(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY_ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEY_REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEY_TOKEN_EXPIRES_AT);
    
    // Clear cookies
    document.cookie = 'accessToken=; path=/; max-age=0; SameSite=Lax';
    document.cookie = 'refreshToken=; path=/; max-age=0; SameSite=Lax';
  }
}

export function isTokenExpiringSoon(): boolean {
  const tokens = getTokens();
  if (!tokens) return true;
  
  const timeUntilExpiry = tokens.expiresAt - Date.now();
  return timeUntilExpiry <= TOKEN_REFRESH_THRESHOLD;
}

export async function refreshAccessToken(): Promise<boolean> {
  const tokens = getTokens();
  if (!tokens) return false;
  
  try {
    const response = await refreshToken({ refreshToken: tokens.refreshToken });
    
    if (response.success && response.data) {
      saveTokens(
        response.data.accessToken,
        response.data.refreshToken,
        response.data.expiresIn
      );
      return true;
    }
    
    // If refresh token is invalid, clear tokens and redirect to login
    console.error('Refresh token response indicates failure:', response.error);
    clearTokens();
    if (typeof window !== "undefined") {
      window.location.href = '/account/sign-in';
    }
    return false;
  } catch (error: any) {
    console.error('Failed to refresh token:', error);
    // Check if the error is specifically about invalid refresh token
    if (error.message && error.message.includes('Invalid or expired refresh token')) {
      console.log('Invalid refresh token detected, clearing tokens and redirecting');
      clearTokens();
      if (typeof window !== "undefined") {
        window.location.href = '/account/sign-in';
      }
    }
    return false;
  }
}

let refreshInterval: NodeJS.Timeout | null = null;

export function setupTokenRefresh(): void {
  // Clear any existing interval to prevent duplicates
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
  
  // Check every minute if token needs refresh
  refreshInterval = setInterval(async () => {
    if (isTokenExpiringSoon()) {
      const success = await refreshAccessToken();
      if (!success) {
        console.warn('Failed to refresh token, user may need to re-login');
        clearTokens();
        // Redirect to login page if refresh fails
        if (typeof window !== "undefined") {
          window.location.href = '/account/sign-in';
        }
      }
    }
  }, 60 * 1000); // Check every minute
}

export function clearTokenRefresh(): void {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
}

// Initialize token refresh on module load (if tokens exist)
if (typeof window !== "undefined" && getTokens()) {
  setupTokenRefresh();
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  
  const accessToken = localStorage.getItem(STORAGE_KEY_ACCESS_TOKEN);
  return accessToken;
}
