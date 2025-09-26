"use client";

import { useState } from 'react';
import { borrowingRecords as initialBorrowingRecords, books } from '@/lib/mock-data';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Star,
  DollarSign
} from 'lucide-react';
import Image from 'next/image';
import { placeholderImages } from '@/lib/placeholder-images';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/context/NotificationContext';
import type { BorrowingRecord } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';

export default function UserBorrowings() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [borrowingRecords, setBorrowingRecords] = useState(initialBorrowingRecords);
  const [showRenewDialog, setShowRenewDialog] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<BorrowingRecord | null>(null);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);

  // Filter borrowing records for current user
  const userBorrowings = borrowingRecords.filter(r => r.userID === user?.id);
  const activeBorrowings = userBorrowings.filter(r => r.status === 'active');
  const overdueBorrowings = userBorrowings.filter(r => r.status === 'overdue');
  const returnedBorrowings = userBorrowings.filter(r => r.status === 'returned');

  // Calculate statistics
  const totalFines = userBorrowings
    .filter(r => r.fineAmount)
    .reduce((sum, r) => sum + (r.fineAmount || 0), 0);

  const booksCurrentlyBorrowed = activeBorrowings.length + overdueBorrowings.length;
  const booksReturned = returnedBorrowings.length;

  const handleRenewBook = async () => {
    if (!selectedRecord) return;

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // Extend due date by 2 weeks
    const newDueDate = new Date(selectedRecord.dueDate);
    newDueDate.setDate(newDueDate.getDate() + 14);

    setBorrowingRecords(prev =>
      prev.map(r =>
        r.id === selectedRecord.id
          ? { ...r, dueDate: newDueDate.toISOString().split('T')[0], status: 'active' as const }
          : r
      )
    );

    const book = books.find(b => b.id === selectedRecord.bookID);

    addNotification({
      id: `notification-${Date.now()}`,
      type: 'success',
      title: 'Book Renewed',
      message: `You have successfully renewed "${book?.title || 'Unknown Book'}". New due date: ${newDueDate.toLocaleDateString()}`,
      read: false,
      createdAt: new Date().toISOString()
    });

    setShowRenewDialog(false);
    setSelectedRecord(null);
  };

  const handleSubmitReview = async () => {
    if (!selectedRecord || !reviewText.trim()) return;

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const book = books.find(b => b.id === selectedRecord.bookID);

    addNotification({
      id: `notification-${Date.now()}`,
      type: 'success',
      title: 'Review Submitted',
      message: `Thank you for reviewing "${book?.title || 'Unknown Book'}"!`,
      read: false,
      createdAt: new Date().toISOString()
    });

    setShowReviewDialog(false);
    setSelectedRecord(null);
    setReviewText('');
    setReviewRating(5);
  };

  const openRenewDialog = (record: BorrowingRecord) => {
    setSelectedRecord(record);
    setShowRenewDialog(true);
  };

  const openReviewDialog = (record: BorrowingRecord) => {
    setSelectedRecord(record);
    setShowReviewDialog(true);
  };

  const getStatusBadgeVariant = (status: "active" | "returned" | "overdue") => {
    switch (status) {
      case "active":
        return "bg-blue-600 hover:bg-blue-700";
      case "returned":
        return "bg-green-600 hover:bg-green-700";
      case "overdue":
        return "bg-red-600 hover:bg-red-700";
    }
  };

  const isOverdue = (dueDate: string, status: string) => {
    if (status === 'returned') return false;
    const today = new Date();
    const due = new Date(dueDate);
    return today > due;
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const BorrowingTable = ({
    records,
    showActions = true
  }: {
    records: BorrowingRecord[],
    showActions?: boolean
  }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Book</TableHead>
          <TableHead>Borrowed</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Fine</TableHead>
          {showActions && <TableHead>Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {records.map(record => {
          const book = books.find(b => b.id === record.bookID);
          const coverImage = placeholderImages.find(p => p.id === book?.coverImageId) || placeholderImages[0];
          const overdueStatus = isOverdue(record.dueDate, record.status);
          const daysUntilDue = getDaysUntilDue(record.dueDate);

          return (
            <TableRow key={record.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Image src={coverImage.imageUrl} alt={book?.title || ""} width={32} height={48} className="rounded-sm" />
                  <div>
                    <div className="font-medium">{book?.title || 'Unknown Book'}</div>
                    <div className="text-sm text-muted-foreground">{book?.author || 'Unknown Author'}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{record.borrowDate}</TableCell>
              <TableCell>
                <div className={cn(
                  "flex items-center gap-1",
                  overdueStatus && record.status !== 'returned' && "text-red-600 font-medium"
                )}>
                  {record.dueDate}
                  {overdueStatus && record.status !== 'returned' && (
                    <AlertTriangle className="h-4 w-4" />
                  )}
                  {!overdueStatus && record.status === 'active' && daysUntilDue <= 3 && (
                    <div className="flex items-center gap-1 text-yellow-600">
                      <Clock className="h-3 w-3" />
                      <span className="text-xs">Due soon</span>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge className={cn("capitalize text-white flex items-center gap-1", getStatusBadgeVariant(record.status))}>
                  {record.status === 'active' && <BookOpen className="h-3 w-3" />}
                  {record.status === 'returned' && <CheckCircle className="h-3 w-3" />}
                  {record.status === 'overdue' && <AlertTriangle className="h-3 w-3" />}
                  {record.status}
                </Badge>
              </TableCell>
              <TableCell>
                {record.fineAmount ? (
                  <span className="text-red-600 font-medium">${record.fineAmount.toFixed(2)}</span>
                ) : (
                  '-'
                )}
              </TableCell>
              {showActions && (
                <TableCell>
                  <div className="flex gap-2">
                    {(record.status === 'active' || record.status === 'overdue') && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openRenewDialog(record)}
                        className="h-8 px-3"
                      >
                        <Calendar className="h-3 w-3 mr-1" />
                        Renew
                      </Button>
                    )}
                    {record.status === 'returned' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openReviewDialog(record)}
                        className="h-8 px-3"
                      >
                        <Star className="h-3 w-3 mr-1" />
                        Review
                      </Button>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );

  if (!user) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Sign in to view your borrowed books</h3>
          <p className="text-muted-foreground">You need to be signed in to see your borrowing history.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
            </div>
            <div className="text-2xl font-bold">{booksCurrentlyBorrowed}</div>
            <div className="text-xs text-muted-foreground">Currently Borrowed</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold">{booksReturned}</div>
            <div className="text-xs text-muted-foreground">Books Returned</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div className="text-2xl font-bold text-red-600">{overdueBorrowings.length}</div>
            <div className="text-xs text-muted-foreground">Overdue Books</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <DollarSign className="h-5 w-5 text-orange-500" />
            </div>
            <div className="text-2xl font-bold">${totalFines.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">Total Fines</div>
          </CardContent>
        </Card>
      </div>

      {/* Borrowed Books Management */}
      <Card>
        <CardHeader>
          <CardTitle>My Borrowed Books</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active">
            <TabsList>
              <TabsTrigger value="active">
                Active ({activeBorrowings.length})
              </TabsTrigger>
              {overdueBorrowings.length > 0 && (
                <TabsTrigger value="overdue" className="text-red-600">
                  Overdue ({overdueBorrowings.length})
                </TabsTrigger>
              )}
              <TabsTrigger value="returned">
                Returned ({returnedBorrowings.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active">
              {activeBorrowings.length > 0 ? (
                <BorrowingTable records={activeBorrowings} />
              ) : (
                <p className="text-muted-foreground p-4 text-center">No books currently borrowed.</p>
              )}
            </TabsContent>

            {overdueBorrowings.length > 0 && (
              <TabsContent value="overdue">
                <div className="mb-4 p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm font-medium">You have overdue books. Please return them as soon as possible to avoid additional fines.</span>
                  </div>
                </div>
                <BorrowingTable records={overdueBorrowings} />
              </TabsContent>
            )}

            <TabsContent value="returned">
              {returnedBorrowings.length > 0 ? (
                <BorrowingTable records={returnedBorrowings} />
              ) : (
                <p className="text-muted-foreground p-4 text-center">No returned books yet.</p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Renew Book Dialog */}
      <Dialog open={showRenewDialog} onOpenChange={setShowRenewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renew Book</DialogTitle>
            <DialogDescription>
              Would you like to renew "{
                selectedRecord ? books.find(b => b.id === selectedRecord.bookID)?.title || 'this book' : 'this book'
              }" for an additional 2 weeks?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRenewDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleRenewBook}>
              Renew Book
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
            <DialogDescription>
              Share your thoughts about "{
                selectedRecord ? books.find(b => b.id === selectedRecord.bookID)?.title || 'this book' : 'this book'
              }" with other readers.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewRating(star)}
                    className="p-1"
                  >
                    <Star
                      className={cn(
                        "h-6 w-6 transition-colors",
                        star <= reviewRating
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300 hover:text-yellow-200"
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Review</label>
              <Textarea
                placeholder="Write your review here..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReviewDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitReview} disabled={!reviewText.trim()}>
              Submit Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}