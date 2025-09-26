"use server";

import { generateBookUsageReport, GenerateBookUsageReportOutput } from "@/ai/flows/generate-book-usage-report";
import { reservations, books } from "@/lib/mock-data";

export async function handleGenerateReport(): Promise<GenerateBookUsageReportOutput> {
    // Create a string from mock data to simulate real usage data
    const usageDataString = reservations.map(r => {
        const book = books.find(b => b.id === r.bookID);
        return `Reservation for "${book?.title || 'Unknown Book'}" on ${r.reservationDate}, status: ${r.status}.`;
    }).join('\n');

    return await generateBookUsageReport({ usageData: usageDataString });
}