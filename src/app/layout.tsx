import type { Metadata } from 'next';
import './globals.css';

export const dynamic = 'force-dynamic';
import { AuthProvider } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { OfflineProvider } from '@/context/OfflineContext';
import { Toaster } from '@/components/ui/toaster';
import { ConditionalHeader } from '@/components/layout/ConditionalHeader';
import { ConditionalBackButton } from '@/components/layout/ConditionalBackButton';
import { FloatingSearchButton } from '@/components/ui/floating-search';
import { RealTimeNotificationsHandler } from '@/components/notifications/RealTimeHandler';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { InstallPrompt } from '@/components/pwa/InstallPrompt';
import { ServiceWorkerRegistration } from '@/components/pwa/ServiceWorkerRegistration';
import { OfflineBanner } from '@/components/offline/OfflineIndicator';
import { Footer } from '@/components/layout/Footer';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Adustech Library',
  description: 'Aliko Dangote University Of Science and Technology Wudil - Library Management System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />

        {/* PWA Meta Tags */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Adustech Library" />
        <meta name="application-name" content="Adustech Library" />

        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192x192.png" />

        {/* Favicons */}
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />

        {/* Microsoft Tiles */}
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="msapplication-TileImage" content="/icons/icon-144x144.png" />

        {/* Viewport for mobile optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className={cn('font-body antialiased', 'min-h-screen bg-background font-sans')}>
        <ErrorBoundary showDetails={false}>
          <ThemeProvider>
            <OfflineProvider>
              <AuthProvider>
                <NotificationProvider>
                  <div className="relative flex min-h-screen flex-col">
                    <OfflineBanner />
                    <ConditionalHeader />
                    <ConditionalBackButton />
                    <main className="flex-1">{children}</main>
                    <Footer />
                    <FloatingSearchButton />
                    <RealTimeNotificationsHandler />
                    <InstallPrompt />
                    <ServiceWorkerRegistration />
                  </div>
                  <Toaster />
                </NotificationProvider>
              </AuthProvider>
            </OfflineProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
