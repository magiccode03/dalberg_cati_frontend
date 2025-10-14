'use client';

import React, { useState } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';

// Interfaces
interface PendingDataItem {
  id: number;
  telecallerName: string;
  telecallerId: string;
  pendingData: number;
}

interface QCPendingDataItem {
  id: number;
  telecallerName: string;
  telecallerId: string;
  qcPendingData: number;
}

const TelecallerPendingDataPage = () => {
  // Sample data for pending data (empty as per HTML)
  const [pendingData] = useState<PendingDataItem[]>([]);

  // Sample data for QC pending data (empty as per HTML)
  const [qcPendingData] = useState<QCPendingDataItem[]>([]);

  // Sample data for Re-QC pending data
  const [reQCPendingData] = useState<QCPendingDataItem[]>([
    {
      id: 1,
      telecallerName: 'Krishna Shree',
      telecallerId: '1510',
      qcPendingData: 800,
    },
  ]);

  // Handlers
  const handleRedistributePending = () => {
    console.log('Redistribute Pending Data');
  };

  const handleRedistributeQC = () => {
    console.log('Redistribute QC Pending Data');
  };

  const handleRedistributeReQC = () => {
    console.log('Redistribute Re-QC Pending Data');
  };

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Page Header */}
      <div className="mb-6">
        <Heading level={2} className="text-2xl font-semibold text-gray-900">
          Telecaller Pending Data
        </Heading>
      </div>

      {/* Main Card */}
      <Card>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-600 mr-3"></div>
            <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
              Telecaller Pending Data
            </Heading>
          </div>
          <div className="flex gap-2">
            {/* <Button 
              variant="secondary" 
              onClick={handleRedistributePending}
              className="flex items-center bg-green-500 hover:bg-green-600 text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Redistribute Pending Data
            </Button>
            <Button 
              variant="secondary" 
              onClick={handleRedistributeQC}
              className="flex items-center bg-blue-500 hover:bg-blue-600 text-white"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Redistribute QC Pending Data
            </Button> */}
            {/* <Button 
              variant="secondary" 
              onClick={handleRedistributeReQC}
              className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Redistribute Re-QC Pending Data
            </Button> */}
          </div>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400 my-2">
            Total <strong>{pendingData.length + qcPendingData.length + reQCPendingData.length}</strong> items.
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          {/* Left Column - Pending Data */}
          <div>
            <Table className="table table-bordered table-striped table-hover">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap text-center">S.No.</th>
                  <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap text-left">Telecaller Name</th>
                  <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap text-center">Telecaller ID</th>
                  <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap text-center">Pending Data (0)</th>
                </tr>
              </thead>
              <tbody>
                {pendingData.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                      No pending data available
                    </td>
                  </tr>
                ) : (
                  pendingData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 border-b border-gray-200 text-center">{index + 1}</td>
                      <td className="px-4 py-3 border-b border-gray-200 text-left">{item.telecallerName}</td>
                      <td className="px-4 py-3 border-b border-gray-200 text-center">{item.telecallerId}</td>
                      <td className="px-4 py-3 border-b border-gray-200 text-center">{item.pendingData}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>

          {/* Right Column - QC Pending Data */}
          <div>
            {/* <Table striped bordered hover>
              <thead>
                <tr>
                  <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Sr. No.</th>
                  <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Telecaller Name</th>
                  <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Telecaller ID</th>
                  <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">QC Pending Data (0)</th>
                </tr>
              </thead>
              <tbody>
                {qcPendingData.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                      No QC pending data available
                    </td>
                  </tr>
                ) : (
                  qcPendingData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 border-b border-gray-200">{index + 1}</td>
                      <td className="px-4 py-3 border-b border-gray-200">{item.telecallerName}</td>
                      <td className="px-4 py-3 border-b border-gray-200">{item.telecallerId}</td>
                      <td className="px-4 py-3 border-b border-gray-200">{item.qcPendingData}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table> */}

            {/* Re-QC Pending Data Section */}
            {/* <div className="mt-8">
              <Text className="text-lg font-bold text-gray-900 mb-4">
                Re-QC Pending Data
              </Text>
              
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Sr. No.</th>
                    <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Telecaller Name</th>
                    <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">Telecaller ID</th>
                    <th className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">QC Pending Data (800)</th>
                  </tr>
                </thead>
                <tbody>
                  {reQCPendingData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 border-b border-gray-200">{index + 1}</td>
                      <td className="px-4 py-3 border-b border-gray-200">{item.telecallerName}</td>
                      <td className="px-4 py-3 border-b border-gray-200">{item.telecallerId}</td>
                      <td className="px-4 py-3 border-b border-gray-200">{item.qcPendingData}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div> */}
          </div>
        </div>
      </Card>
    </Container>
  );
};

export default TelecallerPendingDataPage;
