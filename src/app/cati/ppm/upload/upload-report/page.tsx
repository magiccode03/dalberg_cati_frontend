'use client';

import React, { useState } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';
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
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(25);

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

  // Pagination calculations
  const totalItems = uploadedReportsData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentData = uploadedReportsData.slice(startIndex, endIndex);

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Page Header */}
      <div className="mb-6">
        <Heading level={2} className="text-2xl font-semibold text-gray-900">
          Upload Report
        </Heading>
      </div>

      {/* Upload Form */}
      <Card className="mb-6">
        <div className="mb-4">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
            <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
              Upload Report File
            </Heading>
          </div>
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
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
            <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
              Uploaded Report Files
            </Heading>
          </div>
        </div>

        <div className="bg-white">
          <div className="mb-4">
            <Text className="text-sm text-gray-600">
              Total <strong>{totalItems.toLocaleString()}</strong> items.
            </Text>
          </div>

          <div className="table-responsive">
            <Table className="table table-centered table-bordered table-striped dt-responsive nowrap w-100 border border-gray-300">
              <thead className="table-light bg-gray-50">
                <tr>
                  <th className="text-center">S.No</th>
                  <th className="text-center">Title</th>
                  <th className="text-center">Report Date</th>
                  <th className="text-center">Upload Date & Time</th>
                  <th className="text-center">File</th>
                  <th className="text-center">Update</th>
                  <th className="text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {currentData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                      No results found.
                    </td>
                  </tr>
                ) : (
                  currentData.map((item, index) => (
                    <tr key={item.id}>
                      <td className="text-center">{startIndex + index + 1}</td>
                      <td className="text-left">{item.title}</td>
                      <td className="text-center">{item.reportDate}</td>
                      <td className="text-center">{item.uploadDateTime}</td>
                      <td className="text-center">
                        <button
                          onClick={() => handleViewFile(item.id)}
                          className="text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View File
                        </button>
                      </td>
                      <td className="text-center">
                        <button
                          onClick={() => handleUpdateFile(item.id)}
                          className="text-green-600 hover:text-green-800 flex items-center"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Update
                        </button>
                      </td>
                      <td className="text-center">{item.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          {totalItems > 0 && (
            <div className="mt-6">
              <PaginationStandard
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={pageSize}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </Card>
    </Container>
  );
};

export default UploadReportPage;
