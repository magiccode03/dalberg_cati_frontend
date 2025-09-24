'use client';

import { useState } from 'react';
import Breadcrumb from '@/components/ui/Breadcrumb';
import DataTable, { Column } from '@/components/tables/DataTable';
import Button from '@/components/ui/Button';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

interface Agency {
  id: string;
  name: string;
  contact: string;
  email: string;
  status: 'Active' | 'Inactive' | 'Pending';
  surveys: number;
  completion: number;
  location: string;
  createdAt: string;
}

export default function AgenciesPage() {
  const [agencies, setAgencies] = useState<Agency[]>([
    {
      id: '1',
      name: 'Patna Research Agency',
      contact: '+91 9876543210',
      email: 'patna@agency.com',
      status: 'Active',
      surveys: 150,
      completion: 85,
      location: 'Patna, Bihar',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Muzaffarpur Data Solutions',
      contact: '+91 9876543211',
      email: 'muzaffarpur@agency.com',
      status: 'Active',
      surveys: 120,
      completion: 78,
      location: 'Muzaffarpur, Bihar',
      createdAt: '2024-01-20'
    },
    {
      id: '3',
      name: 'Gaya Survey Group',
      contact: '+91 9876543212',
      email: 'gaya@agency.com',
      status: 'Inactive',
      surveys: 90,
      completion: 65,
      location: 'Gaya, Bihar',
      createdAt: '2024-02-01'
    },
    {
      id: '4',
      name: 'Darbhanga Analytics',
      contact: '+91 9876543213',
      email: 'darbhanga@agency.com',
      status: 'Pending',
      surveys: 0,
      completion: 0,
      location: 'Darbhanga, Bihar',
      createdAt: '2024-02-10'
    },
    {
      id: '5',
      name: 'Bhagalpur Research Center',
      contact: '+91 9876543214',
      email: 'bhagalpur@agency.com',
      status: 'Active',
      surveys: 200,
      completion: 92,
      location: 'Bhagalpur, Bihar',
      createdAt: '2024-01-25'
    },
    {
      id: '6',
      name: 'Nalanda Data Hub',
      contact: '+91 9876543215',
      email: 'nalanda@agency.com',
      status: 'Active',
      surveys: 80,
      completion: 70,
      location: 'Nalanda, Bihar',
      createdAt: '2024-02-05'
    }
  ]);

  const breadcrumbItems = [
    { label: 'PMT System', href: '/dashboard/pmt' },
    { label: 'Agency List', active: true }
  ];

  const columns: Column<Agency>[] = [
    {
      key: 'name',
      label: 'Agency Name',
      sortable: true,
      filterable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{value}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{row.location}</div>
        </div>
      )
    },
    {
      key: 'contact',
      label: 'Contact',
      sortable: true,
      filterable: true,
      render: (value) => (
        <div>
          <div className="text-sm text-gray-900 dark:text-white">{value}</div>
        </div>
      )
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      filterable: true,
      render: (value) => (
        <div className="text-sm text-gray-600 dark:text-gray-400">{value}</div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      filterable: true,
      render: (value) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          value === 'Active' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
            : value === 'Inactive'
            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'surveys',
      label: 'Surveys',
      sortable: true,
      render: (value) => (
        <div className="text-center">
          <div className="font-medium text-gray-900 dark:text-white">{value}</div>
        </div>
      )
    },
    {
      key: 'completion',
      label: 'Completion %',
      sortable: true,
      render: (value) => (
        <div className="text-center">
          <div className="font-medium text-gray-900 dark:text-white">{value}%</div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${value}%` }}
            ></div>
          </div>
        </div>
      )
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (value) => (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {new Date(value).toLocaleDateString()}
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleView(row)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(row)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  const handleView = (agency: Agency) => {
    console.log('View agency:', agency);
    // Implement view functionality
  };

  const handleEdit = (agency: Agency) => {
    console.log('Edit agency:', agency);
    // Implement edit functionality
  };

  const handleDelete = (agency: Agency) => {
    console.log('Delete agency:', agency);
    // Implement delete functionality
  };

  const handleAddAgency = () => {
    console.log('Add new agency');
    // Implement add functionality
  };

  const handleExport = () => {
    console.log('Export agencies');
    // Implement export functionality
  };

  const handleRefresh = () => {
    console.log('Refresh agencies');
    // Implement refresh functionality
  };

  const handleRowClick = (agency: Agency) => {
    console.log('Row clicked:', agency);
    // Implement row click functionality
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Agency List</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage survey agencies and their performance
          </p>
        </div>
        <Button onClick={handleAddAgency}>
          <Plus className="h-4 w-4 mr-2" />
          Add Agency
        </Button>
      </div>

      {/* Data Table */}
      <DataTable
        data={agencies}
        columns={columns}
        title="Survey Agencies"
        searchable
        sortable
        filterable
        pagination
        pageSize={10}
        onRowClick={handleRowClick}
        onExport={handleExport}
        onRefresh={handleRefresh}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {agencies.length}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Agencies</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">
              {agencies.filter(a => a.status === 'Active').length}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Active Agencies</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {agencies.reduce((sum, a) => sum + a.surveys, 0)}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Surveys</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {Math.round(agencies.reduce((sum, a) => sum + a.completion, 0) / agencies.length)}%
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Avg Completion</p>
          </div>
        </div>
      </div>
    </div>
  );
}
