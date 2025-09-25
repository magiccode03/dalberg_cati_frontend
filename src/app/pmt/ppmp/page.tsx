'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function ProjectProgressMonitoringPortal() {
  const router = useRouter();

  const handleOptionClick = (optionId: string) => {
    console.log(`Selected option: ${optionId}`);
    
    if (optionId === 'capi') {
      router.push('/pmt/dashboard');
    }
    // Add other navigation logic here for CATI and CAPI + CATI
  };

  return (
    <div className="min-h-screen bg-blue-50 dark:bg-gray-900 p-4">
      {/* Admin Portal Title - directly on blue background */}
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
       Project Progress Monitoring
      </h1>

      {/* White Container for Buttons - spans almost full width */}
      <div className="w-full bg-white rounded-lg shadow-lg p-8">
        <div className="flex gap-4">
          {/* CAPI Button */}
          <button
            onClick={() => handleOptionClick('capi')}
            className="flex-1 h-20 bg-green-100 hover:bg-green-200 rounded-lg shadow-md transition-all duration-200 flex items-center justify-center"
          >
            <span className="text-lg font-bold text-green-700">CAPI</span>
          </button>

          {/* CATI Button */}
          <button
            onClick={() => handleOptionClick('cati')}
            className="flex-1 h-20 bg-yellow-100 hover:bg-yellow-200 rounded-lg shadow-md transition-all duration-200 flex items-center justify-center"
          >
            <span className="text-lg font-bold text-yellow-700">CATI</span>
          </button>

          {/* CAPI + CATI Button */}
          <button
            onClick={() => handleOptionClick('capi-cati')}
            className="flex-1 h-20 bg-teal-100 hover:bg-teal-200 rounded-lg shadow-md transition-all duration-200 flex items-center justify-center"
          >
            <span className="text-lg font-bold text-teal-700">CAPI + CATI</span>
          </button>
        </div>
      </div>
    </div>
  );
}
