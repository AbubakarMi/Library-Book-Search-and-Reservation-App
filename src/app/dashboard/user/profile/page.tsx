"use client";
export const dynamic = 'force-dynamic';

import ProfileManagement from "@/components/profile/ProfileManagement";

export default function UserProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">
          Manage your account information and security settings.
        </p>
      </div>
      <ProfileManagement />
    </div>
  );
}