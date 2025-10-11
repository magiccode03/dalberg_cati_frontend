'use client';

import React, { useState } from 'react';
import { FluidContainer } from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import { Download } from 'lucide-react';

const UploadWeightPage = () => {
  // State for upload form
  const [uploadForm, setUploadForm] = useState({
    csvFile: null as File | null,
  });

  // Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setUploadForm(prev => ({
      ...prev,
      csvFile: file,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Upload weight form submitted:', uploadForm);
    // Reset form after submission
    setUploadForm({
      csvFile: null,
    });
  };

  const handleDownloadSample = () => {
    console.log('Download sample weight file');
  };

  return (
    <FluidContainer>
      {/* Page Header */}
      <div className="mb-6">
        <Heading level={1} className="text-2xl font-bold text-gray-900">
          Upload Weight
        </Heading>
      </div>

      {/* Upload Form */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-600 mr-3"></div>
            <Heading level={4} className="text-xl font-semibold text-gray-900">
              Upload Weights
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
          </div>

          {/* Note and Submit Button */}
          <div className="space-y-4">
            <Text className="text-red-500 text-sm">
              Note: Number of Rows can't exceed 200000
            </Text>
            <Button type="submit" variant="primary">
              Submit
            </Button>
          </div>
        </form>
      </Card>
    </FluidContainer>
  );
};

export default UploadWeightPage;
