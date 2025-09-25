import Image from "next/image";
import { books } from "@/lib/mock-data";
import { placeholderImages } from "@/lib/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Book, Calendar, Languages, Star } from "lucide-react";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";

type BookDetailPageProps = {
  params: { id: string };
};

export default function BookDetailPage({ params }: BookDetailPageProps) {
  const book = books.find((b) => b.id === params.id);

  if (!book) {
    notFound();
  }

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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
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

          <div className="pt-4">
            <Button size="lg" className="w-full md:w-auto" disabled={book.availabilityStatus !== 'available'}>
              Reserve Book
            </Button>
            {book.availabilityStatus === 'reserved' && (
              <p className="text-sm text-warning-foreground mt-2">This book is currently reserved. You can join the waiting queue.</p>
            )}
            {book.availabilityStatus === 'checked_out' && (
              <p className="text-sm text-destructive-foreground mt-2">This book is currently checked out and unavailable for reservation.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
