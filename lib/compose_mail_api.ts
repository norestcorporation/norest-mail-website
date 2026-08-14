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

export interface MailboxResponse {
  success: boolean;
  data: {
    mailbox: {
      id: string;
      userId: string;
      email: string;
      domainId: string;
      status: string;
      quota: number;
      usedStorage: number;
      createdAt: string;
      updatedAt: string;
    };
  };
  meta: {};
  requestId: string;
}

export interface UserProfileResponse {
  success: boolean;
  data: {
    user: {
      id: string;
      username: string;
      email: string;
      displayName?: string;
    };
    profile?: {
      displayName: string;
      avatarUrl?: string;
    };
  };
  meta: {};
  requestId: string;
}

// Get current mailbox information
export async function getMailbox(accessToken?: string): Promise<MailboxResponse> {
  const url = `${BASE_URL}/mail/mailbox`;
  console.log(`Fetching mailbox from: ${url}`);

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

    console.log(`Mailbox response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      let errorMessage = `Failed to fetch mailbox: ${response.statusText}`;
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

    const result = await response.json();
    console.log('Mailbox fetched successfully:', result);
    return result;
  } catch (error: any) {
    console.error('Fetch mailbox error details:', error);
    
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(`Network error: Unable to connect to ${BASE_URL}. Possible causes: CORS issue, wrong port, or server not accepting connections.`);
    }
    
    throw error;
  }
}

// Get current user profile
export async function getUserProfile(accessToken?: string): Promise<UserProfileResponse> {
  const url = `${BASE_URL}/me/`;
  console.log(`Fetching user profile from: ${url}`);

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

    const result = await response.json();
    console.log('User profile fetched successfully:', result);
    return result;
  } catch (error: any) {
    console.error('Fetch user profile error details:', error);
    
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(`Network error: Unable to connect to ${BASE_URL}. Possible causes: CORS issue, wrong port, or server not accepting connections.`);
    }
    
    throw error;
  }
}

export interface ComposeDraftData {
  subject?: string;
  textBody?: string;
  htmlBody?: string;
  to?: Array<{ name?: string; email: string }>;
  cc?: Array<{ name?: string; email: string }>;
  bcc?: Array<{ name?: string; email: string }>;
  attachmentIds?: string[];
  replyToMessageId?: string;
}

export interface DraftResponse {
  success: boolean;
  data: {
    draft: {
      id: string;
      mailboxId: string;
      subject: string;
      preview: string;
      to: Array<{ name?: string; email: string }>;
      cc: Array<{ name?: string; email: string }>;
      bcc: Array<{ name?: string; email: string }>;
      textBody: string | null;
      htmlBody: string | null;
      attachments: Array<{
        id: string;
        filename: string;
        contentType: string;
        size: number;
      }>;
      createdAt: string;
      updatedAt: string;
      revision: number;
    };
  };
  meta: {};
  requestId: string;
}

export interface SendMessageResponse {
  success: boolean;
  data: {
    message: {
      draftId: string;
      messageId?: string;
    };
  };
  meta: {};
  requestId: string;
}

export interface AttachmentUploadResponse {
  success: boolean;
  data: {
    uploadId: string;
    attachmentId: string;
    filename: string;
    contentType: string;
    size: number;
  };
  meta: {};
  requestId: string;
}

export interface DraftFromMessageData {
  messageId: string;
  mode: "REPLY" | "REPLY_ALL" | "FORWARD";
}

// Create a new draft
export async function createDraft(data: ComposeDraftData, accessToken?: string): Promise<DraftResponse> {
  const url = `${BASE_URL}/mail/drafts`;
  console.log(`Creating draft at: ${url}`);

  try {
    // Use provided token or get a valid one automatically
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
      body: JSON.stringify({
        subject: data.subject,
        to: data.to?.map(r => typeof r === 'string' ? r : r.email),
        cc: data.cc?.map(r => typeof r === 'string' ? r : r.email),
        bcc: data.bcc?.map(r => typeof r === 'string' ? r : r.email),
        textBody: data.textBody,
        htmlBody: data.htmlBody,
      }),
    });

    console.log(`Create draft response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      let errorMessage = `Failed to create draft: ${response.statusText}`;
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

    const result = await response.json();
    console.log('Draft created successfully:', result);
    return result;
  } catch (error: any) {
    console.error('Create draft error details:', error);
    
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(`Network error: Unable to connect to ${BASE_URL}. Possible causes: CORS issue, wrong port, or server not accepting connections.`);
    }
    
    throw error;
  }
}

// Update an existing draft
export async function updateDraft(draftId: string, data: ComposeDraftData, revision: number, accessToken?: string): Promise<DraftResponse> {
  const url = `${BASE_URL}/mail/drafts/${draftId}`;
  console.log(`Updating draft at: ${url} with revision: ${revision}`);

  try {
    // Use provided token or get a valid one automatically
    const validToken = accessToken || await getValidAccessToken();
    
    if (!validToken) {
      throw new Error('No valid access token available');
    }

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${validToken}`,
      },
      body: JSON.stringify({
        subject: data.subject,
        to: data.to?.map(r => typeof r === 'string' ? r : r.email),
        cc: data.cc?.map(r => typeof r === 'string' ? r : r.email),
        bcc: data.bcc?.map(r => typeof r === 'string' ? r : r.email),
        textBody: data.textBody,
        htmlBody: data.htmlBody,
        revision: revision,
      }),
    });

    console.log(`Update draft response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      let errorMessage = `Failed to update draft: ${response.statusText}`;
      try {
        const errorData = await response.json();
        console.log('Error response data:', errorData);
        if (errorData.message) {
          errorMessage = errorData.message;
        }
        if (errorData.error?.message) {
          errorMessage = errorData.error.message;
        }
        if (errorData.errors) {
          errorMessage = `Validation errors: ${JSON.stringify(errorData.errors)}`;
        }
        if (response.status === 409) {
          errorMessage = "Revision conflict - draft was modified by another client";
        }
      } catch (e) {
        console.log('Could not parse error response:', e);
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log('Draft updated successfully:', result);
    return result;
  } catch (error: any) {
    console.error('Update draft error details:', error);
    
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(`Network error: Unable to connect to ${BASE_URL}. Possible causes: CORS issue, wrong port, or server not accepting connections.`);
    }
    
    throw error;
  }
}

// Autosave draft (uses same endpoint as update)
export async function autosaveDraft(draftId: string, data: ComposeDraftData, revision: number, accessToken?: string): Promise<DraftResponse> {
  const url = `${BASE_URL}/mail/drafts/${draftId}/autosave`;
  console.log(`Autosaving draft at: ${url}`);

  try {
    // Use provided token or get a valid one automatically
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
      body: JSON.stringify({
        subject: data.subject,
        to: data.to?.map(r => typeof r === 'string' ? r : r.email),
        cc: data.cc?.map(r => typeof r === 'string' ? r : r.email),
        bcc: data.bcc?.map(r => typeof r === 'string' ? r : r.email),
        textBody: data.textBody,
        htmlBody: data.htmlBody,
        revision: revision,
      }),
    });

    console.log(`Autosave draft response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      let errorMessage = `Failed to autosave draft: ${response.statusText}`;
      try {
        const errorData = await response.json();
        console.log('Error response data:', errorData);
        if (errorData.message) {
          errorMessage = errorData.message;
        }
        if (response.status === 409) {
          errorMessage = "Revision conflict - draft was modified by another client";
        }
      } catch (e) {
        console.log('Could not parse error response:', e);
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log('Draft autosaved successfully:', result);
    return result;
  } catch (error: any) {
    console.error('Autosave draft error details:', error);
    
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(`Network error: Unable to connect to ${BASE_URL}. Possible causes: CORS issue, wrong port, or server not accepting connections.`);
    }
    
    throw error;
  }
}

// Get draft details
export async function getDraft(draftId: string, accessToken?: string): Promise<DraftResponse> {
  const url = `${BASE_URL}/mail/drafts/${draftId}`;
  console.log(`Fetching draft from: ${url}`);

  try {
    // Use provided token or get a valid one automatically
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

    console.log(`Get draft response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      let errorMessage = `Failed to get draft: ${response.statusText}`;
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

    const result = await response.json();
    console.log('Draft fetched successfully:', result);
    return result;
  } catch (error: any) {
    console.error('Get draft error details:', error);
    
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(`Network error: Unable to connect to ${BASE_URL}. Possible causes: CORS issue, wrong port, or server not accepting connections.`);
    }
    
    throw error;
  }
}

// Send a draft
export async function sendDraft(draftId: string, accessToken?: string): Promise<SendMessageResponse> {
  const url = `${BASE_URL}/mail/drafts/${draftId}/send`;
  console.log(`Sending draft at: ${url}`);

  try {
    // Use provided token or get a valid one automatically
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

    console.log(`Send draft response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      let errorMessage = `Failed to send draft: ${response.statusText}`;
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

    const result = await response.json();
    console.log('Draft sent successfully:', result);
    return result;
  } catch (error: any) {
    console.error('Send draft error details:', error);
    
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(`Network error: Unable to connect to ${BASE_URL}. Possible causes: CORS issue, wrong port, or server not accepting connections.`);
    }
    
    throw error;
  }
}

// Delete a draft
export async function deleteDraft(draftId: string, accessToken?: string): Promise<{ success: boolean }> {
  const url = `${BASE_URL}/mail/drafts/${draftId}`;
  console.log(`Deleting draft at: ${url}`);

  try {
    // Use provided token or get a valid one automatically
    const validToken = accessToken || await getValidAccessToken();
    
    if (!validToken) {
      throw new Error('No valid access token available');
    }

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${validToken}`,
      },
    });

    console.log(`Delete draft response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      let errorMessage = `Failed to delete draft: ${response.statusText}`;
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

    const result = await response.json();
    console.log('Draft deleted successfully:', result);
    return result;
  } catch (error: any) {
    console.error('Delete draft error details:', error);
    
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(`Network error: Unable to connect to ${BASE_URL}. Possible causes: CORS issue, wrong port, or server not accepting connections.`);
    }
    
    throw error;
  }
}

// Create draft from existing message (for reply/forward)
export async function createDraftFromMessage(data: DraftFromMessageData, accessToken?: string): Promise<DraftResponse> {
  const url = `${BASE_URL}/mail/drafts/from-message`;
  console.log(`Creating draft from message at: ${url}`);

  try {
    // Use provided token or get a valid one automatically
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
      body: JSON.stringify(data),
    });

    console.log(`Create draft from message response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      let errorMessage = `Failed to create draft from message: ${response.statusText}`;
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

    const result = await response.json();
    console.log('Draft created from message successfully:', result);
    return result;
  } catch (error: any) {
    console.error('Create draft from message error details:', error);
    
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(`Network error: Unable to connect to ${BASE_URL}. Possible causes: CORS issue, wrong port, or server not accepting connections.`);
    }
    
    throw error;
  }
}

// Upload attachment
export async function uploadAttachment(file: File, accessToken?: string): Promise<AttachmentUploadResponse> {
  const url = `${BASE_URL}/mail/attachments/upload`;
  console.log(`Uploading attachment to: ${url}`);

  const formData = new FormData();
  formData.append('file', file);

  try {
    // Use provided token or get a valid one automatically
    const validToken = accessToken || await getValidAccessToken();
    
    if (!validToken) {
      throw new Error('No valid access token available');
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${validToken}`,
      },
      body: formData,
    });

    console.log(`Upload attachment response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      let errorMessage = `Failed to upload attachment: ${response.statusText}`;
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

    const result = await response.json();
    console.log('Attachment uploaded successfully:', result);
    return result;
  } catch (error: any) {
    console.error('Upload attachment error details:', error);
    
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(`Network error: Unable to connect to ${BASE_URL}. Possible causes: CORS issue, wrong port, or server not accepting connections.`);
    }
    
    throw error;
  }
}

// Attach uploaded file to draft
export async function attachToDraft(draftId: string, uploadId: string, accessToken?: string): Promise<{ success: boolean }> {
  const url = `${BASE_URL}/mail/drafts/${draftId}/attachments`;
  console.log(`Attaching file to draft at: ${url}`);

  try {
    // Use provided token or get a valid one automatically
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
      body: JSON.stringify({ uploadId }),
    });

    console.log(`Attach to draft response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      let errorMessage = `Failed to attach file to draft: ${response.statusText}`;
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

    const result = await response.json();
    console.log('File attached to draft successfully:', result);
    return result;
  } catch (error: any) {
    console.error('Attach to draft error details:', error);
    
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(`Network error: Unable to connect to ${BASE_URL}. Possible causes: CORS issue, wrong port, or server not accepting connections.`);
    }
    
    throw error;
  }
}

// Remove attachment from draft
export async function removeAttachmentFromDraft(draftId: string, attachmentId: string, accessToken?: string): Promise<{ success: boolean }> {
  const url = `${BASE_URL}/mail/drafts/${draftId}/attachments/${attachmentId}`;
  console.log(`Removing attachment from draft at: ${url}`);

  try {
    // Use provided token or get a valid one automatically
    const validToken = accessToken || await getValidAccessToken();
    
    if (!validToken) {
      throw new Error('No valid access token available');
    }

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${validToken}`,
      },
    });

    console.log(`Remove attachment response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      let errorMessage = `Failed to remove attachment from draft: ${response.statusText}`;
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

    const result = await response.json();
    console.log('Attachment removed from draft successfully:', result);
    return result;
  } catch (error: any) {
    console.error('Remove attachment error details:', error);
    
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(`Network error: Unable to connect to ${BASE_URL}. Possible causes: CORS issue, wrong port, or server not accepting connections.`);
    }
    
    throw error;
  }
}

// Send message directly (without draft)
export async function sendMessage(data: ComposeDraftData, accessToken?: string): Promise<SendMessageResponse> {
  const url = `${BASE_URL}/mail/messages/send`;
  console.log(`Sending message at: ${url}`);

  try {
    // Use provided token or get a valid one automatically
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
      body: JSON.stringify({
        subject: data.subject,
        to: data.to?.map(r => typeof r === 'string' ? r : r.email),
        cc: data.cc?.map(r => typeof r === 'string' ? r : r.email),
        bcc: data.bcc?.map(r => typeof r === 'string' ? r : r.email),
        textBody: data.textBody,
        htmlBody: data.htmlBody,
        attachmentIds: data.attachmentIds,
        replyToMessageId: data.replyToMessageId,
      }),
    });

    console.log(`Send message response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      let errorMessage = `Failed to send message: ${response.statusText}`;
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

    const result = await response.json();
    console.log('Message sent successfully:', result);
    return result;
  } catch (error: any) {
    console.error('Send message error details:', error);
    
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(`Network error: Unable to connect to ${BASE_URL}. Possible causes: CORS issue, wrong port, or server not accepting connections.`);
    }
    
    throw error;
  }
}
