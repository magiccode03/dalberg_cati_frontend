'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Alert from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { ArrowLeft, Save } from 'lucide-react';

interface MasterACCasteForm {
  caste_name: string;
  absoulte_caste: number | string;
  caste: string;
  caste_code: string;
  castecode: string;
  minsample: number | string;
}

const defaultFormData: MasterACCasteForm = {
  caste_name: '',
  absoulte_caste: 0,
  caste: '',
  caste_code: '',
  castecode: '',
  minsample: 0,
};

const UpdateCasteContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const casteId = searchParams.get('id');

  const [formData, setFormData] = useState<MasterACCasteForm>(defaultFormData);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!casteId) {
      setInitialLoading(false);
      setError('Missing caste ID.');
      return;
    }

    const fetchCasteDetails = async () => {
      try {
        setInitialLoading(true);
        setError(null);

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
        const token = localStorage.getItem('accessToken');

        if (!token) {
          setError('Authentication required');
          return;
        }

        const response = await fetch(
          `${apiUrl}/api/capi/master-ac-caste/details?id=${casteId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          }
        );

        if (!response.ok) {
          setError('Failed to load caste details.');
          return;
        }

        const result = await response.json();

        if (!result.success || !result.data) {
          setError(result.message || 'Failed to load caste details.');
          return;
        }

        const data = result.data;

        setFormData({
          caste_name: data.caste_name || '',
          absoulte_caste: data.absoulte_caste ?? 0,
          caste: data.caste?.toString() || '',
          caste_code: data.caste_code?.toString() || '',
          castecode: data.castecode?.toString() || '',
          minsample: data.minsample ?? 0,
        });
      } catch (err) {
        console.error('Error fetching caste details:', err);
        setError('Error loading caste details.');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchCasteDetails();
  }, [casteId]);

  const handleInputChange = (
    field: keyof MasterACCasteForm,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!casteId) {
      setError('Missing caste ID.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      const token = localStorage.getItem('accessToken');

      if (!token) {
        setError('Authentication required');
        return;
      }

      const response = await fetch(
        `${apiUrl}/api/capi/master-ac-caste/update?id=${casteId}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            caste_name: formData.caste_name,
            absoulte_caste: Number(formData.absoulte_caste) || 0,
            caste: formData.caste,
            caste_code: formData.caste_code,
            castecode: formData.castecode,
            minsample: Number(formData.minsample) || 0,
          }),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccessMessage(result.message || 'Caste details updated successfully.');
      } else {
        setError(result.message || 'Failed to update caste details.');
      }
    } catch (err) {
      console.error('Error updating caste details:', err);
      setError('Error updating caste details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/capi/ppm/master-data/master-ac-caste');
  };

  if (initialLoading) {
    return (
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        <div className="flex justify-center items-center min-h-[300px]">
          <LoadingSpinner size="lg" />
        </div>
      </Container>
    );
  }

  if (error && !formData.caste_name) {
    return (
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        <Card>
          <div className="p-6">
            <Alert type="error" className="mb-4">
              {error}
            </Alert>
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to List
            </Button>
          </div>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
      <div className="breadcrumb-header justify-content-between mb-6">
        <div className="left-content">
          <Heading level={2} className="text-2xl font-semibold text-gray-900 dark:text-white mb-0">
            Update Master AC Caste {formData.caste_name ? `: ${formData.caste_name}` : ''}
          </Heading>
        </div>
        <div className="right-content">
          <span className="main-content-title mg-b-0 mg-b-lg-1"></span>
        </div>
      </div>

      <Card>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
            <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
              Update Master AC Caste
            </Heading>
          </div>
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to List
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert type="error">
              {error}
            </Alert>
          )}

          {successMessage && (
            <Alert type="success">
              {successMessage}
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="caste_name">
                Caste Name
              </label>
              <Input
                id="caste_name"
                value={formData.caste_name}
                onChange={(e) => handleInputChange('caste_name', e.target.value)}
                placeholder="Enter caste name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="absoulte_caste">
                Absoulte Caste
              </label>
              <Input
                id="absoulte_caste"
                type="number"
                min={0}
                max={999}
                value={formData.absoulte_caste}
                onChange={(e) => handleInputChange('absoulte_caste', e.target.value)}
                placeholder="Enter absoulte caste"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="caste">
                Caste
              </label>
              <Input
                id="caste"
                value={formData.caste}
                onChange={(e) => handleInputChange('caste', e.target.value)}
                placeholder="Enter caste"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="caste_code">
                Caste Code
              </label>
              <Input
                id="caste_code"
                value={formData.caste_code}
                onChange={(e) => handleInputChange('caste_code', e.target.value)}
                placeholder="Enter caste code"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="castecode">
                Castecode
              </label>
              <Input
                id="castecode"
                value={formData.castecode}
                onChange={(e) => handleInputChange('castecode', e.target.value)}
                placeholder="Enter castecode"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="minsample">
                Minsample
              </label>
              <Input
                id="minsample"
                type="number"
                min={0}
                value={formData.minsample}
                onChange={(e) => handleInputChange('minsample', e.target.value)}
                placeholder="Enter minsample"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" variant="primary" disabled={loading} loading={loading} className="min-w-[140px]">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </form>
      </Card>
    </Container>
  );
};

const UpdateCastePage = () => {
  return (
    <Suspense
      fallback={
        <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
          <div className="flex justify-center items-center min-h-[300px]">
            <LoadingSpinner size="lg" />
          </div>
        </Container>
      }
    >
      <UpdateCasteContent />
    </Suspense>
  );
};

export default UpdateCastePage;
