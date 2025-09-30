'use client';

import React, { useState } from 'react';
import { FluidContainer } from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Calendar, FileText, Edit, Eye } from 'lucide-react';

// Interfaces
interface UploadedReportData {
  id: number;
  title: string;
  reportDate: string;
  uploadDateTime: string;
  fileName: string;
  status: string;
}

const UploadReportPage = () => {
  // State for upload form
  const [uploadForm, setUploadForm] = useState({
    reportDate: '',
    dataFile: null as File | null,
    title: '',
  });

  // Empty data for uploaded reports (no reports currently)
  const [uploadedReportsData] = useState<UploadedReportData[]>([]);

  // Handlers
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadForm(prev => ({
      ...prev,
      reportDate: e.target.value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setUploadForm(prev => ({
      ...prev,
      dataFile: file,
    }));
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadForm(prev => ({
      ...prev,
      title: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Upload report form submitted:', uploadForm);
    // Reset form after submission
    setUploadForm({
      reportDate: '',
      dataFile: null,
      title: '',
    });
  };

  const handleViewFile = (reportId: number) => {
    console.log('View report file for ID:', reportId);
  };

  const handleUpdateFile = (reportId: number) => {
    console.log('Update report file for ID:', reportId);
  };

  return (
    <FluidContainer>
      {/* Page Header */}
      <div className="mb-6">
        <Heading level={1} className="text-2xl font-bold text-gray-900">
          Upload Report
        </Heading>
      </div>

      {/* Upload Form */}
      <Card className="mb-6">
        <div className="mb-4">
          <Heading level={4} className="text-xl font-semibold text-gray-900">
            Upload Report File
          </Heading>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Report Date */}
            <div>
              <label htmlFor="reportDate" className="block text-sm font-medium text-gray-700 mb-2">
                Report Date
              </label>
              <div className="relative">
                <Input
                  type="date"
                  id="reportDate"
                  value={uploadForm.reportDate}
                  onChange={handleDateChange}
                  placeholder="Select Date"
                  className="pl-10"
                />
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Report File */}
            <div>
              <label htmlFor="dataFile" className="block text-sm font-medium text-gray-700 mb-2">
                Report File <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                id="dataFile"
                accept=".pdf,.doc,.docx,.xlsx,.xls"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                required
              />
            </div>

            {/* File Title */}
            <div className="md:col-span-2 lg:col-span-1">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                File Title <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                id="title"
                value={uploadForm.title}
                onChange={handleTitleChange}
                placeholder="Title of Report File"
                className="w-full"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button type="submit" variant="primary">
              Submit
            </Button>
          </div>
        </form>
      </Card>

      {/* Uploaded Report Files History */}
      <Card>
        <div className="mb-4">
          <Heading level={4} className="text-xl font-semibold text-gray-900">
            Uploaded Report Files
          </Heading>
        </div>

        <div className="overflow-x-auto">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">#</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Title</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Report Date</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Upload Date & Time</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">File</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Update</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody>
              {uploadedReportsData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No results found.
                  </td>
                </tr>
              ) : (
                uploadedReportsData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 border-b border-gray-200">{index + 1}</td>
                    <td className="px-4 py-3 border-b border-gray-200">{item.title}</td>
                    <td className="px-4 py-3 border-b border-gray-200">{item.reportDate}</td>
                    <td className="px-4 py-3 border-b border-gray-200">{item.uploadDateTime}</td>
                    <td className="px-4 py-3 border-b border-gray-200">
                      <button
                        onClick={() => handleViewFile(item.id)}
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View File
                      </button>
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200">
                      <button
                        onClick={() => handleUpdateFile(item.id)}
                        className="text-green-600 hover:text-green-800 flex items-center"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Update
                      </button>
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200">{item.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </Card>
    </FluidContainer>
  );
};

export default UploadReportPage;
