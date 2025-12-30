'use client';

import React from 'react';

interface SummaryTilesProps {
  targetSample: number;
  interviewsAttempted: number;
  interviewsAttemptedPercentage: number | string;
  interviewsAchieved: number;
  interviewsAchievedPercentage: number | string;
}

export default function SummaryTiles({
  targetSample,
  interviewsAttempted,
  interviewsAttemptedPercentage,
  interviewsAchieved,
  interviewsAchievedPercentage,
}: SummaryTilesProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Target Sample */}
      <div className="rounded-lg shadow-md" style={{ backgroundColor: '#4ec2f0' }}>
        <div className="p-6 text-center">
          <h3 className="text-white text-lg font-semibold mb-2">Target Sample</h3>
          <h5 className="text-white text-sm mb-2">(Sample To Be Achieved)</h5>
          <h4 className="text-white text-2xl font-bold">
            {targetSample.toLocaleString()}
          </h4>
        </div>
      </div>

      {/* Interviews Attempted */}
      <div className="rounded-lg shadow-md" style={{ backgroundColor: '#ad4ffa' }}>
        <div className="p-6 text-center">
          <h3 className="text-white text-lg font-semibold mb-2">Interviews Attempted</h3>
          <h5 className="text-white text-sm mb-2">(Valid + Under QC + Invalid)</h5>
          <h4 className="text-white text-2xl font-bold">
            {interviewsAttempted.toLocaleString()} ({interviewsAttemptedPercentage}%)
          </h4>
        </div>
      </div>

      {/* Interviews Achieved */}
      <div className="rounded-lg shadow-md" style={{ backgroundColor: '#016a59' }}>
        <div className="p-6 text-center">
          <h3 className="text-white text-lg font-semibold mb-2">Interviews Achieved</h3>
          <h5 className="text-white text-sm mb-2">(Valid + Under QC)</h5>
          <h4 className="text-white text-2xl font-bold">
            {interviewsAchieved.toLocaleString()} ({interviewsAchievedPercentage}%)
          </h4>
        </div>
      </div>
    </div>
  );
}

