"use client";

import { useState, useEffect } from 'react';
import { reservations as initialReservations, books } from '@/lib/mock-data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '@/lib/utils';
import { X, Calendar, Clock, CheckCircle, PackageCheck } from 'lucide-react';
import Image from 'next/image';
import { placeholderImages } from '@/lib/placeholder-images';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/context/NotificationContext';
import type { Reservation } from '@/lib/types';

export default function UserReservations() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showPickupDialog, setShowPickupDialog] = useState(false);

  useEffect(() => {
    loadReservations();

    // Listen for reservation updates
    const handleReservationUpdate = () => {
      loadReservations();
    };

    window.addEventListener('storage', handleReservationUpdate);
    window.addEventListener('reservationUpdate', handleReservationUpdate);

    return () => {
      window.removeEventListener('storage', handleReservationUpdate);
      window.removeEventListener('reservationUpdate', handleReservationUpdate);
    };
  }, []);

  const loadReservations = () => {
    const storedReservations = localStorage.getItem('reservations');
    if (storedReservations) {
      setReservations(JSON.parse(storedReservations));
    } else {
      setReservations(initialReservations);
    }
  };

  // Filter reservations for current user
  const userReservations = reservations.filter(r => r.userID === user?.id);
  const currentReservations = userReservations.filter(r =>
    r.status === 'pending' || r.status === 'ready' || r.status === 'approved' || r.status === 'picked_up'
  );
  const pastReservations = userReservations.filter(r =>
    r.status === 'completed' || r.status === 'cancelled' || r.status === 'rejected'
  );

  const handleCancelReservation = async () => {
    if (!selectedReservation || !user) return;

    const updatedReservations = reservations.map(r =>
      r.id === selectedReservation.id
        ? { ...r, status: 'cancelled' as const }
        : r
    );

    setReservations(updatedReservations);
    localStorage.setItem('reservations', JSON.stringify(updatedReservations));

    const book = books.find(b => b.id === selectedReservation.bookID);

    addNotification({
      id: `notification-${Date.now()}`,
      type: 'info',
      title: 'Reservation Cancelled',
      message: `Your reservation for "${book?.title || 'Unknown Book'}" has been cancelled.`,
      read: false,
      createdAt: new Date().toISOString()
    });

    setShowCancelDialog(false);
    setSelectedReservation(null);
  };

  const handlePickupBook = async () => {
    if (!selectedReservation || !user) return;

    const actualPickupDate = new Date();
    const expectedReturnDate = new Date(actualPickupDate.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days from pickup

    const updatedReservation = {
      ...selectedReservation,
      status: 'picked_up' as const,
      actualPickupDate: actualPickupDate.toISOString(),
      expectedReturnDate: expectedReturnDate.toISOString()
    };

    const updatedReservations = reservations.map(r =>
      r.id === selectedReservation.id ? updatedReservation : r
    );

    setReservations(updatedReservations);
    localStorage.setItem('reservations', JSON.stringify(updatedReservations));

    // Update book status to reserved
    const storedBooks = localStorage.getItem('books');
    if (storedBooks) {
      const booksArray = JSON.parse(storedBooks);
      const updatedBooks = booksArray.map((b: any) =>
        b.id === selectedReservation.bookID
          ? { ...b, availabilityStatus: 'reserved' }
          : b
      );
      localStorage.setItem('books', JSON.stringify(updatedBooks));
      window.dispatchEvent(new Event('bookUpdate'));
    }

    // Dispatch reservation update event
    window.dispatchEvent(new Event('reservationUpdate'));

    const book = books.find(b => b.id === selectedReservation.bookID);

    // Notify user
    addNotification({
      id: `pickup_${Date.now()}`,
      type: 'success',
      title: 'Book Picked Up',
      message: `You have picked up "${book?.title}". Please return it by ${expectedReturnDate.toLocaleDateString()}.`,
      read: false,
      createdAt: new Date().toISOString()
    });

    // Notify admin
    const adminUsers = localStorage.getItem('users');
    if (adminUsers) {
      const users = JSON.parse(adminUsers);
      const admins = users.filter((u: any) => u.role === 'admin');

      admins.forEach((admin: any) => {
        const adminNotification = {
          id: `admin_pickup_${Date.now()}_${admin.id}`,
          type: 'info',
          title: 'Book Picked Up',
          message: `${user.name} picked up "${book?.title}". Expected return: ${expectedReturnDate.toLocaleDateString()}.`,
          read: false,
          timestamp: new Date().toISOString()
        };

        const adminNotifications = localStorage.getItem(`notifications_${admin.id}`);
        const notifications = adminNotifications ? JSON.parse(adminNotifications) : [];
        notifications.push(adminNotification);
        localStorage.setItem(`notifications_${admin.id}`, JSON.stringify(notifications));

        window.dispatchEvent(new CustomEvent('notificationUpdate', {
          detail: { userID: admin.id, notification: adminNotification }
        }));
      });
    }

    setShowPickupDialog(false);
    setSelectedReservation(null);
  };

  const openCancelDialog = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setShowCancelDialog(true);
  };

  const openPickupDialog = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setShowPickupDialog(true);
  };

  const getStatusBadgeVariant = (status: "pending" | "ready" | "completed" | "cancelled" | "approved" | "rejected" | "picked_up") => {
    switch (status) {
      case "ready":
        return "bg-success hover:bg-success/80";
      case "pending":
        return "bg-warning text-warning-foreground hover:bg-warning/80";
      case "approved":
        return "bg-blue-500 hover:bg-blue-600";
      case "picked_up":
        return "bg-purple-500 hover:bg-purple-600";
      case "completed":
        return "bg-primary/20 text-primary-foreground hover:bg-primary/30";
      case "cancelled":
        return "bg-destructive/80 hover:bg-destructive/90";
      case "rejected":
        return "bg-red-500 hover:bg-red-600";
    }
  };

  const ReservationTable = ({
    reservations,
    showActions = true
  }: {
    reservations: typeof currentReservations,
    showActions?: boolean
  }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Book</TableHead>
          <TableHead>Reservation Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Pickup Time</TableHead>
          {showActions && <TableHead>Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {reservations.map(reservation => {
          const book = books.find(b => b.id === reservation.bookID);
          const coverImage = placeholderImages.find(p => p.id === book?.coverImageId) || placeholderImages[0];
          return (
            <TableRow key={reservation.id}>
              <TableCell>
                <div className="flex items-center gap-4">
                  <Image src={coverImage.imageUrl} alt={book?.title || ""} width={40} height={60} className="rounded-sm" />
                  <div>
                    <div className="font-medium">{book?.title || 'Unknown Book'}</div>
                    <div className="text-sm text-muted-foreground">{book?.author || 'Unknown Author'}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{reservation.reservationDate}</TableCell>
              <TableCell>
                <Badge className={cn("capitalize text-white flex items-center gap-1", getStatusBadgeVariant(reservation.status))}>
                  {reservation.status === 'pending' && <Clock className="h-3 w-3" />}
                  {reservation.status === 'approved' && <CheckCircle className="h-3 w-3" />}
                  {reservation.status === 'ready' && <CheckCircle className="h-3 w-3" />}
                  {reservation.status === 'picked_up' && <PackageCheck className="h-3 w-3" />}
                  {reservation.status === 'completed' && <CheckCircle className="h-3 w-3" />}
                  {reservation.status === 'cancelled' && <X className="h-3 w-3" />}
                  {reservation.status === 'rejected' && <X className="h-3 w-3" />}
                  {reservation.status === 'picked_up' ? 'Picked Up' : reservation.status}
                </Badge>
              </TableCell>
              <TableCell>
                {reservation.status === 'ready' && reservation.pickupDateTime ? (
                  <div className="text-sm">
                    <div className="font-medium text-green-600">
                      {new Date(reservation.pickupDateTime).toLocaleDateString()}
                    </div>
                    <div className="text-muted-foreground">
                      {new Date(reservation.pickupDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ) : reservation.status === 'picked_up' && reservation.expectedReturnDate ? (
                  <div className="text-sm">
                    <div className="font-medium text-purple-600">Return by:</div>
                    <div className="text-muted-foreground">
                      {new Date(reservation.expectedReturnDate).toLocaleDateString()}
                    </div>
                  </div>
                ) : reservation.status === 'completed' ? (
                  <div className="text-sm text-muted-foreground">Completed</div>
                ) : (
                  <div className="text-sm text-muted-foreground">-</div>
                )}
              </TableCell>
              {showActions && (
                <TableCell>
                  <div className="flex gap-2">
                    {reservation.status === 'ready' && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => openPickupDialog(reservation)}
                        className="h-8 px-3 bg-green-600 hover:bg-green-700"
                      >
                        <PackageCheck className="h-3 w-3 mr-1" />
                        Pick Up
                      </Button>
                    )}
                    {(reservation.status === 'pending' || reservation.status === 'ready' || reservation.status === 'approved') && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => openCancelDialog(reservation)}
                        className="h-8 px-3"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Cancel
                      </Button>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Reservations</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="current">
          <TabsList>
            <TabsTrigger value="current">Current</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <TabsContent value="current">
            {currentReservations.length > 0 ? (
                <ReservationTable reservations={currentReservations} />
            ) : (
                <p className="text-muted-foreground p-4 text-center">You have no current reservations.</p>
            )}
          </TabsContent>
          <TabsContent value="history">
            {pastReservations.length > 0 ? (
                <ReservationTable reservations={pastReservations} showActions={false} />
             ) : (
                <p className="text-muted-foreground p-4 text-center">You have no past reservations.</p>
             )}
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Reservation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel your reservation for "{
                selectedReservation ? books.find(b => b.id === selectedReservation.bookID)?.title || 'this book' : 'this book'
              }"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setSelectedReservation(null);
              setShowCancelDialog(false);
            }}>
              Keep Reservation
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelReservation} className="bg-destructive hover:bg-destructive/90">
              Cancel Reservation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Pickup Confirmation Dialog */}
      <AlertDialog open={showPickupDialog} onOpenChange={setShowPickupDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Book Pickup</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to pick up "{
                selectedReservation ? books.find(b => b.id === selectedReservation.bookID)?.title || 'this book' : 'this book'
              }". The book must be returned within 14 days. The admin will be notified of your pickup.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setSelectedReservation(null);
              setShowPickupDialog(false);
            }}>
              Not Yet
            </AlertDialogCancel>
            <AlertDialogAction onClick={handlePickupBook} className="bg-green-600 hover:bg-green-700">
              Confirm Pickup
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
