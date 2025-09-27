"use client";

import Image from "next/image";
import { books } from "@/lib/mock-data";
import { placeholderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Book, Calendar, Languages, Star, Heart, BookOpen, AlertTriangle, Clock, ArrowLeft, User } from "lucide-react";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/context/NotificationContext";
import { useAuth } from "@/hooks/useAuth";
import { BookmarkButton } from "@/components/bookmarks/BookmarkButton";
import { useState } from "react";
import { useRouter } from "next/navigation";
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

type BookDetailPageProps = {
  params: { id: string };
};

export default function BookDetailPage({ params }: BookDetailPageProps) {
  const book = books.find((b) => b.id === params.id);
  const { sendReservationNotification, addNotification } = useNotifications();
  const { user } = useAuth();
  const router = useRouter();
  const [isReserving, setIsReserving] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showReserveDialog, setShowReserveDialog] = useState(false);

  if (!book) {
    notFound();
  }

  const handleReservation = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    setIsReserving(true);

    try {
      // Create reservation record
      const reservation = {
        id: `res_${Date.now()}`,
        userID: user.id,
        bookID: book.id,
        reservationDate: new Date().toISOString(),
        status: 'pending'
      };

      // Save reservation to localStorage
      const existingReservations = localStorage.getItem('reservations');
      const reservations = existingReservations ? JSON.parse(existingReservations) : [];
      reservations.push(reservation);
      localStorage.setItem('reservations', JSON.stringify(reservations));

      // Send notification to admins
      const adminNotification = {
        id: `admin_notif_${Date.now()}`,
        type: 'info',
        title: 'New Book Reservation',
        message: `${user.name} has requested to reserve "${book.title}". Please review and approve/reject this reservation.`,
        read: false,
        timestamp: new Date().toISOString(),
        reservationId: reservation.id,
        bookTitle: book.title,
        studentName: user.name,
        studentEmail: user.email
      };

      // Send notification to all admin users
      const existingUsers = localStorage.getItem('users');
      const users = existingUsers ? JSON.parse(existingUsers) : [];
      const adminUsers = users.filter((u: any) => u.role === 'admin');

      adminUsers.forEach((admin: any) => {
        const adminNotifications = localStorage.getItem(`notifications_${admin.id}`);
        const notifications = adminNotifications ? JSON.parse(adminNotifications) : [];
        notifications.push(adminNotification);
        localStorage.setItem(`notifications_${admin.id}`, JSON.stringify(notifications));
      });

      // Send confirmation to student
      addNotification({
        id: `notification-${Date.now()}`,
        type: 'success',
        title: 'Reservation Submitted!',
        message: `Your reservation request for "${book.title}" has been submitted and is pending admin approval. You'll be notified once it's approved.`,
        read: false,
        createdAt: new Date().toISOString()
      });

      // Dispatch event for real-time updates
      window.dispatchEvent(new CustomEvent('reservationCreated', {
        detail: { reservation, adminNotification }
      }));

    } catch (error) {
      addNotification({
        id: `notification-${Date.now()}`,
        type: 'error',
        title: 'Reservation Failed',
        message: 'There was an error processing your reservation. Please try again.',
        read: false,
        createdAt: new Date().toISOString()
      });
    }

    setIsReserving(false);
    setShowReserveDialog(false);
  };

  const handleJoinQueue = () => {
    addNotification({
      id: `notification-${Date.now()}`,
      type: 'info',
      title: 'Added to Queue',
      message: `You've been added to the waiting queue for "${book.title}". Estimated wait: 2-3 weeks.`,
      read: false,
      createdAt: new Date().toISOString()
    });
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const coverImage = placeholderImages.find(p => p.id === book.coverImageId) || placeholderImages[0];

  const getStatusBadgeVariant = (status: "available" | "reserved" | "checked_out") => {
    switch (status) {
      case "available":
        return "bg-success hover:bg-success/80";
      case "reserved":
        return "bg-warning text-warning-foreground hover:bg-warning/80";
      case "checked_out":
        return "bg-destructive hover:bg-destructive/80";
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="flex justify-center">
            <Image
              src={coverImage.imageUrl}
              alt={`Cover of ${book.title}`}
              width={400}
              height={600}
              className="rounded-lg shadow-2xl object-cover"
              data-ai-hint={coverImage.imageHint}
            />
        </div>
        <div className="flex flex-col space-y-6">
          <div>
            <Badge className={cn("text-white", getStatusBadgeVariant(book.availabilityStatus))}>
              {book.availabilityStatus.replace("_", " ")}
            </Badge>
            <h1 className="text-4xl font-bold mt-2 font-headline">{book.title}</h1>
            <p className="text-xl text-muted-foreground">by {book.author}</p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-5 w-5 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
              ))}
            </div>
            <span className="text-muted-foreground">(123 reviews)</span>
          </div>
          
          <p className="text-lg leading-relaxed">
            This comprehensive academic resource is carefully curated by the Aliko Dangote University Of Science and Technology Wudil Library to support student learning and research. Our collection focuses on providing quality educational materials that align with the university's academic programs and research initiatives.
          </p>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Book className="h-5 w-5 text-primary" />
              <span>Category: <strong>{book.category}</strong></span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span>Published: <strong>{book.publicationYear}</strong></span>
            </div>
            <div className="flex items-center space-x-2">
              <Languages className="h-5 w-5 text-primary" />
              <span>Language: <strong>{book.language}</strong></span>
            </div>
          </div>

          <div className="pt-4 space-y-3">
            {/* Availability Check & Action Buttons (Following Activity Diagram) */}
            {!user ? (
              <div className="space-y-3">
                <Button size="lg" className="w-full" onClick={() => router.push('/login')}>
                  <User className="mr-2 h-4 w-4" />
                  Sign In to Reserve Book
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  You must be signed in to reserve books
                </p>
              </div>
            ) : book.availabilityStatus === 'available' ? (
              <div className="space-y-3">
                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => setShowReserveDialog(true)}
                  disabled={isReserving}
                >
                  {isReserving ? (
                    <>
                      <BookOpen className="mr-2 h-4 w-4 animate-pulse" />
                      Processing Reservation...
                    </>
                  ) : (
                    <>
                      <Calendar className="mr-2 h-4 w-4" />
                      Reserve Book Now
                    </>
                  )}
                </Button>
                <div className="flex gap-2">
                  <BookmarkButton
                    bookId={book.id}
                    bookTitle={book.title}
                    variant="outline"
                    size="sm"
                    showText
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleWishlist}
                    className={cn(
                      "px-4",
                      isWishlisted && "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                    )}
                  >
                    <Heart className={cn("h-4 w-4", isWishlisted && "fill-current")} />
                  </Button>
                </div>
              </div>
            ) : (
              /* Show Unavailable Message with Alternatives (Following Activity Diagram) */
              <div className="space-y-4">
                <div className="p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center gap-2 text-red-800 dark:text-red-200 mb-2">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="font-semibold">Book Not Available</span>
                  </div>
                  <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                    This book is currently <strong>{book.availabilityStatus.replace('_', ' ')}</strong> and cannot be reserved at this time.
                  </p>
                </div>

                {/* Alternative Options */}
                <div className="p-4 bg-yellow-50 dark:bg-yellow-950/50 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-3">Alternative Options:</h4>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={handleJoinQueue}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      Join Waiting Queue (Est. 2-3 weeks)
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => router.push(`/?search=${encodeURIComponent(book.category)}`)}
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      Browse Similar Books in {book.category}
                    </Button>
                    <div className="flex gap-2">
                      <BookmarkButton
                        bookId={book.id}
                        bookTitle={book.title}
                        variant="outline"
                        size="sm"
                        showText
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleWishlist}
                        className={cn(
                          "px-4",
                          isWishlisted && "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                        )}
                      >
                        <Heart className={cn("h-4 w-4", isWishlisted && "fill-current")} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="container mx-auto px-4 py-8 md:px-6">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-6">Reviews & Ratings</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <div className="bg-muted rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold mb-2">4.2</div>
                  <div className="flex items-center justify-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-5 w-5 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">Based on 123 reviews</p>
                  <div className="mt-4 space-y-2">
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <div key={stars} className="flex items-center gap-2 text-sm">
                        <span className="w-3">{stars}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${stars * 20 - 20}%` }}></div>
                        </div>
                        <span className="w-8 text-right">{Math.floor(Math.random() * 30 + 10)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 space-y-6">
                {/* Sample Reviews */}
                {[
                  {
                    id: 1,
                    userName: "Sarah Johnson",
                    rating: 5,
                    date: "2 days ago",
                    review: "Absolutely loved this book! The characters were well-developed and the plot kept me engaged from start to finish. Highly recommend!"
                  },
                  {
                    id: 2,
                    userName: "Mike Chen",
                    rating: 4,
                    date: "1 week ago",
                    review: "Great read overall. Some parts were a bit slow, but the ending was worth it. The author's writing style is captivating."
                  },
                  {
                    id: 3,
                    userName: "Emma Wilson",
                    rating: 5,
                    date: "2 weeks ago",
                    review: "One of my favorite books this year. The themes are relevant and thought-provoking. A must-read!"
                  }
                ].map((review) => (
                  <div key={review.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold">{review.userName.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{review.userName}</p>
                          <p className="text-xs text-muted-foreground">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed">{review.review}</p>
                  </div>
                ))}

                <Button variant="outline" className="w-full">
                  View All Reviews
                </Button>
              </div>
            </div>
          </div>

          {/* Recommendations Section */}
          <div>
            <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {books.filter(b => b.id !== book.id && b.category === book.category).slice(0, 6).map((recommendedBook) => {
                const coverImage = placeholderImages.find(p => p.id === recommendedBook.coverImageId) || placeholderImages[0];
                return (
                  <div key={recommendedBook.id} className="group cursor-pointer">
                    <div className="aspect-[3/4] relative mb-2 overflow-hidden rounded-lg">
                      <Image
                        src={coverImage.imageUrl}
                        alt={`Cover of ${recommendedBook.title}`}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <h3 className="font-medium text-sm line-clamp-2 mb-1">{recommendedBook.title}</h3>
                    <p className="text-xs text-muted-foreground">{recommendedBook.author}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Reservation Confirmation Dialog (Following Activity Diagram) */}
      <AlertDialog open={showReserveDialog} onOpenChange={setShowReserveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Reservation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reserve "{book.title}"?
              <br /><br />
              <strong>What happens next:</strong>
              <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                <li>System will check final availability</li>
                <li>Your reservation will be confirmed</li>
                <li>You'll receive a notification when ready for pickup</li>
                <li>You have 3 days to collect after notification</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isReserving}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReservation}
              disabled={isReserving}
              className="bg-primary hover:bg-primary/90"
            >
              {isReserving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Confirming...
                </>
              ) : (
                'Confirm Reservation'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Back Navigation */}
      <div className="fixed bottom-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="bg-white/90 backdrop-blur-sm shadow-lg"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>
    </div>
  );
}
