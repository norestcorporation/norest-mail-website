const BASE_URL = "http://localhost:9000/api/v1";
import { useState, useCallback, useEffect } from "react";
import {
  getAccessToken,
  refreshAccessToken,
  isTokenExpiringSoon,
} from "../../../lib/token_manager";
import { fetchMessages, ApiMessage, triggerMailboxSync } from "../../../lib/mail_api";

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
      console.warn("Token refresh failed");
      return null;
    }
  }

  return token;
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
export async function createDraft(
  data: ComposeDraftData,
  accessToken?: string
): Promise<DraftResponse> {
  const url = `${BASE_URL}/mail/drafts`;

  console.log(`Creating draft at: ${url}`);

  try {
    const validToken = accessToken || (await getValidAccessToken());

    if (!validToken) {
      throw new Error("No valid access token available");
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${validToken}`,
      },
      body: JSON.stringify({
        subject: data.subject,
        to: data.to?.map((r) => (typeof r === "string" ? r : r.email)),
        cc: data.cc?.map((r) => (typeof r === "string" ? r : r.email)),
        bcc: data.bcc?.map((r) => (typeof r === "string" ? r : r.email)),
        textBody: data.textBody,
        htmlBody: data.htmlBody,
      }),
    });

    console.log(
      `Create draft response status: ${response.status} ${response.statusText}`
    );

    if (!response.ok) {
      let errorMessage = `Failed to create draft: ${response.statusText}`;

      try {
        const errorData = await response.json();

        console.log("Error response data:", errorData);

        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (e) {
        console.log("Could not parse error response:", e);
      }

      throw new Error(errorMessage);
    }

    const result = await response.json();

    console.log("Draft created successfully:", result);

    return result;
  } catch (error: any) {
    console.error("Create draft error details:", error);

    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(
        `Network error: Unable to connect to ${BASE_URL}. Possible causes: CORS issue, wrong port, or server not accepting connections.`
      );
    }

    throw error;
  }
}

// Update an existing draft
export async function updateDraft(
  accessToken: string | undefined,
  draftId: string,
  data: ComposeDraftData,
  revision: number
): Promise<DraftResponse> {
  const url = `${BASE_URL}/mail/drafts/${draftId}`;

  console.log(`Updating draft at: ${url} with revision: ${revision}`);

  try {
    const validToken = accessToken || (await getValidAccessToken());

    if (!validToken) {
      throw new Error("No valid access token available");
    }

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${validToken}`,
      },
      body: JSON.stringify({
        subject: data.subject,
        to: data.to?.map((r) => (typeof r === "string" ? r : r.email)),
        cc: data.cc?.map((r) => (typeof r === "string" ? r : r.email)),
        bcc: data.bcc?.map((r) => (typeof r === "string" ? r : r.email)),
        textBody: data.textBody,
        htmlBody: data.htmlBody,
        revision,
      }),
    });

    console.log(
      `Update draft response status: ${response.status} ${response.statusText}`
    );

    if (!response.ok) {
      let errorMessage = `Failed to update draft: ${response.statusText}`;

      try {
        const errorData = await response.json();

        console.log("Error response data:", errorData);

        if (errorData.message) {
          errorMessage = errorData.message;
        }

        if (errorData.error?.message) {
          errorMessage = errorData.error.message;
        }

        if (errorData.errors) {
          errorMessage = `Validation errors: ${JSON.stringify(
            errorData.errors
          )}`;
        }

        if (response.status === 409) {
          errorMessage =
            "Revision conflict - draft was modified by another client";
        }
      } catch (e) {
        console.log("Could not parse error response:", e);
      }

      throw new Error(errorMessage);
    }

    const result = await response.json();

    console.log("Draft updated successfully:", result);

    return result;
  } catch (error: any) {
    console.error("Update draft error details:", error);

    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(
        `Network error: Unable to connect to ${BASE_URL}. Possible causes: CORS issue, wrong port, or server not accepting connections.`
      );
    }

    throw error;
  }
}

// Autosave draft
export async function autosaveDraft(
  accessToken: string | undefined,
  draftId: string,
  data: ComposeDraftData,
  revision: number
): Promise<DraftResponse> {
  const url = `${BASE_URL}/mail/drafts/${draftId}/autosave`;

  console.log(`Autosaving draft at: ${url}`);

  try {
    const validToken = accessToken || (await getValidAccessToken());

    if (!validToken) {
      throw new Error("No valid access token available");
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${validToken}`,
      },
      body: JSON.stringify({
        subject: data.subject,
        to: data.to,
        cc: data.cc,
        bcc: data.bcc,
        textBody: data.textBody,
        htmlBody: data.htmlBody,
        revision,
      }),
    });

    console.log(
      `Autosave draft response status: ${response.status} ${response.statusText}`
    );

    if (!response.ok) {
      let errorMessage = `Failed to autosave draft: ${response.statusText}`;

      try {
        const errorData = await response.json();

        console.log("Error response data:", errorData);

        if (errorData.message) {
          errorMessage = errorData.message;
        }

        if (response.status === 409) {
          errorMessage =
            "Revision conflict - draft was modified by another client";
        }
      } catch (e) {
        console.log("Could not parse error response:", e);
      }

      throw new Error(errorMessage);
    }

    const result = await response.json();

    console.log("Draft autosaved successfully:", result);

    return result;
  } catch (error: any) {
    console.error("Autosave draft error details:", error);

    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(
        `Network error: Unable to connect to ${BASE_URL}. Possible causes: CORS issue, wrong port, or server not accepting connections.`
      );
    }

    throw error;
  }
}

// Get draft details
export async function getDraft(
  accessToken: string | undefined,
  draftId: string
): Promise<DraftResponse> {
  const url = `${BASE_URL}/mail/drafts/${draftId}`;

  console.log(`Fetching draft from: ${url}`);

  try {
    const validToken = accessToken || (await getValidAccessToken());

    if (!validToken) {
      throw new Error("No valid access token available");
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${validToken}`,
      },
    });

    console.log(
      `Get draft response status: ${response.status} ${response.statusText}`
    );

    if (!response.ok) {
      let errorMessage = `Failed to get draft: ${response.statusText}`;

      try {
        const errorData = await response.json();

        console.log("Error response data:", errorData);

        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (e) {
        console.log("Could not parse error response:", e);
      }

      throw new Error(errorMessage);
    }

    const result = await response.json();

    console.log("Draft fetched successfully:", result);

    return result;
  } catch (error: any) {
    console.error("Get draft error details:", error);

    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(
        `Network error: Unable to connect to ${BASE_URL}. Possible causes: CORS issue, wrong port, or server not accepting connections.`
      );
    }

    throw error;
  }
}

// Send a draft
export async function sendDraft(
  accessToken: string | undefined,
  draftId: string
): Promise<SendMessageResponse> {
  const url = `${BASE_URL}/mail/drafts/${draftId}/send`;

  console.log(`Sending draft at: ${url}`);

  try {
    const validToken = accessToken || (await getValidAccessToken());

    if (!validToken) {
      throw new Error("No valid access token available");
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${validToken}`,
      },
    });

    console.log(
      `Send draft response status: ${response.status} ${response.statusText}`
    );

    if (!response.ok) {
      let errorMessage = `Failed to send draft: ${response.statusText}`;

      try {
        const errorData = await response.json();

        console.log("Error response data:", errorData);

        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (e) {
        console.log("Could not parse error response:", e);
      }

      throw new Error(errorMessage);
    }

    const result = await response.json();

    console.log("Draft sent successfully:", result);

    return result;
  } catch (error: any) {
    console.error("Send draft error details:", error);

    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(
        `Network error: Unable to connect to ${BASE_URL}. Possible causes: CORS issue, wrong port, or server not accepting connections.`
      );
    }

    throw error;
  }
}

// Delete a draft
export async function deleteDraft(
  accessToken: string | undefined,
  draftId: string
): Promise<{ success: boolean }> {
  const url = `${BASE_URL}/mail/drafts/${draftId}`;

  console.log(`Deleting draft at: ${url}`);

  try {
    const validToken = accessToken || (await getValidAccessToken());

    if (!validToken) {
      throw new Error("No valid access token available");
    }

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${validToken}`,
      },
    });

    console.log(
      `Delete draft response status: ${response.status} ${response.statusText}`
    );

    if (!response.ok) {
      let errorMessage = `Failed to delete draft: ${response.statusText}`;

      try {
        const errorData = await response.json();

        console.log("Error response data:", errorData);

        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (e) {
        console.log("Could not parse error response:", e);
      }

      throw new Error(errorMessage);
    }

    const result = await response.json();

    console.log("Draft deleted successfully:", result);

    return result;
  } catch (error: any) {
    console.error("Delete draft error details:", error);

    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(
        `Network error: Unable to connect to ${BASE_URL}. Possible causes: CORS issue, wrong port, or server not accepting connections.`
      );
    }

    throw error;
  }
}

// Create draft from existing message
export async function createDraftFromMessage(
  accessToken: string | undefined,
  data: DraftFromMessageData
): Promise<DraftResponse> {
  const url = `${BASE_URL}/mail/drafts/from-message`;

  console.log(`Creating draft from message at: ${url}`);

  try {
    const validToken = accessToken || (await getValidAccessToken());

    if (!validToken) {
      throw new Error("No valid access token available");
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${validToken}`,
      },
      body: JSON.stringify(data),
    });

    console.log(
      `Create draft from message response status: ${response.status} ${response.statusText}`
    );

    if (!response.ok) {
      let errorMessage = `Failed to create draft from message: ${response.statusText}`;

      try {
        const errorData = await response.json();

        console.log("Error response data:", errorData);

        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (e) {
        console.log("Could not parse error response:", e);
      }

      throw new Error(errorMessage);
    }

    const result = await response.json();

    console.log("Draft created from message successfully:", result);

    return result;
  } catch (error: any) {
    console.error("Create draft from message error details:", error);

    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(
        `Network error: Unable to connect to ${BASE_URL}. Possible causes: CORS issue, wrong port, or server not accepting connections.`
      );
    }

    throw error;
  }
}

// Upload attachment
export async function uploadAttachment(
  accessToken: string | undefined,
  file: File
): Promise<AttachmentUploadResponse> {
  const url = `${BASE_URL}/mail/attachments/upload`;

  console.log(`Uploading attachment to: ${url}`);

  const formData = new FormData();
  formData.append("file", file);

  try {
    const validToken = accessToken || (await getValidAccessToken());

    if (!validToken) {
      throw new Error("No valid access token available");
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
      body: formData,
    });

    console.log(
      `Upload attachment response status: ${response.status} ${response.statusText}`
    );

    if (!response.ok) {
      let errorMessage = `Failed to upload attachment: ${response.statusText}`;

      try {
        const errorData = await response.json();

        console.log("Error response data:", errorData);

        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (e) {
        console.log("Could not parse error response:", e);
      }

      throw new Error(errorMessage);
    }

    const result = await response.json();

    console.log("Attachment uploaded successfully:", result);

    return result;
  } catch (error: any) {
    console.error("Upload attachment error details:", error);

    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(
        `Network error: Unable to connect to ${BASE_URL}. Possible causes: CORS issue, wrong port, or server not accepting connections.`
      );
    }

    throw error;
  }
}

// Attach uploaded file to draft
export async function attachToDraft(
  accessToken: string | undefined,
  draftId: string,
  uploadId: string
): Promise<{ success: boolean }> {
  const url = `${BASE_URL}/mail/drafts/${draftId}/attachments`;

  console.log(`Attaching file to draft at: ${url}`);

  try {
    const validToken = accessToken || (await getValidAccessToken());

    if (!validToken) {
      throw new Error("No valid access token available");
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${validToken}`,
      },
      body: JSON.stringify({ uploadId }),
    });

    console.log(
      `Attach to draft response status: ${response.status} ${response.statusText}`
    );

    if (!response.ok) {
      let errorMessage = `Failed to attach file to draft: ${response.statusText}`;

      try {
        const errorData = await response.json();

        console.log("Error response data:", errorData);

        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (e) {
        console.log("Could not parse error response:", e);
      }

      throw new Error(errorMessage);
    }

    const result = await response.json();

    console.log("File attached to draft successfully:", result);

    return result;
  } catch (error: any) {
    console.error("Attach to draft error details:", error);

    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(
        `Network error: Unable to connect to ${BASE_URL}. Possible causes: CORS issue, wrong port, or server not accepting connections.`
      );
    }

    throw error;
  }
}

// Remove attachment from draft
export async function removeAttachmentFromDraft(
  accessToken: string | undefined,
  draftId: string,
  attachmentId: string
): Promise<{ success: boolean }> {
  const url = `${BASE_URL}/mail/drafts/${draftId}/attachments/${attachmentId}`;

  console.log(`Removing attachment from draft at: ${url}`);

  try {
    const validToken = accessToken || (await getValidAccessToken());

    if (!validToken) {
      throw new Error("No valid access token available");
    }

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${validToken}`,
      },
    });

    console.log(
      `Remove attachment response status: ${response.status} ${response.statusText}`
    );

    if (!response.ok) {
      let errorMessage = `Failed to remove attachment from draft: ${response.statusText}`;

      try {
        const errorData = await response.json();

        console.log("Error response data:", errorData);

        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (e) {
        console.log("Could not parse error response:", e);
      }

      throw new Error(errorMessage);
    }

    const result = await response.json();

    console.log("Attachment removed from draft successfully:", result);

    return result;
  } catch (error: any) {
    console.error("Remove attachment error details:", error);

    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(
        `Network error: Unable to connect to ${BASE_URL}. Possible causes: CORS issue, wrong port, or server not accepting connections.`
      );
    }

    throw error;
  }
}

// Send message directly
export async function sendMessage(
  accessToken: string | undefined,
  data: ComposeDraftData
): Promise<SendMessageResponse> {
  const url = `${BASE_URL}/mail/messages/send`;

  console.log(`Sending message at: ${url}`);

  try {
    const validToken = accessToken || (await getValidAccessToken());

    if (!validToken) {
      throw new Error("No valid access token available");
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${validToken}`,
      },
      body: JSON.stringify({
        subject: data.subject,
        to: data.to?.map((r) => (typeof r === "string" ? r : r.email)),
        cc: data.cc?.map((r) => (typeof r === "string" ? r : r.email)),
        bcc: data.bcc?.map((r) => (typeof r === "string" ? r : r.email)),
        textBody: data.textBody,
        htmlBody: data.htmlBody,
        attachmentIds: data.attachmentIds,
        replyToMessageId: data.replyToMessageId,
      }),
    });

    console.log(
      `Send message response status: ${response.status} ${response.statusText}`
    );

    if (!response.ok) {
      let errorMessage = `Failed to send message: ${response.statusText}`;

      try {
        const errorData = await response.json();

        console.log("Error response data:", errorData);

        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (e) {
        console.log("Could not parse error response:", e);
      }

      throw new Error(errorMessage);
    }

    const result = await response.json();

    console.log("Message sent successfully:", result);

    return result;
  } catch (error: any) {
    console.error("Send message error details:", error);

    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(
        `Network error: Unable to connect to ${BASE_URL}. Possible causes: CORS issue, wrong port, or server not accepting connections.`
      );
    }

    throw error;
  }
}

// Format date with long human-readable format
function formatDate(dateString: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayName = dayNames[date.getDay()];
  const month = monthNames[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  return `${dayName}, ${month} ${day}, ${year} at ${formattedHours}:${minutes} ${ampm}`;
}

// Format sender/receiver with username and email
function formatEmailDisplay(email: string, name: string) {
  if (!email) return { username: 'Unknown', email: '' };
  // Use name if available, otherwise use email username
  const displayName = name && name.trim() ? name : email.split('@')[0];
  const capitalizedUsername = displayName.charAt(0).toUpperCase() + displayName.slice(1);
  return {
    username: capitalizedUsername,
    email: email
  };
}

// Transform API message to component format
function transformApiMessage(apiMessage: any, folder: string) {

  const relevantEmail = folder === 'sent' || folder === 'drafts'
    ? (apiMessage.recipients?.[0]?.address || apiMessage.senderAddress)
    : apiMessage.senderAddress;

  const relevantName = folder === 'sent' || folder === 'drafts'
    ? (apiMessage.recipients?.[0]?.name || '')
    : (apiMessage.senderName || '');

  return {
    id: apiMessage.id,
    threadId: apiMessage.threadId,
    folderId: apiMessage.folderId,
    senderName: apiMessage.senderName || apiMessage.senderAddress?.split('@')[0] || 'Unknown',
    senderAddress: apiMessage.senderAddress,
    subject: apiMessage.subject || '(No subject)',
    snippet: apiMessage.preview || '',
    preview: apiMessage.preview || '',
    date: formatDate(apiMessage.receivedAt),
    receivedAt: apiMessage.receivedAt,
    isUnread: !apiMessage.flags?.seen,
    isStarred: apiMessage.flags?.starred || false,
    isImportant: apiMessage.flags?.important || false,
    hasAttachments: apiMessage.hasAttachments || false,
    size: apiMessage.size,
    flags: apiMessage.flags,
    recipients: apiMessage.recipients || [],
    // Additional fields for different folders
    recipientEmail: apiMessage.recipients?.[0]?.address || '',
    emailDisplay: formatEmailDisplay(relevantEmail, relevantName),
    isOfficial: false, // API doesn't provide this
    deliveryStatus: folder === 'sent' ? 'Delivered' : null, // Mock delivery status for sent folder
    lastEdited: formatDate(apiMessage.updatedAt),
    scheduledTime: formatDate(apiMessage.scheduledAt),
    deletionDate: formatDate(apiMessage.deletedAt),
    autoSaved: false, // API doesn't provide this
  };
}

// Transform SSE event data to frontend message format
function transformSSEEvent(sseEvent: any, folder: string) {
  console.log('[SSE] Transforming event data:', sseEvent);

  // Handle both full event structure and direct data structure
  const eventData = sseEvent.data || sseEvent;

  // Extract sender name from email address with fallbacks
  const senderEmail = eventData.from || eventData.senderAddress || '';
  const senderName = eventData.senderName || senderEmail?.split('@')[0] || 'Unknown';

  // Use SSE-provided values if available, otherwise use defaults
  const isUnread = eventData.isUnread !== undefined ? eventData.isUnread : true;
  const isStarred = eventData.isStarred || false;
  const hasAttachments = eventData.hasAttachments || false;
  const size = eventData.size || 0;

  return {
    id: eventData.messageId,
    threadId: eventData.threadId,
    folderId: eventData.folderId,
    senderName: senderName,
    senderAddress: senderEmail,
    subject: eventData.subject || '(No subject)',
    snippet: eventData.preview || '',
    preview: eventData.preview || '',
    date: formatDate(eventData.receivedAt?.toString() || new Date().toString()),
    receivedAt: eventData.receivedAt?.toString() || new Date().toString(),
    isUnread: isUnread,
    isStarred: isStarred,
    isImportant: false,
    hasAttachments: hasAttachments,
    size: size,
    flags: { seen: !isUnread, starred: isStarred },
    recipients: [],
    recipientEmail: '',
    emailDisplay: formatEmailDisplay(senderEmail, senderName),
    isOfficial: false,
    deliveryStatus: null,
    lastEdited: formatDate(new Date().toString()),
    scheduledTime: '',
    deletionDate: '',
    autoSaved: false,
  };
}

// React hook for managing messages
export function useMessages(folder: string) {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchMessages(undefined, { folder });
      if (response.success) {
        const transformedMessages = response.data.messages.map((msg: any) => 
          transformApiMessage(msg, folder)
        );
        setMessages(transformedMessages);
      }
    } catch (error) {
      console.error('Failed to fetch messages for folder', folder, error);
    } finally {
      setIsLoading(false);
    }
  }, [folder]);

  const triggerSync = useCallback(async () => {
    try {
      const accessToken = getAccessToken();
      if (!accessToken) {
        console.error('No access token available for sync');
        return;
      }

      const result = await triggerMailboxSync(accessToken);
      if (result.success) {
        // Reload messages after sync
        await loadMessages();
      }
    } catch (error) {
      console.error('Failed to trigger sync:', error);
    }
  }, [loadMessages]);

  const markAsRead = useCallback(async (messageIds: string | string[]) => {
    // Handle both single ID and array of IDs
    const ids = Array.isArray(messageIds) ? messageIds : [messageIds];
    // Implement mark as read logic
    console.log('Mark as read:', ids);
    // Update local state to reflect read status
    setMessages(prevMessages => 
      prevMessages.map(msg => 
        ids.includes(msg.id) ? { ...msg, isUnread: false } : msg
      )
    );
  }, []);

  const archiveMessages = useCallback(async (messageIds: string[]) => {
    // Implement archive logic
    console.log('Archive messages:', messageIds);
    // Remove from local state
    setMessages(prevMessages => 
      prevMessages.filter(msg => !messageIds.includes(msg.id))
    );
  }, []);

  const trashMessages = useCallback(async (messageIds: string[]) => {
    // Implement trash logic
    console.log('Trash messages:', messageIds);
    // Remove from local state
    setMessages(prevMessages => 
      prevMessages.filter(msg => !messageIds.includes(msg.id))
    );
  }, []);

  // SSE connection for real-time sync notifications
  useEffect(() => {
    const accessToken = getAccessToken();
    if (!accessToken) return;

    // Native EventSource doesn't support custom headers, so pass token as query parameter
    const eventSource = new EventSource(`${BASE_URL}/events?token=${accessToken}`);

    console.log('SSE: Connecting to', `${BASE_URL}/events?token=${accessToken.substring(0, 10)}...`);

    eventSource.addEventListener('open', () => {
      console.log('SSE: Connection opened');
    });

    eventSource.addEventListener('sync.completed', (event) => {
      const data = JSON.parse(event.data);
      console.log('SSE: Sync completed event received:', data);
      // Reload messages when sync completes for current folder
      if (data.mailboxId) {
        loadMessages();
      }
    });

    eventSource.addEventListener('message.created', (event) => {
      const data = JSON.parse(event.data);
      console.log('[SSE] message.created received:', { event: data, currentFolder: folder });
      console.log('[SSE] message.created raw payload:', event.data);

      // The SSE event structure: { type: "message.created", userId, mailboxId, timestamp, data: { ... } }
      const messageData = data.data || data;
      console.log('[SSE] Extracted message data:', messageData);
      console.log('[SSE] message.data keys:', Object.keys(messageData));

      // Idempotency check: don't add if message already exists
      setMessages(prevMessages => {
        if (prevMessages.some(msg => msg.id === messageData.messageId)) {
          console.log('[SSE] message.created - message already exists, skipping');
          return prevMessages;
        }

        // Insert the new message directly into the cache
        console.log('[SSE] message.created - inserting message into cache');
        const newMessage = transformSSEEvent(messageData, folder);
        console.log('[SSE] Transformed message:', newMessage);
        return [newMessage, ...prevMessages];
      });
    });

    eventSource.addEventListener('message.updated', (event) => {
      const data = JSON.parse(event.data);
      console.log('[SSE] message.updated received:', { event: data, currentFolder: folder });

      const messageData = data.data || data;

      // Update the message in the current list
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === messageData.messageId ? { ...msg, ...messageData } : msg
        )
      );
    });

    eventSource.addEventListener('message.deleted', (event) => {
      const data = JSON.parse(event.data);
      console.log('[SSE] message.deleted received:', { event: data, currentFolder: folder });

      const messageData = data.data || data;

      // Remove the message from the current list
      setMessages(prevMessages =>
        prevMessages.filter(msg => msg.id !== messageData.messageId)
      );
    });

    eventSource.addEventListener('message.moved', (event) => {
      const data = JSON.parse(event.data);
      console.log('[SSE] message.moved received:', { event: data, currentFolder: folder });

      const messageData = data.data || data;

      // If message moved to current folder, add it; if moved from current folder, remove it
      if (messageData.toFolderId) {
        console.log('[SSE] message.moved - fetching and adding message');
        loadMessages(); // Reload to get the updated message
      } else if (messageData.fromFolderId) {
        console.log('[SSE] message.moved - removing message');
        setMessages(prevMessages =>
          prevMessages.filter(msg => msg.id !== messageData.messageId)
        );
      }
    });

    eventSource.addEventListener('folder.updated', (event) => {
      const data = JSON.parse(event.data);
      console.log('[SSE] folder.updated received:', { event: data, currentFolder: folder });

      const folderData = data.data || data;

      // If folder was deleted, we may need to reload
      if (folderData.deleted) {
        console.log('[SSE] folder.updated - folder deleted, reloading messages');
        loadMessages();
      } else {
        // For folder structure changes, we could update folder-specific state
        // For now, log the event without reloading
        console.log('[SSE] folder.updated - folder updated, not reloading');
      }
    });

    eventSource.addEventListener('message.read', (event) => {
      const data = JSON.parse(event.data);
      console.log('[SSE] message.read received:', { event: data, currentFolder: folder });

      const messageData = data.data || data;

      // Update the read status
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === messageData.messageId ? { ...msg, isUnread: messageData.isUnread } : msg
        )
      );
    });

    eventSource.addEventListener('connection', (event) => {
      const data = JSON.parse(event.data);
      console.log('SSE: Connection event received:', data);
    });

    eventSource.addEventListener('heartbeat', (event) => {
      const data = JSON.parse(event.data);
      console.log('SSE: Heartbeat received:', data);
    });

    eventSource.addEventListener('error', (error) => {
      console.error('SSE: Connection error');
      console.error('SSE: EventSource readyState:', eventSource.readyState);
      console.error('SSE: EventSource url:', eventSource.url);
      console.error('SSE: Error event type:', error.type);
      console.error('SSE: Error event:', error);

      // EventSource readyState constants:
      // CONNECTING = 0
      // OPEN = 1
      // CLOSED = 2
      const readyStateMap = {
        0: 'CONNECTING',
        1: 'OPEN',
        2: 'CLOSED'
      };
      console.error('SSE: Ready state meaning:', readyStateMap[eventSource.readyState as keyof typeof readyStateMap] || 'UNKNOWN');
    });

    return () => {
      console.log('SSE: Closing connection');
      eventSource.close();
    };
  }, [loadMessages]);

  // Initial load
  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // Fallback polling reduced to 2 minutes since SSE handles real-time updates
  useEffect(() => {
    const syncInterval = setInterval(() => {
      loadMessages();
    }, 120000); // Poll every 2 minutes instead of 30 seconds

    return () => clearInterval(syncInterval);
  }, [loadMessages]);

  return {
    messages,
    isLoading,
    markAsRead,
    archiveMessages,
    trashMessages,
    triggerSync,
  };
}