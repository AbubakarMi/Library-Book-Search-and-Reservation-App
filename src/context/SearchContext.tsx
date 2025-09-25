"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Book } from '@/lib/types';
import { books } from '@/lib/mock-data';

interface SearchFilters {
  availability: string[];
  categories: string[];
  languages: string[];
  yearRange: [number, number];
}

interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  filteredBooks: Book[];
  isLoading: boolean;
  totalResults: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  booksPerPage: number;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

const initialFilters: SearchFilters = {
  availability: [],
  categories: [],
  languages: [],
  yearRange: [1900, new Date().getFullYear()]
};

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(books);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 12;

  useEffect(() => {
    setIsLoading(true);

    // Simulate API call delay
    const timer = setTimeout(() => {
      let filtered = books;

      // Apply search term filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(book =>
          book.title.toLowerCase().includes(term) ||
          book.author.toLowerCase().includes(term) ||
          book.category.toLowerCase().includes(term)
        );
      }

      // Apply availability filter
      if (filters.availability.length > 0) {
        filtered = filtered.filter(book =>
          filters.availability.includes(book.availabilityStatus)
        );
      }

      // Apply category filter
      if (filters.categories.length > 0) {
        filtered = filtered.filter(book =>
          filters.categories.includes(book.category)
        );
      }

      // Apply language filter
      if (filters.languages.length > 0) {
        filtered = filtered.filter(book =>
          filters.languages.includes(book.language)
        );
      }

      // Apply year range filter
      filtered = filtered.filter(book =>
        book.publicationYear >= filters.yearRange[0] &&
        book.publicationYear <= filters.yearRange[1]
      );

      setFilteredBooks(filtered);
      setCurrentPage(1); // Reset to first page when filters change
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, filters]);

  const totalResults = filteredBooks.length;

  return (
    <SearchContext.Provider value={{
      searchTerm,
      setSearchTerm,
      filters,
      setFilters,
      filteredBooks,
      isLoading,
      totalResults,
      currentPage,
      setCurrentPage,
      booksPerPage
    }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}