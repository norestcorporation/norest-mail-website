const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Get access token
const getAccessToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('norest_access_token');
  }
  return null;
};

// Send Message
export interface SendMessageRequest {
  to: Array<{ email: string; name?: string }>;
  cc?: Array<{ email: string; name?: string }>;
  bcc?: Array<{ email: string; name?: string }>;
  subject: string;
  text_body: string;
  html_body?: string;
  attachment_ids?: string[];
  reply_to_message_id?: string;
}

export interface SendMessageResponse {
  success: boolean;
  data?: {
    id: string;
    message_id: string;
    status: string;
  };
  error?: string;
}

export async function sendMessage(data: SendMessageRequest): Promise<SendMessageResponse> {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error('No access token available');
    }

    // Generate idempotency key
    const idempotencyKey = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    console.log('[Send] Sending message to:', `${BASE_URL}/v1/mail/send`);
    console.log('[Send] Request data:', JSON.stringify(data, null, 2));

    const response = await fetch(`${BASE_URL}/v1/mail/send`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify(data),
    });

    console.log('[Send] Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Send] Error response:', errorText);
      throw new Error(`Failed to send message: ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    console.log('[Send] Success response:', result);
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('Error sending message:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send message'
    };
  }
}

// Draft Operations
export interface DraftRequest {
  to: Array<{ email: string; name?: string }>;
  cc?: Array<{ email: string; name?: string }>;
  bcc?: Array<{ email: string; name?: string }>;
  subject: string;
  text_body: string;
  html_body?: string;
  attachment_ids?: string[];
}

export interface DraftResponse {
  id: string;
  to: Array<{ email: string; name?: string }>;
  cc?: Array<{ email: string; name?: string }>;
  bcc?: Array<{ email: string; name?: string }>;
  subject: string;
  text_body: string;
  html_body?: string;
  attachment_ids?: string[];
  created_at: string;
  updated_at: string;
}

export async function createDraft(data: DraftRequest): Promise<{ success: boolean; data?: DraftResponse; error?: string }> {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error('No access token available');
    }

    const response = await fetch(`${BASE_URL}/v1/mail/drafts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create draft: ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('Error creating draft:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create draft'
    };
  }
}

export async function updateDraft(draftId: string, data: DraftRequest): Promise<{ success: boolean; data?: DraftResponse; error?: string }> {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error('No access token available');
    }

    const response = await fetch(`${BASE_URL}/v1/mail/drafts/${draftId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update draft: ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('Error updating draft:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update draft'
    };
  }
}

export async function getDraft(draftId: string): Promise<{ success: boolean; data?: DraftResponse; error?: string }> {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error('No access token available');
    }

    const response = await fetch(`${BASE_URL}/v1/mail/drafts/${draftId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get draft: ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('Error getting draft:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get draft'
    };
  }
}

export async function deleteDraft(draftId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error('No access token available');
    }

    const response = await fetch(`${BASE_URL}/v1/mail/drafts/${draftId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok && response.status !== 404) {
      const errorText = await response.text();
      throw new Error(`Failed to delete draft: ${response.statusText} - ${errorText}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting draft:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete draft'
    };
  }
}

// Attachment Operations
export interface UploadAttachmentResponse {
  blob_id: string;
  filename: string;
  size: number;
  content_type: string;
  upload_url?: string;
}

export async function uploadAttachment(file: File): Promise<{ success: boolean; data?: UploadAttachmentResponse; error?: string }> {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error('No access token available');
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${BASE_URL}/v1/mail/attachments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        // Don't set Content-Type for FormData, let the browser set it with boundary
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to upload attachment: ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('Error uploading attachment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload attachment'
    };
  }
}

export async function downloadAttachment(attachmentId: string): Promise<{ success: boolean; data?: Blob; error?: string }> {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error('No access token available');
    }

    const response = await fetch(`${BASE_URL}/v1/mail/attachments/${attachmentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to download attachment: ${response.statusText} - ${errorText}`);
    }

    const blob = await response.blob();
    return {
      success: true,
      data: blob
    };
  } catch (error) {
    console.error('Error downloading attachment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to download attachment'
    };
  }
}

// Get User Profile for auto-filling from field
export interface UserProfile {
  id: string;
  email: string;
  display_name?: string;
  username?: string;
}

export async function getUserProfile(): Promise<{ success: boolean; data?: UserProfile; error?: string }> {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error('No access token available');
    }

    const response = await fetch(`${BASE_URL}/v1/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get user profile: ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('Error getting user profile:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get user profile'
    };
  }
}

// Get Mail Account for email identity
export interface MailAccount {
  id: string;
  email: string;
  stalwart_account_id: string;
  name?: string;
}

export async function getMailAccount(): Promise<{ success: boolean; data?: MailAccount; error?: string }> {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error('No access token available');
    }

    const response = await fetch(`${BASE_URL}/v1/mail/account`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get mail account: ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('Error getting mail account:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get mail account'
    };
  }
}

// Reply to message
export interface ReplyRequest {
  to: Array<{ email: string; name?: string }>;
  cc?: Array<{ email: string; name?: string }>;
  subject: string;
  text_body: string;
  html_body?: string;
  attachment_ids?: string[];
}

export async function replyToMessage(messageId: string, data: ReplyRequest): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error('No access token available');
    }

    const response = await fetch(`${BASE_URL}/v1/mail/messages/${messageId}/reply`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to reply to message: ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('Error replying to message:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to reply to message'
    };
  }
}

// Reply All to message
export async function replyAllToMessage(messageId: string, data: ReplyRequest): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error('No access token available');
    }

    const response = await fetch(`${BASE_URL}/v1/mail/messages/${messageId}/reply-all`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to reply all to message: ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('Error replying all to message:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to reply all to message'
    };
  }
}

// Forward message
export async function forwardMessage(messageId: string, data: ReplyRequest): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error('No access token available');
    }

    const response = await fetch(`${BASE_URL}/v1/mail/messages/${messageId}/forward`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to forward message: ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('Error forwarding message:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to forward message'
    };
  }
}
