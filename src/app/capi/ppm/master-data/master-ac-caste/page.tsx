'use client';

import React, { useState } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Table } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';
import { Search, Download, Upload, Edit } from 'lucide-react';

interface MasterACCaste {
  id: number;
  acCode: number;
  casteName: string;
  absoluteCaste: number;
  caste: number;
  rank: number;
  casteCode: number;
  castecode: number;
  minsample: number;
}

export default function MasterACCastePage() {
  const [acCode, setAcCode] = useState('');
  const [casteName, setCasteName] = useState('');
  const [casteCode, setCasteCode] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);

  // Sample data for Master AC Caste (20 items as shown in HTML)
  const masterACCasteData: MasterACCaste[] = [
    { id: 1, acCode: 1, casteName: 'Tharu', absoluteCaste: 0, caste: 15.4, rank: 1, casteCode: 98, castecode: 98, minsample: 28 },
    { id: 2, acCode: 1, casteName: 'Muslim', absoluteCaste: 0, caste: 11.5, rank: 2, casteCode: 70, castecode: 70, minsample: 21 },
    { id: 3, acCode: 1, casteName: 'Yadav / Raut', absoluteCaste: 0, caste: 11.5, rank: 3, casteCode: 106, castecode: 106, minsample: 21 },
    { id: 4, acCode: 1, casteName: 'Kewat / Mallah / Bhoi / Bind / Nishad', absoluteCaste: 0, caste: 10.5, rank: 4, casteCode: 49, castecode: 49, minsample: 19 },
    { id: 5, acCode: 1, casteName: 'Halwai / Kandu / Kanu', absoluteCaste: 0, caste: 8.6, rank: 5, casteCode: 36, castecode: 36, minsample: 16 },
    { id: 6, acCode: 1, casteName: 'Chamar / Ravidas / Mochi', absoluteCaste: 0, caste: 7.5, rank: 6, casteCode: 16, castecode: 16, minsample: 14 },
    { id: 7, acCode: 1, casteName: 'Koeri/Kushwaha', absoluteCaste: 0, caste: 6.6, rank: 7, casteCode: 57, castecode: 57, minsample: 12 },
    { id: 8, acCode: 1, casteName: 'Kurmi', absoluteCaste: 0, caste: 5.2, rank: 8, casteCode: 61, castecode: 61, minsample: 9 },
    { id: 9, acCode: 2, casteName: 'Muslim', absoluteCaste: 0, caste: 22.6, rank: 1, casteCode: 70, castecode: 70, minsample: 41 },
    { id: 10, acCode: 2, casteName: 'Tharu', absoluteCaste: 0, caste: 19.5, rank: 2, casteCode: 98, castecode: 98, minsample: 35 },
    { id: 11, acCode: 2, casteName: 'Chamar / Ravidas / Mochi', absoluteCaste: 0, caste: 9.1, rank: 3, casteCode: 16, castecode: 16, minsample: 16 },
    { id: 12, acCode: 2, casteName: 'Yadav / Raut', absoluteCaste: 0, caste: 7.8, rank: 4, casteCode: 106, castecode: 106, minsample: 14 },
    { id: 13, acCode: 2, casteName: 'Kewat / Mallah / Bhoi / Bind / Nishad', absoluteCaste: 0, caste: 7.1, rank: 5, casteCode: 49, castecode: 49, minsample: 13 },
    { id: 14, acCode: 2, casteName: 'Kayastha', absoluteCaste: 0, caste: 6.9, rank: 6, casteCode: 48, castecode: 48, minsample: 12 },
    { id: 15, acCode: 3, casteName: 'Muslim', absoluteCaste: 0, caste: 32.4, rank: 1, casteCode: 70, castecode: 70, minsample: 58 },
    { id: 16, acCode: 3, casteName: 'Dhobi', absoluteCaste: 0, caste: 6.7, rank: 2, casteCode: 26, castecode: 26, minsample: 12 },
    { id: 17, acCode: 3, casteName: 'Brahmin', absoluteCaste: 0, caste: 6.0, rank: 3, casteCode: 15, castecode: 15, minsample: 11 },
    { id: 18, acCode: 4, casteName: 'Muslim', absoluteCaste: 0, caste: 17.6, rank: 1, casteCode: 70, castecode: 70, minsample: 32 },
    { id: 19, acCode: 4, casteName: 'Baniya / Barnwal / Mahuri / Kesari', absoluteCaste: 0, caste: 15.8, rank: 2, casteCode: 6, castecode: 6, minsample: 29 },
    { id: 20, acCode: 4, casteName: 'Yadav / Raut', absoluteCaste: 0, caste: 12.9, rank: 3, casteCode: 106, castecode: 106, minsample: 23 }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
    console.log('Search AC Code:', acCode);
    console.log('Search Caste Name:', casteName);
    console.log('Search Caste Code:', casteCode);
  };

  const handleDownloadCaste = () => {
    // Handle download caste list logic here
    console.log('Download Caste List');
  };

  const handleUploadCaste = () => {
    // Handle upload caste list logic here
    console.log('Upload Caste List');
  };

  const handleEditCaste = (id: number) => {
    // Handle edit caste logic here
    console.log('Edit Caste ID:', id);
  };

  const totalItems = 1453; // Total items as shown in HTML (1-20 of 1,453)
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto p-6 main-container">
      {/* Breadcrumb Header */}
      <div className="breadcrumb-header justify-content-between mb-6">
        <div className="left-content">
          <Heading level={1} className="text-2xl font-bold mb-0">
            List of AC Wise Caste
          </Heading>
        </div>
        <div className="right-content">
          <span className="main-content-title mg-b-0 mg-b-lg-1"></span>
        </div>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-3">
            <Input
              type="text"
              value={acCode}
              onChange={(e) => setAcCode(e.target.value)}
              placeholder="Search By AC Code"
              className="w-full"
            />
          </div>
          
          <div className="md:col-span-3">
            <Input
              type="text"
              value={casteName}
              onChange={(e) => setCasteName(e.target.value)}
              placeholder="Search By Caste Name"
              className="w-full"
            />
          </div>
          
          <div className="md:col-span-3">
            <Input
              type="text"
              value={casteCode}
              onChange={(e) => setCasteCode(e.target.value)}
              placeholder="Search By Caste Code"
              className="w-full"
            />
          </div>
          
          <div className="md:col-span-3">
            <Button type="submit" variant="primary">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </form>

      {/* Master AC Caste Table Card */}
      <Card className="p-6">
        <div className="card-header pb-0 mb-6">
          <div className="flex justify-between items-center">
            <Heading level={4} className="card-title mg-b-0">
              List of AC Wise Caste
            </Heading>
            <div className="flex gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleDownloadCaste}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Caste List
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleUploadCaste}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Caste List
              </Button>
            </div>
          </div>
        </div>
        
        <div className="card-body">
          <div className="table-responsive">
            <div className="summary mb-4">
              <Text className="text-sm text-gray-600">
                Showing <b>{startIndex + 1}-{endIndex}</b> of <b>{totalItems}</b> items.
              </Text>
            </div>
            
            <Table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Ac Code</th>
                  <th>Caste Name</th>
                  <th>Absoulte Caste</th>
                  <th>Caste</th>
                  <th>Rank</th>
                  <th>Caste Code</th>
                  <th>Castecode</th>
                  <th>Minsample</th>
                  <th className="action-column">Actions</th>
                </tr>
              </thead>
              <tbody>
                {masterACCasteData.map((caste, index) => (
                  <tr key={caste.id}>
                    <td>{index + 1}</td>
                    <td>{caste.acCode}</td>
                    <td>{caste.casteName}</td>
                    <td>{caste.absoluteCaste}</td>
                    <td>{caste.caste}</td>
                    <td>{caste.rank}</td>
                    <td>{caste.casteCode}</td>
                    <td>{caste.castecode}</td>
                    <td>{caste.minsample}</td>
                    <td className="text-center">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleEditCaste(caste.id)}
                        className="text-white"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            
            <div className="mt-6">
              <PaginationStandard
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={pageSize}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </Card>
    </Container>
  );
}
