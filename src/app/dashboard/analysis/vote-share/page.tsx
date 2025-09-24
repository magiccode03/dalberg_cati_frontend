'use client';

import { useAppSelector } from '@/hooks/redux';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Download, Filter, RefreshCw } from 'lucide-react';

export default function VoteShareAnalysisPage() {
  const user = useAppSelector((state) => state.app.user);

  const breadcrumbItems = [
    { label: 'Home', href: '/dashboard' },
    { label: 'Analysis', href: '/dashboard/analysis' },
    { label: 'Vote Share Analysis', active: true }
  ];

  const voteShareData = [
    { party: 'BJP', votes: 45.2, seats: 125, color: 'bg-orange-500' },
    { party: 'RJD', votes: 28.7, seats: 78, color: 'bg-green-500' },
    { party: 'JDU', votes: 15.3, seats: 42, color: 'bg-blue-500' },
    { party: 'Congress', votes: 6.8, seats: 18, color: 'bg-red-500' },
    { party: 'Others', votes: 4.0, seats: 12, color: 'bg-gray-500' },
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Vote Share Analysis
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Comprehensive analysis of vote share distribution across parties
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Vote Share Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {voteShareData.map((party) => (
            <Card key={party.party} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {party.party}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {party.votes}%
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {party.seats} seats
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-full ${party.color} flex items-center justify-center`}>
                  <span className="text-white font-bold text-lg">
                    {party.party.charAt(0)}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Detailed Analysis Table */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Detailed Vote Share Breakdown
            </h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Party
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Vote Share
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Seats Won
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Vote Efficiency
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody>
                {voteShareData.map((party, index) => (
                  <tr key={party.party} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full ${party.color}`}></div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {party.party}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {party.votes}%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {party.seats}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {((party.seats / party.votes) * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className={`text-sm font-medium ${
                        index < 2 ? 'text-green-600 dark:text-green-400' : 
                        index < 4 ? 'text-yellow-600 dark:text-yellow-400' : 
                        'text-red-600 dark:text-red-400'
                      }`}>
                        {index < 2 ? '↗ Rising' : index < 4 ? '→ Stable' : '↘ Declining'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Chart Placeholder */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Vote Share Distribution Chart
          </h2>
          <div className="h-80 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">
              Chart component will be implemented here
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
