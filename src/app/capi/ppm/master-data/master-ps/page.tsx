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
import { Search, Download, Upload, Edit, Map, RotateCcw } from 'lucide-react';

interface MasterPS {
  id: number;
  acCode: number;
  pollingStationNo: string;
  pollingStationName: string;
  pollingStationNameL2: string;
  gps: string;
  gpsLat: number;
  gpsLng: number;
  validInterview: number;
}

export default function MasterPSPage() {
  const [pollingStationName, setPollingStationName] = useState('');
  const [pollingStationNo, setPollingStationNo] = useState('');
  const [acCode, setAcCode] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);

  // Sample data for Master PS (20 items as shown in HTML)
  const masterPSData: MasterPS[] = [
    { id: 1, acCode: 999, pollingStationNo: '999_1', pollingStationName: '1. dummy ps name1', pollingStationNameL2: '', gps: '28.61240558612887 77.36629948466033', gpsLat: 28.61240559, gpsLng: 77.36629948, validInterview: 0 },
    { id: 2, acCode: 999, pollingStationNo: '999_2', pollingStationName: '2. dummy ps name2', pollingStationNameL2: '', gps: '28.61062621772287 77.35971766279062', gpsLat: 28.61062622, gpsLng: 77.35971766, validInterview: 0 },
    { id: 3, acCode: 999, pollingStationNo: '999_3', pollingStationName: '3. dummy ps name3', pollingStationNameL2: '', gps: '28.60801125250253 77.36850603940867', gpsLat: 28.60801125, gpsLng: 77.36850604, validInterview: 0 },
    { id: 4, acCode: 1, pollingStationNo: '1_27', pollingStationName: '27. Prathamik Vidyalay Godar', pollingStationNameL2: '', gps: '27.320274682671506 84.00389284647972', gpsLat: 27.32027468, gpsLng: 84.00389285, validInterview: 0 },
    { id: 5, acCode: 1, pollingStationNo: '1_28', pollingStationName: '28. Prathamik Vidyalay Malakauli', pollingStationNameL2: '', gps: '27.32721332355722 83.98567721381595', gpsLat: 27.32721332, gpsLng: 83.98567721, validInterview: 0 },
    { id: 6, acCode: 1, pollingStationNo: '1_38', pollingStationName: '38. Prathamik Vidyalay, Matiariya', pollingStationNameL2: '', gps: '27.436429620218643 83.90824976439188', gpsLat: 27.43642962, gpsLng: 83.90824976, validInterview: 0 },
    { id: 7, acCode: 1, pollingStationNo: '1_39', pollingStationName: '39. Prathamik Vidyalay, Amahat', pollingStationNameL2: '', gps: '27.418015776611828 83.89908268806177', gpsLat: 27.41801578, gpsLng: 83.89908269, validInterview: 0 },
    { id: 8, acCode: 1, pollingStationNo: '1_49', pollingStationName: '49. Prathamik Vidyalay, Bairiyakala', pollingStationNameL2: '', gps: '27.318192903255323 84.04621762581222', gpsLat: 27.3181929, gpsLng: 84.04621763, validInterview: 0 },
    { id: 9, acCode: 1, pollingStationNo: '1_50', pollingStationName: '50. Prathamik Vidyalay, Khajuriya', pollingStationNameL2: '', gps: '27.29389179230332 84.04719892398111', gpsLat: 27.29389179, gpsLng: 84.04719892, validInterview: 0 },
    { id: 10, acCode: 1, pollingStationNo: '1_60', pollingStationName: '60. Krishchan Mishan Skul Pacharukha, Uttari Bhag', pollingStationNameL2: '', gps: '27.429226027860146 83.91806402611316', gpsLat: 27.42922603, gpsLng: 83.91806403, validInterview: 0 },
    { id: 11, acCode: 1, pollingStationNo: '1_61', pollingStationName: '61. Krishchan Mishan Skul Pacharukha Dakshini Bhag', pollingStationNameL2: '', gps: '27.429228029762434 83.91815875543011', gpsLat: 27.42922803, gpsLng: 83.91815876, validInterview: 0 },
    { id: 12, acCode: 1, pollingStationNo: '1_71', pollingStationName: '71. Utkramit Madhya Vidyalay, Jarar Dakshini Bhag', pollingStationNameL2: '', gps: '27.2625963904814 84.04601860304301', gpsLat: 27.26259639, gpsLng: 84.0460186, validInterview: 0 },
    { id: 13, acCode: 1, pollingStationNo: '1_72', pollingStationName: '72. Prathamik Vidyalay Bhadachhi', pollingStationNameL2: '', gps: '27.436010647713267 83.90850725645522', gpsLat: 27.43601065, gpsLng: 83.90850726, validInterview: 0 },
    { id: 14, acCode: 1, pollingStationNo: '1_82', pollingStationName: '82. Prathamik Vidyalay, Jimari', pollingStationNameL2: '', gps: '27.263317024331112 84.10882036211505', gpsLat: 27.26331702, gpsLng: 84.10882036, validInterview: 0 },
    { id: 15, acCode: 1, pollingStationNo: '1_83', pollingStationName: '83. Utkramit Madhya Vidyalay, Nautanava', pollingStationNameL2: '', gps: '27.254952824752966 84.09997798126193', gpsLat: 27.25495282, gpsLng: 84.09997798, validInterview: 0 },
    { id: 16, acCode: 1, pollingStationNo: '1_93', pollingStationName: '93. Utkramit Madhya Vidyalay, Semara, Vijay Nagar', pollingStationNameL2: '', gps: '27.216741123810802 84.12779767431864', gpsLat: 27.21674112, gpsLng: 84.12779767, validInterview: 0 },
    { id: 17, acCode: 1, pollingStationNo: '1_94', pollingStationName: '94. Utkramit Madhya Vidyalay, Semara Sharanarthi', pollingStationNameL2: '', gps: '27.217479396654753 84.13770756636907', gpsLat: 27.2174794, gpsLng: 84.13770757, validInterview: 0 },
    { id: 18, acCode: 1, pollingStationNo: '1_104', pollingStationName: '104. Utkrmit Madhy, Panchangva, Purbi Bhag', pollingStationNameL2: '', gps: '27.429252611985635 83.91566530814734', gpsLat: 27.42925261, gpsLng: 83.91566531, validInterview: 0 },
    { id: 19, acCode: 1, pollingStationNo: '1_105', pollingStationName: '105. Utkramit Madhya Vidyalay, Pachaganva, Paschimi Bhag', pollingStationNameL2: '', gps: '27.429460809576966 83.915520958712', gpsLat: 27.42946081, gpsLng: 83.91552096, validInterview: 0 },
    { id: 20, acCode: 1, pollingStationNo: '1_115', pollingStationName: '115. Prathamik Vidyalay, Nayagonv, Utri Bhag', pollingStationNameL2: '', gps: '27.169644365613625 84.05219319985092', gpsLat: 27.16964437, gpsLng: 84.0521932, validInterview: 0 }
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

  const handleViewGPSMap = (acCode: number, psCode: string) => {
    // Handle view GPS map logic here
    console.log('View GPS Map - AC Code:', acCode, 'PS Code:', psCode);
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
            List of Master Poling Station
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

      {/* Master PS Table Card */}
      <Card className="p-6">
        <div className="card-header pb-0 mb-6">
          <div className="flex justify-between items-center">
            <Heading level={4} className="card-title mg-b-0">
              List of Master Poling Station
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
                  <th>Polling Station No</th>
                  <th>Polling Station Name</th>
                  <th>Polling Station Name L2</th>
                  <th>Gps</th>
                  <th>Gps Lat</th>
                  <th>Gps Lng</th>
                  <th>Valid Interview</th>
                  <th className="action-column">Actions</th>
                </tr>
              </thead>
              <tbody>
                {masterPSData.map((ps, index) => (
                  <tr key={ps.id}>
                    <td>{index + 1}</td>
                    <td>{ps.acCode}</td>
                    <td>{ps.pollingStationNo}</td>
                    <td>{ps.pollingStationName}</td>
                    <td>{ps.pollingStationNameL2}</td>
                    <td>{ps.gps}</td>
                    <td>{ps.gpsLat}</td>
                    <td>{ps.gpsLng}</td>
                    <td>{ps.validInterview}</td>
                    <td className="text-center">
                      <div className="flex gap-1">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleEditPS(ps.id)}
                          className="text-white bg-blue-500 hover:bg-blue-600 border-0"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewGPSMap(ps.acCode, ps.pollingStationNo)}
                          className="bg-teal-500 hover:bg-teal-600 text-white border-0"
                          title="GPS Map"
                        >
                          <Map className="w-4 h-4" />
                        </Button>
                      </div>
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
