'use client';

import { useAppSelector } from '@/hooks/redux';
import Breadcrumb from '@/components/ui/Breadcrumb';

export default function DashboardPage() {
  const user = useAppSelector((state) => state.app.user);

  const breadcrumbItems = [
    { label: 'PMT', active: true }
  ];

  const performanceData = [
    { metric: 'Start Date', tillDate: '2025-04-05', yesterday: '' },
    { metric: 'End Date', tillDate: '2025-09-22', yesterday: '' },
    { metric: 'Total number of days pending', tillDate: '1', yesterday: '' },
    { metric: 'Total Sample to be achieved', tillDate: '12000', yesterday: '' },
    { metric: 'Field Status Report-Sample', tillDate: '', yesterday: '', isHeader: true },
    { metric: 'Total interviews conducted', tillDate: '105772', yesterday: '0' },
    { metric: 'Total Valid interviews', tillDate: '50025', yesterday: '0' },
    { metric: 'Balance sample to be achieved', tillDate: '-38025', yesterday: '12000' },
    { metric: 'Interviewers on field', tillDate: '657', yesterday: '0' },
    { metric: 'Quality Check Status', tillDate: '', yesterday: '', isHeader: true },
    { metric: 'GPS Check Pending', tillDate: '0', yesterday: '0' },
    { metric: 'Under QC', tillDate: '0', yesterday: '0' },
    { metric: 'Total rejections', tillDate: '55747', yesterday: '0' },
    { metric: 'due to auto checks (Short Interviews+ Repeated Numbers)', tillDate: '6020', yesterday: '0' },
    { metric: 'due to TBC', tillDate: '0', yesterday: '0' },
    { metric: 'due to GPS checks', tillDate: '0', yesterday: '0' },
    { metric: 'Interviews without phone numbers', tillDate: '0', yesterday: '0' },
    { metric: 'AC-wise Progress', tillDate: '', yesterday: '', isHeader: true },
    { metric: 'ACs yet to start', tillDate: '9', yesterday: '243' },
    { metric: 'ACs in progress', tillDate: '178', yesterday: '0' },
    { metric: 'ACs completed', tillDate: '56', yesterday: '0' },
    { metric: 'Polling Station Coverage', tillDate: '', yesterday: '', isHeader: true },
    { metric: 'Total Polling stations sampled', tillDate: '520', yesterday: '520' },
    { metric: 'Polling stations yet to start', tillDate: '-4154', yesterday: '520' },
    { metric: 'Polling stations in progress', tillDate: '3806', yesterday: '0' },
    { metric: 'Polling stations completed', tillDate: '4674', yesterday: '0' },
    { metric: 'Polling stations with excess sample achieved', tillDate: '693', yesterday: '693' },
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">PMT</h1>
        </div>

        {/* Performance Report Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="w-1/2 bg-blue-600 text-white font-semibold px-6 py-4 text-left">
                    Performance Report
                  </th>
                  <th className="w-1/4 bg-blue-600 text-white font-semibold px-6 py-4 text-right">
                    Till Date
                  </th>
                  <th className="w-1/4 bg-blue-600 text-white font-semibold px-6 py-4 text-right">
                    Yesterday
                  </th>
                </tr>
              </thead>
              <tbody>
                {performanceData.map((row, index) => (
                  <tr key={index} className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${row.isHeader ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                    <td className={`px-6 py-4 ${row.isHeader ? 'font-semibold text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-gray-100'}`}>
                      {row.metric}
                    </td>
                    <td className={`px-6 py-4 text-right ${row.isHeader ? 'font-semibold text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-gray-100'}`}>
                      {row.tillDate}
                    </td>
                    <td className={`px-6 py-4 text-right ${row.isHeader ? 'font-semibold text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-gray-100'}`}>
                      {row.yesterday}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
