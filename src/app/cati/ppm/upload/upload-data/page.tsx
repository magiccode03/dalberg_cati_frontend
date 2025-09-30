'use client';

import React, { useState } from 'react';
import { FluidContainer } from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';
import { Download, Eye, RotateCcw } from 'lucide-react';

// Interfaces
interface UploadedFileData {
  id: number;
  description: string;
  numberOfRows: number;
  uploadDateTime: string;
  status: string;
  isProcessing: boolean;
  fileId: number;
}

const UploadDataPage = () => {
  // State for upload form
  const [uploadForm, setUploadForm] = useState({
    csvFile: null as File | null,
    label: '',
  });

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  // Sample data for uploaded files history
  const [uploadedFilesData] = useState<UploadedFileData[]>([
    {
      id: 1,
      description: 'New data lot 2',
      numberOfRows: 24628,
      uploadDateTime: '2024-05-26 08:28:31',
      status: 'Completed! All Data Processed',
      isProcessing: false,
      fileId: 122,
    },
    {
      id: 2,
      description: 'New data lot 2',
      numberOfRows: 24628,
      uploadDateTime: '2024-05-26 08:24:53',
      status: 'Success! Uploaded and in process',
      isProcessing: true,
      fileId: 121,
    },
    {
      id: 3,
      description: 'New data lot 1',
      numberOfRows: 34256,
      uploadDateTime: '2024-05-26 08:18:50',
      status: 'Completed! All Data Processed',
      isProcessing: false,
      fileId: 120,
    },
    {
      id: 4,
      description: 'lot 2',
      numberOfRows: 14278,
      uploadDateTime: '2024-04-16 17:31:51',
      status: 'Success! Uploaded and in process',
      isProcessing: true,
      fileId: 119,
    },
    {
      id: 5,
      description: 'lot 1',
      numberOfRows: 14279,
      uploadDateTime: '2024-04-16 17:29:46',
      status: 'Completed! All Data Processed',
      isProcessing: false,
      fileId: 118,
    },
    {
      id: 6,
      description: '278',
      numberOfRows: 4999,
      uploadDateTime: '2024-04-04 13:08:06',
      status: 'Completed! All Data Processed',
      isProcessing: false,
      fileId: 117,
    },
    {
      id: 7,
      description: 'lot 3',
      numberOfRows: 67328,
      uploadDateTime: '2024-04-02 19:48:52',
      status: 'Success! Uploaded and in process',
      isProcessing: true,
      fileId: 116,
    },
    {
      id: 8,
      description: 'Lot 2_1',
      numberOfRows: 79998,
      uploadDateTime: '2024-04-02 19:46:02',
      status: 'Success! Uploaded and in process',
      isProcessing: true,
      fileId: 115,
    },
    {
      id: 9,
      description: 'Lot 2',
      numberOfRows: 79998,
      uploadDateTime: '2024-04-02 19:44:34',
      status: 'Success! Uploaded and in process',
      isProcessing: true,
      fileId: 114,
    },
    {
      id: 10,
      description: 'lot 1',
      numberOfRows: 79991,
      uploadDateTime: '2024-04-02 19:41:04',
      status: 'Success! Uploaded and in process',
      isProcessing: true,
      fileId: 113,
    },
  ]);

  // Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setUploadForm(prev => ({
      ...prev,
      csvFile: file,
    }));
  };

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadForm(prev => ({
      ...prev,
      label: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Upload form submitted:', uploadForm);
    // Reset form after submission
    setUploadForm({
      csvFile: null,
      label: '',
    });
  };

  const handleDownloadSample = () => {
    console.log('Download sample file');
  };

  const handleViewFileData = (fileId: number) => {
    console.log('View file data for ID:', fileId);
  };

  const handleReprocessData = (fileId: number) => {
    console.log('Re-process data for ID:', fileId);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Pagination calculations
  const totalItems = uploadedFilesData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = uploadedFilesData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <FluidContainer>
      {/* Page Header */}
      <div className="mb-6">
        <Heading level={1} className="text-2xl font-bold text-gray-900">
          Upload Data
        </Heading>
      </div>

      {/* Upload Form */}
      <Card className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-600 mr-3"></div>
            <Heading level={4} className="text-xl font-semibold text-gray-900">
              Upload Data
            </Heading>
          </div>
          <Button 
            variant="primary" 
            size="sm"
            onClick={handleDownloadSample}
            className="flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Sample File
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Data File */}
            <div>
              <label htmlFor="csvFile" className="block text-sm font-medium text-gray-700 mb-2">
                Data File <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                id="csvFile"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                required
              />
            </div>

            {/* File Description */}
            <div className="md:col-span-2">
              <label htmlFor="label" className="block text-sm font-medium text-gray-700 mb-2">
                File Description <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                id="label"
                value={uploadForm.label}
                onChange={handleLabelChange}
                placeholder="Description of Uploaded File"
                className="w-full max-w-md"
                required
              />
            </div>
          </div>

          {/* Note and Submit Button */}
          <div className="space-y-4">
            <Text className="text-red-500 text-sm">
              Note: Number of Rows can't exceed 80000
            </Text>
            <Button type="submit" variant="primary">
              Submit
            </Button>
          </div>
        </form>
      </Card>

      {/* Uploaded Files History */}
      <Card>
        <div className="mb-4">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-600 mr-3"></div>
            <Heading level={4} className="text-xl font-semibold text-gray-900">
              Uploaded files History
            </Heading>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">#</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Description of Uploaded File</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Number of Rows</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Upload Date & Time</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Status</th>
                <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Data</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border-b border-gray-200">{indexOfFirstItem + index + 1}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{item.description}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{item.numberOfRows.toLocaleString()}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{item.uploadDateTime}</td>
                  <td className="px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                      <span className={item.isProcessing ? 'text-green-600' : 'text-gray-600'}>
                        {item.status}
                      </span>
                      {item.isProcessing && (
                        <button
                          onClick={() => handleReprocessData(item.fileId)}
                          className="text-green-600 hover:text-green-800 flex items-center text-sm"
                        >
                          <RotateCcw className="w-3 h-3 mr-1" />
                          Re-Process Data
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 border-b border-gray-200 flex justify-center">
                    <button
                      onClick={() => handleViewFileData(item.fileId)}
                      className="w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded flex items-center justify-center"
                      title="View File Data"
                    >
                      <Eye className="w-4 h-4 text-white" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="mt-4">
          <PaginationStandard
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
          />
        </div>

      </Card>
    </FluidContainer>
  );
};

export default UploadDataPage;
