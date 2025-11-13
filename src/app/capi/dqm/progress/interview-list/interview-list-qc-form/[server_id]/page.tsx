'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import SelectDropdown from '@/components/ui/SelectDropdown';
import Radio from '@/components/ui/Radio';
import Checkbox from '@/components/ui/Checkbox';
import Text from '@/components/ui/Text';
import { useToast, ToastContainer } from '@/components/ui/Toast';
import { Play, Pause } from 'lucide-react';
import AudioPlayer from '@/components/ui/AudioPlayer';

// Import form configurations
import formConfig from '../form-config.json';

// Global variable to track API calls across component mounts
const globalApiCallTracker = new Set<string>();

// Type definitions
interface FormOption {
  label: string | { en?: string; hi?: string; bn?: string };
  value: string;
  tag: string;
  survey_q_tag?: string;
}

interface FormField {
  type: string;
  label: string | { en?: string; hi?: string; bn?: string };
  tag: string;
  required?: boolean;
  conditional?: string;
  enable_condition?: string;
  options?: FormOption[];
  placeholder?: string;
  hint?: string | { en?: string; hi?: string; bn?: string };
  survey_q_tag?: string | {
    tag: string;
    options: Array<{
      value: number;
      lable: { en?: string; hi?: string; bn?: string };
      survey_q_tag?: string;
    }>;
  };
  min?: number;
  max?: number;
  maxLength?: number;
  maxSelections?: number;
  rules?: {
    clearFields?: Record<string, string[]>;
    showFields?: Record<string, string[]>;
    exclusiveOptions?: string[];
    excludeOptions?: string;
  };
}

function QCFormPage() {
  const router = useRouter();
  const params = useParams();
  const serverId = params.server_id as string;
  
  const [language, setLanguage] = useState<string>('en');
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [instanceData, setInstanceData] = useState<Record<string, any>>({});
  const [toasts, setToasts] = useState<any[]>([]);
  const [qcUserName, setQcUserName] = useState<string>('');
  const [qcUserId, setQcUserId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState<Set<string>>(new Set());
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const audioPlayerRef = useRef<HTMLDivElement>(null);
  const [audioError, setAudioError] = useState(false);
  const [useIframe, setUseIframe] = useState(false);
  const hasFetchedData = useRef(false); // Prevent multiple API calls
  const isInitialized = useRef(false); // Prevent multiple initializations
  
  // Use the imported formConfig directly
  const currentFormConfig = formConfig as FormField[];
  
  const showToast = useCallback((message: string, type: 'warning' | 'error' | 'success' | 'info' = 'warning') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newToast = {
      id,
      message,
      type,
      position: 'bottom-left' as const,
      duration: 3000,
    };
    setToasts(prev => [...prev, newToast]);
  }, []);
  
  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Audio error handling
  const handleAudioError = () => {
    console.error('Audio playback error');
    setAudioError(true);
  };

  const handleIframeError = () => {
    console.error('Iframe audio playback error');
    setAudioError(true);
  };

  // Fetch instance data from API - memoized to prevent recreation
  const fetchInstanceData = useCallback(async () => {
    // Check if we already have data in localStorage for this serverId
    const cachedDataKey = `instanceData_${serverId}`;
    const cachedData = localStorage.getItem(cachedDataKey);
    
    if (cachedData) {
      try {
        const parsedData = JSON.parse(cachedData);
        setInstanceData(parsedData);
        setLoading(false);
        return;
      } catch (error) {
        console.error('Error parsing cached data:', error);
        localStorage.removeItem(cachedDataKey);
      }
    }
    
    // Prevent multiple API calls using global tracker
    if (globalApiCallTracker.has(serverId)) {
      setLoading(false); // Ensure loading is set to false if API already called
      return;
    }
    
    globalApiCallTracker.add(serverId);
    
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      if (!token || !serverId) {
        setLoading(false);
        return;
      }

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      
      const response = await fetch(`${apiBaseUrl}/api/capi/instance/${serverId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success && data.data) {
        // Store complete instance data for reference
        setInstanceData(data.data);
        
        // Cache the data in localStorage for future use
        localStorage.setItem(cachedDataKey, JSON.stringify(data.data));
      } else {
        showToast('Failed to load interview data', 'error');
      }
    } catch (error) {
      console.error('Error fetching instance data:', error);
      showToast('Error loading interview data', 'error');
    } finally {
      setLoading(false);
    }
  }, [serverId]); // Removed showToast from dependencies to prevent recreation

  // Fetch interview QC data from DQM progress detail endpoint
  const fetchInterviewQcData = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token || !serverId) {
        return;
      }

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      
      // Fetch interview data from DQM progress detail endpoint with server_id filter
      const response = await fetch(`${apiBaseUrl}/api/capi/dqm/qc/interview/progress/detail?server_id=${serverId}&page=1&pageSize=1`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.success && data.data && Array.isArray(data.data.interviews) && data.data.interviews.length > 0) {
          const interview = data.data.interviews[0];
          
          // Load existing QC form data
          const qcFormData: Record<string, any> = {};
          
          // Load QC fields from interview data
          if (interview.qc_audio_status !== undefined && interview.qc_audio_status !== null) {
            qcFormData.qc_audio_status = String(interview.qc_audio_status);
          }
          if (interview.qc_q2 !== undefined && interview.qc_q2 !== null) {
            qcFormData.qc_q2 = String(interview.qc_q2);
          }
          if (interview.qc_q3 !== undefined && interview.qc_q3 !== null) {
            qcFormData.qc_q3 = String(interview.qc_q3);
          }
          if (interview.qc_q4 !== undefined && interview.qc_q4 !== null) {
            qcFormData.qc_q4 = String(interview.qc_q4);
          }
          if (interview.qc_q5 !== undefined && interview.qc_q5 !== null) {
            qcFormData.qc_q5 = String(interview.qc_q5);
          }
          if (interview.qc_q6 !== undefined && interview.qc_q6 !== null) {
            qcFormData.qc_q6 = String(interview.qc_q6);
          }
          if (interview.qc_q7 !== undefined && interview.qc_q7 !== null) {
            qcFormData.qc_q7 = String(interview.qc_q7);
          }
          if (interview.qc_q8 !== undefined && interview.qc_q8 !== null) {
            qcFormData.qc_q8 = String(interview.qc_q8);
          }
          if (interview.qc_q9 !== undefined && interview.qc_q9 !== null) {
            qcFormData.qc_q9 = String(interview.qc_q9);
          }
          
          // Set form data with existing QC values
          if (Object.keys(qcFormData).length > 0) {
            setFormData(prev => ({ ...prev, ...qcFormData }));
            setIsEditMode(true); // Enable edit mode when QC data exists
          }
        }
      }
    } catch (error) {
      console.error('Error fetching interview QC data:', error);
      // Don't show error toast as this is optional for editing existing data
    }
  }, [serverId]);

  // Load QC user data and interview data on mount - run only once
  useEffect(() => {
    const savedData = localStorage.getItem('qc_user_data');
    if (savedData) {
      try {
        const userData = JSON.parse(savedData);
        setQcUserName(userData.name || '');
        setQcUserId(userData.qc_id || '');
      } catch (err) {
        console.error('Error loading QC user data:', err);
      }
    }
    
    // Fetch instance data and QC data
    fetchInstanceData();
    fetchInterviewQcData();
  }, []); // Empty dependency array - run only once on mount

  // Clear field values when they become hidden due to conditions
  useEffect(() => {
    const fieldsToClear: string[] = [];
    
    currentFormConfig.forEach((field) => {
      const isVisible = isFieldVisible(field);
      const fieldValue = formData[field.tag];
      
      // If field is hidden and has a value, mark it for clearing
      if (!isVisible) {
        // Check if field has a value that needs to be cleared
        let hasValue = false;
        
        if (field.type === 'checkbox') {
          hasValue = Array.isArray(fieldValue) && fieldValue.length > 0;
        } else {
          hasValue = fieldValue !== undefined && fieldValue !== null && fieldValue !== '';
        }
        
        if (hasValue) {
          fieldsToClear.push(field.tag);
        }
      }
    });
    
    // Clear fields that became hidden (only if there are fields to clear)
    if (fieldsToClear.length > 0) {
      setFormData(prev => {
        const newData = { ...prev };
        let hasChanges = false;
        
        fieldsToClear.forEach(fieldTag => {
          const field = currentFormConfig.find(f => f.tag === fieldTag);
          if (field) {
            const currentValue = prev[fieldTag];
            // Set appropriate empty value based on field type
            if (field.type === 'checkbox') {
              if (Array.isArray(currentValue) && currentValue.length > 0) {
                newData[fieldTag] = [];
                hasChanges = true;
              }
            } else {
              if (currentValue !== undefined && currentValue !== null && currentValue !== '') {
                newData[fieldTag] = '';
                hasChanges = true;
              }
            }
          }
        });
        
        // Only return new object if there are actual changes to prevent unnecessary re-renders
        return hasChanges ? newData : prev;
      });
      
      // Clear validation errors for hidden fields
      setValidationErrors(prev => {
        const newErrors = new Set(prev);
        let hasChanges = false;
        
        fieldsToClear.forEach(fieldTag => {
          if (newErrors.has(fieldTag)) {
            newErrors.delete(fieldTag);
            hasChanges = true;
          }
        });
        
        return hasChanges ? newErrors : prev;
      });
    }
  }, [formData, instanceData, currentFormConfig]); // Re-run when formData or instanceData changes

  // Handle scroll for sticky audio player - optimized to prevent unnecessary re-renders
  useEffect(() => {
    let ticking = false;
    let originalTop = 0;
    let isInitialized = false;
    let lastStickyState = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (audioPlayerRef.current) {
            // Store original position on first scroll
            if (!isInitialized) {
              const rect = audioPlayerRef.current.getBoundingClientRect();
              originalTop = rect.top + window.scrollY;
              isInitialized = true;
            }
            
            const currentScrollY = window.scrollY;
            const rect = audioPlayerRef.current.getBoundingClientRect();
            
            // Only become sticky if we've scrolled past the original position
            // and the element is not in its original position
            const shouldBeSticky = currentScrollY > (originalTop - 64) && rect.top <= 64;
            
            // Only update state if the sticky state actually changed to prevent unnecessary re-renders
            if (shouldBeSticky !== lastStickyState) {
              lastStickyState = shouldBeSticky;
              setIsSticky(shouldBeSticky);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Helper function to get label in current language - memoized to prevent re-creation
  const getLabel = useCallback((label: string | { en?: string; hi?: string; bn?: string }): string => {
    if (typeof label === 'string') return label;
    return label[language as keyof typeof label] || label.en || '';
  }, [language]);

  // Helper function to get survey answer display value - memoized to prevent re-creation
  const getSurveyAnswerDisplay = useCallback((field: FormField): string | null => {
    if (!field.survey_q_tag) return null;
    
    // Handle object structure with options
    if (typeof field.survey_q_tag === 'object' && field.survey_q_tag.tag && field.survey_q_tag.options) {
      const tag = field.survey_q_tag.tag;
      const options = field.survey_q_tag.options;
      const surveyValue = instanceData[tag];
      
      if (surveyValue === undefined || surveyValue === null) return null;
      
      // Find matching option
      const matchingOption = options.find(opt => opt.value == surveyValue);
      if (matchingOption && matchingOption.lable) {
        let displayText = getLabel(matchingOption.lable);
        
        // Check if this option has a survey_q_tag for "Others" responses
        if (matchingOption.survey_q_tag && instanceData[matchingOption.survey_q_tag]) {
          const otherValue = instanceData[matchingOption.survey_q_tag];
          if (otherValue && otherValue.trim() !== '') {
            displayText += `: ${otherValue}`;
          }
        }
        
        return displayText;
      }
      
      // Fallback to raw value if no matching option found
      return String(surveyValue);
    }
    
    // Handle simple string tag
    if (typeof field.survey_q_tag === 'string') {
      const surveyValue = instanceData[field.survey_q_tag];
      return surveyValue !== undefined && surveyValue !== null ? String(surveyValue) : null;
    }
    
    return null;
  }, [instanceData, getLabel]);

  // Get audio URL from instance data - memoized to prevent re-renders
  const audioUrl = useMemo(() => {
    if (!instanceData.audio1) return null;
    
    // Get first audio file if comma-separated
    const audioFile = instanceData.audio1.split(',')[0].trim();
    if (!audioFile) return null;
    
    return `https://convergentview.co.in/image/showimage?formid=49&instanceid=${serverId}&image=${audioFile}`;
  }, [instanceData.audio1, serverId]);

  // Format duration in hh:mm:ss format - memoized to prevent re-creation
  const formatDuration = useCallback((seconds: string | null | undefined): string => {
    if (!seconds) return '00:00:00';
    
    const totalSeconds = parseInt(seconds);
    if (isNaN(totalSeconds)) return '00:00:00';
    
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const remainingSeconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  // Memoized language options to prevent re-creation
  const languageOptions = useMemo(() => [
    { value: 'en', label: 'English' },
    { value: 'bn', label: 'বাংলা' },
    { value: 'hi', label: 'हिंदी' },
  ], []);

  // Evaluate conditional expressions
  const evaluateCondition = (condition: string, useInstanceData: boolean = false): boolean => {
    if (!condition) return true;
    
    try {
      // Replace field names with their values
      let expr = condition;
      
      // Choose data source based on flag
      const dataSource = useInstanceData ? instanceData : formData;
      
      // Handle numeric comparisons (>=, <=, >, <)
      const numericPattern = /(\w+)\s*(>=|<=|>|<)\s*(\d+)/g;
      expr = expr.replace(numericPattern, (match, field, operator, value) => {
        const fieldValue = dataSource[field];
        if (fieldValue === undefined || fieldValue === '' || fieldValue === null) {
          return 'false';
        }
        const numValue = parseInt(fieldValue);
        const compareValue = parseInt(value);
        if (isNaN(numValue)) return 'false';
        
        switch (operator) {
          case '>=': return (numValue >= compareValue).toString();
          case '<=': return (numValue <= compareValue).toString();
          case '>': return (numValue > compareValue).toString();
          case '<': return (numValue < compareValue).toString();
          default: return 'false';
        }
      });
      
      // Handle string comparisons (===, !==)
      const stringPattern = /(\w+)\s*(===|!==)\s*'(\d+)'/g;
      expr = expr.replace(stringPattern, (match, field, operator, value) => {
        const fieldValue = dataSource[field];
        if (fieldValue === undefined || fieldValue === null) {
          return operator === '!==' ? 'true' : 'false';
        }
        const stringValue = String(fieldValue);
        
        if (operator === '===') {
          return (stringValue === value).toString();
        } else {
          return (stringValue !== value).toString();
        }
      });
      
      // Handle array includes
      const includesPattern = /(\w+)\.includes\('(\d+)'\)/g;
      expr = expr.replace(includesPattern, (match, field, value) => {
        const fieldValue = dataSource[field];
        if (!Array.isArray(fieldValue)) return 'false';
        return fieldValue.includes(value).toString();
      });
      
      // Handle && and || operators
      expr = expr.replace(/&&/g, ' && ').replace(/\|\|/g, ' || ');
      
      // Safely evaluate
      return eval(expr);
    } catch (err) {
      console.error('Error evaluating condition:', condition, err);
      return false;
    }
  };

  // Check if field should be visible
  const isFieldVisible = (field: FormField): boolean => {
    // Check enable_condition first (based on instance/survey data)
    if (field.enable_condition) {
      const isEnabled = evaluateCondition(field.enable_condition, true);
      if (!isEnabled) return false;
    }
    
    // Check conditional (based on form data)
    if (field.conditional) {
      return evaluateCondition(field.conditional, false);
    }
    
    return true;
  };

  // Handle input change
  const handleInputChange = (fieldTag: string, value: any, field: FormField) => {
    setFormData(prev => {
      const newData = { ...prev, [fieldTag]: value };
      
      // Clear validation error for this field when user starts typing
      if (value && value !== '') {
        setValidationErrors(prev => {
          const newErrors = new Set(prev);
          newErrors.delete(fieldTag);
          return newErrors;
        });
      }
      
      // Apply clearing rules
      if (field.rules?.clearFields) {
        const clearRules = field.rules.clearFields;
        
        // For radio/select fields
        if (field.type === 'radio') {
          const selectedOption = field.options?.find(opt => opt.value === value);
          if (selectedOption && clearRules[selectedOption.tag]) {
            clearRules[selectedOption.tag].forEach(fieldToClear => {
              newData[fieldToClear] = Array.isArray(newData[fieldToClear]) ? [] : '';
            });
          }
        }
      }
      
      return newData;
    });
  };

  // Handle checkbox change
  const handleCheckboxChange = (fieldTag: string, optionValue: string, checked: boolean, field: FormField) => {
    setFormData(prev => {
      const currentValues = (prev[fieldTag] as string[]) || [];
      const exclusiveOptions = field.rules?.exclusiveOptions || [];
      const isExclusive = exclusiveOptions.includes(optionValue);
      const maxSelections = field.maxSelections || 999;
      
      let newValues: string[];
      
      if (isExclusive && checked) {
        // Selecting exclusive option - clear all others
        newValues = [optionValue];
      } else if (checked) {
        // Selecting regular option - remove exclusive options
        const filteredValues = currentValues.filter(v => !exclusiveOptions.includes(v));
        
        // Check max selection limit
        if (filteredValues.length >= maxSelections) {
          showToast(`You can select a maximum of ${maxSelections} options.`, 'warning');
          return prev;
        }
        
        newValues = [...filteredValues, optionValue];
      } else {
        // Unchecking
        newValues = currentValues.filter(v => v !== optionValue);
      }
      
      const newData = { ...prev, [fieldTag]: newValues };
      
      // Clear validation error for this field when user selects an option
      if (newValues.length > 0) {
        setValidationErrors(prev => {
          const newErrors = new Set(prev);
          newErrors.delete(fieldTag);
          return newErrors;
        });
      }
      
      // Handle clearing of "Others" text fields
      if (field.rules?.showFields) {
        Object.entries(field.rules.showFields).forEach(([optTag, fieldsToShow]) => {
          const option = field.options?.find(opt => opt.tag === optTag);
          if (option && !newValues.includes(option.value)) {
            fieldsToShow.forEach(fieldToClear => {
              newData[fieldToClear] = '';
            });
          }
        });
      }
      
      return newData;
    });
  };

  // Transform checkbox data to individual fields and convert string values to integers
  const transformFormDataForSubmission = (data: Record<string, any>) => {
    const transformed: Record<string, any> = {};
    
    currentFormConfig.forEach((field) => {
      const fieldValue = data[field.tag];
      
      if (field.type === 'checkbox' && Array.isArray(fieldValue)) {
        // For checkbox fields, create individual fields for each option
        field.options?.forEach((option) => {
          const fieldName = `${field.tag}_${option.value}`;
          transformed[fieldName] = fieldValue.includes(option.value) ? 1 : null;
        });
      } else if (field.type !== 'checkbox') {
        // For non-checkbox fields, convert to appropriate type
        if (fieldValue === undefined || fieldValue === null || fieldValue === '') {
          transformed[field.tag] = null;
        } else if (field.type === 'radio' || field.type === 'number') {
          // Convert radio button values and number inputs to integers
          const numValue = parseInt(fieldValue);
          transformed[field.tag] = isNaN(numValue) ? null : numValue;
        } else {
          // Keep text and other types as strings
          transformed[field.tag] = fieldValue;
        }
      }
    });
    
    return transformed;
  };


  // Save form data
  const saveFormData = async (qcOutcome: number, rejectionLevel: number) => {
    try {
      setIsSubmitting(true);
      
      const token = localStorage.getItem('accessToken');
      if (!token) {
        showToast('No authentication token found', 'error');
        return false;
      }

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
      
      // Build request body with all form data
      const requestBody: Record<string, any> = {
        audio_qc_status: qcOutcome, // 1 = Pass, 2 = Fail
        audio_qc_rejection_level: rejectionLevel, // 0 for pass, question number for fail
        audio_qc_complete_date: currentDate, // Date of submission
        status: qcOutcome == 1 ? 10 : 20,
        status_reason_reject: qcOutcome == 2 ? 25 : null,
      };
      
      // Add form field values if they exist
      const formFields = ['qc_audio_status', 'qc_q2', 'qc_q3', 'qc_q4', 'qc_q5', 'qc_q6', 'qc_q7', 'qc_q8', 'qc_q9'];
      
      formFields.forEach(fieldTag => {
        const fieldValue = formData[fieldTag];
        
        // For qc_q9 (text/remark field), always include it even if empty to allow clearing the value
        if (fieldTag === 'qc_q9') {
          requestBody[fieldTag] = fieldValue !== undefined && fieldValue !== null ? fieldValue : '';
        } else {
          // For other fields, only include if they have a value
          if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
            const numValue = parseInt(fieldValue);
            requestBody[fieldTag] = isNaN(numValue) ? fieldValue : numValue;
          }
        }
      });
      
      console.log('Submitting QC data:', requestBody);
      
      const response = await fetch(`${apiBaseUrl}/api/capi/interviews/${serverId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      const data = await response.json();
      
      if (data.success) {
        return true;
      } else {
        showToast(data.message || 'Failed to save form', 'error');
        return false;
      }
    } catch (error) {
      console.error('Error saving form:', error);
      showToast('Failed to save form. Please try again.', 'error');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validate all required fields
  const validateForm = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    // Get all visible fields that are required
    currentFormConfig.forEach((field) => {
      if (field.required && isFieldVisible(field)) {
        const fieldValue = formData[field.tag];
        
        // Check if field is empty
        if (field.type === 'checkbox') {
          if (!Array.isArray(fieldValue) || fieldValue.length === 0) {
            errors.push(getLabel(field.label));
          }
        } else {
          if (fieldValue === undefined || fieldValue === null || fieldValue === '') {
            errors.push(getLabel(field.label));
          }
        }
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  // Determine QC outcome based on form data
  const determineQCOutcome = (): { outcome: number; rejectionLevel: number } => {
    const qcAudioStatus = formData.qc_audio_status; // This is the question answer (1, 2, 3, 4, 7, 8)
    
    // If qc_audio_status is 2 (No Conversation), 3 (Irrelevant), or 8 (Duplicate), it's fail
    if (qcAudioStatus === '2' || qcAudioStatus === '3' || qcAudioStatus === '8') {
      return { outcome: 2, rejectionLevel: 1 }; // Fail at audio status level
    }
    
    // If qc_audio_status is 1 (Survey Conversation can be heard), 4 (Interviewer more than respondent), or 7 (Cannot hear clearly), check other mandatory questions
    if (qcAudioStatus === '1' || qcAudioStatus === '4' || qcAudioStatus === '7') {
      // Check if all mandatory questions are answered with "Matched" (value "1")
      const mandatoryQuestions = ['qc_q2', 'qc_q3']; //'qc_q2', 'qc_q3', 'qc_q4', 'qc_q5'
      if(Number(instanceData.resp_age) >= 19) {
        mandatoryQuestions.push('qc_q5');
      }
      if(Number(instanceData.resp_age) >= 22) {
        mandatoryQuestions.push('qc_q4');
      }
        
      for (const question of mandatoryQuestions) {
        if (formData[question] !== '1') {
          // Find which question failed and set rejection level
          const questionKey = parseInt(question.replace('qc_q', ''));
          return { outcome: 2, rejectionLevel: questionKey }; // Fail at specific question level
        }
      }
      
      // Check for "Cannot hear the response clearly" condition
      // Count how many questions have value "3" (Cannot hear the response clearly)
      const allQuestions = ['qc_q2', 'qc_q3', 'qc_q4', 'qc_q5', 'qc_q6'];
      let cannotHearCount = 0;
      
      allQuestions.forEach(question => {
        if (formData[question] === '3') {
          cannotHearCount++;
        }
      });
      
      // If more than 3 questions have "Cannot hear the response clearly", it's fail
      if (cannotHearCount > 3) {
        return { outcome: 2, rejectionLevel: 6 }; // Fail due to too many "cannot hear clearly" responses
      }
      
      return { outcome: 1, rejectionLevel: 0 }; // Pass
    }
    
    // Default to fail
    return { outcome: 2, rejectionLevel: 1 };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submission
    const validation = validateForm();
    
    if (!validation.isValid) {
      // Set validation errors for highlighting
      const errorFields = new Set<string>();
      currentFormConfig.forEach((field) => {
        if (field.required && isFieldVisible(field)) {
          const fieldValue = formData[field.tag];
          const isEmpty = field.type === 'checkbox' 
            ? !Array.isArray(fieldValue) || fieldValue.length === 0
            : fieldValue === undefined || fieldValue === null || fieldValue === '';
          
          if (isEmpty) {
            errorFields.add(field.tag);
          }
        }
      });
      setValidationErrors(errorFields);
      
      showToast(`Please fill all required fields. Missing: ${validation.errors.slice(0, 3).join(', ')}${validation.errors.length > 3 ? ` and ${validation.errors.length - 3} more...` : ''}`, 'error');
      
      // Scroll to first error
      const firstErrorField = currentFormConfig.find(
        field => field.required && isFieldVisible(field) && 
        (formData[field.tag] === undefined || formData[field.tag] === null || formData[field.tag] === '')
      );
      
      if (firstErrorField) {
        const element = document.getElementById(`${firstErrorField.tag}_container`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      
      return;
    }
    
    // Clear validation errors if form is valid
    setValidationErrors(new Set());
    
    // Determine QC outcome
    const { outcome, rejectionLevel } = determineQCOutcome();
    const outcomeText = outcome === 1 ? 'Pass' : 'Fail';
    
    showToast(`Processing QC evaluation... (${outcomeText})`, 'info');
    
    const success = await saveFormData(outcome, rejectionLevel);
    
    if (success) {
      const message = isEditMode 
        ? `QC evaluation updated successfully! Interview marked as ${outcomeText}.`
        : `QC evaluation completed! Interview marked as ${outcomeText}.`;
      showToast(message, 'success');
      
      setTimeout(() => {
        router.push(`/capi/dqm/progress/interview-list`);
      }, 1500);
    }
  };

  // Render field based on type
  const renderField = (field: FormField, index: number) => {
    if (!isFieldVisible(field)) return null;

    const fieldValue = formData[field.tag] || (field.type === 'checkbox' ? [] : '');
    const isEmpty = field.type === 'checkbox' 
      ? !Array.isArray(fieldValue) || fieldValue.length === 0
      : fieldValue === undefined || fieldValue === null || fieldValue === '';
    
    const hasError = validationErrors.has(field.tag);

    switch (field.type) {
      case 'radio':
        return (
          <div 
            key={index} 
            id={`${field.tag}_container`} 
            className={`mb-3 sm:mb-4 md:mb-6 p-2 sm:p-3 md:p-4 rounded-lg border-2 transition-all duration-300 ${
              hasError 
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20 shadow-lg shadow-red-200 dark:shadow-red-900/20' 
                : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'
            }`}
          >
            <Text className={`text-sm sm:text-base font-medium mb-2 sm:mb-3 leading-relaxed ${
              hasError 
                ? 'text-red-700 dark:text-red-300' 
                : 'text-blue-600 dark:text-blue-400'
            }`}>
              {getLabel(field.label)}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Text>
            {field.hint && (
              <Text className="text-xs text-gray-500 dark:text-gray-400 mb-2 italic">
                {getLabel(field.hint)}
              </Text>
            )}
            {getSurveyAnswerDisplay(field) && (
              <div className="mb-2 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded text-xs">
                <Text className="text-blue-800 dark:text-blue-300">
                  Survey Answer: <span className="font-semibold">{getSurveyAnswerDisplay(field)}</span>
                </Text>
              </div>
            )}
            {hasError && (
              <div className="mb-2 sm:mb-3 p-2 bg-red-100 dark:bg-red-800/30 border border-red-300 dark:border-red-600 rounded text-xs sm:text-sm text-red-700 dark:text-red-300">
                <i className="fa fa-exclamation-triangle mr-2"></i>
                This field is required
              </div>
            )}
            <div className="space-y-2 sm:space-y-3">
              {field.options?.map(option => (
                <Radio
                  key={option.tag}
                  id={`${field.tag}_${option.value}`}
                  name={field.tag}
                  value={option.value}
                  label={getLabel(option.label)}
                  checked={fieldValue === option.value}
                  onChange={() => handleInputChange(field.tag, option.value, field)}
                />
              ))}
            </div>
          </div>
        );

      case 'checkbox':
        return (
          <div 
            key={index} 
            id={`${field.tag}_container`} 
            className={`mb-3 sm:mb-4 md:mb-6 p-2 sm:p-3 md:p-4 rounded-lg border-2 transition-all duration-300 ${
              hasError 
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20 shadow-lg shadow-red-200 dark:shadow-red-900/20' 
                : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'
            }`}
          >
            <Text className={`text-sm sm:text-base font-medium mb-2 sm:mb-3 leading-relaxed ${
              hasError 
                ? 'text-red-700 dark:text-red-300' 
                : 'text-blue-600 dark:text-blue-400'
            }`}>
              {getLabel(field.label)}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Text>
            {field.hint && (
              <Text className="text-xs text-gray-500 dark:text-gray-400 mb-2 italic">
                {getLabel(field.hint)}
              </Text>
            )}
            {hasError && (
              <div className="mb-2 sm:mb-3 p-2 bg-red-100 dark:bg-red-800/30 border border-red-300 dark:border-red-600 rounded text-xs sm:text-sm text-red-700 dark:text-red-300">
                <i className="fa fa-exclamation-triangle mr-2"></i>
                This field is required
              </div>
            )}
            <div className="space-y-2 sm:space-y-3">
              {field.options?.map(option => (
                <Checkbox
                  key={option.tag}
                  id={`${field.tag}_${option.value}`}
                  label={getLabel(option.label)}
                  checked={(fieldValue as string[]).includes(option.value)}
                  onCheckedChange={(checked) => handleCheckboxChange(field.tag, option.value, checked, field)}
                />
              ))}
            </div>
          </div>
        );

      case 'text':
        return (
          <div 
            key={index} 
            id={`${field.tag}_container`} 
            className={`mb-3 sm:mb-4 md:mb-6 p-2 sm:p-3 md:p-4 rounded-lg border-2 transition-all duration-300 ${
              hasError 
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20 shadow-lg shadow-red-200 dark:shadow-red-900/20' 
                : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'
            }`}
          >
            {hasError && (
              <div className="mb-2 sm:mb-3 p-2 bg-red-100 dark:bg-red-800/30 border border-red-300 dark:border-red-600 rounded text-xs sm:text-sm text-red-700 dark:text-red-300">
                <i className="fa fa-exclamation-triangle mr-2"></i>
                This field is required
              </div>
            )}
            <Input
              label={getLabel(field.label)}
              value={fieldValue}
              onChange={(e) => handleInputChange(field.tag, e.target.value, field)}
              required={field.required}
              placeholder={field.placeholder}
              maxLength={field.maxLength}
              className={hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
            />
          </div>
        );

      case 'number':
        return (
          <div 
            key={index} 
            id={`${field.tag}_container`} 
            className={`mb-3 sm:mb-4 md:mb-6 p-2 sm:p-3 md:p-4 rounded-lg border-2 transition-all duration-300 ${
              hasError 
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20 shadow-lg shadow-red-200 dark:shadow-red-900/20' 
                : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'
            }`}
          >
            {hasError && (
              <div className="mb-2 sm:mb-3 p-2 bg-red-100 dark:bg-red-800/30 border border-red-300 dark:border-red-600 rounded text-xs sm:text-sm text-red-700 dark:text-red-300">
                <i className="fa fa-exclamation-triangle mr-2"></i>
                This field is required
              </div>
            )}
            <Input
              type="number"
              label={getLabel(field.label)}
              value={fieldValue}
              onChange={(e) => handleInputChange(field.tag, e.target.value, field)}
              required={field.required}
              min={field.min}
              max={field.max}
              placeholder={field.placeholder}
              className={hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
            />
          </div>
        );

      case 'datetime-local':
        return (
          <div 
            key={index} 
            id={`${field.tag}_container`} 
            className={`mb-3 sm:mb-4 md:mb-6 p-2 sm:p-3 md:p-4 rounded-lg border-2 transition-all duration-300 ${
              hasError 
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20 shadow-lg shadow-red-200 dark:shadow-red-900/20' 
                : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'
            }`}
          >
            {hasError && (
              <div className="mb-2 sm:mb-3 p-2 bg-red-100 dark:bg-red-800/30 border border-red-300 dark:border-red-600 rounded text-xs sm:text-sm text-red-700 dark:text-red-300">
                <i className="fa fa-exclamation-triangle mr-2"></i>
                This field is required
              </div>
            )}
            <Input
              type="datetime-local"
              label={getLabel(field.label)}
              value={fieldValue}
              onChange={(e) => handleInputChange(field.tag, e.target.value, field)}
              placeholder={field.placeholder}
              className={hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
            />
          </div>
        );

      default:
        return null;
    }
  };


  if (loading) {
  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto py-3 sm:py-4 md:py-6 px-2 sm:px-4">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <Text className="text-gray-600">Loading interview data...</Text>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto py-3 sm:py-4 md:py-6 px-2 sm:px-4">
      {/* Sticky Audio Player */}
      {audioUrl && (
        <>
          <div
            ref={audioPlayerRef}
            className={`${
              isSticky 
                ? 'fixed top-16 left-0 right-0 z-[60] shadow-lg transform translate-y-0' 
                : 'relative mb-4'
            } transition-transform duration-200 ease-out`}
          >
            <Card className={`${isSticky ? 'rounded-none' : ''}`}>
              <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                <div className="flex items-center gap-4 max-w-7xl mx-auto">
                  <div className="flex-1 min-w-0">
                    <div className="mb-3 text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {useIframe ? 'Using alternative player' : 'Click play to start the audio'}
                      </p>
                      {audioError && !useIframe && (
                        <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                          Audio player had an issue. Try the alternative options below.
                        </p>
                      )}
                    </div>

                    {!useIframe ? (
                      audioUrl ? (
                        <audio
                          controls
                          className="w-full"
                          controlsList="nodownload noplaybackrate"
                          preload="metadata"
                          onError={handleAudioError}
                          onLoadStart={() => console.log('Audio loading started')}
                          onCanPlay={() => console.log('Audio can play')}
                        >
                          <source src={audioUrl} type="audio/mpeg" />
                          <source src={audioUrl} type="audio/mp3" />
                          Your browser does not support the audio element.
                        </audio>
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          No audio file available for this interview.
                        </div>
                      )
                    ) : (
                      audioUrl ? (
                        <div className="w-full">
                          <iframe
                            src={audioUrl}
                            className="w-full h-16 border-0 rounded"
                            title="Audio Player"
                            allow="autoplay"
                            onError={handleIframeError}
                            onLoad={() => {
                              // Check if iframe content is just text (not audio player)
                              setTimeout(() => {
                                try {
                                  const iframe = document.querySelector('iframe[title="Audio Player"]') as HTMLIFrameElement;
                                  if (iframe && iframe.contentDocument) {
                                    const bodyText = iframe.contentDocument.body?.textContent?.trim();
                                    if (bodyText && bodyText.includes('recording for v2 is working fine')) {
                                      console.warn('Iframe returned text instead of audio player');
                                      setAudioError(true);
                                    }
                                  }
                                } catch (e) {
                                  // Cross-origin restrictions, can't access iframe content
                                  console.log('Cannot access iframe content due to CORS');
                                }
                              }, 1000);
                            }}
                          />
                        </div>
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          No audio file available for this interview.
                        </div>
                      )
                    )}

                    {/* Error Message for Failed Audio */}
                    {audioError && (
                      <div className="w-full p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg mt-4">
                        <div className="text-center">
                          <div className="text-red-600 dark:text-red-400 mb-2">
                            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="font-semibold">Audio Playback Failed</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              The audio URL is not serving playable content. The server returned: "recording for v2 is working fine."
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Alternative Options */}
                    <div className="mt-4 flex justify-center items-center">
                      {!useIframe && audioError && (
                        <button
                          onClick={() => setUseIframe(true)}
                          className="text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                          Try Alternative Player
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          {/* Spacer to prevent content jump when sticky */}
          {isSticky && <div style={{ height: '64px' }} />}
        </>
      )}

      {/* Header and Language Selector */}
      <div className="mb-3 sm:mb-4 md:mb-6">
        <Card className="p-3 sm:p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <Heading level={4} className="text-base sm:text-lg md:text-xl">
                {isEditMode ? 'Edit Audio QC Form' : 'Audio QC Form'}
              </Heading>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 space-y-0.5">
                <div>Server ID: <span className="font-mono font-semibold">{serverId}</span></div>
                {instanceData.ac_name && (
                  <div>AC: <span className="font-semibold">{instanceData.ac_code} - {instanceData.ac_name}</span></div>
                )}
                {instanceData.interviewer_id && (
                  <div>Interviewer ID: <span className="font-semibold">{instanceData.interviewer_id} - {instanceData.interviewer_name}</span></div>
                )}
                {/* {instanceData.district_name && (
                  <div>District: <span className="font-semibold">{instanceData.district_name}</span></div>
                )}
                <div>QC User: <span className="font-semibold">{qcUserName} (ID: {qcUserId})</span></div> */}
            </div>
              </div>
              
              {/* Language Selector */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <Text className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Language:</Text>
              <div className="w-full sm:w-48">
                  <SelectDropdown
                  options={languageOptions}
                    value={language}
                    onChange={(value) => setLanguage(value as string)}
                    placeholder="Select Language"
                  />
              </div>
            </div>
          </div>
        </Card>
      </div>

      <form onSubmit={handleSubmit}>
        {/* QC Questions Card */}
        <Card className="p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
          <Heading level={4} className="text-base sm:text-lg md:text-xl text-gray-900 dark:text-white mb-3 sm:mb-4 md:mb-6">
            Quality Control Questions
          </Heading>
          {currentFormConfig.map((field, index) => renderField(field, index))}
        </Card>

        {/* Submit Button */}
        <Card className="p-3 sm:p-4 md:p-6">
          <div className="flex justify-center">
            <Button 
              type="submit" 
              size="lg"
              disabled={isSubmitting}
              className="w-full sm:w-auto sm:min-w-[200px] bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base"
            >
              <i className="fa fa-paper-plane mr-2"></i>
              {isSubmitting ? 'Processing...' : isEditMode ? 'Update QC Evaluation' : 'Submit'}
            </Button>
          </div>
        </Card>
      </form>
      
      {/* Toast Container */}
      <ToastContainer
        toasts={toasts}
        onRemove={removeToast}
        position="bottom-left"
      />
    </Container>
  );
}

// Wrap component with React.memo to prevent unnecessary re-renders
export default React.memo(QCFormPage);

