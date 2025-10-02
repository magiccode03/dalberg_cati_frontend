'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Phone } from 'lucide-react';

interface CallData {
  id: number;
  serverId: string;
  webForm: string;
  respondentName: string;
  callAttempt?: number;
  rescheduleDateTime?: string;
}

export default function StartFormFillingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    teleform_user_id: '',
    user_phone: ''
  });

  const [errors, setErrors] = useState({
    teleform_user_id: '',
    user_phone: ''
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [activeTab, setActiveTab] = useState('new-calls');
  const [showNewCallSection, setShowNewCallSection] = useState(false);

  // Sample data for the table
  const [callData, setCallData] = useState<CallData[]>([
    {
      id: 1,
      serverId: 'SRV001',
      webForm: 'Survey Form A',
      respondentName: 'John Doe',
      callAttempt: 2,
      rescheduleDateTime: '2024-01-15 14:30'
    },
    {
      id: 2,
      serverId: 'SRV002',
      webForm: 'Survey Form B',
      respondentName: 'Jane Smith',
      callAttempt: 1,
      rescheduleDateTime: '2024-01-16 10:15'
    },
    {
      id: 3,
      serverId: 'SRV003',
      webForm: 'Survey Form C',
      respondentName: 'Mike Johnson',
      callAttempt: 3,
      rescheduleDateTime: '2024-01-17 16:45'
    }
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      teleform_user_id: '',
      user_phone: ''
    };

    if (!formData.teleform_user_id.trim()) {
      newErrors.teleform_user_id = 'Teleuser ID is required';
    }

    if (!formData.user_phone.trim()) {
      newErrors.user_phone = 'User Phone No is required';
    } else if (!/^\d{10}$/.test(formData.user_phone.replace(/\D/g, ''))) {
      newErrors.user_phone = 'Please enter a valid 10-digit phone number';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Form submitted:', formData);
      setIsLoggedIn(true);
      setShowTable(true);
      setShowNewCallSection(true);
      // Implement form submission logic here
      // You can redirect to the next page or make an API call
    }
  };

  const handleConnectToCall = (callId: number) => {
    console.log('Connecting to call:', callId);
    // Navigate to tele-form page
    router.push('/cati/ss/tele-form');
  };

  const tabs = [
    { id: 'new-calls', label: 'New Calls', href: '/omnivore2025/teleform/default' },
    { id: 'callback', label: 'Call Back', href: '/omnivore2025/teleform/default/callback' },
    { id: 'reschedule', label: 'Reschedule Interview', href: '/omnivore2025/teleform/default/reschedule' }
  ];

  return (
    <Container maxWidth="full">
      <div className="space-y-6">
        {/* Breadcrumb Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="left-content">
            <Heading level={1} className="text-2xl font-bold text-gray-900 dark:text-white">
                Enter Teleuser ID
            </Heading>
          </div>
          <div className="right-content">
            <span className="text-sm text-gray-500 dark:text-gray-400"></span>
          </div>
        </div>

        {/* Form Card - Always visible */}
        <Card>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-4">
              {/* Report Days Label */}
              <div>
                <Text className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Report Days
                </Text>
              </div>
              
              {/* Form Elements Row */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                {/* Teleuser ID Input */}
                <div className="w-full sm:w-1/3">
                  <Input
                    type="text"
                    id="selectteleform-teleform_user_id"
                    name="teleform_user_id"
                    value={formData.teleform_user_id}
                    onChange={handleInputChange}
                    placeholder="Enter Teleuser ID"
                    className={`w-full ${errors.teleform_user_id ? 'border-red-500' : ''}`}
                    autoComplete="off"
                    required
                  />
                  {errors.teleform_user_id && (
                    <Text className="text-red-500 text-sm mt-1">
                      {errors.teleform_user_id}
                    </Text>
                  )}
                </div>

                {/* User Phone Input */}
                <div className="w-full sm:w-1/3">
                  <Input
                    type="text"
                    id="selectteleform-user_phone"
                    name="user_phone"
                    value={formData.user_phone}
                    onChange={handleInputChange}
                    placeholder="Enter User Phone No"
                    className={`w-full ${errors.user_phone ? 'border-red-500' : ''}`}
                    autoComplete="off"
                    required
                  />
                  {errors.user_phone && (
                    <Text className="text-red-500 text-sm mt-1">
                      {errors.user_phone}
                    </Text>
                  )}
                </div>

                {/* Submit Button */}
                <div className="w-full sm:w-1/3">
                  <Button
                    type="submit"
                    className="w-full"
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Card>


        {/* New Call Section - Show only after form submission */}
        {showNewCallSection && (
          <>
            <div className="mt-10">
              <div className="left-content">
                <Heading level={1} className="text-2xl font-bold text-gray-900 dark:text-white">
                  {activeTab === 'new-calls' ? 'New Call' : 
                   activeTab === 'callback' ? 'Call Back Interview' : 
                   'Reschedule Interview'}
                </Heading>
              </div>
              <div className="right-content">
                <span className="text-sm text-gray-500 dark:text-gray-400"></span>
              </div>
            </div>
        <Card>
        <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4">
              <nav className="flex justify-between items-center">
                {/* Left side tabs */}
                <div className="flex space-x-8">
                  {tabs.filter(tab => tab.id !== 'reschedule').map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                
                {/* Right side tab */}
                <div className="flex">
                  {tabs.filter(tab => tab.id === 'reschedule').map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </nav>
            </div>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <Table className="table table-striped table-bordered">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Server ID</th>
                    <th>Web Form</th>
                    <th>Respondent Name</th>
                    {activeTab === 'callback' && <th>Call Attempt</th>}
                    {activeTab === 'reschedule' && <th>Reschedule Date Time</th>}
                    <th className="action-column">Connect To Call</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoggedIn && showTable && callData.length > 0 ? (
                    callData.map((call) => (
                      <tr key={call.id}>
                        <td>{call.id}</td>
                        <td>{call.serverId}</td>
                        <td>{call.webForm}</td>
                        <td>{call.respondentName}</td>
                        {activeTab === 'callback' && <td>{call.callAttempt}</td>}
                        {activeTab === 'reschedule' && <td>{call.rescheduleDateTime}</td>}
                        <td className="text-center">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleConnectToCall(call.id)}
                            className="text-white"
                          >
                            <Phone className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={activeTab === 'new-calls' ? 5 : activeTab === 'callback' ? 6 : 6} className="text-center py-8">
                        <div className="text-gray-500 dark:text-gray-400">
                          {isLoggedIn && showTable ? 'No results found.' : 'Please login to view data.'}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        </Card>
          </>
        )}
      </div>
    </Container>
  );
}
