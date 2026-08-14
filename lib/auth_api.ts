const BASE_URL = "http://localhost:9000/api/v1";

export interface Domain {
  id: string;
  name: string;
  domain: string;
  default: boolean;
  status: string;
}

export interface DomainsResponse {
  success: boolean;
  data: {
    default: string;
    domains: Domain[];
  };
  meta: {};
  requestId: string;
}

export interface CheckUsernameRequest {
  username: string;
  domain: string;
}

export interface CheckUsernameResponse {
  success: boolean;
  data: {
    available: boolean;
  };
  requestId: string;
}

export interface ReserveUsernameRequest {
  username: string;
  domain: string;
}

export interface ReserveUsernameResponse {
  success: boolean;
  data: {
    reservationId: string;
    expiresAt: string;
  };
  error?: {
    code: string;
    message: string;
    details: any[];
  };
  requestId: string;
}

export interface RegisterRequest {
  username: string;
  domain: string;
  reservationId: string;
  displayName: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
}

export interface RegisterResponse {
  success: boolean;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
  error?: {
    code: string;
    message: string;
    details: any[];
  };
  requestId: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
  error?: {
    code: string;
    message: string;
    details: any[];
  };
  requestId: string;
}

export async function fetchDomains(): Promise<DomainsResponse> {
  const url = `${BASE_URL}/domains/`;
  console.log(`Fetching domains from: ${url}`);
  
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Add CORS mode for debugging
      mode: 'cors',
    });

    console.log(`Response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      let errorMessage = `Failed to fetch domains: ${response.statusText}`;
      try {
        const errorData = await response.json();
        console.log('Error response data:', errorData);
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (e) {
        // If we can't parse error JSON, use status text
        console.log('Could not parse error response:', e);
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Domains fetched successfully:', data);
    return data;
  } catch (error: any) {
    console.error('Fetch error details:', error);
    
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(`Network error: Unable to connect to ${BASE_URL}. Possible causes: CORS issue, wrong port, or server not accepting connections.`);
    }
    
    throw error;
  }
}

export async function checkUsername(request: CheckUsernameRequest): Promise<CheckUsernameResponse> {
  const url = `${BASE_URL}/auth/check-username`;
  console.log(`Checking username availability: ${request.username}@${request.domain}`);
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    console.log(`Check username response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      let errorMessage = `Failed to check username: ${response.statusText}`;
      try {
        const errorData = await response.json();
        console.log('Error response data:', errorData);
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (e) {
        console.log('Could not parse error response:', e);
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Username check result:', data);
    return data;
  } catch (error: any) {
    console.error('Check username error details:', error);
    
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(`Network error: Unable to connect to ${BASE_URL}. Possible causes: CORS issue, wrong port, or server not accepting connections.`);
    }
    
    throw error;
  }
}

export async function reserveUsername(request: ReserveUsernameRequest): Promise<ReserveUsernameResponse> {
  const url = `${BASE_URL}/auth/reserve-username`;
  console.log(`Reserving username: ${request.username}@${request.domain}`);
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    console.log(`Reserve username response status: ${response.status} ${response.statusText}`);

    const data = await response.json();
    console.log('Reserve username result:', data);
    
    if (!data.success) {
      throw new Error(data.error?.message || "Failed to reserve username");
    }

    return data;
  } catch (error: any) {
    console.error('Reserve username error details:', error);
    
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(`Network error: Unable to connect to ${BASE_URL}. Possible causes: CORS issue, wrong port, or server not accepting connections.`);
    }
    
    throw error;
  }
}

export async function register(request: RegisterRequest): Promise<RegisterResponse> {
  const url = `${BASE_URL}/auth/register`;
  console.log(`Registering user: ${request.username}@${request.domain}`);
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    console.log(`Register response status: ${response.status} ${response.statusText}`);

    const data = await response.json();
    console.log('Register result:', data);
    
    if (!data.success) {
      throw new Error(data.error?.message || "Failed to register");
    }

    return data;
  } catch (error: any) {
    console.error('Register error details:', error);
    
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(`Network error: Unable to connect to ${BASE_URL}. Possible causes: CORS issue, wrong port, or server not accepting connections.`);
    }
    
    throw error;
  }
}

export async function refreshToken(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
  const url = `${BASE_URL}/auth/refresh`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error?.message || "Failed to refresh token");
    }

    return data;
  } catch (error: any) {
    console.error('Refresh token error details:', error);
    
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(`Network error: Unable to connect to ${BASE_URL}. Possible causes: CORS issue, wrong port, or server not accepting connections.`);
    }
    
    throw error;
  }
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginUser {
  id: string;
  username: string;
  email: string;
  displayName: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    user: LoginUser;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
  error?: {
    code: string;
    message: string;
    details: any[];
  };
  requestId: string;
}

export async function login(request: LoginRequest): Promise<LoginResponse> {
  const url = `${BASE_URL}/auth/login`;
  console.log(`Logging in user: ${request.email}`);
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    console.log(`Login response status: ${response.status} ${response.statusText}`);

    const data = await response.json();
    console.log('Login result:', data);
    
    if (!data.success) {
      throw new Error(data.error?.message || "Login failed");
    }

    return data;
  } catch (error: any) {
    console.error('Login error details:', error);
    
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(`Network error: Unable to connect to ${BASE_URL}. Possible causes: CORS issue, wrong port, or server not accepting connections.`);
    }
    
    throw error;
  }
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  createdAt: string;
}

export interface UserProfileResponse {
  success: boolean;
  data: UserProfile;
  requestId: string;
}

export async function getUserProfile(accessToken: string): Promise<UserProfileResponse> {
  const url = `${BASE_URL}/me/`;
  console.log(`Fetching user profile from: ${url}`);
  
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
    });

    console.log(`User profile response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      let errorMessage = `Failed to fetch user profile: ${response.statusText}`;
      try {
        const errorData = await response.json();
        console.log('Error response data:', errorData);
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (e) {
        console.log('Could not parse error response:', e);
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('User profile fetched successfully:', data);
    return data;
  } catch (error: any) {
    console.error('Fetch user profile error details:', error);
    
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(`Network error: Unable to connect to ${BASE_URL}. Possible causes: CORS issue, wrong port, or server not accepting connections.`);
    }
    
    throw error;
  }
}
