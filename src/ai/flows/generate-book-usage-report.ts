// src/ai/flows/generate-book-usage-report.ts
'use server';
/**
 * @fileOverview Generates a report on book demand and usage, summarizing key insights using AI.
 *
 * - generateBookUsageReport - A function that generates the book usage report.
 * - GenerateBookUsageReportInput - The input type for the generateBookUsageReport function.
 * - GenerateBookUsageReportOutput - The return type for the generateBookUsageReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBookUsageReportInputSchema = z.object({
  usageData: z.string().describe('The raw data of book usage, including book titles, reservation counts, and checkout history.'),
});

export type GenerateBookUsageReportInput = z.infer<typeof GenerateBookUsageReportInputSchema>;

const GenerateBookUsageReportOutputSchema = z.object({
  summary: z.string().describe('A summarized report of book demand and usage trends, including key insights.'),
});

export type GenerateBookUsageReportOutput = z.infer<typeof GenerateBookUsageReportOutputSchema>;

export async function generateBookUsageReport(input: GenerateBookUsageReportInput): Promise<GenerateBookUsageReportOutput> {
  return generateBookUsageReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBookUsageReportPrompt',
  input: {schema: GenerateBookUsageReportInputSchema},
  output: {schema: GenerateBookUsageReportOutputSchema},
  prompt: `You are an expert librarian who specializes in analyzing book usage data to identify trends and insights.

  Based on the following book usage data, generate a concise report summarizing key trends in book demand and usage. Be sure to include specific book titles and categories that are trending, and any insights that might be useful for making decisions about resource allocation.
  \n
  Usage Data: {{{usageData}}}`,
});

const generateBookUsageReportFlow = ai.defineFlow(
  {
    name: 'generateBookUsageReportFlow',
    inputSchema: GenerateBookUsageReportInputSchema,
    outputSchema: GenerateBookUsageReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
