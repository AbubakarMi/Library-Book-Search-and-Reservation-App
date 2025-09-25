"use client";

import { BookFilters } from "@/components/books/BookFilters";
import { BookCard } from "@/components/books/BookCard";
import { SearchProvider, useSearch } from "@/context/SearchContext";
import { Input } from "@/components/ui/input";
import { Search, Loader2, BookOpen, Users, Clock, Award, TrendingUp, ArrowRight, Star } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { books, bookCategories } from "@/lib/mock-data";
import { placeholderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import Link from "next/link";

function SearchResults() {
  const {
    searchTerm,
    setSearchTerm,
    filteredBooks,
    isLoading,
    totalResults,
    currentPage,
    setCurrentPage,
    booksPerPage
  } = useSearch();

  const searchParams = useSearchParams();

  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch && urlSearch !== searchTerm) {
      setSearchTerm(urlSearch);
    }
  }, [searchParams, searchTerm, setSearchTerm]);

  // Get featured books (highest rated or most popular)
  const featuredBooks = books.slice(0, 6);

  // Get popular categories with book counts
  const popularCategories = bookCategories.slice(0, 6).map(category => ({
    name: category,
    count: books.filter(book => book.category === category).length,
    image: placeholderImages[Math.floor(Math.random() * placeholderImages.length)]
  }));

  // Statistics for the hero section
  const stats = {
    totalBooks: books.length,
    totalUsers: 2547,
    totalReservations: 1834,
    avgRating: 4.2
  };

  const startIndex = (currentPage - 1) * booksPerPage;
  const endIndex = startIndex + booksPerPage;
  const currentBooks = filteredBooks.slice(startIndex, endIndex);
  const totalPages = Math.ceil(totalResults / booksPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showSearchResults = searchTerm.length > 0 || filteredBooks.length < books.length;

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full py-20 md:py-32 lg:py-40 bg-gradient-to-br from-primary/5 via-primary/10 to-secondary/5 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmMWY1ZjkiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxLjUiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40"></div>

        <div className="container relative px-4 md:px-6">
          <div className="flex flex-col items-center space-y-8 text-center">
            {/* Main Heading */}
            <div className="space-y-4">
              <Badge variant="secondary" className="px-4 py-1.5 text-sm font-medium">
                📚 Welcome to the Future of Library Management
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl font-headline bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                LibroReserva
              </h1>
              <p className="mx-auto max-w-[800px] text-lg text-muted-foreground md:text-xl lg:text-2xl leading-relaxed">
                Discover, search, and reserve your next great read from our extensive digital library.
                Experience seamless book management with modern features.
              </p>
            </div>

            {/* Enhanced Search Bar */}
            <div className="w-full max-w-2xl space-y-4">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  type="search"
                  placeholder="Search by title, author, or category..."
                  className="w-full pl-12 pr-4 py-4 text-lg h-14 rounded-2xl border-2 border-border/50 focus:border-primary/50 bg-background/80 backdrop-blur-sm shadow-lg focus:shadow-xl transition-all duration-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Quick Search Suggestions */}
              <div className="flex flex-wrap gap-2 justify-center">
                {['Fiction', 'Science', 'History', 'Biography', 'Romance'].map((category) => (
                  <Button
                    key={category}
                    variant="outline"
                    size="sm"
                    className="rounded-full px-4 py-1 text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => setSearchTerm(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 w-full max-w-4xl">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold">{stats.totalBooks.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Books Available</div>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold">{stats.totalReservations.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Books Reserved</div>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold">{stats.avgRating}</div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      {!showSearchResults && (
        <section className="py-16 md:py-24 bg-background">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl font-headline mb-4">
                Featured Books
              </h2>
              <p className="max-w-[600px] mx-auto text-muted-foreground md:text-lg">
                Discover our most popular and highly-rated books, carefully curated for your reading pleasure.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
              {featuredBooks.map((book) => (
                <div key={book.id} className="group">
                  <Link href={`/books/${book.id}`} className="block">
                    <div className="relative overflow-hidden rounded-xl bg-muted aspect-[3/4] mb-3 shadow-md group-hover:shadow-xl transition-all duration-300">
                      <Image
                        src={placeholderImages.find(p => p.id === book.coverImageId)?.imageUrl || placeholderImages[0].imageUrl}
                        alt={`Cover of ${book.title}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    </div>
                    <h3 className="font-semibold text-sm line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">{book.author}</p>
                  </Link>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button size="lg" className="rounded-full px-8">
                View All Books
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Popular Categories Section */}
      {!showSearchResults && (
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline mb-4">
                Explore Categories
              </h2>
              <p className="max-w-[600px] mx-auto text-muted-foreground md:text-lg">
                Browse through our diverse collection of books across multiple genres and topics.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {popularCategories.map((category) => (
                <Card key={category.name} className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-border/50">
                  <CardContent className="p-4 text-center space-y-3">
                    <div className="relative w-12 h-12 mx-auto rounded-full overflow-hidden bg-primary/10">
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {category.count} books
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      {!showSearchResults && (
        <section className="py-16 md:py-24 bg-background">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline mb-4">
                Why Choose LibroReserva?
              </h2>
              <p className="max-w-[600px] mx-auto text-muted-foreground md:text-lg">
                Experience the future of library management with our advanced features and user-friendly interface.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border-border/50 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                    <Search className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Smart Search</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Find books instantly with our intelligent search system. Filter by category, author, availability, and more.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Instant Reservations</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Reserve books with just one click. Get real-time notifications about availability and pickup status.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Personalized Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Get personalized recommendations, bookmark favorites, and track your reading history.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Search Results Section - Only show when searching */}
      {showSearchResults && (
        <section className="py-12 md:py-16 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row gap-8">
              <aside className="w-full md:w-1/4 lg:w-1/5">
                <BookFilters />
              </aside>
              <div className="flex-1">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Showing {startIndex + 1}-{Math.min(endIndex, totalResults)} of {totalResults} results
                    </span>
                    {searchTerm && (
                      <Badge variant="secondary">
                        "{searchTerm}"
                      </Badge>
                    )}
                  </div>
                  {isLoading && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                </div>

                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: booksPerPage }).map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="bg-gray-300 dark:bg-gray-600 h-64 rounded-lg mb-4"></div>
                        <div className="bg-gray-300 dark:bg-gray-600 h-4 rounded mb-2"></div>
                        <div className="bg-gray-300 dark:bg-gray-600 h-3 rounded w-2/3"></div>
                      </div>
                    ))}
                  </div>
                ) : currentBooks.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {currentBooks.map((book) => (
                      <BookCard key={book.id} book={book} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                      <Search className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No books found</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      We couldn't find any books matching your search criteria. Try adjusting your search terms or filters.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm('');
                        // Reset filters would go here
                      }}
                      className="rounded-full"
                    >
                      Clear Search
                    </Button>
                  </div>
                )}

                {totalPages > 1 && (
                  <div className="mt-12">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage > 1) handlePageChange(currentPage - 1);
                            }}
                            className={currentPage <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const page = Math.max(1, Math.min(totalPages - 4, Math.max(1, currentPage - 2))) + i;
                          if (page <= totalPages) {
                            return (
                              <PaginationItem key={page}>
                                <PaginationLink
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handlePageChange(page);
                                  }}
                                  isActive={currentPage === page}
                                  className="cursor-pointer"
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          }
                          return null;
                        })}
                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage < totalPages) handlePageChange(currentPage + 1);
                            }}
                            className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Call to Action Section */}
      {!showSearchResults && (
        <section className="py-16 md:py-24 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline mb-4">
                Ready to Start Your Reading Journey?
              </h2>
              <p className="text-lg mb-8 text-primary-foreground/90">
                Join thousands of readers who have already discovered their next favorite book through LibroReserva.
                Sign up today and get access to our entire collection.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="rounded-full px-8">
                  Sign Up Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-8 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                  Explore Books
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default function Home() {
  return (
    <SearchProvider>
      <SearchResults />
    </SearchProvider>
  );
}