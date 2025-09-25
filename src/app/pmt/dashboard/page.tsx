'use client';

import React from 'react';
import Card from '@/components/ui/Card';

export default function PMTDashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          PMT Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Performance monitoring and field status reports
        </p>
      </div>

      <div className="row row-sm">
        <div className="col-xl-12">
          <Card>
            <div className="card-body">
              <div className="table-responsive">
                <table id="report" className="table table-bordered mg-b-0 text-md-nowrap">
                  <thead>
                    <tr>
                      <th className="fw-bold bg-primary text-white" style={{width: '50%'}}>
                        Performance Report
                      </th>
                      <th className="text-end bg-primary text-white" style={{width: '25%'}}>
                        Till Date
                      </th>
                      <th className="text-end bg-primary text-white" style={{width: '25%'}}>
                        Yesterday
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Start Date</td>
                      <td className="text-end">2025-04-05</td>
                      <td className="text-end"></td>
                    </tr>
                    <tr>
                      <td>End Date</td>
                      <td className="text-end">2025-09-25</td>
                      <td className="text-end"></td>
                    </tr>
                    <tr>
                      <td>Total number of days pending</td>
                      <td className="text-end">1</td>
                      <td className="text-end"></td>
                    </tr>
                    <tr>
                      <td>Total Sample to be achieved</td>
                      <td className="text-end">12000</td>
                      <td className="text-end"></td>
                    </tr>
                    <tr className="bg-primary text-white">
                      <th>Field Status Report-Sample</th>
                      <th></th>
                      <th></th>
                    </tr>
                    <tr>
                      <td>Total interviews conducted</td>
                      <td className="text-end">105772</td>
                      <td className="text-end">0</td>
                    </tr>
                    <tr>
                      <td>Total Valid interviews</td>
                      <td className="text-end">50025</td>
                      <td className="text-end">0</td>
                    </tr>
                    <tr>
                      <td>Balance sample to be achieved</td>
                      <td className="text-end">-38025</td>
                      <td className="text-end">12000</td>
                    </tr>
                    <tr>
                      <td>Interviewers on field</td>
                      <td className="text-end">657</td>
                      <td className="text-end">0</td>
                    </tr>

                    <tr className="bg-primary text-white">
                      <th>Quality Check Status</th>
                      <th></th>
                      <th></th>
                    </tr>
                    <tr>
                      <td>GPS Check Pending</td>
                      <td className="text-end">0</td>
                      <td className="text-end">0</td>
                    </tr>
                    <tr>
                      <td>Under QC</td>
                      <td className="text-end">0</td>
                      <td className="text-end">0</td>
                    </tr>
                    <tr>
                      <td>Total rejections</td>
                      <td className="text-end">55747</td>
                      <td className="text-end">0</td>
                    </tr>
                    <tr>
                      <td className="text-end">due to auto checks (Short Interviews+ Repeated Numbers)</td>
                      <td className="text-end">6020</td>
                      <td className="text-end">0</td>
                    </tr>
                    <tr>
                      <td className="text-end">due to TBC</td>
                      <td className="text-end">0</td>
                      <td className="text-end">0</td>
                    </tr>
                    <tr>
                      <td className="text-end">due to GPS checks</td>
                      <td className="text-end">0</td>
                      <td className="text-end">0</td>
                    </tr>
                    <tr>
                      <td>Interviews without phone numbers</td>
                      <td className="text-end">0</td>
                      <td className="text-end">0</td>
                    </tr>
                    <tr className="bg-primary text-white">
                      <th>AC-wise Progress</th>
                      <th></th>
                      <th></th>
                    </tr>
                    <tr>
                      <td>ACs yet to start</td>
                      <td className="text-end">
                        <a 
                          href="#" 
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            // Handle popup for ACs yet to start - till date
                            console.log('ACs yet to start - till date clicked');
                          }}
                        >
                          9
                        </a>
                      </td>
                      <td className="text-end">
                        <a 
                          href="#" 
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            // Handle popup for ACs yet to start - yesterday
                            console.log('ACs yet to start - yesterday clicked');
                          }}
                        >
                          243
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td>ACs in progress</td>
                      <td className="text-end">
                        <a 
                          href="#" 
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            // Handle popup for ACs in progress - till date
                            console.log('ACs in progress - till date clicked');
                          }}
                        >
                          178
                        </a>
                      </td>
                      <td className="text-end">
                        <a 
                          href="#" 
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            // Handle popup for ACs in progress - yesterday
                            console.log('ACs in progress - yesterday clicked');
                          }}
                        >
                          0
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td>ACs completed</td>
                      <td className="text-end">
                        <a 
                          href="#" 
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            // Handle popup for ACs completed - till date
                            console.log('ACs completed - till date clicked');
                          }}
                        >
                          56
                        </a>
                      </td>
                      <td className="text-end">
                        <a 
                          href="#" 
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            // Handle popup for ACs completed - yesterday
                            console.log('ACs completed - yesterday clicked');
                          }}
                        >
                          0
                        </a>
                      </td>
                    </tr>
                    <tr className="bg-primary text-white">
                      <th>Polling Station Coverage</th>
                      <th className="text-end"></th>
                      <th className="text-end"></th>
                    </tr>
                    <tr>
                      <td>Total Polling stations sampled</td>
                      <td className="text-end">520</td>
                      <td className="text-end">520</td>
                    </tr>
                    <tr>
                      <td>Polling stations yet to start</td>
                      <td className="text-end">-4154</td>
                      <td className="text-end">520</td>
                    </tr>
                    <tr>
                      <td>Polling stations in progress</td>
                      <td className="text-end">3806</td>
                      <td className="text-end">0</td>
                    </tr>
                    <tr>
                      <td>Polling stations completed</td>
                      <td className="text-end">4674</td>
                      <td className="text-end">0</td>
                    </tr>
                    <tr>
                      <td>Polling stations with excess sample achieved</td>
                      <td className="text-end">693</td>
                      <td className="text-end">693</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}