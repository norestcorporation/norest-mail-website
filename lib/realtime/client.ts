const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface RealtimeEvent {
  user_id: string;
  event_type: string;
  payload: any;
}

export interface DeliveryStatusEvent {
  message_id: string;
  submission_id: string;
  recipient_email: string;
  status: string;
  error_message?: string;
  error_type?: string;
  smtp_reply?: string;
  is_permanent: boolean;
}

type EventHandler = (event: RealtimeEvent) => void;

class RealtimeClient {
  private ws: WebSocket | null = null;
  private token: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private eventHandlers: Map<string, Set<EventHandler>> = new Map();
  private isConnecting = false;

  constructor() {
    // Load token from localStorage on init
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('norest_access_token');
    }
  }

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  async connect(): Promise<void> {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      console.log('[Realtime] Already connected or connecting, skipping');
      return;
    }

    this.isConnecting = true;
    console.log('[Realtime] Starting connection...');

    try {
      // Get a WebSocket ticket
      console.log('[Realtime] Getting WebSocket ticket...');
      const ticket = await this.getTicket();
      if (!ticket) {
        throw new Error('Failed to get WebSocket ticket');
      }
      console.log('[Realtime] WebSocket ticket obtained successfully');

      // Construct WebSocket URL with ticket
      const wsUrl = `${BASE_URL.replace('http', 'ws')}/v1/mail/realtime?ticket=${ticket}`;
      console.log('[Realtime] Connecting to WebSocket endpoint...');
      
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('[Realtime] ✓ Connected successfully');
        console.log('[Realtime] Active subscriptions:', Array.from(this.eventHandlers.keys()));
        this.reconnectAttempts = 0;
        this.isConnecting = false;
      };

      this.ws.onmessage = (event) => {
        console.log('[Realtime] Raw message received:', event.data);
        try {
          const data = JSON.parse(event.data);
          console.log('[Realtime] Parsed event:', JSON.stringify(data, null, 2));
          this.handleEvent(data);
        } catch (error) {
          console.error('[Realtime] Failed to parse event:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('[Realtime] ✗ WebSocket error:', error);
        this.isConnecting = false;
      };

      this.ws.onclose = () => {
        console.log('[Realtime] ✗ Disconnected');
        this.isConnecting = false;
        this.ws = null;
        this.attemptReconnect();
      };
    } catch (error) {
      console.error('[Realtime] ✗ Connection failed:', error);
      this.isConnecting = false;
      this.attemptReconnect();
    }
  }

  private async getTicket(): Promise<string | null> {
    try {
      console.log('[Realtime] Requesting WebSocket ticket...');
      
      if (!this.token) {
        console.error('[Realtime] ✗ No token available');
        return null;
      }
      console.log('[Realtime] Token available, length:', this.token.length);

      const response = await fetch(`${BASE_URL}/v1/mail/realtime/ticket`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('[Realtime] Ticket response status:', response.status, response.statusText);

      if (!response.ok) {
        console.error('[Realtime] ✗ Failed to get ticket:', response.statusText);
        const errorText = await response.text();
        console.error('[Realtime] Error response:', errorText);
        return null;
      }

      const data = await response.json();
      console.log('[Realtime] ✓ Ticket obtained successfully');
      return data.ticket;
    } catch (error) {
      console.error('[Realtime] ✗ Ticket request failed:', error);
      return null;
    }
  }

  private handleEvent(event: RealtimeEvent) {
    console.log('[Realtime] Handling event:', event.event_type);
    console.log('[Realtime] Event payload:', JSON.stringify(event.payload, null, 2));
    
    const handlers = this.eventHandlers.get(event.event_type);
    console.log('[Realtime] Found handlers for event type:', event.event_type, handlers?.size || 0);
    
    if (handlers) {
      handlers.forEach(handler => {
        try {
          console.log('[Realtime] Dispatching event to handler');
          handler(event);
        } catch (error) {
          console.error('[Realtime] Handler error:', error);
        }
      });
    } else {
      console.log('[Realtime] No handlers registered for event type:', event.event_type);
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('[Realtime] Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(`[Realtime] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);

    setTimeout(() => {
      this.connect();
    }, delay);
  }

  subscribe(eventType: string, handler: EventHandler) {
    console.log('[Realtime] Subscribing to event type:', eventType);
    
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, new Set());
      console.log('[Realtime] Created new handler set for:', eventType);
    }
    this.eventHandlers.get(eventType)!.add(handler);
    console.log('[Realtime] Total handlers for', eventType, ':', this.eventHandlers.get(eventType)!.size);

    // Auto-connect if not connected
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.log('[Realtime] WebSocket not connected, initiating connection...');
      this.connect();
    } else {
      console.log('[Realtime] WebSocket already connected');
    }
  }

  unsubscribe(eventType: string, handler: EventHandler) {
    console.log('[Realtime] Unsubscribing from event type:', eventType);
    
    const handlers = this.eventHandlers.get(eventType);
    if (handlers) {
      handlers.delete(handler);
      console.log('[Realtime] Remaining handlers for', eventType, ':', handlers.size);
      if (handlers.size === 0) {
        this.eventHandlers.delete(eventType);
        console.log('[Realtime] Removed handler set for:', eventType);
      }
    } else {
      console.log('[Realtime] No handlers found for:', eventType);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.reconnectAttempts = 0;
    this.isConnecting = false;
  }
}

// Singleton instance
export const realtimeClient = new RealtimeClient();
