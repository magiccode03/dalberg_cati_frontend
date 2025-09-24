import { useForm, UseFormProps, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCallback, useMemo } from 'react';

// Generic form hook with Zod validation
export function useFormValidation<T extends z.ZodType>(
  schema: T,
  options?: Omit<UseFormProps<z.infer<T>>, 'resolver'>
): UseFormReturn<z.infer<T>> {
  return useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    mode: 'onChange', // Validate on change for better UX
    reValidateMode: 'onChange',
    ...options,
  });
}

// Custom hook for form field validation
export function useFieldValidation() {
  const getFieldError = useCallback((errors: any, fieldName: string) => {
    const fieldError = errors[fieldName];
    return fieldError?.message || null;
  }, []);

  const hasFieldError = useCallback((errors: any, fieldName: string) => {
    return !!errors[fieldName];
  }, []);

  const getFieldClassName = useCallback((
    errors: any,
    fieldName: string,
    baseClassName: string = '',
    errorClassName: string = 'border-red-500 focus:ring-red-500 focus:border-red-500'
  ) => {
    const hasError = hasFieldError(errors, fieldName);
    return hasError ? `${baseClassName} ${errorClassName}` : baseClassName;
  }, [hasFieldError]);

  return {
    getFieldError,
    hasFieldError,
    getFieldClassName,
  };
}

// Custom hook for form submission with loading state
export function useFormSubmission<T extends Record<string, any>>(
  onSubmit: (data: T) => Promise<void> | void,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
    resetOnSuccess?: boolean;
  }
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (data: T) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      
      await onSubmit(data);
      
      if (options?.onSuccess) {
        options.onSuccess(data);
      }
      
      if (options?.resetOnSuccess) {
        // Reset form if needed
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setSubmitError(errorMessage);
      
      if (options?.onError) {
        options.onError(error instanceof Error ? error : new Error(errorMessage));
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [onSubmit, options]);

  return {
    handleSubmit,
    isSubmitting,
    submitError,
    clearError: () => setSubmitError(null),
  };
}

// Custom hook for form state management
export function useFormState<T extends Record<string, any>>(
  initialData?: Partial<T>,
  options?: {
    autoSave?: boolean;
    autoSaveInterval?: number;
    onAutoSave?: (data: T) => void;
  }
) {
  const [formData, setFormData] = useState<T>(initialData as T);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const updateField = useCallback((fieldName: keyof T, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value,
    }));
    setIsDirty(true);
  }, []);

  const updateFields = useCallback((updates: Partial<T>) => {
    setFormData(prev => ({
      ...prev,
      ...updates,
    }));
    setIsDirty(true);
  }, []);

  const resetForm = useCallback((newData?: Partial<T>) => {
    setFormData(newData as T || initialData as T);
    setIsDirty(false);
    setLastSaved(null);
  }, [initialData]);

  const markAsSaved = useCallback(() => {
    setIsDirty(false);
    setLastSaved(new Date());
  }, []);

  // Auto-save functionality
  useEffect(() => {
    if (!options?.autoSave || !isDirty) return;

    const interval = setInterval(() => {
      if (options.onAutoSave) {
        options.onAutoSave(formData);
        markAsSaved();
      }
    }, options.autoSaveInterval || 30000); // Default 30 seconds

    return () => clearInterval(interval);
  }, [formData, isDirty, options, markAsSaved]);

  return {
    formData,
    isDirty,
    lastSaved,
    updateField,
    updateFields,
    resetForm,
    markAsSaved,
  };
}

// Custom hook for form validation with async validation
export function useAsyncValidation<T extends z.ZodType>(
  schema: T,
  asyncValidators?: Record<string, (value: any) => Promise<boolean | string>>
) {
  const form = useFormValidation(schema);
  const [asyncErrors, setAsyncErrors] = useState<Record<string, string>>({});

  const validateFieldAsync = useCallback(async (fieldName: string, value: any) => {
    if (!asyncValidators?.[fieldName]) return;

    try {
      const result = await asyncValidators[fieldName](value);
      if (typeof result === 'string') {
        setAsyncErrors(prev => ({ ...prev, [fieldName]: result }));
      } else if (!result) {
        setAsyncErrors(prev => ({ ...prev, [fieldName]: 'Validation failed' }));
      } else {
        setAsyncErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
      }
    } catch (error) {
      setAsyncErrors(prev => ({
        ...prev,
        [fieldName]: error instanceof Error ? error.message : 'Validation error'
      }));
    }
  }, [asyncValidators]);

  const clearAsyncError = useCallback((fieldName: string) => {
    setAsyncErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  const getAllErrors = useCallback(() => {
    return {
      ...form.formState.errors,
      ...asyncErrors,
    };
  }, [form.formState.errors, asyncErrors]);

  return {
    ...form,
    asyncErrors,
    validateFieldAsync,
    clearAsyncError,
    getAllErrors,
  };
}

// Custom hook for form field dependencies
export function useFieldDependencies<T extends Record<string, any>>(
  formData: T,
  dependencies: Record<string, (data: T) => any>
) {
  const [computedValues, setComputedValues] = useState<Record<string, any>>({});

  useEffect(() => {
    const newComputedValues: Record<string, any> = {};
    
    Object.entries(dependencies).forEach(([fieldName, computeFn]) => {
      try {
        newComputedValues[fieldName] = computeFn(formData);
      } catch (error) {
        console.error(`Error computing field ${fieldName}:`, error);
        newComputedValues[fieldName] = null;
      }
    });

    setComputedValues(newComputedValues);
  }, [formData, dependencies]);

  return computedValues;
}

// Custom hook for form persistence
export function useFormPersistence<T extends Record<string, any>>(
  formKey: string,
  initialData?: T
) {
  const [isLoaded, setIsLoaded] = useState(false);

  const saveFormData = useCallback((data: T) => {
    try {
      localStorage.setItem(`form_${formKey}`, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save form data:', error);
    }
  }, [formKey]);

  const loadFormData = useCallback((): T | null => {
    try {
      const saved = localStorage.getItem(`form_${formKey}`);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Failed to load form data:', error);
      return null;
    }
  }, [formKey]);

  const clearFormData = useCallback(() => {
    try {
      localStorage.removeItem(`form_${formKey}`);
    } catch (error) {
      console.error('Failed to clear form data:', error);
    }
  }, [formKey]);

  // Load form data on mount
  useEffect(() => {
    const savedData = loadFormData();
    if (savedData) {
      // Merge with initial data
      const mergedData = { ...initialData, ...savedData };
      return mergedData;
    }
    setIsLoaded(true);
  }, [formKey, initialData, loadFormData]);

  return {
    saveFormData,
    loadFormData,
    clearFormData,
    isLoaded,
  };
}

// Import useState and useEffect
import { useState, useEffect } from 'react';
