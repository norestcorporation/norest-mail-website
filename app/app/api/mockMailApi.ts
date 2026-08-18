// Mock API functions to replace old API integration
// This preserves all UI features including verified ticks, delivery status, threads, etc.

import { MOCK_EMAILS, MOCK_DRAFTS, MOCK_SENT, MOCK_SCHEDULED, MOCK_ARCHIVE, MOCK_NEWSLETTERS, MOCK_NOTIFICATIONS, MOCK_SUBSCRIPTIONS, Email } from '../data/mockData';

// Mock folder structure matching the old API format
export interface Folder {
  id: string;
  name: string;
  type: string;
  unreadCount: number;
  messageCount: number;
  parentId: string | null;
}

// Mock message structure matching the old API format
export interface ApiMessage {
  id: string;
  threadId: string;
  subject: string;
  from: { name: string | null; email: string }[];
  to: { name: string | null; email: string }[];
  preview: string;
  receivedAt: string;
  isUnread: boolean;
  isStarred: boolean;
  hasAttachment: boolean;
  // Additional UI features
  isOfficial?: boolean;
  deliveryStatus?: 'Sent' | 'Delivered' | 'Opened' | 'Replied';
  thread?: any[];
  scheduledTime?: string;
  lastEdited?: string;
  autoSaved?: boolean;
  labels?: string[];
}

// Convert mock email to API message format
const convertMockToApiMessage = (email: Email): ApiMessage => ({
  id: email.id,
  threadId: email.id,
  subject: email.subject,
  from: [{ name: email.senderName, email: email.senderEmail }],
  to: [{ name: null, email: email.recipientEmail }],
  preview: email.snippet,
  receivedAt: email.date,
  isUnread: email.isUnread,
  isStarred: email.isStarred,
  hasAttachment: email.hasAttachment || false,
  // Preserve UI features
  isOfficial: email.isOfficial,
  deliveryStatus: email.deliveryStatus,
  thread: email.thread,
  scheduledTime: email.scheduledTime,
  lastEdited: email.lastEdited,
  autoSaved: email.autoSaved,
  labels: email.labels,
});

// Mock folders
const mockFolders: Folder[] = [
  { id: 'inbox', name: 'Inbox', type: 'inbox', unreadCount: 5, messageCount: MOCK_EMAILS.length, parentId: null },
  { id: 'drafts', name: 'Drafts', type: 'drafts', unreadCount: 0, messageCount: MOCK_DRAFTS.length, parentId: null },
  { id: 'sent', name: 'Sent', type: 'sent', unreadCount: 0, messageCount: MOCK_SENT.length, parentId: null },
  { id: 'archive', name: 'Archive', type: 'archive', unreadCount: 0, messageCount: MOCK_ARCHIVE.length, parentId: null },
  { id: 'spam', name: 'Spam', type: 'spam', unreadCount: 0, messageCount: 0, parentId: null },
  { id: 'trash', name: 'Trash', type: 'trash', unreadCount: 0, messageCount: 0, parentId: null },
];

// Mock API functions
export const fetchFolders = async (): Promise<{ success: boolean; data: Folder[] }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return { success: true, data: mockFolders };
};

export const fetchMessages = async (folderId: string): Promise<{ success: boolean; data: ApiMessage[] }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let messages: Email[] = [];
  
  switch (folderId) {
    case 'inbox':
      messages = MOCK_EMAILS;
      break;
    case 'drafts':
      messages = MOCK_DRAFTS;
      break;
    case 'sent':
      messages = MOCK_SENT;
      break;
    case 'archive':
      messages = MOCK_ARCHIVE;
      break;
    case 'scheduled':
      messages = MOCK_SCHEDULED;
      break;
    case 'newsletters':
      messages = MOCK_NEWSLETTERS;
      break;
    case 'notifications':
      messages = MOCK_NOTIFICATIONS;
      break;
    case 'subscriptions':
      messages = MOCK_SUBSCRIPTIONS;
      break;
    default:
      messages = MOCK_EMAILS;
  }
  
  const apiMessages = messages.map(convertMockToApiMessage);
  return { success: true, data: apiMessages };
};

export const triggerMailboxSync = async (): Promise<{ success: boolean }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true };
};

// Draft functions (mock)
export const createDraft = async (data: any): Promise<{ success: boolean; data: any; meta: {}; requestId: string }> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const newDraft = {
    id: `d${Date.now()}`,
    mailboxId: 'drafts',
    subject: data.subject || '',
    to: data.to || [],
    cc: data.cc || [],
    bcc: data.bcc || [],
    preview: data.textBody?.substring(0, 100) || '',
    textBody: data.textBody || null,
    htmlBody: data.htmlBody || null,
    attachments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    revision: 1,
  };
  return { success: true, data: { draft: newDraft }, meta: {}, requestId: `req${Date.now()}` };
};

export const updateDraft = async (draftId: string, data: any, revision: number): Promise<{ success: boolean; data: any; meta: {}; requestId: string }> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return { 
    success: true, 
    data: { 
      draft: {
        id: draftId,
        mailboxId: 'drafts',
        ...data,
        revision: revision + 1,
        updatedAt: new Date().toISOString(),
      }
    },
    meta: {},
    requestId: `req${Date.now()}`
  };
};

export const autosaveDraft = async (draftId: string, data: any, revision: number): Promise<{ success: boolean; data: any; meta: {}; requestId: string }> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return { 
    success: true, 
    data: { 
      draft: {
        id: draftId,
        mailboxId: 'drafts',
        ...data,
        revision: revision + 1,
        updatedAt: new Date().toISOString(),
      }
    },
    meta: {},
    requestId: `req${Date.now()}`
  };
};

export const getDraft = async (draftId: string): Promise<{ success: boolean; data: any; meta: {}; requestId: string }> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  const draft = MOCK_DRAFTS.find(d => d.id === draftId);
  if (draft) {
    return { 
      success: true, 
      data: { 
        draft: {
          id: draft.id,
          mailboxId: 'drafts',
          subject: draft.subject,
          preview: draft.snippet,
          to: [{ name: null, email: draft.recipientEmail }],
          cc: [],
          bcc: [],
          textBody: draft.body,
          htmlBody: null,
          attachments: [],
          createdAt: draft.date,
          updatedAt: draft.lastEdited || draft.date,
          revision: 1,
        }
      },
      meta: {},
      requestId: `req${Date.now()}`
    };
  }
  return { success: false, data: null, meta: {}, requestId: `req${Date.now()}` };
};

export const sendDraft = async (draftId: string): Promise<{ success: boolean; data: any; meta: {}; requestId: string }> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { 
    success: true, 
    data: { 
      message: {
        draftId,
        messageId: `msg${Date.now()}`,
      }
    },
    meta: {},
    requestId: `req${Date.now()}`
  };
};

export const deleteDraft = async (draftId: string): Promise<{ success: boolean }> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return { success: true };
};

// Attachment functions (mock)
export const uploadAttachment = async (file: File): Promise<{ success: boolean; data: any; meta: {}; requestId: string }> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { 
    success: true, 
    data: { 
      uploadId: `upload${Date.now()}`,
      attachmentId: `att${Date.now()}`,
      filename: file.name,
      contentType: file.type,
      size: file.size,
    },
    meta: {},
    requestId: `req${Date.now()}`
  };
};

export const attachToDraft = async (draftId: string, uploadId: string): Promise<{ success: boolean }> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return { success: true };
};

export const removeAttachmentFromDraft = async (draftId: string, attachmentId: string): Promise<{ success: boolean }> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return { success: true };
};

// Message operations (mock)
export const deleteMessage = async (messageId: string): Promise<{ success: boolean }> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return { success: true };
};

export const toggleReadStatus = async (messageId: string, isRead: boolean): Promise<{ success: boolean }> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return { success: true };
};

export const toggleStarStatus = async (messageId: string, isStarred: boolean): Promise<{ success: boolean }> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return { success: true };
};

export const archiveMessage = async (messageId: string): Promise<{ success: boolean }> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return { success: true };
};

export const createDraftFromMessage = async (messageId: string, mode: 'REPLY' | 'REPLY_ALL' | 'FORWARD'): Promise<{ success: boolean; data: any; meta: {}; requestId: string }> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const originalMessage = MOCK_EMAILS.find(e => e.id === messageId);
  
  return { 
    success: true, 
    data: { 
      draft: {
        id: `d${Date.now()}`,
        mailboxId: 'drafts',
        subject: mode === 'REPLY' ? `Re: ${originalMessage?.subject || ''}` : 
                mode === 'REPLY_ALL' ? `Re: ${originalMessage?.subject || ''}` : 
                `Fwd: ${originalMessage?.subject || ''}`,
        preview: '',
        to: mode === 'REPLY' ? [{ name: originalMessage?.senderName, email: originalMessage?.senderEmail }] : [],
        cc: [],
        bcc: [],
        textBody: '',
        htmlBody: null,
        attachments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        revision: 1,
      }
    },
    meta: {},
    requestId: `req${Date.now()}`
  };
};