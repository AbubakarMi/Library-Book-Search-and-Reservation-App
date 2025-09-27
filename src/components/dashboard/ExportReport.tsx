"use client";

import { useState } from 'react';
import { Download, FileSpreadsheet, FileText, Calendar, Users, BookOpen, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { useToast } from '@/hooks/use-toast';
import { generatePDFReport, generateExcelReport } from '@/lib/reportGenerator';

interface ExportOptions {
  format: 'pdf' | 'excel';
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  dataTypes: {
    users: boolean;
    books: boolean;
    reservations: boolean;
    borrowings: boolean;
    returns: boolean;
    fines: boolean;
    analytics: boolean;
  };
  filters: {
    userType?: 'all' | 'students' | 'faculty' | 'staff';
    status?: 'all' | 'active' | 'overdue' | 'returned';
    department?: string;
  };
}

export function ExportReport() {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [options, setOptions] = useState<ExportOptions>({
    format: 'pdf',
    dateRange: {
      from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      to: new Date()
    },
    dataTypes: {
      users: true,
      books: true,
      reservations: true,
      borrowings: true,
      returns: false,
      fines: false,
      analytics: true,
    },
    filters: {
      userType: 'all',
      status: 'all',
    }
  });

  const dataTypeOptions = [
    {
      key: 'users' as keyof typeof options.dataTypes,
      label: 'User Accounts',
      description: 'Student, faculty, and staff information',
      icon: Users,
      count: '1,234 records'
    },
    {
      key: 'books' as keyof typeof options.dataTypes,
      label: 'Book Catalog',
      description: 'Complete library inventory',
      icon: BookOpen,
      count: '5,678 records'
    },
    {
      key: 'reservations' as keyof typeof options.dataTypes,
      label: 'Reservations',
      description: 'Current and past reservations',
      icon: Calendar,
      count: '2,345 records'
    },
    {
      key: 'borrowings' as keyof typeof options.dataTypes,
      label: 'Borrowings',
      description: 'Active and completed loans',
      icon: CheckCircle,
      count: '3,456 records'
    },
    {
      key: 'returns' as keyof typeof options.dataTypes,
      label: 'Returns',
      description: 'Return transactions and history',
      icon: Clock,
      count: '2,890 records'
    },
    {
      key: 'fines' as keyof typeof options.dataTypes,
      label: 'Fines & Penalties',
      description: 'Late fees and payment records',
      icon: XCircle,
      count: '234 records'
    },
    {
      key: 'analytics' as keyof typeof options.dataTypes,
      label: 'Analytics Summary',
      description: 'Usage statistics and trends',
      icon: FileText,
      count: 'Summary data'
    }
  ];

  const handleDataTypeChange = (key: keyof typeof options.dataTypes, checked: boolean) => {
    setOptions(prev => ({
      ...prev,
      dataTypes: {
        ...prev.dataTypes,
        [key]: checked
      }
    }));
  };

  const handleExport = async () => {
    const selectedDataTypes = Object.entries(options.dataTypes)
      .filter(([_, selected]) => selected)
      .map(([key]) => key);

    if (selectedDataTypes.length === 0) {
      toast({
        title: "No data selected",
        description: "Please select at least one data type to export.",
        variant: "destructive"
      });
      return;
    }

    setIsExporting(true);

    try {
      const reportData = {
        dateRange: options.dateRange,
        dataTypes: selectedDataTypes,
        filters: options.filters,
        timestamp: new Date().toISOString()
      };

      if (options.format === 'pdf') {
        await generatePDFReport(reportData);
      } else {
        await generateExcelReport(reportData);
      }

      toast({
        title: "Export successful",
        description: `Report exported as ${options.format.toUpperCase()} file.`,
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export failed",
        description: "An error occurred while generating the report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const selectedCount = Object.values(options.dataTypes).filter(Boolean).length;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Download className="h-5 w-5" />
          <span>Export Library Report</span>
        </CardTitle>
        <CardDescription>
          Generate comprehensive reports with customizable data selection and export formats
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Export Format Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Export Format</Label>
          <div className="grid grid-cols-2 gap-4">
            <div
              className={`relative flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-colors ${
                options.format === 'pdf'
                  ? 'border-primary bg-primary/5'
                  : 'border-muted hover:border-muted-foreground/50'
              }`}
              onClick={() => setOptions(prev => ({ ...prev, format: 'pdf' }))}
            >
              <FileText className="h-8 w-8 text-red-600" />
              <div>
                <h3 className="font-semibold">PDF Report</h3>
                <p className="text-sm text-muted-foreground">Professional formatted document</p>
              </div>
              {options.format === 'pdf' && (
                <CheckCircle className="absolute top-2 right-2 h-4 w-4 text-primary" />
              )}
            </div>
            <div
              className={`relative flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-colors ${
                options.format === 'excel'
                  ? 'border-primary bg-primary/5'
                  : 'border-muted hover:border-muted-foreground/50'
              }`}
              onClick={() => setOptions(prev => ({ ...prev, format: 'excel' }))}
            >
              <FileSpreadsheet className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="font-semibold">Excel Spreadsheet</h3>
                <p className="text-sm text-muted-foreground">Data analysis and manipulation</p>
              </div>
              {options.format === 'excel' && (
                <CheckCircle className="absolute top-2 right-2 h-4 w-4 text-primary" />
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Date Range Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Date Range</Label>
          <DateRangePicker
            value={options.dateRange}
            onChange={(range) => setOptions(prev => ({ ...prev, dateRange: range }))}
            placeholder="Select date range for report data"
          />
        </div>

        <Separator />

        {/* Data Type Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Data to Include</Label>
            <Badge variant="secondary">
              {selectedCount} of {dataTypeOptions.length} selected
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dataTypeOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <div key={option.key} className="flex items-start space-x-3">
                  <Checkbox
                    id={option.key}
                    checked={options.dataTypes[option.key]}
                    onCheckedChange={(checked) =>
                      handleDataTypeChange(option.key, checked as boolean)
                    }
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor={option.key}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <IconComponent className="h-4 w-4" />
                      <span className="font-medium">{option.label}</span>
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {option.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {option.count}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Filters */}
        <div className="space-y-4">
          <Label className="text-sm font-medium">Filters</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="userType" className="text-sm">User Type</Label>
              <Select
                value={options.filters.userType}
                onValueChange={(value) =>
                  setOptions(prev => ({
                    ...prev,
                    filters: { ...prev.filters, userType: value as any }
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All users" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="students">Students Only</SelectItem>
                  <SelectItem value="faculty">Faculty Only</SelectItem>
                  <SelectItem value="staff">Staff Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm">Status</Label>
              <Select
                value={options.filters.status}
                onValueChange={(value) =>
                  setOptions(prev => ({
                    ...prev,
                    filters: { ...prev.filters, status: value as any }
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="overdue">Overdue Only</SelectItem>
                  <SelectItem value="returned">Returned Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="department" className="text-sm">Department</Label>
              <Select
                value={options.filters.department || 'all'}
                onValueChange={(value) =>
                  setOptions(prev => ({
                    ...prev,
                    filters: {
                      ...prev.filters,
                      department: value === 'all' ? undefined : value
                    }
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="computer-science">Computer Science</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="arts">Arts</SelectItem>
                  <SelectItem value="sciences">Sciences</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        {/* Export Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleExport}
            disabled={isExporting || selectedCount === 0}
            className="min-w-[150px]"
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Generating...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export {options.format.toUpperCase()}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}