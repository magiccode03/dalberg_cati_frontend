'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Text from '@/components/ui/Text';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';
import { apiService } from '@/lib/api';

interface MasterPCData {
  pc_code: number;
  pc_name: string;
  total_electorate: number;
  male: number;
  female: number;
  rural: number;
  urban: number;
  sc: number;
  st: number;
  general_obc: number;
  hindu: number;
  muslim: number;
  christian: number;
  sikh: number;
  buddhist: number;
  jain: number;
  religion_others: number;
  religion_not_stated: number;
  age_18_24: number;
  age_25_34: number;
  age_35_50: number;
  age_50_above: number;
}

const UpdateMasterPCPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pcCode = searchParams.get('pc_code');

  const [formData, setFormData] = useState<MasterPCData>({
    pc_code: 0,
    pc_name: '',
    total_electorate: 0,
    male: 0,
    female: 0,
    rural: 0,
    urban: 0,
    sc: 0,
    st: 0,
    general_obc: 0,
    hindu: 0,
    muslim: 0,
    christian: 0,
    sikh: 0,
    buddhist: 0,
    jain: 0,
    religion_others: 0,
    religion_not_stated: 0,
    age_18_24: 0,
    age_25_34: 0,
    age_35_50: 0,
    age_50_above: 0,
  });

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchPCData = async () => {
    if (!pcCode) return;
    
    try {
      setInitialLoading(true);
      setError(null);
      
      const response = await apiService.getMasterACForUpdate(parseInt(pcCode));
    //   const response = await apiService.getMasterPCForUpdate(parseInt(acCode));
      
      if (response.success && response.data) {
        const apiData = response.data;
        
        // Map API response to form data structure
        const mappedData: MasterPCData = {
          pc_code: apiData.pc_code,
          pc_name: apiData.pc_name,
          total_electorate: apiData.total_electorate || 0,
          male: parseFloat(apiData.male || '0'),
          female: parseFloat(apiData.female || '0'),
          rural: parseFloat(apiData.rural || '0'),
          urban: parseFloat(apiData.urban || '0'),
          sc: parseFloat(apiData.sc || '0'),
          st: parseFloat(apiData.st || '0'),
          general_obc: parseFloat(apiData.general_obc || '0'),
          hindu: parseFloat(apiData.hindu || '0'),
          muslim: parseFloat(apiData.muslim || '0'),
          christian: parseFloat(apiData.christian || '0'),
          sikh: parseFloat(apiData.sikh || '0'),
          buddhist: parseFloat(apiData.buddhist || '0'),
          jain: parseFloat(apiData.jain || '0'),
          religion_others: parseFloat(apiData.religion_others || '0'),
          age_18_24: parseFloat(apiData.age_18_24 || '0'),
          age_25_34: parseFloat(apiData.age_25_34 || '0'),
          age_35_50: parseFloat(apiData.age_35_50 || '0'),
          age_50_above: parseFloat(apiData.age_50_above || '0'),
          religion_not_stated: parseFloat(apiData.religion_not_stated || '0'),
        };
        
        setFormData(mappedData);
      } else {
        setError('Failed to fetch PC data');
      }
    } catch (err) {
      console.error('Error fetching PC data:', err);
      setError('Error loading PC data');
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    if (pcCode) {
      fetchPCData();
    }
  }, [pcCode]);

  const handleInputChange = (name: keyof MasterPCData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Add validation logic here
    // For example, ensure percentages don't exceed 100 or go below 0
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // In real app, make API call to update the data
      console.log('Updating PC data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message and redirect back
      alert('PC data updated successfully!');
      router.push('/capi/ppm/master-data/master-pc');
      
    } catch (error) {
      console.error('Error updating PC:', error);
      alert('Failed to update PC data');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/capi/ppm/master-data/master-pc');
  };

  // Show loading spinner while fetching initial data
  if (initialLoading) {
    return (
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-lg">Loading PC data...</p>
          </div>
        </div>
      </Container>
    );
  }

  // Show error message if API call failed
  if (error) {
    return (
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        <div className="text-center py-8">
          <Heading level={1} className="text-2xl font-bold text-red-600">
            Error Loading PC Data
          </Heading>
          <p className="mt-2 text-gray-600">{error}</p>
          <div className="mt-4 space-x-4">
            <Button onClick={fetchPCData} variant="primary">
              Try Again
            </Button>
            <Button onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to List
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  if (!pcCode) {
    return (
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        <div className="text-center py-8">
          <Heading level={1} className="text-2xl font-bold text-red-600">
            Invalid PC Code
          </Heading>
          <Button onClick={handleBack} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to List
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      {/* Breadcrumb Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1">
          <Heading level={3} className="text-gray-800">
            Update Master Ac: {formData.pc_name}
          </Heading>
        </div>
        <div className="flex-1"></div>
        <div className="flex-1">
          <span></span>
        </div>
      </div>

      {/* Form Card */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-600 mr-3"></div>
            <Heading level={4} className="card-title mg-b-0">
              Update Master Ac: {formData.pc_name}
            </Heading>
          </div>
          <Button 
            variant="secondary" 
            onClick={handleBack}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to List
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* PC Overview */}
          <div className="mb-8">
            <Heading level={5} className="mb-4 text-lg font-semibold text-gray-800">
              PC Overview
            </Heading>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  PC Name
                </label>
                <Input
                  type="text"
                  value={formData.pc_name}
                  onChange={(e) => handleInputChange('pc_name', e.target.value)}
                  className="w-full"
                  placeholder="Enter PC Name"
                />
                {errors.ac_name && (
                  <div className="text-red-500 text-sm mt-1">{errors.ac_name}</div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Total Electorate
                </label>
                <Input
                  type="number"
                  value={formData.total_electorate}
                  onChange={(e) => handleInputChange('total_electorate', e.target.value)}
                  className="w-full"
                  placeholder="Enter Total Electorate"
                />
                {errors.total_electorate && (
                  <div className="text-red-500 text-sm mt-1">{errors.total_electorate}</div>
                )}
              </div>
            </div>
          </div>

          {/* Gender Percentage */}
          <div className="mb-8 border-t pt-6">
            <Heading level={5} className="mb-4 text-lg font-semibold text-gray-800">
              Gender Percentage %
            </Heading>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Male
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.male}
                  onChange={(e) => handleInputChange('male', e.target.value)}
                  className="w-full"
                  placeholder="Enter Male Percentage"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Female
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.female}
                  onChange={(e) => handleInputChange('female', e.target.value)}
                  className="w-full"
                  placeholder="Enter Female Percentage"
                />
              </div>
            </div>
          </div>

          {/* Locality Percentage */}
          <div className="mb-8 border-t pt-6">
            <Heading level={5} className="mb-4 text-lg font-semibold text-gray-800">
              Locality Percentage %
            </Heading>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rural
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.rural}
                  onChange={(e) => handleInputChange('rural', e.target.value)}
                  className="w-full"
                  placeholder="Enter Rural Percentage"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Urban
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.urban}
                  onChange={(e) => handleInputChange('urban', e.target.value)}
                  className="w-full"
                  placeholder="Enter Urban Percentage"
                />
              </div>
            </div>
          </div>

          {/* Social Category Percentage */}
          <div className="mb-8 border-t pt-6">
            <Heading level={5} className="mb-4 text-lg font-semibold text-gray-800">
              Social Category Percentage %
            </Heading>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Scheduled Caste (SC)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.sc}
                  onChange={(e) => handleInputChange('sc', e.target.value)}
                  className="w-full"
                  placeholder="Enter SC Percentage"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Scheduled Tribe (ST)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.st}
                  onChange={(e) => handleInputChange('st', e.target.value)}
                  className="w-full"
                  placeholder="Enter ST Percentage"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  General/OBC
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.general_obc}
                  onChange={(e) => handleInputChange('general_obc', e.target.value)}
                  className="w-full"
                  placeholder="Enter General/OBC Percentage"
                />
              </div>
            </div>
          </div>

          {/* Religion Percentage */}
          <div className="mb-8 border-t pt-6">
            <Heading level={5} className="mb-4 text-lg font-semibold text-gray-800">
              Religion Percentage %
            </Heading>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Hindu
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.hindu}
                  onChange={(e) => handleInputChange('hindu', e.target.value)}
                  className="w-full"
                  placeholder="Enter Hindu Percentage"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Muslim
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.muslim}
                  onChange={(e) => handleInputChange('muslim', e.target.value)}
                  className="w-full"
                  placeholder="Enter Muslim Percentage"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Christian
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.christian}
                  onChange={(e) => handleInputChange('christian', e.target.value)}
                  className="w-full"
                  placeholder="Enter Christian Percentage"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sikh
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.sikh}
                  onChange={(e) => handleInputChange('sikh', e.target.value)}
                  className="w-full"
                  placeholder="Enter Sikh Percentage"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Buddhist
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.buddhist}
                  onChange={(e) => handleInputChange('buddhist', e.target.value)}
                  className="w-full"
                  placeholder="Enter Buddhist Percentage"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Jain
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.jain}
                  onChange={(e) => handleInputChange('jain', e.target.value)}
                  className="w-full"
                  placeholder="Enter Jain Percentage"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Religion Others
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.religion_others}
                  onChange={(e) => handleInputChange('religion_others', e.target.value)}
                  className="w-full"
                  placeholder="Enter Religion Others Percentage"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Religion Not Stated
                </label>
                  <Input
                  type="number"
                  step="0.1"
                  value={formData.religion_not_stated}
                  onChange={(e) => handleInputChange('religion_not_stated', e.target.value)}
                  className="w-full"
                  placeholder="Enter Religion Not Stated Percentage"
                />
              </div>
            </div>
          </div>

          {/* Age Percentage */}
          <div className="mb-8 border-t pt-6">
            <Heading level={5} className="mb-4 text-lg font-semibold text-gray-800">
              Age Percentage %
            </Heading>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Age 18-24
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.age_18_24}
                  onChange={(e) => handleInputChange('age_18_24', e.target.value)}
                  className="w-full"
                  placeholder="Enter Age 18-24 Percentage"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Age 25-34
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.age_25_34}
                  onChange={(e) => handleInputChange('age_25_34', e.target.value)}
                  className="w-full"
                  placeholder="Enter Age 25-34 Percentage"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Age 35-50
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.age_35_50}
                  onChange={(e) => handleInputChange('age_35_50', e.target.value)}
                  className="w-full"
                  placeholder="Enter Age 35-50 Percentage"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Age 50 Above
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.age_50_above}
                  onChange={(e) => handleInputChange('age_50_above', e.target.value)}
                  className="w-full"
                  placeholder="Enter Age 50 Above Percentage"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="border-t pt-6 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="bg-green-600 text-white hover:bg-green-700 flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </Container>
  );
};

const UpdateMasterPCPage = () => {
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
      <UpdateMasterPCPageContent />
    </Suspense>
  );
};

export default UpdateMasterPCPage;
