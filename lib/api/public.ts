const BASE_URL = "http://localhost:8080";

// Domain types based on API response
export interface Domain {
  id: string;
  name: string;
  stalwart_domain_id: string;
  status: string;
  verification_status: string;
  ownership_type: string;
  registration_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface DomainsResponse {
  data: {
    domains: Domain[];
  };
  success: boolean;
}

export interface UsernameCheckResponse {
  data: {
    available: boolean;
    domain: string;
    username: string;
  };
  success: boolean;
}

// Get all available domains
export async function getDomains(): Promise<Domain[]> {
  try {
    const response = await fetch(`${BASE_URL}/v1/public/domains`);
    const data: DomainsResponse = await response.json();
    
    if (data.success && data.data.domains) {
      return data.data.domains;
    }
    return [];
  } catch (error) {
    console.error("Error fetching domains:", error);
    return [];
  }
}

// Check if username is available for a domain
export async function checkUsernameAvailability(domain: string, username: string): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/v1/public/domains/${domain}/check/${username}`);
    const data: UsernameCheckResponse = await response.json();
    
    if (data.success && data.data) {
      return data.data.available;
    }
    return false;
  } catch (error) {
    console.error("Error checking username availability:", error);
    return false;
  }
}
