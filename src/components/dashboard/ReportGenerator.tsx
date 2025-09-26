"use client";

import { useState } from "react";
import { GenerateBookUsageReportOutput } from "@/ai/flows/generate-book-usage-report";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, FileText } from "lucide-react";
import { handleGenerateReport } from "@/lib/actions/report-actions";

export default function ReportGenerator() {
  const [report, setReport] = useState<GenerateBookUsageReportOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setReport(null);
    try {
      const result = await handleGenerateReport();
      setReport(result);
    } catch (e) {
      setError("Failed to generate report. Please try again.");
      console.error(e);
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate New Report</CardTitle>
          <CardDescription>
            Click the button to generate an AI-powered summary of book usage and demand based on the latest reservation data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onGenerate} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Generate Book Usage Report
              </>
            )}
          </Button>
        </CardContent>
      </Card>
      
      {error && (
        <Card className="border-destructive">
            <CardHeader>
                <CardTitle className="text-destructive">Error</CardTitle>
            </CardHeader>
            <CardContent>
                <p>{error}</p>
            </CardContent>
        </Card>
      )}

      {isLoading && (
         <Card>
            <CardHeader>
                <CardTitle>Generating Report</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center space-x-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p>The AI is analyzing the data. This might take a moment...</p>
            </CardContent>
        </Card>
      )}

      {report && (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-headline">AI-Generated Insights</CardTitle>
            <CardDescription>Summary of book demand and usage trends.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-blue dark:prose-invert max-w-none">
              <p>{report.summary}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
