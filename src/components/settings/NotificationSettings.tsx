"use client";

import { useState, useEffect } from 'react';
import { Bell, Mail, Smartphone, Volume2, VolumeX, Clock, BookOpen, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { useServiceWorker } from '@/components/pwa/ServiceWorkerRegistration';

interface NotificationPreferences {
  // General settings
  enabled: boolean;
  sound: boolean;
  vibration: boolean;

  // Channel preferences
  reservations: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };

  dueDates: {
    email: boolean;
    push: boolean;
    inApp: boolean;
    reminderDays: number[];
  };

  bookAvailability: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };

  systemUpdates: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };

  // Timing preferences
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };

  // Frequency settings
  digestFrequency: 'instant' | 'daily' | 'weekly' | 'never';
  maxPerDay: number;
}

const defaultPreferences: NotificationPreferences = {
  enabled: true,
  sound: true,
  vibration: true,
  reservations: { email: true, push: true, inApp: true },
  dueDates: { email: true, push: true, inApp: true, reminderDays: [7, 3, 1] },
  bookAvailability: { email: true, push: true, inApp: true },
  systemUpdates: { email: false, push: false, inApp: true },
  quietHours: { enabled: false, start: '22:00', end: '08:00' },
  digestFrequency: 'instant',
  maxPerDay: 10
};

export function NotificationSettings() {
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const { toast } = useToast();
  const { requestNotificationPermission, subscribeToPushNotifications, unsubscribeFromPushNotifications } = useServiceWorker();

  // Load preferences on mount
  useEffect(() => {
    loadPreferences();
    checkNotificationPermission();
  }, []);

  const loadPreferences = () => {
    try {
      const saved = localStorage.getItem('notificationPreferences');
      if (saved) {
        setPreferences({ ...defaultPreferences, ...JSON.parse(saved) });
      }
    } catch (error) {
      console.error('Error loading notification preferences:', error);
    }
  };

  const savePreferences = async (newPreferences: NotificationPreferences) => {
    setIsLoading(true);
    try {
      localStorage.setItem('notificationPreferences', JSON.stringify(newPreferences));
      setPreferences(newPreferences);

      // Handle push notification subscription
      if (newPreferences.enabled && (
        newPreferences.reservations.push ||
        newPreferences.dueDates.push ||
        newPreferences.bookAvailability.push ||
        newPreferences.systemUpdates.push
      )) {
        await subscribeToPushNotifications();
      } else {
        await unsubscribeFromPushNotifications();
      }

      toast({
        title: "Settings Saved",
        description: "Your notification preferences have been updated.",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save notification preferences.",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkNotificationPermission = () => {
    if ('Notification' in window) {
      setHasPermission(Notification.permission === 'granted');
    }
  };

  const requestPermission = async () => {
    const granted = await requestNotificationPermission();
    setHasPermission(granted);

    if (granted) {
      toast({
        title: "Permission Granted",
        description: "You'll now receive push notifications.",
        duration: 3000,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Permission Denied",
        description: "Push notifications are disabled. You can enable them in your browser settings.",
        duration: 5000,
      });
    }
  };

  const testNotification = () => {
    if (hasPermission) {
      new Notification('LibroReserva Test', {
        body: 'This is a test notification from LibroReserva.',
        icon: '/icons/icon-192x192.png',
        tag: 'test-notification'
      });
    } else {
      toast({
        variant: "destructive",
        title: "Permission Required",
        description: "Please grant notification permission first.",
        duration: 3000,
      });
    }
  };

  const updatePreferences = (updates: Partial<NotificationPreferences>) => {
    const newPreferences = { ...preferences, ...updates };
    savePreferences(newPreferences);
  };

  const updateChannelPreference = (
    channel: keyof Pick<NotificationPreferences, 'reservations' | 'dueDates' | 'bookAvailability' | 'systemUpdates'>,
    type: 'email' | 'push' | 'inApp',
    value: boolean
  ) => {
    const newPreferences = {
      ...preferences,
      [channel]: {
        ...preferences[channel],
        [type]: value
      }
    };
    savePreferences(newPreferences);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Notification Settings</h2>
        <p className="text-muted-foreground">
          Manage how and when you receive notifications from LibroReserva.
        </p>
      </div>

      {/* Permission Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Smartphone className="h-5 w-5" />
            <span>Push Notifications</span>
          </CardTitle>
          <CardDescription>
            Enable push notifications to receive updates even when the app is closed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span>Browser Permission:</span>
              <Badge variant={hasPermission ? 'default' : 'destructive'}>
                {hasPermission ? 'Granted' : 'Not Granted'}
              </Badge>
            </div>
            {!hasPermission && (
              <Button onClick={requestPermission}>
                Grant Permission
              </Button>
            )}
          </div>

          {hasPermission && (
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={testNotification}>
                Test Notification
              </Button>
              <span className="text-sm text-muted-foreground">
                Send a test notification to verify everything works
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>General Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="notifications-enabled">Enable Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Master switch for all notifications
              </p>
            </div>
            <Switch
              id="notifications-enabled"
              checked={preferences.enabled}
              onCheckedChange={(checked) => updatePreferences({ enabled: checked })}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Volume2 className="h-4 w-4" />
              <Label htmlFor="sound">Sound</Label>
            </div>
            <Switch
              id="sound"
              checked={preferences.sound}
              onCheckedChange={(checked) => updatePreferences({ sound: checked })}
              disabled={!preferences.enabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Smartphone className="h-4 w-4" />
              <Label htmlFor="vibration">Vibration</Label>
            </div>
            <Switch
              id="vibration"
              checked={preferences.vibration}
              onCheckedChange={(checked) => updatePreferences({ vibration: checked })}
              disabled={!preferences.enabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Channels */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Types</CardTitle>
          <CardDescription>
            Choose which types of notifications you want to receive and how.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Reservations */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              <Label className="font-medium">Book Reservations</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Confirmations, ready for pickup, and status updates
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="reservations-email">Email</Label>
                <Switch
                  id="reservations-email"
                  checked={preferences.reservations.email}
                  onCheckedChange={(checked) =>
                    updateChannelPreference('reservations', 'email', checked)
                  }
                  disabled={!preferences.enabled}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="reservations-push">Push</Label>
                <Switch
                  id="reservations-push"
                  checked={preferences.reservations.push}
                  onCheckedChange={(checked) =>
                    updateChannelPreference('reservations', 'push', checked)
                  }
                  disabled={!preferences.enabled || !hasPermission}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="reservations-app">In-App</Label>
                <Switch
                  id="reservations-app"
                  checked={preferences.reservations.inApp}
                  onCheckedChange={(checked) =>
                    updateChannelPreference('reservations', 'inApp', checked)
                  }
                  disabled={!preferences.enabled}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Due Dates */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <Label className="font-medium">Due Date Reminders</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Reminders before books are due
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="due-dates-email">Email</Label>
                <Switch
                  id="due-dates-email"
                  checked={preferences.dueDates.email}
                  onCheckedChange={(checked) =>
                    updateChannelPreference('dueDates', 'email', checked)
                  }
                  disabled={!preferences.enabled}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="due-dates-push">Push</Label>
                <Switch
                  id="due-dates-push"
                  checked={preferences.dueDates.push}
                  onCheckedChange={(checked) =>
                    updateChannelPreference('dueDates', 'push', checked)
                  }
                  disabled={!preferences.enabled || !hasPermission}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="due-dates-app">In-App</Label>
                <Switch
                  id="due-dates-app"
                  checked={preferences.dueDates.inApp}
                  onCheckedChange={(checked) =>
                    updateChannelPreference('dueDates', 'inApp', checked)
                  }
                  disabled={!preferences.enabled}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Reminder Days</Label>
              <div className="flex flex-wrap gap-2">
                {[14, 7, 3, 1].map((days) => (
                  <Button
                    key={days}
                    variant={preferences.dueDates.reminderDays.includes(days) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      const current = preferences.dueDates.reminderDays;
                      const updated = current.includes(days)
                        ? current.filter(d => d !== days)
                        : [...current, days].sort((a, b) => b - a);

                      const newPreferences = {
                        ...preferences,
                        dueDates: {
                          ...preferences.dueDates,
                          reminderDays: updated
                        }
                      };
                      savePreferences(newPreferences);
                    }}
                    disabled={!preferences.enabled}
                  >
                    {days} day{days !== 1 ? 's' : ''}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Book Availability */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-green-500" />
              <Label className="font-medium">Book Availability</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              When reserved books become available
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="availability-email">Email</Label>
                <Switch
                  id="availability-email"
                  checked={preferences.bookAvailability.email}
                  onCheckedChange={(checked) =>
                    updateChannelPreference('bookAvailability', 'email', checked)
                  }
                  disabled={!preferences.enabled}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="availability-push">Push</Label>
                <Switch
                  id="availability-push"
                  checked={preferences.bookAvailability.push}
                  onCheckedChange={(checked) =>
                    updateChannelPreference('bookAvailability', 'push', checked)
                  }
                  disabled={!preferences.enabled || !hasPermission}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="availability-app">In-App</Label>
                <Switch
                  id="availability-app"
                  checked={preferences.bookAvailability.inApp}
                  onCheckedChange={(checked) =>
                    updateChannelPreference('bookAvailability', 'inApp', checked)
                  }
                  disabled={!preferences.enabled}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* System Updates */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4 text-purple-500" />
              <Label className="font-medium">System Updates</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Library announcements and system maintenance
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="system-email">Email</Label>
                <Switch
                  id="system-email"
                  checked={preferences.systemUpdates.email}
                  onCheckedChange={(checked) =>
                    updateChannelPreference('systemUpdates', 'email', checked)
                  }
                  disabled={!preferences.enabled}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="system-push">Push</Label>
                <Switch
                  id="system-push"
                  checked={preferences.systemUpdates.push}
                  onCheckedChange={(checked) =>
                    updateChannelPreference('systemUpdates', 'push', checked)
                  }
                  disabled={!preferences.enabled || !hasPermission}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="system-app">In-App</Label>
                <Switch
                  id="system-app"
                  checked={preferences.systemUpdates.inApp}
                  onCheckedChange={(checked) =>
                    updateChannelPreference('systemUpdates', 'inApp', checked)
                  }
                  disabled={!preferences.enabled}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quiet Hours */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="quiet-hours">Quiet Hours</Label>
                <p className="text-sm text-muted-foreground">
                  Disable notifications during specified hours
                </p>
              </div>
              <Switch
                id="quiet-hours"
                checked={preferences.quietHours.enabled}
                onCheckedChange={(checked) =>
                  updatePreferences({
                    quietHours: { ...preferences.quietHours, enabled: checked }
                  })
                }
                disabled={!preferences.enabled}
              />
            </div>

            {preferences.quietHours.enabled && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quiet-start">Start Time</Label>
                  <Select
                    value={preferences.quietHours.start}
                    onValueChange={(value) =>
                      updatePreferences({
                        quietHours: { ...preferences.quietHours, start: value }
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i.toString().padStart(2, '0');
                        return (
                          <SelectItem key={hour} value={`${hour}:00`}>
                            {hour}:00
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="quiet-end">End Time</Label>
                  <Select
                    value={preferences.quietHours.end}
                    onValueChange={(value) =>
                      updatePreferences({
                        quietHours: { ...preferences.quietHours, end: value }
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i.toString().padStart(2, '0');
                        return (
                          <SelectItem key={hour} value={`${hour}:00`}>
                            {hour}:00
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Digest Frequency */}
          <div className="space-y-3">
            <Label>Email Digest Frequency</Label>
            <p className="text-sm text-muted-foreground">
              How often to receive summary emails
            </p>
            <Select
              value={preferences.digestFrequency}
              onValueChange={(value: any) => updatePreferences({ digestFrequency: value })}
              disabled={!preferences.enabled}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instant">Instant</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="never">Never</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Max notifications per day */}
          <div className="space-y-3">
            <Label>Maximum Notifications Per Day</Label>
            <p className="text-sm text-muted-foreground">
              Limit push notifications to avoid overwhelming you
            </p>
            <div className="space-y-2">
              <Slider
                value={[preferences.maxPerDay]}
                onValueChange={([value]) => updatePreferences({ maxPerDay: value })}
                max={50}
                min={1}
                step={1}
                disabled={!preferences.enabled}
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>1</span>
                <span>{preferences.maxPerDay} notifications</span>
                <span>50</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reset Settings */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Reset to Defaults</Label>
              <p className="text-sm text-muted-foreground">
                Restore all notification settings to their default values
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => savePreferences(defaultPreferences)}
              disabled={isLoading}
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}