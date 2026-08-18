import { tokenManager } from '@/lib/token_manager';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Message types based on API response
export interface MessageEmailAddress {
  email: string;
  name?: string;
}

export interface MessageDetail {
  id: string;
  thread_id: string;
  mailbox_ids: string[];
  from: MessageEmailAddress[];
  to: MessageEmailAddress[];
  subject: string;
  preview: string;
  received_at: string;
  sent_at: string;
  size: number;
  has_attachment: boolean;
  is_read: boolean;
  is_starred: boolean;
  is_draft: boolean;
  text_body?: string;
  html_body?: string;
  message_id: string;
  cc?: MessageEmailAddress[];
  bcc?: MessageEmailAddress[];
  reply_to?: MessageEmailAddress[];
  attachments?: MessageAttachment[];
}

export interface MessageAttachment {
  id: string;
  blob_id?: string;
  filename: string;
  size: number;
  content_type: string;
  disposition?: string;
}

// Get message details by ID
export async function getMessageDetail(messageId: string): Promise<MessageDetail | null> {
  try {
    const token = tokenManager.getAccessToken();

    if (!token) {
      console.error('No access token found');
      return null;
    }

    const response = await fetch(`${BASE_URL}/v1/mail/messages/${messageId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get message detail: ${response.statusText}`);
    }

    const data: MessageDetail = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting message detail:", error);
    return null;
  }
}

// Get all messages for a thread
export async function getThreadMessagesApi(threadId: string): Promise<MessageDetail[] | null> {
  try {
    const token = tokenManager.getAccessToken();

    if (!token) {
      console.error('No access token found');
      return null;
    }

    const response = await fetch(`${BASE_URL}/v1/mail/threads/${threadId}/messages`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get thread messages: ${response.statusText}`);
    }

    const data = await response.json();
    // Handle both wrapped response {"messages": [...]} and direct array response
    const messages = data.messages || data;
    return messages as MessageDetail[];
  } catch (error) {
    console.error("Error getting thread messages:", error);
    return null;
  }
}