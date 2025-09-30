"use client";

import { useState, useEffect } from 'react';
import { books } from '@/lib/mock-data';
import { useAuth } from '@/hooks/useAuth';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { PackageCheck, Calendar, Clock, User, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { placeholderImages } from '@/lib/placeholder-images';
import type { Reservation } from '@/lib/types';

export default function AdminPickupPage() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);

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

  const getUserById = (userId: string) => {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      return users.find((u: any) => u.id === userId);
    }
    return null;
  };

  // Filter reservations that have been picked up
  const pickedUpReservations = reservations.filter(r => r.status === 'picked_up');

  // Calculate if book is overdue
  const isOverdue = (expectedReturnDate: string) => {
    return new Date(expectedReturnDate) < new Date();
  };

  // Calculate days until return
  const daysUntilReturn = (expectedReturnDate: string) => {
    const today = new Date();
    const returnDate = new Date(expectedReturnDate);
    const diffTime = returnDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Picked Up Books</h1>
        <p className="text-muted-foreground mt-2">
          Track books that students have picked up and their return dates
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Picked Up</CardTitle>
            <PackageCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pickedUpReservations.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due Soon (3 days)</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pickedUpReservations.filter(r => {
                if (!r.expectedReturnDate) return false;
                const days = daysUntilReturn(r.expectedReturnDate);
                return days >= 0 && days <= 3;
              }).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {pickedUpReservations.filter(r => r.expectedReturnDate && isOverdue(r.expectedReturnDate)).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PackageCheck className="h-5 w-5" />
            Books Currently Out ({pickedUpReservations.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pickedUpReservations.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Picked Up Date</TableHead>
                  <TableHead>Expected Return</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pickedUpReservations.map(reservation => {
                  const book = books.find(b => b.id === reservation.bookID);
                  const student = getUserById(reservation.userID);
                  const coverImage = placeholderImages.find(p => p.id === book?.coverImageId) || placeholderImages[0];
                  const pickupDate = reservation.actualPickupDate ? new Date(reservation.actualPickupDate) : null;
                  const returnDate = reservation.expectedReturnDate ? new Date(reservation.expectedReturnDate) : null;
                  const days = returnDate ? daysUntilReturn(reservation.expectedReturnDate!) : null;
                  const overdue = returnDate ? isOverdue(reservation.expectedReturnDate!) : false;

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
                          <div className="font-medium flex items-center gap-2">
                            <User className="h-3 w-3 text-muted-foreground" />
                            {student?.name || 'Unknown Student'}
                          </div>
                          <div className="text-sm text-muted-foreground">{student?.email || 'Unknown Email'}</div>
                          {student?.registrationNumber && (
                            <div className="text-xs text-muted-foreground">{student.registrationNumber}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {pickupDate ? (
                            <div>
                              <div>{pickupDate.toLocaleDateString()}</div>
                              <div className="text-xs text-muted-foreground">
                                {pickupDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                          ) : 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        {returnDate ? (
                          <div className="space-y-1">
                            <div className={cn(
                              "flex items-center gap-2 text-sm font-medium",
                              overdue ? "text-red-600" : days !== null && days <= 3 ? "text-orange-600" : "text-green-600"
                            )}>
                              <Clock className="h-4 w-4" />
                              {returnDate.toLocaleDateString()}
                            </div>
                            {days !== null && (
                              <div className={cn(
                                "text-xs",
                                overdue ? "text-red-600" : days <= 3 ? "text-orange-600" : "text-muted-foreground"
                              )}>
                                {overdue ? `Overdue by ${Math.abs(days)} days` : `${days} days remaining`}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">Not set</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {overdue ? (
                          <Badge className="bg-red-500 hover:bg-red-600 text-white">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Overdue
                          </Badge>
                        ) : days !== null && days <= 3 ? (
                          <Badge className="bg-orange-500 hover:bg-orange-600 text-white">
                            <Clock className="h-3 w-3 mr-1" />
                            Due Soon
                          </Badge>
                        ) : (
                          <Badge className="bg-green-500 hover:bg-green-600 text-white">
                            <PackageCheck className="h-3 w-3 mr-1" />
                            On Time
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <PackageCheck className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
              <h3 className="mt-4 text-lg font-semibold">No Books Picked Up</h3>
              <p className="text-muted-foreground mt-2">
                Books that students pick up will appear here with their return dates
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}