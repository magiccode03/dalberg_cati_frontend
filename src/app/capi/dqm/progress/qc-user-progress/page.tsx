'use client';

import { useState } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import SelectDropdown from '@/components/ui/SelectDropdown';
import { Table } from '@/components/ui/Table';
import { Search, Download, ExternalLink } from 'lucide-react';

interface QCUserProgressData {
  id: number;
  callerName: string;
  qcId: number;
  audioQcCompleted: number;
  audioQcPass: number;
  audioQcFail: number;
}

export default function QCUserProgressPage() {
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    qcId: '',
    telecallerStatus: '1', // Default to Active
    reportType: 'summary', // Default to Summary
  });

  // Generate date options for the last 6 months
  const generateDateOptions = () => {
    const options = [{ value: '', label: 'Select a Start Date' }];
    const today = new Date();
    
    for (let i = 0; i < 180; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      options.push({ value: dateString, label: dateString });
    }
    
    return options;
  };

  // Generate QC User options
  const generateQCUserOptions = () => {
    return [
      { value: '', label: 'Select User' },
      { value: '101', label: 'Komal (101)' },
      { value: '102', label: 'Priyanshi (102)' },
      { value: '103', label: 'Sonu Kumari (103)' },
      { value: '104', label: 'Varsha (104)' },
      { value: '105', label: 'Simran (105)' },
      { value: '106', label: 'Swati (106)' },
      { value: '108', label: 'Seema (108)' },
      { value: '109', label: 'Kundan (109)' },
      { value: '110', label: 'Nishant (110)' },
      { value: '111', label: 'Shilpa (111)' },
      { value: '112', label: 'Priya (112)' },
      { value: '113', label: 'Kajal Jha (113)' },
      { value: '114', label: 'Khushbu (114)' },
      { value: '115', label: 'Sanjivani Rai (115)' },
      { value: '116', label: 'Sabha Hijab (116)' },
      { value: '117', label: 'Riya (117)' },
      { value: '118', label: 'Sanjivani Rai (118)' },
      { value: '119', label: 'Mohd Usman (119)' },
      { value: '120', label: 'Supriya (120)' },
      { value: '121', label: 'Ashifa (121)' },
      { value: '122', label: 'Rama (122)' },
      { value: '123', label: 'Preeti (123)' },
      { value: '124', label: 'Priya (124)' },
      { value: '125', label: 'Sanjivani Rai (125)' },
      { value: '126', label: 'Radha Rani (126)' },
      { value: '127', label: 'Faizal Saifi (127)' },
      { value: '128', label: 'Kumudmessey (128)' },
      { value: '129', label: 'Ananya (129)' },
      { value: '130', label: 'Himanshi (130)' },
      { value: '135', label: 'Parveen Sharma (135)' },
      { value: '136', label: 'Muskan (136)' },
      { value: '137', label: 'Muskan Siddiqui (137)' },
      { value: '138', label: 'Aman Kumar (138)' },
      { value: '139', label: 'Himanshi-2 (139)' },
      { value: '140', label: 'Priyanka (140)' },
      { value: '201', label: 'Pinky (201)' },
      { value: '202', label: 'Renu (202)' },
      { value: '203', label: 'Sangeeta (203)' },
      { value: '204', label: 'Sanju (204)' },
      { value: '205', label: 'Khelan (205)' },
      { value: '206', label: 'Manish (206)' },
      { value: '999', label: 'Test User (999)' },
      { value: '1001', label: 'KARTICK (1001)' },
      { value: '1002', label: 'RUSHA DUTTA (1002)' },
      { value: '1003', label: 'APARNA MAJIMDER (1003)' },
      { value: '1004', label: 'DISHA NATH (1004)' },
      { value: '1005', label: 'PRITHIJIT (1005)' },
      { value: '1006', label: 'SHREYA MONDAL (1006)' },
      { value: '1007', label: 'DEBARATI AICH (1007)' },
      { value: '1008', label: 'SUSMITA HALDER (1008)' },
      { value: '1009', label: 'NANDITA GHOSH (1009)' },
      { value: '1010', label: 'RINKI ROY (1010)' },
      { value: '1011', label: 'RUKHSAR BEGUM (1011)' },
      { value: '1012', label: 'SHAMMA KHATOON (1012)' },
      { value: '1020', label: 'APARNA SINGH (1020)' },
      { value: '1021', label: 'PRIYANKA MONDAL (1021)' },
      { value: '1022', label: 'Priyanak Mondal (1022)' },
      { value: '2001', label: 'Vijay Sharma (2001)' },
      { value: '2002', label: 'Mehul Kapoor (2002)' },
      { value: '2003', label: 'Nishi (2003)' },
      { value: '2004', label: 'Asha Chaurasiya (2004)' },
      { value: '2005', label: 'Meenu Trivedi (2005)' },
      { value: '2006', label: 'Deepanjali Trivedi (2006)' },
      { value: '2007', label: 'Puja Pandey (2007)' },
      { value: '2008', label: 'Archana Singh (2008)' },
      { value: '2009', label: 'Seema (2009)' },
      { value: '2010', label: 'Shashi Tiwari (2010)' },
      { value: '2011', label: 'Sucharita Das (2011)' },
      { value: '2012', label: 'Srabani Mondal (2012)' },
      { value: '2013', label: 'Kiran Naskar (2013)' },
      { value: '2014', label: 'Mousimi Parida (2014)' },
      { value: '2015', label: 'Rohini Das (2015)' },
      { value: '2016', label: 'Dwipannita Sanyanal (2016)' },
      { value: '2017', label: 'Rupa Mondal (2017)' },
      { value: '2020', label: 'Pratishtha Mishra (2020)' },
    ];
  };

  // Sample data based on the provided HTML
  const qcUserProgressData: QCUserProgressData[] = [
    { id: 1, callerName: 'Kundan', qcId: 109, audioQcCompleted: 7252, audioQcPass: 3164, audioQcFail: 4088 },
    { id: 2, callerName: 'Riya', qcId: 117, audioQcCompleted: 2426, audioQcPass: 1516, audioQcFail: 910 },
    { id: 3, callerName: 'Mohd Usman', qcId: 119, audioQcCompleted: 2969, audioQcPass: 932, audioQcFail: 2037 },
    { id: 4, callerName: 'Supriya', qcId: 120, audioQcCompleted: 2121, audioQcPass: 1455, audioQcFail: 666 },
    { id: 5, callerName: 'Ashifa', qcId: 121, audioQcCompleted: 3426, audioQcPass: 2432, audioQcFail: 994 },
    { id: 6, callerName: 'Rama', qcId: 122, audioQcCompleted: 2932, audioQcPass: 1608, audioQcFail: 1324 },
    { id: 7, callerName: 'Faizal Saifi', qcId: 127, audioQcCompleted: 4109, audioQcPass: 2068, audioQcFail: 2041 },
    { id: 8, callerName: 'Kumudmessey', qcId: 128, audioQcCompleted: 3597, audioQcPass: 1636, audioQcFail: 1961 },
    { id: 9, callerName: 'Himanshi', qcId: 130, audioQcCompleted: 3076, audioQcPass: 884, audioQcFail: 2192 },
    { id: 10, callerName: 'Parveen Sharma', qcId: 135, audioQcCompleted: 0, audioQcPass: 0, audioQcFail: 0 },
    { id: 11, callerName: 'Muskan', qcId: 136, audioQcCompleted: 3250, audioQcPass: 1550, audioQcFail: 1700 },
    { id: 12, callerName: 'Muskan Siddiqui', qcId: 137, audioQcCompleted: 3583, audioQcPass: 1866, audioQcFail: 1717 },
    { id: 13, callerName: 'Himanshi-2', qcId: 139, audioQcCompleted: 3160, audioQcPass: 1627, audioQcFail: 1533 },
    { id: 14, callerName: 'Priyanka', qcId: 140, audioQcCompleted: 3030, audioQcPass: 1918, audioQcFail: 1112 },
    { id: 15, callerName: 'Priyanak Mondal', qcId: 1022, audioQcCompleted: 21, audioQcPass: 21, audioQcFail: 0 },
    { id: 16, callerName: 'Vijay Sharma', qcId: 2001, audioQcCompleted: 16, audioQcPass: 15, audioQcFail: 1 },
    { id: 17, callerName: 'Mehul Kapoor', qcId: 2002, audioQcCompleted: 280, audioQcPass: 222, audioQcFail: 58 },
    { id: 18, callerName: 'Nishi', qcId: 2003, audioQcCompleted: 1049, audioQcPass: 949, audioQcFail: 100 },
    { id: 19, callerName: 'Asha Chaurasiya', qcId: 2004, audioQcCompleted: 1056, audioQcPass: 944, audioQcFail: 112 },
    { id: 20, callerName: 'Meenu Trivedi', qcId: 2005, audioQcCompleted: 693, audioQcPass: 478, audioQcFail: 215 },
    { id: 21, callerName: 'Deepanjali Trivedi', qcId: 2006, audioQcCompleted: 179, audioQcPass: 136, audioQcFail: 43 },
    { id: 22, callerName: 'Puja Pandey', qcId: 2007, audioQcCompleted: 387, audioQcPass: 376, audioQcFail: 11 },
    { id: 23, callerName: 'Archana Singh', qcId: 2008, audioQcCompleted: 208, audioQcPass: 194, audioQcFail: 14 },
    { id: 24, callerName: 'Seema', qcId: 2009, audioQcCompleted: 164, audioQcPass: 144, audioQcFail: 20 },
    { id: 25, callerName: 'Shashi Tiwari', qcId: 2010, audioQcCompleted: 751, audioQcPass: 660, audioQcFail: 91 },
    { id: 26, callerName: 'Sucharita Das', qcId: 2011, audioQcCompleted: 956, audioQcPass: 745, audioQcFail: 211 },
    { id: 27, callerName: 'Srabani Mondal', qcId: 2012, audioQcCompleted: 685, audioQcPass: 439, audioQcFail: 246 },
    { id: 28, callerName: 'Kiran Naskar', qcId: 2013, audioQcCompleted: 589, audioQcPass: 381, audioQcFail: 208 },
    { id: 29, callerName: 'Mousimi Parida', qcId: 2014, audioQcCompleted: 919, audioQcPass: 545, audioQcFail: 374 },
    { id: 30, callerName: 'Rohini Das', qcId: 2015, audioQcCompleted: 956, audioQcPass: 674, audioQcFail: 282 },
    { id: 31, callerName: 'Dwipannita Sanyanal', qcId: 2016, audioQcCompleted: 854, audioQcPass: 407, audioQcFail: 447 },
    { id: 32, callerName: 'Rupa Mondal', qcId: 2017, audioQcCompleted: 700, audioQcPass: 614, audioQcFail: 86 },
    { id: 33, callerName: 'Pratishtha Mishra', qcId: 2020, audioQcCompleted: 584, audioQcPass: 547, audioQcFail: 37 },
  ];

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    // Implement search logic here
    console.log('Searching with filters:', filters);
  };

  const handleDownload = () => {
    // Implement download logic here
    console.log('Downloading data');
  };

  const handleViewDetail = (qcId: number) => {
    // Implement view detail logic here
    console.log('Viewing detail for QC ID:', qcId);
  };

  return (
    <div className="main-content horizontal-content">
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        {/* breadcrumb */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1">
            <Heading level={1} className="text-2xl font-semibold text-gray-900">
              QC User Progress
            </Heading>
          </div>
          <div className="flex-1"></div>
          <div className="flex-1">
            <span></span>
          </div>
        </div>
        {/* /breadcrumb */}

        {/* Search Form */}
        <div className="mb-6">
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="space-y-2">
                <SelectDropdown
                  value={filters.startDate}
                  onChange={(value) => handleFilterChange('startDate', value as string)}
                  options={generateDateOptions()}
                  placeholder="Select a Start Date"
                />
              </div>

              <div className="space-y-2">
                <SelectDropdown
                  value={filters.endDate}
                  onChange={(value) => handleFilterChange('endDate', value as string)}
                  options={generateDateOptions().map(option => ({
                    ...option,
                    label: option.value === '' ? 'Select a End Date' : option.label
                  }))}
                  placeholder="Select a End Date"
                />
              </div>

              <div className="space-y-2">
                <SelectDropdown
                  value={filters.qcId}
                  onChange={(value) => handleFilterChange('qcId', value as string)}
                  options={generateQCUserOptions()}
                  placeholder="Select User"
                />
              </div>

              <div className="space-y-2">
                <SelectDropdown
                  value={filters.telecallerStatus}
                  onChange={(value) => handleFilterChange('telecallerStatus', value as string)}
                  options={[
                    { value: '', label: 'Select QC User Status' },
                    { value: '1', label: 'Active' },
                    { value: '2', label: 'Inactive' },
                  ]}
                />
              </div>

              <div className="space-y-2">
                <SelectDropdown
                  value={filters.reportType}
                  onChange={(value) => handleFilterChange('reportType', value as string)}
                  options={[
                    { value: 'summary', label: 'Summary' },
                    { value: 'detail', label: 'Detail' },
                  ]}
                />
              </div>

              <div className="space-y-2">
                <Button
                  variant="primary"
                  onClick={handleSearch}
                  className="w-full"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* QC User Progress Table */}
        <div className="w-full">
          <Card className="p-0">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <Heading level={2} className="text-xl font-semibold text-gray-900">
                  Telecaller Progress Summary
                </Heading>
                <Button
                  variant="outline"
                  onClick={handleDownload}
                  className="text-blue-600 border-blue-600 hover:bg-blue-50"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <Table
                  striped
                  bordered
                  hover
                  className="w-full border-collapse"
                >
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Caller Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">QC ID</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">
                        Audio QC : <br />Completed
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">
                        Audio QC : <br />Pass
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">
                        Audio QC : <br />Fail
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {qcUserProgressData.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{user.callerName}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                          <button
                            onClick={() => handleViewDetail(user.qcId)}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {user.qcId}
                            <ExternalLink className="w-3 h-3 ml-1 inline" />
                          </button>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{user.audioQcCompleted.toLocaleString()}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{user.audioQcPass.toLocaleString()}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{user.audioQcFail.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* Table Footer */}
              <div className="flex justify-between items-center mt-4 px-6 py-4 border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Total <span className="font-semibold">{qcUserProgressData.length}</span> items.
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
}
