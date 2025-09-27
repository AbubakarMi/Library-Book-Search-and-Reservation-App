"use client";
export const dynamic = 'force-dynamic';

import ProfileManagement from "@/components/profile/ProfileManagement";

export default function AdminProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      <ProfileManagement />
    </div>
  );
}