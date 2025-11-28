'use client';

import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import { BarChart3, CheckCircle, XCircle, Activity } from 'lucide-react';
import ACListModal from '@/components/modals/ACListModal';

const MetricCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  textColor?: string;
}> = ({ title, value, icon, color, bgColor, textColor = 'text-white' }) => (
  <div className={`${bgColor} rounded-lg p-3 md:p-4 border-l-4 ${color} shadow-sm hover:shadow-md transition-shadow`}>
    <div className="flex items-center justify-between">
      <div className="flex-1 min-w-0">
        <p className={`text-xs md:text-sm font-medium ${textColor} opacity-90 truncate`}>{title}</p>
        <p className={`text-lg md:text-2xl font-bold ${textColor} mt-1 break-all`}>{value}</p>
      </div>
      <div className={`p-2 md:p-3 rounded-full bg-white bg-opacity-20 flex-shrink-0 ml-2`}>
        {icon}
      </div>
    </div>
  </div>
);

const SectionHeader: React.FC<{ title: string; icon: React.ReactNode }> = ({ title, icon }) => (
  <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg flex-shrink-0">{icon}</div>
    <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
      {title}
    </Heading>
  </div>
);

export default function QCMetrics({ teleformUserId, ac_code }: {
  teleformUserId?: string | number, ac_code?: string | number;
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [topACs, setTopACs] = useState<any[]>([]);
  const [topACsLoading, setTopACsLoading] = useState<boolean>(false);
  const [topACsError, setTopACsError] = useState<string | null>(null);
  // No router usage, modal opens instead of navigation
  const [isAcListModalOpen, setIsAcListModalOpen] = useState(false);
                <Button variant="primary" size="sm" onClick={() => setIsAcListModalOpen(true)}>View All</Button>

  useEffect(() => {
    let mounted = true; 
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        if (!token) {
          setError('Authentication required');
          setLoading(false);
          return;
        }
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
        if (!process.env.NEXT_PUBLIC_API_URL) console.warn('NEXT_PUBLIC_API_URL is not set, falling back to http://localhost:4001');
        const params = new URLSearchParams();
        if (teleformUserId) params.append('teleform_user_id', teleformUserId.toString());
        if (ac_code) params.append('ac_code', ac_code.toString());
        const url = `${apiUrl}/api/cati/qc/totalrecordsqc${params.toString() ? `?${params.toString()}` : ''}`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        const result = await response.json();
        if (response.ok && result.success) {
          if (!mounted) return;
          setStats(result.data);
        } else {
          setError(result.message || 'Failed to fetch QC totals');
        }
      } catch (err: any) {
        console.error('Error fetching QC totals:', err);
        setError(err?.message || 'Failed to fetch QC totals');
      } finally {
        setLoading(false);
      }
    };
    run();
    return () => { mounted = false; };
  }, [teleformUserId, ac_code]);

  // Fetch top 10 ACs by total_not_assigned to show unassigned ACs
  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        setTopACsLoading(true);
        setTopACsError(null);
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        if (!token) {
          setTopACsError('Authentication required');
          setTopACsLoading(false);
          return;
        }
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
        if (!process.env.NEXT_PUBLIC_API_URL) console.warn('NEXT_PUBLIC_API_URL is not set, falling back to http://localhost:4001');
        const url = `${apiUrl}/api/cati/qc/ac-list?page=1&limit=10&sort_by=total_not_assigned&sort_order=DESC`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        const result = await response.json();
        if (response.ok && result.success) {
          if (!mounted) return;
          setTopACs(result.data || []);
        } else {
          setTopACsError(result.message || 'Failed to fetch top ACs');
        }
      } catch (err: any) {
        console.error('Error fetching top ACs:', err);
        setTopACsError(err?.message || 'Failed to fetch top ACs');
      } finally {
        setTopACsLoading(false);
      }
    };
    run();
    return () => { mounted = false; };
  }, []);

  return (
    <Card className="p-4 md:p-6 mb-4">
      <div className="mb-4">
        <SectionHeader title="QC METRICS" icon={<Activity className="h-6 w-6 text-blue-600" />} />
        {loading || error ? (
          loading ? (
            <div className="text-center py-4">
              <i className="fa fa-spinner fa-spin text-3xl text-blue-600 mb-3"></i>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Loading QC metrics...</p>
            </div>
          ) : (
            <div className="text-center py-4 text-red-600"><Text>{error}</Text></div>
          )
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
            <MetricCard title="Total Assigned" value={stats?.total_assigned ?? '—'} icon={<CheckCircle className="h-6 w-6 text-green-600" />} color="border-green-500" bgColor="bg-green-500" />
            <MetricCard title="Total Unassigned" value={stats?.total_unassigned ?? '—'} icon={<XCircle className="h-6 w-6 text-gray-600" />} color="border-gray-500" bgColor="bg-gray-500" />
            <MetricCard title="Total Pass" value={stats?.total_pass ?? '—'} icon={<CheckCircle className="h-6 w-6 text-green-600" />} color="border-green-500" bgColor="bg-green-500" />
            <MetricCard title="Total Fail" value={stats?.total_fail ?? '—'} icon={<XCircle className="h-6 w-6 text-red-600" />} color="border-red-500" bgColor="bg-red-500" />
            <MetricCard title="Total Pending" value={stats?.total_pending ?? '—'} icon={<BarChart3 className="h-6 w-6 text-orange-600" />} color="border-orange-500" bgColor="bg-orange-500" />
          </div>
        )}
      </div>
      {/* Top 10 Unassigned ACs */}
      <div className="mb-4">
        <SectionHeader title="Top 10 Unassigned ACs" icon={<BarChart3 className="h-6 w-6 text-blue-600" />} />
        {topACsLoading || topACsError ? (
          topACsLoading ? (
            <div className="text-center py-4">
              <i className="fa fa-spinner fa-spin text-3xl text-blue-600 mb-3"></i>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Loading top unassigned ACs...</p>
            </div>
          ) : (
            <div className="text-center py-4 text-red-600"><Text>{topACsError}</Text></div>
          )
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {topACs.map((ac) => (
              <div key={ac.ac_code} className="min-w-[180px] bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">{ac.ac_name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 rounded bg-gray-100 dark:bg-gray-700">#{ac.ac_code}</div>
                </div>
                <div className="grid grid-cols-1 gap-2 text-xs">
                  <div className="flex items-center gap-1"><span className="font-semibold text-red-700 dark:text-red-300">{ac.total_not_assigned ?? 0}</span></div>
                </div>
              </div>
            ))}
            {/* View All card */}
            <div className="min-w-[200px] flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <div className="text-sm md:text-base font-semibold mb-2">View All ACs</div>
                <Button variant="primary" size="sm" onClick={() => setIsAcListModalOpen(true)}>View All</Button>
              </div>
            </div>
          </div>
        )}
      </div>
      {isAcListModalOpen && (
        <ACListModal isOpen={isAcListModalOpen} onClose={() => setIsAcListModalOpen(false)} />
      )}
    </Card>
  );
}
