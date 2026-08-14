"use client";

import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { fetchFolders, Folder as ApiFolder } from '@/lib/mail_api';
import { setupTokenRefresh, clearTokenRefresh } from '@/lib/token_manager';

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
};

const MailContext = createContext<MailContextType | undefined>(undefined);

// Define folder priority order for proper display
const folderPriority: Record<string, number> = {
  'inbox': 0,
  'drafts': 1,
  'sent': 2,
  'archive': 3,
  'spam': 4,
  'trash': 5,
};

// Convert API folder data to MailFolder format
const convertApiFolderToMailFolder = (apiFolder: ApiFolder): MailFolder => {
  // Map API folder types to icon keys
  const iconMapping: Record<string, string> = {
    'inbox': 'inbox',
    'drafts': 'drafts',
    'sent': 'sent',
    'trash': 'trash',
    'spam': 'spam',
    'archive': 'archive',
  };

  const folderType = apiFolder.type.toLowerCase();
  
  return {
    id: apiFolder.id,
    key: folderType,
    name: apiFolder.name,
    icon: iconMapping[folderType] || 'folder',
    category: 'system' as const,
    order: folderPriority[folderType] ?? 999, // Use priority or put unknown folders at end
    unreadCount: apiFolder.unreadCount,
    totalCount: apiFolder.messageCount,
    color: null,
    parentId: apiFolder.parentId,
    children: [],
    canRename: false,
    canDelete: false,
    canMove: false,
    canCreateChildren: false,
  };
};

// Convert mock email data to Message format
const convertEmailToMessage = (email: any): Message => ({
  id: email.id,
  threadId: email.id,
  mailboxIds: {},
  keywords: {
    '$seen': !email.isUnread,
    '$flagged': email.isStarred,
  },
  subject: email.subject,
  from: [{ name: email.senderName, email: email.senderEmail }],
  to: [{ name: null, email: email.recipientEmail }],
  cc: null,
  bcc: null,
  receivedAt: new Date().toISOString(),
  size: 1000,
  hasAttachment: email.hasAttachment || false,
  preview: email.snippet,
});

const mockLabels: Label[] = [];

export function MailProvider({ children }: { children: React.ReactNode }) {
  const [folders, setFolders] = useState<MailFolder[]>([]);
  const [labels, setLabels] = useState<Label[]>(mockLabels);
  const [newsletters, setNewsletters] = useState<Message[]>([]);
  const [notifications, setNotifications] = useState<Message[]>([]);
  const [subscriptions, setSubscriptions] = useState<Message[]>([]);
  const [scheduled, setScheduled] = useState<Message[]>([]);

  const refreshFolders = async () => {
    try {
      const response = await fetchFolders();
      if (response.success && response.data) {
        const convertedFolders = response.data.map((folder) => 
          convertApiFolderToMailFolder(folder)
        );
        // Sort folders by order (based on folder priority)
        const sortedFolders = convertedFolders.sort((a, b) => a.order - b.order);
        setFolders(sortedFolders);
        setLabels(mockLabels); // Keep labels hardcoded for now
      } else {
        console.log('API response unsuccessful, setting empty folders');
        setFolders([]);
        setLabels(mockLabels);
      }
    } catch (error) {
      console.error('Failed to fetch folders from API, setting empty folders:', error);
      setFolders([]);
      setLabels(mockLabels);
    }
  };

  const refreshVirtualFolders = async () => {
    // No mock data - all data comes from API
    setNewsletters([]);
    setNotifications([]);
    setSubscriptions([]);
    setScheduled([]);
  };

  useEffect(() => {
    // Setup token refresh on mount
    setupTokenRefresh();
    
    refreshFolders();
    refreshVirtualFolders();
    
    // Cleanup token refresh on unmount
    return () => {
      clearTokenRefresh();
    };
  }, []);

  const unreadInboxCount = useMemo(() => {
    const inbox = folders.find(f => f.key === 'inbox');
    return inbox ? inbox.unreadCount : 0;
  }, [folders]);

  const deleteEmail = (id: string) => {
    // Placeholder for delete functionality
    console.log('Delete email:', id);
  };

  const toggleReadStatus = (id: string) => {
    // Placeholder for toggle read status functionality
    console.log('Toggle read status:', id);
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
      toggleReadStatus
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
