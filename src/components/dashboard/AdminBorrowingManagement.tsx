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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  MoreHorizontal,
  RotateCcw,
  DollarSign,
  Clock,
  BookOpen,
  AlertTriangle,
  Calendar,
  PlusCircle
} from 'lucide-react';
import type { BorrowingRecord } from '@/lib/types';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { placeholderImages } from '@/lib/placeholder-images';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const extendDueDateSchema = z.object({
  newDueDate: z.string().min(1, 'New due date is required'),
});

type ExtendDueDateFormValues = z.infer<typeof extendDueDateSchema>;

export default function AdminBorrowingManagement() {
  const [borrowingRecords, setBorrowingRecords] = useState<BorrowingRecord[]>(initialBorrowingRecords);
  const [selectedRecord, setSelectedRecord] = useState<BorrowingRecord | null>(null);
  const [actionType, setActionType] = useState<'return' | 'extend' | null>(null);
  const [isExtendDialogOpen, setIsExtendDialogOpen] = useState(false);

  const activeBorrowings = borrowingRecords.filter(r => r.status === 'active');
  const overdueBorrowings = borrowingRecords.filter(r => r.status === 'overdue');
  const returnedBorrowings = borrowingRecords.filter(r => r.status === 'returned');

  const form = useForm<ExtendDueDateFormValues>({
    resolver: zodResolver(extendDueDateSchema),
  });

  const handleAction = (record: BorrowingRecord, action: 'return' | 'extend') => {
    setSelectedRecord(record);
    setActionType(action);

    if (action === 'extend') {
      setIsExtendDialogOpen(true);
      // Set current due date as default
      form.reset({ newDueDate: record.dueDate });
    }
  };

  const confirmReturn = () => {
    if (!selectedRecord) return;

    const currentDate = new Date().toISOString().split('T')[0];
    const dueDate = new Date(selectedRecord.dueDate);
    const returnDate = new Date(currentDate);

    // Calculate fine if overdue (assuming $1 per day)
    let fineAmount = 0;
    if (returnDate > dueDate) {
      const diffTime = Math.abs(returnDate.getTime() - dueDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      fineAmount = diffDays * 1; // $1 per day
    }

    setBorrowingRecords(borrowingRecords.map(r => {
      if (r.id === selectedRecord.id) {
        return {
          ...r,
          status: 'returned' as const,
          returnDate: currentDate,
          fineAmount: fineAmount > 0 ? fineAmount : undefined
        };
      }
      return r;
    }));

    setSelectedRecord(null);
    setActionType(null);
  };

  const onExtendSubmit = (data: ExtendDueDateFormValues) => {
    if (!selectedRecord) return;

    setBorrowingRecords(borrowingRecords.map(r => {
      if (r.id === selectedRecord.id) {
        return {
          ...r,
          dueDate: data.newDueDate,
          status: 'active' as const // Reset status to active if it was overdue
        };
      }
      return r;
    }));

    setIsExtendDialogOpen(false);
    setSelectedRecord(null);
    setActionType(null);
    form.reset();
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
          <TableHead>Borrower</TableHead>
          <TableHead>Borrow Date</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Return Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Fine</TableHead>
          {showActions && <TableHead><span className="sr-only">Actions</span></TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {records.map(record => {
          const book = books.find(b => b.id === record.bookID);
          const user = users.find(u => u.id === record.userID);
          const coverImage = placeholderImages.find(p => p.id === book?.coverImageId) || placeholderImages[0];
          const overdueStatus = isOverdue(record.dueDate, record.status);

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
                  overdueStatus && record.status !== 'returned' && "text-red-600 font-medium"
                )}>
                  {record.dueDate}
                  {overdueStatus && record.status !== 'returned' && (
                    <AlertTriangle className="inline ml-1 h-4 w-4" />
                  )}
                </div>
              </TableCell>
              <TableCell>{record.returnDate || '-'}</TableCell>
              <TableCell>
                <Badge className={cn("capitalize text-white", getStatusBadgeVariant(record.status))}>
                  {record.status}
                </Badge>
              </TableCell>
              <TableCell>
                {record.fineAmount ? `$${record.fineAmount.toFixed(2)}` : '-'}
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
                      {(record.status === 'active' || record.status === 'overdue') && (
                        <>
                          <DropdownMenuItem
                            onClick={() => handleAction(record, 'return')}
                            className="text-green-600"
                          >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Mark as Returned
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleAction(record, 'extend')}
                            className="text-blue-600"
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            Extend Due Date
                          </DropdownMenuItem>
                        </>
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

  const totalFines = borrowingRecords
    .filter(r => r.fineAmount)
    .reduce((sum, r) => sum + (r.fineAmount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Borrowings</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeBorrowings.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Books</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueBorrowings.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Returned Books</CardTitle>
            <RotateCcw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{returnedBorrowings.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fines</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalFines.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Borrowing Management */}
      <Card>
        <CardHeader>
          <CardTitle>Borrowing Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active">
            <TabsList>
              <TabsTrigger value="active">
                Active ({activeBorrowings.length})
              </TabsTrigger>
              <TabsTrigger value="overdue" className="text-red-600">
                Overdue ({overdueBorrowings.length})
              </TabsTrigger>
              <TabsTrigger value="returned">
                Returned ({returnedBorrowings.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active">
              {activeBorrowings.length > 0 ? (
                <BorrowingTable records={activeBorrowings} />
              ) : (
                <p className="text-muted-foreground p-4 text-center">No active borrowings.</p>
              )}
            </TabsContent>

            <TabsContent value="overdue">
              {overdueBorrowings.length > 0 ? (
                <BorrowingTable records={overdueBorrowings} />
              ) : (
                <p className="text-muted-foreground p-4 text-center">No overdue books.</p>
              )}
            </TabsContent>

            <TabsContent value="returned">
              {returnedBorrowings.length > 0 ? (
                <BorrowingTable records={returnedBorrowings} showActions={false} />
              ) : (
                <p className="text-muted-foreground p-4 text-center">No returned books.</p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Return Confirmation Dialog */}
      <AlertDialog
        open={selectedRecord !== null && actionType === 'return'}
        onOpenChange={() => {
          setSelectedRecord(null);
          setActionType(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark Book as Returned</AlertDialogTitle>
            <AlertDialogDescription>
              This will mark the book as returned. If the book is overdue, appropriate fines will be calculated automatically.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmReturn}
              className="bg-green-600 hover:bg-green-700"
            >
              Mark as Returned
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Extend Due Date Dialog */}
      <Dialog open={isExtendDialogOpen} onOpenChange={setIsExtendDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Extend Due Date</DialogTitle>
            <DialogDescription>
              Extend the due date for this borrowed book.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onExtendSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="newDueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Due Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setIsExtendDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Extend Due Date</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}