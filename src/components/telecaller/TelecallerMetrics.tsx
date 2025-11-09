'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import { BarChart3, Phone, Clock, Users, TrendingUp, TrendingDown, Activity, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface PerformanceMetrics {
  number_status: {
    call_not_received_to_telecaller: number;
    ringing: number;
    not_ringing: number;
  };
  call_not_ring_status: {
    switch_off: number;
    number_not_reachable: number;
    number_does_not_exist: number;
    call_not_ring_no_response: number;
  };
  call_ring_status: {
    picked: number;
    did_not_picked: number;
    call_ring_no_response: number;
  };
  call_status: {
    continue: number;
    refuse_to_respond: number;
    call_back_later: number;
  };
  caller_performance: {
    total_callers: number;
    number_of_dials_attempted: number;
    number_of_calls_connected: number;
    total_talk_duration: string;
  };
  interview_metrics: {
    successful: number;
    terminated: number;
    incompleted: number;
    ineligible: number;
  };
  status_metrics: {
    tele_no_response: number;
    partial_system: number;
    partial_tele: number;
    submitted: number;
  };
  final_status: {
    pass: number;
    under_qc: number;
    qc_rejected: number;
    short_interview: number;
  };
}

export type TelecallerMetricsFilters = {
  telecaller?: string;
  acCode?: string;
  callingDates?: string;
  customDateFrom?: string;
  customDateTo?: string;
  telecallerStatus?: string;
};

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

function getDateRangeForAPI(dateValue?: string, customFrom?: string, customTo?: string) {
  if (dateValue === 'custom' && customFrom && customTo) {
    return { start_date: customFrom, end_date: customTo };
  }
  if (dateValue && dateValue !== 'custom') {
    const today = new Date();
    let startDate = '';
    let endDate = '';
    switch (dateValue) {
      case 'today':
        startDate = endDate = today.toISOString().split('T')[0];
        break;
      case 'yesterday': {
        const d = new Date(today);
        d.setDate(today.getDate() - 1);
        startDate = endDate = d.toISOString().split('T')[0];
        break;
      }
      case 'dby': {
        const d = new Date(today);
        d.setDate(today.getDate() - 2);
        startDate = endDate = d.toISOString().split('T')[0];
        break;
      }
      case 'l3': {
        const d = new Date(today);
        d.setDate(today.getDate() - 2);
        startDate = d.toISOString().split('T')[0];
        endDate = today.toISOString().split('T')[0];
        break;
      }
      case 'l7': {
        const d = new Date(today);
        d.setDate(today.getDate() - 6);
        startDate = d.toISOString().split('T')[0];
        endDate = today.toISOString().split('T')[0];
        break;
      }
      case 'l15': {
        const d = new Date(today);
        d.setDate(today.getDate() - 14);
        startDate = d.toISOString().split('T')[0];
        endDate = today.toISOString().split('T')[0];
        break;
      }
      case 'currentmonth': {
        const d = new Date(today.getFullYear(), today.getMonth(), 1);
        startDate = d.toISOString().split('T')[0];
        endDate = today.toISOString().split('T')[0];
        break;
      }
      default:
        break;
    }
    return { start_date: startDate, end_date: endDate };
  }
  return {} as Record<string, string>;
}

export default function TelecallerMetrics({ filters, trigger }: { filters?: TelecallerMetricsFilters; trigger?: number | string }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);

  // Build a stable query string from primitive filter fields
  const queryString = useMemo(() => {
    const p = new URLSearchParams();
    if (filters?.telecaller) p.append('teleform_user_id', filters.telecaller);
    if (filters?.acCode) p.append('ac_code', filters.acCode);
    if (filters?.telecallerStatus && filters.telecallerStatus !== '') {
      p.append('status', filters.telecallerStatus);
    }
    const dr = getDateRangeForAPI(filters?.callingDates, filters?.customDateFrom, filters?.customDateTo);
    Object.entries(dr).forEach(([k, v]) => {
      if (v) p.append(k, v);
    });
    return p.toString();
  }, [filters?.telecaller, filters?.acCode, filters?.telecallerStatus, filters?.callingDates, filters?.customDateFrom, filters?.customDateTo]);

  // Track last requested query to avoid duplicate calls (e.g., StrictMode double effect)
  const lastQueryRef = useRef<string>('');
  const abortRef = useRef<AbortController | null>(null);
  const lastTriggerRef = useRef<number | string | undefined>(undefined);

  useEffect(() => {
    // If a trigger is provided, only fetch when trigger changes
    const hasExternalTrigger = typeof trigger !== 'undefined';

    if (hasExternalTrigger) {
      if (lastTriggerRef.current === trigger) return; // no new trigger
      lastTriggerRef.current = trigger;
    } else {
      // No external trigger: debounce by query string
      if (lastQueryRef.current === queryString && metrics !== null) return;
    }

    // Abort any in-flight request
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

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
        const url = `${apiUrl}/api/cati/telecaller-metrics${queryString ? `?${queryString}` : ''}`;
        const res = await fetch(url, {
          headers: { accept: 'application/json', Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });
        const ct = res.headers.get('content-type');
        if (!ct || !ct.includes('application/json')) throw new Error('API not available');
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.message || 'Failed to fetch');
        setMetrics(json.data as PerformanceMetrics);
        // Mark this query as completed successfully when using query guard
        if (!hasExternalTrigger) {
          lastQueryRef.current = queryString;
        }
      } catch (e: any) {
        if (e?.name === 'AbortError') return; // ignore aborted requests
        setError(e?.message || 'Failed to fetch');
      } finally {
        setLoading(false);
      }
    };
    run();

    return () => {
      controller.abort();
    };
  }, [queryString, trigger]);

  const getValue = (value: any) => (value === null || value === undefined ? '—' : value);
  const formatDuration = (d?: string) => (d ? d : '00:00:00');

  return (
    <Card className="p-4 md:p-6">
      <div className="mb-8">
        <SectionHeader title="CALLER PERFORMANCE" icon={<Activity className="h-6 w-6 text-blue-600" />} />
        {loading || error ? (
          loading ? (
            <div className="text-center py-8">
              <i className="fa fa-spinner fa-spin text-3xl text-blue-600 mb-3"></i>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Loading metrics...</p>
            </div>
          ) : (
            <div className="text-center py-8 text-red-600"><Text>{error}</Text></div>
          )
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <MetricCard title="Total Callers" value={getValue(metrics?.caller_performance?.total_callers)} icon={<Users className="h-6 w-6 text-blue-600" />} color="border-blue-500" bgColor="bg-blue-500" />
            <MetricCard title="Number of Dials Attempted" value={getValue(metrics?.caller_performance?.number_of_dials_attempted)} icon={<Phone className="h-6 w-6 text-orange-600" />} color="border-orange-500" bgColor="bg-orange-500" />
            <MetricCard title="Number of Calls Connected" value={getValue(metrics?.caller_performance?.number_of_calls_connected)} icon={<Phone className="h-6 w-6 text-indigo-600" />} color="border-indigo-500" bgColor="bg-indigo-500" />
            <MetricCard title="Total Form Duration" value={formatDuration(metrics?.caller_performance?.total_talk_duration)} icon={<Clock className="h-6 w-6 text-emerald-600" />} color="border-emerald-500" bgColor="bg-emerald-500" />
          </div>
        )}
      </div>

      {!loading && !error && (
        <>
          <div className="mb-8">
            <SectionHeader title="NUMBER OF DIALS ATTEMPTED METRICS" icon={<BarChart3 className="h-6 w-6 text-blue-600" />} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <MetricCard title="Call Not Received to Telecaller" value={getValue(metrics?.number_status?.call_not_received_to_telecaller)} icon={<Phone className="h-6 w-6 text-gray-500" />} color="border-gray-400" bgColor="bg-gray-400" />
              <MetricCard title="Ringing" value={getValue(metrics?.number_status?.ringing)} icon={<Phone className="h-6 w-6 text-green-600" />} color="border-green-500" bgColor="bg-green-500" />
              <MetricCard title="Not Ringing" value={getValue(metrics?.number_status?.not_ringing)} icon={<Phone className="h-6 w-6 text-red-600" />} color="border-red-500" bgColor="bg-red-500" />
              <MetricCard title="No response by Telecaller" value={getValue(Math.max(0, (metrics?.caller_performance?.number_of_dials_attempted || 0) - (metrics?.number_status?.ringing || 0) - (metrics?.number_status?.not_ringing || 0) - (metrics?.number_status?.call_not_received_to_telecaller || 0)))} icon={<Phone className="h-6 w-6 text-gray-600" />} color="border-gray-600" bgColor="bg-gray-600" />
            </div>
          </div>

          <div className="mb-8">
            <SectionHeader title="NOT RINGING METRICS" icon={<TrendingDown className="h-6 w-6 text-red-600" />} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <MetricCard title="Switch Off" value={getValue(metrics?.call_not_ring_status?.switch_off)} icon={<Phone className="h-6 w-6 text-red-600" />} color="border-red-500" bgColor="bg-red-500" />
              <MetricCard title="Number Not Reachable" value={getValue(metrics?.call_not_ring_status?.number_not_reachable)} icon={<Phone className="h-6 w-6 text-red-600" />} color="border-red-500" bgColor="bg-red-500" />
              <MetricCard title="Number Does Not Exist" value={getValue(metrics?.call_not_ring_status?.number_does_not_exist)} icon={<Phone className="h-6 w-6 text-red-600" />} color="border-red-500" bgColor="bg-red-500" />
              <MetricCard title="No response by Telecaller" value={getValue(Math.max(0, (metrics?.number_status?.not_ringing || 0) - (metrics?.call_not_ring_status?.switch_off || 0) - (metrics?.call_not_ring_status?.number_not_reachable || 0) - (metrics?.call_not_ring_status?.number_does_not_exist || 0)))} icon={<Phone className="h-6 w-6 text-gray-600" />} color="border-gray-600" bgColor="bg-gray-600" />
            </div>
          </div>

          <div className="mb-8">
            <SectionHeader title="RINGING METRICS" icon={<TrendingUp className="h-6 w-6 text-green-600" />} />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
              <MetricCard title="Number of Calls Connected" value={getValue(metrics?.call_ring_status?.picked)} icon={<Phone className="h-6 w-6 text-green-600" />} color="border-green-500" bgColor="bg-green-500" />
              <MetricCard title="Number of Calls Not Connected" value={getValue(metrics?.call_ring_status?.did_not_picked)} icon={<Phone className="h-6 w-6 text-green-600" />} color="border-green-500" bgColor="bg-green-500" />
              <MetricCard title="No response by Telecaller" value={getValue(Math.max(0, (metrics?.number_status?.ringing || 0) - (metrics?.call_ring_status?.picked || 0) - (metrics?.call_ring_status?.did_not_picked || 0)))} icon={<Phone className="h-6 w-6 text-gray-600" />} color="border-gray-600" bgColor="bg-gray-600" />
            </div>
          </div>

          <div className="mb-8">
            <SectionHeader title="NUMBER OF CALLS CONNECTED METRICS" icon={<BarChart3 className="h-6 w-6 text-purple-600" />} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <MetricCard title="Call Continue" value={getValue(metrics?.call_status?.continue)} icon={<Phone className="h-6 w-6 text-blue-600" />} color="border-blue-500" bgColor="bg-blue-500" />
              <MetricCard title="Refuse to Respond" value={getValue(metrics?.call_status?.refuse_to_respond)} icon={<Phone className="h-6 w-6 text-amber-600" />} color="border-amber-500" bgColor="bg-amber-500" />
              <MetricCard title="Call Back Later" value={getValue(metrics?.call_status?.call_back_later)} icon={<Clock className="h-6 w-6 text-teal-600" />} color="border-teal-500" bgColor="bg-teal-500" />
              <MetricCard title="No response by Telecaller" value={getValue(Math.max(0, (metrics?.call_ring_status?.picked || 0) - (metrics?.call_status?.continue || 0) - (metrics?.call_status?.refuse_to_respond || 0) - (metrics?.call_status?.call_back_later || 0)))} icon={<Phone className="h-6 w-6 text-gray-600" />} color="border-gray-600" bgColor="bg-gray-600" />
            </div>
          </div>

          <div className="mb-8">
            <SectionHeader title="CALL CONTINUE METRICS" icon={<BarChart3 className="h-6 w-6 text-purple-600" />} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <MetricCard title="Completed" value={getValue(metrics?.interview_metrics?.successful)} icon={<TrendingUp className="h-6 w-6 text-cyan-600" />} color="border-cyan-500" bgColor="bg-cyan-500" />
              <MetricCard title="Terminated" value={getValue(metrics?.interview_metrics?.terminated)} icon={<TrendingDown className="h-6 w-6 text-fuchsia-600" />} color="border-fuchsia-500" bgColor="bg-fuchsia-500" />
              <MetricCard title="Incompleted" value={getValue(metrics?.interview_metrics?.incompleted)} icon={<TrendingDown className="h-6 w-6 text-sky-600" />} color="border-sky-500" bgColor="bg-sky-500" />
              <MetricCard title="Ineligible" value={getValue(metrics?.interview_metrics?.ineligible)} icon={<Phone className="h-6 w-6 text-gray-600" />} color="border-gray-600" bgColor="bg-gray-600" />
            </div>
          </div>

          <div className="mb-8">
            <SectionHeader title="FINAL STATUS" icon={<CheckCircle className="h-6 w-6 text-green-600" />} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <MetricCard title="Successful" value={getValue(metrics?.final_status?.pass)} icon={<CheckCircle className="h-6 w-6 text-green-600" />} color="border-green-500" bgColor="bg-green-500" />
              <MetricCard title="Under QC" value={getValue(metrics?.final_status?.under_qc)} icon={<Clock className="h-6 w-6 text-yellow-600" />} color="border-yellow-500" bgColor="bg-yellow-500" />
              <MetricCard title="QC Rejected" value={getValue(metrics?.final_status?.qc_rejected)} icon={<XCircle className="h-6 w-6 text-red-600" />} color="border-red-500" bgColor="bg-red-500" />
              <MetricCard title="Short Interview" value={getValue(metrics?.final_status?.short_interview)} icon={<AlertCircle className="h-6 w-6 text-orange-600" />} color="border-orange-500" bgColor="bg-orange-500" />
            </div>
          </div>
        </>
      )}
    </Card>
  );
}


