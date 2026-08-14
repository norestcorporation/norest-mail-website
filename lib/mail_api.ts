const BASE_URL = "http://localhost:9000/api/v1";
import { getAccessToken, refreshAccessToken, isTokenExpiringSoon } from './token_manager';

// Helper function to ensure token is valid before API calls
async function getValidAccessToken(): Promise<string | null> {
  let token = getAccessToken();

  if (!token) {
    return null;
  }

  // Check if token is expiring soon and refresh it
  if (isTokenExpiringSoon()) {
    const refreshSuccess = await refreshAccessToken();
    if (refreshSuccess) {
      token = getAccessToken();
    } else {
      console.warn('Token refresh failed');
      return null;
    }
  }

  return token;
}

export interface Folder {
  id: string;
  mailboxId: string;
  name: string;
  type: string;
  messageCount: number;
  unreadCount: number;
  parentId: string | null;
  sortOrder: string;
  createdAt: string;
}

export interface FoldersResponse {
  success: boolean;
  data: Folder[];
  meta: {};
  requestId: string;
}

export interface ApiMessageFlags {
  id: string;
  messageId: string;
  seen: boolean;
  starred: boolean;
  important: boolean;
  answered: boolean;
  forwarded: boolean;
  draft: boolean;
}

export interface ApiMessageRecipient {
  type: 'to' | 'cc' | 'bcc';
  name: string | null;
  address: string;
}

export interface ApiMessageAttachment {
  id: string;
  messageId: string;
  filename: string;
  contentType: string;
  size: number;
  url?: string;
}

export interface ApiMessageDetail {
  id: string;
  threadId: string;
  folderId: string;
  senderName: string;
  senderAddress: string;
  subject: string;
  preview: string;
  body?: string;
  htmlBody?: string;
  receivedAt: string;
  size: number;
  flags: ApiMessageFlags;
  hasAttachments: boolean;
  recipients: ApiMessageRecipient[];
  attachments: ApiMessageAttachment[];
}

export interface ApiMessage {
  id: string;
  threadId: string;
  folderId: string;
  senderName: string;
  senderAddress: string;
  subject: string;
  preview: string;
  receivedAt: string;
  size: number;
  flags: ApiMessageFlags;
  hasAttachments: boolean;
  recipients: ApiMessageRecipient[];
}

export interface MessageDetailResponse {
  success: boolean;
  data: {
    message: ApiMessageDetail;
  };
  meta: {};
  requestId: string;
}

export interface MessagesResponse {
  success: boolean;
  data: {
    messages: ApiMessage[];
  };
  meta: {
    hasMore: boolean;
    nextCursor: string | null;
  };
  requestId: string;
}

export interface FetchMessagesParams {
  folder?: string;
  cursor?: string;
  limit?: number;
  unread?: boolean;
  starred?: boolean;
  hasAttachments?: boolean;
}

export async function fetchFolders(accessToken?: string): Promise<FoldersResponse> {
  const url = `${BASE_URL}/mail/folders`;
  console.log(`Fetching folders from: ${url}`);
  
  try {
    // Use provided token or get a valid one automatically
    const validToken = accessToken || await getValidAccessToken();
    
    console.log('Folders API - Token type:', typeof validToken);
    console.log('Folders API - Token value:', validToken);
    
    if (!validToken) {
      throw new Error('No valid access token available');
    }
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${validToken}`,
      },
    });

    console.log(`Folders response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      let errorMessage = `Failed to fetch folders: ${response.statusText}`;
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
    console.log('Folders fetched successfully:', data);
    return data;
  } catch (error: any) {
    console.error('Fetch folders error details:', error);
    
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(`Network error: Unable to connect to ${BASE_URL}. Possible causes: CORS issue, wrong port, or server not accepting connections.`);
    }
    
    throw error;
  }
}

export async function fetchMessages(accessToken?: string, params: FetchMessagesParams = {}): Promise<MessagesResponse> {
  const url = new URL(`${BASE_URL}/mail/messages`);
  
  // Add query parameters
  if (params.folder) url.searchParams.append('folder', params.folder);
  if (params.cursor) url.searchParams.append('cursor', params.cursor);
  if (params.limit) url.searchParams.append('limit', params.limit.toString());
  if (params.unread !== undefined) url.searchParams.append('unread', params.unread.toString());
  if (params.starred !== undefined) url.searchParams.append('starred', params.starred.toString());
  if (params.hasAttachments !== undefined) url.searchParams.append('hasAttachments', params.hasAttachments.toString());
  
  console.log(`Fetching messages from: ${url.toString()}`);
  
  try {
    // Use provided token or get a valid one automatically
    const validToken = accessToken || await getValidAccessToken();
    
    console.log('Messages API - Token type:', typeof validToken);
    console.log('Messages API - Token value:', validToken);
    
    if (!validToken) {
      throw new Error('No valid access token available');
    }
    
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${validToken}`,
      },
    });

    console.log(`Messages response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      let errorMessage = `Failed to fetch messages: ${response.statusText}`;
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
    console.log('Messages fetched successfully:', data);
    return data;
  } catch (error: any) {
    console.error('Fetch messages error details:', error);
    
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(`Network error: Unable to connect to ${BASE_URL}. Possible causes: CORS issue, wrong port, or server not accepting connections.`);
    }
    
    throw error;
  }
}

export async function fetchMessageDetail(accessToken: string, messageId: string): Promise<MessageDetailResponse> {
  const url = `${BASE_URL}/mail/messages/${messageId}`;
  console.log(`Fetching message detail from: ${url}`);
  
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
    });

    console.log(`Message detail response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      let errorMessage = `Failed to fetch message detail: ${response.statusText}`;
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
    console.log('Message detail fetched successfully:', data);
    return data;
  } catch (error: any) {
    console.error('Fetch message detail error details:', error);
    
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(`Network error: Unable to connect to ${BASE_URL}. Possible causes: CORS issue, wrong port, or server not accepting connections.`);
    }
    
    throw error;
  }
}

// Sync API functions
export async function triggerMailboxSync(accessToken?: string): Promise<{ success: boolean; message: string }> {
  const url = `${BASE_URL}/mail/sync`;
  console.log(`Triggering mailbox sync at: ${url}`);
  
  try {
    const validToken = accessToken || await getValidAccessToken();
    
    if (!validToken) {
      throw new Error('No valid access token available');
    }
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${validToken}`,
      },
    });

    console.log(`Sync response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      let errorMessage = `Failed to trigger sync: ${response.statusText}`;
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

    console.log('Mailbox sync triggered successfully');
    return { success: true, message: 'Sync triggered successfully' };
  } catch (error: any) {
    console.error('Trigger sync error details:', error);
    
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(`Network error: Unable to connect to ${BASE_URL}. Possible causes: CORS issue, wrong port, or server not accepting connections.`);
    }
    
    throw error;
  }
}

export async function getSyncStatus(accessToken?: string): Promise<{ success: boolean; data?: any; message: string }> {
  const url = `${BASE_URL}/mail/sync/status`;
  console.log(`Getting sync status from: ${url}`);
  
  try {
    const validToken = accessToken || await getValidAccessToken();
    
    if (!validToken) {
      throw new Error('No valid access token available');
    }
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${validToken}`,
      },
    });

    console.log(`Sync status response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      let errorMessage = `Failed to get sync status: ${response.statusText}`;
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
    console.log('Sync status fetched successfully:', data);
    return { success: true, data, message: 'Sync status retrieved successfully' };
  } catch (error: any) {
    console.error('Get sync status error details:', error);
    
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(`Network error: Unable to connect to ${BASE_URL}. Possible causes: CORS issue, wrong port, or server not accepting connections.`);
    }
    
    throw error;
  }
}
