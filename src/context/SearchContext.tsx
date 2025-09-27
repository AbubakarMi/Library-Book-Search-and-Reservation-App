"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Book } from '@/lib/types';
import { books } from '@/lib/mock-data';

interface SearchFilters {
  availability: string[];
  categories: string[];
  languages: string[];
  yearRange: [number, number];
  isbn: string;
  publisher: string;
  genres: string[];
  rating: number | null;
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
  searchSuggestions: string[];
  searchHistory: string[];
  clearSearchHistory: () => void;
  savedSearches: { name: string; query: string; filters: SearchFilters }[];
  saveCurrentSearch: (name: string) => void;
  loadSavedSearch: (index: number) => void;
  deleteSavedSearch: (index: number) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

const initialFilters: SearchFilters = {
  availability: [],
  categories: [],
  languages: [],
  yearRange: [1900, new Date().getFullYear()],
  isbn: '',
  publisher: '',
  genres: [],
  rating: null
};

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(books);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [savedSearches, setSavedSearches] = useState<{ name: string; query: string; filters: SearchFilters }[]>([]);
  const booksPerPage = 12;

  // Load search history and saved searches from localStorage
  useEffect(() => {
    const history = localStorage.getItem('searchHistory');
    const saved = localStorage.getItem('savedSearches');

    if (history) {
      try {
        setSearchHistory(JSON.parse(history));
      } catch (error) {
        console.error('Error loading search history:', error);
      }
    }

    if (saved) {
      try {
        setSavedSearches(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading saved searches:', error);
      }
    }
  }, []);

  // Generate search suggestions based on book data and search history
  const searchSuggestions = React.useMemo(() => {
    if (!searchTerm || searchTerm.length < 2) return [];

    const suggestions = new Set<string>();
    const term = searchTerm.toLowerCase();

    // Add suggestions from book titles, authors, categories
    books.forEach(book => {
      if (book.title.toLowerCase().includes(term)) {
        suggestions.add(book.title);
      }
      if (book.author.toLowerCase().includes(term)) {
        suggestions.add(book.author);
      }
      if (book.category.toLowerCase().includes(term)) {
        suggestions.add(book.category);
      }
    });

    // Add from search history
    searchHistory.forEach(historyItem => {
      if (historyItem.toLowerCase().includes(term)) {
        suggestions.add(historyItem);
      }
    });

    return Array.from(suggestions).slice(0, 8);
  }, [searchTerm, searchHistory]);

  // Save search term to history
  const saveToHistory = (term: string) => {
    if (!term.trim() || searchHistory.includes(term)) return;

    const newHistory = [term, ...searchHistory.slice(0, 9)]; // Keep last 10 searches
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  const saveCurrentSearch = (name: string) => {
    const newSearch = { name, query: searchTerm, filters };
    const updated = [...savedSearches, newSearch];
    setSavedSearches(updated);
    localStorage.setItem('savedSearches', JSON.stringify(updated));
  };

  const loadSavedSearch = (index: number) => {
    const saved = savedSearches[index];
    if (saved) {
      setSearchTerm(saved.query);
      setFilters(saved.filters);
    }
  };

  const deleteSavedSearch = (index: number) => {
    const updated = savedSearches.filter((_, i) => i !== index);
    setSavedSearches(updated);
    localStorage.setItem('savedSearches', JSON.stringify(updated));
  };

  useEffect(() => {
    setIsLoading(true);

    // Save search term to history when user searches
    if (searchTerm && searchTerm.length > 2) {
      const timer = setTimeout(() => {
        saveToHistory(searchTerm);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [searchTerm]);

  useEffect(() => {
    setIsLoading(true);

    // Simulate API call delay
    const timer = setTimeout(() => {
      let filtered = books;

      // Apply search term filter with enhanced matching
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(book =>
          book.title.toLowerCase().includes(term) ||
          book.author.toLowerCase().includes(term) ||
          book.category.toLowerCase().includes(term) ||
          book.isbn?.toLowerCase().includes(term) ||
          book.publisher?.toLowerCase().includes(term) ||
          book.description?.toLowerCase().includes(term)
        );
      }

      // Apply ISBN filter
      if (filters.isbn) {
        const isbn = filters.isbn.toLowerCase();
        filtered = filtered.filter(book =>
          book.isbn?.toLowerCase().includes(isbn)
        );
      }

      // Apply publisher filter
      if (filters.publisher) {
        const publisher = filters.publisher.toLowerCase();
        filtered = filtered.filter(book =>
          book.publisher?.toLowerCase().includes(publisher)
        );
      }

      // Apply rating filter
      if (filters.rating !== null) {
        filtered = filtered.filter(book =>
          book.rating && book.rating >= filters.rating!
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

      // Apply genre filter
      if (filters.genres.length > 0) {
        filtered = filtered.filter(book =>
          book.genres?.some(genre => filters.genres.includes(genre))
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
      booksPerPage,
      searchSuggestions,
      searchHistory,
      clearSearchHistory,
      savedSearches,
      saveCurrentSearch,
      loadSavedSearch,
      deleteSavedSearch
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