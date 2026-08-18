"use client";

import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import { getMailboxes, Mailbox, getMessages } from '@/lib/api/mailbox';
import { getAccessToken } from '@/lib/token_manager';
import { setupTokenRefresh, clearTokenRefresh } from '../../../lib/token_manager';
import {
  markAsRead,
  markAsUnread,
  starMessage,
  unstarMessage,
  archiveMessage as apiArchiveMessage,
  unarchiveMessage as apiUnarchiveMessage,
  trashMessage,
  restoreMessage,
  markAsSpam,
  moveMessage as apiMoveMessage
} from '@/lib/api/mail_actions';

export interface MailFolder {
  id: string;
  key: string;
  name: string;
  icon: string;
  category: 'system' | 'smart' | 'custom';
  order: number;
  unreadCount: number;
  totalCount: number;
  color: string | null;
  parentId: string | null;
  children: MailFolder[];
  canRename: boolean;
  canDelete: boolean;
  canMove: boolean;
  canCreateChildren: boolean;
}

export interface Label {
  id: string;
  name: string;
  color: string;
  count: number;
}

export interface Message {
  id: string;
  threadId: string;
  mailboxIds: Record<string, boolean>;
  keywords: Record<string, boolean>;
  subject: string;
  from: { name: string | null; email: string }[] | null;
  to: { name: string | null; email: string }[] | null;
  cc: { name: string | null; email: string }[] | null;
  bcc: { name: string | null; email: string }[] | null;
  receivedAt: string;
  size: number;
  hasAttachment: boolean;
  preview: string;
  htmlBody?: any[];
  textBody?: any[];
  attachments?: any[];
  headers?: Record<string, string>;
  bodyValues?: Record<string, any>;
  body?: string;
}

type MailContextType = {
  folders: MailFolder[];
  labels: Label[];
  unreadInboxCount: number;
  refreshFolders: () => Promise<void>;
  newsletters: Message[];
  notifications: Message[];
  subscriptions: Message[];
  scheduled: Message[];
  deleteEmail: (id: string) => void;
  toggleReadStatus: (id: string) => void;
  fetchMessagesForMailbox: (mailboxId: string) => Promise<any[]>;
  currentMailboxId: string | null;
  setCurrentMailboxId: (id: string | null) => void;
  isLoading: boolean;
  apiError: string | null;
  // New mail action functions
  markMessageAsRead: (messageId: string) => Promise<boolean>;
  markMessageAsUnread: (messageId: string) => Promise<boolean>;
  toggleStarMessage: (messageId: string, isStarred: boolean) => Promise<boolean>;
  archiveMailMessage: (messageId: string) => Promise<boolean>;
  unarchiveMailMessage: (messageId: string, inboxMailboxId: string) => Promise<boolean>;
  moveMailMessage: (messageId: string, mailboxId: string) => Promise<boolean>;
  trashMailMessage: (messageId: string) => Promise<boolean>;
  restoreMailMessage: (messageId: string) => Promise<boolean>;
  spamMailMessage: (messageId: string) => Promise<boolean>;
};

const MailContext = createContext<MailContextType | undefined>(undefined);

// Define folder priority order for proper display
const folderPriority: Record<string, number> = {
  'inbox': 0,
  'drafts': 1,
  'sent': 2,
  'archive': 3,
  'junk': 4,
  'trash': 5,
};



// Convert real mailbox API data to MailFolder format
const convertMailboxToMailFolder = (mailbox: Mailbox): MailFolder => {
  // Map mailbox roles to icon keys and folder keys
  const iconMapping: Record<string, string> = {
    'inbox': 'inbox',
    'drafts': 'drafts',
    'sent': 'sent',
    'trash': 'trash',
    'junk': 'spam',
    'archive': 'archive',
  };

  // Map mailbox roles to friendly display names
  const nameMapping: Record<string, string> = {
    'inbox': 'Inbox',
    'drafts': 'Drafts',
    'sent': 'Sent',
    'trash': 'Trash',
    'junk': 'Spam',
    'archive': 'Archive',
  };

  const role = mailbox.role.toLowerCase();

  // Use 'spam' as the key for 'junk' so the URL becomes /app/spam
  const folderKey = role === 'junk' ? 'spam' : role;

  return {
    id: mailbox.id,
    key: folderKey,
    name: nameMapping[role] || mailbox.name,
    icon: iconMapping[role] || 'folder',
    category: 'system' as const,
    order: folderPriority[role] ?? 999,
    unreadCount: mailbox.unread_emails,
    totalCount: mailbox.total_emails,
    color: null,
    parentId: null,
    children: [],
    canRename: false,
    canDelete: false,
    canMove: false,
    canCreateChildren: false,
  };
};



const mockLabels: Label[] = [];

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

export function MailProvider({ children }: { children: React.ReactNode }) {
  const [folders, setFolders] = useState<MailFolder[]>([]);
  const [labels, setLabels] = useState<Label[]>(mockLabels);
  const [newsletters, setNewsletters] = useState<Message[]>([]);
  const [notifications, setNotifications] = useState<Message[]>([]);
  const [subscriptions, setSubscriptions] = useState<Message[]>([]);
  const [scheduled, setScheduled] = useState<Message[]>([]);
  const [currentMailboxId, setCurrentMailboxId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const refreshFolders = useCallback(async () => {
    setIsLoading(true);
    setApiError(null);

    try {
      const accessToken = getAccessToken();
      if (!accessToken) {
        setApiError('No access token available. Please log in.');
        setFolders([]);
        setIsLoading(false);
        return;
      }

      // Use real mailboxes API with retry
      const response = await retryWithBackoff(() => getMailboxes(accessToken), 3, 1000);

      if (response && response.mailboxes) {
        const convertedFolders = response.mailboxes.map((mailbox) =>
          convertMailboxToMailFolder(mailbox)
        );
        // Sort folders by order (based on folder priority)
        const sortedFolders = convertedFolders.sort((a, b) => a.order - b.order);
        setFolders(sortedFolders);
        setLabels(mockLabels);
        setApiError(null);
      } else {
        setApiError('Failed to fetch mailboxes from API');
        setFolders([]);
        setLabels(mockLabels);
      }
    } catch (error) {
      console.error('Failed to fetch folders from API:', error);
      setApiError('Failed to connect to mail server. Retrying in background...');
      setFolders([]);
      setLabels(mockLabels);

      // Background retry
      setTimeout(() => {
        refreshFolders();
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshVirtualFolders = useCallback(async () => {
    // Virtual folders are not implemented in real API yet
    // Set empty arrays for now
    setNewsletters([]);
    setNotifications([]);
    setSubscriptions([]);
    setScheduled([]);
  }, []);

  useEffect(() => {
    // Setup token refresh on mount
    setupTokenRefresh();

    refreshFolders();
    refreshVirtualFolders();

    // Cleanup token refresh on unmount
    return () => {
      clearTokenRefresh();
    };
  }, [refreshFolders, refreshVirtualFolders]);

  const unreadInboxCount = useMemo(() => {
    const inbox = folders.find(f => f.key === 'inbox');
    return inbox ? inbox.unreadCount : 0;
  }, [folders]);

  const deleteEmail = async (id: string) => {
    // Delete functionality will be implemented with real API
    console.log('Delete email called for:', id);
    // TODO: Implement real API call for delete
  };

  const toggleReadStatus = async (id: string) => {
    // Toggle read status will be implemented with real API
    console.log('Toggle read status called for:', id);
    // TODO: Implement real API call for toggle read status
  };

  // New mail action functions
  const markMessageAsRead = async (messageId: string): Promise<boolean> => {
    try {
      const accessToken = getAccessToken();
      if (!accessToken) {
        console.error('No access token available');
        return false;
      }
      return await markAsRead(accessToken, messageId);
    } catch (error) {
      console.error('Error marking message as read:', error);
      return false;
    }
  };

  const markMessageAsUnread = async (messageId: string): Promise<boolean> => {
    try {
      const accessToken = getAccessToken();
      if (!accessToken) {
        console.error('No access token available');
        return false;
      }
      return await markAsUnread(accessToken, messageId);
    } catch (error) {
      console.error('Error marking message as unread:', error);
      return false;
    }
  };

  const toggleStarMessage = async (messageId: string, isStarred: boolean): Promise<boolean> => {
    try {
      const accessToken = getAccessToken();
      if (!accessToken) {
        console.error('No access token available');
        return false;
      }
      if (isStarred) {
        return await unstarMessage(accessToken, messageId);
      } else {
        return await starMessage(accessToken, messageId);
      }
    } catch (error) {
      console.error('Error toggling star status:', error);
      return false;
    }
  };

  const archiveMailMessage = async (messageId: string): Promise<boolean> => {
    try {
      const accessToken = getAccessToken();
      if (!accessToken) {
        console.error('No access token available');
        return false;
      }
      return await apiArchiveMessage(accessToken, messageId);
    } catch (error) {
      console.error('Error archiving message:', error);
      return false;
    }
  };

  const unarchiveMailMessage = async (messageId: string, inboxMailboxId: string): Promise<boolean> => {
    try {
      const accessToken = getAccessToken();
      if (!accessToken) {
        console.error('No access token available');
        return false;
      }
      return await apiUnarchiveMessage(accessToken, messageId, inboxMailboxId);
    } catch (error) {
      console.error('Error unarchiving message:', error);
      return false;
    }
  };

  const moveMailMessage = async (messageId: string, mailboxId: string): Promise<boolean> => {
    try {
      const accessToken = getAccessToken();
      if (!accessToken) {
        console.error('No access token available');
        return false;
      }
      return await apiMoveMessage(accessToken, messageId, mailboxId);
    } catch (error) {
      console.error('Error moving message:', error);
      return false;
    }
  };

  const trashMailMessage = async (messageId: string): Promise<boolean> => {
    try {
      const accessToken = getAccessToken();
      if (!accessToken) {
        console.error('No access token available');
        return false;
      }
      return await trashMessage(accessToken, messageId);
    } catch (error) {
      console.error('Error trashing message:', error);
      return false;
    }
  };

  const restoreMailMessage = async (messageId: string): Promise<boolean> => {
    try {
      const accessToken = getAccessToken();
      if (!accessToken) {
        console.error('No access token available');
        return false;
      }
      return await restoreMessage(accessToken, messageId);
    } catch (error) {
      console.error('Error restoring message:', error);
      return false;
    }
  };

  const spamMailMessage = async (messageId: string): Promise<boolean> => {
    try {
      const accessToken = getAccessToken();
      if (!accessToken) {
        console.error('No access token available');
        return false;
      }
      return await markAsSpam(accessToken, messageId);
    } catch (error) {
      console.error('Error marking message as spam:', error);
      return false;
    }
  };

  const fetchMessagesForMailbox = async (mailboxId: string): Promise<any[]> => {
    try {
      const accessToken = getAccessToken();
      if (!accessToken) {
        console.log('No access token available for fetching messages');
        return [];
      }

      // Use real messages API with retry
      const response = await retryWithBackoff(() => getMessages(accessToken, mailboxId, 100), 3, 1000);

      if (response && response.messages) {
        return response.messages;
      } else {
        console.log('Messages API response unsuccessful, returning empty array');
        return [];
      }
    } catch (error) {
      console.error('Failed to fetch messages for mailbox:', error);
      return [];
    }
  };

  return (
    <MailContext.Provider value={{
      folders,
      labels,
      unreadInboxCount,
      refreshFolders,
      newsletters,
      notifications,
      subscriptions,
      scheduled,
      deleteEmail,
      toggleReadStatus,
      fetchMessagesForMailbox,
      currentMailboxId,
      setCurrentMailboxId,
      isLoading,
      apiError,
      markMessageAsRead,
      markMessageAsUnread,
      toggleStarMessage,
      archiveMailMessage,
      unarchiveMailMessage,
      moveMailMessage,
      trashMailMessage,
      restoreMailMessage,
      spamMailMessage
    }}>
      {children}
    </MailContext.Provider>
  );
}

export function useMail() {
  const context = useContext(MailContext);
  if (context === undefined) {
    throw new Error('useMail must be used within a MailProvider');
  }
  return context;
}
