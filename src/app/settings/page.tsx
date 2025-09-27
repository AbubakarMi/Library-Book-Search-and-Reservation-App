"use client";

import { useState } from 'react';
import { Settings, Bell, User, Shield, Palette, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePWA } from '@/components/pwa/InstallPrompt';
import { useServiceWorker } from '@/components/pwa/ServiceWorkerRegistration';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const { isInstalled, isInstallable, install } = usePWA();
  const { clearCache } = useServiceWorker();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('notifications');

  const handleInstallApp = async () => {
    const success = await install();
    if (success) {
      toast({
        title: "App Installing",
        description: "LibroReserva is being installed on your device.",
        duration: 5000,
      });
    }
  };

  const handleClearCache = async () => {
    await clearCache();
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold flex items-center space-x-2">
            <Settings className="h-8 w-8" />
            <span>Settings</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your LibroReserva account preferences and app settings.
          </p>
        </div>

        {/* Settings Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Account</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="app" className="flex items-center space-x-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">App</span>
            </TabsTrigger>
          </TabsList>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <NotificationSettings />
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>
                    Manage your personal information and account settings.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Name</label>
                      <p className="text-sm text-muted-foreground">Update in dashboard</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <p className="text-sm text-muted-foreground">Contact support to change</p>
                    </div>
                  </div>
                  <Button variant="outline">
                    Go to Dashboard
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Password & Security</CardTitle>
                  <CardDescription>
                    Keep your account secure with a strong password.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline">
                    Change Password
                  </Button>
                  <Button variant="outline">
                    View Login History
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Data & Privacy</CardTitle>
                  <CardDescription>
                    Control how your data is used and stored.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="font-medium">Search History</label>
                        <p className="text-sm text-muted-foreground">
                          Save your search history for suggestions
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Clear History
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="font-medium">Usage Analytics</label>
                        <p className="text-sm text-muted-foreground">
                          Help improve the app with anonymous usage data
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="font-medium">Export Data</label>
                        <p className="text-sm text-muted-foreground">
                          Download a copy of your data
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Export
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cookies & Tracking</CardTitle>
                  <CardDescription>
                    Manage how websites track your activity.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    This app uses essential cookies for functionality and optional cookies for analytics.
                    You can manage these preferences in your browser settings.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* App Tab */}
          <TabsContent value="app">
            <div className="space-y-6">
              {/* PWA Installation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Download className="h-5 w-5" />
                    <span>App Installation</span>
                  </CardTitle>
                  <CardDescription>
                    Install LibroReserva as a native app for the best experience.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">App Status</div>
                      <p className="text-sm text-muted-foreground">
                        {isInstalled
                          ? 'App is installed and ready to use'
                          : isInstallable
                            ? 'App can be installed'
                            : 'Installation not available'
                        }
                      </p>
                    </div>
                    <Badge variant={isInstalled ? 'default' : isInstallable ? 'secondary' : 'outline'}>
                      {isInstalled ? 'Installed' : isInstallable ? 'Available' : 'Not Available'}
                    </Badge>
                  </div>

                  {isInstallable && !isInstalled && (
                    <Button onClick={handleInstallApp}>
                      <Download className="h-4 w-4 mr-2" />
                      Install App
                    </Button>
                  )}

                  {isInstalled && (
                    <div className="text-sm text-muted-foreground">
                      ✓ Offline functionality enabled<br />
                      ✓ Push notifications available<br />
                      ✓ Home screen shortcut added
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* App Cache */}
              <Card>
                <CardHeader>
                  <CardTitle>Storage & Cache</CardTitle>
                  <CardDescription>
                    Manage app data and storage.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium">Clear Cache</label>
                      <p className="text-sm text-muted-foreground">
                        Clear stored data to free up space
                      </p>
                    </div>
                    <Button variant="outline" onClick={handleClearCache}>
                      Clear Cache
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium">Offline Data</label>
                      <p className="text-sm text-muted-foreground">
                        Books and data stored for offline access
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* App Information */}
              <Card>
                <CardHeader>
                  <CardTitle>App Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Version:</span>
                      <span className="ml-2">1.0.0</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Last Updated:</span>
                      <span className="ml-2">Today</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Platform:</span>
                      <span className="ml-2">Web App</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Size:</span>
                      <span className="ml-2">~2.5 MB</span>
                    </div>
                  </div>

                  <div className="pt-4 space-y-2">
                    <Button variant="outline" size="sm">
                      View Changelog
                    </Button>
                    <Button variant="outline" size="sm">
                      Report Issue
                    </Button>
                    <Button variant="outline" size="sm">
                      Privacy Policy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}