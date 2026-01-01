'use client';

import React from 'react';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import {
  Phone,
  Users,
  Clock,
  TrendingUp,
  TrendingDown,
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
} from 'lucide-react';

/* ----------------------------- Types ----------------------------- */

interface TraderOutcomeMetricsData {
  call_status: {
    total_numbers: number;
    pending_for_calls: number;
    number_exhausted: number;
    into_form_filling: number;
    reschedule_interview: number;
    waiting_for_callback: number;
    call_droped: number;
    partial_submission: number;
    reject_interview:number;
    success:number;
  };

}

/* ------------------------ Reused Components ----------------------- */

const MetricCard: React.FC<{
  title: string;
  value: string | number;
  icon ?: React.ReactNode;
  color: string;
  bgColor: string;
}> = ({ title, value, icon, color, bgColor }) => (
  <div className={`${bgColor} rounded-lg p-3 md:p-4 border-l-4 ${color} shadow-sm`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs md:text-sm font-medium text-white/90">{title}</p>
        <p className="text-lg md:text-2xl font-bold text-white mt-1">{value}</p>
      </div>
      {/* <div className="p-2 md:p-3 rounded-full bg-white/20">{icon}</div> */}
    </div>
  </div>
);

const SectionHeader: React.FC<{ title: string; icon: React.ReactNode }> = ({
  title,
  icon,
}) => (
  <div className="flex items-center gap-0 mb-6">
    <div className="w-1 h-6 bg-yellow-600 mr-3"></div>
    <Heading level={4} className="text-lg font-semibold text-gray-900">
      {title}
    </Heading>
  </div>
);

/* -------------------------- Main Component ------------------------ */

export default function TraderOutcomeMetrics({
  data,
  loading,
  error,
}: {
  data?: TraderOutcomeMetricsData;
  loading?: boolean;
  error?: string | null;
}) {
  const getValue = (v?: number | string) =>
    v === null || v === undefined ? '—' : v;

  if (loading) {
    return (
      <Card className="p-6 text-center">
        <i className="fa fa-spinner fa-spin text-3xl text-blue-600 mb-3" />
        <Text className="text-gray-600">Loading trader metrics...</Text>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 text-center text-red-600">
        <Text>{error}</Text>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <Card className="p-4 md:p-6">
      {/* ---------------- Trader Overview ---------------- */}
      <div className="mb-8">
        <SectionHeader
          title="Call Dial Status"
          icon={<Activity className="h-6 w-6 text-blue-600" />}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          <MetricCard title="1. Total Numbers" value={getValue(data.call_status.total_numbers)} bgColor="bg-green-700" color="border-green-700" />
          <MetricCard title="2. Pending For Calls" value={getValue(data.call_status.pending_for_calls)} bgColor="bg-teal-800" color="border-teal-800" />
          <MetricCard title="3. Number Exhausted" value={getValue(data.call_status.number_exhausted)}  bgColor="bg-blue-900" color="border-blue-900" />
          <MetricCard title="4. Into Form Filling" value={getValue(data.call_status.into_form_filling)}  bgColor="bg-yellow-700" color="border-yellow-700" />
          <MetricCard title="5. Reschedule Interview" value={getValue(data.call_status.reschedule_interview)} bgColor="bg-green-600" color="border-green-600" />
          <MetricCard title="6. Waiting For Callback" value={getValue(data.call_status.waiting_for_callback)} bgColor="bg-yellow-800" color="border-yellow-800" />
          <MetricCard title="7. Call Droped:" value={getValue(data.call_status.call_droped)} bgColor="bg-red-600" color="border-red-600" />
          <MetricCard title="3.1. Partial Submission" value={getValue(data.call_status.partial_submission)}  bgColor="bg-yellow-800" color="border-yellow-800" />
          <MetricCard title="3.2. Reject Interview" value={getValue(data.call_status.reject_interview)} bgColor="bg-red-600" color="border-red-600" />
          <MetricCard title="3.3. Success" value={getValue(data.call_status.success)} bgColor="bg-green-700" color="border-green-700" />
        </div>
      </div>
    </Card>
  );
}
