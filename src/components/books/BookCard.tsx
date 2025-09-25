import Image from "next/image";
import Link from "next/link";
import type { Book } from "@/lib/types";
import { placeholderImages } from "@/lib/placeholder-images";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { BookmarkButton } from "@/components/bookmarks/BookmarkButton";

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
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
    <Card className="flex flex-col overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <Link href={`/books/${book.id}`} className="flex-grow">
        <CardHeader className="p-0 relative">
          <Badge className={cn("absolute top-2 right-2 z-10 text-white", getStatusBadgeVariant(book.availabilityStatus))}>
            {book.availabilityStatus.replace("_", " ")}
          </Badge>
          <div className="absolute top-2 left-2 z-10">
            <BookmarkButton
              bookId={book.id}
              bookTitle={book.title}
              size="sm"
              className="bg-white/90 hover:bg-white shadow-sm"
            />
          </div>
          <Image
            src={coverImage.imageUrl}
            alt={`Cover of ${book.title}`}
            width={400}
            height={600}
            className="object-cover w-full h-64"
            data-ai-hint={coverImage.imageHint}
          />
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg font-bold leading-tight line-clamp-2 font-headline">{book.title}</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">{book.author}</p>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full" variant="secondary">
          <Link href={`/books/${book.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
