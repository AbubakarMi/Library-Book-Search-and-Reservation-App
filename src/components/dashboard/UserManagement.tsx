"use client";

import { useState } from 'react';
import { users as initialUsers } from '@/lib/mock-data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import type { User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { UserPlus, Ban, RotateCcw, Eye } from 'lucide-react';
import { format } from 'date-fns';

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(initialUsers.map(user => ({ ...user, isActive: true })));
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'staff' as const });
  const [suspensionReason, setSuspensionReason] = useState('');
  const { toast } = useToast();
  const { user: currentUser } = useAuth();

  const handleRoleChange = (userId: string, newRole: 'admin' | 'staff' | 'student') => {
    const targetUser = users.find(u => u.id === userId);

    // Prevent changing student roles
    if (targetUser?.role === 'student') {
      toast({
        title: "Action Not Allowed",
        description: "Cannot change the role of student accounts. Students can only be suspended.",
        variant: "destructive"
      });
      return;
    }

    setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user));
    toast({
        title: "User Role Updated",
        description: `${targetUser?.name || 'User'}'s role has been changed to ${newRole}.`,
    });
  };

  const handleSuspendUser = (userId: string, reason: string) => {
    setUsers(users.map(user =>
      user.id === userId
        ? {
            ...user,
            isActive: false,
            suspendedAt: new Date().toISOString(),
            suspendedBy: currentUser?.id,
            suspensionReason: reason
          }
        : user
    ));
    const user = users.find(u => u.id === userId);
    toast({
      title: "User Suspended",
      description: `${user?.name || 'User'} has been suspended.`,
    });
    setSuspensionReason('');
  };

  const handleActivateUser = (userId: string) => {
    setUsers(users.map(user =>
      user.id === userId
        ? {
            ...user,
            isActive: true,
            suspendedAt: undefined,
            suspendedBy: undefined,
            suspensionReason: undefined
          }
        : user
    ));
    const user = users.find(u => u.id === userId);
    toast({
      title: "User Activated",
      description: `${user?.name || 'User'} has been reactivated.`,
    });
  };

  const handleCreateUser = () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const user: User = {
      id: `user-${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      role: newUser.role,
      isActive: true,
      createdBy: currentUser?.id,
      avatarUrl: `https://i.pravatar.cc/150?u=${newUser.email}`
    };

    setUsers([...users, user]);
    toast({
      title: "User Created",
      description: `${user.name} has been created with role ${user.role}.`,
    });

    setNewUser({ name: '', email: '', password: '', role: 'staff' });
    setShowCreateDialog(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>User Management</CardTitle>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New User</DialogTitle>
                  <DialogDescription>
                    Create a new staff member with email and password. They can use these credentials to log in.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      placeholder="Enter password"
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select value={newUser.role} onValueChange={(value: 'staff') => setNewUser({ ...newUser, role: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="staff">Staff</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateUser}>
                    Create User
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className={!user.isActive ? 'opacity-60' : ''}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        {user.createdBy && (
                          <div className="text-xs text-muted-foreground">Created by admin</div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Select
                        value={user.role}
                        onValueChange={(value: 'admin' | 'staff' | 'student') => handleRoleChange(user.id, value)}
                        disabled={user.role === 'student'}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="staff">Staff</SelectItem>
                          <SelectItem value="student">Student</SelectItem>
                        </SelectContent>
                      </Select>
                      {user.role === 'student' && (
                        <span className="text-xs text-muted-foreground">(Protected)</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge variant={user.isActive ? 'default' : 'destructive'}>
                        {user.isActive ? 'Active' : 'Suspended'}
                      </Badge>
                      {!user.isActive && user.suspendedAt && (
                        <span className="text-xs text-muted-foreground">
                          Since {format(new Date(user.suspendedAt), 'MMM d, yyyy')}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {user.isActive ? (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Ban className="h-4 w-4 mr-1" />
                              Suspend
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Suspend User</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to suspend {user.name}? They will no longer be able to access the system.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="my-4">
                              <Label htmlFor="reason">Suspension Reason</Label>
                              <Textarea
                                id="reason"
                                value={suspensionReason}
                                onChange={(e) => setSuspensionReason(e.target.value)}
                                placeholder="Enter reason for suspension..."
                                className="mt-2"
                              />
                            </div>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleSuspendUser(user.id, suspensionReason)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Suspend User
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleActivateUser(user.id)}
                        >
                          <RotateCcw className="h-4 w-4 mr-1" />
                          Activate
                        </Button>
                      )}

                      {!user.isActive && user.suspensionReason && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Suspension Details</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-2">
                              <div>
                                <Label>User:</Label>
                                <p className="text-sm text-muted-foreground">{user.name}</p>
                              </div>
                              <div>
                                <Label>Suspended On:</Label>
                                <p className="text-sm text-muted-foreground">
                                  {user.suspendedAt && format(new Date(user.suspendedAt), 'MMM d, yyyy \\at h:mm a')}
                                </p>
                              </div>
                              <div>
                                <Label>Reason:</Label>
                                <p className="text-sm text-muted-foreground">{user.suspensionReason}</p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
