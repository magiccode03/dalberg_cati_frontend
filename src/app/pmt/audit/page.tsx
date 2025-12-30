'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import PaginationStandard from '@/components/ui/PaginationStandard';
import { Search, Download } from 'lucide-react';

interface AuditRecord {
  id: number;
  serverId: string;
  serialNo: number;
  event: string;
  node: string;
  start: string;
  end: string;
  screenTime: number;
  screenTimeFormatted: string;
}

export default function AuditLogPage() {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    serverId: '',
    serialNo: '',
    event: '',
    node: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100;

  // Mock data for demonstration
  const mockAuditData: AuditRecord[] = [
    { id: 1, serverId: '188970', serialNo: 1, event: 'form start', node: '', start: '1743822034015', end: '', screenTime: 0, screenTimeFormatted: '00:00:00' },
    { id: 2, serverId: '188970', serialNo: 2, event: 'question', node: '/data/form_name', start: '1743822034016', end: '1743822034838', screenTime: 0, screenTimeFormatted: '00:00:00' },
    { id: 3, serverId: '188970', serialNo: 3, event: 'group questions', node: '/data/gp_sec_a/spd_sec_a_iden', start: '1743822034863', end: '1743822036117', screenTime: 2, screenTimeFormatted: '00:00:02' },
    { id: 4, serverId: '188970', serialNo: 4, event: 'question', node: '/data/gp_sec_a/gps', start: '1743822036160', end: '1743822044190', screenTime: 8, screenTimeFormatted: '00:00:08' },
    { id: 5, serverId: '188970', serialNo: 5, event: 'question', node: '/data/gp_sec_a/lot_no', start: '1743822044198', end: '1743822048667', screenTime: 4, screenTimeFormatted: '00:00:04' },
    { id: 6, serverId: '188970', serialNo: 6, event: 'question', node: '/data/gp_sec_a/ps_name', start: '1743822048677', end: '1743822146163', screenTime: 98, screenTimeFormatted: '00:01:38' },
    { id: 7, serverId: '188970', serialNo: 7, event: 'question', node: '/data/gp_sec_a/lot_no', start: '1743822146172', end: '1743822146939', screenTime: 0, screenTimeFormatted: '00:00:00' },
    { id: 8, serverId: '188970', serialNo: 8, event: 'question', node: '/data/gp_sec_a/ps_name', start: '1743822146947', end: '1743822298285', screenTime: 152, screenTimeFormatted: '00:02:32' },
    { id: 9, serverId: '188970', serialNo: 9, event: 'question', node: '/data/gp_sec_a/lot_no', start: '1743822298295', end: '1743822302140', screenTime: 4, screenTimeFormatted: '00:00:04' },
    { id: 10, serverId: '188970', serialNo: 10, event: 'question', node: '/data/gp_sec_a/ps_name', start: '1743822302149', end: '1743822327296', screenTime: 25, screenTimeFormatted: '00:00:25' },
    { id: 11, serverId: '188971', serialNo: 1, event: 'form start', node: '', start: '1743822936805', end: '', screenTime: 0, screenTimeFormatted: '00:00:00' },
    { id: 12, serverId: '188971', serialNo: 2, event: 'question', node: '/data/form_name', start: '1743822936807', end: '1743822937661', screenTime: 1, screenTimeFormatted: '00:00:01' },
    { id: 13, serverId: '188971', serialNo: 3, event: 'group questions', node: '/data/gp_sec_a/spd_sec_a_iden', start: '1743822937669', end: '1743822939453', screenTime: 2, screenTimeFormatted: '00:00:02' },
    { id: 14, serverId: '188971', serialNo: 4, event: 'question', node: '/data/gp_sec_a/gps', start: '1743822939493', end: '1743822946384', screenTime: 7, screenTimeFormatted: '00:00:07' },
    { id: 15, serverId: '188971', serialNo: 5, event: 'question', node: '/data/gp_sec_a/lot_no', start: '1743822946391', end: '1743822950505', screenTime: 4, screenTimeFormatted: '00:00:04' },
  ];

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching with filters:', filters);
  };

  const handleDownload = () => {
    // Implement download functionality
    console.log('Downloading audit data...');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Implement page change logic here
    console.log('Changing to page:', page);
  };

  if (user?.role !== 'pmt' && user?.role !== 'super_admin') {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-400">
            You do not have permission to access the Audit Log.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Audit Log
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View and search audit trail information for form interactions.
        </p>
      </div>

       {/* Search Form */}
       <Card className="mb-6">
           <form onSubmit={handleSearch}>
             <div className="flex flex-col lg:flex-row gap-4 items-end">
               <div className="flex-1">
                 <Input
                   type="text"
                   placeholder="Search by Server ID"
                   value={filters.serverId}
                   onChange={(e) => handleFilterChange('serverId', e.target.value)}
                 />
               </div>
               <div className="flex-1">
                 <Input
                   type="text"
                   placeholder="Search by Serial No"
                   value={filters.serialNo}
                   onChange={(e) => handleFilterChange('serialNo', e.target.value)}
                 />
               </div>
               <div className="flex-1">
                 <Input
                   type="text"
                   placeholder="Search by Event"
                   value={filters.event}
                   onChange={(e) => handleFilterChange('event', e.target.value)}
                 />
               </div>
               <div className="flex-1">
                 <Input
                   type="text"
                   placeholder="Search by Node"
                   value={filters.node}
                   onChange={(e) => handleFilterChange('node', e.target.value)}
                 />
               </div>
               <div>
                 <Button type="submit" variant="primary" className="flex items-center">
                   <Search className="h-4 w-4 mr-2" />
                   Search
                 </Button>
               </div>
             </div>
           </form>
       </Card>

      {/* Data Table */}
      <Card>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Audit Log</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
        <div className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">#</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Server ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <a href="#" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">Serial No</a>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <a href="#" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">Event</a>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <a href="#" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">Node</a>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <a href="#" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">Start</a>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <a href="#" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">End</a>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <a href="#" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">Screen Time</a>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Screen Time</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {mockAuditData.map((record, index) => (
                  <tr key={record.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800`}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {record.id}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {record.serverId}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {record.serialNo}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {record.event}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {record.node}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {record.start}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {record.end}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {record.screenTime}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {record.screenTimeFormatted}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <PaginationStandard
            currentPage={currentPage}
            totalPages={53804}
            totalItems={5380334}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </div>
      </Card>
    </div>
  );
}
