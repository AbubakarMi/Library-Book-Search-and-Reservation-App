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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { PackageCheck, Calendar, Clock } from 'lucide-react';
import Image from 'next/image';
import { placeholderImages } from '@/lib/placeholder-images';
import type { Reservation } from '@/lib/types';

export default function PickupPage() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
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
    }
  };

  // Filter reservations for current user that are ready for pickup
  const userReadyReservations = reservations.filter(
    r => r.userID === user?.id && r.status === 'ready'
  );

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

  const openPickupDialog = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setShowPickupDialog(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ready for Pickup</h1>
        <p className="text-muted-foreground mt-2">
          Books approved by admin and ready to collect
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PackageCheck className="h-5 w-5" />
            Available Books ({userReadyReservations.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {userReadyReservations.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book</TableHead>
                  <TableHead>Approved Date</TableHead>
                  <TableHead>Pickup By</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userReadyReservations.map(reservation => {
                  const book = books.find(b => b.id === reservation.bookID);
                  const coverImage = placeholderImages.find(p => p.id === book?.coverImageId) || placeholderImages[0];
                  const pickupDate = reservation.pickupDateTime ? new Date(reservation.pickupDateTime) : null;
                  const expiryDate = reservation.expiryDate ? new Date(reservation.expiryDate) : null;

                  return (
                    <TableRow key={reservation.id}>
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <Image
                            src={coverImage.imageUrl}
                            alt={book?.title || ""}
                            width={40}
                            height={60}
                            className="rounded-sm"
                          />
                          <div>
                            <div className="font-medium">{book?.title || 'Unknown Book'}</div>
                            <div className="text-sm text-muted-foreground">{book?.author || 'Unknown Author'}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {reservation.approvalDate
                            ? new Date(reservation.approvalDate).toLocaleDateString()
                            : 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        {pickupDate ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm font-medium text-green-600">
                              <Clock className="h-4 w-4" />
                              {pickupDate.toLocaleDateString()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {pickupDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            {expiryDate && (
                              <div className="text-xs text-muted-foreground">
                                Expires: {expiryDate.toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">Not set</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => openPickupDialog(reservation)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <PackageCheck className="h-4 w-4 mr-2" />
                          Pick Up
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <PackageCheck className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
              <h3 className="mt-4 text-lg font-semibold">No Books Ready for Pickup</h3>
              <p className="text-muted-foreground mt-2">
                Books approved by admin will appear here
              </p>
            </div>
          )}
        </CardContent>
      </Card>

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
    </div>
  );
}