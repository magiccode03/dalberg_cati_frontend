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

interface MasterAC {
  id: number;
  acCode: number;
  acName: string;
  districtCode: number;
  districtName: string;
  pcName: string;
  pcCode: number;
  zoneCode: number;
  zoneName: string;
  currentMla: string;
  agency: string;
}

export default function MasterACPage() {
  const [acName, setAcName] = useState('');
  const [acCode, setAcCode] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);

  // Sample data for Master AC (20 items as shown in HTML)
  const masterACData: MasterAC[] = [
    { id: 1, acCode: 0, acName: 'Bihar', districtCode: 0, districtName: 'Bihar', pcName: 'Bihar', pcCode: 0, zoneCode: 0, zoneName: 'Bihar', currentMla: 'Bihar', agency: '' },
    { id: 2, acCode: 1, acName: 'Valmiki Nagar', districtCode: 1, districtName: 'Pashchim Champaran', pcName: 'Valmiki Nagar', pcCode: 1, zoneCode: 53, zoneName: 'Tirhut', currentMla: 'Dhirendra Pratap Singh Alias Rinku Singh', agency: 'Parbhat' },
    { id: 3, acCode: 2, acName: 'Ramnagar (SC)', districtCode: 1, districtName: 'Pashchim Champaran', pcName: 'Valmiki Nagar', pcCode: 1, zoneCode: 53, zoneName: 'Tirhut', currentMla: 'Bhagirathi Devi', agency: 'Parbhat' },
    { id: 4, acCode: 3, acName: 'Narkatiaganj', districtCode: 1, districtName: 'Pashchim Champaran', pcName: 'Valmiki Nagar', pcCode: 1, zoneCode: 53, zoneName: 'Tirhut', currentMla: 'Rashmi Varma', agency: 'Parbhat' },
    { id: 5, acCode: 4, acName: 'Bagaha', districtCode: 1, districtName: 'Pashchim Champaran', pcName: 'Valmiki Nagar', pcCode: 1, zoneCode: 53, zoneName: 'Tirhut', currentMla: 'Ram Singh', agency: 'Parbhat' },
    { id: 6, acCode: 5, acName: 'Lauriya', districtCode: 1, districtName: 'Pashchim Champaran', pcName: 'Valmiki Nagar', pcCode: 1, zoneCode: 53, zoneName: 'Tirhut', currentMla: 'Vinay Bihari', agency: 'Parbhat' },
    { id: 7, acCode: 6, acName: 'Nautan', districtCode: 1, districtName: 'Pashchim Champaran', pcName: 'Paschim Champaran', pcCode: 2, zoneCode: 53, zoneName: 'Tirhut', currentMla: 'Narayan Prasad', agency: 'Parbhat' },
    { id: 8, acCode: 7, acName: 'Chanpatia', districtCode: 1, districtName: 'Pashchim Champaran', pcName: 'Paschim Champaran', pcCode: 2, zoneCode: 53, zoneName: 'Tirhut', currentMla: 'Umakant Singh', agency: 'Parbhat' },
    { id: 9, acCode: 8, acName: 'Bettiah', districtCode: 1, districtName: 'Pashchim Champaran', pcName: 'Paschim Champaran', pcCode: 2, zoneCode: 53, zoneName: 'Tirhut', currentMla: 'Renu Devi', agency: 'Parbhat' },
    { id: 10, acCode: 9, acName: 'Sikta', districtCode: 1, districtName: 'Pashchim Champaran', pcName: 'Valmiki Nagar', pcCode: 1, zoneCode: 53, zoneName: 'Tirhut', currentMla: 'Birendra Prasad Gupta', agency: 'Parbhat' },
    { id: 11, acCode: 10, acName: 'Raxaul', districtCode: 2, districtName: 'Purba Champaran', pcName: 'Paschim Champaran', pcCode: 2, zoneCode: 53, zoneName: 'Tirhut', currentMla: 'Pramod Kumar Sinha', agency: 'Parbhat' },
    { id: 12, acCode: 11, acName: 'Sugauli', districtCode: 2, districtName: 'Purba Champaran', pcName: 'Paschim Champaran', pcCode: 2, zoneCode: 53, zoneName: 'Tirhut', currentMla: 'Er. Shashi Bhushan Singh', agency: 'Parbhat' },
    { id: 13, acCode: 12, acName: 'Narkatia', districtCode: 2, districtName: 'Purba Champaran', pcName: 'Paschim Champaran', pcCode: 2, zoneCode: 53, zoneName: 'Tirhut', currentMla: 'Shamim Ahmad', agency: 'Parbhat' },
    { id: 14, acCode: 13, acName: 'Harsidhi (SC)', districtCode: 2, districtName: 'Purba Champaran', pcName: 'Purvi Champaran', pcCode: 3, zoneCode: 53, zoneName: 'Tirhut', currentMla: 'Krishnanandan Paswan', agency: 'Inhouse' },
    { id: 15, acCode: 14, acName: 'Govindganj', districtCode: 2, districtName: 'Purba Champaran', pcName: 'Purvi Champaran', pcCode: 3, zoneCode: 53, zoneName: 'Tirhut', currentMla: 'Sunil Mani Tiwari', agency: 'Inhouse' },
    { id: 16, acCode: 15, acName: 'Kesaria', districtCode: 2, districtName: 'Purba Champaran', pcName: 'Purvi Champaran', pcCode: 3, zoneCode: 53, zoneName: 'Tirhut', currentMla: 'Shalini Mishra', agency: 'Kadence' },
    { id: 17, acCode: 16, acName: 'Kalyanpur', districtCode: 2, districtName: 'Purba Champaran', pcName: 'Purvi Champaran', pcCode: 3, zoneCode: 53, zoneName: 'Tirhut', currentMla: 'Manoj Kumar Yadav', agency: 'Inhouse' },
    { id: 18, acCode: 17, acName: 'Pipra', districtCode: 2, districtName: 'Purba Champaran', pcName: 'Purvi Champaran', pcCode: 3, zoneCode: 53, zoneName: 'Tirhut', currentMla: 'Shyambabu Prasad Yadav', agency: 'Inhouse' },
    { id: 19, acCode: 18, acName: 'Madhuban', districtCode: 2, districtName: 'Purba Champaran', pcName: 'Sheohar', pcCode: 4, zoneCode: 53, zoneName: 'Tirhut', currentMla: 'Rana Randhir', agency: 'Navin' },
    { id: 20, acCode: 19, acName: 'Motihari', districtCode: 2, districtName: 'Purba Champaran', pcName: 'Purvi Champaran', pcCode: 3, zoneCode: 53, zoneName: 'Tirhut', currentMla: 'Pramod Kumar', agency: 'Inhouse' }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
    console.log('Search AC Name:', acName);
    console.log('Search AC Code:', acCode);
  };

  const handleDownloadAC = () => {
    // Handle download AC list logic here
    console.log('Download AC List');
  };

  const handleUploadAC = () => {
    // Handle upload AC list logic here
    console.log('Upload AC List');
  };

  const handleEditAC = (acCode: number) => {
    // Handle edit AC logic here
    console.log('Edit AC Code:', acCode);
  };

  const totalItems = 244; // Total items as shown in HTML (1-20 of 244)
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto p-6 main-container">
      {/* Breadcrumb Header */}
      <div className="breadcrumb-header justify-content-between mb-6">
        <div className="left-content">
          <Heading level={1} className="text-2xl font-bold mb-0">
            List of AC
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
              value={acName}
              onChange={(e) => setAcName(e.target.value)}
              placeholder="Search By AC Name"
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

      {/* Master AC Table Card */}
      <Card className="p-6">
        <div className="card-header pb-0 mb-6">
          <div className="flex justify-between items-center">
            <Heading level={4} className="card-title mg-b-0">
              List of AC
            </Heading>
            <div className="flex gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleDownloadAC}
              >
                <Download className="w-4 h-4 mr-2" />
                Download AC List
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleUploadAC}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload AC List
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
                  <th>Ac Name</th>
                  <th>District Code</th>
                  <th>District Name</th>
                  <th>Pc Name</th>
                  <th>Pc Code</th>
                  <th>Zone Code</th>
                  <th>Zone Name</th>
                  <th>Current Mla</th>
                  <th>Agency</th>
                  <th className="action-column">Actions</th>
                </tr>
              </thead>
              <tbody>
                {masterACData.map((ac, index) => (
                  <tr key={ac.id}>
                    <td>{index + 1}</td>
                    <td>{ac.acCode}</td>
                    <td>{ac.acName}</td>
                    <td>{ac.districtCode}</td>
                    <td>{ac.districtName}</td>
                    <td>{ac.pcName}</td>
                    <td>{ac.pcCode}</td>
                    <td>{ac.zoneCode}</td>
                    <td>{ac.zoneName}</td>
                    <td>{ac.currentMla}</td>
                    <td>{ac.agency}</td>
                    <td className="text-center">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleEditAC(ac.acCode)}
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
