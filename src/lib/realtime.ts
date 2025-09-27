// Real-time notification system using Server-Sent Events (SSE)
// This is lighter than WebSockets and perfect for one-way notifications

export class RealtimeNotifications {
  private static instance: RealtimeNotifications;
  private eventSource: EventSource | null = null;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  private constructor() {}

  static getInstance(): RealtimeNotifications {
    if (!RealtimeNotifications.instance) {
      RealtimeNotifications.instance = new RealtimeNotifications();
    }
    return RealtimeNotifications.instance;
  }

  connect(userId: string) {
    if (this.eventSource) {
      this.disconnect();
    }

    // Connect to Server-Sent Events endpoint
    this.eventSource = new EventSource(`/api/notifications/stream?userId=${userId}`);

    this.eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.notifyListeners(data.type, data);
      } catch (error) {
        console.error('Error parsing SSE message:', error);
      }
    };

    this.eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        if (this.eventSource?.readyState === EventSource.CLOSED) {
          this.connect(userId);
        }
      }, 5000);
    };

    this.eventSource.onopen = () => {
      console.log('Real-time notifications connected');
    };
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  subscribe(eventType: string, callback: (data: any) => void) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(callback);

    // Return unsubscribe function
    return () => {
      const eventListeners = this.listeners.get(eventType);
      if (eventListeners) {
        eventListeners.delete(callback);
        if (eventListeners.size === 0) {
          this.listeners.delete(eventType);
        }
      }
    };
  }

  private notifyListeners(eventType: string, data: any) {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }

    // Also notify 'all' listeners
    const allListeners = this.listeners.get('all');
    if (allListeners) {
      allListeners.forEach(callback => callback({ type: eventType, ...data }));
    }
  }

  // Send notification programmatically (for testing or local updates)
  notify(eventType: string, data: any) {
    this.notifyListeners(eventType, data);
  }
}

export const realtimeNotifications = RealtimeNotifications.getInstance();