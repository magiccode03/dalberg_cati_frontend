'use client';

import { useState } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';
import { Table } from '@/components/ui/Table';

export default function UpdateRequestPage() {
  const [actionType, setActionType] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  const actionTypeOptions = [
    { value: '', label: 'Select Action Type' },
    { value: '1', label: 'Generate Data Download File (all.csv)' },
    { value: '2', label: 'Generate Data Download File (Data Quality Download Section)' },
    { value: '3', label: 'Generate Data Download File (All files)' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', { actionType, additionalInfo });
    // In a real application, this would submit the form data
  };

  return (
    <div className="main-content horizontal-content">
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        {/* Breadcrumb Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1">
            <Heading level={2} className="text-2xl font-semibold text-gray-900">
              Update Request
            </Heading>
          </div>
          <div className="flex-1"></div>
          <div className="flex-1">
            <span></span>
          </div>
        </div>

        {/* Form Card */}
        <div className="w-full mb-6">
          <Card>
            {/* Card Header */}
            <div className="pb-0 mb-6">
              <div className="flex justify-between items-center">
                <Heading level={4} className="text-lg font-semibold text-gray-900 mb-0">
                  Data Download Request
                </Heading>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-4">
                  <div className="space-y-2">
                    <Text className="text-sm font-medium text-gray-700">
                      Action Type <span className="text-red-500">*</span>
                    </Text>
                    <SelectDropdown
                      value={actionType}
                      onChange={(value) => setActionType(value as string)}
                      options={actionTypeOptions}
                      placeholder="Select Action Type"
                    />
                  </div>
                </div>

                <div className="md:col-span-8">
                  <div className="space-y-2">
                    <Text className="text-sm font-medium text-gray-700">
                      Additional Info <span className="text-red-500">*</span>
                    </Text>
                    <Input
                      type="text"
                      value={additionalInfo}
                      onChange={(e) => setAdditionalInfo(e.target.value)}
                      placeholder="Additional Info for this Cron"
                      required
                    />
                  </div>
                </div>

                <div className="md:col-span-12">
                  <Button
                    type="submit"
                    variant="primary"
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Generate Request
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        </div>

        {/* List Card */}
        <div className="w-full">
          <Card>
            {/* Card Header */}
            <div className="pb-0 mb-6">
              <Heading level={4} className="text-lg font-semibold text-gray-900 mb-0">
                List of Data Download Requestes
              </Heading>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <Table className="table table-striped table-bordered table-hover no-margin-bottom no-border-top table-condensed">
                <thead>
                  <tr>
                    <th className="text-center font-semibold text-gray-800">S.No</th>
                    <th className="text-center font-semibold text-gray-800">Cron ID</th>
                    <th className="text-left font-semibold text-gray-800">Action/Route</th>
                    <th className="text-left font-semibold text-gray-800">Action Type</th>
                    <th className="text-left font-semibold text-gray-800">CRON Info</th>
                    <th className="text-center font-semibold text-gray-800">Planned At</th>
                    <th className="text-left font-semibold text-gray-800">Executed At</th>
                    <th className="text-left font-semibold text-gray-800">Execution</th>
                    <th className="text-left font-semibold text-gray-800">Errors</th>
                    <th className="text-center font-semibold text-gray-800">Status</th>
                    <th className="text-center font-semibold text-gray-800">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={11} className="text-center py-8">
                      <div className="text-gray-500">
                        No results found.
                      </div>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
}
