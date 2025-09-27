"use client";

import { BookFilters } from "@/components/books/BookFilters";
import { BookCard } from "@/components/books/BookCard";
import { SearchProvider, useSearch } from "@/context/SearchContext";
import { Input } from "@/components/ui/input";
import { Search, Loader2, BookOpen, Users, Clock, Award, TrendingUp, ArrowRight, Star, Sparkles, Zap, Shield, Heart, Quote } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { books, bookCategories } from "@/lib/mock-data";
import { placeholderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import Link from "next/link";

function SearchParamsHandler() {
  const { searchTerm, setSearchTerm } = useSearch();

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlSearch = urlParams.get('search');
      if (urlSearch && urlSearch !== searchTerm) {
        setSearchTerm(urlSearch);
      }
    }
  }, [searchTerm, setSearchTerm]);

  return null;
}

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

  // Enhanced Testimonials data with social proof
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Book Enthusiast & Blogger",
      location: "New York, USA",
      avatar: "/api/placeholder/64/64",
      content: "LibroReserva has completely revolutionized how I discover and reserve books. The AI-powered recommendations are spot on, and I've discovered so many hidden gems!",
      rating: 5,
      badge: "Power Reader",
      booksRead: 127,
      joinedMonths: 8,
      favorite: "Fiction"
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      role: "University Professor",
      location: "California, USA",
      avatar: "/api/placeholder/64/64",
      content: "As an academic, the advanced search filters and research tools have been game-changing. My students love the collaborative features too!",
      rating: 5,
      badge: "Academic",
      booksRead: 89,
      joinedMonths: 6,
      favorite: "Science"
    },
    {
      id: 3,
      name: "Emily Davis",
      role: "Head Librarian",
      location: "London, UK",
      avatar: "/api/placeholder/64/64",
      content: "The analytics dashboard has transformed how we manage our collection. We've seen 40% increase in book circulation since implementing LibroReserva!",
      rating: 5,
      badge: "Library Pro",
      booksRead: 203,
      joinedMonths: 12,
      favorite: "Management"
    }
  ];

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
      {/* Ultra-Enhanced Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 via-indigo-50 to-purple-100 dark:from-slate-900 dark:via-blue-900 dark:via-indigo-900 dark:to-purple-900">
        {/* Animated Particle Background */}
        <div className="absolute inset-0">
          {/* Enhanced Floating Elements with Advanced Animations */}
          <div className="absolute top-20 left-10 opacity-30 animate-float delay-1000 animate-slide-in-left">
            <div className="relative hover-rotate-3d animate-morphing">
              <BookOpen className="h-8 w-8 text-primary drop-shadow-lg hover-wiggle" />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-sm animate-pulse"></div>
            </div>
          </div>
          <div className="absolute top-32 right-20 opacity-25 animate-float delay-2000 animate-slide-in-right">
            <div className="relative hover-rotate-3d">
              <Sparkles className="h-6 w-6 text-purple-500 drop-shadow-lg animate-spin-slow hover-bounce" />
              <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-sm animate-pulse animate-morphing"></div>
            </div>
          </div>
          <div className="absolute bottom-32 left-20 opacity-35 animate-float delay-3000">
            <div className="relative">
              <Star className="h-10 w-10 text-yellow-500 drop-shadow-lg" />
              <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-sm animate-pulse"></div>
            </div>
          </div>
          <div className="absolute bottom-20 right-10 opacity-30 animate-float delay-500">
            <div className="relative">
              <Heart className="h-7 w-7 text-pink-500 drop-shadow-lg" />
              <div className="absolute inset-0 bg-pink-500/20 rounded-full blur-sm animate-pulse"></div>
            </div>
          </div>
          <div className="absolute top-40 left-1/2 opacity-20 animate-float delay-1500">
            <div className="relative">
              <BookOpen className="h-5 w-5 text-cyan-500 drop-shadow-lg" />
              <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-sm animate-pulse"></div>
            </div>
          </div>
          <div className="absolute bottom-40 right-1/3 opacity-25 animate-float delay-2500">
            <div className="relative">
              <Zap className="h-6 w-6 text-orange-500 drop-shadow-lg" />
              <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-sm animate-pulse"></div>
            </div>
          </div>

          {/* Enhanced Gradient Orbs with Animation */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/30 via-purple-400/20 to-cyan-400/30 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/30 via-pink-400/20 to-indigo-400/30 rounded-full blur-3xl animate-blob-reverse"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-emerald-400/25 via-teal-400/15 to-blue-400/25 rounded-full blur-2xl animate-blob-slow"></div>

          {/* Animated Mesh Gradient */}
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-blue-100/50 to-transparent animate-gradient-shift"></div>
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-transparent via-purple-100/50 to-transparent animate-gradient-shift-reverse"></div>
          </div>

          {/* Enhanced Grid Pattern with Animation */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJtIDYwIDAgaC02MCB2IDYwIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwIiBzdHJva2Utd2lkdGg9IjAuMyIgb3BhY2l0eT0iMC4xNSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20 animate-grid-float"></div>
        </div>

        <div className="container relative z-10 px-4 md:px-6">
          <div className="flex flex-col items-center space-y-10 text-center">
            {/* Enhanced Animated Badge */}
            <div className="animate-fade-in-up animate-bounce-in">
              <div className="relative group hover-lift">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-full blur-lg group-hover:blur-xl transition-all duration-500 animate-pulse animate-morphing"></div>
                <Badge
                  variant="secondary"
                  className="relative px-8 py-3 text-sm font-semibold bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-2 border-primary/30 hover:border-primary/50 hover:scale-110 transition-all duration-500 shadow-2xl hover:shadow-primary/25"
                >
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Sparkles className="w-4 h-4 text-primary animate-spin-slow" />
                      <div className="absolute inset-0 bg-primary/20 rounded-full blur-sm animate-pulse"></div>
                    </div>
                    <span className="text-gradient-primary font-headline font-semibold tracking-loose">
                      Welcome to the Future of Library Management
                    </span>
                    <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
                  </div>
                </Badge>
              </div>
            </div>

            {/* Enhanced Main Heading with Advanced Animations */}
            <div className="space-y-8 animate-fade-in-up delay-200">
              <div className="relative">
                {/* Animated Background Text */}
                <div className="absolute inset-0 select-none pointer-events-none">
                  <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight font-headline opacity-5 blur-sm transform scale-110">
                    <span className="block">
                      LibroReserva
                    </span>
                  </h1>
                </div>

                {/* Main Text with Ultra-Enhanced Typography */}
                <h1 className="relative text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-ultra-tight font-display leading-ultra-tight transform hover:scale-105 transition-transform duration-700 text-shadow-lg animate-scale-in">
                  <span className="block text-gradient-primary animate-gradient-shift bg-300% hover-wiggle cursor-pointer" data-text="LibroReserva">
                    LibroReserva
                  </span>
                  {/* Enhanced Animated Underline */}
                  <div className="h-3 w-32 bg-gradient-to-r from-primary via-blue-500 to-purple-500 mx-auto mt-6 rounded-full animate-pulse shadow-2xl glow-primary animate-text-reveal animate-morphing"></div>
                </h1>
              </div>

              <div className="relative">
                <div className="mx-auto max-w-[1000px] text-xl md:text-2xl lg:text-4xl leading-ultra-relaxed font-body text-gray-700 dark:text-gray-200 transform hover:scale-105 transition-all duration-500 text-shadow">
                  <span className="font-light">
                    Transform your reading experience with our
                  </span>
                  <span className="relative font-bold text-gradient-primary mx-2">
                    intelligent library system
                    <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-600 animate-pulse rounded-full"></span>
                  </span>
                  <span className="font-light">.</span>
                  <br className="block" />
                  <span className="inline-block mt-4 font-light">
                    Discover, reserve, and track books
                    <span className="relative">
                      <span className="font-bold text-gradient-accent ml-2">
                        like never before
                      </span>
                      <Sparkles className="inline-block w-7 h-7 ml-3 text-purple-500 animate-spin-slow" />
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Ultra-Enhanced Search Bar with Advanced Glassmorphism */}
            <div className="w-full max-w-4xl space-y-8 animate-fade-in-up delay-400">
              <div className="relative group">
                {/* Multi-layered Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-purple-500/25 to-cyan-500/30 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500 animate-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-indigo-500/15 to-purple-500/20 rounded-3xl blur-xl opacity-70 animate-gradient-shift"></div>

                {/* Enhanced Glass Container */}
                <div className="relative glass-effect rounded-3xl border-2 border-white/30 dark:border-gray-500/20 shadow-2xl hover:shadow-4xl transition-all duration-500 overflow-hidden">
                  {/* Internal Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-blue-500/5 pointer-events-none"></div>

                  <div className="flex items-center p-3 relative z-10">
                    <div className="flex items-center pl-8 pr-6">
                      <div className="relative">
                        <Search className="h-7 w-7 text-primary group-focus-within:scale-125 group-focus-within:text-blue-600 transition-all duration-500" />
                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
                      </div>
                    </div>
                    <Input
                      type="search"
                      placeholder="Search by title, author, category, or ISBN..."
                      className="flex-1 border-0 bg-transparent text-xl placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 h-16 font-body font-medium tracking-loose"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button
                      size="lg"
                      className="mr-3 rounded-2xl px-10 py-4 bg-gradient-to-r from-blue-600 via-primary to-indigo-600 hover:from-blue-700 hover:via-primary hover:to-indigo-700 shadow-2xl hover:shadow-primary/25 hover:scale-105 transition-all duration-500 text-white font-headline font-bold tracking-loose text-lg glow-primary"
                    >
                      <Search className="w-5 h-5 mr-2" />
                      Search
                      <Sparkles className="w-5 h-5 ml-2 animate-pulse" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Ultra-Enhanced Quick Search Suggestions */}
              <div className="flex flex-wrap gap-4 justify-center">
                {[
                  { name: 'Fiction', icon: BookOpen, color: 'from-rose-500 to-pink-600' },
                  { name: 'Science', icon: Zap, color: 'from-blue-500 to-cyan-600' },
                  { name: 'History', icon: Clock, color: 'from-amber-500 to-orange-600' },
                  { name: 'Biography', icon: Users, color: 'from-green-500 to-emerald-600' },
                  { name: 'Romance', icon: Heart, color: 'from-purple-500 to-pink-600' },
                  { name: 'Technology', icon: Star, color: 'from-indigo-500 to-blue-600' }
                ].map((category, index) => (
                  <div key={category.name} className="relative group cursor-magnetic">
                    <div className={`absolute inset-0 bg-gradient-to-r ${category.color} rounded-full blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300`}></div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="relative rounded-full px-6 py-3 text-sm font-medium bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-2 border-white/30 dark:border-gray-600/30 hover:bg-gradient-to-r hover:from-white hover:to-gray-50 dark:hover:from-gray-800 dark:hover:to-gray-700 hover:border-primary/40 hover:scale-110 hover:shadow-xl transition-all duration-500 group hover-lift ripple-effect"
                      onClick={() => setSearchTerm(category.name)}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <category.icon className="w-4 h-4 mr-2 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300" />
                      {category.name}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Ultra-Enhanced Stats Grid with Advanced Glass Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 w-full max-w-6xl animate-fade-in-up delay-600">
              {[
                { icon: BookOpen, value: stats.totalBooks.toLocaleString(), label: "Books Available", color: "from-blue-500 via-cyan-500 to-blue-600", bgGlow: "from-blue-500/20 to-cyan-500/20" },
                { icon: Users, value: stats.totalUsers.toLocaleString(), label: "Happy Readers", color: "from-purple-500 via-pink-500 to-purple-600", bgGlow: "from-purple-500/20 to-pink-500/20" },
                { icon: Clock, value: stats.totalReservations.toLocaleString(), label: "Books Reserved", color: "from-green-500 via-emerald-500 to-green-600", bgGlow: "from-green-500/20 to-emerald-500/20" },
                { icon: Star, value: stats.avgRating, label: "Average Rating", color: "from-yellow-500 via-orange-500 to-yellow-600", bgGlow: "from-yellow-500/20 to-orange-500/20" }
              ].map((stat, index) => (
                <div key={stat.label} className="relative group cursor-magnetic">
                  {/* Outer Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${stat.bgGlow} rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                  <Card className="relative glass-effect border-2 border-white/20 dark:border-gray-500/20 hover:border-white/40 dark:hover:border-gray-400/40 transition-all duration-500 hover:scale-110 hover:shadow-2xl group overflow-hidden interactive-tilt hover-lift hover-glow">
                    {/* Internal Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGlow} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}></div>

                    <CardContent className="relative p-8 text-center">
                      <div className="relative mb-6">
                        {/* Icon Background Glow */}
                        <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500`}></div>
                        <div className={`relative w-16 h-16 bg-gradient-to-r ${stat.color} rounded-3xl flex items-center justify-center mx-auto group-hover:scale-125 group-hover:rotate-6 transition-all duration-500 shadow-2xl`}>
                          <stat.icon className="h-8 w-8 text-white drop-shadow-lg" />
                        </div>
                        {/* Sparkle Effects */}
                        <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-all duration-500 animate-bounce">
                          <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse cursor-magnetic" />
                        </div>
                        <div className="absolute -top-2 -left-2 opacity-0 group-hover:opacity-100 transition-all duration-700 animate-ping">
                          <div className="h-2 w-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                        </div>
                      </div>

                      <div className="text-5xl font-black text-gradient-secondary mb-3 group-hover:scale-105 transition-transform duration-500 font-display tracking-tight text-shadow animate-number-counter hover-bounce cursor-pointer">
                        {stat.value}
                      </div>
                      <div className="text-base font-semibold text-gray-700 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-500 font-headline tracking-loose">
                        {stat.label}
                      </div>

                      {/* Bottom Accent Line */}
                      <div className={`h-1 bg-gradient-to-r ${stat.color} rounded-full mx-auto mt-4 w-0 group-hover:w-12 transition-all duration-500`}></div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            {/* Ultra-Enhanced Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mt-16 animate-fade-in-up delay-800">
              <div className="relative group cursor-magnetic">
                {/* Animated Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/40 via-primary/30 to-indigo-600/40 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 animate-pulse"></div>
                <Button size="lg" className="relative rounded-3xl px-16 py-6 bg-gradient-to-r from-blue-600 via-primary to-indigo-600 hover:from-blue-700 hover:via-blue-600 hover:to-indigo-700 shadow-2xl hover:shadow-primary/40 hover:scale-110 transition-all duration-500 text-lg font-semibold text-white border-2 border-white/20 overflow-hidden group hover-lift ripple-effect interactive-tilt animate-bounce-in animate-stagger-1">
                  {/* Internal Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <div className="relative flex items-center">
                    <div className="relative mr-3">
                      <Sparkles className="h-6 w-6 animate-spin-slow" />
                      <div className="absolute inset-0 bg-white/30 rounded-full blur-sm animate-pulse"></div>
                    </div>
                    <span>Get Started Free</span>
                    <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </Button>
              </div>

              <div className="relative group cursor-magnetic">
                {/* Subtle Glow for Outline Button */}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-400/20 to-gray-600/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Button size="lg" variant="outline" className="relative rounded-3xl px-16 py-6 glass-effect border-2 border-white/30 dark:border-gray-500/30 hover:border-primary/40 hover:scale-110 transition-all duration-500 text-lg font-semibold backdrop-blur-xl overflow-hidden group hover-lift interactive-tilt hover-glow animate-bounce-in animate-stagger-2">
                  {/* Subtle Internal Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative flex items-center">
                    <BookOpen className="mr-3 h-6 w-6 group-hover:scale-125 group-hover:rotate-12 group-hover:text-primary transition-all duration-300" />
                    <span className="group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-blue-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500">
                      Explore Library
                    </span>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 dark:border-gray-600 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 dark:bg-gray-600 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Ultra-Enhanced Features Showcase */}
      {!showSearchResults && (
        <section className="py-32 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-slate-900 dark:to-blue-900/20 relative overflow-hidden">
          {/* Advanced Background Patterns */}
          <div className="absolute inset-0">
            {/* Multi-layered Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-indigo-50/30 to-purple-50/40 dark:from-blue-900/30 dark:via-indigo-900/20 dark:to-purple-900/30 animate-gradient-shift"></div>
            <div className="absolute inset-0 bg-gradient-to-tl from-cyan-50/30 via-transparent to-emerald-50/30 dark:from-cyan-900/20 dark:via-transparent dark:to-emerald-900/20 animate-gradient-shift-reverse"></div>

            {/* Floating Geometric Patterns */}
            <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-2xl animate-blob"></div>
            <div className="absolute bottom-32 left-16 w-40 h-40 bg-gradient-to-r from-emerald-200/20 to-cyan-200/20 rounded-full blur-2xl animate-blob-reverse"></div>
            <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-r from-pink-200/20 to-purple-200/20 rounded-full blur-xl animate-blob-slow"></div>

            {/* Enhanced Grid Pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZG90cyIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjEuNSIgZmlsbD0iIzAwMCIgb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2RvdHMpIi8+PC9zdmc+')] opacity-30 animate-grid-float"></div>
          </div>
          <div className="container relative px-4 md:px-6">
            <div className="text-center mb-20 relative z-10">
              <div className="relative group mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-500 animate-pulse"></div>
                <Badge variant="outline" className="relative px-8 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-2 border-primary/30 hover:border-primary/50 hover:scale-105 transition-all duration-300 shadow-xl">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary animate-pulse" />
                    <span className="font-bold text-gradient-primary font-headline tracking-loose">
                      Powerful Features
                    </span>
                  </div>
                </Badge>
              </div>

              <div className="relative mb-8">
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-ultra-tight font-display mb-8 transform hover:scale-105 transition-transform duration-500 text-shadow-lg animate-flip-in">
                  <span className="text-gradient-secondary animate-gradient-shift bg-300% hover-wiggle cursor-pointer">
                    Why Choose LibroReserva?
                  </span>
                  <div className="h-2 w-40 bg-gradient-to-r from-primary via-blue-500 to-purple-500 mx-auto mt-6 rounded-full animate-gradient-shift shadow-xl glow-gradient animate-text-reveal animate-morphing"></div>
                </h2>
              </div>

              <p className="max-w-5xl mx-auto text-xl md:text-2xl lg:text-3xl text-gray-700 dark:text-gray-200 leading-ultra-relaxed transform hover:scale-105 transition-all duration-300 font-body text-shadow-sm">
                <span className="font-light">
                  Experience the future of library management with
                </span>
                <span className="font-bold text-gradient-primary mx-2">
                  cutting-edge features
                </span>
                <span className="font-light">
                  designed for modern readers.
                </span>
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
              {[
                {
                  icon: Search,
                  title: "AI-Powered Search",
                  description: "Find books instantly with our intelligent search system. Get personalized recommendations based on your reading preferences.",
                  color: "from-blue-500 to-cyan-500",
                  features: ["Smart autocomplete", "Typo tolerance", "Category filtering"]
                },
                {
                  icon: Zap,
                  title: "Instant Reservations",
                  description: "Reserve books with one click and get real-time notifications about availability and pickup status.",
                  color: "from-purple-500 to-pink-500",
                  features: ["Real-time updates", "Queue management", "Mobile notifications"]
                },
                {
                  icon: Heart,
                  title: "Personalized Experience",
                  description: "Get tailored recommendations, track your reading journey, and discover your next favorite book.",
                  color: "from-green-500 to-emerald-500",
                  features: ["Reading analytics", "Personal wishlist", "Progress tracking"]
                },
                {
                  icon: Shield,
                  title: "Secure & Reliable",
                  description: "Your data is protected with enterprise-grade security and 99.9% uptime guarantee.",
                  color: "from-red-500 to-orange-500",
                  features: ["End-to-end encryption", "Data backup", "Privacy protection"]
                },
                {
                  icon: BookOpen,
                  title: "Rich Content",
                  description: "Access detailed book information, reviews, ratings, and recommendations from our community.",
                  color: "from-yellow-500 to-orange-500",
                  features: ["Book reviews", "Community ratings", "Author information"]
                },
                {
                  icon: TrendingUp,
                  title: "Analytics Dashboard",
                  description: "Track your reading habits, set goals, and monitor your progress with beautiful visualizations.",
                  color: "from-indigo-500 to-purple-500",
                  features: ["Reading statistics", "Goal setting", "Progress charts"]
                }
              ].map((feature, index) => (
                <Card key={feature.title} className={`group relative overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2`}>
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                  <CardHeader className="pb-4">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                    <ul className="space-y-2">
                      {feature.features.map((item) => (
                        <li key={item} className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <div className={`w-1.5 h-1.5 bg-gradient-to-r ${feature.color} rounded-full mr-3`}></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Books Section */}
      {!showSearchResults && (
        <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4 px-4 py-2 bg-primary/5 border-primary/20">
                <BookOpen className="w-4 h-4 mr-2" />
                Curated Collection
              </Badge>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight font-headline mb-6">
                <span className="bg-gradient-to-r from-gray-800 via-gray-900 to-black dark:from-gray-100 dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
                  Featured Books
                </span>
              </h2>
              <p className="max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-300">
                Discover our handpicked selection of the most popular and highly-rated books.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
              {featuredBooks.map((book, index) => (
                <div key={book.id} className="group" style={{ animationDelay: `${index * 100}ms` }}>
                  <Link href={`/books/${book.id}`} className="block">
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4 shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:scale-105">
                      <Image
                        src={placeholderImages.find(p => p.id === book.coverImageId)?.imageUrl || placeholderImages[0].imageUrl}
                        alt={book.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/20">
                          {book.availabilityStatus}
                        </Badge>
                      </div>
                    </div>
                    <h3 className="font-bold text-sm line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{book.author}</p>
                  </Link>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button size="lg" className="rounded-2xl px-12 py-4 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <BookOpen className="mr-2 h-5 w-5" />
                Explore Full Collection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Ultra-Enhanced Testimonials & Social Proof Section */}
      {!showSearchResults && (
        <section className="py-32 bg-gradient-to-br from-purple-50 via-rose-50 via-white to-pink-50 dark:from-purple-900/30 dark:via-gray-900 dark:via-slate-900 dark:to-pink-900/30 relative overflow-hidden">
          {/* Enhanced Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-100/40 via-pink-100/30 to-rose-100/40 dark:from-purple-900/40 dark:via-pink-900/20 dark:to-rose-900/40 animate-gradient-shift"></div>
            <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-r from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-blob"></div>
            <div className="absolute bottom-32 right-20 w-32 h-32 bg-gradient-to-r from-rose-200/30 to-orange-200/30 rounded-full blur-2xl animate-blob-reverse"></div>
            <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-gradient-to-r from-yellow-200/20 to-pink-200/20 rounded-full blur-xl animate-blob-slow"></div>
          </div>

          <div className="container relative px-4 md:px-6">
            {/* Enhanced Header */}
            <div className="text-center mb-20">
              <div className="relative group mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-500 animate-pulse"></div>
                <Badge variant="outline" className="relative px-8 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-2 border-purple-300/30 hover:border-purple-400/50 hover:scale-105 transition-all duration-300 shadow-xl">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current animate-pulse" style={{animationDelay: `${i * 100}ms`}} />
                      ))}
                    </div>
                    <span className="font-bold text-gradient-accent font-headline tracking-loose">
                      5.0 • 2,547+ Happy Users
                    </span>
                  </div>
                </Badge>
              </div>

              <div className="relative mb-8">
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-ultra-tight font-display mb-8 transform hover:scale-105 transition-transform duration-500 text-shadow-lg animate-slide-in-left">
                  <span className="text-gradient-secondary animate-gradient-shift bg-300% hover-wiggle cursor-pointer">
                    What Our Community Says
                  </span>
                  <div className="h-2 w-48 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 mx-auto mt-6 rounded-full animate-gradient-shift shadow-xl glow-gradient animate-text-reveal animate-morphing"></div>
                </h2>
              </div>

              <p className="max-w-5xl mx-auto text-xl md:text-2xl lg:text-3xl text-gray-700 dark:text-gray-200 leading-ultra-relaxed font-body text-shadow-sm mb-12">
                <span className="font-light">
                  Join
                </span>
                <span className="font-bold text-gradient-primary mx-2">
                  thousands of satisfied readers
                </span>
                <span className="font-light">
                  who have transformed their library experience with LibroReserva.
                </span>
              </p>

              {/* Social Proof Stats */}
              <div className="flex flex-wrap justify-center gap-8 mb-16">
                <div className="flex items-center gap-2 px-6 py-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-full border border-purple-200/30 hover:scale-105 transition-all duration-300 cursor-magnetic animate-bounce-in animate-stagger-1 hover-lift">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse animate-morphing"></div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300 font-headline animate-number-counter">2,547+ Active Users</span>
                </div>
                <div className="flex items-center gap-2 px-6 py-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-full border border-purple-200/30 hover:scale-105 transition-all duration-300 cursor-magnetic animate-bounce-in animate-stagger-2 hover-lift">
                  <BookOpen className="w-4 h-4 text-blue-500 hover-wiggle" />
                  <span className="font-semibold text-gray-700 dark:text-gray-300 font-headline animate-number-counter">50K+ Books Reserved</span>
                </div>
                <div className="flex items-center gap-2 px-6 py-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-full border border-purple-200/30 hover:scale-105 transition-all duration-300 cursor-magnetic animate-bounce-in animate-stagger-3 hover-lift">
                  <Heart className="w-4 h-4 text-pink-500 hover-bounce" />
                  <span className="font-semibold text-gray-700 dark:text-gray-300 font-headline animate-number-counter">99.8% Satisfaction</span>
                </div>
              </div>
            </div>

            {/* Ultra-Enhanced Testimonials Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={testimonial.id} className="relative group cursor-magnetic animate-fade-in-up" style={{animationDelay: `${index * 150}ms`}}>
                  {/* Outer Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/15 to-rose-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <Card className="relative glass-effect border-2 border-white/30 dark:border-gray-500/20 hover:border-purple-300/50 dark:hover:border-purple-400/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl group overflow-hidden interactive-tilt hover-lift">
                    {/* Internal Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <CardContent className="relative p-8">
                      {/* Enhanced Rating & Badge */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-5 h-5 text-yellow-400 fill-current group-hover:scale-110 transition-transform duration-300"
                              style={{animationDelay: `${i * 100}ms`}}
                            />
                          ))}
                        </div>
                        <Badge
                          variant="secondary"
                          className="px-3 py-1 text-xs font-semibold bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 border-purple-200/50 hover:scale-105 transition-all duration-300"
                        >
                          {testimonial.badge}
                        </Badge>
                      </div>

                      {/* Enhanced Quote */}
                      <div className="relative mb-6">
                        <Quote className="absolute -top-2 -left-2 w-8 h-8 text-purple-300/50 group-hover:text-purple-400/70 transition-colors duration-300" />
                        <blockquote className="text-gray-700 dark:text-gray-300 leading-ultra-relaxed font-body text-shadow-sm pl-6 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-300">
                          "{testimonial.content}"
                        </blockquote>
                      </div>

                      {/* Enhanced User Info */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <Avatar className="relative w-14 h-14 mr-4 group-hover:scale-110 transition-transform duration-300 border-2 border-white/50 group-hover:border-purple-300/50">
                              <AvatarImage src={testimonial.avatar} />
                              <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold">
                                {testimonial.name.split(' ').map(n => n.charAt(0)).join('')}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 dark:text-gray-100 font-headline group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors duration-300">
                              {testimonial.name}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 font-body">
                              {testimonial.role}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 font-body">
                              {testimonial.location}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Social Proof Stats */}
                      <div className="mt-6 pt-6 border-t border-gray-200/50 dark:border-gray-700/50 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          <span>{testimonial.booksRead} books</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{testimonial.joinedMonths}mo member</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          <span>{testimonial.favorite}</span>
                        </div>
                      </div>

                      {/* Hover Effect Accent */}
                      <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-500 rounded-full"></div>
                    </CardContent>
                  </Card>
                </div>
              ))}
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

      {/* Enhanced Call to Action Section */}
      {!showSearchResults && (
        <section className="py-24 relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-blue-600 to-purple-600">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMS41Ii8+PC9nPjwvZz48L3N2Zz4=')] animate-pulse"></div>

            {/* Floating Elements */}
            <div className="absolute top-20 left-20 opacity-20">
              <BookOpen className="h-12 w-12 text-white animate-bounce delay-1000" />
            </div>
            <div className="absolute bottom-20 right-20 opacity-20">
              <Star className="h-10 w-10 text-white animate-bounce delay-2000" />
            </div>
          </div>

          <div className="container relative px-4 md:px-6">
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight font-headline mb-6 text-white">
                Ready to Transform Your
                <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  Reading Experience?
                </span>
              </h2>
              <p className="text-xl md:text-2xl mb-12 text-blue-100 leading-relaxed">
                Join thousands of book lovers who have already discovered the future of library management.
                <span className="block mt-2 font-semibold">Start your journey today - completely free!</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
                <Button
                  size="lg"
                  className="rounded-2xl px-12 py-6 bg-white text-primary hover:bg-gray-50 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 text-lg font-semibold"
                >
                  <Sparkles className="mr-3 h-6 w-6" />
                  Start Free Trial
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-2xl px-12 py-6 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm shadow-xl hover:scale-105 transition-all duration-300 text-lg font-semibold"
                >
                  <BookOpen className="mr-3 h-6 w-6" />
                  View Demo
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center justify-center space-x-8 text-blue-200">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  <span className="text-sm">Secure & Private</span>
                </div>
                <div className="flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  <span className="text-sm">Instant Setup</span>
                </div>
                <div className="flex items-center">
                  <Heart className="h-5 w-5 mr-2" />
                  <span className="text-sm">Loved by 2500+ Users</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

// Add custom CSS for animations
const style = `
  @keyframes fade-in-up {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in-up {
    animation: fade-in-up 0.8s ease-out;
  }

  .delay-200 {
    animation-delay: 200ms;
  }

  .delay-400 {
    animation-delay: 400ms;
  }

  .delay-600 {
    animation-delay: 600ms;
  }

  .delay-800 {
    animation-delay: 800ms;
  }
`;

export default function Home() {
  return (
    <SearchProvider>
      <style jsx>{style}</style>
      <SearchParamsHandler />
      <SearchResults />
    </SearchProvider>
  );
}