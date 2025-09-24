'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useForm, UseFormReturn, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronLeft, ChevronRight, Check, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import FormError from '@/components/ui/FormError';
import FormSuccess from '@/components/ui/FormSuccess';
import { cn } from '@/lib/utils';

export interface StepConfig {
  id: string;
  title: string;
  description?: string;
  schema: z.ZodType<any>;
  component: React.ComponentType<{
    form: UseFormReturn<any>;
    isActive: boolean;
    isCompleted: boolean;
    isFirst: boolean;
    isLast: boolean;
  }>;
  validation?: 'onChange' | 'onBlur' | 'onSubmit';
  canSkip?: boolean;
  skipCondition?: (data: any) => boolean;
}

export interface MultiStepFormProps<T extends FieldValues> {
  steps: StepConfig[];
  onSubmit: (data: T) => Promise<void> | void;
  onStepChange?: (stepIndex: number, stepId: string) => void;
  onComplete?: (data: T) => void;
  initialData?: Partial<T>;
  className?: string;
  showProgress?: boolean;
  showStepNumbers?: boolean;
  allowBackNavigation?: boolean;
  autoSave?: boolean;
  autoSaveInterval?: number;
  loading?: boolean;
  successMessage?: string;
  errorMessage?: string;
  onClearSuccess?: () => void;
  onClearError?: () => void;
}

export default function MultiStepForm<T extends FieldValues>({
  steps,
  onSubmit,
  onStepChange,
  onComplete,
  initialData,
  className,
  showProgress = true,
  showStepNumbers = true,
  allowBackNavigation = true,
  autoSave = false,
  autoSaveInterval = 30000,
  loading = false,
  successMessage,
  errorMessage,
  onClearSuccess,
  onClearError,
}: MultiStepFormProps<T>) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepErrors, setStepErrors] = useState<Record<number, string>>({});
  
  const formRef = useRef<HTMLFormElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Create form with current step schema
  const currentStepConfig = steps[currentStep];
  const form = useForm<T>({
    resolver: zodResolver(currentStepConfig.schema),
    mode: currentStepConfig.validation || 'onChange',
    defaultValues: initialData as any,
  });

  const { handleSubmit, formState: { isValid, isDirty }, watch, trigger } = form;

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave || !isDirty) return;

    const interval = setInterval(() => {
      const formData = watch();
      localStorage.setItem('multistep-form-data', JSON.stringify(formData));
    }, autoSaveInterval);

    return () => clearInterval(interval);
  }, [autoSave, isDirty, watch, autoSaveInterval]);

  // Load auto-saved data
  useEffect(() => {
    if (autoSave) {
      const savedData = localStorage.getItem('multistep-form-data');
      if (savedData) {
        try {
          const data = JSON.parse(savedData);
          Object.keys(data).forEach(key => {
            form.setValue(key as keyof T, data[key]);
          });
        } catch (error) {
          console.error('Failed to load auto-saved data:', error);
        }
      }
    }
  }, [autoSave, form]);

  // Handle step navigation
  const goToStep = async (stepIndex: number) => {
    if (stepIndex < 0 || stepIndex >= steps.length) return;

    // Validate current step before moving
    if (stepIndex > currentStep) {
      const isCurrentStepValid = await trigger();
      if (!isCurrentStepValid) {
        setStepErrors(prev => ({
          ...prev,
          [currentStep]: 'Please fix the errors before proceeding'
        }));
        return;
      }
    }

    // Clear step errors
    setStepErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[currentStep];
      return newErrors;
    });

    setCurrentStep(stepIndex);
    onStepChange?.(stepIndex, steps[stepIndex].id);
  };

  // Handle next step
  const handleNext = async () => {
    const isCurrentStepValid = await trigger();
    
    if (!isCurrentStepValid) {
      setStepErrors(prev => ({
        ...prev,
        [currentStep]: 'Please fix the errors before proceeding'
      }));
      return;
    }

    // Mark current step as completed
    setCompletedSteps(prev => new Set([...prev, currentStep]));

    // Check if we can skip next step
    const nextStepIndex = currentStep + 1;
    if (nextStepIndex < steps.length) {
      const nextStep = steps[nextStepIndex];
      if (nextStep.skipCondition) {
        const formData = watch();
        if (nextStep.skipCondition(formData)) {
          goToStep(nextStepIndex + 1);
          return;
        }
      }
    }

    goToStep(nextStepIndex);
  };

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    }
  };

  // Handle form submission
  const handleFormSubmit = async (data: T) => {
    setIsSubmitting(true);
    
    try {
      await onSubmit(data);
      
      // Mark all steps as completed
      setCompletedSteps(new Set(steps.map((_, index) => index)));
      
      // Clear auto-saved data
      if (autoSave) {
        localStorage.removeItem('multistep-form-data');
      }
      
      onComplete?.(data);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate progress
  const progress = ((currentStep + 1) / steps.length) * 100;
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className={cn('w-full max-w-4xl mx-auto', className)}>
      {/* Progress Bar */}
      {showProgress && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Step {currentStep + 1} of {steps.length}
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {Math.round(progress)}% Complete
            </span>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Step Navigation */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                'flex items-center space-x-2',
                index < steps.length - 1 && 'flex-1'
              )}
            >
              <div className="flex items-center space-x-2">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                    index < currentStep && 'bg-green-600 text-white',
                    index === currentStep && 'bg-blue-600 text-white',
                    index > currentStep && 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  )}
                >
                  {showStepNumbers ? (
                    index < currentStep ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      index + 1
                    )
                  ) : (
                    index < currentStep ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-current" />
                    )
                  )}
                </div>
                <div className="hidden sm:block">
                  <div className={cn(
                    'text-sm font-medium',
                    index <= currentStep ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                  )}>
                    {step.title}
                  </div>
                  {step.description && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {step.description}
                    </div>
                  )}
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700 mx-4" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <FormSuccess
          message={successMessage}
          dismissible
          onDismiss={onClearSuccess}
          className="mb-6"
        />
      )}

      {errorMessage && (
        <FormError
          error={errorMessage}
          dismissible
          onDismiss={onClearError}
          className="mb-6"
        />
      )}

      {/* Step Errors */}
      {stepErrors[currentStep] && (
        <FormError
          error={stepErrors[currentStep]}
          className="mb-6"
        />
      )}

      {/* Form */}
      <form
        ref={formRef}
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-6"
      >
        {/* Current Step Content */}
        <div
          ref={(el) => (stepRefs.current[currentStep] = el)}
          className="min-h-[400px]"
        >
          <currentStepConfig.component
            form={form}
            isActive={true}
            isCompleted={completedSteps.has(currentStep)}
            isFirst={isFirstStep}
            isLast={isLastStep}
          />
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
          <div>
            {allowBackNavigation && !isFirstStep && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={loading || isSubmitting}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {!isLastStep ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={loading || isSubmitting || !isValid}
                loading={loading || isSubmitting}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={loading || isSubmitting || !isValid}
                loading={loading || isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
