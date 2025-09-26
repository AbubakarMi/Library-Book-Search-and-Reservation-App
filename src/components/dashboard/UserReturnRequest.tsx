"use client";

import { useState } from 'react';
import { borrowingRecords as initialBorrowingRecords, books } from '@/lib/mock-data';
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
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  MapPin,
  User,
  RotateCcw,
  Package
} from 'lucide-react';
import Image from 'next/image';
import { placeholderImages } from '@/lib/placeholder-images';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/context/NotificationContext';
import type { BorrowingRecord } from '@/lib/types';

export default function UserReturnRequest() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [borrowingRecords, setBorrowingRecords] = useState(initialBorrowingRecords);
  const [showReturnDialog, setShowReturnDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<BorrowingRecord | null>(null);
  const [returnNotes, setReturnNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter for user's active borrowings
  const userActiveBorrowings = borrowingRecords.filter(
    r => r.userID === user?.id && (r.status === 'active' || r.status === 'overdue')
  );

  const handleInitiateReturn = (record: BorrowingRecord) => {
    setSelectedRecord(record);
    setShowReturnDialog(true);
  };

  const handleConfirmReturn = () => {
    setShowReturnDialog(false);
    setShowConfirmDialog(true);
  };

  const submitReturnRequest = async () => {
    if (!selectedRecord) return;

    setIsSubmitting(true);

    // Simulate API call to initiate return process
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Update borrowing record status to indicate return request
    setBorrowingRecords(prev =>
      prev.map(r =>
        r.id === selectedRecord.id
          ? { ...r, status: 'return_requested' as any, returnNotes }
          : r
      )
    );

    const book = books.find(b => b.id === selectedRecord.bookID);

    // Notify user that return request has been submitted
    addNotification({
      id: `notification-${Date.now()}`,
      type: 'success',
      title: 'Return Request Submitted',
      message: `Your return request for "${book?.title || 'Unknown Book'}" has been submitted. Please bring the book to the library for processing.`,
      read: false,
      createdAt: new Date().toISOString()
    });

    // Notify librarian (in a real system, this would be sent to staff)
    addNotification({
      id: `notification-${Date.now() + 1}`,
      type: 'info',
      title: 'New Return Request',
      message: `${user?.name} has requested to return "${book?.title}". Please process when book is received.`,
      read: false,
      createdAt: new Date().toISOString()
    });

    setIsSubmitting(false);
    setShowConfirmDialog(false);
    setSelectedRecord(null);
    setReturnNotes('');
  };

  const calculatePenalty = (dueDate: string, returnDate?: string) => {
    const due = new Date(dueDate);
    const returned = returnDate ? new Date(returnDate) : new Date();

    if (returned <= due) return 0;

    const diffTime = returned.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays * 1; // $1 per day penalty
  };

  const isOverdue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    return today > due;
  };

  const getDaysOverdue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today.getTime() - due.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Sign in to initiate returns</h3>
          <p className="text-muted-foreground">You need to be signed in to return books.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Return Instructions */}
      <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
            <Package className="h-5 w-5" />
            Book Return Process
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
              <div>
                <p className="font-medium">Request Return</p>
                <p className="text-muted-foreground">Click "Request Return" below</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
              <div>
                <p className="font-medium">Bring Book to Library</p>
                <p className="text-muted-foreground">Present book to librarian</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
              <div>
                <p className="font-medium">Return Processed</p>
                <p className="text-muted-foreground">Librarian updates system</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Borrowings for Return */}
      <Card>
        <CardHeader>
          <CardTitle>Books Ready for Return</CardTitle>
          <p className="text-sm text-muted-foreground">
            Select the books you want to return to the library
          </p>
        </CardHeader>
        <CardContent>
          {userActiveBorrowings.length > 0 ? (
            <div className="space-y-4">
              {userActiveBorrowings.map(record => {
                const book = books.find(b => b.id === record.bookID);
                const coverImage = placeholderImages.find(p => p.id === book?.coverImageId) || placeholderImages[0];
                const overdueStatus = isOverdue(record.dueDate);
                const daysOverdue = overdueStatus ? getDaysOverdue(record.dueDate) : 0;
                const penalty = overdueStatus ? calculatePenalty(record.dueDate) : 0;

                return (
                  <div key={record.id} className={cn(
                    "border rounded-lg p-4",
                    overdueStatus && "border-red-200 bg-red-50/50 dark:bg-red-950/50"
                  )}>
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
                            record.status === 'active' ? "bg-blue-600" : "bg-red-600"
                          )}>
                            {record.status === 'active' ? 'Active' : 'Overdue'}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>Borrowed: {record.borrowDate}</span>
                          </div>
                          <div className={cn(
                            "flex items-center gap-1",
                            overdueStatus && "text-red-600 font-medium"
                          )}>
                            <Clock className="h-4 w-4" />
                            <span>Due: {record.dueDate}</span>
                          </div>
                          {overdueStatus && (
                            <>
                              <div className="text-red-600 font-medium">
                                {daysOverdue} days overdue
                              </div>
                              <div className="text-red-600 font-medium">
                                Penalty: ${penalty.toFixed(2)}
                              </div>
                            </>
                          )}
                        </div>

                        {overdueStatus && (
                          <div className="p-3 bg-red-100 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-md mb-4">
                            <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
                              <AlertTriangle className="h-4 w-4" />
                              <span className="text-sm font-medium">
                                This book is overdue! Please return immediately to avoid additional penalties.
                              </span>
                            </div>
                          </div>
                        )}

                        <Button
                          onClick={() => handleInitiateReturn(record)}
                          className="w-full md:w-auto"
                          variant={overdueStatus ? "destructive" : "default"}
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          {overdueStatus ? 'Return Overdue Book' : 'Request Return'}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No books currently borrowed</p>
              <p className="text-sm">Your borrowed books will appear here when you need to return them.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Return Request Dialog */}
      <Dialog open={showReturnDialog} onOpenChange={setShowReturnDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Initiate Book Return</DialogTitle>
            <DialogDescription>
              You're about to request the return of "{
                selectedRecord ? books.find(b => b.id === selectedRecord.bookID)?.title || 'this book' : 'this book'
              }". Please review the details below.
            </DialogDescription>
          </DialogHeader>

          {selectedRecord && (
            <div className="space-y-4">
              {/* Return Details */}
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Return Details</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span>Borrowed on:</span>
                  <span className="font-medium">{selectedRecord.borrowDate}</span>
                  <span>Due date:</span>
                  <span className={cn(
                    "font-medium",
                    isOverdue(selectedRecord.dueDate) && "text-red-600"
                  )}>
                    {selectedRecord.dueDate}
                  </span>
                  {isOverdue(selectedRecord.dueDate) && (
                    <>
                      <span>Days overdue:</span>
                      <span className="font-medium text-red-600">{getDaysOverdue(selectedRecord.dueDate)}</span>
                      <span>Penalty:</span>
                      <span className="font-medium text-red-600">
                        ${calculatePenalty(selectedRecord.dueDate).toFixed(2)}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Optional Notes */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Notes (Optional)
                </label>
                <Textarea
                  placeholder="Any condition notes or comments about the book..."
                  value={returnNotes}
                  onChange={(e) => setReturnNotes(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Next Steps */}
              <div className="p-4 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Next Steps:</h4>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>1. Your return request will be logged in the system</li>
                  <li>2. Bring the physical book to the library</li>
                  <li>3. A librarian will inspect and process the return</li>
                  <li>4. You'll receive confirmation when complete</li>
                </ul>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReturnDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmReturn}>
              Continue Return Process
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Return Request</AlertDialogTitle>
            <AlertDialogDescription>
              This will log your return request in the system. Please remember to bring the physical book to the library for the librarian to process the return.

              {selectedRecord && isOverdue(selectedRecord.dueDate) && (
                <div className="mt-3 p-2 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded">
                  <strong className="text-red-800 dark:text-red-200">
                    Note: This book is overdue. A penalty of ${calculatePenalty(selectedRecord.dueDate).toFixed(2)} will be applied.
                  </strong>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={submitReturnRequest}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                'Submit Return Request'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}