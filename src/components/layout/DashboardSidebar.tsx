"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Book, FileText, Settings, Users, Calendar, ArrowLeft, BookOpen, UserCircle, Search, Library, TrendingUp, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DashboardSidebarProps {
  userRole: "admin" | "staff" | "student";
  onMobileMenuToggle?: () => void;
}

const getCommonNavItems = (userRole: "admin" | "staff" | "student") => [];

const userNavItems = [
  { href: "/dashboard/user/bookmarks", label: "Browse Books", icon: Search },
  { href: "/dashboard/user/borrowings", label: "My Books", icon: Library },
  { href: "/dashboard/user/returns", label: "Returns", icon: ArrowLeft },
];

const adminNavItems = [
  { href: "/dashboard/admin/books", label: "Books", icon: Book },
  { href: "/dashboard/admin/reservations", label: "Reservations", icon: Calendar },
  { href: "/dashboard/admin/borrowing", label: "Borrowing", icon: BookOpen },
  { href: "/dashboard/admin/returns", label: "Returns", icon: ArrowLeft },
  { href: "/dashboard/admin/users", label: "Users", icon: Users },
  { href: "/dashboard/admin/reports", label: "Reports", icon: TrendingUp },
];

const getBottomNavItems = (userRole: "admin" | "staff" | "student") => [
  {
    href: userRole === "admin" ? "/dashboard/admin/profile" : "/dashboard/user/profile",
    label: "Profile",
    icon: UserCircle
  },
  { href: "#", label: "Settings", icon: Settings }
];

export default function DashboardSidebar({ userRole, onMobileMenuToggle }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);
  const commonNavItems = getCommonNavItems(userRole);
  const navItems = userRole === "admin" ? [...commonNavItems, ...adminNavItems] : [...commonNavItems, ...userNavItems];
  const bottomNavItems = getBottomNavItems(userRole);

  const MobileSidebar = () => {
    if (!isMobileSidebarOpen) return null;

    return (
      <div className="md:hidden fixed inset-0 z-50">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setIsMobileSidebarOpen(false)}
        />

        {/* Sidebar */}
        <div className="relative w-64 h-full bg-background border-r shadow-xl">
          <div className="flex flex-col h-full">
            {/* Header with close button */}
            <div className="flex items-center justify-between p-4 border-b">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 font-semibold text-lg"
                onClick={() => setIsMobileSidebarOpen(false)}
              >
                <Book className="h-6 w-6 text-primary" />
                <span>Adustech</span>
              </Link>
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-accent"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation items */}
            <nav className="flex-1 flex flex-col gap-2 p-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-accent",
                    pathname === item.href && "bg-accent text-accent-foreground"
                  )}
                  onClick={() => setIsMobileSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              ))}

              {bottomNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-accent",
                    pathname === item.href && "bg-accent text-accent-foreground"
                  )}
                  onClick={() => setIsMobileSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    );
  };


  const DesktopSidebar = () => (
    React.createElement("aside", {
      className: "hidden w-64 flex-col border-r bg-background md:flex"
    },
      React.createElement(TooltipProvider, null,
        React.createElement("nav", {
          className: "flex flex-col gap-2 px-4 py-4"
        },
          React.createElement(Link, {
            href: "/dashboard",
            className: "group flex items-center gap-3 rounded-lg px-3 py-2 bg-primary text-primary-foreground font-semibold transition-all hover:bg-primary/90"
          },
            React.createElement(Book, { className: "h-5 w-5 transition-all group-hover:scale-110" }),
            React.createElement("span", null, "Adustech")
          ),
          ...navItems.map((item) =>
            React.createElement(Link, {
              key: item.href,
              href: item.href,
              className: cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-accent",
                pathname === item.href && "bg-accent text-accent-foreground"
              )
            },
              React.createElement(item.icon, { className: "h-5 w-5" }),
              React.createElement("span", null, item.label)
            )
          ),
          ...bottomNavItems.map((item) =>
            React.createElement(Link, {
              key: item.href,
              href: item.href,
              className: cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-accent",
                pathname === item.href && "bg-accent text-accent-foreground"
              )
            },
              React.createElement(item.icon, { className: "h-5 w-5" }),
              React.createElement("span", null, item.label)
            )
          )
        )
      )
    )
  );

  return (
    <div className="navigation-wrapper">
      <MobileSidebar />
      {React.createElement(DesktopSidebar)}

      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-40 p-2 rounded-lg bg-background border shadow-lg hover:bg-accent"
        onClick={() => setIsMobileSidebarOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </button>
    </div>
  );
}