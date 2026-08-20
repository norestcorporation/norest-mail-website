import { Reaction } from './message_viewer';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface Mailbox {
  id: string;
  name: string;
  role: string;
  total_emails: number;
  unread_emails: number;
  total_threads: number;
  unread_threads: number;
}

export interface MailboxesResponse {
  mailboxes: Mailbox[];
}

export interface Message {
  id: string;
  thread_id?: string;
  subject?: string;
  preview?: string;
  from?: Array<{ name?: string; email: string }>;
  to?: Array<{ name?: string; email: string }>;
  cc?: Array<{ name?: string; email: string }>;
  bcc?: Array<{ name?: string; email: string }>;
  reply_to?: Array<{ name?: string; email: string }>;
  received_at?: string;
  sent_at?: string;
  is_read?: boolean;
  is_starred?: boolean;
  is_draft?: boolean;
  has_attachment?: boolean;
  attachments?: any[];
  reactions?: Reaction[];
  [key: string]: any;
}

export interface MessagesResponse {
  messages: Message[];
  total: number;
  position: number;
}

export async function getMailboxes(accessToken: string): Promise<MailboxesResponse | null> {
  try {
    console.log('Fetching mailboxes from:', `${BASE_URL}/v1/mail/mailboxes`);

    const response = await fetch(`${BASE_URL}/v1/mail/mailboxes`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Mailboxes response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error fetching mailboxes:', errorText);
      throw new Error(`Failed to fetch mailboxes: ${response.statusText} - ${errorText}`);
    }

    const data: MailboxesResponse = await response.json();
    console.log('Mailboxes fetched successfully:', data);
    return data;
  } catch (error) {
    console.error("Error fetching mailboxes:", error);
    return null;
  }
}

export async function getMessages(accessToken: string, mailboxId: string, limit: number = 100): Promise<MessagesResponse | null> {
  try {
    console.log(`Fetching messages for mailbox ${mailboxId} from:`, `${BASE_URL}/v1/mail/messages?mailbox_id=${mailboxId}&limit=${limit}`);

    const response = await fetch(`${BASE_URL}/v1/mail/messages?mailbox_id=${mailboxId}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Messages response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error fetching messages:', errorText);
      throw new Error(`Failed to fetch messages: ${response.statusText} - ${errorText}`);
    }

    const data: MessagesResponse = await response.json();
    console.log('Messages fetched successfully:', data);
    return data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    return null;
  }
}