"use client";

import { useState, useEffect } from 'react';
import { reservations as initialReservations, borrowingRecords, books, users } from '@/lib/mock-data';
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
import { cn } from '@/lib/utils';
import {
  BookOpen,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  User,
  Package,
  XCircle,
  Info
} from 'lucide-react';
import Image from 'next/image';
import { placeholderImages } from '@/lib/placeholder-images';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/context/NotificationContext';
import type { Reservation } from '@/lib/types';

interface EligibilityCheck {
  eligible: boolean;
  reasons: string[];
  overdueBooks: number;
  activeBorrowings: number;
  maxBorrowingLimit: number;
}

export default function UserBorrowingRequest() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [reservations, setReservations] = useState(initialReservations);
  const [showBorrowDialog, setShowBorrowDialog] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [eligibilityCheck, setEligibilityCheck] = useState<EligibilityCheck | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get user's ready reservations (approved and ready for pickup)
  const readyReservations = reservations.filter(
    r => r.userID === user?.id && r.status === 'ready'
  );

  // Check user eligibility for borrowing
  const checkUserEligibility = (): EligibilityCheck => {
    if (!user) {
      return {
        eligible: false,
        reasons: ['User not authenticated'],
        overdueBooks: 0,
        activeBorrowings: 0,
        maxBorrowingLimit: 5
      };
    }

    const userBorrowings = borrowingRecords.filter(r => r.userID === user.id);
    const activeBorrowings = userBorrowings.filter(r => r.status === 'active').length;
    const overdueBooks = userBorrowings.filter(r => r.status === 'overdue').length;
    const maxBorrowingLimit = 5; // Maximum books a user can borrow

    const reasons: string[] = [];
    let eligible = true;

    if (overdueBooks > 0) {
      eligible = false;
      reasons.push(`You have ${overdueBooks} overdue book(s)`);
    }

    if (activeBorrowings >= maxBorrowingLimit) {
      eligible = false;
      reasons.push(`You've reached the maximum borrowing limit (${maxBorrowingLimit} books)`);
    }

    // Check for unpaid fines
    const unpaidFines = userBorrowings.filter(r => r.fineAmount && r.fineAmount > 0);
    if (unpaidFines.length > 0) {
      const totalFines = unpaidFines.reduce((sum, r) => sum + (r.fineAmount || 0), 0);
      if (totalFines > 10) { // If fines exceed $10
        eligible = false;
        reasons.push(`You have unpaid fines totaling $${totalFines.toFixed(2)}`);
      }
    }

    return {
      eligible,
      reasons,
      overdueBooks,
      activeBorrowings,
      maxBorrowingLimit
    };
  };

  const handleBorrowRequest = (reservation: Reservation) => {
    const eligibility = checkUserEligibility();
    setEligibilityCheck(eligibility);
    setSelectedReservation(reservation);
    setShowBorrowDialog(true);
  };

  const submitBorrowingRequest = async () => {
    if (!selectedReservation || !eligibilityCheck?.eligible) return;

    setIsSubmitting(true);

    // Simulate API call to create borrowing request
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Update reservation status to indicate borrowing request
    setReservations(prev =>
      prev.map(r =>
        r.id === selectedReservation.id
          ? { ...r, status: 'borrowing_requested' as any }
          : r
      )
    );

    const book = books.find(b => b.id === selectedReservation.bookID);

    // Notify user that borrowing request has been submitted
    addNotification({
      id: `notification-${Date.now()}`,
      type: 'success',
      title: 'Borrowing Request Submitted',
      message: `Your request to borrow "${book?.title || 'Unknown Book'}" has been submitted. Please visit the library to collect your book.`,
      read: false,
      createdAt: new Date().toISOString()
    });

    // Notify librarian (in a real system, this would be sent to staff)
    addNotification({
      id: `notification-${Date.now() + 1}`,
      type: 'info',
      title: 'New Borrowing Request',
      message: `${user?.name} has requested to borrow "${book?.title}". Please verify and process the borrowing.`,
      read: false,
      createdAt: new Date().toISOString()
    });

    setIsSubmitting(false);
    setShowBorrowDialog(false);
    setSelectedReservation(null);
    setEligibilityCheck(null);
  };

  const getReservationStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "ready":
        return "bg-green-600 hover:bg-green-700";
      case "borrowing_requested":
        return "bg-blue-600 hover:bg-blue-700";
      default:
        return "bg-gray-600 hover:bg-gray-700";
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Sign in to borrow books</h3>
          <p className="text-muted-foreground">You need to be signed in to request book borrowing.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Borrowing Process Guide */}
      <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
            <Package className="h-5 w-5" />
            Book Borrowing Process
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
              <div>
                <p className="font-medium">Request Borrowing</p>
                <p className="text-muted-foreground">Click "Borrow Book" below</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
              <div>
                <p className="font-medium">System Verification</p>
                <p className="text-muted-foreground">Eligibility & reservation check</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
              <div>
                <p className="font-medium">Visit Library</p>
                <p className="text-muted-foreground">Collect book from librarian</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
              <div>
                <p className="font-medium">Book Issued</p>
                <p className="text-muted-foreground">Borrowing period starts</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Eligibility Status */}
      {(() => {
        const eligibility = checkUserEligibility();
        return (
          <Card className={cn(
            "border-2",
            eligibility.eligible
              ? "border-green-200 bg-green-50/50 dark:bg-green-950/50"
              : "border-red-200 bg-red-50/50 dark:bg-red-950/50"
          )}>
            <CardHeader>
              <CardTitle className={cn(
                "flex items-center gap-2",
                eligibility.eligible
                  ? "text-green-800 dark:text-green-200"
                  : "text-red-800 dark:text-red-200"
              )}>
                {eligibility.eligible ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <XCircle className="h-5 w-5" />
                )}
                Borrowing Eligibility Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <div className={cn(
                    "font-semibold",
                    eligibility.eligible ? "text-green-600" : "text-red-600"
                  )}>
                    {eligibility.eligible ? 'Eligible' : 'Not Eligible'}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Active Borrowings:</span>
                  <div className="font-semibold">
                    {eligibility.activeBorrowings} / {eligibility.maxBorrowingLimit}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Overdue Books:</span>
                  <div className={cn(
                    "font-semibold",
                    eligibility.overdueBooks > 0 ? "text-red-600" : "text-green-600"
                  )}>
                    {eligibility.overdueBooks}
                  </div>
                </div>
              </div>

              {!eligibility.eligible && (
                <div className="mt-4 p-3 bg-red-100 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-md">
                  <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">Issues to resolve:</h4>
                  <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                    {eligibility.reasons.map((reason, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <AlertTriangle className="h-3 w-3" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })()}

      {/* Books Ready for Borrowing */}
      <Card>
        <CardHeader>
          <CardTitle>Books Ready for Borrowing</CardTitle>
          <p className="text-sm text-muted-foreground">
            These are your approved reservations ready for pickup and borrowing
          </p>
        </CardHeader>
        <CardContent>
          {readyReservations.length > 0 ? (
            <div className="space-y-4">
              {readyReservations.map(reservation => {
                const book = books.find(b => b.id === reservation.bookID);
                const coverImage = placeholderImages.find(p => p.id === book?.coverImageId) || placeholderImages[0];
                const isEligible = checkUserEligibility().eligible;

                return (
                  <div key={reservation.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <Image
                        src={coverImage.imageUrl}
                        alt={book?.title || ""}
                        width={64}
                        height={96}
                        className="rounded-sm"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold">{book?.title || 'Unknown Book'}</h3>
                            <p className="text-sm text-muted-foreground">{book?.author || 'Unknown Author'}</p>
                          </div>
                          <Badge className={cn(
                            "text-white",
                            getReservationStatusBadgeVariant(reservation.status)
                          )}>
                            {reservation.status === 'borrowing_requested' ? 'Borrowing Requested' : 'Ready for Pickup'}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>Reserved: {reservation.reservationDate}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Info className="h-4 w-4 text-muted-foreground" />
                            <span>Category: {book?.category}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>Pickup window: 3 days</span>
                          </div>
                        </div>

                        {reservation.status === 'ready' ? (
                          <Button
                            onClick={() => handleBorrowRequest(reservation)}
                            disabled={!isEligible}
                            className={cn(
                              "w-full md:w-auto",
                              !isEligible && "opacity-50 cursor-not-allowed"
                            )}
                          >
                            <BookOpen className="h-4 w-4 mr-2" />
                            {isEligible ? 'Request to Borrow Book' : 'Not Eligible to Borrow'}
                          </Button>
                        ) : (
                          <Badge variant="outline" className="text-blue-600 border-blue-600">
                            <Clock className="h-3 w-3 mr-1" />
                            Borrowing request pending librarian approval
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No Books Ready for Borrowing</h3>
              <p className="text-sm">Your approved reservations will appear here when ready for pickup.</p>
              <p className="text-sm mt-2">
                Make sure to <strong>reserve books first</strong> before they can be borrowed.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Borrowing Request Dialog */}
      <Dialog open={showBorrowDialog} onOpenChange={setShowBorrowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Request to Borrow Book</DialogTitle>
            <DialogDescription>
              Complete the borrowing request for "{
                selectedReservation ? books.find(b => b.id === selectedReservation.bookID)?.title || 'this book' : 'this book'
              }"
            </DialogDescription>
          </DialogHeader>

          {selectedReservation && eligibilityCheck && (
            <div className="space-y-6">
              {/* Eligibility Check Results */}
              <div className={cn(
                "p-4 rounded-lg border-2",
                eligibilityCheck.eligible
                  ? "border-green-200 bg-green-50 dark:bg-green-950/50"
                  : "border-red-200 bg-red-50 dark:bg-red-950/50"
              )}>
                <h4 className={cn(
                  "font-semibold mb-2 flex items-center gap-2",
                  eligibilityCheck.eligible
                    ? "text-green-800 dark:text-green-200"
                    : "text-red-800 dark:text-red-200"
                )}>
                  {eligibilityCheck.eligible ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <XCircle className="h-5 w-5" />
                  )}
                  Eligibility Verification
                </h4>

                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <div className={cn(
                      "font-medium",
                      eligibilityCheck.eligible ? "text-green-600" : "text-red-600"
                    )}>
                      {eligibilityCheck.eligible ? '✓ Eligible to Borrow' : '✗ Not Eligible'}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Current Borrowings:</span>
                    <div className="font-medium">
                      {eligibilityCheck.activeBorrowings} / {eligibilityCheck.maxBorrowingLimit}
                    </div>
                  </div>
                </div>

                {!eligibilityCheck.eligible && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-red-700 dark:text-red-300 mb-2">Issues:</p>
                    <ul className="text-sm text-red-600 dark:text-red-400 space-y-1">
                      {eligibilityCheck.reasons.map((reason, index) => (
                        <li key={index}>• {reason}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {eligibilityCheck.eligible && (
                <>
                  {/* Borrowing Terms */}
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Borrowing Terms:</h4>
                    <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                      <li>• Standard borrowing period: 2 weeks</li>
                      <li>• Late return penalty: $1 per day</li>
                      <li>• Renewable once if no reservations</li>
                      <li>• Must return book in good condition</li>
                    </ul>
                  </div>

                  {/* Next Steps */}
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Next Steps:</h4>
                    <ol className="text-sm space-y-1">
                      <li>1. Your borrowing request will be logged</li>
                      <li>2. Visit the library with valid ID</li>
                      <li>3. Librarian will verify and issue the book</li>
                      <li>4. Borrowing period begins immediately</li>
                    </ol>
                  </div>
                </>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBorrowDialog(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              onClick={submitBorrowingRequest}
              disabled={isSubmitting || !eligibilityCheck?.eligible}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting Request...
                </>
              ) : (
                'Submit Borrowing Request'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}