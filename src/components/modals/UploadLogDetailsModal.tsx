'use client';

import React, { useState } from 'react';
import { X, Download } from 'lucide-react';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import UpdatedRowsDetailsModal from './UpdatedRowsDetailsModal';

interface Logger {
    rows: any[];
    errors: any[];
    skipped: number;
    updated: number;
    inserted: number;
    total_rows: number;
    header_mapping?: {
        valid_columns: string[];
        unmapped_csv_columns: string[];
        db_columns_not_updated: string[];
    };
    execution_time_ms: number;
}

interface UploadLog {
    id: number;
    file_id: number;
    log_status: number;
    file_name: string;
    status: number;
    uploaded_by: number;
    uploader_name: string;
    execute_start_at: string;
    execute_end_at: string;
    logger?: Logger;
}

interface UploadLogDetailsModalProps {
    isOpen: boolean;
    log: UploadLog | null;
    onClose: () => void;
    onDownload: (logId: number) => void;
    formatDate: (dateString: string) => string;
    getStatusBadge: (statusCode: number) => React.ReactNode;
}

const UploadLogDetailsModal: React.FC<UploadLogDetailsModalProps> = ({
    isOpen,
    log,
    onClose,
    onDownload,
    formatDate,
    getStatusBadge,
}) => {
    const [isUpdatedRowsModalOpen, setIsUpdatedRowsModalOpen] = useState(false);
    const [isInsertedRowsModalOpen, setIsInsertedRowsModalOpen] = useState(false);

    if (!isOpen || !log) {
        return null;
    }

    // Filter rows for updated and inserted
    const updatedRows = log.logger?.rows?.filter((row) => row.action === 'update') || [];
    const insertedRows = log.logger?.rows?.filter((row) => row.action === 'insert') || [];

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
                    {/* Modal Header */}
                    <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                        <Heading level={3} className="text-xl font-semibold text-gray-900 dark:text-white">
                            Upload Log Details
                        </Heading>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Modal Content */}
                    <div className="p-6 space-y-6">
                        {/* Header Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Text className="text-lg font-medium text-gray-900 dark:text-gray-400">ID</Text>
                                <Text className="text-sm font-semibold text-gray-900 dark:text-white">{log.id}</Text>
                            </div>
                            <div>
                                <Text className="text-lg font-medium text-gray-900 dark:text-gray-400">File Name</Text>
                                <Text className="text-sm font-semibold text-gray-900 dark:text-white">{log.file_name}</Text>
                            </div>
                            <div>
                                <Text className="text-lg font-medium text-gray-900 dark:text-gray-400">Upload By</Text>
                                <Text className="text-sm font-semibold text-gray-900 dark:text-white">{log.uploader_name}</Text>
                            </div>
                            <div>
                                <Text className="text-lg font-medium text-gray-900 dark:text-gray-400">Status</Text>
                                <div className="mt-1">{getStatusBadge(log.log_status)}</div>
                            </div>
                            <div>
                                <Text className="text-lg font-medium text-gray-900 dark:text-gray-400">Start Time</Text>
                                <Text className="text-sm font-semibold text-gray-900 dark:text-white">{formatDate(log.execute_start_at)}</Text>
                            </div>
                            <div>
                                <Text className="text-lg font-medium text-gray-900 dark:text-gray-400">End Time</Text>
                                <Text className="text-sm font-semibold text-gray-900 dark:text-white">{formatDate(log.execute_end_at)}</Text>
                            </div>
                        </div>

                        <hr className="border-gray-200 dark:border-gray-700" />

                        {/* Statistics */}
                        <div>
                            <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Import Statistics
                            </Heading>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <Text className="text-lg font-medium text-gray-900 dark:text-gray-400">Total Data</Text>
                                    <Text className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                        {log.logger?.total_rows?.toLocaleString() || 0}
                                    </Text>
                                </div>
                                <div    
                                    className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800"
                                >
                                    <Text className="text-lg font-medium text-gray-900 dark:text-gray-400">Total Rows Inserted</Text>
                                    <Text className="text-2xl font-bold text-green-600 dark:text-green-400">
                                        {log.logger?.inserted?.toLocaleString() || 0}
                                    </Text>
                                </div   >
                                <button
                                    onClick={() => setIsUpdatedRowsModalOpen(true)}
                                    disabled={!updatedRows.length}
                                    className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 hover:shadow-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-left"
                                >
                                    <Text className="text-lg font-medium text-gray-900 dark:text-gray-400">Total Rows Update</Text>
                                    <Text className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                                        {log.logger?.updated?.toLocaleString() || 0}
                                    </Text>
                                </button>
                                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                                    <Text className="text-lg font-medium text-gray-900 dark:text-gray-900">Total Rows Not Updated</Text>
                                    <Text className="text-2xl font-bold text-red-600 dark:text-red-400">
                                        {log.logger?.skipped?.toLocaleString() || 0}
                                    </Text>
                                </div>
                            </div>
                        </div>

                        {/* Errors Section */}
                        {log.logger?.errors && log.logger.errors.length > 0 && (
                            <>
                                <hr className="border-gray-200 dark:border-gray-700" />
                                <div>
                                    <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        Failure Reasons ({log.logger.errors.length} errors)
                                    </Heading>
                                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 space-y-2 max-h-96 overflow-y-auto">
                                        {log.logger.errors.map((error, index) => (
                                            <div key={index} className="text-sm text-red-800 dark:text-red-200">
                                                <strong>Error {index + 1}:</strong> {typeof error === 'string' ? error : JSON.stringify(error)}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Additional Info */}
                        <hr className="border-gray-200 dark:border-gray-700" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Text className="text-lg font-medium text-gray-900 dark:text-gray-400">Execution Time</Text>
                                <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {log.logger?.execution_time_ms ? `${log.logger.execution_time_ms}ms` : '-'}
                                </Text>
                            </div>
                            <div>
                                <Text className="text-lg font-medium text-gray-900 dark:text-gray-400">Download File</Text>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => onDownload(log.id)}
                                    className="mt-1"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800 flex justify-end gap-3">
                        <Button variant="outline" onClick={onClose}>
                            Close
                        </Button>
                    </div>
                </div>
            </div>

            {/* Updated Rows Details Modal */}
            <UpdatedRowsDetailsModal
                isOpen={isUpdatedRowsModalOpen}
                rows={updatedRows}
                onClose={() => setIsUpdatedRowsModalOpen(false)}
            />

            {/* Inserted Rows Details Modal */}
            <UpdatedRowsDetailsModal
                isOpen={isInsertedRowsModalOpen}
                rows={insertedRows}
                onClose={() => setIsInsertedRowsModalOpen(false)}
            />
        </>
    );
};

export default UploadLogDetailsModal;