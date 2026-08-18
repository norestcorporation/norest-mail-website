import { useState, useCallback, useEffect } from "react";
import {
  getAccessToken,
  refreshAccessToken,
  isTokenExpiringSoon,
} from "@/lib/token_manager";
import {
  createDraft as mockCreateDraft,
  updateDraft as mockUpdateDraft,
  autosaveDraft as mockAutosaveDraft,
  getDraft as mockGetDraft,
  sendDraft as mockSendDraft,
  deleteDraft as mockDeleteDraft,
  createDraftFromMessage as mockCreateDraftFromMessage,
  uploadAttachment as mockUploadAttachment,
  attachToDraft as mockAttachToDraft,
  removeAttachmentFromDraft as mockRemoveAttachmentFromDraft,
  triggerMailboxSync as mockTriggerMailboxSync,
  deleteMessage,
  toggleReadStatus,
  archiveMessage as archiveMessageApi
} from "../api/mockMailApi";
import { getMessages } from "@/lib/api/mailbox";
import { getThreads } from "@/lib/api/threads";
import { ApiMessage } from '../api/mockMailApi';
import {
  markAsRead as apiMarkAsRead,
  markAsUnread as apiMarkAsUnread,
  trashMessage,
  archiveMessage as realArchiveMessage,
  unarchiveMessage as realUnarchiveMessage
} from "@/lib/api/mail_actions";

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

// Retry utility with exponential backoff
const retryWithBackoff = async <T,>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const waitTime = delay * Math.pow(2, i);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  throw new Error('Max retries exceeded');
};

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

// Mock API functions replacing old API calls
export async function createDraft(
  data: ComposeDraftData,
  accessToken?: string
): Promise<DraftResponse> {
  const result = await mockCreateDraft(data);
  return result as DraftResponse;
}

export async function updateDraft(
  accessToken: string | undefined,
  draftId: string,
  data: ComposeDraftData,
  revision: number
): Promise<DraftResponse> {
  const result = await mockUpdateDraft(draftId, data, revision);
  return result as DraftResponse;
}

export async function autosaveDraft(
  accessToken: string | undefined,
  draftId: string,
  data: ComposeDraftData,
  revision: number
): Promise<DraftResponse> {
  const result = await mockAutosaveDraft(draftId, data, revision);
  return result as DraftResponse;
}

export async function getDraft(
  accessToken: string | undefined,
  draftId: string
): Promise<DraftResponse> {
  const result = await mockGetDraft(draftId);
  return result as DraftResponse;
}

export async function sendDraft(
  accessToken: string | undefined,
  draftId: string
): Promise<SendMessageResponse> {
  const result = await mockSendDraft(draftId);
  return result as SendMessageResponse;
}

export async function deleteDraft(
  accessToken: string | undefined,
  draftId: string
): Promise<{ success: boolean }> {
  return mockDeleteDraft(draftId);
}

export async function createDraftFromMessage(
  accessToken: string | undefined,
  data: DraftFromMessageData
): Promise<DraftResponse> {
  const result = await mockCreateDraftFromMessage(data.messageId, data.mode);
  return result as DraftResponse;
}

export async function uploadAttachment(
  accessToken: string | undefined,
  file: File
): Promise<AttachmentUploadResponse> {
  const result = await mockUploadAttachment(file);
  return result as AttachmentUploadResponse;
}

export async function attachToDraft(
  accessToken: string | undefined,
  draftId: string,
  uploadId: string
): Promise<{ success: boolean }> {
  return mockAttachToDraft(draftId, uploadId);
}

export async function removeAttachmentFromDraft(
  accessToken: string | undefined,
  draftId: string,
  attachmentId: string
): Promise<{ success: boolean }> {
  return mockRemoveAttachmentFromDraft(draftId, attachmentId);
}

export async function triggerMailboxSync(): Promise<{ success: boolean }> {
  return mockTriggerMailboxSync();
}

// Custom hook for managing messages in a folder
export function useMessages(folderType: string, mailboxId?: string) {
  const [messages, setMessages] = useState<ApiMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [trashMessages, setTrashMessages] = useState<ApiMessage[]>([]);

  const loadMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const accessToken = getAccessToken();

      if (!accessToken) {
        console.log('No access token available for fetching messages');
        setMessages([]);
        return;
      }

      if (!mailboxId) {
        console.log('No mailbox ID provided for fetching messages');
        setMessages([]);
        return;
      }

      // Use real API with mailbox ID and retry logic
      console.log(`Fetching threads for mailbox ${mailboxId} using real API`);
      const response = await retryWithBackoff(() => getThreads(accessToken, mailboxId, 100), 3, 1000);

      if (response && response.threads) {
        // Map ThreadResponse to ApiMessage interface for the UI
        const mappedThreads = response.threads.map((t: any) => {
          let from = [{ name: null, email: '' }];
          let to = [{ name: null, email: '' }];

          // Parse participants JSONB (it comes as a string or array)
          let participants = [];
          if (t.participants) {
            try {
              if (typeof t.participants === 'string') {
                participants = JSON.parse(t.participants);
              } else if (Array.isArray(t.participants)) {
                participants = t.participants;
              }
            } catch (e) {
              console.error('Failed to parse participants:', e);
            }
          }

          if (participants.length > 0) {
            const firstParticipant = participants[0];
            from = [{ 
              name: firstParticipant.name || null, 
              email: firstParticipant.email || firstParticipant || '' 
            }];
            if (participants.length > 1) {
              const secondParticipant = participants[1];
              to = [{ 
                name: secondParticipant.name || null, 
                email: secondParticipant.email || secondParticipant || '' 
              }];
            }
          }

          return {
            id: t.id,
            threadId: t.id,
            subject: t.subject || '',
            from: from,
            to: to,
            preview: t.snippet || '',
            receivedAt: t.last_message_at || new Date().toISOString(),
            isUnread: t.unread_count > 0,
            isStarred: false, // Threads don't have starred state yet
            hasAttachment: false, // Fetch from messages if needed
            isDraft: false,
            size: 0,
            messageCount: t.message_count
          };
        });

        setMessages(mappedThreads);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      setMessages([]);

      // Background retry after 5 seconds
      setTimeout(() => {
        console.log('Retrying message fetch in background...');
        loadMessages();
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  }, [folderType, mailboxId]);

  const markAsRead = useCallback(async (messageIds: string[]) => {
    try {
      const accessToken = getAccessToken();
      if (!accessToken) {
        console.error('No access token available');
        return;
      }

      await Promise.all(
        messageIds.map(id => apiMarkAsRead(accessToken, id))
      );
      // Refresh messages after marking as read
      await loadMessages();
    } catch (error) {
      console.error('Failed to mark messages as read:', error);
    }
  }, [loadMessages]);

  const trashMessagesFn = useCallback(async (messageIds: string[]) => {
    try {
      const accessToken = getAccessToken();
      if (!accessToken) {
        console.error('No access token available');
        return;
      }

      await Promise.all(
        messageIds.map(id => trashMessage(accessToken, id))
      );
      // Refresh messages after deletion
      await loadMessages();
    } catch (error) {
      console.error('Failed to delete messages:', error);
    }
  }, [loadMessages]);

  const archiveMessages = useCallback(async (messageIds: string[]) => {
    try {
      const accessToken = getAccessToken();
      if (!accessToken) {
        console.error('No access token available');
        return;
      }

      await Promise.all(
        messageIds.map(id => realArchiveMessage(accessToken, id))
      );
      // Refresh messages after archiving
      await loadMessages();
    } catch (error) {
      console.error('Failed to archive messages:', error);
    }
  }, [loadMessages]);

  const unarchiveMessages = useCallback(async (messageIds: string[], inboxMailboxId: string) => {
    try {
      const accessToken = getAccessToken();
      if (!accessToken) {
        console.error('No access token available');
        return;
      }

      await Promise.all(
        messageIds.map(id => realUnarchiveMessage(accessToken, id, inboxMailboxId))
      );
      // Refresh messages after unarchiving
      await loadMessages();
    } catch (error) {
      console.error('Failed to unarchive messages:', error);
    }
  }, [loadMessages]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  return {
    messages,
    isLoading,
    trashMessages,
    markAsRead,
    archiveMessages,
    unarchiveMessages,
    deleteMessages: trashMessagesFn,
    refreshMessages: loadMessages
  };
}