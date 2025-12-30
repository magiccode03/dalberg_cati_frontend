'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import DataTable from '@/components/tables/DataTable';
import { Download, FileText } from 'lucide-react';

interface QCReportData {
  rowLabels: string;
  completedInterviews: number;
  passed: number;
  rejected: number;
  rejectedAtQcAudioStatus: number;
  rejectOnNotMatchedLogic: number;
  rejectOnGender: number;
  rejectOnCaste: number;
  rejectOn2025PrefParty: number;
  rejectOn2020AEParty: number;
  rejectOn2024PEParty: number;
  rejectOnNotAskedLogic?: number; // Only for Re-QC report
  noAudio: number;
}

const qcFailData: QCReportData[] = [
  {
    rowLabels: 'Survey Conversation can be heard',
    completedInterviews: 63012,
    passed: 52600,
    rejected: 10412,
    rejectedAtQcAudioStatus: 0,
    rejectOnNotMatchedLogic: 3498,
    rejectOnGender: 586,
    rejectOnCaste: 3201,
    rejectOn2025PrefParty: 1093,
    rejectOn2020AEParty: 1280,
    rejectOn2024PEParty: 754,
    noAudio: 0,
  },
  {
    rowLabels: 'No Conversation',
    completedInterviews: 4548,
    passed: 0,
    rejected: 4548,
    rejectedAtQcAudioStatus: 4548,
    rejectOnNotMatchedLogic: 0,
    rejectOnGender: 0,
    rejectOnCaste: 0,
    rejectOn2025PrefParty: 0,
    rejectOn2020AEParty: 0,
    rejectOn2024PEParty: 0,
    noAudio: 1590,
  },
  {
    rowLabels: 'Irrelevant Conversation',
    completedInterviews: 2444,
    passed: 0,
    rejected: 2444,
    rejectedAtQcAudioStatus: 2375,
    rejectOnNotMatchedLogic: 0,
    rejectOnGender: 0,
    rejectOnCaste: 0,
    rejectOn2025PrefParty: 0,
    rejectOn2020AEParty: 0,
    rejectOn2024PEParty: 0,
    noAudio: 9,
  },
  {
    rowLabels: 'Interviewer acting as respondent',
    completedInterviews: 15420,
    passed: 0,
    rejected: 15420,
    rejectedAtQcAudioStatus: 15420,
    rejectOnNotMatchedLogic: 0,
    rejectOnGender: 0,
    rejectOnCaste: 0,
    rejectOn2025PrefParty: 0,
    rejectOn2020AEParty: 0,
    rejectOn2024PEParty: 0,
    noAudio: 0,
  },
  {
    rowLabels: 'Can hear the interviewer more than the respondent',
    completedInterviews: 2783,
    passed: 497,
    rejected: 2286,
    rejectedAtQcAudioStatus: 0,
    rejectOnNotMatchedLogic: 1883,
    rejectOnGender: 55,
    rejectOnCaste: 189,
    rejectOn2025PrefParty: 90,
    rejectOn2020AEParty: 60,
    rejectOn2024PEParty: 9,
    noAudio: 0,
  },
  {
    rowLabels: 'The interviewer is asking questions mechanically',
    completedInterviews: 2446,
    passed: 0,
    rejected: 2446,
    rejectedAtQcAudioStatus: 2446,
    rejectOnNotMatchedLogic: 0,
    rejectOnGender: 0,
    rejectOnCaste: 0,
    rejectOn2025PrefParty: 0,
    rejectOn2020AEParty: 0,
    rejectOn2024PEParty: 0,
    noAudio: 3,
  },
  {
    rowLabels: 'Grand Total',
    completedInterviews: 90653,
    passed: 53097,
    rejected: 37556,
    rejectedAtQcAudioStatus: 24789,
    rejectOnNotMatchedLogic: 5381,
    rejectOnGender: 641,
    rejectOnCaste: 3390,
    rejectOn2025PrefParty: 1183,
    rejectOn2020AEParty: 1340,
    rejectOn2024PEParty: 763,
    noAudio: 1602,
  },
];

const reQcFailData: QCReportData[] = [
  {
    rowLabels: 'Survey conversation can be heard',
    completedInterviews: 18168,
    passed: 16657,
    rejected: 1511,
    rejectedAtQcAudioStatus: 0,
    rejectOnNotMatchedLogic: 282,
    rejectOnGender: 43,
    rejectOnCaste: 372,
    rejectOn2025PrefParty: 174,
    rejectOn2020AEParty: 130,
    rejectOn2024PEParty: 77,
    rejectOnNotAskedLogic: 432,
    noAudio: 0,
  },
  {
    rowLabels: 'No Conversation',
    completedInterviews: 220,
    passed: 0,
    rejected: 220,
    rejectedAtQcAudioStatus: 220,
    rejectOnNotMatchedLogic: 0,
    rejectOnGender: 0,
    rejectOnCaste: 0,
    rejectOn2025PrefParty: 0,
    rejectOn2020AEParty: 0,
    rejectOn2024PEParty: 0,
    rejectOnNotAskedLogic: 0,
    noAudio: 4,
  },
  {
    rowLabels: 'Irrelevant conversation',
    completedInterviews: 190,
    passed: 0,
    rejected: 190,
    rejectedAtQcAudioStatus: 190,
    rejectOnNotMatchedLogic: 0,
    rejectOnGender: 0,
    rejectOnCaste: 0,
    rejectOn2025PrefParty: 0,
    rejectOn2020AEParty: 0,
    rejectOn2024PEParty: 0,
    rejectOnNotAskedLogic: 0,
    noAudio: 0,
  },
  {
    rowLabels: 'Interviewer acting as respondent',
    completedInterviews: 200,
    passed: 0,
    rejected: 200,
    rejectedAtQcAudioStatus: 200,
    rejectOnNotMatchedLogic: 0,
    rejectOnGender: 0,
    rejectOnCaste: 0,
    rejectOn2025PrefParty: 0,
    rejectOn2020AEParty: 0,
    rejectOn2024PEParty: 0,
    rejectOnNotAskedLogic: 0,
    noAudio: 0,
  },
  {
    rowLabels: 'Can hear the interviewer more than the respondent',
    completedInterviews: 244,
    passed: 19,
    rejected: 225,
    rejectedAtQcAudioStatus: 105,
    rejectOnNotMatchedLogic: 92,
    rejectOnGender: 2,
    rejectOnCaste: 9,
    rejectOn2025PrefParty: 11,
    rejectOn2020AEParty: 5,
    rejectOn2024PEParty: 1,
    rejectOnNotAskedLogic: 0,
    noAudio: 0,
  },
  {
    rowLabels: 'The interviewer is asking questions mechanically',
    completedInterviews: 118,
    passed: 0,
    rejected: 118,
    rejectedAtQcAudioStatus: 118,
    rejectOnNotMatchedLogic: 0,
    rejectOnGender: 0,
    rejectOnCaste: 0,
    rejectOn2025PrefParty: 0,
    rejectOn2020AEParty: 0,
    rejectOn2024PEParty: 0,
    rejectOnNotAskedLogic: 0,
    noAudio: 0,
  },
  {
    rowLabels: 'Grand Total',
    completedInterviews: 19140,
    passed: 16676,
    rejected: 2464,
    rejectedAtQcAudioStatus: 833,
    rejectOnNotMatchedLogic: 374,
    rejectOnGender: 45,
    rejectOnCaste: 381,
    rejectOn2025PrefParty: 185,
    rejectOn2020AEParty: 135,
    rejectOn2024PEParty: 78,
    rejectOnNotAskedLogic: 432,
    noAudio: 4,
  },
];

const qcColumns = [
  { key: 'rowLabels' as keyof QCReportData, label: 'Row Labels', sortable: false, render: (value: any, row: QCReportData) => (
    <span className={row.rowLabels === 'Grand Total' ? 'font-bold' : ''}>{value}</span>
  )},
  { key: 'completedInterviews' as keyof QCReportData, label: 'Completed Interviews', sortable: true, render: (value: number) => (
    <span className="text-right font-mono">{value.toLocaleString()}</span>
  )},
  { key: 'passed' as keyof QCReportData, label: 'Passed', sortable: true, render: (value: number) => (
    <span className="text-right font-mono">{value.toLocaleString()}</span>
  )},
  { key: 'rejected' as keyof QCReportData, label: 'Rejected', sortable: true, render: (value: number) => (
    <span className="text-right font-mono">{value.toLocaleString()}</span>
  )},
  { key: 'rejectedAtQcAudioStatus' as keyof QCReportData, label: 'Rejected at qc_audio_status', sortable: true, render: (value: number) => (
    <span className="text-right font-mono">{value.toLocaleString()}</span>
  )},
  { key: 'rejectOnNotMatchedLogic' as keyof QCReportData, label: 'Reject on Not Matched Logic', sortable: true, render: (value: number) => (
    <span className="text-right font-mono">{value.toLocaleString()}</span>
  )},
  { key: 'rejectOnGender' as keyof QCReportData, label: 'Reject on Gender', sortable: true, render: (value: number) => (
    <span className="text-right font-mono">{value.toLocaleString()}</span>
  )},
  { key: 'rejectOnCaste' as keyof QCReportData, label: 'Reject on Caste', sortable: true, render: (value: number) => (
    <span className="text-right font-mono">{value.toLocaleString()}</span>
  )},
  { key: 'rejectOn2025PrefParty' as keyof QCReportData, label: 'Reject on 2025 Pref party', sortable: true, render: (value: number) => (
    <span className="text-right font-mono">{value.toLocaleString()}</span>
  )},
  { key: 'rejectOn2020AEParty' as keyof QCReportData, label: 'Reject on 2020 AE party', sortable: true, render: (value: number) => (
    <span className="text-right font-mono">{value.toLocaleString()}</span>
  )},
  { key: 'rejectOn2024PEParty' as keyof QCReportData, label: 'Reject on 2024 PE party', sortable: true, render: (value: number) => (
    <span className="text-right font-mono">{value.toLocaleString()}</span>
  )},
  { key: 'noAudio' as keyof QCReportData, label: 'No Audio', sortable: true, render: (value: number) => (
    <span className="text-right font-mono">{value.toLocaleString()}</span>
  )},
];

const reQcColumns = [
  { key: 'rowLabels' as keyof QCReportData, label: 'Row Labels', sortable: false, render: (value: any, row: QCReportData) => (
    <span className={row.rowLabels === 'Grand Total' ? 'font-bold' : ''}>{value}</span>
  )},
  { key: 'completedInterviews' as keyof QCReportData, label: 'Completed Interviews', sortable: true, render: (value: number) => (
    <span className="text-right font-mono">{value.toLocaleString()}</span>
  )},
  { key: 'passed' as keyof QCReportData, label: 'Passed', sortable: true, render: (value: number) => (
    <span className="text-right font-mono">{value.toLocaleString()}</span>
  )},
  { key: 'rejected' as keyof QCReportData, label: 'Rejected', sortable: true, render: (value: number) => (
    <span className="text-right font-mono">{value.toLocaleString()}</span>
  )},
  { key: 'rejectedAtQcAudioStatus' as keyof QCReportData, label: 'Rejected at qc_audio_status', sortable: true, render: (value: number) => (
    <span className="text-right font-mono">{value.toLocaleString()}</span>
  )},
  { key: 'rejectOnNotMatchedLogic' as keyof QCReportData, label: 'Reject on Not Matched Logic', sortable: true, render: (value: number) => (
    <span className="text-right font-mono">{value.toLocaleString()}</span>
  )},
  { key: 'rejectOnGender' as keyof QCReportData, label: 'Reject on Gender', sortable: true, render: (value: number) => (
    <span className="text-right font-mono">{value.toLocaleString()}</span>
  )},
  { key: 'rejectOnCaste' as keyof QCReportData, label: 'Reject on Caste', sortable: true, render: (value: number) => (
    <span className="text-right font-mono">{value.toLocaleString()}</span>
  )},
  { key: 'rejectOn2025PrefParty' as keyof QCReportData, label: 'Reject on 2025 Pref party', sortable: true, render: (value: number) => (
    <span className="text-right font-mono">{value.toLocaleString()}</span>
  )},
  { key: 'rejectOn2020AEParty' as keyof QCReportData, label: 'Reject on 2020 AE party', sortable: true, render: (value: number) => (
    <span className="text-right font-mono">{value.toLocaleString()}</span>
  )},
  { key: 'rejectOn2024PEParty' as keyof QCReportData, label: 'Reject on 2024 PE party', sortable: true, render: (value: number) => (
    <span className="text-right font-mono">{value.toLocaleString()}</span>
  )},
  { key: 'rejectOnNotAskedLogic' as keyof QCReportData, label: 'Reject on Not Asked Logic more than 4', sortable: true, render: (value: number) => (
    <span className="text-right font-mono">{value.toLocaleString()}</span>
  )},
  { key: 'noAudio' as keyof QCReportData, label: 'No Audio', sortable: true, render: (value: number) => (
    <span className="text-right font-mono">{value.toLocaleString()}</span>
  )},
];

export default function QCFailReportPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleDownloadQC = () => {
    // Implement download functionality for QC report
    console.log('Download QC Report');
  };

  const handleDownloadReQC = () => {
    // Implement download functionality for Re-QC report
    console.log('Download Re-QC Report');
  };


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            QC Fail Report
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Quality Control failure analysis and reporting
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* QC Fail Report */}
          <div>
            <Card>
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    QC Fail Report
                  </h2>
                  <Button
                    variant="outline"
                    onClick={handleDownloadQC}
                    className="text-primary hover:text-primary-dark"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <DataTable
                    data={qcFailData}
                    columns={qcColumns}
                    loading={loading}
                    className="w-full"
                    searchable={false}
                    pagination={false}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Re-QC Fail Report */}
          <div>
            <Card>
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Re-QC Fail Report
                  </h2>
                  <Button
                    variant="outline"
                    onClick={handleDownloadReQC}
                    className="text-primary hover:text-primary-dark"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <DataTable
                    data={reQcFailData}
                    columns={reQcColumns}
                    loading={loading}
                    className="w-full"
                    searchable={false}
                    pagination={false}
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
