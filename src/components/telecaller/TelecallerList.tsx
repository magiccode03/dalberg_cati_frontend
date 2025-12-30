'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';
import Button from '@/components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import PaginationStandard from '@/components/ui/PaginationStandard';
import { Search, ChevronDown, ChevronRight, BarChart3 } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';
import ACAssignmentModal from '@/components/modals/ACAssignmentModal';

interface TeleUserData {
  id: number;
  teleform_user_id: number;
  name: string;
  mobile_number: string;
  form_id: number;
  fill_form: number;
  form_data: number;
  qc: number;
  qc_recheck: number;
  supervisor_id: number;
  agency_id: number;
  telecalling_group_id: number;
  under_training: number;
  created_at: number;
  created_by: number;
  updated_at: number;
  updated_by: number;
  status: number;
}

interface UserStatistics {
  total_assigned_count: number;
  ac_detail: Array<{
    ac_code: number;
    ac_name: string;
    call_attempted: number;
    call_pending: number;
  }>;
  total_call_attempted: number;
  total_call_pending: number;
}

interface SearchFilters {
  teleform_user_id: string;
  name: string;
  mobile_number: string;
  status: string;
}

interface TelecallerListProps {
  showHeader?: boolean;
  showSearchFilters?: boolean;
  showTitle?: boolean;
  containerClassName?: string;
  itemsPerPage?: number;
}

const TelecallerList: React.FC<TelecallerListProps> = ({
  showHeader = true,
  showSearchFilters = true,
  showTitle = true,
  containerClassName = '',
  itemsPerPage = 30,
}) => {
  const router = useRouter();
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    teleform_user_id: '',
    name: '',
    mobile_number: '',
    status: '',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [teleUserData, setTeleUserData] = useState<TeleUserData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTelecaller, setSelectedTelecaller] = useState<{id: number, name: string} | null>(null);
  
  // Expanded row state for statistics
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [userStatistics, setUserStatistics] = useState<Map<number, UserStatistics>>(new Map());

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: '1', label: 'Active' },
    { value: '0', label: 'Inactive' },
  ];

  // Fetch telecallers from API
  const fetchTelecallers = async (page: number = currentPage) => {
    setLoading(true);
    setError(null);

    try {
      const params: any = {
        page,
        limit: itemsPerPage,
      };

      // Add filters if they have values
      if (searchFilters.teleform_user_id) params.teleform_user_id = searchFilters.teleform_user_id;
      if (searchFilters.name) params.name = searchFilters.name;
      if (searchFilters.mobile_number) params.mobile_number = searchFilters.mobile_number;
      if (searchFilters.status) params.status = searchFilters.status;

      // Get auth token
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Authentication required');
        return;
      }

      // Build query string
      const queryParams = new URLSearchParams(params).toString();
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/teleform-users?${queryParams}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setTeleUserData(result.data);
        setTotalItems(result.pagination.total);
        setTotalPages(result.pagination.totalPages);
      } else {
        setError(result.message || 'Failed to fetch telecallers');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching telecallers');
      console.error('Error fetching telecallers:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and when page changes
  useEffect(() => {
    fetchTelecallers(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // Fetch statistics for all visible users
  useEffect(() => {
    if (teleUserData.length > 0) {
      teleUserData.forEach(user => {
        if (!userStatistics.has(user.teleform_user_id)) {
          fetchUserStatistics(user.teleform_user_id);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teleUserData]);

  const handleInputChange = (field: keyof SearchFilters, value: string) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page
    fetchTelecallers(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddData = (user: TeleUserData) => {
    setSelectedTelecaller({
      id: user.teleform_user_id,
      name: user.name
    });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTelecaller(null);
  };

  const handleAssignmentSuccess = async () => {
    // Small delay to ensure backend has processed the assignment
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Refresh the telecallers data
    fetchTelecallers(currentPage);
    
    // Force refresh statistics for all visible users to update analytics
    if (teleUserData.length > 0) {
      teleUserData.forEach(user => {
        fetchUserStatistics(user.teleform_user_id, true); // Force refresh
      });
    }
  };

  const fetchUserStatistics = async (teleformUserId: number, forceRefresh: boolean = false) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      
      // Add timestamp to force fresh data if forceRefresh is true
      const url = forceRefresh 
        ? `${apiBaseUrl}/api/cati/interviews/teleform-user/${teleformUserId}/statistics?t=${Date.now()}`
        : `${apiBaseUrl}/api/cati/interviews/teleform-user/${teleformUserId}/statistics`;
        
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setUserStatistics(prev => new Map(prev).set(teleformUserId, result.data));
      }
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  };

  const toggleRowExpansion = (teleformUserId: number) => {
    const newExpandedRows = new Set(expandedRows);
    
    if (newExpandedRows.has(teleformUserId)) {
      newExpandedRows.delete(teleformUserId);
    } else {
      // Close all other expanded rows
      newExpandedRows.clear();
      newExpandedRows.add(teleformUserId);
      // Fetch statistics if not already loaded
      if (!userStatistics.has(teleformUserId)) {
        fetchUserStatistics(teleformUserId);
      }
    }
    
    setExpandedRows(newExpandedRows);
  };

  return (
    <div className={`space-y-6 ${containerClassName}`}>
      {/* Breadcrumb Header */}
      {/* {showHeader && (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <Heading level={1} className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Tele Caller
            </Heading>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Manage telecallers and their assignments
            </p>
          </div>
        </div>
      )} */}

      {/* Error Message */}
      {error && (
        <Alert type="error" className="mb-6">
          {error}
        </Alert>
      )}

      {/* Search Form */}
      {/* {showSearchFilters && (
        <Card className="p-4 md:p-6">
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
              <div className="lg:col-span-1">
                <Input
                  type="text"
                  placeholder="Teleform User ID"
                  value={searchFilters.teleform_user_id}
                  onChange={(e) => handleInputChange('teleform_user_id', e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="lg:col-span-1">
                <Input
                  type="text"
                  placeholder="Name"
                  value={searchFilters.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="lg:col-span-1">
                <Input
                  type="text"
                  placeholder="Mobile Number"
                  value={searchFilters.mobile_number}
                  onChange={(e) => handleInputChange('mobile_number', e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="lg:col-span-1">
                <SelectDropdown
                  options={statusOptions}
                  value={searchFilters.status}
                  onChange={(value) => handleInputChange('status', Array.isArray(value) ? value[0] : value as string)}
                  className="w-full"
                />
              </div>
              <div className="lg:col-span-1">
                <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                  <Search className="w-4 h-4 mr-2" />
                  {loading ? 'Searching...' : 'Search'}
                </Button>
              </div>
            </div>
          </form>
        </Card>
      )} */}

      {/* Tele Caller Table */}
      <Card className="p-4 md:p-6 mt-4">
        {showTitle && (
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-blue-600 mr-3"></div>
              <Heading level={2} className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
                Tele Caller
              </Heading>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : teleUserData.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Mobile Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Total Assigned</TableHead>
                  <TableHead className="text-center">Call Attempted</TableHead>
                  <TableHead className="text-center">Call Pending</TableHead>
                  <TableHead className="text-center"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teleUserData.map((user, index) => {
                  const isExpanded = expandedRows.has(user.teleform_user_id);
                  const stats = userStatistics.get(user.teleform_user_id);
                  
                  return (
                    <React.Fragment key={user.id}>
                      {/* Main Data Row */}
                      <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <TableCell className="font-medium">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium">{user.teleform_user_id}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {user.name}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-sm">{user.mobile_number}</span>
                        </TableCell>
                        <TableCell>
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                            user.status === 1 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {user.status === 1 ? 'Active' : 'Inactive'}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          {stats ? (
                            <span className="font-bold text-blue-600 dark:text-blue-400 text-base">
                              {stats.total_assigned_count}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">Loading...</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {stats ? (
                            <span className="font-bold text-green-600 dark:text-green-400 text-base">
                              {stats.total_call_attempted}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">Loading...</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {stats ? (
                            <span className="font-bold text-orange-600 dark:text-orange-400 text-base">
                              {stats.total_call_pending}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">Loading...</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => toggleRowExpansion(user.teleform_user_id)}
                              title={isExpanded ? "Hide details" : "View details"}
                              className="px-2"
                            >
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>

                      {/* Expanded Details Row */}
                      {isExpanded && (
                        <TableRow>
                          <TableCell colSpan={9} className="bg-gray-50 dark:bg-gray-900/50 p-0">
                            <div className="p-4">
                              {stats ? (
                                <div className="space-y-3">                                    
                                  {/* AC Details */}
                                  {stats.ac_detail && stats.ac_detail.length > 0 && (
                                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                                      <div className="flex items-center gap-2 mb-3">
                                        <BarChart3 className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                          AC-wise Breakdown ({stats.ac_detail.length} ACs)
                                        </span>
                                      </div>
                                      <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                          <thead>
                                            <tr className="bg-gray-50 dark:bg-gray-900">
                                              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">AC Code</th>
                                              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">AC Name</th>
                                              <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700 dark:text-gray-300">Call Attempted</th>
                                              <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700 dark:text-gray-300">Call Pending</th>
                                            </tr>
                                          </thead>
                                          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                            {stats.ac_detail.map((ac) => (
                                              <tr key={ac.ac_code} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                                <td className="px-3 py-2 text-sm">
                                                  <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-xs">
                                                    #{ac.ac_code}
                                                  </span>
                                                </td>
                                                <td className="px-3 py-2 text-sm font-medium text-gray-900 dark:text-white">
                                                  {ac.ac_name}
                                                </td>
                                                <td className="px-3 py-2 text-center">
                                                  <span className="font-semibold text-green-600 dark:text-green-400">
                                                    {ac.call_attempted}
                                                  </span>
                                                </td>
                                                <td className="px-3 py-2 text-center">
                                                  <span className="font-semibold text-orange-600 dark:text-orange-400">
                                                    {ac.call_pending}
                                                  </span>
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="flex justify-center items-center py-4">
                                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
                                  <span className="text-sm text-gray-500">Loading statistics...</span>
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No telecallers found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your search filters or add a new telecaller.
            </p>
          </div>
        )}

        {/* Pagination Footer */}
        {!loading && teleUserData.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs md:text-sm text-gray-700 dark:text-gray-300 text-center sm:text-left">
              Showing <span className="font-semibold">{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalItems)}</span> of <span className="font-semibold">{totalItems}</span> telecallers.
            </div>
            <div className="flex justify-center sm:justify-end">
              <PaginationStandard
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        )}
      </Card>

      {/* AC Assignment Modal */}
      {selectedTelecaller && (
        <ACAssignmentModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          teleformUserId={selectedTelecaller.id}
          telecallerName={selectedTelecaller.name}
          onSuccess={handleAssignmentSuccess}
        />
      )}
    </div>
  );
};

export default TelecallerList;

