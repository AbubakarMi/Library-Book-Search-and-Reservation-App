"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { bookCategories } from "@/lib/mock-data";

export function BookFilters() {
  const availabilityOptions = ["Available", "Reserved", "Checked Out"];
  const languageOptions = ["English", "Spanish", "French"];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-headline">Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={["availability", "category"]} className="w-full">
          <AccordionItem value="availability">
            <AccordionTrigger className="text-md">Availability</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-2">
                {availabilityOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox id={`avail-${option}`} />
                    <Label htmlFor={`avail-${option}`} className="font-normal">{option}</Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="category">
            <AccordionTrigger className="text-md">Category</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-2">
                {bookCategories.slice(0, 5).map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox id={`cat-${category}`} />
                    <Label htmlFor={`cat-${category}`} className="font-normal">{category}</Label>
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
                    <Checkbox id={`lang-${lang}`} />
                    <Label htmlFor={`lang-${lang}`} className="font-normal">{lang}</Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
