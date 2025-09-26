"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  className?: string;
  fallbackPath?: string;
}

export function BackButton({ className, fallbackPath = "/" }: BackButtonProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Don't show back button on dashboard pages
  if (pathname.startsWith('/dashboard')) {
    return null;
  }

  const handleBack = () => {
    // Check if there's browser history to go back to
    if (window.history.length > 1) {
      router.back();
    } else {
      // Fallback to home page if no history
      router.push(fallbackPath);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleBack}
      className={cn(
        "flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4",
        className
      )}
    >
      <ArrowLeft className="h-4 w-4" />
      Back
    </Button>
  );
}