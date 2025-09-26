"use client";

import { usePathname } from 'next/navigation';
import { BackButton } from '@/components/ui/back-button';

export function ConditionalBackButton() {
  const pathname = usePathname();

  // Don't show back button on dashboard pages or home page
  if (pathname.startsWith('/dashboard') || pathname === '/') {
    return null;
  }

  return (
    <div className="container mx-auto px-4 pt-4">
      <BackButton />
    </div>
  );
}