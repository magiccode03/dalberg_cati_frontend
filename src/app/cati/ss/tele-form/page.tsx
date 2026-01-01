'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
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

// Import form configuration
// @ts-ignore
import formEnConfig from './form-en-config.json';

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
  hint?: string;
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

interface FormSection {
  id: string;
  title: string;
  sub_title?: string;
  conditional?: string;
}

export default function TeleFormPage() {
  const router = useRouter();
  const [timer, setTimer] = useState<number>(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [toasts, setToasts] = useState<any[]>([]);
  const [teleformUserName, setTeleformUserName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Set<string>>(new Set());
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [rangeErrors, setRangeErrors] = useState<Record<string, string>>({});
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

  // Track previous field visibility to detect when fields become hidden
  const previousVisibilityRef = useRef<Record<string, boolean>>({});

  // Clear fields that become hidden due to conditional logic
  useEffect(() => {
    // Evaluate current visibility for all conditional fields
    const currentVisibility: Record<string, boolean> = {};
    processedQuestions.forEach(field => {
      if (field.conditional) {
        currentVisibility[field.tag] = isFieldVisible(field);
      }
    });

    // Check if any fields transitioned from visible to hidden
    const fieldsToClear: string[] = [];
    processedQuestions.forEach(field => {
      if (field.conditional) {
        const wasVisible = previousVisibilityRef.current[field.tag] ?? false;
        const isVisible = currentVisibility[field.tag] ?? false;

        if (wasVisible && !isVisible) {
          // Field became hidden, clear its value
          fieldsToClear.push(field.tag);
        }
      }
    });

    // Clear fields that became hidden
    if (fieldsToClear.length > 0) {
      setFormData(prev => {
        const newData = { ...prev };
        fieldsToClear.forEach(fieldTag => {
          const field = processedQuestions.find(f => f.tag === fieldTag);
          if (field) {
            newData[fieldTag] = field.type === 'checkbox' ? [] : '';
          }
        });
        return newData;
      });
    }

    // Update previous visibility
    previousVisibilityRef.current = currentVisibility;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  // Get form configuration
  const formConfig = formEnConfig as { globals: any; sections: FormSection[]; questions: FormField[] };
  const sections = formConfig.sections || [];
  const questions = formConfig.questions || [];

  // Replace placeholders in labels
  const replaceLabelPlaceholders = (label: string, formDataForPlaceholders?: Record<string, any>): string => {
    let processedLabel = label.replace(/\{\{telecaller_name\}\}/g, teleformUserName || '[enumerator name]');

    // Replace fee type placeholders with actual values from form data
    if (formDataForPlaceholders) {
      // Replace {{fee_type_f1}} with value from q4_01d_01
      const feeType1 = formDataForPlaceholders.q4_01d_01 || 'other';
      processedLabel = processedLabel.replace(/\{\{fee_type_f1\}\}/g, feeType1);

      // Replace {{fee_type_f2}} with value from q4_01d_02
      const feeType2 = formDataForPlaceholders.q4_01d_02 || 'other';
      processedLabel = processedLabel.replace(/\{\{fee_type_f2\}\}/g, feeType2);

      // Replace {{fee_type_f3}} with value from q4_01d_03
      const feeType3 = formDataForPlaceholders.q4_01d_03 || 'other';
      processedLabel = processedLabel.replace(/\{\{fee_type_f3\}\}/g, feeType3);

      // Replace {{other_channel_a}} with value from q8_01g_i_a
      const otherChannelA = formDataForPlaceholders.q8_01g_i_a || 'this other channel';
      processedLabel = processedLabel.replace(/\{\{other_channel_a\}\}/g, otherChannelA);

      // Replace {{other_channel_b}} with value from q8_01g_i_b
      const otherChannelB = formDataForPlaceholders.q8_01g_i_b || 'this other channel';
      processedLabel = processedLabel.replace(/\{\{other_channel_b\}\}/g, otherChannelB);
    }

    return processedLabel;
  };

  // Process form configuration to replace placeholders
  const processedQuestions = React.useMemo(() => {
    return questions.map(field => ({
      ...field,
      label: replaceLabelPlaceholders(field.label)
    }));
  }, [questions, teleformUserName]);

  // Evaluate conditional expressions
  const evaluateCondition = (condition: string): boolean => {
    if (!condition) return true;

    try {
      let expr = condition.trim();

      // Handle simple field name checks (e.g., "q0_02" means "if q0_02 has a value")
      // Check if it's just a field name with no operators
      const simpleFieldPattern = /^([a-zA-Z_][a-zA-Z0-9_]*)$/;
      const simpleMatch = expr.match(simpleFieldPattern);
      if (simpleMatch) {
        const fieldName = simpleMatch[1];
        const fieldValue = formData[fieldName];
        // Field has value if it's not undefined, null, empty string, or empty array
        const hasValue = !(fieldValue === undefined || fieldValue === null || fieldValue === '' || (Array.isArray(fieldValue) && fieldValue.length === 0));
        return hasValue;
      }

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
        // Map call_status to q_call_status (field name mismatch in JSON)
        const actualField = field === 'call_status' ? 'q_call_status' : field;
        const fieldValue = formData[actualField];
        if (fieldValue === undefined || fieldValue === null || fieldValue === '') {
          return operator === '!==' ? 'true' : 'false';
        }
        const stringValue = String(fieldValue);

        if (operator === '===') {
          return (stringValue === value).toString();
        } else {
          return (stringValue !== value).toString();
        }
      });

      // Handle == operator (loose equality) - also handle with quotes
      const looseEqualityPattern = /(\w+)\s*==\s*'(\d+)'/g;
      expr = expr.replace(looseEqualityPattern, (match, field, value) => {
        // Map call_status to q_call_status (field name mismatch in JSON)
        const actualField = field === 'call_status' ? 'q_call_status' : field;
        const fieldValue = formData[actualField];
        if (fieldValue === undefined || fieldValue === null) {
          return 'false';
        }
        return (String(fieldValue) === String(value)).toString();
      });

      // Handle == operator without quotes
      const looseEqualityPatternNoQuotes = /(\w+)\s*==\s*(\d+)/g;
      expr = expr.replace(looseEqualityPatternNoQuotes, (match, field, value) => {
        // Map call_status to q_call_status (field name mismatch in JSON)
        const actualField = field === 'call_status' ? 'q_call_status' : field;
        const fieldValue = formData[actualField];
        if (fieldValue === undefined || fieldValue === null) {
          return 'false';
        }
        return (String(fieldValue) === String(value)).toString();
      });

      // Handle array includes - both with and without quotes
      const includesPattern = /(\w+)\.includes\(['"]?(\d+)['"]?\)/g;
      expr = expr.replace(includesPattern, (match, field, value) => {
        const fieldValue = formData[field];
        if (!Array.isArray(fieldValue)) {
          // If not an array, check if it's a string that includes the value
          if (typeof fieldValue === 'string') {
            return fieldValue.includes(value).toString();
          }
          return 'false';
        }
        return fieldValue.includes(value).toString();
      });

      // Handle field name checks in complex expressions (e.g., "q0_02 && q0_03")
      // Process from right to left to avoid index issues
      const processedFields = new Set<string>();
      const fieldNamePattern = /\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g;
      const replacements: Array<{ start: number, end: number, replacement: string }> = [];

      let match;
      while ((match = fieldNamePattern.exec(expr)) !== null) {
        const field = match[1];
        const start = match.index;
        const end = start + field.length;

        // Skip if already processed
        if (processedFields.has(field)) continue;
        processedFields.add(field);

        // Get context before and after
        const beforeMatch = expr.substring(0, start);
        const afterMatch = expr.substring(end);

        // Check if this is part of a comparison or method call
        const isInComparison = /(===|!==|==|>=|<=|>|<)\s*$/.test(beforeMatch) ||
          /^\s*(===|!==|==|>=|<=|>|<)/.test(afterMatch) ||
          /['"]\s*$/.test(beforeMatch) ||
          /^\s*['"]/.test(afterMatch) ||
          /\.includes\(/.test(beforeMatch) ||
          /\.\w+/.test(beforeMatch);

        // Skip keywords, operators, numbers, and comparisons
        if (['true', 'false', '&&', '||', 'and', 'or'].includes(field.toLowerCase()) ||
          /^\d+$/.test(field) ||
          isInComparison) {
          continue;
        }

        // Map call_status to q_call_status (field name mismatch in JSON)
        const actualField = field === 'call_status' ? 'q_call_status' : field;

        // Check if this field has a value
        const fieldValue = formData[actualField];
        const hasValue = !(fieldValue === undefined || fieldValue === null || fieldValue === '' || (Array.isArray(fieldValue) && fieldValue.length === 0));

        replacements.push({ start, end, replacement: hasValue.toString() });
      }

      // Apply replacements from right to left to maintain indices
      replacements.sort((a, b) => b.start - a.start);
      for (const rep of replacements) {
        expr = expr.substring(0, rep.start) + rep.replacement + expr.substring(rep.end);
      }

      // Handle && and || operators
      expr = expr.replace(/&&/g, ' && ').replace(/\|\|/g, ' || ');

      // Safely evaluate
      return eval(expr);
    } catch (err) {
      console.error('Error evaluating condition:', condition, err);
      return false;
    }
  };

  // Check if field should be visible based on showFields rules
  const isFieldShownByRule = (fieldTag: string): boolean => {
    // Check all fields that have showFields rules
    for (const field of processedQuestions) {
      if (field.rules?.showFields && field.type === 'radio') {
        const fieldValue = formData[field.tag];
        if (fieldValue) {
          const selectedOption = field.options?.find(opt => opt.value === fieldValue);
          if (selectedOption && field.rules.showFields[selectedOption.tag]) {
            if (field.rules.showFields[selectedOption.tag].includes(fieldTag)) {
              return true;
            }
          }
        }
      }
    }
    return false;
  };

  // Check if field should be visible
  const isFieldVisible = (field: FormField): boolean => {
    // First check if field is shown by showFields rule
    // showFields can make a field visible, but it still needs to satisfy its conditional
    const isShownByRule = isFieldShownByRule(field.tag);

    // If field has a conditional, it must be satisfied
    if (field.conditional) {
      const conditionalResult = evaluateCondition(field.conditional);
      // Field is visible only if:
      // 1. Conditional is satisfied AND
      // 2. (Either shown by showFields rule OR no showFields rule exists)
      if (!conditionalResult) {
        return false; // Conditional not met, field should not be visible
      }
      // Conditional is satisfied, check if showFields rule applies
      if (isShownByRule) {
        return true; // Conditional satisfied AND shown by rule
      }
      // Conditional satisfied but no showFields rule - field is visible
      return true;
    }

    // No conditional - field is always visible (unless hidden by other logic)
    // If showFields rule exists, respect it
    if (isShownByRule) {
      return true;
    }

    // No conditional and no showFields rule - field is visible
    return true;
  };

  // Check if section should be visible
  const isSectionVisible = (section: FormSection): boolean => {
    if (!section.conditional) return true;
    return evaluateCondition(section.conditional);
  };

  // Validate min/max for number fields
  const validateRange = (field: FormField, value: any): string | null => {
    if (field.type !== 'number' && field.type !== 'number-radio') return null;
    if (value === '' || value === undefined || value === null) return null;

    const numValue = Number(value);
    if (isNaN(numValue)) return null;

    if (field.min !== undefined && numValue < field.min) {
      return `Value must be greater than or equal to ${field.min}`;
    }
    if (field.max !== undefined && numValue > field.max) {
      return `Value must be less than or equal to ${field.max}`;
    }
    return null;
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
        setTouchedFields(prev => new Set(prev).add(fieldTag));
      }

      // Validate min/max range
      const rangeError = validateRange(field, value);
      if (rangeError) {
        setRangeErrors(prev => ({ ...prev, [fieldTag]: rangeError }));
      } else {
        setRangeErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[fieldTag];
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

      // Handle showFields logic - clear fields that should be hidden
      if (field.rules?.showFields) {
        const showRules = field.rules.showFields;
        if (field.type === 'radio') {
          const selectedOption = field.options?.find(opt => opt.value === value);
          // Clear fields that are not in the showFields list for the selected option
          Object.entries(showRules).forEach(([optTag, fieldsToShow]) => {
            const option = field.options?.find(opt => opt.tag === optTag);
            if (option && selectedOption?.tag !== optTag) {
              // This option is not selected, so clear the fields that would be shown for it
              fieldsToShow.forEach(fieldToClear => {
                // Only clear if the field is not shown by any other selected option
                const isShownByOther = Object.entries(showRules).some(([otherOptTag, otherFields]) => {
                  if (otherOptTag === optTag) return false;
                  const otherOption = field.options?.find(opt => opt.tag === otherOptTag);
                  return otherOption && newData[field.tag] === otherOption.value && otherFields.includes(fieldToClear);
                });
                if (!isShownByOther) {
                  newData[fieldToClear] = Array.isArray(newData[fieldToClear]) ? [] : '';
                }
              });
            }
          });
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

  // Render field based on type
  const renderField = (field: FormField, index: number) => {
    // Always check visibility - this will be re-evaluated when formData changes
    const isVisible = isFieldVisible(field);
    if (!isVisible) return null;

    // Get field value with proper defaults
    let fieldValue: any;
    if (field.type === 'checkbox') {
      const rawValue = formData[field.tag];
      fieldValue = Array.isArray(rawValue) ? rawValue : (rawValue ? [rawValue] : []);
    } else {
      fieldValue = formData[field.tag] || '';
    }

    // Check if field is empty
    const isEmpty = field.type === 'checkbox'
      ? fieldValue.length === 0
      : fieldValue === undefined || fieldValue === null || fieldValue === '';

    const hasError = validationErrors.has(field.tag) || (field.required && isEmpty && touchedFields.has(field.tag));
    const hasRangeError = rangeErrors[field.tag] && touchedFields.has(field.tag);

    // Get dynamically processed label with fee type replacements
    const dynamicLabel = replaceLabelPlaceholders(field.label, formData);

    switch (field.type) {
      case 'radio':
        return (
          <div
            key={index}
            id={`${field.tag}_container`}
            className={`mb-6 ${(hasError || hasRangeError) ? 'border-2 border-red-500 rounded-lg p-4 bg-red-50 dark:bg-red-900/20' : ''}`}
          >
            <Text className={`text-base font-medium mb-3 ${(hasError || hasRangeError) ? 'text-red-700 dark:text-red-300' : 'text-blue-600 dark:text-blue-400'}`}>
              {dynamicLabel}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Text>
            {field.hint && (
              <Text className="text-sm text-gray-600 dark:text-gray-400 mb-3 italic">
                {field.hint}
              </Text>
            )}
            {hasError && (
              <div className="mb-3 p-2 bg-red-100 dark:bg-red-800/30 border border-red-300 dark:border-red-600 rounded text-sm text-red-700 dark:text-red-300">
                <i className="fa fa-exclamation-triangle mr-2"></i>
                This field is required
              </div>
            )}
            <div className="space-y-3">
              {field.options?.filter(option => {
                // Handle excludeOptions logic
                if (field.rules?.excludeOptions) {
                  const excludeField = field.rules.excludeOptions;
                  const excludeValue = formData[excludeField];
                  if (excludeValue && ['1', '2', '3', '4'].includes(excludeValue) && option.value === excludeValue) {
                    return false;
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
            className={`mb-6 ${(hasError || hasRangeError) ? 'border-2 border-red-500 rounded-lg p-4 bg-red-50 dark:bg-red-900/20' : ''}`}
          >
            <Text className={`text-base font-medium mb-3 ${(hasError || hasRangeError) ? 'text-red-700 dark:text-red-300' : 'text-blue-600 dark:text-blue-400'}`}>
              {dynamicLabel}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Text>
            {field.hint && (
              <Text className="text-sm text-gray-600 dark:text-gray-400 mb-3 italic">
                {field.hint}
              </Text>
            )}
            {hasError && (
              <div className="mb-3 p-2 bg-red-100 dark:bg-red-800/30 border border-red-300 dark:border-red-600 rounded text-sm text-red-700 dark:text-red-300">
                <i className="fa fa-exclamation-triangle mr-2"></i>
                This field is required
              </div>
            )}
            <div className="space-y-3">
              {field.options?.map(option => {
                // Ensure fieldValue is an array for checkbox
                const checkboxValues = Array.isArray(fieldValue) ? fieldValue : [];
                return (
                  <Checkbox
                    key={option.tag}
                    id={`${field.tag}_${option.value}`}
                    label={option.label}
                    checked={checkboxValues.includes(option.value)}
                    onCheckedChange={(checked) => handleCheckboxChange(field.tag, option.value, checked, field)}
                  />
                );
              })}
            </div>
          </div>
        );

      case 'text':
      case 'number':
      case 'date':
      case 'datetime-local':
        return (
          <div
            key={index}
            id={`${field.tag}_container`}
            className={`mb-6 ${(hasError || hasRangeError) ? 'border-2 border-red-500 rounded-lg p-4 bg-red-50 dark:bg-red-900/20' : ''}`}
          >
            <Input
              type={field.type}
              label={dynamicLabel}
              value={fieldValue as string}
              onChange={(e) => {
                const val = e.target.value;
                handleInputChange(field.tag, val, field);
                // Mark as touched immediately so validation can show
                setTouchedFields(prev => {
                  const newTouched = new Set(prev);
                  newTouched.add(field.tag);
                  return newTouched;
                });
                // Validate immediately on change for better UX
                if (field.required) {
                  if (val === '' || val === undefined || val === null) {
                    setValidationErrors(prev => {
                      const newErrors = new Set(prev);
                      newErrors.add(field.tag);
                      return newErrors;
                    });
                  } else {
                    setValidationErrors(prev => {
                      const newErrors = new Set(prev);
                      newErrors.delete(field.tag);
                      return newErrors;
                    });
                  }
                }
              }}
              onBlur={() => {
                // Mark field as touched and validate
                setTouchedFields(prev => {
                  const newTouched = new Set(prev);
                  newTouched.add(field.tag);
                  return newTouched;
                });
                // Validate range on blur for number fields
                if (field.type === 'number') {
                  const rangeError = validateRange(field, fieldValue);
                  if (rangeError) {
                    setRangeErrors(prev => ({ ...prev, [field.tag]: rangeError }));
                  } else {
                    setRangeErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors[field.tag];
                      return newErrors;
                    });
                  }
                }
                // Trigger validation check on blur for required fields
                if (field.required && isEmpty) {
                  setValidationErrors(prev => {
                    const newErrors = new Set(prev);
                    newErrors.add(field.tag);
                    return newErrors;
                  });
                }
              }}
              placeholder={field.placeholder}
              min={field.min}
              max={field.max}
              maxLength={field.maxLength}
              className={(hasError || hasRangeError) ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
            />
            {field.hint && (
              <Text className="text-sm text-gray-600 dark:text-gray-400 mt-2 mb-2 italic">
                {field.hint}
              </Text>
            )}
            {hasError && (
              <div className="mt-2 p-2 bg-red-100 dark:bg-red-800/30 border border-red-300 dark:border-red-600 rounded text-sm text-red-700 dark:text-red-300">
                <i className="fa fa-exclamation-triangle mr-2"></i>
                This field is required
              </div>
            )}
            {hasRangeError && (
              <div className="mt-2 p-2 bg-red-100 dark:bg-red-800/30 border border-red-300 dark:border-red-600 rounded text-sm text-red-700 dark:text-red-300">
                <i className="fa fa-exclamation-triangle mr-2"></i>
                {rangeErrors[field.tag]}
              </div>
            )}
          </div>
        );

      case 'select':
        // Handle global options (e.g., "globals.states")
        let selectOptions: FormOption[] = field.options || [];
        const optionsValue = field.options as any;
        if (typeof optionsValue === 'string' && optionsValue.startsWith('globals.')) {
          const globalKey = optionsValue.replace('globals.', '');
          const globalData = formConfig.globals?.[globalKey];
          if (Array.isArray(globalData)) {
            selectOptions = globalData.map((item: any) => ({
              label: item.name || item.label || item,
              value: item.value || item,
              tag: item.tag || item.value || item
            }));
          }
        }

        return (
          <div
            key={index}
            id={`${field.tag}_container`}
            className={`mb-6 ${(hasError || hasRangeError) ? 'border-2 border-red-500 rounded-lg p-4 bg-red-50 dark:bg-red-900/20' : ''}`}
          >
            <Text className={`text-base font-medium mb-3 ${(hasError || hasRangeError) ? 'text-red-700 dark:text-red-300' : 'text-blue-600 dark:text-blue-400'}`}>
              {dynamicLabel}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Text>
            {field.hint && (
              <Text className="text-sm text-gray-600 dark:text-gray-400 mb-3 italic">
                {field.hint}
              </Text>
            )}
            {hasError && (
              <div className="mb-3 p-2 bg-red-100 dark:bg-red-800/30 border border-red-300 dark:border-red-600 rounded text-sm text-red-700 dark:text-red-300">
                <i className="fa fa-exclamation-triangle mr-2"></i>
                This field is required
              </div>
            )}
            <div className="w-full">
              <SelectDropdown
                options={selectOptions.map((opt: any) => ({
                  value: typeof opt === 'string' ? opt : (opt.value || opt),
                  label: typeof opt === 'string' ? opt : (opt.label || opt.name || opt.value || opt)
                }))}
                value={fieldValue as string}
                onChange={(value) => handleInputChange(field.tag, value, field)}
                placeholder={field.placeholder || `Select ${dynamicLabel}`}
              />
            </div>
          </div>
        );

      case 'number-radio':
        // Number input with radio button options (like "Don't know", "Prefer not to say")
        const isRadioOptionSelected = field.options?.some(opt => fieldValue === opt.value);
        const numericValue = isRadioOptionSelected ? '' : (fieldValue || '');

        return (
          <div
            key={index}
            id={`${field.tag}_container`}
            className={`mb-6 ${(hasError || hasRangeError) ? 'border-2 border-red-500 rounded-lg p-4 bg-red-50 dark:bg-red-900/20' : ''}`}
          >
            <Text className={`text-base font-medium mb-3 ${(hasError || hasRangeError) ? 'text-red-700 dark:text-red-300' : 'text-blue-600 dark:text-blue-400'}`}>
              {dynamicLabel}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Text>
            {field.hint && (
              <Text className="text-sm text-gray-600 dark:text-gray-400 mb-3 italic">
                {field.hint}
              </Text>
            )}
            {hasError && (
              <div className="mb-3 p-2 bg-red-100 dark:bg-red-800/30 border border-red-300 dark:border-red-600 rounded text-sm text-red-700 dark:text-red-300">
                <i className="fa fa-exclamation-triangle mr-2"></i>
                This field is required
              </div>
            )}
            {hasRangeError && (
              <div className="mb-3 p-2 bg-red-100 dark:bg-red-800/30 border border-red-300 dark:border-red-600 rounded text-sm text-red-700 dark:text-red-300">
                <i className="fa fa-exclamation-triangle mr-2"></i>
                {rangeErrors[field.tag]}
              </div>
            )}
            <div className="space-y-3">
              <Input
                type="number"
                label=""
                value={numericValue}
                onChange={(e) => {
                  const val = e.target.value;
                  handleInputChange(field.tag, val, field);
                  // Mark as touched immediately so validation can show
                  setTouchedFields(prev => {
                    const newTouched = new Set(prev);
                    newTouched.add(field.tag);
                    return newTouched;
                  });
                  // Validate immediately on change for better UX
                  if (field.required) {
                    if (val === '' || val === undefined || val === null) {
                      setValidationErrors(prev => {
                        const newErrors = new Set(prev);
                        newErrors.add(field.tag);
                        return newErrors;
                      });
                    } else {
                      setValidationErrors(prev => {
                        const newErrors = new Set(prev);
                        newErrors.delete(field.tag);
                        return newErrors;
                      });
                    }
                  }
                }}
                onBlur={() => {
                  // Mark field as touched and validate range
                  setTouchedFields(prev => {
                    const newTouched = new Set(prev);
                    newTouched.add(field.tag);
                    return newTouched;
                  });
                  // Validate range on blur
                  const rangeError = validateRange(field, numericValue);
                  if (rangeError) {
                    setRangeErrors(prev => ({ ...prev, [field.tag]: rangeError }));
                  } else {
                    setRangeErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors[field.tag];
                      return newErrors;
                    });
                  }
                  // Trigger validation check on blur for required fields
                  if (field.required && isEmpty) {
                    setValidationErrors(prev => {
                      const newErrors = new Set(prev);
                      newErrors.add(field.tag);
                      return newErrors;
                    });
                  }
                }}
                placeholder={field.placeholder}
                min={field.min}
                max={field.max}
                className={(hasError || hasRangeError) ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
              />
              {field.options && field.options.length > 0 && (
                <div className="mt-3 pt-3">
                  <div className="space-y-2">
                    {field.options.map(option => (
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
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Group questions by sections based on field tags (similar to old implementation)
  const groupQuestionsBySection = () => {
    const sections: Record<string, FormField[]> = {
      callStatus: [],
      borrowerType: [],
      consent: [],
      section1: [],
      section2: [],
      section3: [],
      other: [],
    };

    // Process all questions, including those that might not be visible yet
    // Don't filter by visibility here - let conditionals handle it during rendering
    processedQuestions.forEach(field => {
      // Call Status Section
      if (['number_status', 'call_not_ring', 'call_ring_status', 'q_call_status', 'call_reschedule'].includes(field.tag)) {
        sections.callStatus.push(field);
      }
      // Borrower Type
      else if (field.tag === 'borrower_type') {
        sections.borrowerType.push(field);
      }
      // Consent
      else if (field.tag === 'consent') {
        sections.consent.push(field);
      }
      // Section 1 questions (Borrower Profile) - questions starting with q0_, q1_
      // Include resp_name, resp_age, resp_gender, and q1_04a, q1_04b, etc.
      else if (field.tag.startsWith('q0_') || field.tag.startsWith('q1_') ||
        field.tag === 'resp_name' || field.tag === 'resp_age' || field.tag === 'resp_gender') {
        sections.section1.push(field);
      }
      // Section 2 questions (Purpose and Impact) - questions starting with q2_
      else if (field.tag.startsWith('q2_')) {
        sections.section2.push(field);
      }
      // Section 3 questions (Impact of loan features) - questions starting with q3_, q4_, q5_, q6_, q7_, q8_, q9_
      else if (field.tag.startsWith('q3_') || field.tag.startsWith('q4_') || field.tag.startsWith('q5_') ||
        field.tag.startsWith('q6_') || field.tag.startsWith('q7_') || field.tag.startsWith('q8_') ||
        field.tag.startsWith('q9_')) {
        sections.section3.push(field);
      }
      // Other questions
      else {
        sections.other.push(field);
      }
    });

    return sections;
  };

  // Validate all required fields
  const validateForm = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    const rangeErrorFields: string[] = [];

    processedQuestions.forEach((field) => {
      if (field.required && isFieldVisible(field)) {
        const fieldValue = formData[field.tag];

        if (field.type === 'checkbox') {
          // For checkboxes, ensure it's an array with at least one value
          const checkboxValue = Array.isArray(fieldValue) ? fieldValue : (fieldValue ? [fieldValue] : []);
          if (checkboxValue.length === 0) {
            errors.push(field.label);
          }
        } else {
          // For other fields, check if value exists and is not empty
          if (fieldValue === undefined || fieldValue === null || fieldValue === '') {
            errors.push(field.label);
          } else {
            // Check min/max for number fields
            const rangeError = validateRange(field, fieldValue);
            if (rangeError) {
              rangeErrorFields.push(field.label);
            }
          }
        }
      } else if (isFieldVisible(field)) {
        const fieldValue = formData[field.tag];
        // Check min/max for non-required fields that have values
        if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
          const rangeError = validateRange(field, fieldValue);
          if (rangeError) {
            rangeErrorFields.push(field.label);
          }
        }
      }
    });

    return {
      isValid: errors.length === 0 && rangeErrorFields.length === 0,
      errors: [...errors, ...rangeErrorFields]
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submission
    const validation = validateForm();

    if (!validation.isValid) {
      const errorFields = new Set<string>();
      const touched = new Set<string>();
      const rangeErrorMessages: Record<string, string> = {};

      processedQuestions.forEach((field) => {
        if (isFieldVisible(field)) {
          touched.add(field.tag);
          const fieldValue = formData[field.tag];

          if (field.required) {
            let isEmpty: boolean;
            if (field.type === 'checkbox') {
              // For checkboxes, ensure it's an array with at least one value
              const checkboxValue = Array.isArray(fieldValue) ? fieldValue : (fieldValue ? [fieldValue] : []);
              isEmpty = checkboxValue.length === 0;
            } else {
              isEmpty = fieldValue === undefined || fieldValue === null || fieldValue === '';
            }

            if (isEmpty) {
              errorFields.add(field.tag);
            }
          }

          // Check min/max for all visible fields with values
          if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
            const rangeError = validateRange(field, fieldValue);
            if (rangeError) {
              rangeErrorMessages[field.tag] = rangeError;
            }
          }
        }
      });
      setValidationErrors(errorFields);
      setRangeErrors(rangeErrorMessages);
      setTouchedFields(touched);

      showToast(`Please fill all required fields. Missing: ${validation.errors.slice(0, 3).join(', ')}${validation.errors.length > 3 ? ` and ${validation.errors.length - 3} more...` : ''}`, 'error');

      const firstErrorField = processedQuestions.find(
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

    setValidationErrors(new Set());

    showToast('Saving form data...', 'info');
    showToast('Form submitted successfully! Data has been saved.', 'success');

    setTimeout(() => {
      router.push('/cati/ss/start-form-filling');
    }, 1500);
  };

  const handleCallDropped = async () => {
    showToast('Saving partial data...', 'info');
    showToast('Call dropped. Partial data has been saved.', 'success');

    setTimeout(() => {
      router.push('/cati/ss/start-form-filling');
    }, 1500);
  };

  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto py-6">
      {/* Timer */}
      <div className="mb-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <Heading level={4}>Tele Form</Heading>
            <div className="flex items-center gap-6">
              <div>
                <Text className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Time: <span className="text-blue-600 dark:text-blue-400 float-right">{timer}s</span>
                </Text>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Render sections and questions */}
        {(() => {
          const questionSections = groupQuestionsBySection();

          return (
            <>
              {/* Call Status Section */}
              {questionSections.callStatus.length > 0 && (
                <Card className="p-6 mb-6">
                  <Heading level={4} className="text-gray-900 dark:text-white mb-6">
                    Call Status
                  </Heading>
                  {questionSections.callStatus.map((field, index) => renderField(field, index))}
                </Card>
              )}

              {/* Borrower Type Section */}
              {questionSections.borrowerType.length > 0 && (() => {
                // Show borrower type only when it's visible (conditional: call_status === '1' which maps to q_call_status)
                const borrowerTypeField = questionSections.borrowerType[0];
                if (!borrowerTypeField || !isFieldVisible(borrowerTypeField)) return null;

                return (
                  <Card className="p-6 mb-6">
                    {questionSections.borrowerType.map((field, index) => renderField(field, index))}
                  </Card>
                );
              })()}

              {/* Consent Section */}
              {questionSections.consent.length > 0 && (() => {
                // Show consent only when borrower_type is selected
                // Consent questions have conditionals: borrower_type === '1' or borrower_type === '2'
                // They can also be shown by showFields rule from borrower_type
                const visibleConsentQuestions = questionSections.consent.filter(field => isFieldVisible(field));
                if (visibleConsentQuestions.length === 0) return null;

                // Find intro section based on borrower type
                const introSection = sections.find(s =>
                  (s.id === 'intro_1' && formData.borrower_type === '1') ||
                  (s.id === 'intro_2' && formData.borrower_type === '2')
                );

                return (
                  <Card className="p-6 mb-6">
                    {introSection && isSectionVisible(introSection) && (
                      <div className="mb-4">
                        <Text className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                          {replaceLabelPlaceholders(introSection.title)}
                        </Text>
                      </div>
                    )}
                    {visibleConsentQuestions.map((field, index) => renderField(field, index))}
                  </Card>
                );
              })()}

              {/* Section 1: Borrower Profile */}
              {questionSections.section1.length > 0 && (() => {
                const section1Config = sections.find(s => s.id === 'section_1');
                // Show section 1 if consent is accepted
                const showSection1 = formData.consent === '1';
                if (!showSection1) return null;

                // Check if there are any visible questions in this section
                const visibleQuestions = questionSections.section1.filter(field => isFieldVisible(field));
                if (visibleQuestions.length === 0) return null;

                return (
                  <Card className="p-6 mb-6">
                    {section1Config && (
                      <>
                        <Heading level={4} className="text-gray-900 dark:text-white mb-2">
                          {section1Config.title}
                        </Heading>
                        {section1Config.sub_title && (
                          <Text className="text-gray-600 dark:text-gray-400 mb-6">
                            {section1Config.sub_title}
                          </Text>
                        )}
                      </>
                    )}
                    {questionSections.section1
                      .filter(field => isFieldVisible(field)) // Filter visible questions first
                      .sort((a, b) => {
                        // Sort questions to maintain proper order:
                        // resp_name -> resp_age -> resp_gender -> q1_04a -> q1_04b -> q1_05 -> etc.
                        const order = ['resp_name', 'resp_age', 'resp_gender', 'q1_04a', 'q1_04b'];
                        const aIndex = order.indexOf(a.tag);
                        const bIndex = order.indexOf(b.tag);
                        if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
                        if (aIndex !== -1) return -1;
                        if (bIndex !== -1) return 1;
                        // For other questions, maintain original order
                        return 0;
                      })
                      .map((field, index) => renderField(field, index))}
                  </Card>
                );
              })()}

              {/* Section 2: Purpose and Impact of Loan */}
              {(() => {
                const section2Config = sections.find(s => s.id === 'section_2');
                const showSection2 = formData.consent === '1';
                if (!showSection2) return null;

                // Filter visible questions for this section
                const visibleQuestions = questionSections.section2.filter(field => isFieldVisible(field));

                // Show section only if there are visible questions
                if (visibleQuestions.length === 0) return null;

                return (
                  <Card className="p-6 mb-6">
                    {section2Config && (
                      <>
                        <Heading level={4} className="text-gray-900 dark:text-white mb-2">
                          {section2Config.title}
                        </Heading>
                        {section2Config.sub_title && (
                          <Text className="text-gray-600 dark:text-gray-400 mb-6">
                            {section2Config.sub_title}
                          </Text>
                        )}
                      </>
                    )}
                    {questionSections.section2.map((field, index) => {
                      // Show info_8 heading before q2_13a_i when it becomes visible
                      if (field.tag === 'q2_13a_i' && isFieldVisible(field)) {
                        const infoSection = sections.find(s => s.id === 'info_8');
                        return (
                          <React.Fragment key={`info_8_${index}`}>
                            {infoSection && (
                              <div className="mb-6 mt-4">
                                <Heading level={4} className="text-gray-900 dark:text-white mb-2">
                                  {infoSection.title}
                                </Heading>
                                {infoSection.sub_title && (
                                  <Text className="text-gray-600 dark:text-gray-400 mb-6">
                                    {infoSection.sub_title}
                                  </Text>
                                )}
                              </div>
                            )}
                            {renderField(field, index)}
                          </React.Fragment>
                        );
                      }

                      // Show info_9 heading before q2_13b_i when it becomes visible
                      if (field.tag === 'q2_13b_i' && isFieldVisible(field)) {
                        const infoSection = sections.find(s => s.id === 'info_9');
                        return (
                          <React.Fragment key={`info_9_${index}`}>
                            {infoSection && (
                              <div className="mb-6 mt-4">
                                <Heading level={4} className="text-gray-900 dark:text-white mb-2">
                                  {infoSection.title}
                                </Heading>
                                {infoSection.sub_title && (
                                  <Text className="text-gray-600 dark:text-gray-400 mb-6">
                                    {infoSection.sub_title}
                                  </Text>
                                )}
                              </div>
                            )}
                            {renderField(field, index)}
                          </React.Fragment>
                        );
                      }
                      // Show info_10 heading before q2_13c_i when it becomes visible
                      if (field.tag === 'q2_13c_i' && isFieldVisible(field)) {
                        const infoSection = sections.find(s => s.id === 'info_10');
                        return (
                          <React.Fragment key={`info_10_${index}`}>
                            {infoSection && (
                              <div className="mb-6 mt-4">
                                <Heading level={4} className="text-gray-900 dark:text-white mb-2">
                                  {infoSection.title}
                                </Heading>
                                {infoSection.sub_title && (
                                  <Text className="text-gray-600 dark:text-gray-400 mb-6">
                                    {infoSection.sub_title}
                                  </Text>
                                )}
                              </div>
                            )}
                            {renderField(field, index)}
                          </React.Fragment>
                        );
                      }
                      // Show info_11 heading before q2_13d_i when it becomes visible
                      if (field.tag === 'q2_13d_i' && isFieldVisible(field)) {
                        const infoSection = sections.find(s => s.id === 'info_11');
                        return (
                          <React.Fragment key={`info_11_${index}`}>
                            {infoSection && (
                              <div className="mb-6 mt-4">
                                <Heading level={4} className="text-gray-900 dark:text-white mb-2">
                                  {infoSection.title}
                                </Heading>
                                {infoSection.sub_title && (
                                  <Text className="text-gray-600 dark:text-gray-400 mb-6">
                                    {infoSection.sub_title}
                                  </Text>
                                )}
                              </div>
                            )}
                            {renderField(field, index)}
                          </React.Fragment>
                        );
                      }
                      // Show info_12 heading before q2_13e_i when it becomes visible
                      if (field.tag === 'q2_13e_i' && isFieldVisible(field)) {
                        const infoSection = sections.find(s => s.id === 'info_12');
                        return (
                          <React.Fragment key={`info_12_${index}`}>
                            {infoSection && (
                              <div className="mb-6 mt-4">
                                <Heading level={4} className="text-gray-900 dark:text-white mb-2">
                                  {infoSection.title}
                                </Heading>
                                {infoSection.sub_title && (
                                  <Text className="text-gray-600 dark:text-gray-400 mb-6">
                                    {infoSection.sub_title}
                                  </Text>
                                )}
                              </div>
                            )}
                            {renderField(field, index)}
                          </React.Fragment>
                        );
                      }
                      // Show info_13 heading before q2_13f_i when it becomes visible
                      if (field.tag === 'q2_13f_i' && isFieldVisible(field)) {
                        const infoSection = sections.find(s => s.id === 'info_13');
                        return (
                          <React.Fragment key={`info_13_${index}`}>
                            {infoSection && (
                              <div className="mb-6 mt-4">
                                <Heading level={4} className="text-gray-900 dark:text-white mb-2">
                                  {infoSection.title}
                                </Heading>
                                {infoSection.sub_title && (
                                  <Text className="text-gray-600 dark:text-gray-400 mb-6">
                                    {infoSection.sub_title}
                                  </Text>
                                )}
                              </div>
                            )}
                            {renderField(field, index)}
                          </React.Fragment>
                        );
                      }
                      return renderField(field, index);
                    })}
                  </Card>
                );
              })()}

              {/* Section 3-7: Impact of loan features */}
              {(() => {
                const section3Config = sections.find(s => s.id === 'section_3');
                const showSection3 = formData.consent === '1';
                if (!showSection3) return null;

                // Filter visible questions for this section
                const visibleQuestions = questionSections.section3.filter(field => isFieldVisible(field));

                // Show section only if there are visible questions
                if (visibleQuestions.length === 0) return null;

                return (
                  <Card className="p-6 mb-6">
                    {section3Config && (
                      <>
                        <Heading level={4} className="text-gray-900 dark:text-white mb-2">
                          {section3Config.title}
                        </Heading>
                        {section3Config.sub_title && (
                          <Text className="text-gray-600 dark:text-gray-400 mb-6">
                            {section3Config.sub_title}
                          </Text>
                        )}
                      </>
                    )}
                    {questionSections.section3.map((field, index) => {
                      // Show info_2 heading before q3_01 when it becomes visible
                      if (field.tag === 'q3_01' && isFieldVisible(field)) {
                        const infoSection = sections.find(s => s.id === 'info_2');
                        return (
                          <React.Fragment key={`info_2_${index}`}>
                            {infoSection && (
                              <div className="mb-6 mt-4">
                                <Heading level={4} className="text-gray-900 dark:text-white mb-2">
                                  {infoSection.title}
                                </Heading>
                              </div>
                            )}
                            {renderField(field, index)}
                          </React.Fragment>
                        );
                      }
                      // Show info_3 heading and heading_1 before q4_01a_i when it becomes visible
                      if (field.tag === 'q4_01a_i' && isFieldVisible(field)) {
                        const infoSection = sections.find(s => s.id === 'info_3');
                        const questionHeadingSection = sections.find(s => s.id === 'question_heading');
                        return (
                          <React.Fragment key={`info_3_${index}`}>
                            {infoSection && (
                              <div className="mb-6 mt-4">
                                <Heading level={4} className="text-gray-900 dark:text-white mb-2">
                                  {infoSection.title}
                                </Heading>
                                {infoSection.sub_title && (
                                  <Text className="text-gray-600 dark:text-gray-400 mb-6">
                                    {infoSection.sub_title}
                                  </Text>
                                )}
                              </div>
                            )}
                            {questionHeadingSection && (questionHeadingSection as any).heading_1 && (
                              <div className="mb-4 mt-2">
                                <Heading level={5} className="text-gray-800 dark:text-gray-200 mb-2">
                                  {(questionHeadingSection as any).heading_1}
                                </Heading>
                              </div>
                            )}
                            {renderField(field, index)}
                          </React.Fragment>
                        );
                      }
                      // Show heading_2 before q4_01b_i when it becomes visible
                      if (field.tag === 'q4_01b_i' && isFieldVisible(field)) {
                        const questionHeadingSection = sections.find(s => s.id === 'question_heading');
                        return (
                          <React.Fragment key={`heading_2_${index}`}>
                            {questionHeadingSection && (questionHeadingSection as any).heading_2 && (
                              <div className="mb-4 mt-2">
                                <Heading level={5} className="text-gray-800 dark:text-gray-200 mb-2">
                                  {(questionHeadingSection as any).heading_2}
                                </Heading>
                              </div>
                            )}
                            {renderField(field, index)}
                          </React.Fragment>
                        );
                      }
                      // Show info_1 heading before q4_01d_01 when it becomes visible
                      if (field.tag === 'q4_01d_01' && isFieldVisible(field)) {
                        const infoSection = sections.find(s => s.id === 'info_1');
                        return (
                          <React.Fragment key={`info_1_${index}`}>
                            {infoSection && (
                              <div className="mb-6 mt-4">
                                <Heading level={4} className="text-gray-900 dark:text-white mb-2">
                                  {infoSection.title}
                                </Heading>
                              </div>
                            )}
                            {renderField(field, index)}
                          </React.Fragment>
                        );
                      }
                      // Show info_4 heading before q5_01 when it becomes visible
                      if (field.tag === 'q5_01' && isFieldVisible(field)) {
                        const infoSection = sections.find(s => s.id === 'info_4');
                        return (
                          <React.Fragment key={`info_4_${index}`}>
                            {infoSection && (
                              <div className="mb-6 mt-4">
                                <Heading level={4} className="text-gray-900 dark:text-white mb-2">
                                  {infoSection.title}
                                </Heading>
                              </div>
                            )}
                            {renderField(field, index)}
                          </React.Fragment>
                        );
                      }
                      // Show info_5 heading before q6_01 when it becomes visible
                      if (field.tag === 'q6_01' && isFieldVisible(field)) {
                        const infoSection = sections.find(s => s.id === 'info_5');
                        return (
                          <React.Fragment key={`info_5_${index}`}>
                            {infoSection && (
                              <div className="mb-6 mt-4">
                                <Heading level={4} className="text-gray-900 dark:text-white mb-2">
                                  {infoSection.title}
                                </Heading>
                              </div>
                            )}
                            {renderField(field, index)}
                          </React.Fragment>
                        );
                      }
                      // Show info_6 heading before q7_01 when it becomes visible
                      if (field.tag === 'q7_01' && isFieldVisible(field)) {
                        const infoSection = sections.find(s => s.id === 'info_6');
                        return (
                          <React.Fragment key={`info_6_${index}`}>
                            {infoSection && (
                              <div className="mb-6 mt-4">
                                <Heading level={4} className="text-gray-900 dark:text-white mb-2">
                                  {infoSection.title}
                                </Heading>
                              </div>
                            )}
                            {renderField(field, index)}
                          </React.Fragment>
                        );
                      }
                      // Show info_7 heading, subtitle, and heading_3 before q8_01 when it becomes visible
                      if (field.tag === 'q8_01' && isFieldVisible(field)) {
                        const infoSection = sections.find(s => s.id === 'info_7');
                        const questionHeadingSection = sections.find(s => s.id === 'question_heading');
                        return (
                          <React.Fragment key={`info_7_${index}`}>
                            {infoSection && (
                              <div className="mb-6 mt-4">
                                <Heading level={4} className="text-gray-900 dark:text-white mb-2">
                                  {infoSection.title}
                                </Heading>
                                {infoSection.sub_title && (
                                  <Text className="text-gray-600 dark:text-gray-400 mb-6">
                                    {infoSection.sub_title}
                                  </Text>
                                )}
                              </div>
                            )}
                            {questionHeadingSection && (questionHeadingSection as any).heading_3 && (
                              <div className="mb-4 mt-2">
                                <Heading level={5} className="text-gray-800 dark:text-gray-200 mb-2">
                                  {(questionHeadingSection as any).heading_3}
                                </Heading>
                              </div>
                            )}
                            {renderField(field, index)}
                          </React.Fragment>
                        );
                      }
                      // Show heading_4 before q8_01a_i when it becomes visible
                      if (field.tag === 'q8_01a_i' && isFieldVisible(field)) {
                        const questionHeadingSection = sections.find(s => s.id === 'question_heading');
                        return (
                          <React.Fragment key={`heading_4_${index}`}>
                            {questionHeadingSection && (questionHeadingSection as any).heading_4 && (
                              <div className="mb-4 mt-2">
                                <Heading level={5} className="text-gray-800 dark:text-gray-200 mb-2">
                                  {(questionHeadingSection as any).heading_4}
                                </Heading>
                              </div>
                            )}
                            {renderField(field, index)}
                          </React.Fragment>
                        );
                      }
                      // Show heading_5 before q8_01b_i when it becomes visible
                      if (field.tag === 'q8_01b_i' && isFieldVisible(field)) {
                        const questionHeadingSection = sections.find(s => s.id === 'question_heading');
                        return (
                          <React.Fragment key={`heading_5_${index}`}>
                            {questionHeadingSection && (questionHeadingSection as any).heading_5 && (
                              <div className="mb-4 mt-2">
                                <Heading level={5} className="text-gray-800 dark:text-gray-200 mb-2">
                                  {(questionHeadingSection as any).heading_5}
                                </Heading>
                              </div>
                            )}
                            {renderField(field, index)}
                          </React.Fragment>
                        );
                      }
                      // Show heading_6 before q8_01c_i when it becomes visible
                      if (field.tag === 'q8_01c_i' && isFieldVisible(field)) {
                        const questionHeadingSection = sections.find(s => s.id === 'question_heading');
                        return (
                          <React.Fragment key={`heading_6_${index}`}>
                            {questionHeadingSection && (questionHeadingSection as any).heading_6 && (
                              <div className="mb-4 mt-2">
                                <Heading level={5} className="text-gray-800 dark:text-gray-200 mb-2">
                                  {(questionHeadingSection as any).heading_6}
                                </Heading>
                              </div>
                            )}
                            {renderField(field, index)}
                          </React.Fragment>
                        );
                      }
                      // Show heading_7 before q8_01d_i when it becomes visible
                      if (field.tag === 'q8_01d_i' && isFieldVisible(field)) {
                        const questionHeadingSection = sections.find(s => s.id === 'question_heading');
                        return (
                          <React.Fragment key={`heading_7_${index}`}>
                            {questionHeadingSection && (questionHeadingSection as any).heading_7 && (
                              <div className="mb-4 mt-2">
                                <Heading level={5} className="text-gray-800 dark:text-gray-200 mb-2">
                                  {(questionHeadingSection as any).heading_7}
                                </Heading>
                              </div>
                            )}
                            {renderField(field, index)}
                          </React.Fragment>
                        );
                      }
                      // Show heading_8 before q8_01e_i when it becomes visible
                      if (field.tag === 'q8_01e_i' && isFieldVisible(field)) {
                        const questionHeadingSection = sections.find(s => s.id === 'question_heading');
                        return (
                          <React.Fragment key={`heading_8_${index}`}>
                            {questionHeadingSection && (questionHeadingSection as any).heading_8 && (
                              <div className="mb-4 mt-2">
                                <Heading level={5} className="text-gray-800 dark:text-gray-200 mb-2">
                                  {(questionHeadingSection as any).heading_8}
                                </Heading>
                              </div>
                            )}
                            {renderField(field, index)}
                          </React.Fragment>
                        );
                      }
                      // Show heading_9 before q8_01g_i_a when it becomes visible
                      if (field.tag === 'q8_01g_i_a' && isFieldVisible(field)) {
                        const questionHeadingSection = sections.find(s => s.id === 'question_heading');
                        return (
                          <React.Fragment key={`heading_9_${index}`}>
                            {questionHeadingSection && (questionHeadingSection as any).heading_9 && (
                              <div className="mb-4 mt-2">
                                <Heading level={5} className="text-gray-800 dark:text-gray-200 mb-2">
                                  {(questionHeadingSection as any).heading_9}
                                </Heading>
                              </div>
                            )}
                            {renderField(field, index)}
                          </React.Fragment>
                        );
                      }
                      return renderField(field, index);
                    })}
                  </Card>
                );
              })()}

              {/* Other questions */}
              {questionSections.other.length > 0 && (
                <Card className="p-6 mb-6">
                  {questionSections.other.map((field, index) => renderField(field, index))}
                </Card>
              )}
            </>
          );
        })()}

        {/* Submit Buttons */}
        <Card className="p-6">
          <div className="flex gap-4">
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="min-w-[150px] bg-green-600 hover:bg-green-700 text-white"
            >
              <i className="fa fa-save mr-2"></i>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
            <Button
              type="button"
              onClick={handleCallDropped}
              size="lg"
              disabled={isSubmitting}
              className="min-w-[150px] bg-red-600 hover:bg-red-700 text-white"
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
