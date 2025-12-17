'use client';

import React from 'react';
import { X } from 'lucide-react';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';

interface RowData {
    error: string | null;
    action: string;
    row_id: number | null;
    current: Record<string, any> | null;
    previous: Record<string, any> | null;
    row_number: number | null;
}

interface UpdatedRowsDetailsModalProps {
    isOpen: boolean;
    rows: RowData[];
    onClose: () => void;
}

const UpdatedRowsDetailsModal: React.FC<UpdatedRowsDetailsModalProps> = ({
    isOpen,
    rows,
    onClose,
}) => {
    if (!isOpen || !rows || rows.length === 0) {
        return null;
    }

    // Filter only update rows (exclude errors)
    const updateRows = rows.filter((row) => row.action === 'update' && row.current && row.previous);

    const getAllColumns = () => {
        const columns = new Set<string>();
        updateRows.forEach((row) => {
            if (row.current) {
                Object.keys(row.current).forEach((col) => columns.add(col));
            }
            if (row.previous) {
                Object.keys(row.previous).forEach((col) => columns.add(col));
            }
        });
        return Array.from(columns).sort();
    };

    const columns = getAllColumns();

    const formatValue = (val: any) => {
        if (val === undefined || val === null) return '-';
        if (typeof val === 'object') return JSON.stringify(val);
        return String(val);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 z-10">
                    <Heading level={3} className="text-xl font-semibold text-gray-900 dark:text-white">
                        Updated Rows Details ({updateRows.length} rows updated)
                    </Heading>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                    {updateRows.length === 0 ? (
                        <div className="text-center py-8">
                            <Text className="text-gray-600 dark:text-gray-400">No update rows found</Text>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {updateRows.map((row, rowIndex) => (
                                <div key={rowIndex} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                                    {/* Row Header */}
                                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                                        <div>
                                            <Text className="text-sm font-medium text-gray-600 dark:text-gray-400">Row ID</Text>
                                            <Text className="text-lg font-bold text-gray-900 dark:text-white">{row.row_id}</Text>
                                        </div>
                                        {row.error ? (
                                            <span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-xs font-medium px-3 py-1 rounded">
                                                {row.error}
                                            </span>
                                        ) : (
                                            <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-medium px-3 py-1 rounded">
                                                No Error
                                            </span>
                                        )}
                                    </div>

                                    {/* Column Header */}
                                    <div className="grid grid-cols-3 gap-4 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                                        <div>
                                            <Text className="text-sm font-medium text-gray-900 dark:text-gray-300">Column</Text>
                                        </div>
                                        <div>
                                            <Text className="text-sm font-medium text-gray-900 dark:text-blue-400">Current</Text>
                                        </div>
                                        <div>
                                            <Text className="text-sm font-medium text-gray-900 dark:text-orange-400">Previous</Text>
                                        </div>
                                    </div>

                                    {/* Column Changes */}
                                    <div className="space-y-3">
                                        {columns.map((col) => {
                                            const currentVal = row.current?.[col];
                                            const previousVal = row.previous?.[col];

                                            // Only show columns that have changed
                                            const hasChanged = JSON.stringify(currentVal) !== JSON.stringify(previousVal);

                                            if (!hasChanged && currentVal === undefined && previousVal === undefined) {
                                                return null;
                                            }

                                            return (
                                                <div key={col} className="grid grid-cols-3 gap-4 items-start">
                                                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 pt-3">
                                                        {col}
                                                    </div>
                                                    <div>
                                                        <div className="dark:bg-blue-900/20 p-3 rounded dark:border-blue-800 text-gray-900 dark:text-white text-sm break-words max-h-20 overflow-y-auto">
                                                            {formatValue(currentVal)}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="dark:bg-orange-900/20 p-3 rounded  text-gray-900 dark:text-white text-sm break-words max-h-20 overflow-y-auto">
                                                            {formatValue(previousVal)}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800 flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default UpdatedRowsDetailsModal;