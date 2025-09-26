"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Book, FileText, Home, LayoutDashboard, Settings, Users, Bookmark, Calendar, RotateCcw, BookOpen, User } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DashboardSidebarProps {
  userRole: "user" | "admin";
}

const getCommonNavItems = (userRole: "user" | "admin") =>
  userRole === "admin" ? [] : [
    { href: "/", label: "Home", icon: Home }
  ];

const userNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/user/bookmarks", label: "Bookmarks", icon: Bookmark },
  { href: "/dashboard/user/borrowing", label: "Borrow Books", icon: BookOpen },
  { href: "/dashboard/user/borrowings", label: "My Books", icon: Book },
  { href: "/dashboard/user/returns", label: "Returns", icon: RotateCcw },
];

const adminNavItems = [
  { href: "/dashboard/admin/books", label: "Books", icon: Book },
  { href: "/dashboard/admin/reservations", label: "Reservations", icon: Calendar },
  { href: "/dashboard/admin/borrowing", label: "Borrowing", icon: BookOpen },
  { href: "/dashboard/admin/returns", label: "Returns", icon: RotateCcw },
  { href: "/dashboard/admin/users", label: "Users", icon: Users },
  { href: "/dashboard/admin/reports", label: "Reports", icon: FileText },
];

const getBottomNavItems = (userRole: "admin" | "staff" | "student") => [
  {
    href: userRole === "admin" ? "/dashboard/admin/profile" : "/dashboard/user/profile",
    label: "Profile",
    icon: User
  },
  { href: "#", label: "Settings", icon: Settings }
];

export default function DashboardSidebar({ userRole }: DashboardSidebarProps) {
  const pathname = usePathname();
  const commonNavItems = getCommonNavItems(userRole);
  const navItems = userRole === "admin" ? [...commonNavItems, ...adminNavItems] : [...commonNavItems, ...userNavItems];
  const bottomNavItems = getBottomNavItems(userRole);

  const MobileNavigation = () => (
    React.createElement("div", {
      className: "sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t"
    },
      React.createElement("div", {
        className: "flex items-center justify-around p-2"
      },
        ...navItems.slice(0, 4).map((item) =>
          React.createElement(Link, {
            key: item.href,
            href: item.href,
            className: cn(
              "flex flex-col items-center gap-1 p-2 rounded-lg text-xs transition-colors",
              pathname === item.href
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground"
            )
          },
            React.createElement(item.icon, { className: "h-5 w-5" }),
            React.createElement("span", { className: "text-xs truncate max-w-[60px]" }, item.label)
          )
        ),
        React.createElement(Link, {
          href: bottomNavItems[0].href,
          className: cn(
            "flex flex-col items-center gap-1 p-2 rounded-lg text-xs transition-colors",
            pathname === bottomNavItems[0].href
              ? "text-primary bg-primary/10"
              : "text-muted-foreground hover:text-foreground"
          )
        },
          React.createElement(bottomNavItems[0].icon, { className: "h-5 w-5" }),
          React.createElement("span", { className: "text-xs" }, "Profile")
        )
      )
    )
  );

  const DesktopSidebar = () => (
    React.createElement("aside", {
      className: "hidden w-16 flex-col border-r bg-background sm:flex"
    },
      React.createElement(TooltipProvider, null,
        React.createElement("nav", {
          className: "flex flex-col items-center gap-4 px-2 sm:py-5"
        },
          React.createElement(Link, {
            href: "/dashboard",
            className: "group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          },
            React.createElement(Book, { className: "h-4 w-4 transition-all group-hover:scale-110" }),
            React.createElement("span", { className: "sr-only" }, "LibroReserva")
          ),
          ...navItems.map((item) =>
            React.createElement(Tooltip, { key: item.href },
              React.createElement(TooltipTrigger, { asChild: true },
                React.createElement(Link, {
                  href: item.href,
                  className: cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
                    pathname === item.href && "bg-accent text-accent-foreground"
                  )
                },
                  React.createElement(item.icon, { className: "h-5 w-5" }),
                  React.createElement("span", { className: "sr-only" }, item.label)
                )
              ),
              React.createElement(TooltipContent, { side: "right" }, item.label)
            )
          )
        ),
        React.createElement("nav", {
          className: "mt-auto flex flex-col items-center gap-4 px-2 sm:py-5"
        },
          ...bottomNavItems.map((item) =>
            React.createElement(Tooltip, { key: item.href },
              React.createElement(TooltipTrigger, { asChild: true },
                React.createElement(Link, {
                  href: item.href,
                  className: cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
                    pathname === item.href && "bg-accent text-accent-foreground"
                  )
                },
                  React.createElement(item.icon, { className: "h-5 w-5" }),
                  React.createElement("span", { className: "sr-only" }, item.label)
                )
              ),
              React.createElement(TooltipContent, { side: "right" }, item.label)
            )
          )
        )
      )
    )
  );

  return React.createElement("div", { className: "navigation-wrapper" },
    React.createElement(MobileNavigation),
    React.createElement(DesktopSidebar)
  );
}