import { useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useNotifications } from '@/context/NotificationContext';
import { realtimeNotifications } from '@/lib/realtime';

export function useRealTimeNotifications() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  // Connect to real-time notifications when user is authenticated
  useEffect(() => {
    if (user?.id) {
      realtimeNotifications.connect(user.id);

      return () => {
        realtimeNotifications.disconnect();
      };
    }
  }, [user?.id]);

  // Subscribe to notification events
  useEffect(() => {
    const unsubscribeNotification = realtimeNotifications.subscribe('notification', (data) => {
      // Add the real-time notification to the notification context
      addNotification({
        id: data.id || `realtime_${Date.now()}`,
        type: data.notificationType || 'info',
        title: data.title,
        message: data.message,
        read: false,
        createdAt: data.timestamp
      });

      // Show browser notification if permission is granted
      if (Notification.permission === 'granted') {
        new Notification(data.title, {
          body: data.message,
          icon: '/favicon.ico',
          tag: data.id
        });
      }
    });

    const unsubscribeReservation = realtimeNotifications.subscribe('reservation_update', (data) => {
      addNotification({
        id: `reservation_${Date.now()}`,
        type: data.status === 'approved' ? 'success' : data.status === 'rejected' ? 'error' : 'info',
        title: `Reservation ${data.status}`,
        message: data.message,
        read: false,
        createdAt: data.timestamp
      });
    });

    const unsubscribeBorrowing = realtimeNotifications.subscribe('borrowing_update', (data) => {
      addNotification({
        id: `borrowing_${Date.now()}`,
        type: 'info',
        title: 'Borrowing Update',
        message: data.message,
        read: false,
        createdAt: data.timestamp
      });
    });

    const unsubscribeReminder = realtimeNotifications.subscribe('reminder', (data) => {
      addNotification({
        id: `reminder_${Date.now()}`,
        type: 'warning',
        title: 'Reminder',
        message: data.message,
        read: false,
        createdAt: data.timestamp
      });
    });

    return () => {
      unsubscribeNotification();
      unsubscribeReservation();
      unsubscribeBorrowing();
      unsubscribeReminder();
    };
  }, [addNotification]);

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }, []);

  // Send notification programmatically (for testing)
  const sendTestNotification = useCallback((title: string, message: string) => {
    realtimeNotifications.notify('notification', {
      id: `test_${Date.now()}`,
      title,
      message,
      notificationType: 'info'
    });
  }, []);

  return {
    requestNotificationPermission,
    sendTestNotification,
    isConnected: !!user?.id
  };
}