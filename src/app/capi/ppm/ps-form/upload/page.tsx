'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Table } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';
import Alert from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Upload, Download, Eye, X } from 'lucide-react';
import { apiService } from '@/lib/api';
import UploadLogDetailsModal from '@/components/modals/UploadLogDetailsModal';


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
    logger?: {
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
    };
}

interface UploadLogsResponse {
    success: boolean;
    data: UploadLog[];
    pagination: {
        total: number;
        page: number;
        total_pages: number;
        has_next: boolean;
        has_previous: boolean;
    };
    message: string;
    timestamp: string;
}

export default function UploadPollingStationPage() {
    const router = useRouter();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [uploadLogs, setUploadLogs] = useState<UploadLog[]>([]);
    const [loadingRequests, setLoadingRequests] = useState(true);
    const [requestsError, setRequestsError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(20);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [downloadError, setDownloadError] = useState<string | null>(null);
    const [selectedLog, setSelectedLog] = useState<UploadLog | null>(null);
    const [showLogModal, setShowLogModal] = useState(false);

    useEffect(() => {
        fetchPreviousRequests();
    }, [currentPage]);

    const fetchPreviousRequests = async () => {
        try {
            setLoadingRequests(true);
            setRequestsError(null);

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
            const token = localStorage.getItem('accessToken');

            if (!token) {
                setRequestsError('Authentication required');
                return;
            }

            const response = await fetch(
                `${apiUrl}/api/dashboard/master-polling-station-dynamic/upload-logs?page=${currentPage}&limit=${pageSize}`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                }
            );

            if (response.ok) {
                const result: UploadLogsResponse = await response.json();
                if (result.success) {
                    setUploadLogs(result.data || []);
                    setTotalCount(result.pagination?.total || 0);
                    setTotalPages(result.pagination?.total_pages || 0);
                } else {
                    setRequestsError(result.message || 'Failed to fetch previous requests');
                }
            } else {
                setRequestsError('Failed to fetch previous requests');
            }
        } catch (error) {
            console.error('Error fetching previous requests:', error);
            setRequestsError('Error loading previous requests');
        } finally {
            setLoadingRequests(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setSelectedFile(file);
        setUploadError(null);
        setUploadSuccess(false);
    };

    const handleDownloadPS = async () => {
        try {
            setLoading(true);
            setError(null);

            // Call the API to download PS data
            const blob = await apiService.downloadPSForm();

            // Create download link
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Master-Dynamic-PS-List-${new Date().toISOString().split('T')[0]}.csv`;
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Clean up the URL object
            URL.revokeObjectURL(url);

        } catch (err) {
            console.error('Error downloading PS data:', err);
            setError('Failed to download PS data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleUploadDownloadPS = async (logId: number) => {
        try {
            setLoading(true);
            setDownloadError(null);

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
            const token = localStorage.getItem('accessToken');

            if (!token) {
                setDownloadError('Authentication required');
                return;
            }

            const response = await fetch(
                `${apiUrl}/api/dashboard/master-polling-station-dynamic/upload-file/${logId}`,
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/csv',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                let errorMessage = 'Failed to download file';
                try {
                    const responseData = await response.json();
                    if (responseData.message) {
                        errorMessage = responseData.message;
                    }
                } catch (parseErr) {
                    // If response is not JSON, use status text
                    errorMessage = response.statusText || 'Failed to download file';
                }
                throw new Error(errorMessage);
            }

            const blob = await response.blob();

            // Create download link
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Polling-Station-Upload-${new Date().toISOString().split('T')[0]}.csv`;
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Clean up the URL object
            URL.revokeObjectURL(url);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to download uploaded file. Please try again.';
            setDownloadError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedFile) {
            setUploadError('Please select a file to upload');
            return;
        }

        // Validate file type (CSV)
        if (!selectedFile.name.endsWith('.csv') && !selectedFile.type.includes('csv')) {
            setUploadError('Please upload a CSV file');
            return;
        }

        try {
            setUploading(true);
            setUploadError(null);
            setUploadSuccess(false);

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
            const token = localStorage.getItem('accessToken');

            if (!token) {
                setUploadError('Authentication required');
                return;
            }

            const formData = new FormData();
            formData.append('file', selectedFile);

            const response = await fetch(
                `${apiUrl}/api/dashboard/master-polling-station-dynamic/upload`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            const result = await response.json();

            if (response.ok && result.success) {
                setUploadSuccess(true);
                setSelectedFile(null);
                // Reset file input
                const fileInput = document.getElementById('csv_file') as HTMLInputElement;
                if (fileInput) {
                    fileInput.value = '';
                }
                // Show import summary
                const summary = result.data;
                const summaryMessage = `File processed successfully! Imported: ${summary.imported}, Skipped: ${summary.skipped}`;
                // alert(summaryMessage);
                // Refresh previous requests list
                fetchPreviousRequests();
            } else {
                setUploadError(result.message || 'Failed to upload file');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            setUploadError('Error uploading file. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleViewLog = (log: UploadLog) => {
        setSelectedLog(log);
        setShowLogModal(true);
    };



    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            const formattedDate = date.toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            });
            return formattedDate.replace(/\//g, '-');

        } catch {
            return dateString;
        }
    };

    const getStatusBadge = (statusCode: number) => {
        // Assume: 1=pending, 2=completed, 3=failed, etc.
        const statusMap: { [key: number]: { text: string; color: string } } = {
            1: { text: 'In Progress', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
            2: { text: 'Completed', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
            3: { text: 'Failed', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
        };

        const status = statusMap[statusCode] || { text: 'Unknown', color: 'bg-gray-100 text-gray-800' };
        return (
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${status.color}`}>
                {status.text}
            </span>
        );
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        let timer: number;

        if (uploadSuccess) {
            timer = window.setTimeout(() => {
                setUploadSuccess(false);
            }, 7000);
        }

        return () => {
            clearTimeout(timer);
        };
    }, [uploadSuccess]);

    useEffect(() => {
        let timer: number;

        if (downloadError) {
            timer = window.setTimeout(() => {
                setDownloadError(null);
            }, 7000);
        }

        return () => {
            clearTimeout(timer);
        };
    }, [downloadError]);


    return (
        <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
            {/* Breadcrumb Header */}
            <div className="breadcrumb-header justify-content-between mb-6">
                <div className="left-content">
                    <Heading
                        level={2}
                        className="text-2xl font-semibold text-gray-900 dark:text-white mb-0"
                    >
                        Upload List of Polling Station
                    </Heading>
                </div>
                <div className="right-content">
                    <span className="main-content-title mg-b-0 mg-b-lg-1"></span>
                </div>
            </div>

            {/* Upload Form Card */}
            <Card className="mb-6">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                        <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
                        <Heading
                            level={4}
                            className="text-lg font-semibold text-gray-900 dark:text-white"
                        >
                            Upload List of Polling Station
                        </Heading>
                    </div>
                    <div>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={handleDownloadPS}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Download PS List
                        </Button>
                    </div>
                </div>

                <form onSubmit={handleUpload}>
                    {uploadSuccess && (
                        <Alert type="success" className="mb-4">
                            File uploaded successfully!
                        </Alert>
                    )}

                    {uploadError && (
                        <Alert type="error" className="mb-4">
                            {uploadError}
                        </Alert>
                    )}

                    <div className="mb-4">
                        <Text className="text-sm text-red-600 dark:text-red-400">
                            Note - Please Upload Complete Polling Station List
                        </Text>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="md:col-span-3">
                            <label
                                htmlFor="csv_file"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            >
                                CSV File <span className="text-red-500">*</span>
                            </label>
                            <Input
                                id="csv_file"
                                type="file"
                                accept=".csv"
                                onChange={handleFileChange}
                                className="w-full"
                                required
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={uploading || !selectedFile}
                            loading={uploading}
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploading ? 'Uploading...' : 'Upload'}
                        </Button>
                    </div>
                </form>
            </Card>

            {/* Previous Requests Card */}
            <Card>
                <div className="flex items-center mb-4">
                    <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
                    <Heading
                        level={4}
                        className="text-lg font-semibold text-gray-900 dark:text-white"
                    >
                        List of Previous Requests
                    </Heading>
                </div>

                {requestsError && (
                    <Alert type="error" className="mb-4">
                        {requestsError}
                    </Alert>
                )}

                {downloadError && (
                    <Alert type="error" className="mb-4">
                        {downloadError}
                    </Alert>
                )}

                {loadingRequests ? (
                    <div className="text-center py-12">
                        <LoadingSpinner size="lg" />
                        <Text className="text-gray-600 dark:text-gray-400 mt-4">
                            Loading previous requests...
                        </Text>
                    </div>
                ) : (
                    <div className="bg-white">
                        <div className="mb-4">
                            <Text className="text-sm text-gray-600">
                                Total <strong>{totalCount.toLocaleString()}</strong> items.
                            </Text>
                        </div>

                        {uploadLogs.length === 0 ? (
                            <div className="text-center py-12">
                                <Text className="text-gray-600 dark:text-gray-400">
                                    No upload logs found
                                </Text>
                            </div>
                        ) : (
                            <>
                                <div className="table-responsive overflow-x-auto">
                                    <Table className="table table-centered table-bordered table-striped dt-responsive nowrap w-100 border border-gray-300">
                                        <thead className="table-light bg-gray-50">
                                            <tr>
                                                <th className="text-center whitespace-nowrap">S.No</th>
                                                <th className="text-center whitespace-nowrap">File Name</th>
                                                <th className="text-center whitespace-nowrap">Upload By</th>
                                                <th className="text-center whitespace-nowrap">Status</th>
                                                <th className="text-center whitespace-nowrap">Start Time</th>
                                                <th className="text-center whitespace-nowrap">End Time</th>
                                                <th className="text-center whitespace-nowrap">Uploaded File</th>
                                                <th className="text-center whitespace-nowrap">View</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {uploadLogs.map((log, index) => (
                                                <tr key={log.id} className="border-b">
                                                    <td className="text-center">
                                                        {(currentPage - 1) * pageSize + index + 1}
                                                    </td>
                                                    <td className="text-center text-sm">{log.file_name}</td>
                                                    <td className="text-center">{log.uploader_name}</td>
                                                    <td className="text-center">
                                                        {getStatusBadge(log.log_status)}
                                                    </td>
                                                    <td className="text-center text-sm">
                                                        {formatDate(log.execute_start_at)}
                                                    </td>
                                                    <td className="text-center text-sm">
                                                        {formatDate(log.execute_end_at)}
                                                    </td>
                                                    <td className="text-center">
                                                        <Button
                                                            variant="primary"
                                                            size="sm"
                                                            onClick={() => handleUploadDownloadPS(log.id)}
                                                            title="Download Uploaded File"
                                                        >
                                                            <Download className="w-4 h-4 mr-2" />
                                                        </Button>
                                                    </td>
                                                    <td className="text-center">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleViewLog(log)}
                                                            title="View Log Details"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>

                                {totalPages > 1 && (
                                    <div className="mt-6">
                                        <PaginationStandard
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            totalItems={totalCount}
                                            itemsPerPage={pageSize}
                                            onPageChange={handlePageChange}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </Card>

            {/* Log Details Modal */}
            <UploadLogDetailsModal
                isOpen={showLogModal}
                log={selectedLog}
                onClose={() => setShowLogModal(false)}
                onDownload={(logId) => {
                    handleUploadDownloadPS(logId);
                    setShowLogModal(false);
                }}
                formatDate={formatDate}
                getStatusBadge={getStatusBadge}
            />
        </Container>
    );
}
