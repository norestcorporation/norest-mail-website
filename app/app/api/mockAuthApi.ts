// Mock Auth API functions to replace old auth_api
import { tokenManager } from '@/lib/token_manager';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  data: UserProfile;
}

export const getUserProfile = async (accessToken?: string): Promise<AuthResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const email = tokenManager.getEmail();
  const id = tokenManager.getUserId();
  
  if (!email || !id) {
    return {
      success: false,
      data: {
        id: '',
        username: '',
        email: '',
        displayName: 'Guest',
        avatarUrl: null,
        createdAt: ''
      }
    };
  }
  
  const username = email.split('@')[0];
  
  return {
    success: true,
    data: {
      id,
      username,
      email,
      displayName: username.charAt(0).toUpperCase() + username.slice(1), // Capitalize first letter
      avatarUrl: null,
      createdAt: new Date().toISOString()
    }
  };
};

export const logout = async (): Promise<{ success: boolean }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  tokenManager.clearTokens();
  return { success: true };
};