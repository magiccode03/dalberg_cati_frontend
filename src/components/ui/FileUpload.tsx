'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, File, Image, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
  status: 'uploading' | 'success' | 'error';
  progress?: number;
  error?: string;
}

export interface FileUploadProps {
  files: UploadedFile[];
  onChange: (files: UploadedFile[]) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // in MB
  disabled?: boolean;
  error?: string;
  className?: string;
  label?: string;
  required?: boolean;
  dragAndDrop?: boolean;
  showPreview?: boolean;
  allowedTypes?: string[];
}

export default function FileUpload({
  files = [],
  onChange,
  accept = '*/*',
  multiple = false,
  maxFiles = 5,
  maxSize = 10, // 10MB default
  disabled = false,
  error,
  className,
  label,
  required = false,
  dragAndDrop = true,
  showPreview = true,
  allowedTypes = ['image/*', 'application/pdf', 'text/*'],
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get file icon based on type
  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-8 w-8 text-blue-500" />;
    } else if (file.type === 'application/pdf') {
      return <FileText className="h-8 w-8 text-red-500" />;
    } else {
      return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Validate file
  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`;
    }

    // Check file type
    if (allowedTypes.length > 0) {
      const isValidType = allowedTypes.some(type => {
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.slice(0, -1));
        }
        return file.type === type;
      });
      
      if (!isValidType) {
        return `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`;
      }
    }

    return null;
  };

  // Create uploaded file object
  const createUploadedFile = (file: File): UploadedFile => {
    const validationError = validateFile(file);
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      status: validationError ? 'error' : 'success',
      error: validationError,
    };
  };

  // Handle file selection
  const handleFileSelect = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles: UploadedFile[] = [];
    const fileArray = Array.from(selectedFiles);

    // Check max files limit
    if (files.length + fileArray.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    fileArray.forEach(file => {
      const uploadedFile = createUploadedFile(file);
      newFiles.push(uploadedFile);
    });

    onChange([...files, ...newFiles]);
  }, [files, maxFiles, maxSize, allowedTypes, onChange]);

  // Handle drag events
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev + 1);
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragOver(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev - 1);
    if (dragCounter === 1) {
      setIsDragOver(false);
    }
  }, [dragCounter]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    setDragCounter(0);

    if (disabled) return;

    const droppedFiles = e.dataTransfer.files;
    handleFileSelect(droppedFiles);
  }, [disabled, handleFileSelect]);

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Remove file
  const removeFile = (fileId: string) => {
    const fileToRemove = files.find(f => f.id === fileId);
    if (fileToRemove?.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    onChange(files.filter(f => f.id !== fileId));
  };

  // Open file dialog
  const openFileDialog = () => {
    if (fileInputRef.current && !disabled) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
      />

      {/* Upload Area */}
      <div
        className={cn(
          'relative border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200',
          'hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10',
          isDragOver && 'border-blue-500 bg-blue-50 dark:bg-blue-900/20',
          disabled && 'opacity-50 cursor-not-allowed',
          error && 'border-red-500 bg-red-50 dark:bg-red-900/20',
          'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800'
        )}
        onDragEnter={dragAndDrop ? handleDragEnter : undefined}
        onDragLeave={dragAndDrop ? handleDragLeave : undefined}
        onDragOver={dragAndDrop ? handleDragOver : undefined}
        onDrop={dragAndDrop ? handleDrop : undefined}
        onClick={openFileDialog}
      >
        <div className="flex flex-col items-center space-y-2">
          <Upload className={cn(
            'h-12 w-12 text-gray-400',
            isDragOver && 'text-blue-500'
          )} />
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {dragAndDrop ? (
              <>
                <span className="font-medium text-blue-600 dark:text-blue-400">
                  Click to upload
                </span>
                {' '}or drag and drop
              </>
            ) : (
              <span className="font-medium text-blue-600 dark:text-blue-400">
                Click to upload
              </span>
            )}
          </div>
          
          <div className="text-xs text-gray-500 dark:text-gray-500">
            {allowedTypes.length > 0 && (
              <div>
                Supported: {allowedTypes.join(', ')}
              </div>
            )}
            <div>
              Max size: {maxSize}MB • Max files: {maxFiles}
            </div>
          </div>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((uploadedFile) => (
            <div
              key={uploadedFile.id}
              className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              {/* File Icon/Preview */}
              <div className="flex-shrink-0">
                {showPreview && uploadedFile.preview ? (
                  <img
                    src={uploadedFile.preview}
                    alt={uploadedFile.file.name}
                    className="h-10 w-10 object-cover rounded"
                  />
                ) : (
                  getFileIcon(uploadedFile.file)
                )}
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {uploadedFile.file.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatFileSize(uploadedFile.file.size)}
                </p>
                {uploadedFile.error && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    {uploadedFile.error}
                  </p>
                )}
              </div>

              {/* Status Icon */}
              <div className="flex-shrink-0">
                {uploadedFile.status === 'success' && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                {uploadedFile.status === 'error' && (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                {uploadedFile.status === 'uploading' && (
                  <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                )}
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeFile(uploadedFile.id)}
                className="flex-shrink-0 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                disabled={disabled}
              >
                <X className="h-4 w-4 text-gray-400 hover:text-red-500" />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
