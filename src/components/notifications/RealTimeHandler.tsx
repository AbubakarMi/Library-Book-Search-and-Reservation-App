"use client";

import { useEffect } from 'react';
import { useRealTimeNotifications } from '@/hooks/useRealTimeNotifications';

export function RealTimeNotificationsHandler() {
  const { requestNotificationPermission } = useRealTimeNotifications();

  useEffect(() => {
    // Request notification permission on component mount
    requestNotificationPermission();
  }, [requestNotificationPermission]);

  // This component doesn't render anything, it just handles real-time notifications
  return null;
}