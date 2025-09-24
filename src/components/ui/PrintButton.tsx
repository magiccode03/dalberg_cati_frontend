'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import Button from './Button';
import { Printer, FileText, Monitor, Smartphone } from 'lucide-react';

export interface PrintButtonProps {
  target?: string | HTMLElement;
  title?: string;
  onPrint?: () => void;
  onBeforePrint?: () => void;
  onAfterPrint?: () => void;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  children?: React.ReactNode;
  showPrintOptions?: boolean;
  printOptions?: {
    showHeader?: boolean;
    showFooter?: boolean;
    showPageNumbers?: boolean;
    orientation?: 'portrait' | 'landscape';
    paperSize?: 'A4' | 'A3' | 'Letter' | 'Legal';
    margins?: 'default' | 'minimal' | 'custom';
    customMargins?: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
  };
  customStyles?: string;
  includeStyles?: boolean;
}

export default function PrintButton({
  target,
  title = 'Print',
  onPrint,
  onBeforePrint,
  onAfterPrint,
  disabled = false,
  className,
  size = 'md',
  variant = 'outline',
  children,
  showPrintOptions = false,
  printOptions = {},
  customStyles,
  includeStyles = true,
}: PrintButtonProps) {
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = async () => {
    if (disabled || isPrinting) return;

    setIsPrinting(true);
    onBeforePrint?.();

    try {
      if (showPrintOptions) {
        await printWithOptions();
      } else {
        await printDefault();
      }
      
      onPrint?.();
    } catch (error) {
      console.error('Print failed:', error);
    } finally {
      setIsPrinting(false);
      onAfterPrint?.();
    }
  };

  const printDefault = async () => {
    const targetElement = getTargetElement();
    
    if (targetElement) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        const content = targetElement.innerHTML;
        const styles = includeStyles ? getPageStyles() : '';
        
        printWindow.document.write(`
          <html>
            <head>
              <title>${title}</title>
              <style>
                ${styles}
                ${customStyles || ''}
                @media print {
                  body { margin: 0; }
                  .no-print { display: none !important; }
                }
              </style>
            </head>
            <body>
              ${content}
            </body>
          </html>
        `);
        
        printWindow.document.close();
        printWindow.focus();
        
        // Wait for content to load before printing
        await new Promise(resolve => setTimeout(resolve, 500));
        printWindow.print();
        printWindow.close();
      }
    } else {
      // Print current page
      window.print();
    }
  };

  const printWithOptions = async () => {
    const targetElement = getTargetElement();
    
    if (targetElement) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        const content = targetElement.innerHTML;
        const styles = includeStyles ? getPageStyles() : '';
        const printStyles = generatePrintStyles();
        
        printWindow.document.write(`
          <html>
            <head>
              <title>${title}</title>
              <style>
                ${styles}
                ${customStyles || ''}
                ${printStyles}
              </style>
            </head>
            <body>
              ${printOptions.showHeader ? generateHeader() : ''}
              ${content}
              ${printOptions.showFooter ? generateFooter() : ''}
            </body>
          </html>
        `);
        
        printWindow.document.close();
        printWindow.focus();
        
        // Wait for content to load before printing
        await new Promise(resolve => setTimeout(resolve, 500));
        printWindow.print();
        printWindow.close();
      }
    }
  };

  const getTargetElement = (): HTMLElement | null => {
    if (typeof target === 'string') {
      return document.querySelector(target);
    } else if (target instanceof HTMLElement) {
      return target;
    } else {
      return document.body;
    }
  };

  const getPageStyles = (): string => {
    const styles = Array.from(document.styleSheets)
      .map(styleSheet => {
        try {
          return Array.from(styleSheet.cssRules)
            .map(rule => rule.cssText)
            .join('\n');
        } catch (e) {
          return '';
        }
      })
      .join('\n');
    
    return styles;
  };

  const generatePrintStyles = (): string => {
    const { orientation, paperSize, margins, customMargins } = printOptions;
    
    let styles = `
      @media print {
        @page {
          size: ${paperSize || 'A4'} ${orientation || 'portrait'};
          margin: ${getMarginString()};
        }
        
        body {
          font-family: Arial, sans-serif;
          line-height: 1.4;
          color: #000;
          background: #fff;
        }
        
        .no-print { display: none !important; }
        
        h1, h2, h3, h4, h5, h6 {
          page-break-after: avoid;
        }
        
        table {
          page-break-inside: avoid;
        }
        
        .page-break {
          page-break-before: always;
        }
      }
    `;
    
    return styles;
  };

  const getMarginString = (): string => {
    const { margins, customMargins } = printOptions;
    
    if (margins === 'minimal') {
      return '0.5in';
    } else if (margins === 'custom' && customMargins) {
      return `${customMargins.top}in ${customMargins.right}in ${customMargins.bottom}in ${customMargins.left}in`;
    } else {
      return '1in';
    }
  };

  const generateHeader = (): string => {
    return `
      <div class="print-header" style="text-align: center; margin-bottom: 20px; border-bottom: 1px solid #ccc; padding-bottom: 10px;">
        <h1>${title}</h1>
        <p>Generated on ${new Date().toLocaleDateString()}</p>
      </div>
    `;
  };

  const generateFooter = (): string => {
    return `
      <div class="print-footer" style="text-align: center; margin-top: 20px; border-top: 1px solid #ccc; padding-top: 10px;">
        <p>Page <span class="page-number"></span></p>
      </div>
    `;
  };

  return (
    <Button
      onClick={handlePrint}
      disabled={disabled || isPrinting}
      loading={isPrinting}
      size={size}
      variant={variant}
      className={className}
    >
      <Printer className="h-4 w-4 mr-2" />
      {children || 'Print'}
    </Button>
  );
}

// Print Button with Options
export interface PrintButtonWithOptionsProps extends PrintButtonProps {
  onOptionsChange?: (options: PrintButtonProps['printOptions']) => void;
}

export function PrintButtonWithOptions({
  onOptionsChange,
  printOptions = {},
  ...props
}: PrintButtonWithOptionsProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [options, setOptions] = useState(printOptions);

  const handleOptionsChange = (newOptions: typeof options) => {
    setOptions(newOptions);
    onOptionsChange?.(newOptions);
  };

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <PrintButton
          {...props}
          printOptions={options}
          showPrintOptions
        />
        <Button
          onClick={() => setShowOptions(!showOptions)}
          variant="outline"
          size="sm"
        >
          Options
        </Button>
      </div>
      
      {showOptions && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 z-50">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Orientation
              </label>
              <select
                value={options.orientation || 'portrait'}
                onChange={(e) => handleOptionsChange({
                  ...options,
                  orientation: e.target.value as 'portrait' | 'landscape'
                })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Paper Size
              </label>
              <select
                value={options.paperSize || 'A4'}
                onChange={(e) => handleOptionsChange({
                  ...options,
                  paperSize: e.target.value as 'A4' | 'A3' | 'Letter' | 'Legal'
                })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                <option value="A4">A4</option>
                <option value="A3">A3</option>
                <option value="Letter">Letter</option>
                <option value="Legal">Legal</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showHeader"
                checked={options.showHeader || false}
                onChange={(e) => handleOptionsChange({
                  ...options,
                  showHeader: e.target.checked
                })}
                className="rounded"
              />
              <label htmlFor="showHeader" className="text-sm text-gray-700 dark:text-gray-300">
                Show Header
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showFooter"
                checked={options.showFooter || false}
                onChange={(e) => handleOptionsChange({
                  ...options,
                  showFooter: e.target.checked
                })}
                className="rounded"
              />
              <label htmlFor="showFooter" className="text-sm text-gray-700 dark:text-gray-300">
                Show Footer
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Preset print buttons
export function QuickPrintButton({
  target,
  title,
  onPrint,
  disabled,
  className,
  size = 'sm',
  variant = 'ghost',
  ...props
}: Omit<PrintButtonProps, 'children'>) {
  return (
    <PrintButton
      target={target}
      title={title}
      onPrint={onPrint}
      disabled={disabled}
      className={className}
      size={size}
      variant={variant}
      {...props}
    />
  );
}

export function PrintPageButton({
  title = 'Print Page',
  onPrint,
  disabled,
  className,
  size = 'md',
  variant = 'outline',
  ...props
}: Omit<PrintButtonProps, 'target' | 'children'>) {
  return (
    <PrintButton
      title={title}
      onPrint={onPrint}
      disabled={disabled}
      className={className}
      size={size}
      variant={variant}
      {...props}
    >
      Print Page
    </PrintButton>
  );
}
