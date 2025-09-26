"use client";

import { useState } from 'react';
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
import { X, Calendar, Clock, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { placeholderImages } from '@/lib/placeholder-images';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/context/NotificationContext';
import type { Reservation } from '@/lib/types';

export default function UserReservations() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [reservations, setReservations] = useState(initialReservations);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  // Filter reservations for current user
  const userReservations = reservations.filter(r => r.userID === user?.id);
  const currentReservations = userReservations.filter(r => r.status === 'pending' || r.status === 'ready');
  const pastReservations = userReservations.filter(r => r.status === 'completed' || r.status === 'cancelled');

  const handleCancelReservation = async () => {
    if (!selectedReservation) return;

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    setReservations(prev =>
      prev.map(r =>
        r.id === selectedReservation.id
          ? { ...r, status: 'cancelled' as const }
          : r
      )
    );

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

  const openCancelDialog = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setShowCancelDialog(true);
  };

  const getStatusBadgeVariant = (status: "pending" | "ready" | "completed" | "cancelled") => {
    switch (status) {
      case "ready":
        return "bg-success hover:bg-success/80";
      case "pending":
        return "bg-warning text-warning-foreground hover:bg-warning/80";
      case "completed":
        return "bg-primary/20 text-primary-foreground hover:bg-primary/30";
      case "cancelled":
        return "bg-destructive/80 hover:bg-destructive/90";
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
                  {reservation.status === 'ready' && <CheckCircle className="h-3 w-3" />}
                  {reservation.status === 'completed' && <CheckCircle className="h-3 w-3" />}
                  {reservation.status === 'cancelled' && <X className="h-3 w-3" />}
                  {reservation.status}
                </Badge>
              </TableCell>
              {showActions && (
                <TableCell>
                  {(reservation.status === 'pending' || reservation.status === 'ready') && (
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
    </Card>
  );
}
