'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Button from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';

interface TableRow {
  // Zone/Region fields
  region_code?: number;
  region_name?: string;
  // District fields
  district_code?: number;
  district?: string;
  // PC fields
  pc_code?: number;
  pc_name?: string;
  // AC fields
  ac_code?: number;
  ac_name?: string;
  // PS fields
  polling_station_no?: string;
  polling_station_name?: string;
  // Common fields
  sample_target: number;
  valid_underqc_achived: number;
  progress_completion_per?: string;
  progress_status?: number;
  percentage_completion?: number;
}

interface ProgressTableProps {
  title: string;
  data: TableRow[];
  progressType: number;
  progressSubType: number;
  backUrl?: string;
  backLabel?: string;
  onRowClick?: (code: string) => void;
  columns: {
    code: { label: string; field: string };
    name: { label: string; field: string };
    pcName?: { label: string; field: string };
  };
}

export default function ProgressTable({
  title,
  data,
  progressType,
  progressSubType,
  backUrl,
  backLabel,
  onRowClick,
  columns,
}: ProgressTableProps) {
  const router = useRouter();

  const getStatus = (item: TableRow) => {
    if (item.progress_status !== undefined) {
      if (item.progress_status === 1) return { status: 'Completed', class: 'bg-green-100 text-green-800' };
      if (item.progress_status === 2) return { status: 'In Progress', class: 'bg-yellow-100 text-yellow-800' };
      return { status: 'Yet to Begin', class: 'bg-gray-100 text-gray-800' };
    } else if (item.percentage_completion !== undefined) {
      if (item.percentage_completion >= 100) return { status: 'Completed', class: 'bg-green-100 text-green-800' };
      if (item.percentage_completion >= 75) return { status: 'In Progress', class: 'bg-yellow-100 text-yellow-800' };
      return { status: 'Yet to Begin', class: 'bg-gray-100 text-gray-800' };
    }
    return { status: 'Unknown', class: 'bg-gray-100 text-gray-800' };
  };

  const handleRowClick = (item: TableRow) => {
    if (!onRowClick) return;
    
    const code = 
      item.region_code?.toString() ||
      item.district_code?.toString() ||
      item.pc_code?.toString() ||
      item.ac_code?.toString();
    
    if (code) {
      onRowClick(code);
    }
  };

  return (
    <div className="mt-8">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <Heading level={3} className="text-xl font-semibold">
            {title}
          </Heading>
          {backUrl && (
            <Button
              variant="outline"
              onClick={() => router.push(backUrl)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {backLabel || 'Back'}
            </Button>
          )}
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-3 text-left font-semibold">{columns.code.label}</th>
                <th className="border border-gray-300 p-3 text-left font-semibold">{columns.name.label}</th>
                {columns.pcName && (
                  <th className="border border-gray-300 p-3 text-left font-semibold">{columns.pcName.label}</th>
                )}
                <th className="border border-gray-300 p-3 text-center font-semibold">Target</th>
                <th className="border border-gray-300 p-3 text-center font-semibold">Achieved</th>
                <th className="border border-gray-300 p-3 text-center font-semibold">% Of Completion</th>
                <th className="border border-gray-300 p-3 text-center font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => {
                const statusInfo = getStatus(item);
                const key = item.polling_station_no || item.ac_code || item.district_code || item.region_code || item.pc_code || index;
                const completionPercentage = item.percentage_completion || parseFloat(item.progress_completion_per || '0');
                
                return (
                  <tr 
                    key={key} 
                    className={`hover:bg-gray-50 ${onRowClick ? 'cursor-pointer' : ''}`}
                    onClick={() => handleRowClick(item)}
                  >
                    <td className="border border-gray-300 p-3">
                      {String(item[columns.code.field as keyof TableRow] || '')}
                    </td>
                    <td className="border border-gray-300 p-3">
                      {String(item[columns.name.field as keyof TableRow] || '')}
                    </td>
                    {columns.pcName && (
                      <td className="border border-gray-300 p-3">
                        {String(item[columns.pcName.field as keyof TableRow] || '')}
                      </td>
                    )}
                    <td className="border border-gray-300 p-3 text-center">{item.sample_target}</td>
                    <td className="border border-gray-300 p-3 text-center">{item.valid_underqc_achived}</td>
                    <td className="border border-gray-300 p-3 text-center">{completionPercentage}%</td>
                    <td className="border border-gray-300 p-3 text-center">
                      <span className={`px-2 py-1 rounded text-sm ${statusInfo.class}`}>
                        {statusInfo.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

