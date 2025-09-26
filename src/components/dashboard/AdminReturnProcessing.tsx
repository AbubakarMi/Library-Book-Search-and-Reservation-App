"use client";

import { useState } from 'react';
import { borrowingRecords as initialBorrowingRecords, books, users } from '@/lib/mock-data';
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
import { Textarea } from '@/components/ui/textarea';
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
  DollarSign,
  Package,
  User,
  FileText,
  Search
} from 'lucide-react';
import Image from 'next/image';
import { placeholderImages } from '@/lib/placeholder-images';
import { useNotifications } from '@/context/NotificationContext';
import type { BorrowingRecord } from '@/lib/types';

type ReturnCondition = 'excellent' | 'good' | 'fair' | 'damaged';

export default function AdminReturnProcessing() {
  const { addNotification } = useNotifications();
  const [borrowingRecords, setBorrowingRecords] = useState(initialBorrowingRecords);
  const [showProcessDialog, setShowProcessDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<BorrowingRecord | null>(null);
  const [returnCondition, setReturnCondition] = useState<ReturnCondition>('good');
  const [librarianNotes, setLibrarianNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter records that need processing (active, overdue, or return requested)
  const pendingReturns = borrowingRecords.filter(r =>
    r.status === 'active' || r.status === 'overdue' || (r as any).status === 'return_requested'
  );

  // Filter by search term
  const filteredReturns = pendingReturns.filter(record => {
    const book = books.find(b => b.id === record.bookID);
    const user = users.find(u => u.id === record.userID);
    const searchLower = searchTerm.toLowerCase();

    return book?.title.toLowerCase().includes(searchLower) ||
           book?.author.toLowerCase().includes(searchLower) ||
           user?.name.toLowerCase().includes(searchLower) ||
           user?.email.toLowerCase().includes(searchLower);
  });

  const processReturn = async () => {
    if (!selectedRecord) return;

    setIsProcessing(true);

    // Calculate penalty if book is late
    const penalty = calculatePenalty(selectedRecord.dueDate);
    const currentDate = new Date().toISOString().split('T')[0];

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Update borrowing record - mark as returned
    setBorrowingRecords(prev =>
      prev.map(r =>
        r.id === selectedRecord.id
          ? {
              ...r,
              status: 'returned' as const,
              returnDate: currentDate,
              fineAmount: penalty > 0 ? penalty : undefined,
              returnCondition,
              librarianNotes
            }
          : r
      )
    );

    // Update book availability in catalog (make it available)
    const book = books.find(b => b.id === selectedRecord.bookID);
    const user = users.find(u => u.id === selectedRecord.userID);

    if (book) {
      book.availabilityStatus = 'available';
    }

    // Notify user that return has been processed
    addNotification({
      id: `notification-${Date.now()}`,
      type: 'success',
      title: 'Book Return Processed',
      message: `Your return of "${book?.title || 'Unknown Book'}" has been processed successfully.${penalty > 0 ? ` Late fee: $${penalty.toFixed(2)}` : ''}`,
      read: false,
      createdAt: new Date().toISOString()
    });

    // System notification for completion
    addNotification({
      id: `notification-${Date.now() + 1}`,
      type: 'info',
      title: 'Return Processing Complete',
      message: `${user?.name}'s return of "${book?.title}" has been completed. Book is now available in catalog.`,
      read: false,
      createdAt: new Date().toISOString()
    });

    setIsProcessing(false);
    setShowProcessDialog(false);
    setSelectedRecord(null);
    setReturnCondition('good');
    setLibrarianNotes('');
  };

  const calculatePenalty = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();

    if (today <= due) return 0;

    const diffTime = today.getTime() - due.getTime();
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
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-600 hover:bg-blue-700";
      case "overdue":
        return "bg-red-600 hover:bg-red-700";
      case "return_requested":
        return "bg-yellow-600 hover:bg-yellow-700";
      default:
        return "bg-gray-600 hover:bg-gray-700";
    }
  };

  const getConditionColor = (condition: ReturnCondition) => {
    switch (condition) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'fair': return 'text-yellow-600';
      case 'damaged': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Package className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold">{pendingReturns.length}</div>
            <div className="text-xs text-muted-foreground">Pending Returns</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div className="text-2xl font-bold text-red-600">
              {pendingReturns.filter(r => isOverdue(r.dueDate)).length}
            </div>
            <div className="text-xs text-muted-foreground">Overdue</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Calendar className="h-5 w-5 text-blue-500" />
            </div>
            <div className="text-2xl font-bold">
              {borrowingRecords.filter(r => r.status === 'returned' && r.returnDate === new Date().toISOString().split('T')[0]).length}
            </div>
            <div className="text-xs text-muted-foreground">Processed Today</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <DollarSign className="h-5 w-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold">
              $
              {borrowingRecords
                .filter(r => r.fineAmount && r.returnDate === new Date().toISOString().split('T')[0])
                .reduce((sum, r) => sum + (r.fineAmount || 0), 0)
                .toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground">Fines Today</div>
          </CardContent>
        </Card>
      </div>

      {/* Return Processing Interface */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Book Return Processing</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Process returned books and update system records
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by book title, author, or user..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredReturns.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book</TableHead>
                  <TableHead>Borrower</TableHead>
                  <TableHead>Borrowed</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Penalty</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReturns.map(record => {
                  const book = books.find(b => b.id === record.bookID);
                  const user = users.find(u => u.id === record.userID);
                  const coverImage = placeholderImages.find(p => p.id === book?.coverImageId) || placeholderImages[0];
                  const overdueStatus = isOverdue(record.dueDate);
                  const daysOverdue = getDaysOverdue(record.dueDate);
                  const penalty = calculatePenalty(record.dueDate);

                  return (
                    <TableRow key={record.id}>
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
                      <TableCell>{record.borrowDate}</TableCell>
                      <TableCell>
                        <div className={cn(
                          "flex items-center gap-1",
                          overdueStatus && "text-red-600 font-medium"
                        )}>
                          {record.dueDate}
                          {overdueStatus && (
                            <AlertTriangle className="h-4 w-4" />
                          )}
                          {overdueStatus && (
                            <div className="text-xs">
                              ({daysOverdue} days overdue)
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("capitalize text-white", getStatusBadgeVariant(record.status))}>
                          {record.status === 'return_requested' ? 'Return Requested' : record.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {penalty > 0 ? (
                          <span className="text-red-600 font-medium">${penalty.toFixed(2)}</span>
                        ) : (
                          <span className="text-green-600">$0.00</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedRecord(record);
                            setShowProcessDialog(true);
                          }}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Package className="h-3 w-3 mr-1" />
                          Process Return
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
              <h3 className="text-lg font-semibold mb-2">No Pending Returns</h3>
              <p>All books are currently returned or no returns pending processing.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Process Return Dialog */}
      <Dialog open={showProcessDialog} onOpenChange={setShowProcessDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Process Book Return</DialogTitle>
            <DialogDescription>
              Complete the return process for "{
                selectedRecord ? books.find(b => b.id === selectedRecord.bookID)?.title || 'this book' : 'this book'
              }"
            </DialogDescription>
          </DialogHeader>

          {selectedRecord && (
            <div className="space-y-6">
              {/* Return Summary */}
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-3">Return Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Borrower:</span>
                    <div className="font-medium">
                      {users.find(u => u.id === selectedRecord.userID)?.name || 'Unknown'}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Borrowed on:</span>
                    <div className="font-medium">{selectedRecord.borrowDate}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Due date:</span>
                    <div className={cn(
                      "font-medium",
                      isOverdue(selectedRecord.dueDate) && "text-red-600"
                    )}>
                      {selectedRecord.dueDate}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Late penalty:</span>
                    <div className={cn(
                      "font-medium",
                      calculatePenalty(selectedRecord.dueDate) > 0 ? "text-red-600" : "text-green-600"
                    )}>
                      ${calculatePenalty(selectedRecord.dueDate).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Book Condition Assessment */}
              <div className="space-y-4">
                <h4 className="font-semibold">Book Condition Assessment</h4>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Condition
                  </label>
                  <Select value={returnCondition} onValueChange={(value: ReturnCondition) => setReturnCondition(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent - Like new</SelectItem>
                      <SelectItem value="good">Good - Minor wear</SelectItem>
                      <SelectItem value="fair">Fair - Noticeable wear</SelectItem>
                      <SelectItem value="damaged">Damaged - Requires attention</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Librarian Notes
                  </label>
                  <Textarea
                    placeholder="Any observations about book condition, damages, or other notes..."
                    value={librarianNotes}
                    onChange={(e) => setLibrarianNotes(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              {/* Process Actions */}
              <div className="p-4 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Processing Actions:</h4>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>✓ Update return status in system</li>
                  <li>✓ {calculatePenalty(selectedRecord.dueDate) > 0 ? 'Apply late penalty' : 'No penalty required'}</li>
                  <li>✓ Update user borrowing record</li>
                  <li>✓ Make book available in catalog</li>
                  <li>✓ Send confirmation to user</li>
                </ul>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProcessDialog(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={processReturn} disabled={isProcessing} className="bg-green-600 hover:bg-green-700">
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing Return...
                </>
              ) : (
                'Complete Return Process'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}