"use client";

import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-background border-t mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Left side - App info */}
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} LibroReserva. All rights reserved.
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
          <div className="text-center md:text-right">
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

        {/* Mobile - Stacked layout for small screens */}
        <div className="md:hidden pt-4 border-t mt-4">
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
      </div>
    </footer>
  );
}