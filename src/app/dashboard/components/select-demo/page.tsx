'use client';

import React, { useState } from 'react';
import SelectDropdown from '@/components/ui/SelectDropdown';
import DateRangePicker from '@/components/ui/DateRangePicker';
import FileUpload from '@/components/ui/FileUpload';
import Breadcrumb from '@/components/ui/Breadcrumb';

export default function SelectDemoPage() {
  const [selectValue, setSelectValue] = useState<string>('');
  const [multiSelectValue, setMultiSelectValue] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({
    startDate: null,
    endDate: null,
  });
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  const breadcrumbItems = [
    { label: 'Components', href: '/dashboard/components' },
    { label: 'Select Demo', active: true }
  ];

  // Sample options for SelectDropdown
  const countryOptions = [
    { value: 'in', label: 'India', group: 'Asia' },
    { value: 'us', label: 'United States', group: 'North America' },
    { value: 'uk', label: 'United Kingdom', group: 'Europe' },
    { value: 'ca', label: 'Canada', group: 'North America' },
    { value: 'au', label: 'Australia', group: 'Oceania' },
    { value: 'de', label: 'Germany', group: 'Europe' },
    { value: 'fr', label: 'France', group: 'Europe' },
    { value: 'jp', label: 'Japan', group: 'Asia' },
    { value: 'cn', label: 'China', group: 'Asia' },
    { value: 'br', label: 'Brazil', group: 'South America' },
  ];

  const roleOptions = [
    { value: 'admin', label: 'Administrator' },
    { value: 'pmt', label: 'PMT Manager' },
    { value: 'qc', label: 'QC Manager' },
    { value: 'quality-analyst', label: 'Quality Analyst' },
    { value: 'start-qc', label: 'Start QC' },
    { value: 'data-quality', label: 'Data Quality' },
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="space-y-8">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Select Components Demo</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Interactive demonstration of SelectDropdown, DateRangePicker, and FileUpload components
          </p>
        </div>

        {/* SelectDropdown Examples */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Basic Select */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Select</h2>
            <SelectDropdown
              options={roleOptions}
              value={selectValue}
              onChange={setSelectValue}
              placeholder="Select a role..."
              label="User Role"
              required
            />
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Selected: {selectValue || 'None'}
            </div>
          </div>

          {/* Searchable Select */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Searchable Select</h2>
            <SelectDropdown
              options={countryOptions}
              value={selectValue}
              onChange={setSelectValue}
              placeholder="Search countries..."
              label="Country"
              searchable
              groupBy="group"
            />
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Selected: {selectValue || 'None'}
            </div>
          </div>

          {/* Multi Select */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Multi Select</h2>
            <SelectDropdown
              options={roleOptions}
              value={multiSelectValue}
              onChange={setMultiSelectValue}
              placeholder="Select multiple roles..."
              label="Roles"
              multiple
              searchable
              clearable
            />
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Selected: {multiSelectValue.length > 0 ? multiSelectValue.join(', ') : 'None'}
            </div>
          </div>

          {/* Disabled Select */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Disabled Select</h2>
            <SelectDropdown
              options={roleOptions}
              value="admin"
              onChange={() => {}}
              placeholder="This is disabled..."
              label="Disabled Field"
              disabled
            />
          </div>
        </div>

        {/* DateRangePicker Examples */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Date Range Picker</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-800 dark:text-gray-200">Basic Date Range</h3>
              <DateRangePicker
                value={dateRange}
                onChange={setDateRange}
                label="Select Date Range"
                required
              />
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <div>Start: {dateRange.startDate?.toLocaleDateString() || 'None'}</div>
                <div>End: {dateRange.endDate?.toLocaleDateString() || 'None'}</div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-800 dark:text-gray-200">With Restrictions</h3>
              <DateRangePicker
                value={dateRange}
                onChange={setDateRange}
                label="Date Range (Last 30 days only)"
                minDate={new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)}
                maxDate={new Date()}
              />
            </div>
          </div>
        </div>

        {/* FileUpload Examples */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">File Upload</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-800 dark:text-gray-200">Image Upload</h3>
              <FileUpload
                files={uploadedFiles}
                onChange={setUploadedFiles}
                label="Upload Images"
                accept="image/*"
                maxFiles={3}
                maxSize={5}
                allowedTypes={['image/*']}
                showPreview
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-800 dark:text-gray-200">Document Upload</h3>
              <FileUpload
                files={uploadedFiles}
                onChange={setUploadedFiles}
                label="Upload Documents"
                accept=".pdf,.doc,.docx,.txt"
                maxFiles={5}
                maxSize={10}
                allowedTypes={['application/pdf', 'text/*', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']}
              />
            </div>
          </div>
        </div>

        {/* Form Example */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Complete Form Example</h2>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectDropdown
                  options={roleOptions}
                  value={selectValue}
                  onChange={setSelectValue}
                  placeholder="Select role..."
                  label="User Role"
                  required
                />
                
                <SelectDropdown
                  options={countryOptions}
                  value={selectValue}
                  onChange={setSelectValue}
                  placeholder="Select country..."
                  label="Country"
                  searchable
                />
              </div>
              
              <DateRangePicker
                value={dateRange}
                onChange={setDateRange}
                label="Project Duration"
                required
              />
              
              <FileUpload
                files={uploadedFiles}
                onChange={setUploadedFiles}
                label="Project Documents"
                accept="*/*"
                maxFiles={10}
                maxSize={20}
              />
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
