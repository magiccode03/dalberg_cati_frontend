'use client';

import React, { useState } from 'react';
import SelectDropdown from '@/components/ui/SelectDropdown';

interface CallOutcomeData {
  totalNumbersExhausted: number;
  ringing: number;
  ringingPicked: number;
  ringingDidNotPick: number;
  pickedWrongNumber: number;
  pickedAndRefused: number;
  consentNotGiven: number;
  consentGiven: number;
  completedInterviews: number;
  incompleteInterviews: number;
  validInterviewsAfterQC: number;
  rejectedInterviewsAfterQC: number;
  underQC: number;
  notRinging: number;
  numberDoesNotExist: number;
  notReachable: number;
  switchedOff: number;
}

// Dummy data matching the new structure
const dummyData: CallOutcomeData = {
  totalNumbersExhausted: 20449,
  ringing: 15049,
  ringingPicked: 7472,
  ringingDidNotPick: 7493,
  pickedWrongNumber: 452,
  pickedAndRefused: 975,
  consentNotGiven: 195,
  consentGiven: 3448,
  completedInterviews: 3000,
  incompleteInterviews: 448,
  validInterviewsAfterQC: 2500,
  rejectedInterviewsAfterQC: 300,
  underQC: 200,
  notRinging: 4062,
  numberDoesNotExist: 1425,
  notReachable: 1729,
  switchedOff: 880,
};

export default function PerformancePage() {
  const data = dummyData;
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedBorrower, setSelectedBorrower] = useState<string>('');

  // Filter options
  const stateOptions = [
    { value: 'mh', label: 'MH' },
    { value: 'up', label: 'UP' },
  ];

  const borrowerOptions = [
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8 overflow-x-hidden">
      <div className="w-full overflow-x-hidden">
        {/* Filter Section */}
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <SelectDropdown
                options={stateOptions}
                value={selectedState}
                onChange={(value) => setSelectedState(value as string)}
                placeholder="Select State"
                label="State"
              />
            </div>
            <div>
              <SelectDropdown
                options={borrowerOptions}
                value={selectedBorrower}
                onChange={(value) => setSelectedBorrower(value as string)}
                placeholder="Select Borrower"
                label="Borrower"
              />
            </div>
          </div>
        </div>

        <div className="hv-container">
          <div className="hv-wrapper">
            <div className="hv-item">
              {/* Root: Total Numbers Exhausted */}
              <div className="hv-item-parent">
                <p className="simple-card">
                  Total Numbers Exhausted ({data.totalNumbersExhausted})
                </p>
              </div>

              <div className="hv-item-children">
                {/* Ringing Branch */}
                <div className="hv-item-child">
                  <div className="hv-item">
                    <div className="hv-item-parent">
                      <p className="simple-card">Ringing ({data.ringing})</p>
                    </div>

                    <div className="hv-item-children">
                      {/* Picked Branch */}
                      <div className="hv-item-child">
                        <div className="hv-item">
                          <div className="hv-item-parent">
                            <p className="simple-card">Picked ({data.ringingPicked})</p>
                          </div>

                          <div className="hv-item-children">
                            <div className="hv-item-child">
                              <p className="simple-card">
                                Wrong Number ({data.pickedWrongNumber})
                              </p>
                            </div>

                            <div className="hv-item-child">
                              <p className="simple-card">
                                Picked and Refused ({data.pickedAndRefused})
                              </p>
                            </div>

                            <div className="hv-item-child">
                              <p className="simple-card">
                                Consent Not given ({data.consentNotGiven})
                              </p>
                            </div>

                            {/* Consent Given Branch */}
                            <div className="hv-item-child">
                              <div className="hv-item">
                                <div className="hv-item-parent">
                                  <p className="simple-card">Consent Given ({data.consentGiven})</p>
                                </div>

                                <div className="hv-item-children">
                                  {/* Completed Interviews Branch */}
                                  <div className="hv-item-child">
                                    <div className="hv-item">
                                      <div className="hv-item-parent">
                                        <p className="simple-card">Completed Interviews ({data.completedInterviews})</p>
                                      </div>

                                      <div className="hv-item-children">
                                        <div className="hv-item-child">
                                          <p className="simple-card">
                                            Valid Interviews after QC ({data.validInterviewsAfterQC})
                                          </p>
                                        </div>
                                        <div className="hv-item-child">
                                          <p className="simple-card">
                                            Rejected Interviews after QC ({data.rejectedInterviewsAfterQC})
                                          </p>
                                        </div>
                                        <div className="hv-item-child">
                                          <p className="simple-card">
                                            Under QC ({data.underQC})
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="hv-item-child">
                                    <p className="simple-card">
                                      Incomplete Interviews ({data.incompleteInterviews})
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="hv-item-child">
                        <p className="simple-card">Did not pick ({data.ringingDidNotPick})</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Not Ringing Branch */}
                <div className="hv-item-child">
                  <div className="hv-item-parent">
                    <p className="simple-card">Not Ringing ({data.notRinging})</p>
                  </div>

                  <div className="hv-item-children">
                    <div className="hv-item-child">
                      <p className="simple-card">Number does not Exist ({data.numberDoesNotExist})</p>
                    </div>
                    <div className="hv-item-child">
                      <p className="simple-card">
                        Not Reachable ({data.notReachable})
                      </p>
                    </div>
                    <div className="hv-item-child">
                      <p className="simple-card">
                        Switched off ({data.switchedOff})
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          .hv-container {
            width: 100%;
            overflow-x: hidden;
            overflow-y: visible;
            padding: 20px 0;
            display: flex;
            justify-content: center;
            align-items: flex-start;
          }

          .hv-wrapper {
            display: flex;
            transform-origin: top center;
            width: fit-content;
            max-width: 100%;
          }

          .hv-wrapper .hv-item {
            display: flex;
            flex-direction: column;
            margin: auto;
          }

          .hv-wrapper .hv-item .hv-item-parent {
            margin-bottom: 60px;
            position: relative;
            display: flex;
            justify-content: center;
          }

          .hv-wrapper .hv-item .hv-item-parent:after {
            position: absolute;
            content: "";
            width: 2px;
            height: 25px;
            bottom: 0;
            left: 50%;
            background-color: rgba(0, 0, 0, 0.3);
            transform: translateY(100%);
          }

          .dark .hv-wrapper .hv-item .hv-item-parent:after {
            background-color: rgba(255, 255, 255, 0.7);
          }

          .hv-wrapper .hv-item .hv-item-children {
            display: flex;
            justify-content: center;
            flex-wrap: nowrap;
          }

          .hv-wrapper .hv-item .hv-item-children .hv-item-child {
            padding: 0 2px;
            position: relative;
            flex-shrink: 0;
          }

          .hv-wrapper .hv-item .hv-item-children .hv-item-child:before,
          .hv-wrapper .hv-item .hv-item-children .hv-item-child:not(:only-child):after {
            content: "";
            position: absolute;
            background-color: rgba(0, 0, 0, 0.3);
            left: 0;
          }

          .dark .hv-wrapper .hv-item .hv-item-children .hv-item-child:before,
          .dark .hv-wrapper .hv-item .hv-item-children .hv-item-child:not(:only-child):after {
            background-color: rgba(255, 255, 255, 0.7);
          }

          .hv-wrapper .hv-item .hv-item-children .hv-item-child:before {
            left: 50%;
            top: 0;
            transform: translateY(-100%);
            width: 2px;
            height: 25px;
          }

          .hv-wrapper .hv-item .hv-item-children .hv-item-child:after {
            top: -25px;
            transform: translateY(-100%);
            height: 2px;
            width: 100%;
          }

          .hv-wrapper .hv-item .hv-item-children .hv-item-child:first-child:after {
            left: 50%;
            width: 50%;
          }

          .hv-wrapper .hv-item .hv-item-children .hv-item-child:last-child:after {
            width: calc(50% + 1px);
          }

          p.simple-card {
            margin: 0;
            background-color: #1e3a8a;
            font-weight: bold;
            color: #ffffff;
            padding: 12px 14px;
            min-width: 90px;
            max-width: 140px;
            text-align: center;
            box-shadow: 0 3px 6px rgba(30, 58, 138, 0.3);
            border-radius: 5px;
            white-space: normal;
            word-wrap: break-word;
            line-height: 1.3;
            font-size: 12px;
          }

          .dark p.simple-card {
            background-color: #1e40af;
            color: #ffffff;
          }

          .hv-item-parent p {
            font-weight: bold;
            color: #ffffff;
          }

          p.simple-card.no-response {
            background-color: #cccccc;
            color: #000;
          }

          .dark p.simple-card.no-response {
            background-color: #4b5563;
            color: #fff;
          }

          @media (min-width: 1920px) {
            .hv-wrapper {
              transform: scale(1);
            }
            p.simple-card {
              padding: 14px 16px;
              font-size: 15px;
              max-width: 160px;
            }
            .hv-wrapper .hv-item .hv-item-parent {
              margin-bottom: 65px;
            }
            .hv-wrapper .hv-item .hv-item-children .hv-item-child {
              padding: 0 3px;
            }
          }

          @media (min-width: 1536px) and (max-width: 1919px) {
            .hv-wrapper {
              transform: scale(0.9);
            }
            p.simple-card {
              padding: 12px 9px;
              font-size: 16px;
              max-width: 150px;
            }
            .hv-wrapper .hv-item .hv-item-parent {
              margin-bottom: 60px;
            }
            .hv-wrapper .hv-item .hv-item-children .hv-item-child {
              padding: 0 2px;
            }
          }

          @media (min-width: 1280px) and (max-width: 1535px) {
            .hv-wrapper {
              transform: scale(0.8);
            }
            p.simple-card {
              padding: 11px 11px;
              font-size: 15px;
              max-width: 140px;
            }
            .hv-wrapper .hv-item .hv-item-parent {
              margin-bottom: 55px;
            }
            .hv-wrapper .hv-item .hv-item-children .hv-item-child {
              padding: 0 2px;
            }
          }

          @media (min-width: 1024px) and (max-width: 1279px) {
            .hv-wrapper {
              transform: scale(0.7);
            }
            p.simple-card {
              padding: 10px 10px;
              font-size: 14px;
              max-width: 130px;
            }
            .hv-wrapper .hv-item .hv-item-parent {
              margin-bottom: 50px;
            }
            .hv-wrapper .hv-item .hv-item-children .hv-item-child {
              padding: 0 1px;
            }
          }

          @media (min-width: 768px) and (max-width: 1023px) {
            .hv-wrapper {
              transform: scale(0.6);
            }
            p.simple-card {
              padding: 9px 9px;
              font-size: 13px;
              max-width: 120px;
            }
            .hv-wrapper .hv-item .hv-item-parent {
              margin-bottom: 45px;
            }
            .hv-wrapper .hv-item .hv-item-children .hv-item-child {
              padding: 0 1px;
            }
          }

          @media (max-width: 767px) {
            .hv-wrapper {
              transform: scale(0.5);
            }
            p.simple-card {
              padding: 8px 8px;
              font-size: 12px;
              max-width: 100px;
            }
            .hv-wrapper .hv-item .hv-item-parent {
              margin-bottom: 40px;
            }
            .hv-wrapper .hv-item .hv-item-children .hv-item-child {
              padding: 0 1px;
            }
          }
        `
      }} />
    </div>
  );
}

