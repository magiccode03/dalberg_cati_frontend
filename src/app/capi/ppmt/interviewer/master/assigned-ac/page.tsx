'use client';

import React, { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import { Loader2, Save, X, ChevronDown } from 'lucide-react';

// Mock AC data - replace with actual API call
const allACs = [
  { value: 1, label: 'Mekliganj (1)' },
  { value: 2, label: 'Mathabhanga (2)' },
  { value: 3, label: 'Cooch Behar Uttar (3)' },
  { value: 4, label: 'Cooch Behar Dakshin (4)' },
  { value: 5, label: 'Sitalkuchi (5)' },
  // Add more ACs as needed
];

const AssignedACContent = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get('user_id');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [selectedACs, setSelectedACs] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const filteredACs = allACs.filter(ac =>
      ac.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const allFilteredSelected = filteredACs.every(ac => selectedACs.includes(ac.value));
    setSelectAllChecked(allFilteredSelected && filteredACs.length > 0);
  }, [selectedACs, searchTerm]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Replace with actual API call
      // const response = await apiService.getInterviewerAssignedACs(userId);
      
      // Mock data
      setTimeout(() => {
        setUserName('wbop295');
        setSelectedACs([1, 2, 3]); // Mock selected ACs
        setLoading(false);
      }, 500);
      
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Error fetching user data');
      setLoading(false);
    }
  };

  const handleACToggle = (acValue: number) => {
    setSelectedACs(prev => {
      if (prev.includes(acValue)) {
        return prev.filter(v => v !== acValue);
      } else {
        return [...prev, acValue];
      }
    });
  };

  const handleSelectAllToggle = () => {
    const filteredACs = allACs
      .filter(ac => ac.label.toLowerCase().includes(searchTerm.toLowerCase()))
      .map(ac => ac.value);
    
    if (selectAllChecked) {
      // Deselect all filtered
      setSelectedACs(prev => prev.filter(v => !filteredACs.includes(v)));
    } else {
      // Select all filtered
      setSelectedACs(prev => [...new Set([...prev, ...filteredACs])]);
    }
  };

  const removeSelectedAC = (acValue: number) => {
    setSelectedACs(prev => prev.filter(v => v !== acValue));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      // TODO: Replace with actual API call
      // await apiService.updateInterviewerAssignedACs(userId, selectedACs);
      
      // Mock save
      setTimeout(() => {
        setSaving(false);
        alert('Assigned ACs updated successfully!');
      }, 1000);
      
    } catch (err) {
      console.error('Error saving assigned ACs:', err);
      setError('Error saving assigned ACs');
      setSaving(false);
    }
  };

  const filteredACs = allACs.filter(ac =>
    ac.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto main-container">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <Text>Loading user data...</Text>
          </div>
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
            Update Enumerator User: {userName}
          </Heading>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg">
          <Text className="text-red-800">{error}</Text>
        </div>
      )}

      {/* Main Card */}
      <Card>
        <div className="space-y-6">
          {/* Multi-Select Dropdown */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Assigned AC
            </label>
            
            {/* Selected Items Display */}
            <div className="min-h-[60px] border border-gray-300 rounded-lg p-3 bg-white">
              <div className="flex flex-wrap gap-2">
                {selectedACs.map((acValue) => {
                  const ac = allACs.find(a => a.value === acValue);
                  return ac ? (
                    <div
                      key={acValue}
                      className="inline-flex items-center bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                    >
                      <span>{ac.label}</span>
                      <button
                        onClick={() => removeSelectedAC(acValue)}
                        className="ml-2 hover:bg-gray-200 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : null;
                })}
              </div>
              
              {/* Dropdown Toggle */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 text-left text-gray-500 hover:text-gray-700"
                >
                  <span>Select AC</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
                    {/* Search Input */}
                    <div className="p-3 border-b border-gray-200">
                      <input
                        type="text"
                        placeholder="Search ACs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    {/* Select All Checkbox */}
                    <div className="p-3 border-b border-gray-200 bg-gray-50">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectAllChecked}
                          onChange={handleSelectAllToggle}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-700">Select all</span>
                      </label>
                    </div>

                    {/* AC Options */}
                    <div className="max-h-40 overflow-y-auto">
                      {filteredACs.map((ac) => (
                        <label
                          key={ac.value}
                          className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedACs.includes(ac.value)}
                            onChange={() => handleACToggle(ac.value)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-3 text-sm text-gray-700">{ac.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-start">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </Container>
  );
};

const AssignedACPage = () => {
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
      <AssignedACContent />
    </Suspense>
  );
};

export default AssignedACPage;
