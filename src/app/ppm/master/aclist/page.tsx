'use client';

import React, { useState } from 'react';
// import { Card } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
// import { Heading } from '@/components/ui/Heading';
// import { Text } from '@/components/ui/Text';
// import { Container } from '@/components/ui/Container';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
// import { Button } from '@/components/ui/Button';
// import { Select } from '@/components/ui/Select';

const ACListPage = () => {
  const [filters, setFilters] = useState({
    agencyId: '',
    acCode: '',
  });

  // Sample data for dropdowns
  const agencyOptions = [
    { value: '', label: 'Select State Teams' },
    { value: '1', label: 'Kadence' },
    { value: '2', label: 'Chandan' },
    { value: '3', label: 'Rohit' },
    { value: '4', label: 'Parbhat' },
    { value: '5', label: 'Navin' },
    { value: '6', label: 'Aeon' },
    { value: '7', label: 'Abhinav' },
    { value: '8', label: 'Inhouse' },
  ];

  const acOptions = [
    { value: '', label: 'Select AC' },
    { value: '1', label: 'Valmiki Nagar (1)' },
    { value: '2', label: 'Ramnagar (SC) (2)' },
    { value: '3', label: 'Narkatiaganj (3)' },
    { value: '4', label: 'Bagaha (4)' },
    { value: '5', label: 'Lauriya (5)' },
    { value: '6', label: 'Nautan (6)' },
    { value: '7', label: 'Chanpatia (7)' },
    { value: '8', label: 'Bettiah (8)' },
    { value: '9', label: 'Sikta (9)' },
    { value: '10', label: 'Raxaul (10)' },
    { value: '11', label: 'Sugauli (11)' },
    { value: '12', label: 'Narkatia (12)' },
    { value: '13', label: 'Harsidhi (SC) (13)' },
    { value: '14', label: 'Govindganj (14)' },
    { value: '15', label: 'Kesaria (15)' },
    { value: '16', label: 'Kalyanpur (16)' },
    { value: '17', label: 'Pipra (17)' },
    { value: '18', label: 'Madhuban (18)' },
    { value: '19', label: 'Motihari (19)' },
    { value: '20', label: 'Chiraia (20)' },
  ];

  // Sample AC data
  const acData = [
    {
      id: 1,
      acCode: 1,
      acName: 'Valmiki Nagar',
      agencyId: 4,
      agencyName: 'Parbhat',
      totalInterview: 330,
      validInterview: 310,
    },
    {
      id: 2,
      acCode: 2,
      acName: 'Ramnagar (SC)',
      agencyId: 4,
      agencyName: 'Parbhat',
      totalInterview: 395,
      validInterview: 346,
    },
    {
      id: 3,
      acCode: 3,
      acName: 'Narkatiaganj',
      agencyId: 4,
      agencyName: 'Parbhat',
      totalInterview: 400,
      validInterview: 315,
    },
    {
      id: 4,
      acCode: 4,
      acName: 'Bagaha',
      agencyId: 4,
      agencyName: 'Parbhat',
      totalInterview: 345,
      validInterview: 306,
    },
    {
      id: 5,
      acCode: 5,
      acName: 'Lauriya',
      agencyId: 4,
      agencyName: 'Parbhat',
      totalInterview: 462,
      validInterview: 337,
    },
    {
      id: 6,
      acCode: 6,
      acName: 'Nautan',
      agencyId: 4,
      agencyName: 'Parbhat',
      totalInterview: 408,
      validInterview: 326,
    },
    {
      id: 7,
      acCode: 7,
      acName: 'Chanpatia',
      agencyId: 4,
      agencyName: 'Parbhat',
      totalInterview: 388,
      validInterview: 314,
    },
    {
      id: 8,
      acCode: 8,
      acName: 'Bettiah',
      agencyId: 4,
      agencyName: 'Parbhat',
      totalInterview: 738,
      validInterview: 318,
    },
    {
      id: 9,
      acCode: 9,
      acName: 'Sikta',
      agencyId: 4,
      agencyName: 'Parbhat',
      totalInterview: 393,
      validInterview: 351,
    },
    {
      id: 10,
      acCode: 10,
      acName: 'Raxaul',
      agencyId: 4,
      agencyName: 'Parbhat',
      totalInterview: 447,
      validInterview: 325,
    },
    {
      id: 11,
      acCode: 11,
      acName: 'Sugauli',
      agencyId: 4,
      agencyName: 'Parbhat',
      totalInterview: 466,
      validInterview: 238,
    },
    {
      id: 12,
      acCode: 12,
      acName: 'Narkatia',
      agencyId: 4,
      agencyName: 'Parbhat',
      totalInterview: 325,
      validInterview: 303,
    },
    {
      id: 13,
      acCode: 13,
      acName: 'Harsidhi (SC)',
      agencyId: 8,
      agencyName: 'Inhouse',
      totalInterview: 361,
      validInterview: 171,
    },
    {
      id: 14,
      acCode: 14,
      acName: 'Govindganj',
      agencyId: 8,
      agencyName: 'Inhouse',
      totalInterview: 352,
      validInterview: 148,
    },
    {
      id: 15,
      acCode: 15,
      acName: 'Kesaria',
      agencyId: 1,
      agencyName: 'Kadence',
      totalInterview: 575,
      validInterview: 291,
    },
    {
      id: 16,
      acCode: 16,
      acName: 'Kalyanpur',
      agencyId: 8,
      agencyName: 'Inhouse',
      totalInterview: 518,
      validInterview: 192,
    },
    {
      id: 17,
      acCode: 17,
      acName: 'Pipra',
      agencyId: 8,
      agencyName: 'Inhouse',
      totalInterview: 573,
      validInterview: 189,
    },
    {
      id: 18,
      acCode: 18,
      acName: 'Madhuban',
      agencyId: 5,
      agencyName: 'Navin',
      totalInterview: 313,
      validInterview: 209,
    },
    {
      id: 19,
      acCode: 19,
      acName: 'Motihari',
      agencyId: 8,
      agencyName: 'Inhouse',
      totalInterview: 356,
      validInterview: 118,
    },
    {
      id: 20,
      acCode: 20,
      acName: 'Chiraia',
      agencyId: 2,
      agencyName: 'Chandan',
      totalInterview: 578,
      validInterview: 89,
    },
  ];

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
    console.log('Search filters:', filters);
  };

  return (
    <div className="main-content horizontal-content">
      <div className="main-container container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="breadcrumb-header justify-content-between">
          <div className="left-content">
            <h1 className="main-content-title mg-b-0 mg-b-lg-1 text-2xl font-bold text-gray-800">
              AC List
            </h1>
          </div>
          <div className="justify-content-center mt-2"></div>
          <div className="right-content">
            <span className="main-content-title mg-b-0 mg-b-lg-1"></span>
          </div>
        </div>

        {/* Search Form */}
        <div className="pb-device-ac-form mb-6">
          <form onSubmit={handleSearch} className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="row">
              <div className="form-group col-md-2">
                <select
                  className="form-select"
                  value={filters.agencyId}
                  onChange={(e) => handleFilterChange('agencyId', e.target.value)}
                >
                  {agencyOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group col-md-2">
                <select
                  className="form-select"
                  value={filters.acCode}
                  onChange={(e) => handleFilterChange('acCode', e.target.value)}
                >
                  {acOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group col-md-2">
                <button type="submit" className="btn btn-primary">
                  <i className="fa fa-search mr-1"></i>
                  Search
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* AC List Table */}
        <div className="row">
          <div className="col-xl-12">
            <div className="card shadow-sm bg-white rounded-lg border border-gray-200">
              <div className="card-header pb-0">
                <div className="d-flex justify-content-between">
                  <h4 className="card-title mg-b-0 text-lg font-semibold">
                    AC List
                  </h4>
                  <span className="text-end">
                    <button className="btn btn-primary ml-5">
                      Update Data Agency Wise
                    </button>
                  </span>
                </div>
              </div>
              <div className="card-body">
                <div className="summary mb-4">
                  <span className="text-sm text-gray-600">
                    Showing <strong>1-20</strong> of <strong>243</strong> items.
                  </span>
                </div>
                
                <div className="table-responsive">
                  <Table className="table table-bordered table-striped table-hover">
                    <thead className="sticky-header bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-gray-700">AC Code</th>
                        <th className="px-4 py-3 font-semibold text-gray-700">AC Name</th>
                        <th className="px-4 py-3 font-semibold text-gray-700">Agency ID</th>
                        <th className="px-4 py-3 font-semibold text-gray-700">Agency Name</th>
                        <th className="px-4 py-3 font-semibold text-gray-700">Total Interview</th>
                        <th className="px-4 py-3 font-semibold text-gray-700">Valid Interview</th>
                        <th className="px-4 py-3 font-semibold text-gray-700">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {acData.map((item, index) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 border-b border-gray-200 font-medium">
                            {item.acCode}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200">
                            {item.acName}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200">
                            {item.agencyId}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200">
                            {item.agencyName}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200 font-medium">
                            {item.totalInterview}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200 font-medium">
                            {item.validInterview}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-200">
                            <button
                              className="btn btn-info"
                              onClick={() => console.log(`Update Agency for AC ${item.acCode}`)}
                            >
                              Update Agency
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>

                {/* Pagination */}
                <nav className="pagination pagination-primary mg-sm-b-0 mt-4">
                  <ul className="pagination flex justify-center space-x-2">
                    <li className="page-item first disabled">
                      <a className="page-link px-3 py-2 bg-gray-100 text-gray-400 rounded cursor-not-allowed" tabIndex={-1}>
                        First
                      </a>
                    </li>
                    <li className="page-item prev disabled">
                      <a className="page-link px-3 py-2 bg-gray-100 text-gray-400 rounded cursor-not-allowed" tabIndex={-1}>
                        <span aria-hidden="true">«</span>
                      </a>
                    </li>
                    <li className="page-item active">
                      <a className="page-link px-3 py-2 bg-blue-600 text-white rounded">
                        1
                      </a>
                    </li>
                    <li className="page-item">
                      <a className="page-link px-3 py-2 bg-white text-blue-600 border border-gray-300 rounded hover:bg-gray-50">
                        2
                      </a>
                    </li>
                    <li className="page-item">
                      <a className="page-link px-3 py-2 bg-white text-blue-600 border border-gray-300 rounded hover:bg-gray-50">
                        3
                      </a>
                    </li>
                    <li className="page-item">
                      <a className="page-link px-3 py-2 bg-white text-blue-600 border border-gray-300 rounded hover:bg-gray-50">
                        4
                      </a>
                    </li>
                    <li className="page-item">
                      <a className="page-link px-3 py-2 bg-white text-blue-600 border border-gray-300 rounded hover:bg-gray-50">
                        5
                      </a>
                    </li>
                    <li className="page-item">
                      <a className="page-link px-3 py-2 bg-white text-blue-600 border border-gray-300 rounded hover:bg-gray-50">
                        6
                      </a>
                    </li>
                    <li className="page-item">
                      <a className="page-link px-3 py-2 bg-white text-blue-600 border border-gray-300 rounded hover:bg-gray-50">
                        7
                      </a>
                    </li>
                    <li className="page-item">
                      <a className="page-link px-3 py-2 bg-white text-blue-600 border border-gray-300 rounded hover:bg-gray-50">
                        8
                      </a>
                    </li>
                    <li className="page-item">
                      <a className="page-link px-3 py-2 bg-white text-blue-600 border border-gray-300 rounded hover:bg-gray-50">
                        9
                      </a>
                    </li>
                    <li className="page-item">
                      <a className="page-link px-3 py-2 bg-white text-blue-600 border border-gray-300 rounded hover:bg-gray-50">
                        10
                      </a>
                    </li>
                    <li className="page-item next">
                      <a className="page-link px-3 py-2 bg-white text-blue-600 border border-gray-300 rounded hover:bg-gray-50">
                        <span aria-hidden="true">»</span>
                      </a>
                    </li>
                    <li className="page-item last">
                      <a className="page-link px-3 py-2 bg-white text-blue-600 border border-gray-300 rounded hover:bg-gray-50">
                        Last
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ACListPage;
