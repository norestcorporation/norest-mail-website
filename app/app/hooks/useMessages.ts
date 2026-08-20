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
import { ApiMessage } from '../api/mockMailApi';
import {
  markAsRead as apiMarkAsRead,
  markAsUnread as apiMarkAsUnread,
  starMessage as apiStarMessage,
  unstarMessage as apiUnstarMessage,
  trashMessage,
  archiveMessage as realArchiveMessage,
  unarchiveMessage as realUnarchiveMessage,
  restoreMessage
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
      console.log(`Fetching messages for mailbox ${mailboxId} using real API`);
      const response = await retryWithBackoff(() => getMessages(accessToken, mailboxId, 100), 3, 1000);

      if (response && response.messages) {
        // Map MessageResponse to ApiMessage interface for the UI
        const mappedMessages = response.messages.map((m: any) => {
          // Determine default read state for sent and system messages
          const isRead = m.is_read || folderType === 'sent' || folderType === 'drafts' || m.is_draft;

          return {
            id: m.id,
            threadId: m.thread_id || m.id,
            subject: m.subject || '',
            from: m.from || [{ name: null, email: '' }],
            to: m.to || [{ name: null, email: '' }],
            preview: m.preview || '',
            receivedAt: m.received_at || m.sent_at || new Date().toISOString(),
            isUnread: !isRead,
            isStarred: m.is_starred || false,
            hasAttachment: m.has_attachment || false,
            isDraft: m.is_draft || false,
            size: m.size || 0,
            // Store original API values for reference
            is_read: isRead,
            is_starred: m.is_starred || false,
          };
        });

        setMessages(mappedMessages);
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

      console.log('Marking messages as read:', messageIds);
      const results = await Promise.all(
        messageIds.map(id => apiMarkAsRead(accessToken, id))
      );
      console.log('Mark as read results:', results);

      // Check if all API calls succeeded
      const allSuccess = results.every(result => result === true);

      if (allSuccess) {
        // Update local state to reflect API change
        setMessages(prev => prev.map(msg =>
          messageIds.includes(msg.id) ? { ...msg, isUnread: false, is_read: true } : msg
        ));

        // Refresh messages after marking as read to sync with server
        await loadMessages();
      } else {
        console.error('Some messages failed to mark as read');
        // Revert local state if API failed
        await loadMessages();
      }
    } catch (error) {
      console.error('Failed to mark messages as read:', error);
      // Revert local state on error
      await loadMessages();
    }
  }, [loadMessages]);

  const markAsUnread = useCallback(async (messageIds: string[]) => {
    try {
      const accessToken = getAccessToken();
      if (!accessToken) {
        console.error('No access token available');
        return;
      }

      console.log('Marking messages as unread:', messageIds);
      const results = await Promise.all(
        messageIds.map(id => apiMarkAsUnread(accessToken, id))
      );
      console.log('Mark as unread results:', results);

      // Check if all API calls succeeded
      const allSuccess = results.every(result => result === true);

      if (allSuccess) {
        // Update local state to reflect API change
        setMessages(prev => prev.map(msg =>
          messageIds.includes(msg.id) ? { ...msg, isUnread: true, is_read: false } : msg
        ));

        // Refresh messages after marking as unread to sync with server
        await loadMessages();
      } else {
        console.error('Some messages failed to mark as unread');
        // Revert local state if API failed
        await loadMessages();
      }
    } catch (error) {
      console.error('Failed to mark messages as unread:', error);
      // Revert local state on error
      await loadMessages();
    }
  }, [loadMessages]);

  const trashMessagesFn = useCallback(async (messageIds: string[]) => {
    try {
      const accessToken = getAccessToken();
      if (!accessToken) {
        console.error('No access token available');
        return;
      }

      console.log('Trashing messages:', messageIds);
      const results = await Promise.all(
        messageIds.map(id => trashMessage(accessToken, id))
      );
      console.log('Trash results:', results);

      // Check if all API calls succeeded
      const allSuccess = results.every(result => result === true);

      if (allSuccess) {
        // Update local state to reflect API change
        setMessages(prev => prev.filter(msg => !messageIds.includes(msg.id)));

        // Refresh messages after deletion to sync with server
        await loadMessages();
      } else {
        console.error('Some messages failed to trash');
        // Revert local state if API failed
        await loadMessages();
      }
    } catch (error) {
      console.error('Failed to delete messages:', error);
      // Revert local state on error
      await loadMessages();
    }
  }, [loadMessages]);

  const restoreMessagesFn = useCallback(async (messageIds: string[]) => {
    try {
      const accessToken = getAccessToken();
      if (!accessToken) {
        console.error('No access token available');
        return;
      }

      console.log('Restoring messages:', messageIds);
      const results = await Promise.all(
        messageIds.map(id => restoreMessage(accessToken, id))
      );

      const allSuccess = results.every(result => result === true);

      if (allSuccess) {
        setMessages(prev => prev.filter(msg => !messageIds.includes(msg.id)));
        await loadMessages();
      } else {
        console.error('Some messages failed to restore');
        await loadMessages();
      }
    } catch (error) {
      console.error('Failed to restore messages:', error);
      await loadMessages();
    }
  }, [loadMessages]);

  const archiveMessages = useCallback(async (messageIds: string[]) => {
    try {
      const accessToken = getAccessToken();
      if (!accessToken) {
        console.error('No access token available');
        return;
      }

      console.log('Archiving messages:', messageIds);
      const results = await Promise.all(
        messageIds.map(id => realArchiveMessage(accessToken, id))
      );
      console.log('Archive results:', results);

      // Check if all API calls succeeded
      const allSuccess = results.every(result => result === true);

      if (allSuccess) {
        // Update local state to reflect API change
        setMessages(prev => prev.filter(msg => !messageIds.includes(msg.id)));

        // Refresh messages after archiving to sync with server
        await loadMessages();
      } else {
        console.error('Some messages failed to archive');
        // Revert local state if API failed
        await loadMessages();
      }
    } catch (error) {
      console.error('Failed to archive messages:', error);
      // Revert local state on error
      await loadMessages();
    }
  }, [loadMessages]);

  const unarchiveMessages = useCallback(async (messageIds: string[], inboxMailboxId: string) => {
    try {
      const accessToken = getAccessToken();
      if (!accessToken) {
        console.error('No access token available');
        return;
      }

      const results = await Promise.all(
        messageIds.map(id => realUnarchiveMessage(accessToken, id, inboxMailboxId))
      );

      // Check if all API calls succeeded
      const allSuccess = results.every(result => result === true);

      if (allSuccess) {
        // Refresh messages after unarchiving
        await loadMessages();
      } else {
        console.error('Some messages failed to unarchive');
        // Revert local state if API failed
        await loadMessages();
      }
    } catch (error) {
      console.error('Failed to unarchive messages:', error);
      // Revert local state on error
      await loadMessages();
    }
  }, [loadMessages]);

  const toggleStarMessage = useCallback(async (messageId: string, isStarred: boolean) => {
    try {
      const accessToken = getAccessToken();
      if (!accessToken) {
        console.error('No access token available');
        return false;
      }

      console.log('Toggling star for message:', messageId, 'current state:', isStarred);
      const result = isStarred
        ? await apiUnstarMessage(accessToken, messageId)
        : await apiStarMessage(accessToken, messageId);

      if (result) {
        // Update local state to reflect API change
        setMessages(prev => prev.map(msg =>
          msg.id === messageId ? { ...msg, isStarred: !isStarred, is_starred: !isStarred } : msg
        ));

        // Refresh messages to sync with server
        await loadMessages();
        return true;
      } else {
        console.error('Failed to toggle star status');
        // Revert local state if API failed
        await loadMessages();
        return false;
      }
    } catch (error) {
      console.error('Failed to toggle star status:', error);
      // Revert local state on error
      await loadMessages();
      return false;
    }
  }, [loadMessages]);

  useEffect(() => {
    loadMessages();

    const handleMailSent = () => {
      loadMessages();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('mail-sent', handleMailSent);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('mail-sent', handleMailSent);
      }
    };
  }, [loadMessages]);
  return {
    messages,
    isLoading,
    trashMessages,
    markAsRead,
    markAsUnread,
    archiveMessages,
    unarchiveMessages,
    deleteMessages: trashMessagesFn,
    restoreMessages: restoreMessagesFn,
    refreshMessages: loadMessages,
    toggleStarMessage
  };
}