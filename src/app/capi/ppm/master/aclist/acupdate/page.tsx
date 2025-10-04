'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import { Loader2 } from 'lucide-react';
import { apiService } from '@/lib/api';
import Toast from '@/components/ui/Toast';

interface ACData {
  ac_code: number;
  ac_name: string;
  agency_id: number;
  agency_name: string;
  total_interview: number;
  valid_interview: number;
}

const ACUpdatePageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const acCode = searchParams.get('ac_code');
  
  const [acData, setAcData] = useState<ACData | null>(null);
  const [selectedAgency, setSelectedAgency] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agencyOptions, setAgencyOptions] = useState<Array<{id: number, name: string}>>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const fetchAgencies = async () => {
    try {
      const response = await apiService.getAgencies();
      
      if (response.success && response.data && typeof response.data === 'object') {
        // Convert API response format to our component format
        const agencies = Object.entries(response.data).map(([id, name]) => ({
          id: parseInt(id),
          name: name as string
        }));
        
        setAgencyOptions(agencies);
      } else {
        console.error('Invalid API response structure:', response);
        setError('Failed to load agencies');
      }
    } catch (err) {
      console.error('Error fetching agencies:', err);
      setError('Failed to load agencies');
    }
  };

  const fetchACData = async () => {
    if (!acCode) {
      router.push('/capi/ppm/master/aclist');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getMasterACIndexForUpdate(parseInt(acCode));
      
      if (response.success && response.data) {
        const apiData = response.data;
        
        setAcData(apiData);
        setSelectedAgency(apiData.agency_name || '');
      } else {
        setError('Failed to fetch AC data');
      }
    } catch (err) {
      console.error('Error fetching AC data:', err);
      setError('Error loading AC data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchAgencies();
        await fetchACData();
      } catch (err) {
        console.error('Error loading page data:', err);
        setError('Failed to load page data');
      }
    };
    
    loadData();
  }, [acCode, router]);

  const handleUpdateAgency = async () => {
    if (!acData || !selectedAgency) return;
    
    setUpdating(true);
    setError(null); // Clear any previous errors
    
    try {
      // Find agency ID from selected agency name
      const selectedAgencyData = agencyOptions.find(agency => agency.name === selectedAgency);
      
      if (!selectedAgencyData) {
        setError('Invalid agency selected');
        setUpdating(false);
        return;
      }
      
      console.log(`Updating agency for AC ${acData.ac_code} to ID ${selectedAgencyData.id} (${selectedAgency})`);
      
      // Make the API call to update the agency
      const response = await apiService.updateMasterACIndex(acData.ac_code, selectedAgencyData.id);
      
      console.log('Update API response:', response);
      
      if (response.success && response.data && response.data.updated) {
        console.log('Agency updated successfully');
        // Show success toast and redirect after a delay
        setToastMessage('Agency updated successfully!');
        setShowToast(true);
        // Redirect back to AC list after showing toast
        setTimeout(() => {
          router.push('/capi/ppm/master/aclist');
        }, 2000);
      } else {
        setError(response.message || 'Failed to update agency');
        console.error('Update failed:', response);
      }
    } catch (error: any) {
      console.error('Error updating agency:', error);
      setError(error.message || 'Failed to update agency');
    } finally {
      setUpdating(false);
    }
  };

  const handleBack = () => {
    router.push('/capi/ppm/master/aclist');
  };

  if (loading) {
    return (
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <Text>Loading AC data...</Text>
          </div>
        </div>
      </Container>
    );
  }

  // Show error message if API call failed
  if (error && !loading) {
    return (
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Heading level={3} className="text-2xl font-bold text-red-600 mb-2">
              Error Loading AC Data
            </Heading>
            <Text className="text-gray-600 mb-4">{error}</Text>
            <div className="space-x-4">
              <Button onClick={fetchACData} variant="primary">
                Try Again
              </Button>
              <Button onClick={handleBack}>
                Back to AC List
              </Button>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  if (!acData && !loading) {
    return (
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Text className="text-red-600 mb-4">AC not found</Text>
            <Button onClick={handleBack} variant="primary">
              Back to AC List
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Page Title */}
      <Heading level={3} className="mb-6 text-gray-800">
        Assign Agency to : {acData?.ac_name || ''}
      </Heading>

      {/* Main Content Card */}
      <Card>
        {/* Section Header */}
        <div className="mb-6">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-500 mr-3"></div>
            <Heading level={4} className="text-gray-800 font-bold">
              ASSIGN AGENCY TO: {acData?.ac_name?.toUpperCase() || ''}
            </Heading>
          </div>
        </div>


        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-5">
              Agency
            </label>
            <div className="relative">
              <select
                value={selectedAgency}
                onChange={(e) => setSelectedAgency(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                disabled={updating}
              >
                <option value="">Select Agency</option>
                {agencyOptions.map((agency) => (
                  <option key={agency.id} value={agency.name}>
                    {agency.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {error && (
              <div className="mt-2 text-red-500 text-sm">{error}</div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={handleUpdateAgency}
              disabled={updating || !selectedAgency}
              className="flex-1 px-4 py-2 bg-teal-500 hover:bg-teal-600 disabled:bg-gray-400 text-white font-medium rounded-md transition-colors flex items-center justify-center"
            >
              {updating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                'Update'
              )}
            </button>
            <button
              onClick={handleBack}
              disabled={updating}
              className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-medium rounded-md transition-colors"
            >
              Back
            </button>
          </div>
        </div>
      </Card>

      {/* Success Toast */}
      {showToast && (
        <Toast
          message={toastMessage}
          type="success"
          duration={2000}
          position="top-center"
          onClose={() => setShowToast(false)}
          title="Success"
        />
      )}
    </Container>
  );
};

const ACUpdatePage = () => {
  return (
    <Suspense fallback={
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <Text>Loading...</Text>
          </div>
        </div>
      </Container>
    }>
      <ACUpdatePageContent />
    </Suspense>
  );
};

export default ACUpdatePage;
