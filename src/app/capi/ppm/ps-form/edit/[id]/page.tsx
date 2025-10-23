'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { apiService } from '@/lib/api';

// Form validation schema
const psFormSchema = z.object({
  polling_station_name: z.string().min(1, 'Polling Station Name is required'),
  polling_station_name_l2: z.string().optional(),
  polling_station_location: z.string().optional(),
  valid_interview_limit: z.number().min(1, 'Valid Interview Limit must be greater than 0'),
});

type PSFormData = z.infer<typeof psFormSchema>;

interface PSFormUpdateData {
  id: number;
  ac_code: number;
  lot_no: number;
  ac_lot: string;
  polling_station_no: string;
  polling_station_name: string;
  polling_station_name_l2: string | null;
  polling_station_location: string | null;
  valid_interview: number;
  valid_interview_limit: number;
}

export default function EditPSFormPage() {
  const router = useRouter();
  const params = useParams();
  const psId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [psData, setPsData] = useState<PSFormUpdateData | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<PSFormData>({
    resolver: zodResolver(psFormSchema),
    defaultValues: {
      polling_station_name: '',
      polling_station_name_l2: '',
      polling_station_location: '',
      valid_interview_limit: 0,
    },
  });

  // Fetch PS data for update
  useEffect(() => {
    const fetchPSData = async () => {
      if (!psId) return;
      
      setInitialLoading(true);
      setError(null);
      
      try {
        const response = await apiService.getPSFormForUpdate(psId);
        
        if (response.success && response.data) {
          const data = response.data;
          setPsData(data);
          
          // Populate form with fetched data
          reset({
            polling_station_name: data.polling_station_name || '',
            polling_station_name_l2: data.polling_station_name_l2 || '',
            polling_station_location: data.polling_station_location || '',
            valid_interview_limit: data.valid_interview_limit || 0,
          });
        } else {
          setError('Failed to fetch PS data');
        }
      } catch (err) {
        console.error('Error fetching PS data:', err);
        setError('Error loading PS data');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchPSData();
  }, [psId, reset]);

  const onSubmit = async (data: PSFormData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await apiService.updatePSForm(psId, data);
      
      if (response.success) {
        setSuccess('PS updated successfully!');
        
        // Redirect back to PS form list after successful update
        setTimeout(() => {
          router.push('/capi/ppm/ps-form');
        }, 1500);
      } else {
        setError(response.message || 'Failed to update PS data');
      }
      
    } catch (err) {
      console.error('Error updating PS:', err);
      setError('Error updating PS data');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/capi/ppm/ps-form');
  };

  if (initialLoading) {
    return (
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <Text>Loading PS data...</Text>
          </div>
        </div>
      </Container>
    );
  }

  if (error && !psData) {
    return (
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Text className="text-red-600 mb-4">Error: {error}</Text>
            <Button onClick={handleBack} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to PS List
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            onClick={handleBack}
            variant="outline"
            size="sm"
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Heading level={2} className="text-2xl font-semibold text-gray-900 dark:text-white mb-0">
            Edit Polling Station
          </Heading>
        </div>
      </div>

      {/* PS Overview Information */}
      {psData && (
        <Card className="mb-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              PS Overview
            </Heading>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <Text className="font-medium text-gray-600 dark:text-gray-400">AC Code:</Text>
                <Text className="text-gray-900 dark:text-white">{psData.ac_code}</Text>
              </div>
              <div>
                <Text className="font-medium text-gray-600 dark:text-gray-400">Lot No:</Text>
                <Text className="text-gray-900 dark:text-white">{psData.lot_no}</Text>
              </div>
              <div>
                <Text className="font-medium text-gray-600 dark:text-gray-400">AC Lot:</Text>
                <Text className="text-gray-900 dark:text-white">{psData.ac_lot}</Text>
              </div>
              <div>
                <Text className="font-medium text-gray-600 dark:text-gray-400">Polling Station No:</Text>
                <Text className="text-gray-900 dark:text-white">{psData.polling_station_no}</Text>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Alerts */}
      {error && (
        <Alert type="error" className="mb-6">
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert type="success" className="mb-6">
          {success}
        </Alert>
      )}

      {/* Edit Form */}
      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6">
            <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Edit PS Details
            </Heading>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Polling Station Name */}
              <div className="md:col-span-1">
                <Text className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Polling Station Name *
                </Text>
                <Input
                  {...register('polling_station_name')}
                  type="text"
                  placeholder="Enter polling station name"
                  className={`w-full ${errors.polling_station_name ? 'border-red-500' : ''}`}
                />
                {errors.polling_station_name && (
                  <Text className="text-red-500 text-sm mt-1">
                    {errors.polling_station_name.message}
                  </Text>
                )}
              </div>

              {/* Polling Station Name L2 */}
              <div className="md:col-span-1">
                <Text className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Polling Station Name L2
                </Text>
                <Input
                  {...register('polling_station_name_l2')}
                  type="text"
                  placeholder="Enter polling station name L2"
                  className="w-full"
                />
              </div>

              {/* Polling Station Location */}
              <div className="md:col-span-1">
                <Text className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Polling Station Location
                </Text>
                <Input
                  {...register('polling_station_location')}
                  type="text"
                  placeholder="Enter polling station location"
                  className="w-full"
                />
              </div>

              {/* Valid Interview Limit */}
              <div className="md:col-span-1">
                <Text className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Valid Interview Limit *
                </Text>
                <Input
                  {...register('valid_interview_limit', { valueAsNumber: true })}
                  type="number"
                  min="1"
                  placeholder="Enter valid interview limit"
                  className={`w-full ${errors.valid_interview_limit ? 'border-red-500' : ''}`}
                />
                {errors.valid_interview_limit && (
                  <Text className="text-red-500 text-sm mt-1">
                    {errors.valid_interview_limit.message}
                  </Text>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                onClick={handleBack}
                variant="outline"
                disabled={loading || isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading || isSubmitting}
                className="flex items-center"
              >
                {loading || isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </Container>
  );
}
