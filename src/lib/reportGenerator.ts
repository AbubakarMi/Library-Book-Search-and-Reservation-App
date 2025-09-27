import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface ReportData {
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  dataTypes: string[];
  filters: {
    userType?: string;
    status?: string;
    department?: string;
  };
  timestamp: string;
}

interface TableData {
  headers: string[];
  rows: (string | number)[][];
  title: string;
}

const mockData = {
  users: {
    headers: ['ID', 'Name', 'Email', 'Type', 'Department', 'Status', 'Join Date'],
    rows: [
      ['001', 'John Doe', 'john.doe@university.edu', 'Student', 'Computer Science', 'Active', '2024-01-15'],
      ['002', 'Jane Smith', 'jane.smith@university.edu', 'Faculty', 'Engineering', 'Active', '2023-08-20'],
      ['003', 'Bob Johnson', 'bob.johnson@university.edu', 'Staff', 'Library', 'Active', '2023-03-10'],
      ['004', 'Alice Brown', 'alice.brown@university.edu', 'Student', 'Business', 'Active', '2024-02-01'],
      ['005', 'Dr. Wilson', 'wilson@university.edu', 'Faculty', 'Sciences', 'Active', '2022-09-15']
    ],
    title: 'User Accounts Report'
  },
  books: {
    headers: ['ISBN', 'Title', 'Author', 'Category', 'Status', 'Location', 'Added Date'],
    rows: [
      ['978-0134685991', 'Effective Java', 'Joshua Bloch', 'Programming', 'Available', 'A1-001', '2023-01-10'],
      ['978-0321125215', 'Discrete Mathematics', 'Kenneth Rosen', 'Mathematics', 'Borrowed', 'B2-045', '2023-02-15'],
      ['978-0262033848', 'Introduction to Algorithms', 'Cormen, Leiserson', 'Computer Science', 'Available', 'A1-102', '2023-01-20'],
      ['978-0134494165', 'Clean Code', 'Robert Martin', 'Programming', 'Reserved', 'A1-003', '2023-03-05'],
      ['978-0596009205', 'Head First Design Patterns', 'Freeman, Robson', 'Programming', 'Available', 'A1-025', '2023-01-25']
    ],
    title: 'Book Catalog Report'
  },
  reservations: {
    headers: ['Reservation ID', 'User', 'Book Title', 'Date Reserved', 'Status', 'Pickup Deadline'],
    rows: [
      ['RSV001', 'John Doe', 'Effective Java', '2024-09-20', 'Active', '2024-09-27'],
      ['RSV002', 'Jane Smith', 'Clean Code', '2024-09-22', 'Expired', '2024-09-25'],
      ['RSV003', 'Alice Brown', 'Design Patterns', '2024-09-25', 'Active', '2024-09-30'],
      ['RSV004', 'Bob Johnson', 'Algorithms', '2024-09-26', 'Collected', '2024-09-29'],
      ['RSV005', 'Dr. Wilson', 'Discrete Math', '2024-09-24', 'Active', '2024-09-28']
    ],
    title: 'Reservations Report'
  },
  borrowings: {
    headers: ['Loan ID', 'User', 'Book Title', 'Borrowed Date', 'Due Date', 'Status'],
    rows: [
      ['LN001', 'John Doe', 'Effective Java', '2024-09-15', '2024-09-29', 'Active'],
      ['LN002', 'Jane Smith', 'Discrete Mathematics', '2024-09-10', '2024-09-24', 'Overdue'],
      ['LN003', 'Alice Brown', 'Clean Code', '2024-09-18', '2024-10-02', 'Active'],
      ['LN004', 'Bob Johnson', 'Design Patterns', '2024-09-12', '2024-09-26', 'Returned'],
      ['LN005', 'Dr. Wilson', 'Algorithms', '2024-09-20', '2024-10-18', 'Active']
    ],
    title: 'Borrowings Report'
  },
  returns: {
    headers: ['Return ID', 'User', 'Book Title', 'Borrowed Date', 'Returned Date', 'Condition'],
    rows: [
      ['RT001', 'Bob Johnson', 'Design Patterns', '2024-09-12', '2024-09-25', 'Good'],
      ['RT002', 'Mary Davis', 'Java Programming', '2024-09-01', '2024-09-14', 'Excellent'],
      ['RT003', 'Tom Wilson', 'Database Systems', '2024-08-28', '2024-09-10', 'Fair'],
      ['RT004', 'Sarah Lee', 'Web Development', '2024-09-05', '2024-09-18', 'Good'],
      ['RT005', 'Mike Brown', 'Data Structures', '2024-09-08', '2024-09-20', 'Excellent']
    ],
    title: 'Returns Report'
  },
  fines: {
    headers: ['Fine ID', 'User', 'Book Title', 'Days Overdue', 'Fine Amount', 'Status', 'Date Paid'],
    rows: [
      ['FN001', 'Jane Smith', 'Discrete Mathematics', '3', '₦150', 'Unpaid', '-'],
      ['FN002', 'Tom Wilson', 'Database Systems', '5', '₦250', 'Paid', '2024-09-15'],
      ['FN003', 'Lisa Garcia', 'Web Programming', '2', '₦100', 'Paid', '2024-09-18'],
      ['FN004', 'David Chen', 'Algorithms', '7', '₦350', 'Unpaid', '-'],
      ['FN005', 'Emma Johnson', 'Software Engineering', '1', '₦50', 'Paid', '2024-09-22']
    ],
    title: 'Fines & Penalties Report'
  },
  analytics: {
    headers: ['Metric', 'Value', 'Previous Period', 'Change', 'Trend'],
    rows: [
      ['Total Users', '1,234', '1,180', '+4.6%', 'Up'],
      ['Active Borrowings', '456', '432', '+5.6%', 'Up'],
      ['Books in Catalog', '5,678', '5,620', '+1.0%', 'Up'],
      ['Monthly Reservations', '234', '198', '+18.2%', 'Up'],
      ['Overdue Items', '23', '31', '-25.8%', 'Down'],
      ['Collection Rate', '94.2%', '91.8%', '+2.4%', 'Up']
    ],
    title: 'Analytics Summary'
  }
};

export async function generatePDFReport(reportData: ReportData): Promise<void> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  let yPosition = 20;

  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('LibroReserva - Library Report', pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 10;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });

  if (reportData.dateRange.from && reportData.dateRange.to) {
    yPosition += 8;
    doc.text(
      `Report Period: ${reportData.dateRange.from.toLocaleDateString()} - ${reportData.dateRange.to.toLocaleDateString()}`,
      pageWidth / 2,
      yPosition,
      { align: 'center' }
    );
  }

  yPosition += 15;

  // Add Nubenta Technology Limited branding
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Powered by Nubenta Technology Limited', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // Reset text color
  doc.setTextColor(0, 0, 0);

  // Generate tables for selected data types
  for (const dataType of reportData.dataTypes) {
    if (!mockData[dataType as keyof typeof mockData]) continue;

    const tableData = mockData[dataType as keyof typeof mockData];

    // Check if we need a new page
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = 20;
    }

    // Section title
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(tableData.title, 20, yPosition);
    yPosition += 10;

    // Generate table
    autoTable(doc, {
      head: [tableData.headers],
      body: tableData.rows,
      startY: yPosition,
      margin: { left: 20, right: 20 },
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [37, 99, 235],
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 20;
  }

  // Footer on last page
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Page ${i} of ${totalPages} | LibroReserva Library Management System`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  // Download the PDF
  const fileName = `LibroReserva_Report_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}

export async function generateExcelReport(reportData: ReportData): Promise<void> {
  const workbook = XLSX.utils.book_new();

  // Add metadata sheet
  const metadataSheet = XLSX.utils.aoa_to_sheet([
    ['LibroReserva - Library Report'],
    ['Generated on:', new Date().toLocaleDateString()],
    ['Report Period:', reportData.dateRange.from ?
      `${reportData.dateRange.from.toLocaleDateString()} - ${reportData.dateRange.to?.toLocaleDateString() || 'Present'}` :
      'All Time'
    ],
    ['Filters Applied:'],
    ['User Type:', reportData.filters.userType || 'All'],
    ['Status:', reportData.filters.status || 'All'],
    ['Department:', reportData.filters.department || 'All'],
    [],
    ['Powered by Nubenta Technology Limited'],
    ['Visit: https://nubenta-group.vercel.app/technology']
  ]);

  XLSX.utils.book_append_sheet(workbook, metadataSheet, 'Report Info');

  // Add data sheets for selected data types
  for (const dataType of reportData.dataTypes) {
    if (!mockData[dataType as keyof typeof mockData]) continue;

    const tableData = mockData[dataType as keyof typeof mockData];

    // Create worksheet data with headers
    const worksheetData = [
      tableData.headers,
      ...tableData.rows
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Auto-size columns
    const columnWidths = tableData.headers.map((header, index) => {
      const maxLength = Math.max(
        header.length,
        ...tableData.rows.map(row => String(row[index] || '').length)
      );
      return { width: Math.min(maxLength + 2, 30) };
    });

    worksheet['!cols'] = columnWidths;

    // Add the worksheet to workbook
    const sheetName = tableData.title.replace(' Report', '').substring(0, 31);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  }

  // Summary sheet if analytics is included
  if (reportData.dataTypes.includes('analytics')) {
    const summaryData = [
      ['LibroReserva Summary Dashboard'],
      [],
      ['Key Metrics', 'Current Value', 'Previous Period', 'Change'],
      ...mockData.analytics.rows.slice(0, -1) // Exclude headers since we're adding our own
    ];

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    summarySheet['!cols'] = [
      { width: 20 },
      { width: 15 },
      { width: 15 },
      { width: 12 }
    ];

    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
  }

  // Download the Excel file
  const fileName = `LibroReserva_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
}

// Utility function to filter data based on report criteria
export function filterReportData(data: any[], filters: ReportData['filters']): any[] {
  return data.filter(item => {
    if (filters.userType && filters.userType !== 'all') {
      if (filters.userType === 'students' && !item.type?.toLowerCase().includes('student')) return false;
      if (filters.userType === 'faculty' && !item.type?.toLowerCase().includes('faculty')) return false;
      if (filters.userType === 'staff' && !item.type?.toLowerCase().includes('staff')) return false;
    }

    if (filters.status && filters.status !== 'all') {
      if (item.status?.toLowerCase() !== filters.status.toLowerCase()) return false;
    }

    if (filters.department && item.department !== filters.department) return false;

    return true;
  });
}