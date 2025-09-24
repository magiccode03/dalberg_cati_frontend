'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import Button from './Button';
import { Download, FileText, FileSpreadsheet, FileImage, Loader2 } from 'lucide-react';

export interface ExportButtonProps {
  data: any;
  filename?: string;
  format?: 'csv' | 'xlsx' | 'json' | 'pdf' | 'png' | 'jpg';
  onExport?: (data: any, format: string) => Promise<void> | void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline';
  showFormatSelector?: boolean;
  formats?: Array<{
    value: string;
    label: string;
    icon: React.ReactNode;
  }>;
  children?: React.ReactNode;
}

const defaultFormats = [
  {
    value: 'csv',
    label: 'CSV',
    icon: <FileText className="h-4 w-4" />,
  },
  {
    value: 'xlsx',
    label: 'Excel',
    icon: <FileSpreadsheet className="h-4 w-4" />,
  },
  {
    value: 'json',
    label: 'JSON',
    icon: <FileText className="h-4 w-4" />,
  },
  {
    value: 'pdf',
    label: 'PDF',
    icon: <FileText className="h-4 w-4" />,
  },
  {
    value: 'png',
    label: 'PNG',
    icon: <FileImage className="h-4 w-4" />,
  },
  {
    value: 'jpg',
    label: 'JPG',
    icon: <FileImage className="h-4 w-4" />,
  },
];

export default function ExportButton({
  data,
  filename = 'export',
  format = 'csv',
  onExport,
  loading = false,
  disabled = false,
  className,
  size = 'md',
  variant = 'outline',
  showFormatSelector = false,
  formats = defaultFormats,
  children,
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState(format);

  const handleExport = async () => {
    if (disabled || loading || isExporting) return;

    setIsExporting(true);
    
    try {
      if (onExport) {
        await onExport(data, selectedFormat);
      } else {
        await defaultExport(data, selectedFormat, filename);
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const defaultExport = async (data: any, format: string, filename: string) => {
    switch (format) {
      case 'csv':
        exportToCSV(data, filename);
        break;
      case 'xlsx':
        exportToExcel(data, filename);
        break;
      case 'json':
        exportToJSON(data, filename);
        break;
      case 'pdf':
        exportToPDF(data, filename);
        break;
      case 'png':
      case 'jpg':
        exportToImage(format, filename);
        break;
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  };

  const exportToCSV = (data: any, filename: string) => {
    if (Array.isArray(data) && data.length > 0) {
      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
      ].join('\n');
      
      downloadFile(csvContent, `${filename}.csv`, 'text/csv');
    } else {
      throw new Error('Data must be an array of objects');
    }
  };

  const exportToExcel = (data: any, filename: string) => {
    // This would require a library like xlsx
    // For now, we'll export as CSV
    exportToCSV(data, filename);
  };

  const exportToJSON = (data: any, filename: string) => {
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, `${filename}.json`, 'application/json');
  };

  const exportToPDF = (data: any, filename: string) => {
    // This would require a library like jsPDF
    // For now, we'll create a simple HTML table and print it
    const table = createHTMLTable(data);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${filename}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              table { border-collapse: collapse; width: 100%; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            ${table}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const exportToImage = (format: string, filename: string) => {
    // This would require html2canvas or similar
    // For now, we'll show an alert
    alert(`Image export (${format}) would be implemented here`);
  };

  const createHTMLTable = (data: any) => {
    if (Array.isArray(data) && data.length > 0) {
      const headers = Object.keys(data[0]);
      return `
        <table>
          <thead>
            <tr>
              ${headers.map(header => `<th>${header}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${data.map(row => `
              <tr>
                ${headers.map(header => `<td>${row[header] || ''}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }
    return '<p>No data to export</p>';
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const selectedFormatInfo = formats.find(f => f.value === selectedFormat);

  if (showFormatSelector) {
    return (
      <div className={cn('flex items-center space-x-2', className)}>
        <select
          value={selectedFormat}
          onChange={(e) => setSelectedFormat(e.target.value)}
          disabled={disabled || loading || isExporting}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {formats.map((format) => (
            <option key={format.value} value={format.value}>
              {format.label}
            </option>
          ))}
        </select>
        <Button
          onClick={handleExport}
          disabled={disabled || loading || isExporting}
          loading={loading || isExporting}
          size={size}
          variant={variant}
        >
          {loading || isExporting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          {children || 'Export'}
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleExport}
      disabled={disabled || loading || isExporting}
      loading={loading || isExporting}
      size={size}
      variant={variant}
      className={className}
    >
      {loading || isExporting ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        selectedFormatInfo?.icon || <Download className="h-4 w-4 mr-2" />
      )}
      {children || `Export ${selectedFormatInfo?.label || format.toUpperCase()}`}
    </Button>
  );
}

// Preset export buttons
export function CSVExportButton({
  data,
  filename,
  onExport,
  loading,
  disabled,
  className,
  size,
  variant,
  children,
}: Omit<ExportButtonProps, 'format'>) {
  return (
    <ExportButton
      data={data}
      filename={filename}
      format="csv"
      onExport={onExport}
      loading={loading}
      disabled={disabled}
      className={className}
      size={size}
      variant={variant}
    >
      {children || 'Export CSV'}
    </ExportButton>
  );
}

export function ExcelExportButton({
  data,
  filename,
  onExport,
  loading,
  disabled,
  className,
  size,
  variant,
  children,
}: Omit<ExportButtonProps, 'format'>) {
  return (
    <ExportButton
      data={data}
      filename={filename}
      format="xlsx"
      onExport={onExport}
      loading={loading}
      disabled={disabled}
      className={className}
      size={size}
      variant={variant}
    >
      {children || 'Export Excel'}
    </ExportButton>
  );
}

export function JSONExportButton({
  data,
  filename,
  onExport,
  loading,
  disabled,
  className,
  size,
  variant,
  children,
}: Omit<ExportButtonProps, 'format'>) {
  return (
    <ExportButton
      data={data}
      filename={filename}
      format="json"
      onExport={onExport}
      loading={loading}
      disabled={disabled}
      className={className}
      size={size}
      variant={variant}
    >
      {children || 'Export JSON'}
    </ExportButton>
  );
}

export function PDFExportButton({
  data,
  filename,
  onExport,
  loading,
  disabled,
  className,
  size,
  variant,
  children,
}: Omit<ExportButtonProps, 'format'>) {
  return (
    <ExportButton
      data={data}
      filename={filename}
      format="pdf"
      onExport={onExport}
      loading={loading}
      disabled={disabled}
      className={className}
      size={size}
      variant={variant}
    >
      {children || 'Export PDF'}
    </ExportButton>
  );
}
