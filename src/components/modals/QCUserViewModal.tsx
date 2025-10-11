'use client';

import React from 'react';
import { X } from 'lucide-react';
import { Table } from '@/components/ui/Table';

interface QCUserAssignment {
  acCode: string;
  acName: string;
  interviewerId: string;
}

interface QCUserViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  qcUserName: string;
  assignments: QCUserAssignment[];
}

const QCUserViewModal: React.FC<QCUserViewModalProps> = ({
  isOpen,
  onClose,
  qcUserName,
  assignments
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-6xl transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Assigned AC/Interviewers for QC User: {qcUserName}
            </h3>
            <button
              onClick={onClose}
              className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="px-6 py-4">
            <div className="overflow-x-auto">
              <Table
                striped
                bordered
                hover
                className="w-full border-collapse"
              >
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      AC Code
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      AC Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Interviewer ID
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {assignments.length > 0 ? (
                    assignments.map((assignment, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {assignment.acCode}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {assignment.acName}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {assignment.interviewerId}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-sm text-gray-500">
                        No assignments found for this QC user.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end border-t border-gray-200 px-6 py-4">
            <button
              onClick={onClose}
              className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QCUserViewModal;
