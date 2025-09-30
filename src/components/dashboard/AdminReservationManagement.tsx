"use client";

import { useState, useEffect } from 'react';
import { books } from '@/lib/mock-data';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/context/NotificationContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MoreHorizontal, Check, X, Clock, BookOpen } from 'lucide-react';
import type { Reservation } from '@/lib/types';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { placeholderImages } from '@/lib/placeholder-images';

export default function AdminReservationManagement() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'complete' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [pickupDateTime, setPickupDateTime] = useState('');

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = () => {
    const storedReservations = localStorage.getItem('reservations');
    if (storedReservations) {
      const parsedReservations = JSON.parse(storedReservations);
      setReservations(parsedReservations);
    }
  };

  const getUserById = (userId: string) => {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      return users.find((u: any) => u.id === userId);
    }
    return null;
  };

  const pendingReservations = reservations.filter(r => r.status === 'pending');
  const activeReservations = reservations.filter(r => r.status === 'approved' || r.status === 'ready');
  const completedReservations = reservations.filter(r => r.status === 'completed' || r.status === 'cancelled' || r.status === 'rejected');

  const handleAction = (reservation: Reservation, action: 'approve' | 'reject' | 'complete') => {
    setSelectedReservation(reservation);
    setActionType(action);
  };

  const confirmAction = async () => {
    if (!selectedReservation || !actionType || !user) return;

    try {
      const student = getUserById(selectedReservation.userID);
      const book = books.find(b => b.id === selectedReservation.bookID);

      let updatedReservation;
      let studentNotification;

      switch (actionType) {
        case 'approve':
          if (!pickupDateTime) {
            addNotification({
              id: `error_${Date.now()}`,
              type: 'error',
              title: 'Pickup Time Required',
              message: 'Please set a pickup time for the student.',
              read: false,
              createdAt: new Date().toISOString()
            });
            return;
          }
          const pickupDate = new Date(pickupDateTime);
          const expiryDate = new Date(pickupDate.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from pickup

          updatedReservation = {
            ...selectedReservation,
            status: 'ready' as const,
            adminID: user.id,
            approvalDate: new Date().toISOString(),
            pickupDate: pickupDate.toISOString(),
            pickupDateTime: pickupDate.toISOString(),
            expiryDate: expiryDate.toISOString()
          };

          const formattedPickupDate = pickupDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });

          studentNotification = {
            id: `approval_${Date.now()}`,
            type: 'success',
            title: 'Book Ready for Pickup',
            message: `Your reservation for "${book?.title}" has been approved and is ready for pickup! Please collect your book by ${formattedPickupDate}. Available until ${expiryDate.toLocaleDateString()}.`,
            read: false,
            timestamp: new Date().toISOString()
          };
          break;

        case 'reject':
          if (!rejectionReason.trim()) {
            addNotification({
              id: `error_${Date.now()}`,
              type: 'error',
              title: 'Rejection Reason Required',
              message: 'Please provide a reason for rejection.',
              read: false,
              createdAt: new Date().toISOString()
            });
            return;
          }
          updatedReservation = {
            ...selectedReservation,
            status: 'rejected' as const,
            adminID: user.id,
            approvalDate: new Date().toISOString(),
            rejectionReason
          };
          studentNotification = {
            id: `rejection_${Date.now()}`,
            type: 'error',
            title: 'Reservation Rejected',
            message: `Your reservation for "${book?.title}" has been rejected. Reason: ${rejectionReason}`,
            read: false,
            timestamp: new Date().toISOString()
          };
          break;

        case 'complete':
          updatedReservation = {
            ...selectedReservation,
            status: 'completed' as const
          };
          studentNotification = {
            id: `borrowed_${Date.now()}`,
            type: 'info',
            title: 'Book Borrowed',
            message: `You have successfully borrowed "${book?.title}". Please return it by the due date.`,
            read: false,
            timestamp: new Date().toISOString()
          };
          break;

        default:
          return;
      }

      // Update reservations
      const updatedReservations = reservations.map(r =>
        r.id === selectedReservation.id ? updatedReservation : r
      );
      setReservations(updatedReservations);
      localStorage.setItem('reservations', JSON.stringify(updatedReservations));

      // Dispatch event for real-time updates across all components
      window.dispatchEvent(new Event('reservationUpdate'));

      // Send notification to student
      if (student && studentNotification) {
        const studentNotifications = localStorage.getItem(`notifications_${student.id}`);
        const notifications = studentNotifications ? JSON.parse(studentNotifications) : [];
        notifications.push(studentNotification);
        localStorage.setItem(`notifications_${student.id}`, JSON.stringify(notifications));

        // Dispatch event for real-time updates
        window.dispatchEvent(new CustomEvent('notificationUpdate', {
          detail: { userID: student.id, notification: studentNotification }
        }));
      }

      // Show admin notification
      addNotification({
        id: `admin_${actionType}_${Date.now()}`,
        type: actionType === 'reject' ? 'info' : 'success',
        title: `Reservation ${actionType === 'approve' ? 'Ready for Pickup' : actionType === 'reject' ? 'Rejected' : 'Completed'}`,
        message: `Successfully ${actionType === 'approve' ? 'marked as ready for pickup' : actionType === 'reject' ? 'rejected' : 'completed'} reservation for "${book?.title}"`,
        read: false,
        createdAt: new Date().toISOString()
      });

    } catch (error) {
      addNotification({
        id: `error_${Date.now()}`,
        type: 'error',
        title: 'Action Failed',
        message: 'Failed to process reservation action. Please try again.',
        read: false,
        createdAt: new Date().toISOString()
      });
    }

    setSelectedReservation(null);
    setActionType(null);
    setRejectionReason('');
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "ready":
      case "approved":
        return "bg-success hover:bg-success/80";
      case "pending":
        return "bg-warning text-warning-foreground hover:bg-warning/80";
      case "completed":
        return "bg-primary/20 text-primary-foreground hover:bg-primary/30";
      case "cancelled":
      case "rejected":
        return "bg-destructive/80 hover:bg-destructive/90";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'approve':
        return 'text-green-600';
      case 'reject':
        return 'text-red-600';
      case 'complete':
        return 'text-blue-600';
      default:
        return '';
    }
  };

  const ReservationTable = ({
    reservations,
    showActions = true
  }: {
    reservations: Reservation[],
    showActions?: boolean
  }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Book</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          {showActions && <TableHead><span className="sr-only">Actions</span></TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {reservations.map(reservation => {
          const book = books.find(b => b.id === reservation.bookID);
          const reservationUser = getUserById(reservation.userID);
          const coverImage = placeholderImages.find(p => p.id === book?.coverImageId) || placeholderImages[0];

          return (
            <TableRow key={reservation.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Image
                    src={coverImage.imageUrl}
                    alt={book?.title || ""}
                    width={32}
                    height={48}
                    className="rounded-sm"
                  />
                  <div>
                    <div className="font-medium">{book?.title || 'Unknown Book'}</div>
                    <div className="text-sm text-muted-foreground">{book?.author || 'Unknown Author'}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{reservationUser?.name || 'Unknown User'}</div>
                  <div className="text-sm text-muted-foreground">{reservationUser?.email || 'Unknown Email'}</div>
                </div>
              </TableCell>
              <TableCell>{reservation.reservationDate}</TableCell>
              <TableCell>
                <Badge className={cn("capitalize text-white", getStatusBadgeVariant(reservation.status))}>
                  {reservation.status}
                </Badge>
              </TableCell>
              {showActions && (
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      {reservation.status === 'pending' && (
                        <>
                          <DropdownMenuItem
                            onClick={() => handleAction(reservation, 'approve')}
                            className="text-green-600"
                          >
                            <Check className="mr-2 h-4 w-4" />
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleAction(reservation, 'reject')}
                            className="text-red-600"
                          >
                            <X className="mr-2 h-4 w-4" />
                            Reject
                          </DropdownMenuItem>
                        </>
                      )}
                      {reservation.status === 'ready' && (
                        <DropdownMenuItem
                          onClick={() => handleAction(reservation, 'complete')}
                          className="text-blue-600"
                        >
                          <BookOpen className="mr-2 h-4 w-4" />
                          Mark as Borrowed
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              )}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingReservations.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ready for Pickup</CardTitle>
            <Check className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeReservations.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reservations.filter(r => r.status === 'completed').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reservations</CardTitle>
            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reservations.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Reservations Management */}
      <Card>
        <CardHeader>
          <CardTitle>Reservation Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending">
            <TabsList>
              <TabsTrigger value="pending">
                Pending ({pendingReservations.length})
              </TabsTrigger>
              <TabsTrigger value="ready">
                Ready for Pickup ({activeReservations.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                History ({completedReservations.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              {pendingReservations.length > 0 ? (
                <ReservationTable reservations={pendingReservations} />
              ) : (
                <p className="text-muted-foreground p-4 text-center">No pending reservations.</p>
              )}
            </TabsContent>

            <TabsContent value="ready">
              {activeReservations.length > 0 ? (
                <ReservationTable reservations={activeReservations} />
              ) : (
                <p className="text-muted-foreground p-4 text-center">No books ready for pickup.</p>
              )}
            </TabsContent>

            <TabsContent value="completed">
              {completedReservations.length > 0 ? (
                <ReservationTable reservations={completedReservations} showActions={false} />
              ) : (
                <p className="text-muted-foreground p-4 text-center">No completed reservations.</p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Approve Dialog with Pickup Time */}
      <Dialog
        open={selectedReservation !== null && actionType === 'approve'}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedReservation(null);
            setActionType(null);
            setPickupDateTime('');
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Reservation</DialogTitle>
            <DialogDescription>
              Set a pickup time for the student and approve their reservation. They will be notified with the pickup details.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="pickup-time">Pickup Date and Time</Label>
              <Input
                id="pickup-time"
                type="datetime-local"
                value={pickupDateTime}
                onChange={(e) => setPickupDateTime(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className="mt-1"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Set when the student should pick up the book. Reservation expires 7 days after pickup date.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedReservation(null);
                setActionType(null);
                setPickupDateTime('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmAction}
              className="bg-green-600 hover:bg-green-700"
              disabled={!pickupDateTime}
            >
              Approve Reservation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete Dialog */}
      <AlertDialog
        open={selectedReservation !== null && actionType === 'complete'}
        onOpenChange={() => {
          setSelectedReservation(null);
          setActionType(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark as Borrowed</AlertDialogTitle>
            <AlertDialogDescription>
              This will mark the book as borrowed by the user.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAction}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Mark as Borrowed
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Rejection Dialog with Reason */}
      <Dialog
        open={selectedReservation !== null && actionType === 'reject'}
        onOpenChange={() => {
          setSelectedReservation(null);
          setActionType(null);
          setRejectionReason('');
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Reservation</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this reservation. The student will be notified with this reason.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedReservation(null);
                setActionType(null);
                setRejectionReason('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmAction}
              disabled={!rejectionReason.trim()}
            >
              Reject Reservation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}