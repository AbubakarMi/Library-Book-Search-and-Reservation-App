"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
  bookId?: string;
  reservationId?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  sendReservationNotification: (bookTitle: string, status: 'confirmed' | 'ready' | 'overdue') => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();

  // Initialize with some mock notifications
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'success',
        title: 'Book Reserved Successfully',
        message: 'Your reservation for "The Great Gatsby" has been confirmed.',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        read: false,
        actionUrl: '/dashboard/user',
        actionText: 'View Reservations',
        bookId: '1'
      },
      {
        id: '2',
        type: 'info',
        title: 'Book Ready for Pickup',
        message: '"To Kill a Mockingbird" is now available for pickup at the front desk.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        read: false,
        actionUrl: '/dashboard/user',
        actionText: 'View Details'
      },
      {
        id: '3',
        type: 'warning',
        title: 'Return Reminder',
        message: 'Your book "1984" is due for return in 2 days.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        read: true,
        actionUrl: '/dashboard/user',
        actionText: 'Extend Loan'
      }
    ];
    setNotifications(mockNotifications);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Show toast notification
    toast({
      title: newNotification.title,
      description: newNotification.message,
      duration: 5000,
    });
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const sendReservationNotification = (bookTitle: string, status: 'confirmed' | 'ready' | 'overdue') => {
    let notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>;

    switch (status) {
      case 'confirmed':
        notificationData = {
          type: 'success',
          title: 'Reservation Confirmed',
          message: `Your reservation for "${bookTitle}" has been confirmed. You'll be notified when it's ready for pickup.`,
          actionUrl: '/dashboard/user',
          actionText: 'View Reservations'
        };
        break;
      case 'ready':
        notificationData = {
          type: 'info',
          title: 'Book Ready for Pickup',
          message: `"${bookTitle}" is now available for pickup at the library front desk.`,
          actionUrl: '/dashboard/user',
          actionText: 'View Details'
        };
        break;
      case 'overdue':
        notificationData = {
          type: 'warning',
          title: 'Return Reminder',
          message: `"${bookTitle}" is overdue. Please return it as soon as possible to avoid late fees.`,
          actionUrl: '/dashboard/user',
          actionText: 'View Details'
        };
        break;
    }

    addNotification(notificationData);
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      removeNotification,
      clearAll,
      sendReservationNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}