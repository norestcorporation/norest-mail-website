const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Mark message as read
export async function markAsRead(accessToken: string, messageId: string): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/v1/mail/messages/${messageId}/read`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to mark as read: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error("Error marking as read:", error);
    return false;
  }
}

// Mark message as unread
export async function markAsUnread(accessToken: string, messageId: string): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/v1/mail/messages/${messageId}/unread`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to mark as unread: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error("Error marking as unread:", error);
    return false;
  }
}

// Star message
export async function starMessage(accessToken: string, messageId: string): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/v1/mail/messages/${messageId}/star`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to star message: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error("Error starring message:", error);
    return false;
  }
}

// Unstar message
export async function unstarMessage(accessToken: string, messageId: string): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/v1/mail/messages/${messageId}/unstar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to unstar message: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error("Error unstarring message:", error);
    return false;
  }
}

// Archive message
export async function archiveMessage(accessToken: string, messageId: string): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/v1/mail/messages/${messageId}/archive`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to archive message: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error("Error archiving message:", error);
    return false;
  }
}

// Unarchive message (move to inbox)
export async function unarchiveMessage(accessToken: string, messageId: string, inboxMailboxId: string): Promise<boolean> {
  try {
    console.log(`Unarchiving message ${messageId} to inbox ${inboxMailboxId}`);
    const response = await fetch(`${BASE_URL}/v1/mail/messages/${messageId}/move`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mailbox_id: inboxMailboxId }),
    });

    console.log(`Unarchive response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to unarchive message: ${response.statusText} - ${errorText}`);
      throw new Error(`Failed to unarchive message: ${response.statusText} - ${errorText}`);
    }

    console.log('Unarchive successful');
    return true;
  } catch (error) {
    console.error("Error unarchiving message:", error);
    return false;
  }
}

// Move message to mailbox
export async function moveMessage(accessToken: string, messageId: string, mailboxId: string): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/v1/mail/messages/${messageId}/move`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mailbox_id: mailboxId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to move message: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error("Error moving message:", error);
    return false;
  }
}

// Trash message
export async function trashMessage(accessToken: string, messageId: string): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/v1/mail/messages/${messageId}/trash`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to trash message: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error("Error trashing message:", error);
    return false;
  }
}

// Restore message
export async function restoreMessage(accessToken: string, messageId: string): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/v1/mail/messages/${messageId}/restore`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to restore message: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error("Error restoring message:", error);
    return false;
  }
}

// Mark as spam
export async function markAsSpam(accessToken: string, messageId: string): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/v1/mail/messages/${messageId}/spam`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to mark as spam: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error("Error marking as spam:", error);
    return false;
  }
}
