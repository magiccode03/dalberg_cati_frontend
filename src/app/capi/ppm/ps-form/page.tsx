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
import { Search, Download, Upload, Edit, RotateCcw } from 'lucide-react';

interface PSForForm {
  id: number;
  acCode: number;
  lotNo: number;
  acLot: string;
  pollingStationNo: string;
  pollingStationName: string;
  pollingStationNameL2: string;
  pollingStationLocation: string;
  validInterview: number;
  validInterviewLimit: number;
}

export default function PSForFormPage() {
  const [pollingStationName, setPollingStationName] = useState('');
  const [pollingStationNo, setPollingStationNo] = useState('');
  const [acCode, setAcCode] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);

  // Sample data for PS for Form (20 items as shown in HTML)
  const psForFormData: PSForForm[] = [
    { id: 1, acCode: 999, lotNo: 1, acLot: '999_1', pollingStationNo: '999_1', pollingStationName: '1. dummy ps name1', pollingStationNameL2: '', pollingStationLocation: '', validInterview: 0, validInterviewLimit: 20 },
    { id: 2, acCode: 999, lotNo: 2, acLot: '999_2', pollingStationNo: '999_2', pollingStationName: '2. dummy ps name2', pollingStationNameL2: '', pollingStationLocation: '', validInterview: 0, validInterviewLimit: 20 },
    { id: 3, acCode: 999, lotNo: 2, acLot: '999_2', pollingStationNo: '999_3', pollingStationName: '3. dummy ps name3', pollingStationNameL2: '', pollingStationLocation: '', validInterview: 0, validInterviewLimit: 20 },
    { id: 4, acCode: 1, lotNo: 1, acLot: '1_1', pollingStationNo: '1_27', pollingStationName: '27. Prathamik Vidyalay Godar', pollingStationNameL2: '', pollingStationLocation: '', validInterview: 16, validInterviewLimit: 20 },
    { id: 5, acCode: 1, lotNo: 1, acLot: '1_1', pollingStationNo: '1_28', pollingStationName: '28. Prathamik Vidyalay Malakauli', pollingStationNameL2: '', pollingStationLocation: '', validInterview: 13, validInterviewLimit: 20 },
    { id: 6, acCode: 1, lotNo: 1, acLot: '1_1', pollingStationNo: '1_38', pollingStationName: '38. Prathamik Vidyalay, Matiariya', pollingStationNameL2: '', pollingStationLocation: '', validInterview: 13, validInterviewLimit: 20 },
    { id: 7, acCode: 1, lotNo: 1, acLot: '1_1', pollingStationNo: '1_39', pollingStationName: '39. Prathamik Vidyalay, Amahat', pollingStationNameL2: '', pollingStationLocation: '', validInterview: 13, validInterviewLimit: 20 },
    { id: 8, acCode: 1, lotNo: 1, acLot: '1_1', pollingStationNo: '1_49', pollingStationName: '49. Prathamik Vidyalay, Bairiyakala', pollingStationNameL2: '', pollingStationLocation: '', validInterview: 13, validInterviewLimit: 20 },
    { id: 9, acCode: 1, lotNo: 1, acLot: '1_1', pollingStationNo: '1_50', pollingStationName: '50. Prathamik Vidyalay, Khajuriya', pollingStationNameL2: '', pollingStationLocation: '', validInterview: 16, validInterviewLimit: 20 },
    { id: 10, acCode: 1, lotNo: 2, acLot: '1_2', pollingStationNo: '1_60', pollingStationName: '60. Krishchan Mishan Skul Pacharukha, Uttari Bhag', pollingStationNameL2: '', pollingStationLocation: '', validInterview: 13, validInterviewLimit: 20 },
    { id: 11, acCode: 1, lotNo: 2, acLot: '1_2', pollingStationNo: '1_61', pollingStationName: '61. Krishchan Mishan Skul Pacharukha Dakshini Bhag', pollingStationNameL2: '', pollingStationLocation: '', validInterview: 11, validInterviewLimit: 20 },
    { id: 12, acCode: 1, lotNo: 2, acLot: '1_2', pollingStationNo: '1_71', pollingStationName: '71. Utkramit Madhya Vidyalay, Jarar Dakshini Bhag', pollingStationNameL2: '', pollingStationLocation: '', validInterview: 14, validInterviewLimit: 20 },
    { id: 13, acCode: 1, lotNo: 2, acLot: '1_2', pollingStationNo: '1_72', pollingStationName: '72. Prathamik Vidyalay Bhadachhi', pollingStationNameL2: '', pollingStationLocation: '', validInterview: 13, validInterviewLimit: 20 },
    { id: 14, acCode: 1, lotNo: 2, acLot: '1_2', pollingStationNo: '1_82', pollingStationName: '82. Prathamik Vidyalay, Jimari', pollingStationNameL2: '', pollingStationLocation: '', validInterview: 12, validInterviewLimit: 20 },
    { id: 15, acCode: 1, lotNo: 2, acLot: '1_2', pollingStationNo: '1_83', pollingStationName: '83. Utkramit Madhya Vidyalay, Nautanava', pollingStationNameL2: '', pollingStationLocation: '', validInterview: 13, validInterviewLimit: 20 },
    { id: 16, acCode: 1, lotNo: 3, acLot: '1_3', pollingStationNo: '1_93', pollingStationName: '93. Utkramit Madhya Vidyalay, Semara, Vijay Nagar', pollingStationNameL2: '', pollingStationLocation: '', validInterview: 9, validInterviewLimit: 20 },
    { id: 17, acCode: 1, lotNo: 3, acLot: '1_3', pollingStationNo: '1_94', pollingStationName: '94. Utkramit Madhya Vidyalay, Semara Sharanarthi', pollingStationNameL2: '', pollingStationLocation: '', validInterview: 13, validInterviewLimit: 20 },
    { id: 18, acCode: 1, lotNo: 3, acLot: '1_3', pollingStationNo: '1_104', pollingStationName: '104. Utkrmit Madhy, Panchangva, Purbi Bhag', pollingStationNameL2: '', pollingStationLocation: '', validInterview: 13, validInterviewLimit: 20 },
    { id: 19, acCode: 1, lotNo: 3, acLot: '1_3', pollingStationNo: '1_105', pollingStationName: '105. Utkramit Madhya Vidyalay, Pachaganva, Paschimi Bhag', pollingStationNameL2: '', pollingStationLocation: '', validInterview: 12, validInterviewLimit: 20 },
    { id: 20, acCode: 1, lotNo: 3, acLot: '1_3', pollingStationNo: '1_115', pollingStationName: '115. Prathamik Vidyalay, Nayagonv, Utri Bhag', pollingStationNameL2: '', pollingStationLocation: '', validInterview: 13, validInterviewLimit: 20 }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
    console.log('Search Polling Station Name:', pollingStationName);
    console.log('Search Polling Station No:', pollingStationNo);
    console.log('Search AC Code:', acCode);
  };

  const handleCalculateValidInterview = () => {
    // Handle calculate valid interview logic here
    console.log('Calculate Valid Interview');
  };

  const handleDownloadPS = () => {
    // Handle download PS list logic here
    console.log('Download PS List');
  };

  const handleUploadPS = () => {
    // Handle upload PS list logic here
    console.log('Upload PS List');
  };

  const handleEditPS = (id: number) => {
    // Handle edit PS logic here
    console.log('Edit PS ID:', id);
  };

  const totalItems = 5835; // Total items as shown in HTML (1-20 of 5,835)
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Breadcrumb Header */}
      <div className="breadcrumb-header justify-content-between mb-6">
        <div className="left-content">
          <Heading level={1} className="text-2xl font-bold mb-0">
            List of Master Poling Station For Field Form
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
              value={pollingStationName}
              onChange={(e) => setPollingStationName(e.target.value)}
              placeholder="Search By Poling Station Name"
              className="w-full"
            />
          </div>
          
          <div className="md:col-span-3">
            <Input
              type="text"
              value={pollingStationNo}
              onChange={(e) => setPollingStationNo(e.target.value)}
              placeholder="Search By Poling Station Code"
              className="w-full"
            />
          </div>
          
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
            <Button type="submit" variant="primary">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </form>

      {/* PS for Form Table Card */}
      <Card className="p-6">
        <div className="card-header pb-0 mb-6">
          <div className="flex justify-between items-center">
            <Heading level={4} className="card-title mg-b-0">
              List of Master Poling Station For Field Form
            </Heading>
            <div className="flex gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleCalculateValidInterview}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Calculate Valid Interview
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleDownloadPS}
              >
                <Download className="w-4 h-4 mr-2" />
                Download PS List
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleUploadPS}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload PS List
              </Button>
            </div>
          </div>
        </div>
        
        <div className="card-body">
          <div className="table-responsive">
            <div className="summary mb-4">
              <Text className="text-sm text-gray-600">
                Showing <b>{startIndex + 1}-{endIndex}</b> of <b>{totalItems.toLocaleString()}</b> items.
              </Text>
            </div>
            
            <Table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Ac Code</th>
                  <th>Lot No</th>
                  <th>Ac Lot</th>
                  <th>Polling Station No</th>
                  <th>Polling Station Name</th>
                  <th>Polling Station Name L2</th>
                  <th>Polling Station Location</th>
                  <th>Valid Interview</th>
                  <th>Valid Interview Limit</th>
                  <th className="action-column">Actions</th>
                </tr>
              </thead>
              <tbody>
                {psForFormData.map((ps, index) => (
                  <tr key={ps.id}>
                    <td>{index + 1}</td>
                    <td>{ps.acCode}</td>
                    <td>{ps.lotNo}</td>
                    <td>{ps.acLot}</td>
                    <td>{ps.pollingStationNo}</td>
                    <td>{ps.pollingStationName}</td>
                    <td>{ps.pollingStationNameL2}</td>
                    <td>{ps.pollingStationLocation}</td>
                    <td>{ps.validInterview}</td>
                    <td>{ps.validInterviewLimit}</td>
                    <td className="text-center">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleEditPS(ps.id)}
                        className="text-white bg-blue-500 hover:bg-blue-600 border-0"
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
