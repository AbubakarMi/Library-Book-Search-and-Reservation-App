"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { bookCategories } from "@/lib/mock-data";
import { useSearch } from "@/context/SearchContext";
import { Badge } from "@/components/ui/badge";
import { X, RotateCcw } from "lucide-react";

export function BookFilters() {
  const { filters, setFilters } = useSearch();

  const availabilityOptions = [
    { value: "available", label: "Available" },
    { value: "reserved", label: "Reserved" },
    { value: "checked_out", label: "Checked Out" }
  ];

  const languageOptions = ["English", "Spanish", "French", "German", "Italian"];
  const currentYear = new Date().getFullYear();

  const handleAvailabilityChange = (value: string, checked: boolean) => {
    const newAvailability = checked
      ? [...filters.availability, value]
      : filters.availability.filter(a => a !== value);

    setFilters({ ...filters, availability: newAvailability });
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, category]
      : filters.categories.filter(c => c !== category);

    setFilters({ ...filters, categories: newCategories });
  };

  const handleLanguageChange = (language: string, checked: boolean) => {
    const newLanguages = checked
      ? [...filters.languages, language]
      : filters.languages.filter(l => l !== language);

    setFilters({ ...filters, languages: newLanguages });
  };

  const handleYearRangeChange = (newRange: [number, number]) => {
    setFilters({ ...filters, yearRange: newRange });
  };

  const clearAllFilters = () => {
    setFilters({
      availability: [],
      categories: [],
      languages: [],
      yearRange: [1900, currentYear]
    });
  };

  const removeFilter = (type: string, value: string) => {
    switch (type) {
      case 'availability':
        setFilters({ ...filters, availability: filters.availability.filter(a => a !== value) });
        break;
      case 'category':
        setFilters({ ...filters, categories: filters.categories.filter(c => c !== value) });
        break;
      case 'language':
        setFilters({ ...filters, languages: filters.languages.filter(l => l !== value) });
        break;
    }
  };

  const hasActiveFilters = filters.availability.length > 0 ||
    filters.categories.length > 0 ||
    filters.languages.length > 0 ||
    (filters.yearRange[0] !== 1900 || filters.yearRange[1] !== currentYear);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-headline">Filters</CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Clear All
            </Button>
          )}
        </div>

        {/* Active filters badges */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-1 mt-2">
            {filters.availability.map(item => (
              <Badge key={item} variant="secondary" className="text-xs">
                {availabilityOptions.find(opt => opt.value === item)?.label}
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => removeFilter('availability', item)}
                />
              </Badge>
            ))}
            {filters.categories.map(category => (
              <Badge key={category} variant="secondary" className="text-xs">
                {category}
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => removeFilter('category', category)}
                />
              </Badge>
            ))}
            {filters.languages.map(language => (
              <Badge key={language} variant="secondary" className="text-xs">
                {language}
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => removeFilter('language', language)}
                />
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={["availability", "category"]} className="w-full">
          <AccordionItem value="availability">
            <AccordionTrigger className="text-md">Availability</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-2">
                {availabilityOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`avail-${option.value}`}
                      checked={filters.availability.includes(option.value)}
                      onCheckedChange={(checked) =>
                        handleAvailabilityChange(option.value, checked as boolean)
                      }
                    />
                    <Label htmlFor={`avail-${option.value}`} className="font-normal">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="category">
            <AccordionTrigger className="text-md">Category</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-2 max-h-40 overflow-y-auto">
                {bookCategories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`cat-${category}`}
                      checked={filters.categories.includes(category)}
                      onCheckedChange={(checked) =>
                        handleCategoryChange(category, checked as boolean)
                      }
                    />
                    <Label htmlFor={`cat-${category}`} className="font-normal text-sm">
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="language">
            <AccordionTrigger className="text-md">Language</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-2">
                {languageOptions.map((lang) => (
                  <div key={lang} className="flex items-center space-x-2">
                    <Checkbox
                      id={`lang-${lang}`}
                      checked={filters.languages.includes(lang)}
                      onCheckedChange={(checked) =>
                        handleLanguageChange(lang, checked as boolean)
                      }
                    />
                    <Label htmlFor={`lang-${lang}`} className="font-normal">
                      {lang}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="year">
            <AccordionTrigger className="text-md">Publication Year</AccordionTrigger>
            <AccordionContent>
              <div className="pt-4">
                <div className="mb-4">
                  <Label className="text-sm font-medium">
                    {filters.yearRange[0]} - {filters.yearRange[1]}
                  </Label>
                </div>
                <Slider
                  value={filters.yearRange}
                  onValueChange={(value) => handleYearRangeChange(value as [number, number])}
                  max={currentYear}
                  min={1900}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>1900</span>
                  <span>{currentYear}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
