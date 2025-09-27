"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Book, FileText, Settings, Users, Calendar, ArrowLeft, BookOpen, UserCircle, Search, Library, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DashboardSidebarProps {
  userRole: "admin" | "staff" | "student";
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

export default function DashboardSidebar({ userRole }: DashboardSidebarProps) {
  const pathname = usePathname();
  const commonNavItems = getCommonNavItems(userRole);
  const navItems = userRole === "admin" ? [...commonNavItems, ...adminNavItems] : [...commonNavItems, ...userNavItems];
  const bottomNavItems = getBottomNavItems(userRole);

  const MobileNavigation = () => (
    React.createElement("div", {
      className: "md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t"
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
            React.createElement("span", null, "LibroReserva")
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

  return React.createElement("div", { className: "navigation-wrapper" },
    React.createElement(MobileNavigation),
    React.createElement(DesktopSidebar)
  );
}