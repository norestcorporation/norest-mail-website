import { getAccessToken } from '../token_manager';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface Thread {
  id: string;
  subject: string;
  participants: any;
  message_count: number;
  unread_count: number;
  snippet?: string;
  last_message_at: string;
}

export interface ThreadsResponse {
  threads: Thread[];
  next_cursor?: string;
}

export async function getThreads(accessToken: string, mailboxId: string, limit: number = 50, cursor: string = ""): Promise<ThreadsResponse | null> {
  try {
    const url = new URL(`${BASE_URL}/v1/mail/threads`);
    if (mailboxId) url.searchParams.append('mailbox_id', mailboxId);
    if (limit) url.searchParams.append('limit', limit.toString());
    if (cursor) url.searchParams.append('cursor', cursor);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`Error fetching threads: ${response.statusText}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching threads:", error);
    return null;
  }
}

export async function getThread(accessToken: string, threadId: string): Promise<Thread | null> {
  try {
    const response = await fetch(`${BASE_URL}/v1/mail/threads/${threadId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching thread:", error);
    return null;
  }
}

export async function getThreadMessages(accessToken: string, threadId: string): Promise<any | null> {
  try {
    console.log(`Fetching thread messages for thread ${threadId}`);
    const response = await fetch(`${BASE_URL}/v1/mail/threads/${threadId}/messages`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log(`Thread messages response status: ${response.status}`);

    if (!response.ok) {
      console.error(`Failed to fetch thread messages: ${response.status} ${response.statusText}`);
      if (response.status === 404) {
        console.log(`Thread ${threadId} not found, may be a single message`);
      }
      return null;
    }

    const data = await response.json();
    console.log(`Thread messages fetched successfully:`, data);
    return data;
  } catch (error) {
    console.error("Error fetching thread messages:", error);
    return null;
  }
}
