"use client";

import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-background border-t mt-auto">
      <div className="container mx-auto px-4 py-6">
        {/* Mobile Layout */}
        <div className="md:hidden space-y-4">
          {/* App info */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Adustech Library. All rights reserved.
            </p>
          </div>

          {/* Links */}
          <div className="flex justify-center items-center space-x-4 text-sm">
            <Link
              href="/privacy"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/support"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Support
            </Link>
          </div>

          {/* Powered by Nubenta */}
          <div className="text-center">
            <Link
              href="https://nubenta-group.vercel.app/technology"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>Powered by</span>
              <span className="font-semibold text-primary">Nubenta Technology Limited</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between">
          {/* Left side - App info */}
          <div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Adustech Library. All rights reserved.
            </p>
          </div>

          {/* Center - Links */}
          <div className="flex items-center space-x-6 text-sm">
            <Link
              href="/privacy"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/support"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Support
            </Link>
          </div>

          {/* Right side - Powered by Nubenta */}
          <div>
            <Link
              href="https://nubenta-group.vercel.app/technology"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              <span>Powered by</span>
              <span className="font-semibold text-primary">Nubenta Technology Limited</span>
              <ExternalLink className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}