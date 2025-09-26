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

  // Load notifications from localStorage for persistence
  useEffect(() => {
    const userId = sessionStorage.getItem('library_user') ? JSON.parse(sessionStorage.getItem('library_user')!).id : null;
    if (userId) {
      const savedNotifications = localStorage.getItem(`notifications_${userId}`);
      if (savedNotifications) {
        try {
          const parsed = JSON.parse(savedNotifications);
          setNotifications(parsed.map((n: any) => ({
            ...n,
            timestamp: new Date(n.timestamp)
          })));
        } catch (error) {
          console.error('Error loading notifications:', error);
        }
      }
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    const userId = sessionStorage.getItem('library_user') ? JSON.parse(sessionStorage.getItem('library_user')!).id : null;
    if (userId && notifications.length > 0) {
      localStorage.setItem(`notifications_${userId}`, JSON.stringify(notifications));
    }
  }, [notifications]);

  // Listen for welcome notifications from signup
  useEffect(() => {
    const handleNewNotification = (event: CustomEvent) => {
      const notificationData = event.detail;
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

    window.addEventListener('newNotification', handleNewNotification as EventListener);
    return () => {
      window.removeEventListener('newNotification', handleNewNotification as EventListener);
    };
  }, [toast]);

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
    const userId = sessionStorage.getItem('library_user') ? JSON.parse(sessionStorage.getItem('library_user')!).id : null;
    if (userId) {
      localStorage.removeItem(`notifications_${userId}`);
    }
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