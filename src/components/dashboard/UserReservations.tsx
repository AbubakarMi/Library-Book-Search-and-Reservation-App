"use client";

import { reservations, books } from '@/lib/mock-data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { placeholderImages } from '@/lib/placeholder-images';

export default function UserReservations() {
  const currentReservations = reservations.filter(r => r.status === 'pending' || r.status === 'ready');
  const pastReservations = reservations.filter(r => r.status === 'completed' || r.status === 'cancelled');

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

  const ReservationTable = ({ reservations }: { reservations: typeof currentReservations }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Book</TableHead>
          <TableHead>Reservation Date</TableHead>
          <TableHead>Status</TableHead>
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
                <Badge className={cn("capitalize text-white", getStatusBadgeVariant(reservation.status))}>
                  {reservation.status}
                </Badge>
              </TableCell>
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
                <ReservationTable reservations={pastReservations} />
             ) : (
                <p className="text-muted-foreground p-4 text-center">You have no past reservations.</p>
             )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
