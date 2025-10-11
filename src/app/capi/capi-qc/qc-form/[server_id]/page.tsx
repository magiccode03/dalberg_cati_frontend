'use client';

import React, { useState, useEffect, useRef } from 'react';
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
import { Volume2, Play, Pause } from 'lucide-react';

// Import form configurations
import formConfig from '../form-config.json';

// Type definitions
interface FormOption {
  label: string | { en?: string; hi?: string; bn?: string };
  value: string;
  tag: string;
}

interface FormField {
  type: string;
  label: string | { en?: string; hi?: string; bn?: string };
  tag: string;
  required?: boolean;
  conditional?: string;
  options?: FormOption[];
  placeholder?: string;
  hint?: string | { en?: string; hi?: string; bn?: string };
  survey_q_tag?: string | {
    tag: string;
    options: Array<{
      value: number;
      lable: { en?: string; hi?: string; bn?: string };
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

export default function QCFormPage() {
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
  const [isSticky, setIsSticky] = useState(false);
  const audioPlayerRef = useRef<HTMLDivElement>(null);
  
  // Use the imported formConfig directly
  const currentFormConfig = formConfig as FormField[];
  
  const showToast = (message: string, type: 'warning' | 'error' | 'success' | 'info' = 'warning') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newToast = {
      id,
      message,
      type,
      position: 'bottom-left' as const,
      duration: 3000,
    };
    setToasts(prev => [...prev, newToast]);
  };
  
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Load QC user data and interview data on mount
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
    
    // Fetch instance data
    fetchInstanceData();
  }, []);

  // Handle scroll for sticky audio player
  useEffect(() => {
    let ticking = false;
    let originalTop = 0;
    let isInitialized = false;
    
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
            setIsSticky(shouldBeSticky);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch instance data from API
  const fetchInstanceData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      if (!token || !serverId) return;

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
        console.log('Instance data loaded:', data.data);
      } else {
        showToast('Failed to load interview data', 'error');
      }
    } catch (error) {
      console.error('Error fetching instance data:', error);
      showToast('Error loading interview data', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get label in current language
  const getLabel = (label: string | { en?: string; hi?: string; bn?: string }): string => {
    if (typeof label === 'string') return label;
    return label[language as keyof typeof label] || label.en || '';
  };

  // Helper function to get survey answer display value
  const getSurveyAnswerDisplay = (field: FormField): string | null => {
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
        return getLabel(matchingOption.lable);
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
  };

  // Get audio URL from instance data
  const getAudioUrl = (): string | null => {
    if (!instanceData.audio1) return null;
    
    // Get first audio file if comma-separated
    const audioFile = instanceData.audio1.split(',')[0].trim();
    if (!audioFile) return null;
    
    return `https://convergentview.co.in/image/showimage?formid=49&instanceid=${serverId}&image=${audioFile}`;
  };

  // Format duration in hh:mm:ss format
  const formatDuration = (seconds: string | null | undefined): string => {
    if (!seconds) return '00:00:00';
    
    const totalSeconds = parseInt(seconds);
    if (isNaN(totalSeconds)) return '00:00:00';
    
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const remainingSeconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const audioUrl = getAudioUrl();

  // Evaluate conditional expressions
  const evaluateCondition = (condition: string): boolean => {
    if (!condition) return true;
    
    try {
      // Replace field names with their values
      let expr = condition;
      
      // Handle numeric comparisons (>=, <=, >, <)
      const numericPattern = /(\w+)\s*(>=|<=|>|<)\s*(\d+)/g;
      expr = expr.replace(numericPattern, (match, field, operator, value) => {
        const fieldValue = formData[field];
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
        const fieldValue = formData[field];
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
        const fieldValue = formData[field];
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
    if (!field.conditional) return true;
    return evaluateCondition(field.conditional);
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
  const saveFormData = async (finalSubmit: number) => {
    try {
      setIsSubmitting(true);
      
      const token = localStorage.getItem('accessToken');
      if (!token) {
        showToast('No authentication token found', 'error');
        return false;
      }

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const currentTime = new Date().toLocaleString();
      
      // Determine QC status
      // audio_qc_status: 1 = Pass, 2 = Fail, 3 = Pending
      let audio_qc_status = 3; // Default to pending
      if (finalSubmit === 1) {
        audio_qc_status = 1; // Pass
      } else if (finalSubmit === 2) {
        audio_qc_status = 2; // Fail
      }
      
      // Transform form data to match backend expectations
      const transformedData = transformFormDataForSubmission(formData);
      
      const submissionData = {
        ...transformedData,
        audio_qc_status: audio_qc_status,
        language_used: language,
        user_timezone: timezone,
        user_localdatetime: currentTime,
      };
      
      const response = await fetch(`${apiBaseUrl}/api/capi/interviews/${serverId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          audio_qc_status: audio_qc_status
        })
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
  const determineQCOutcome = (): number => {
    const audioStatus = formData.qc_audio_status;
    
    // If audio status is 2 (No Conversation) or 3 (Irrelevant), it's fail
    if (audioStatus === '2' || audioStatus === '3') {
      return 2; // Fail
    }
    
    // If audio status is 1 (Survey Conversation can be heard) or 4 (Interviewer more than respondent), check other mandatory questions
    if (audioStatus === '1' || audioStatus === '4') {
      // Check if all mandatory questions are answered with "Matched" (value "1")
      const mandatoryQuestions = ['qc_q2', 'qc_q3', 'qc_q4', 'qc_q5'];
      
      for (const question of mandatoryQuestions) {
        if (formData[question] !== '1') {
          return 2; // Fail
        }
      }
      
      return 1; // Pass
    }
    
    // Default to fail
    return 2;
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
    const qcOutcome = determineQCOutcome();
    const outcomeText = qcOutcome === 1 ? 'Pass' : 'Fail';
    
    showToast(`Processing QC evaluation... (${outcomeText})`, 'info');
    
    const success = await saveFormData(qcOutcome);
    
    if (success) {
      showToast(`QC evaluation completed! Interview marked as ${outcomeText}.`, 'success');
      
      setTimeout(() => {
        router.push(`/capi/capi-qc/new-qc/${qcUserId}`);
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
                  <Volume2 className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <audio 
                      controls 
                      className="w-full max-w-full h-8"
                      style={{ maxHeight: '32px' }}
                    >
                      <source src={audioUrl} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                  {/* <Text className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    Duration: {formatDuration(instanceData.audio1_duration)}
                  </Text> */}
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
              <Heading level={4} className="text-base sm:text-lg md:text-xl">Audio QC Form</Heading>
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
                  options={[
                    { value: 'en', label: 'English' },
                    { value: 'bn', label: 'বাংলা' },
                    { value: 'hi', label: 'हिंदी' },
                  ]}
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
              {isSubmitting ? 'Processing...' : 'Submit'}
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

