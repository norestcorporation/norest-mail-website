// Mock Compose API functions to replace old compose_mail_api
import { uploadAttachment as uploadAttachmentMail } from './mockMailApi';
import { tokenManager } from '@/lib/token_manager';

export interface Mailbox {
  id: string;
  name: string;
  email: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  createdAt: string;
}

export const getMailbox = async (): Promise<{ success: boolean; data: { mailbox: Mailbox } }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return {
    success: true,
    data: {
      mailbox: {
        id: 'default',
        name: 'Norest Mail',
        email: 'ripun@norest.in',
      }
    }
  };
};

export const getUserProfile = async (): Promise<{ success: boolean; data: { profile: UserProfile } }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const email = tokenManager.getEmail();
  const id = tokenManager.getUserId();
  
  if (!email || !id) {
    return {
      success: false,
      data: {
        profile: {
          id: '',
          username: '',
          email: '',
          displayName: 'Guest',
          avatarUrl: null,
          createdAt: ''
        }
      }
    };
  }
  
  const username = email.split('@')[0];
  
  return {
    success: true,
    data: {
      profile: {
        id,
        username,
        email,
        displayName: username.charAt(0).toUpperCase() + username.slice(1),
        avatarUrl: null,
        createdAt: new Date().toISOString()
      }
    }
  };
};

export const sendMessage = async (data: any): Promise<{ success: boolean; data: any; meta: {}; requestId: string }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    success: true,
    data: {
      messageId: `msg${Date.now()}`,
      status: 'sent',
    },
    meta: {},
    requestId: `req${Date.now()}`
  };
};

export const uploadAttachment = async (file: File): Promise<{ success: boolean; data: any; meta: {}; requestId: string }> => {
  const result = await uploadAttachmentMail(file);
  return result as { success: boolean; data: any; meta: {}; requestId: string };
};