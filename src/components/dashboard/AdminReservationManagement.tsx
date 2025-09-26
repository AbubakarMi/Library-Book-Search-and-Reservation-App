"use client";

import { useState } from 'react';
import { reservations as initialReservations, books, users } from '@/lib/mock-data';
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
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'complete' | null>(null);

  const pendingReservations = reservations.filter(r => r.status === 'pending');
  const activeReservations = reservations.filter(r => r.status === 'ready');
  const completedReservations = reservations.filter(r => r.status === 'completed' || r.status === 'cancelled');

  const handleAction = (reservation: Reservation, action: 'approve' | 'reject' | 'complete') => {
    setSelectedReservation(reservation);
    setActionType(action);
  };

  const confirmAction = () => {
    if (!selectedReservation || !actionType) return;

    setReservations(reservations.map(r => {
      if (r.id === selectedReservation.id) {
        switch (actionType) {
          case 'approve':
            return { ...r, status: 'ready' as const };
          case 'reject':
            return { ...r, status: 'cancelled' as const };
          case 'complete':
            return { ...r, status: 'completed' as const };
          default:
            return r;
        }
      }
      return r;
    }));

    setSelectedReservation(null);
    setActionType(null);
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
          const user = users.find(u => u.id === reservation.userID);
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
                  <div className="font-medium">{user?.name || 'Unknown User'}</div>
                  <div className="text-sm text-muted-foreground">{user?.email || 'Unknown Email'}</div>
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

      {/* Confirmation Dialog */}
      <AlertDialog
        open={selectedReservation !== null && actionType !== null}
        onOpenChange={() => {
          setSelectedReservation(null);
          setActionType(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === 'approve' && 'Approve Reservation'}
              {actionType === 'reject' && 'Reject Reservation'}
              {actionType === 'complete' && 'Mark as Borrowed'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === 'approve' &&
                'This will approve the reservation and notify the user that their book is ready for pickup.'
              }
              {actionType === 'reject' &&
                'This will reject the reservation request. The user will be notified.'
              }
              {actionType === 'complete' &&
                'This will mark the book as borrowed by the user.'
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAction}
              className={cn(
                actionType === 'approve' && 'bg-green-600 hover:bg-green-700',
                actionType === 'reject' && 'bg-red-600 hover:bg-red-700',
                actionType === 'complete' && 'bg-blue-600 hover:bg-blue-700'
              )}
            >
              {actionType === 'approve' && 'Approve'}
              {actionType === 'reject' && 'Reject'}
              {actionType === 'complete' && 'Mark as Borrowed'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}