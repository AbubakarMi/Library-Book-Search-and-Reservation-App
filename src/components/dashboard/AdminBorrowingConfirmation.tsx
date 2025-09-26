"use client";

import { useState } from 'react';
import { reservations as initialReservations, borrowingRecords as initialBorrowingRecords, books, users } from '@/lib/mock-data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  User,
  Package,
  Search,
  XCircle,
  FileText,
  Barcode,
  IdCard
} from 'lucide-react';
import Image from 'next/image';
import { placeholderImages } from '@/lib/placeholder-images';
import { useNotifications } from '@/context/NotificationContext';
import type { Reservation, BorrowingRecord } from '@/lib/types';

interface EligibilityCheck {
  eligible: boolean;
  reasons: string[];
  overdueBooks: number;
  activeBorrowings: number;
  maxBorrowingLimit: number;
  unpaidFines: number;
}

export default function AdminBorrowingConfirmation() {
  const { addNotification } = useNotifications();
  const [reservations, setReservations] = useState(initialReservations);
  const [borrowingRecords, setBorrowingRecords] = useState(initialBorrowingRecords);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [borrowingPeriod, setBorrowingPeriod] = useState('14'); // days
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter reservations that are pending borrowing confirmation
  const pendingBorrowings = reservations.filter(r =>
    (r as any).status === 'borrowing_requested' || r.status === 'ready'
  );

  // Filter by search term
  const filteredBorrowings = pendingBorrowings.filter(reservation => {
    const book = books.find(b => b.id === reservation.bookID);
    const user = users.find(u => u.id === reservation.userID);
    const searchLower = searchTerm.toLowerCase();

    return book?.title.toLowerCase().includes(searchLower) ||
           book?.author.toLowerCase().includes(searchLower) ||
           user?.name.toLowerCase().includes(searchLower) ||
           user?.email.toLowerCase().includes(searchLower);
  });

  // Check user eligibility for borrowing
  const checkUserEligibility = (userId: string): EligibilityCheck => {
    const userBorrowings = borrowingRecords.filter(r => r.userID === userId);
    const activeBorrowings = userBorrowings.filter(r => r.status === 'active').length;
    const overdueBooks = userBorrowings.filter(r => r.status === 'overdue').length;
    const unpaidFines = userBorrowings
      .filter(r => r.fineAmount && r.fineAmount > 0)
      .reduce((sum, r) => sum + (r.fineAmount || 0), 0);

    const maxBorrowingLimit = 5;
    const reasons: string[] = [];
    let eligible = true;

    if (overdueBooks > 0) {
      eligible = false;
      reasons.push(`${overdueBooks} overdue book(s)`);
    }

    if (activeBorrowings >= maxBorrowingLimit) {
      eligible = false;
      reasons.push(`At borrowing limit (${maxBorrowingLimit})`);
    }

    if (unpaidFines > 10) {
      eligible = false;
      reasons.push(`Unpaid fines: $${unpaidFines.toFixed(2)}`);
    }

    return {
      eligible,
      reasons,
      overdueBooks,
      activeBorrowings,
      maxBorrowingLimit,
      unpaidFines
    };
  };

  const confirmBorrowing = async () => {
    if (!selectedReservation) return;

    setIsProcessing(true);

    // Calculate due date
    const borrowDate = new Date();
    const dueDate = new Date(borrowDate);
    dueDate.setDate(borrowDate.getDate() + parseInt(borrowingPeriod));

    const borrowDateStr = borrowDate.toISOString().split('T')[0];
    const dueDateStr = dueDate.toISOString().split('T')[0];

    // Create new borrowing record
    const newBorrowingRecord: BorrowingRecord = {
      id: `borrow-${Date.now()}`,
      userID: selectedReservation.userID,
      bookID: selectedReservation.bookID,
      borrowDate: borrowDateStr,
      dueDate: dueDateStr,
      status: 'active'
    };

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Add new borrowing record
    setBorrowingRecords(prev => [...prev, newBorrowingRecord]);

    // Update reservation status to completed
    setReservations(prev =>
      prev.map(r =>
        r.id === selectedReservation.id
          ? { ...r, status: 'completed' as const }
          : r
      )
    );

    // Update book status to checked out
    const book = books.find(b => b.id === selectedReservation.bookID);
    const user = users.find(u => u.id === selectedReservation.userID);

    if (book) {
      book.availabilityStatus = 'checked_out';
    }

    // Notify user that book has been issued
    addNotification({
      id: `notification-${Date.now()}`,
      type: 'success',
      title: 'Book Issued Successfully',
      message: `"${book?.title || 'Unknown Book'}" has been issued to you. Due date: ${dueDateStr}. Please return on time to avoid penalties.`,
      read: false,
      createdAt: new Date().toISOString()
    });

    // System notification for librarian
    addNotification({
      id: `notification-${Date.now() + 1}`,
      type: 'info',
      title: 'Book Borrowing Processed',
      message: `Successfully issued "${book?.title}" to ${user?.name}. Due date: ${dueDateStr}`,
      read: false,
      createdAt: new Date().toISOString()
    });

    setIsProcessing(false);
    setShowConfirmDialog(false);
    setSelectedReservation(null);
    setBorrowingPeriod('14');
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "ready":
        return "bg-green-600 hover:bg-green-700";
      case "borrowing_requested":
        return "bg-blue-600 hover:bg-blue-700";
      default:
        return "bg-gray-600 hover:bg-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Package className="h-5 w-5 text-blue-500" />
            </div>
            <div className="text-2xl font-bold">{pendingBorrowings.length}</div>
            <div className="text-xs text-muted-foreground">Pending Borrowings</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold">
              {borrowingRecords.filter(r => r.borrowDate === new Date().toISOString().split('T')[0]).length}
            </div>
            <div className="text-xs text-muted-foreground">Issued Today</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <BookOpen className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold">
              {borrowingRecords.filter(r => r.status === 'active').length}
            </div>
            <div className="text-xs text-muted-foreground">Active Borrowings</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div className="text-2xl font-bold text-red-600">
              {borrowingRecords.filter(r => r.status === 'overdue').length}
            </div>
            <div className="text-xs text-muted-foreground">Overdue</div>
          </CardContent>
        </Card>
      </div>

      {/* Borrowing Confirmation Interface */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Book Borrowing Confirmation</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Verify reservations and confirm book issuance to users
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by book, user, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredBorrowings.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Reservation Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Eligibility</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBorrowings.map(reservation => {
                  const book = books.find(b => b.id === reservation.bookID);
                  const user = users.find(u => u.id === reservation.userID);
                  const coverImage = placeholderImages.find(p => p.id === book?.coverImageId) || placeholderImages[0];
                  const eligibility = checkUserEligibility(reservation.userID);

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
                          {reservation.status === 'borrowing_requested' ? 'Borrowing Requested' : 'Ready for Pickup'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {eligibility.eligible ? (
                            <Badge className="bg-green-600 text-white">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Eligible
                            </Badge>
                          ) : (
                            <Badge className="bg-red-600 text-white">
                              <XCircle className="h-3 w-3 mr-1" />
                              Not Eligible
                            </Badge>
                          )}
                        </div>
                        {!eligibility.eligible && (
                          <div className="text-xs text-red-600 mt-1">
                            {eligibility.reasons.join(', ')}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedReservation(reservation);
                            setShowConfirmDialog(true);
                          }}
                          disabled={!eligibility.eligible}
                          className={cn(
                            "text-white",
                            eligibility.eligible
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-gray-400 cursor-not-allowed"
                          )}
                        >
                          <Package className="h-3 w-3 mr-1" />
                          {eligibility.eligible ? 'Issue Book' : 'Cannot Issue'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No Pending Borrowings</h3>
              <p>All borrowing requests have been processed or no requests pending.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Borrowing Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Confirm Book Issuance</DialogTitle>
            <DialogDescription>
              Complete the borrowing process for "{
                selectedReservation ? books.find(b => b.id === selectedReservation.bookID)?.title || 'this book' : 'this book'
              }"
            </DialogDescription>
          </DialogHeader>

          {selectedReservation && (
            <div className="space-y-6">
              {/* Verification Summary */}
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <IdCard className="h-5 w-5" />
                  Borrowing Verification
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">User:</span>
                    <div className="font-medium">
                      {users.find(u => u.id === selectedReservation.userID)?.name || 'Unknown'}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Reservation Date:</span>
                    <div className="font-medium">{selectedReservation.reservationDate}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Book Category:</span>
                    <div className="font-medium">
                      {books.find(b => b.id === selectedReservation.bookID)?.category || 'Unknown'}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Current Status:</span>
                    <div className="font-medium">
                      {selectedReservation.status === 'borrowing_requested' ? 'Borrowing Requested' : 'Ready for Pickup'}
                    </div>
                  </div>
                </div>
              </div>

              {/* User Eligibility Check */}
              {(() => {
                const eligibility = checkUserEligibility(selectedReservation.userID);
                return (
                  <div className={cn(
                    "p-4 rounded-lg border-2",
                    eligibility.eligible
                      ? "border-green-200 bg-green-50 dark:bg-green-950/50"
                      : "border-red-200 bg-red-50 dark:bg-red-950/50"
                  )}>
                    <h4 className={cn(
                      "font-semibold mb-2 flex items-center gap-2",
                      eligibility.eligible
                        ? "text-green-800 dark:text-green-200"
                        : "text-red-800 dark:text-red-200"
                    )}>
                      {eligibility.eligible ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <XCircle className="h-5 w-5" />
                      )}
                      User Eligibility Status
                    </h4>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Status:</span>
                        <div className={cn(
                          "font-medium",
                          eligibility.eligible ? "text-green-600" : "text-red-600"
                        )}>
                          {eligibility.eligible ? '✓ Eligible' : '✗ Not Eligible'}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Active Borrowings:</span>
                        <div className="font-medium">
                          {eligibility.activeBorrowings} / {eligibility.maxBorrowingLimit}
                        </div>
                      </div>
                    </div>

                    {!eligibility.eligible && (
                      <div className="mt-3 p-2 bg-red-100 dark:bg-red-950/50 border border-red-300 rounded">
                        <p className="text-sm font-medium text-red-700 dark:text-red-300 mb-1">Issues:</p>
                        <ul className="text-sm text-red-600 dark:text-red-400">
                          {eligibility.reasons.map((reason, index) => (
                            <li key={index}>• {reason}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })()}

              {checkUserEligibility(selectedReservation.userID).eligible && (
                <>
                  {/* Borrowing Period Selection */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Borrowing Period</label>
                    <Select value={borrowingPeriod} onValueChange={setBorrowingPeriod}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">1 Week (7 days)</SelectItem>
                        <SelectItem value="14">2 Weeks (14 days) - Standard</SelectItem>
                        <SelectItem value="21">3 Weeks (21 days)</SelectItem>
                        <SelectItem value="30">1 Month (30 days)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Due date will be: {new Date(Date.now() + parseInt(borrowingPeriod) * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Final Processing Steps */}
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Processing Steps:
                    </h4>
                    <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                      <li>✓ Verify user identity and reservation</li>
                      <li>✓ Check user eligibility and account status</li>
                      <li>✓ Create borrowing record in system</li>
                      <li>✓ Update book availability status</li>
                      <li>✓ Set due date and borrowing terms</li>
                      <li>✓ Issue book to user and send notifications</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button
              onClick={confirmBorrowing}
              disabled={isProcessing || !selectedReservation || !checkUserEligibility(selectedReservation.userID).eligible}
              className="bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Issuing Book...
                </>
              ) : (
                'Confirm and Issue Book'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}