import ReportGenerator from "@/components/dashboard/ReportGenerator";

export default function AdminReportsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 font-headline">Usage Reports</h1>
      <p className="text-muted-foreground mb-6">Generate reports on book demand and usage with AI-powered insights.</p>
      <ReportGenerator />
    </div>
  );
}
