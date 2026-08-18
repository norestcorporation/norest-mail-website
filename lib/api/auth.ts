const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Auth types based on API response
export interface RegisterRequest {
  email: string;
  password: string;
}

export interface RegistrationFlow {
  id: string;
  email: string;
  domain_type: string;
  status: string;
  domain_id: string;
  domain_name: string;
  domain_verified: boolean;
  address_id: string;
  mailbox_provisioned: boolean;
  ready_for_mail: boolean;
}

export interface RegisterResponse {
  access_token: string;
  email: string;
  id: string;
  refresh_token: string;
  expires_in?: number;
  registration_flow: RegistrationFlow;
  status: string;
}

export interface ProvisioningStatus {
  mailbox_id: string;
  address_id: string;
  status: string;
  stalwart_account_id: string;
  ready_for_session: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  status: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  email: string;
  status: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

// Register user
export async function registerUser(email: string, password: string): Promise<RegisterResponse | null> {
  try {
    const response = await fetch(`${BASE_URL}/v1/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!response.ok) {
      throw new Error(`Registration failed: ${response.statusText}`);
    }

    const data: RegisterResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error registering user:", error);
    return null;
  }
}

// Check provisioning status
export async function checkProvisioningStatus(accessToken: string): Promise<ProvisioningStatus | null> {
  try {
    const response = await fetch(`${BASE_URL}/v1/mail/provisioning-status`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to check provisioning status: ${response.statusText}`);
    }

    const data: ProvisioningStatus = await response.json();
    return data;
  } catch (error) {
    console.error("Error checking provisioning status:", error);
    return null;
  }
}

// Get user profile
export async function getUserProfile(accessToken: string): Promise<UserProfile | null> {
  try {
    const response = await fetch(`${BASE_URL}/v1/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get user profile: ${response.statusText}`);
    }

    const data: UserProfile = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
}

// Login user
export async function loginUser(credentials: LoginRequest): Promise<LoginResponse | null> {
  try {
    console.log('Attempting login to:', `${BASE_URL}/v1/auth/login`);
    console.log('Credentials:', { email: credentials.email, password: '***' });
    console.log('Request body:', JSON.stringify(credentials));
    
    const response = await fetch(`${BASE_URL}/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    console.log('Response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      console.error('Error response type:', response.headers.get('content-type'));
      
      // Try to parse error as JSON for better error messages
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.error || `Login failed: ${response.statusText}`);
      } catch {
        throw new Error(`Login failed: ${response.statusText} - ${errorText}`);
      }
    }

    const data: LoginResponse = await response.json();
    console.log('Login successful:', data);
    return data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}

// Logout user
export async function logoutUser(accessToken: string): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/v1/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      console.error('Logout failed:', response.statusText);
      return false;
    }

    console.log('Logout successful');
    return true;
  } catch (error) {
    console.error("Error logging out:", error);
    return false;
  }
}
