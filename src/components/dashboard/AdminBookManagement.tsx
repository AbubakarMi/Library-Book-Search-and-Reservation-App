"use client";

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MoreHorizontal, PlusCircle, Upload, X, Image as ImageIcon, Save } from 'lucide-react';
import Image from 'next/image';

import { books as initialBooks, bookCategories } from '@/lib/mock-data';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import type { Book } from '@/lib/types';
import { cn } from '@/lib/utils';


const bookFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  category: z.string().min(1, 'Category is required'),
  publicationYear: z.coerce.number().min(1000, 'Invalid year'),
  language: z.string().min(1, 'Language is required'),
  availabilityStatus: z.enum(['available', 'reserved', 'checked_out']),
});

type BookFormValues = z.infer<typeof bookFormSchema>;

export default function AdminBookManagement() {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookFormSchema),
  });

  const onSubmit = (data: BookFormValues) => {
    if (editingBook) {
      setBooks(books.map(b => b.id === editingBook.id ? { ...editingBook, ...data } : b));
    } else {
      const newBook: Book = {
        id: `book-${Date.now()}`,
        coverImageId: uploadedImage || `book-cover-${(books.length % 12) + 1}`,
        ...data,
      };
      setBooks([newBook, ...books]);
    }
    closeDialog();
  };

  const openDialog = (book: Book | null = null) => {
    setEditingBook(book);
    form.reset(book || {
      title: '',
      author: '',
      category: '',
      publicationYear: new Date().getFullYear(),
      language: 'English',
      availabilityStatus: 'available',
    });
    setIsDialogOpen(true);
  };
  
  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingBook(null);
    setUploadedImage(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please select a valid image file.');
      }
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const deleteBook = (bookId: string) => {
    setBooks(books.filter(b => b.id !== bookId));
  };

  const getStatusBadgeVariant = (status: "available" | "reserved" | "checked_out") => {
    switch (status) {
      case "available":
        return "bg-success";
      case "reserved":
        return "bg-warning";
      case "checked_out":
        return "bg-destructive";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>All Books</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => openDialog()}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Book
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingBook ? 'Edit Book' : 'Add New Book'}</DialogTitle>
                <DialogDescription>
                  {editingBook ? 'Update the book details.' : 'Add a new book to the collection.'}
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Image Upload Section */}
                  <div className="space-y-3">
                    <FormLabel className="text-base font-semibold">Book Cover Image</FormLabel>
                    <div className="border border-dashed border-muted-foreground/25 rounded-lg p-6">
                      <div className="flex flex-col sm:flex-row items-center gap-6">
                        {uploadedImage ? (
                          <div className="relative flex-shrink-0">
                            <div className="w-32 h-44 relative rounded-lg overflow-hidden border shadow-md">
                              <Image
                                src={uploadedImage}
                                alt="Book cover preview"
                                fill
                                className="object-cover"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 h-7 w-7 rounded-full p-0 shadow-md"
                              onClick={removeImage}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="w-32 h-44 border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center bg-muted/20 flex-shrink-0">
                            <ImageIcon className="h-12 w-12 text-muted-foreground/40 mb-2" />
                            <p className="text-xs text-muted-foreground text-center">No image</p>
                          </div>
                        )}
                        <div className="flex-1 space-y-3 w-full">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="cover-upload"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full h-12"
                          >
                            <Upload className="h-5 w-5 mr-3" />
                            {uploadedImage ? 'Change Cover Image' : 'Upload Cover Image'}
                          </Button>
                          <div className="text-center space-y-1">
                            <p className="text-sm text-muted-foreground">
                              Recommended: 300×400px, JPG or PNG
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Maximum file size: 5MB
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold border-b pb-2">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="title" render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Book Title</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter the complete book title"
                              className="h-11"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="author" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Author</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Author's full name"
                              className="h-11"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="publicationYear" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Publication Year</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              placeholder="e.g., 2023"
                              className="h-11"
                              min="1000"
                              max={new Date().getFullYear()}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                  </div>
                  {/* Additional Details */}
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold border-b pb-2">Additional Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="category" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-11">
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {bookCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="language" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Language</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="e.g., English, Spanish"
                              className="h-11"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                  </div>

                  {/* Availability Status */}
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold border-b pb-2">Availability</h3>
                    <FormField control={form.control} name="availabilityStatus" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Select availability status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="available">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                Available
                              </div>
                            </SelectItem>
                            <SelectItem value="reserved">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                Reserved
                              </div>
                            </SelectItem>
                            <SelectItem value="checked_out">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                Checked Out
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <DialogFooter className="flex-col sm:flex-row gap-3 pt-6 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={closeDialog}
                      className="w-full sm:w-auto"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="w-full sm:w-auto"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {editingBook ? 'Update Book' : 'Add Book'}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">Title</TableHead>
                <TableHead className="hidden sm:table-cell min-w-[150px]">Author</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[70px]"><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {books.map((book) => (
                <TableRow key={book.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-medium">{book.title}</div>
                      <div className="text-sm text-muted-foreground sm:hidden">
                        by {book.author}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{book.author}</TableCell>
                  <TableCell className="hidden md:table-cell">{book.category}</TableCell>
                  <TableCell>
                    <Badge className={cn("text-white text-xs", getStatusBadgeVariant(book.availabilityStatus))}>
                      {book.availabilityStatus.replace('_', ' ')}
                    </Badge>
                  </TableCell>
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
                        <DropdownMenuItem onClick={() => openDialog(book)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => deleteBook(book.id)}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
