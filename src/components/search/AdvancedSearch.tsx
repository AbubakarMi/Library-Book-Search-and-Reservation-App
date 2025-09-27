"use client";

import { useState, useRef, useEffect } from 'react';
import { Search, Filter, History, Save, X, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useSearch } from '@/context/SearchContext';
import { useToast } from '@/hooks/use-toast';

export function AdvancedSearch() {
  const {
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    searchSuggestions,
    searchHistory,
    clearSearchHistory,
    savedSearches,
    saveCurrentSearch,
    loadSavedSearch,
    deleteSavedSearch
  } = useSearch();

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [saveSearchName, setSaveSearchName] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const categories = ['Fiction', 'Non-Fiction', 'Science', 'Technology', 'History', 'Biography', 'Fantasy', 'Mystery'];
  const languages = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese'];
  const genres = ['Adventure', 'Romance', 'Thriller', 'Horror', 'Comedy', 'Drama', 'Action'];
  const availabilityOptions = ['Available', 'Checked Out', 'Reserved'];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
  };

  const handleSaveSearch = () => {
    if (saveSearchName.trim()) {
      saveCurrentSearch(saveSearchName.trim());
      setSaveSearchName('');
      toast({
        title: "Search Saved",
        description: `Search "${saveSearchName}" has been saved`,
        duration: 3000,
      });
    }
  };

  const handleLoadSavedSearch = (index: number) => {
    loadSavedSearch(index);
    toast({
      title: "Search Loaded",
      description: "Saved search has been applied",
      duration: 3000,
    });
  };

  const resetFilters = () => {
    setFilters({
      availability: [],
      categories: [],
      languages: [],
      yearRange: [1900, new Date().getFullYear()],
      isbn: '',
      publisher: '',
      genres: [],
      rating: null
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Main Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search by title, author, ISBN, publisher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="pl-10 pr-4"
                />

                {/* Search Suggestions Dropdown */}
                {showSuggestions && (searchSuggestions.length > 0 || searchHistory.length > 0) && (
                  <Card className="absolute z-50 w-full mt-1 max-h-96 overflow-y-auto">
                    <CardContent className="p-2">
                      {searchSuggestions.length > 0 && (
                        <div className="mb-2">
                          <Label className="text-xs text-muted-foreground mb-1 block">Suggestions</Label>
                          {searchSuggestions.map((suggestion, index) => (
                            <Button
                              key={index}
                              variant="ghost"
                              className="w-full justify-start h-auto p-2 text-left"
                              onMouseDown={() => handleSuggestionClick(suggestion)}
                            >
                              <Search className="h-3 w-3 mr-2 text-muted-foreground" />
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      )}

                      {searchHistory.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <Label className="text-xs text-muted-foreground">Recent Searches</Label>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={clearSearchHistory}
                              className="h-auto p-1"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                          {searchHistory.slice(0, 5).map((term, index) => (
                            <Button
                              key={index}
                              variant="ghost"
                              className="w-full justify-start h-auto p-2 text-left"
                              onMouseDown={() => handleSuggestionClick(term)}
                            >
                              <History className="h-3 w-3 mr-2 text-muted-foreground" />
                              {term}
                            </Button>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>

              <Button type="submit">
                <Search className="h-4 w-4" />
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? 'bg-primary text-primary-foreground' : ''}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>

              {/* Saved Searches */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Save className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Manage Searches</DialogTitle>
                  </DialogHeader>
                  <Tabs defaultValue="save" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="save">Save Current</TabsTrigger>
                      <TabsTrigger value="load">Load Saved</TabsTrigger>
                    </TabsList>

                    <TabsContent value="save" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="search-name">Search Name</Label>
                        <Input
                          id="search-name"
                          placeholder="Enter a name for this search"
                          value={saveSearchName}
                          onChange={(e) => setSaveSearchName(e.target.value)}
                        />
                      </div>
                      <Button onClick={handleSaveSearch} disabled={!saveSearchName.trim()}>
                        Save Search
                      </Button>
                    </TabsContent>

                    <TabsContent value="load" className="space-y-4">
                      {savedSearches.length === 0 ? (
                        <p className="text-muted-foreground text-center py-4">No saved searches</p>
                      ) : (
                        <div className="space-y-2">
                          {savedSearches.map((search, index) => (
                            <div key={index} className="flex items-center justify-between p-2 border rounded">
                              <div>
                                <p className="font-medium">{search.name}</p>
                                <p className="text-sm text-muted-foreground">{search.query || 'No search term'}</p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleLoadSavedSearch(index)}
                                >
                                  Load
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => deleteSavedSearch(index)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Advanced Filters */}
      {showFilters && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Advanced Filters</CardTitle>
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* ISBN Filter */}
              <div className="space-y-2">
                <Label>ISBN</Label>
                <Input
                  placeholder="Search by ISBN"
                  value={filters.isbn}
                  onChange={(e) => setFilters({ ...filters, isbn: e.target.value })}
                />
              </div>

              {/* Publisher Filter */}
              <div className="space-y-2">
                <Label>Publisher</Label>
                <Input
                  placeholder="Search by publisher"
                  value={filters.publisher}
                  onChange={(e) => setFilters({ ...filters, publisher: e.target.value })}
                />
              </div>

              {/* Rating Filter */}
              <div className="space-y-2">
                <Label>Minimum Rating</Label>
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <Select
                    value={filters.rating?.toString() || ''}
                    onValueChange={(value) => setFilters({ ...filters, rating: value ? Number(value) : null })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any rating</SelectItem>
                      <SelectItem value="1">1+ stars</SelectItem>
                      <SelectItem value="2">2+ stars</SelectItem>
                      <SelectItem value="3">3+ stars</SelectItem>
                      <SelectItem value="4">4+ stars</SelectItem>
                      <SelectItem value="5">5 stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <Label>Categories</Label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={filters.categories.includes(category)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFilters({ ...filters, categories: [...filters.categories, category] });
                        } else {
                          setFilters({ ...filters, categories: filters.categories.filter(c => c !== category) });
                        }
                      }}
                    />
                    <Label htmlFor={`category-${category}`} className="text-sm">
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Genres */}
            <div className="space-y-2">
              <Label>Genres</Label>
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <div key={genre} className="flex items-center space-x-2">
                    <Checkbox
                      id={`genre-${genre}`}
                      checked={filters.genres.includes(genre)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFilters({ ...filters, genres: [...filters.genres, genre] });
                        } else {
                          setFilters({ ...filters, genres: filters.genres.filter(g => g !== genre) });
                        }
                      }}
                    />
                    <Label htmlFor={`genre-${genre}`} className="text-sm">
                      {genre}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="space-y-2">
              <Label>Availability</Label>
              <div className="flex flex-wrap gap-2">
                {availabilityOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`availability-${option}`}
                      checked={filters.availability.includes(option)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFilters({ ...filters, availability: [...filters.availability, option] });
                        } else {
                          setFilters({ ...filters, availability: filters.availability.filter(a => a !== option) });
                        }
                      }}
                    />
                    <Label htmlFor={`availability-${option}`} className="text-sm">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="space-y-2">
              <Label>Languages</Label>
              <div className="flex flex-wrap gap-2">
                {languages.map((language) => (
                  <div key={language} className="flex items-center space-x-2">
                    <Checkbox
                      id={`language-${language}`}
                      checked={filters.languages.includes(language)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFilters({ ...filters, languages: [...filters.languages, language] });
                        } else {
                          setFilters({ ...filters, languages: filters.languages.filter(l => l !== language) });
                        }
                      }}
                    />
                    <Label htmlFor={`language-${language}`} className="text-sm">
                      {language}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Publication Year Range */}
            <div className="space-y-2">
              <Label>Publication Year Range</Label>
              <div className="px-3">
                <Slider
                  min={1900}
                  max={new Date().getFullYear()}
                  step={1}
                  value={filters.yearRange}
                  onValueChange={(value) => setFilters({ ...filters, yearRange: value as [number, number] })}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>{filters.yearRange[0]}</span>
                  <span>{filters.yearRange[1]}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Filters Display */}
      {(filters.categories.length > 0 || filters.languages.length > 0 || filters.availability.length > 0 ||
        filters.genres.length > 0 || filters.isbn || filters.publisher || filters.rating) && (
        <Card>
          <CardContent className="pt-4">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium">Active filters:</span>

              {filters.categories.map((category) => (
                <Badge key={category} variant="secondary" className="cursor-pointer" onClick={() =>
                  setFilters({ ...filters, categories: filters.categories.filter(c => c !== category) })
                }>
                  {category} <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}

              {filters.genres.map((genre) => (
                <Badge key={genre} variant="secondary" className="cursor-pointer" onClick={() =>
                  setFilters({ ...filters, genres: filters.genres.filter(g => g !== genre) })
                }>
                  {genre} <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}

              {filters.languages.map((language) => (
                <Badge key={language} variant="secondary" className="cursor-pointer" onClick={() =>
                  setFilters({ ...filters, languages: filters.languages.filter(l => l !== language) })
                }>
                  {language} <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}

              {filters.availability.map((availability) => (
                <Badge key={availability} variant="secondary" className="cursor-pointer" onClick={() =>
                  setFilters({ ...filters, availability: filters.availability.filter(a => a !== availability) })
                }>
                  {availability} <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}

              {filters.isbn && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() =>
                  setFilters({ ...filters, isbn: '' })
                }>
                  ISBN: {filters.isbn} <X className="h-3 w-3 ml-1" />
                </Badge>
              )}

              {filters.publisher && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() =>
                  setFilters({ ...filters, publisher: '' })
                }>
                  Publisher: {filters.publisher} <X className="h-3 w-3 ml-1" />
                </Badge>
              )}

              {filters.rating && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() =>
                  setFilters({ ...filters, rating: null })
                }>
                  {filters.rating}+ stars <X className="h-3 w-3 ml-1" />
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}