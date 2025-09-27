"use client";

import { useState, useEffect } from 'react';
import { Home, Search, Bookmark, User, Bell, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { TouchGestures, useMobileDetection } from './TouchGestures';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/context/NotificationContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function MobileNavigation() {
  const { isMobile, isSmallScreen } = useMobileDetection();
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Hide/show navigation on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false); // Scrolling down, hide nav
      } else {
        setIsVisible(true); // Scrolling up, show nav
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const mainNavItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Search, label: 'Search', href: '/search' },
    { icon: Bookmark, label: 'Bookmarks', href: '/dashboard/user/bookmarks' },
    { icon: User, label: 'Profile', href: '/dashboard' }
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  if (!isMobile && !isSmallScreen) {
    return null; // Don't show mobile nav on desktop
  }

  return (
    <>
      {/* Bottom Navigation Bar */}
      <TouchGestures
        onSwipeUp={() => setIsVisible(true)}
        onSwipeDown={() => setIsVisible(false)}
      >
        <div
          className={`fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t transition-transform duration-300 ${
            isVisible ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <div className="flex items-center justify-around px-2 py-2 safe-bottom">
            {mainNavItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive(item.href) ? 'default' : 'ghost'}
                  size="sm"
                  className={`flex flex-col items-center space-y-1 h-auto py-2 px-3 ${
                    isActive(item.href)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="text-xs">{item.label}</span>
                </Button>
              </Link>
            ))}

            {/* Notifications with badge */}
            <div className="relative">
              <Link href="/dashboard/notifications">
                <Button
                  variant={isActive('/dashboard/notifications') ? 'default' : 'ghost'}
                  size="sm"
                  className={`flex flex-col items-center space-y-1 h-auto py-2 px-3 ${
                    isActive('/dashboard/notifications')
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Bell className="h-4 w-4" />
                  <span className="text-xs">Alerts</span>
                </Button>
              </Link>
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </TouchGestures>

      {/* Mobile Header with Menu */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b">
        <div className="flex items-center justify-between px-4 py-3 safe-top">
          <Link href="/" className="font-bold text-lg">
            LibroReserva
          </Link>

          <div className="flex items-center space-x-2">
            {/* User info */}
            {user && (
              <div className="text-sm text-muted-foreground">
                Hi, {user.name}
              </div>
            )}

            {/* Hamburger Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <MobileMenu />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Spacer for fixed header and bottom nav */}
      <div className="h-16" /> {/* Top spacer */}
      <div className="h-16" /> {/* Bottom spacer */}
    </>
  );
}

function MobileMenu() {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();

  const menuSections = [
    {
      title: 'Main',
      items: [
        { icon: Home, label: 'Home', href: '/' },
        { icon: Search, label: 'Advanced Search', href: '/search' },
        { icon: Bookmark, label: 'My Bookmarks', href: '/dashboard/user/bookmarks' },
      ]
    },
    {
      title: 'Account',
      items: user ? [
        { icon: User, label: 'Dashboard', href: '/dashboard' },
        { icon: Bell, label: `Notifications ${unreadCount > 0 ? `(${unreadCount})` : ''}`, href: '/dashboard/notifications' },
        ...(user.role === 'admin' ? [
          { icon: User, label: 'Admin Panel', href: '/dashboard/admin' }
        ] : []),
        ...(user.role === 'staff' ? [
          { icon: User, label: 'Staff Panel', href: '/dashboard/staff' }
        ] : [])
      ] : [
        { icon: User, label: 'Login', href: '/auth/login' },
        { icon: User, label: 'Sign Up', href: '/signup' }
      ]
    }
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-6 py-6">
        {menuSections.map((section) => (
          <div key={section.title}>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-3">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item, index) => (
                <Link key={index} href={item.href}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-auto py-3 px-3"
                  >
                    <item.icon className="h-4 w-4 mr-3" />
                    <span className="text-sm">{item.label}</span>
                    {item.label.includes('Notifications') && unreadCount > 0 && (
                      <Badge variant="destructive" className="ml-auto">
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      {user && (
        <div className="border-t py-4 px-3">
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full"
          >
            Sign Out
          </Button>
        </div>
      )}

      <div className="text-xs text-muted-foreground text-center py-2">
        Version 1.0.0
      </div>
    </div>
  );
}

// Floating Action Button for quick actions
export function FloatingActionButton() {
  const { isMobile } = useMobileDetection();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isMobile) return null;

  const actions = [
    { icon: Search, label: 'Search', href: '/search' },
    { icon: Bookmark, label: 'Bookmarks', href: '/dashboard/user/bookmarks' },
  ];

  return (
    <div className="fixed bottom-20 right-4 z-40">
      <TouchGestures onDoubleTap={() => setIsExpanded(!isExpanded)}>
        <div className="flex flex-col items-end space-y-2">
          {/* Action buttons */}
          {isExpanded && (
            <div className="flex flex-col space-y-2 animate-in slide-in-from-bottom-2">
              {actions.map((action, index) => (
                <Link key={index} href={action.href}>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-10 w-10 p-0 rounded-full shadow-lg bg-background/95 backdrop-blur-md"
                  >
                    <action.icon className="h-4 w-4" />
                  </Button>
                </Link>
              ))}
            </div>
          )}

          {/* Main FAB */}
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-12 w-12 p-0 rounded-full shadow-lg"
          >
            {isExpanded ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </TouchGestures>
    </div>
  );
}