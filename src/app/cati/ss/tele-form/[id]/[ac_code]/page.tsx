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

// Import form configurations
import formEnConfig from '../../form-en-config.json';
import formBnConfig from '../../form-bn-config.json';
import formHiConfig from '../../form-hi-config.json';

// Import JSON data files
// @ts-ignore
import partyData from '../../../../josn/party_2021_q5.json';
// @ts-ignore
import mlaMpData from '../../../../josn/mla-mp-ac-data.json';
// @ts-ignore
import casteOptions from '../../../../josn/caste-options.json';

// Type definitions
interface FormOption {
  label: string;
  value: string;
  tag: string;
}

interface FormField {
  type: string;
  label: string;
  tag: string;
  required?: boolean;
  conditional?: string;
  options?: FormOption[];
  placeholder?: string;
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

const formConfigs: Record<string, FormField[]> = {
  english: formEnConfig as FormField[],
  bengali: formBnConfig as FormField[],
  hindi: formHiConfig as FormField[],
};

export default function TeleFormV2Page() {
  const router = useRouter();
  const params = useParams();
  const interviewId = params.id as string;
  const acCode = params.ac_code as string;
  
  const [language, setLanguage] = useState<string>('english');
  const [timer, setTimer] = useState<number>(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [toasts, setToasts] = useState<any[]>([]);
  const [teleformUserName, setTeleformUserName] = useState<string>('');
  const [teleformUserId, setTeleformUserId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Set<string>>(new Set());
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
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

  // Load teleform user data on mount
  useEffect(() => {
    const savedData = localStorage.getItem('teleform_user_data');
    if (savedData) {
      try {
        const userData = JSON.parse(savedData);
        setTeleformUserName(userData.name || '');
        setTeleformUserId(userData.teleform_user_id || '');
      } catch (err) {
        console.error('Error loading teleform user data:', err);
      }
    }
  }, []);

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Get current form configuration based on language
  const currentFormConfig = formConfigs[language] || formConfigs.english;

  // Get MLA/MP data for the current AC code
  const getMlaMpData = (acCode: string) => {
    const acCodeNum = parseInt(acCode);
    return mlaMpData.find((item: any) => item.ac_code === acCodeNum);
  };

  // Replace placeholders in labels with actual values
  const replaceLabelPlaceholders = (label: string, acCode: string): string => {
    const mlaMpInfo = getMlaMpData(acCode);
    if (!mlaMpInfo) return label;
    
    return label
      .replace(/\{\{mp_name\}\}/g, `"${mlaMpInfo.mp_name}"`)
      .replace(/\{\{mla_name\}\}/g, `"${mlaMpInfo.mla_name}"`);
  };

  // Get party options for the current AC code
  const getPartyOptions = (acCode: string): FormOption[] => {
    const acCodeNum = parseInt(acCode);
    const acPartyData = partyData.ac_data[acCodeNum.toString() as keyof typeof partyData.ac_data];
    
    if (!acPartyData) {
      // Return default party options when specific AC data is not available
      return [
        {
          label: language === 'bengali' ? 'AITC (Trinamool Congress)' : 'AITC (Trinamool Congress)',
          value: '1',
          tag: 'party_1'
        },
        {
          label: language === 'bengali' ? 'BJP' : 'BJP',
          value: '2',
          tag: 'party_2'
        },
        {
          label: language === 'bengali' ? 'INC (Congress)' : 'INC (Congress)',
          value: '3',
          tag: 'party_3'
        },
        {
          label: language === 'bengali' ? 'Left Front' : 'Left Front',
          value: '4',
          tag: 'party_4'
        },
        {
          label: language === 'bengali' ? 'Independent' : 'Independent',
          value: '12',
          tag: 'party_12'
        },
        {
          label: language === 'bengali' ? 'Others (specify)' : 'Others (specify)',
          value: '44',
          tag: 'party_44'
        },
        {
          label: language === 'bengali' ? 'NOTA' : 'NOTA',
          value: '55',
          tag: 'party_55'
        },
        {
          label: language === 'bengali' ? 'Did not vote' : 'Did not vote',
          value: '66',
          tag: 'party_66'
        },
        {
          label: language === 'bengali' ? 'Not eligible for voting' : 'Not eligible for voting',
          value: '77',
          tag: 'party_77'
        },
        {
          label: language === 'bengali' ? 'No response/Refused to answer' : 'No response/Refused to answer',
          value: '88',
          tag: 'party_88'
        }
      ];
    }
    
    return acPartyData.parties.map((party: any) => ({
      label: language === 'bengali' ? party.party_name_bangla : party.party_name_english,
      value: party.party_code.toString(),
      tag: `party_${party.party_code}`
    }));
  };

  // Get caste options based on selected religion
  const getCasteOptions = (religionValue: string): FormOption[] => {
    if (!religionValue) return [];
    
    const religionData = casteOptions[religionValue as keyof typeof casteOptions];
    if (!religionData || !religionData.castes) return [];
    
    return religionData.castes.map((caste: any) => ({
      label: language === 'bengali' ? caste.caste_name_bangla : 
             language === 'hindi' ? caste.caste_name_hindi : 
             caste.caste_name_english,
      value: caste.caste_code.toString(),
      tag: `caste_${caste.caste_code}`
    }));
  };

  // Process form configuration to replace placeholders and add dynamic options
  const processFormConfig = (config: FormField[]): FormField[] => {
    return config.map(field => {
      const processedField = { ...field };
      
      // Replace placeholders in label
      processedField.label = replaceLabelPlaceholders(field.label, acCode);
      
      // Handle dynamic options for party data
      if (typeof field.options === 'string' && field.options === `party_2021_q5.[ac_code]`) {
        processedField.options = getPartyOptions(acCode);
      }
      
      // Handle dynamic options for caste data
      if (typeof field.options === 'string' && field.options === `caste-options[resp_religion.value].castes`) {
        const religionValue = formData.resp_religion;
        processedField.options = getCasteOptions(religionValue);
      }
      
      return processedField;
    });
  };

  // Get processed form configuration
  const processedFormConfig = React.useMemo(() => {
    return processFormConfig(currentFormConfig);
  }, [currentFormConfig, acCode, language, formData.resp_religion]);

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
      
      // Clear caste field when religion changes
      if (fieldTag === 'resp_religion') {
        newData.resp_caste_jati = '';
        newData.resp_caste_jati_oth = '';
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
      
      // Handle excludeOptions logic - clear dependent field if same value is selected
      if (field.rules?.excludeOptions && field.type === 'radio') {
        const excludeField = field.rules.excludeOptions;
        const currentExcludeValue = newData[excludeField];
        
        console.log('ExcludeOptions Debug:', {
          fieldTag,
          value,
          excludeField,
          currentExcludeValue,
          shouldClear: currentExcludeValue && ['1', '2', '3', '4'].includes(value) && value === currentExcludeValue
        });
        
        // If the selected value in current field matches the value in exclude field, clear the exclude field
        if (currentExcludeValue && ['1', '2', '3', '4'].includes(value) && value === currentExcludeValue) {
          console.log('Clearing field:', excludeField);
          newData[excludeField] = '';
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
    
    processedFormConfig.forEach((field) => {
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

  // Auto-save function
  const autoSaveForm = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token || !interviewId) return;

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      
      // Transform form data to match backend expectations
      const transformedData = transformFormDataForSubmission(formData);
      
      await fetch(`${apiBaseUrl}/api/cati/interviews/${interviewId}/comprehensive`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...transformedData,
          status: formData.thanks_future == '1' || formData.thanks_future == '2' ? 2 : 4, // Draft status
          form_duration_seconds: timer,
          language_used: language,
        })
      });
      
      console.log('Auto-saved draft');
    } catch (error) {
      console.error('Auto-save error:', error);
    }
  };

  // Trigger auto-save on form data change (debounced)
  useEffect(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    
    autoSaveTimeoutRef.current = setTimeout(() => {
      autoSaveForm();
    }, 1000);
    
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [formData]);

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
      
      // Determine status based on submission type
      // 1 = Call initiated, 2 = Successful submit, 3 = Partial submit, 4 = Draft
      let status = 4; // Default to draft
      if (finalSubmit === 1) {
        status = 2; // Successful submit
      } else if (finalSubmit === 0) {
        status = 3; // Partial submit (call dropped)
      }
      
      // Transform form data to match backend expectations
      const transformedData = transformFormDataForSubmission(formData);
      
      const submissionData = {
        ...transformedData,
        status: status,
        form_duration_seconds: timer,
        final_submit: finalSubmit,
        language_used: language,
        user_timezone: timezone,
        user_localdatetime: currentTime,
      };
      
      const response = await fetch(`${apiBaseUrl}/api/cati/interviews/${interviewId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submissionData)
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
    processedFormConfig.forEach((field) => {
      if (field.required && isFieldVisible(field)) {
        const fieldValue = formData[field.tag];
        
        // Check if field is empty
        if (field.type === 'checkbox') {
          if (!Array.isArray(fieldValue) || fieldValue.length === 0) {
            errors.push(field.label);
          }
        } else {
          if (fieldValue === undefined || fieldValue === null || fieldValue === '') {
            errors.push(field.label);
          }
        }
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submission
    const validation = validateForm();
    
    if (!validation.isValid) {
      // Set validation errors for highlighting
      const errorFields = new Set<string>();
      processedFormConfig.forEach((field) => {
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
      const firstErrorField = processedFormConfig.find(
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
    
    showToast('Saving form data...', 'info');
    
    const success = await saveFormData(1);
    
    if (success) {
      showToast('Form submitted successfully! Data has been saved.', 'success');
      
      setTimeout(() => {
        router.push(`/cati/ss/new-call/${teleformUserId}`);
      }, 1500);
    }
  };

  const handleCallDropped = async () => {
    showToast('Saving partial data...', 'info');
    
    const success = await saveFormData(0);
    
    if (success) {
      showToast('Call dropped. Partial data has been saved.', 'success');
      
      setTimeout(() => {
        router.push(`/cati/ss/new-call/${teleformUserId}`);
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
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Text>
            {hasError && (
              <div className="mb-2 sm:mb-3 p-2 bg-red-100 dark:bg-red-800/30 border border-red-300 dark:border-red-600 rounded text-xs sm:text-sm text-red-700 dark:text-red-300">
                <i className="fa fa-exclamation-triangle mr-2"></i>
                This field is required
              </div>
            )}
            <div className="space-y-2 sm:space-y-3">
              {field.options?.filter(option => {
                // Handle excludeOptions logic - only for option values 1, 2, 3, 4
                if (field.rules?.excludeOptions) {
                  const excludeField = field.rules.excludeOptions;
                  const excludeValue = formData[excludeField];
                  if (excludeValue && ['1', '2', '3', '4'].includes(excludeValue) && option.value === excludeValue) {
                    return false; // Hide this option
                  }
                }
                return true;
              }).map(option => (
                <Radio
                  key={option.tag}
                  id={`${field.tag}_${option.value}`}
                  name={field.tag}
                  value={option.value}
                  label={option.label}
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
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Text>
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
                  label={option.label}
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
              label={field.label}
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
              label={field.label}
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
              label={field.label}
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

  // Group fields by sections
  const groupFieldsBySection = () => {
    const sections: Record<string, FormField[]> = {
      callStatus: [],
      consent: [],
      demographics: [],
      partyPreferences: [],
      satisfaction: [],
      finalDemographics: [],
    };

    processedFormConfig.forEach(field => {
      if (['number_status', 'call_not_ring', 'call_ring_status', 'q_call_status', 'call_reschedule'].includes(field.tag)) {
        sections.callStatus.push(field);
      } else if (field.tag === 'consent') {
        sections.consent.push(field);
      } else if (['resp_age', 'resp_registered_voter', 'resp_gender'].includes(field.tag)) {
        sections.demographics.push(field);
      } else if (['q5', 'q5_oth', 'q5_ind', 'q6', 'q6_oth', 'q6_ind', 'q7', 'q7_oth', 'q7_ind', 'q8', 'q8_oth', 'q8_ind', 'q9', 'q9_oth', 'q9_ind', 'q10', 'q10_oth', 'q11', 'q11_oth', 'q12', 'q12_oth', 'q13', 'q13_oth'].includes(field.tag)) {
        sections.partyPreferences.push(field);
      } else if (['q14', 'q15', 'q16_a', 'q16_b', 'q17', 'q17_oth', 'q19', 'q19_oth'].includes(field.tag)) {
        sections.satisfaction.push(field);
      } else if (['resp_religion', 'resp_religion_oth', 'resp_social_cat', 'resp_caste_jati', 'resp_caste_jati_oth', 'resp_female_edu', 'resp_male_edu', 'resp_occupation', 'thanks_future'].includes(field.tag)) {
        sections.finalDemographics.push(field);
      }
    });

    return sections;
  };

  const sections = groupFieldsBySection();

  // Check if sections should be visible
  const showConsentSection = formData.q_call_status === '1';
  const showDemographicsSection = formData.consent === '1';
  const showPartyPreferencesSection = formData.resp_registered_voter === '1';
  const showSatisfactionSection = formData.resp_registered_voter === '1';
  const showFinalDemographicsSection = formData.resp_registered_voter === '1';

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto py-3 sm:py-4 md:py-6 px-2 sm:px-4">
      {/* Timer and Language Selector */}
      <div className="mb-3 sm:mb-4 md:mb-6">
        <Card className="p-3 sm:p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <Heading level={4} className="text-base sm:text-lg md:text-xl">WB Opinion Poll CATI 2025</Heading>
            <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 xs:gap-3 sm:gap-4 md:gap-6">
              {/* Timer */}
              <div>
                <Text className="text-sm sm:text-base md:text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Time: <span className="text-blue-600 dark:text-blue-400">{timer}s</span>
                </Text>
              </div>
              
              {/* Language Selector */}
              <div className="flex items-center gap-2 w-full xs:w-auto">
                <Text className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Language:</Text>
                <div className="w-full xs:w-40 sm:w-48">
                  <SelectDropdown
                    options={[
                      { value: 'english', label: 'English (English)' },
                      { value: 'bengali', label: 'Bangla (বাংলা)' },
                      { value: 'hindi', label: 'Hindi (हिंदी)' },
                    ]}
                    value={language}
                    onChange={(value) => setLanguage(value as string)}
                    placeholder="Select Language"
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Call Status Section */}
        <Card className="p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
          <Heading level={4} className="text-base sm:text-lg md:text-xl text-gray-900 dark:text-white mb-3 sm:mb-4 md:mb-6">
            Call Status
          </Heading>
          {sections.callStatus.map((field, index) => renderField(field, index))}
        </Card>

        {/* Consent Section */}
        {showConsentSection && sections.consent.length > 0 && (
          <Card className="p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
            <Heading level={4} className="text-base sm:text-lg md:text-xl text-gray-900 dark:text-white mb-3 sm:mb-4 md:mb-6">
              Section 2: Interviewer Introduction and Statement of Informed Consent
            </Heading>
            <div className="mb-3 sm:mb-4">
              <Text className="text-sm sm:text-base leading-relaxed font-medium text-blue-600 dark:text-blue-400 mb-3 sm:mb-4">
                {language === 'hindi' 
                  ? `नमस्ते, मेरा नाम ${teleformUserName || '[enumerator name]'} है। हम कन्वर्जेंट नाम की एक संस्था से बात कर रहे हैं। हम पश्चिम बंगाल में लोगों से सरकार और राजनीति के बारे में उनकी राय जानने के लिए एक सर्वे कर रहे हैं। मैं आपसे कुछ सवाल पूछूँगा/पूछूँगी। आपके जवाब पूरी तरह गोपनीय रखे जाएंगे — किसी को भी आपकी जानकारी नहीं बताई जाएगी। ये सर्वे लगभग 5 से 10 मिनट का है, और आपकी सच्ची राय हमारे लिए बहुत ज़रूरी है।`
                  : language === 'bengali'
                  ? `নমস্কার, আমার নাম ${teleformUserName || '[enumerator name]'}। আমরা কনভার্জেন্ট থেকে এসেছি, একটি স্বতন্ত্র গবেষণা সংস্থা। আমরা পশ্চিমবঙ্গে সামাজিক ও রাজনৈতিক বিষয়ে একটি সমীক্ষা পরিচালনা করছি, হাজার হাজার মানুষের সাক্ষাৎকার নিচ্ছি। আমি আপনাকে সরকারের কর্মক্ষমতা এবং আপনার পছন্দ সম্পর্কে কিছু প্রশ্ন জিজ্ঞাসা করব। আপনার উত্তরগুলি কঠোরভাবে গোপনীয় থাকবে এবং শুধুমাত্র অন্যদের সাথে মিলিয়ে বিশ্লেষণ করা হবে। কোনও ব্যক্তিগত বিবরণ কখনও শেয়ার করা হবে না। সমীক্ষাটি প্রায় ৫-১০ মিনিট সময় নেবে এবং আপনার সৎ মতামত আমাদের অত্যন্ত সাহায্য করবে।`
                  : `Namaste, my name is ${teleformUserName || '[enumerator name]'}. We are from Convergent, an independent research organization. We are conducting a survey on social and political issues in West Bengal, interviewing thousands of people. I will ask you a few questions about government performance and your preferences. Your responses will remain strictly confidential and will only be analysed in combination with others. No personal details will ever be shared. The survey will take about 5–10 minutes, and your honest opinions will greatly help us.`
                }
              </Text>
            </div>
            {sections.consent.map((field, index) => renderField(field, index))}
          </Card>
        )}

        {/* Demographics Section */}
        {showDemographicsSection && sections.demographics.length > 0 && (
          <Card className="p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
            <Heading level={4} className="text-base sm:text-lg md:text-xl text-gray-900 dark:text-white mb-3 sm:mb-4 md:mb-6">
              Section 3: Basic Demographic
            </Heading>
            {sections.demographics.map((field, index) => renderField(field, index))}
          </Card>
        )}

        {/* Party Preferences Section */}
        {showPartyPreferencesSection && sections.partyPreferences.length > 0 && (
          <Card className="p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
            <Heading level={4} className="text-base sm:text-lg md:text-xl text-gray-900 dark:text-white mb-3 sm:mb-4 md:mb-6">
              Section 4: Party Preferences
            </Heading>
            {sections.partyPreferences.map((field, index) => renderField(field, index))}
          </Card>
        )}

        {/* Satisfaction Section */}
        {showSatisfactionSection && sections.satisfaction.length > 0 && (
          <Card className="p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
            <Heading level={4} className="text-base sm:text-lg md:text-xl text-gray-900 dark:text-white mb-3 sm:mb-4 md:mb-6">
              Section 5: Satisfaction and Approval Ratings
            </Heading>
            {sections.satisfaction.map((field, index) => renderField(field, index))}
          </Card>
        )}

        {/* Final Demographics Section */}
        {showFinalDemographicsSection && sections.finalDemographics.length > 0 && (
          <Card className="p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
            <Heading level={4} className="text-base sm:text-lg md:text-xl text-gray-900 dark:text-white mb-3 sm:mb-4 md:mb-6">
              Section 6: Basic Demographic
            </Heading>
            {sections.finalDemographics.map((field, index) => renderField(field, index))}
          </Card>
        )}

        {/* Submit Buttons */}
        <Card className="p-3 sm:p-4 md:p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button 
              type="submit" 
              size="lg"
              disabled={isSubmitting}
              className="w-full sm:w-auto sm:min-w-[150px] bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base"
            >
              <i className="fa fa-save mr-2"></i>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
            <Button 
              type="button"
              onClick={handleCallDropped}
              size="lg"
              disabled={isSubmitting}
              className="w-full sm:w-auto sm:min-w-[150px] bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base"
            >
              <i className="fa fa-phone-slash mr-2"></i>
              {isSubmitting ? 'Saving...' : 'Call Dropped'}
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

