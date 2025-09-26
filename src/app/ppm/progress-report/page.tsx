'use client';

import { useState } from 'react';
import { ChevronRight, Search, Filter, Download, Eye, Edit, Trash2 } from 'lucide-react';

export default function ProgressReportPage() {
  const [searchForm, setSearchForm] = useState({
    stateTeams: '',
    ac: '',
    pollingStation: '',
    enumeratorId: '',
    interviewerId: '',
    serverId: '',
    deviceId: '',
    mobileNumber: '',
    interviewDate: '',
    status: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sample data for the progress report table
  const progressData = [
    {
      id: 1,
      serverId: 'SRV001',
      interviewDate: '2024-01-15',
      sampleType: 'Primary',
      acName: 'AC001 - Patna Central',
      psName: 'PS001 - Gandhi Maidan',
      deviceId: 'DEV001',
      interviewerId: 'INT001',
      audioQc: 'Completed',
      audioQcId: 'QC001',
      audioFailReason: 'None',
      qcOutcome: 'Passed',
      status: 'Completed',
      psImage: 'Available',
      selfieImage: 'Available',
      gender: 'Male',
      playAudio: 'Available',
      gpsMap: 'Available'
    },
    {
      id: 2,
      serverId: 'SRV002',
      interviewDate: '2024-01-16',
      sampleType: 'Secondary',
      acName: 'AC002 - Patna East',
      psName: 'PS002 - Rajendra Nagar',
      deviceId: 'DEV002',
      interviewerId: 'INT002',
      audioQc: 'Pending',
      audioQcId: 'QC002',
      audioFailReason: 'Audio Quality',
      qcOutcome: 'Failed',
      status: 'Under Review',
      psImage: 'Available',
      selfieImage: 'Available',
      gender: 'Female',
      playAudio: 'Available',
      gpsMap: 'Available'
    },
    {
      id: 3,
      serverId: 'SRV003',
      interviewDate: '2024-01-17',
      sampleType: 'Primary',
      acName: 'AC003 - Patna West',
      psName: 'PS003 - Kankarbagh',
      deviceId: 'DEV003',
      interviewerId: 'INT003',
      audioQc: 'Completed',
      audioQcId: 'QC003',
      audioFailReason: 'None',
      qcOutcome: 'Passed',
      status: 'Completed',
      psImage: 'Available',
      selfieImage: 'Available',
      gender: 'Male',
      playAudio: 'Available',
      gpsMap: 'Available'
    }
  ];

  const handleSearch = () => {
    // Handle search logic here
    console.log('Searching with:', searchForm);
  };

  const handleInputChange = (field: string, value: string) => {
    setSearchForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const totalPages = Math.ceil(progressData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = progressData.slice(startIndex, endIndex);

  return (
    <div className="main-content horizontal-content">
      <div className="container-fluid">
        {/* Breadcrumb */}
        <div className="row">
          <div className="col-12">
            <div className="page-title-box">
              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <a href="javascript: void(0);">PPM</a>
                  </li>
                  <li className="breadcrumb-item active">Progress Report</li>
                </ol>
              </div>
              <h4 className="page-title">Progress Report</h4>
            </div>
          </div>
        </div>

        {/* Search Form */}
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3">
                    <div className="mb-3">
                      <label className="form-label">Select State Teams</label>
                      <select 
                        className="form-select"
                        value={searchForm.stateTeams}
                        onChange={(e) => handleInputChange('stateTeams', e.target.value)}
                      >
                        <option value="">All State Teams</option>
                        <option value="bihar">Bihar</option>
                        <option value="jharkhand">Jharkhand</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="mb-3">
                      <label className="form-label">Select AC</label>
                      <select 
                        className="form-select"
                        value={searchForm.ac}
                        onChange={(e) => handleInputChange('ac', e.target.value)}
                      >
                        <option value="">All AC</option>
                        <option value="ac001">AC001 - Patna Central</option>
                        <option value="ac002">AC002 - Patna East</option>
                        <option value="ac003">AC003 - Patna West</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="mb-3">
                      <label className="form-label">Select Poling Station</label>
                      <select 
                        className="form-select"
                        value={searchForm.pollingStation}
                        onChange={(e) => handleInputChange('pollingStation', e.target.value)}
                      >
                        <option value="">All Poling Station</option>
                        <option value="ps001">PS001 - Gandhi Maidan</option>
                        <option value="ps002">PS002 - Rajendra Nagar</option>
                        <option value="ps003">PS003 - Kankarbagh</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="mb-3">
                      <label className="form-label">Select Enumerator ID</label>
                      <select 
                        className="form-select"
                        value={searchForm.enumeratorId}
                        onChange={(e) => handleInputChange('enumeratorId', e.target.value)}
                      >
                        <option value="">All Enumerator ID</option>
                        <option value="enum001">ENUM001</option>
                        <option value="enum002">ENUM002</option>
                        <option value="enum003">ENUM003</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-3">
                    <div className="mb-3">
                      <label className="form-label">Select Interviewer ID</label>
                      <select 
                        className="form-select"
                        value={searchForm.interviewerId}
                        onChange={(e) => handleInputChange('interviewerId', e.target.value)}
                      >
                        <option value="">All Interviewer ID</option>
                        <option value="int001">INT001</option>
                        <option value="int002">INT002</option>
                        <option value="int003">INT003</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="mb-3">
                      <label className="form-label">Server ID</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Enter Server ID"
                        value={searchForm.serverId}
                        onChange={(e) => handleInputChange('serverId', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="mb-3">
                      <label className="form-label">Device ID</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Enter Device ID"
                        value={searchForm.deviceId}
                        onChange={(e) => handleInputChange('deviceId', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="mb-3">
                      <label className="form-label">Mobile Number</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Enter Mobile Number"
                        value={searchForm.mobileNumber}
                        onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-3">
                    <div className="mb-3">
                      <label className="form-label">Interview Date</label>
                      <input 
                        type="date" 
                        className="form-control"
                        value={searchForm.interviewDate}
                        onChange={(e) => handleInputChange('interviewDate', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="mb-3">
                      <label className="form-label">Status</label>
                      <select 
                        className="form-select"
                        value={searchForm.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                      >
                        <option value="">All Status</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                        <option value="under_review">Under Review</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="mb-3">
                      <label className="form-label">&nbsp;</label>
                      <div className="d-grid">
                        <button 
                          type="button" 
                          className="btn btn-primary"
                          onClick={handleSearch}
                        >
                          <Search className="w-4 h-4 me-1" />
                          Search
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Report Table */}
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-centered table-striped dt-responsive nowrap w-100">
                    <thead className="table-light">
                      <tr>
                        <th>Server ID</th>
                        <th>Interview Date</th>
                        <th>Sample type</th>
                        <th>AC Name</th>
                        <th>PS Name</th>
                        <th>Device ID</th>
                        <th>Interviewer ID</th>
                        <th>Audio QC</th>
                        <th>Audio QC ID</th>
                        <th>Audio Fail Reason</th>
                        <th>QC Outcome</th>
                        <th>Status</th>
                        <th>PS Image</th>
                        <th>Selfie Image</th>
                        <th>Gender</th>
                        <th>Play Audio</th>
                        <th>GPS Map</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentData.map((item) => (
                        <tr key={item.id}>
                          <td>{item.serverId}</td>
                          <td>{item.interviewDate}</td>
                          <td>
                            <span className={`badge ${item.sampleType === 'Primary' ? 'bg-primary' : 'bg-secondary'}`}>
                              {item.sampleType}
                            </span>
                          </td>
                          <td>{item.acName}</td>
                          <td>{item.psName}</td>
                          <td>{item.deviceId}</td>
                          <td>{item.interviewerId}</td>
                          <td>
                            <span className={`badge ${item.audioQc === 'Completed' ? 'bg-success' : 'bg-warning'}`}>
                              {item.audioQc}
                            </span>
                          </td>
                          <td>{item.audioQcId}</td>
                          <td>{item.audioFailReason}</td>
                          <td>
                            <span className={`badge ${item.qcOutcome === 'Passed' ? 'bg-success' : 'bg-danger'}`}>
                              {item.qcOutcome}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${item.status === 'Completed' ? 'bg-success' : item.status === 'Under Review' ? 'bg-warning' : 'bg-danger'}`}>
                              {item.status}
                            </span>
                          </td>
                          <td>
                            <span className="badge bg-info">{item.psImage}</span>
                          </td>
                          <td>
                            <span className="badge bg-info">{item.selfieImage}</span>
                          </td>
                          <td>{item.gender}</td>
                          <td>
                            <span className="badge bg-info">{item.playAudio}</span>
                          </td>
                          <td>
                            <span className="badge bg-info">{item.gpsMap}</span>
                          </td>
                          <td>
                            <div className="btn-group" role="group">
                              <button type="button" className="btn btn-sm btn-outline-primary">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button type="button" className="btn btn-sm btn-outline-success">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button type="button" className="btn btn-sm btn-outline-danger">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="row">
                  <div className="col-sm-12 col-md-5">
                    <div className="dataTables_info">
                      Showing {startIndex + 1} to {Math.min(endIndex, progressData.length)} of {progressData.length} entries
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-7">
                    <div className="dataTables_paginate paging_simple_numbers">
                      <ul className="pagination pagination-rounded justify-content-end">
                        <li className={`paginate_button page-item previous ${currentPage === 1 ? 'disabled' : ''}`}>
                          <button 
                            className="page-link"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                          >
                            <i className="mdi mdi-chevron-left"></i>
                          </button>
                        </li>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                          <li key={page} className={`paginate_button page-item ${currentPage === page ? 'active' : ''}`}>
                            <button 
                              className="page-link"
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </button>
                          </li>
                        ))}
                        <li className={`paginate_button page-item next ${currentPage === totalPages ? 'disabled' : ''}`}>
                          <button 
                            className="page-link"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                          >
                            <i className="mdi mdi-chevron-right"></i>
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
