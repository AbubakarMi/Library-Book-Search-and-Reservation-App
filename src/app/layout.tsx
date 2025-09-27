import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Toaster } from '@/components/ui/toaster';
import { ConditionalHeader } from '@/components/layout/ConditionalHeader';
import { ConditionalBackButton } from '@/components/layout/ConditionalBackButton';
import { FloatingSearchButton } from '@/components/ui/floating-search';
import { RealTimeNotificationsHandler } from '@/components/notifications/RealTimeHandler';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'LibroReserva',
  description: 'A Library Book Search and Reservation Application',
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
      </head>
      <body className={cn('font-body antialiased', 'min-h-screen bg-background font-sans')}>
        <ErrorBoundary showDetails={false}>
          <ThemeProvider>
            <AuthProvider>
              <NotificationProvider>
                <div className="relative flex min-h-screen flex-col">
                  <ConditionalHeader />
                  <ConditionalBackButton />
                  <main className="flex-1">{children}</main>
                  <FloatingSearchButton />
                  <RealTimeNotificationsHandler />
                </div>
                <Toaster />
              </NotificationProvider>
            </AuthProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
