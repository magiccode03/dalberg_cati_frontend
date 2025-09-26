'use client';

import React from 'react';
// import { Card } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
// import { Heading } from '@/components/ui/Heading';
// import { Text } from '@/components/ui/Text';
// import { Container } from '@/components/ui/Container';
// import { Button } from '@/components/ui/Button';
// import { Badge } from '@/components/ui/Badge';

const TeamRegistrationPage = () => {
  // Sample agency data
  const agencyData = [
    {
      id: 1,
      agencyId: 1,
      agencyName: 'Kadence',
      supervisorUsername: 'bhr2kadence',
      qcAgency: 'Internal (bhr2internalqc)',
      totalAc: 47,
      totalInterviewsConducted: 19916,
      valid: 9141,
      rejected: 10775,
      underQc: 0,
      showSecondLevelColumn: 'No',
      status: 'Active',
      reQcStatus: 'Disable',
    },
    {
      id: 2,
      agencyId: 2,
      agencyName: 'Chandan',
      supervisorUsername: 'bhr2chandan',
      qcAgency: 'Internal (bhr2internalqc)',
      totalAc: 56,
      totalInterviewsConducted: 27388,
      valid: 11527,
      rejected: 15861,
      underQc: 0,
      showSecondLevelColumn: 'No',
      status: 'Active',
      reQcStatus: 'Enable',
    },
    {
      id: 3,
      agencyId: 3,
      agencyName: 'Rohit',
      supervisorUsername: 'bhr2rohit',
      qcAgency: 'Internal (bhr2internalqc)',
      totalAc: 17,
      totalInterviewsConducted: 7164,
      valid: 4865,
      rejected: 2299,
      underQc: 0,
      showSecondLevelColumn: 'No',
      status: 'Active',
      reQcStatus: 'Enable',
    },
    {
      id: 4,
      agencyId: 4,
      agencyName: 'Parbhat',
      supervisorUsername: 'bhr2parbhat',
      qcAgency: 'Internal (bhr2internalqc)',
      totalAc: 37,
      totalInterviewsConducted: 16237,
      valid: 10348,
      rejected: 5889,
      underQc: 0,
      showSecondLevelColumn: 'No',
      status: 'Active',
      reQcStatus: 'Enable',
    },
    {
      id: 5,
      agencyId: 5,
      agencyName: 'Navin',
      supervisorUsername: 'bhr2navin',
      qcAgency: 'Internal (bhr2internalqc)',
      totalAc: 4,
      totalInterviewsConducted: 1227,
      valid: 831,
      rejected: 396,
      underQc: 0,
      showSecondLevelColumn: 'No',
      status: 'Active',
      reQcStatus: 'Enable',
    },
    {
      id: 6,
      agencyId: 6,
      agencyName: 'Aeon',
      supervisorUsername: 'bhr2aeon',
      qcAgency: 'Internal (bhr2internalqc)',
      totalAc: 8,
      totalInterviewsConducted: 4190,
      valid: 1744,
      rejected: 2446,
      underQc: 0,
      showSecondLevelColumn: 'No',
      status: 'Active',
      reQcStatus: 'Enable',
    },
    {
      id: 7,
      agencyId: 7,
      agencyName: 'Abhinav',
      supervisorUsername: 'abhinavbihar',
      qcAgency: 'Internal (bhr2internalqc)',
      totalAc: 5,
      totalInterviewsConducted: 1748,
      valid: 1023,
      rejected: 725,
      underQc: 0,
      showSecondLevelColumn: 'No',
      status: 'Active',
      reQcStatus: 'Enable',
    },
    {
      id: 8,
      agencyId: 8,
      agencyName: 'Inhouse',
      supervisorUsername: 'bhr2inhouse',
      qcAgency: 'Internal (bhr2internalqc)',
      totalAc: 69,
      totalInterviewsConducted: 30463,
      valid: 10546,
      rejected: 19917,
      underQc: 0,
      showSecondLevelColumn: 'Yes',
      status: 'Active',
      reQcStatus: 'Enable',
    },
  ];

  const getReQcStatusBadge = (status: string) => {
    switch (status) {
      case 'Enable':
        return <span className="badge bg-green-500 text-white px-2 py-1 rounded-full text-xs">Enable</span>;
      case 'Disable':
        return <span className="badge bg-red-500 text-white px-2 py-1 rounded-full text-xs">Disable</span>;
      default:
        return <span className="badge bg-gray-500 text-white px-2 py-1 rounded-full text-xs">{status}</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <span className="badge bg-green-500 text-white px-2 py-1 rounded-full text-xs">Active</span>;
      case 'Inactive':
        return <span className="badge bg-red-500 text-white px-2 py-1 rounded-full text-xs">Inactive</span>;
      default:
        return <span className="badge bg-gray-500 text-white px-2 py-1 rounded-full text-xs">{status}</span>;
    }
  };

  return (
    <div className="main-content horizontal-content">
      <div className="main-container container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="breadcrumb-header justify-content-between">
          <div className="left-content">
            <h1 className="main-content-title mg-b-0 mg-b-lg-1 text-2xl font-bold text-gray-800">
              Agency List
            </h1>
          </div>
          <div className="justify-content-center mt-2"></div>
          <div className="right-content">
            <span className="main-content-title mg-b-0 mg-b-lg-1"></span>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="row mb-6">
          <div className="col-md-3">
            <div className="card bg-purple-600 text-white shadow-lg rounded-lg border border-gray-200">
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <div className="mt-0 text-center">
                      <h3 className="text-white mb-0 text-lg font-semibold">
                        Total Interview
                      </h3>
                    </div>
                    <div className="pb-0 mt-2 text-center">
                      <h4 className="text-white font-weight-semibold mb-0 text-2xl">
                        1,08,333
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-green-600 text-white shadow-lg rounded-lg border border-gray-200">
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <div className="mt-0 text-center">
                      <h3 className="text-white mb-0 text-lg font-semibold">
                        Valid Interview
                      </h3>
                    </div>
                    <div className="pb-0 mt-2 text-center">
                      <h4 className="text-white font-weight-semibold mb-0 text-2xl">
                        50,025
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-red-600 text-white shadow-lg rounded-lg border border-gray-200">
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <div className="mt-0 text-center">
                      <h3 className="text-white mb-0 text-lg font-semibold">
                        Reject Interview
                      </h3>
                    </div>
                    <div className="pb-0 mt-2 text-center">
                      <h4 className="text-white font-weight-semibold mb-0 text-2xl">
                        58,308
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-blue-600 text-white shadow-lg rounded-lg border border-gray-200">
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <div className="mt-0 text-center">
                      <h3 className="text-white mb-0 text-lg font-semibold">
                        Interview Under QC
                      </h3>
                    </div>
                    <div className="pb-0 mt-2 text-center">
                      <h4 className="text-white font-weight-semibold mb-0 text-2xl">
                        0
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Agency List Table */}
        <div className="row">
          <div className="col-xl-12">
            <div className="card shadow-sm bg-white rounded-lg border border-gray-200">
              <div className="card-header pb-0">
                <div className="d-flex justify-content-between">
                  <h4 className="card-title mg-b-0 text-lg font-semibold">
                    Agency List
                  </h4>
                  <span className="text-end">
                    <button className="btn btn-primary ml-5">
                      <i className="fa fa-plus mr-2"></i>
                      New Agency
                    </button>
                  </span>
                </div>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <div className="summary mb-4">
                    <span className="text-sm text-gray-600">
                      Total <strong>8</strong> items.
                    </span>
                  </div>
                  
                  <Table className="table table-vcenter text-nowrap table-bordered border-bottom">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-gray-700">Agency ID</th>
                        <th className="px-4 py-3 font-semibold text-gray-700">Agency Name</th>
                        <th className="px-4 py-3 font-semibold text-gray-700">Supervisor Username</th>
                        <th className="px-4 py-3 font-semibold text-gray-700">QC Agency</th>
                        <th className="px-4 py-3 font-semibold text-gray-700">Total AC</th>
                        <th className="px-4 py-3 font-semibold text-gray-700">Total Interviews Conducted</th>
                        <th className="px-4 py-3 font-semibold text-gray-700">Valid</th>
                        <th className="px-4 py-3 font-semibold text-gray-700">Rejected</th>
                        <th className="px-4 py-3 font-semibold text-gray-700">Under QC</th>
                        <th className="px-4 py-3 font-semibold text-gray-700">
                          <a href="#" className="text-blue-600 hover:text-blue-800">
                            Show Second Level Column
                          </a>
                        </th>
                        <th className="px-4 py-3 font-semibold text-gray-700">Status</th>
                        <th className="px-4 py-3 font-semibold text-gray-700">Action</th>
                        <th className="px-4 py-3 font-semibold text-gray-700">Re-QC Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {agencyData.map((item, index) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 border-b border-gray-200 font-medium">
                            {item.agencyId}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200 font-medium">
                            {item.agencyName}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200">
                            {item.supervisorUsername}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200">
                            {item.qcAgency}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200 font-medium">
                            {item.totalAc}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200 font-medium">
                            {item.totalInterviewsConducted.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200 font-medium text-green-600">
                            {item.valid.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200 font-medium text-red-600">
                            {item.rejected.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200 font-medium">
                            {item.underQc}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200">
                            {item.showSecondLevelColumn}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200">
                            {getStatusBadge(item.status)}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200">
                            <button
                              className="btn btn-info"
                              onClick={() => console.log(`Update Agency ${item.agencyId}`)}
                            >
                              Update
                            </button>
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200">
                            <button
                              className={`btn ${item.reQcStatus === 'Enable' ? 'btn-success' : 'btn-danger'}`}
                              onClick={() => console.log(`${item.reQcStatus} Re-QC for Agency ${item.agencyId}`)}
                              title={`${item.reQcStatus} Re-QC for this agency`}
                            >
                              {item.reQcStatus}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamRegistrationPage;
