'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import { Loader2 } from 'lucide-react';

interface ACData {
  acCode: number;
  acName: string;
  agencyId: number;
  agencyName: string;
}

const ACUpdatePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const acCode = searchParams.get('ac_code');
  
  const [acData, setAcData] = useState<ACData | null>(null);
  const [selectedAgency, setSelectedAgency] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Sample AC data - in real app, this would come from API
  const sampleACData: ACData[] = [
    { acCode: 1, acName: 'Valmiki Nagar', agencyId: 4, agencyName: 'Parbhat' },
    { acCode: 2, acName: 'Ramnagar (SC)', agencyId: 4, agencyName: 'Parbhat' },
    { acCode: 3, acName: 'Narkatiaganj', agencyId: 1, agencyName: 'Kadence' },
    { acCode: 4, acName: 'Bagaha', agencyId: 2, agencyName: 'Chandan' },
    { acCode: 5, acName: 'Lauriya', agencyId: 3, agencyName: 'Rohit' },
  ];

  useEffect(() => {
    if (acCode) {
      // Find AC data by code
      const foundAC = sampleACData.find(ac => ac.acCode === parseInt(acCode));
      if (foundAC) {
        setAcData(foundAC);
        setSelectedAgency(foundAC.agencyName);
      }
      setLoading(false);
    } else {
      // Redirect back if no ac_code provided
      router.push('/capi/ppm/master/aclist');
    }
  }, [acCode, router]);

  const handleUpdateAgency = async () => {
    if (!acData || !selectedAgency) return;
    
    setUpdating(true);
    try {
      // Here you would make the API call to update the agency
      console.log(`Updating agency for AC ${acData.acCode} to ${selectedAgency}`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect back to AC list
      router.push('/capi/ppm/master/aclist');
    } catch (error) {
      console.error('Error updating agency:', error);
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

  if (!acData) {
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
        Assign Agenct to : {acData.acName}
      </Heading>

      {/* Main Content Card */}
      <Card>
        {/* Section Header */}
        <div className="mb-6">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-500 mr-3 mb-5"></div>
            <Heading level={4} className="text-gray-800 font-bold mb-5">
              ASSIGN AGENCT TO: {acData.acName.toUpperCase()}
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
                <option value="Parbhat">Parbhat</option>
                <option value="Kadence">Kadence</option>
                <option value="Chandan">Chandan</option>
                <option value="Rohit">Rohit</option>
                <option value="Navin">Navin</option>
                <option value="Aeon">Aeon</option>
                <option value="Abhinav">Abhinav</option>
                <option value="Inhouse">Inhouse</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
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
    </Container>
  );
};

export default ACUpdatePage;
