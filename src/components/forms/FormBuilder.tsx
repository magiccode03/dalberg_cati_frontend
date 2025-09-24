'use client';

import React from 'react';
import { useForm, UseFormReturn, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import FormField from '@/components/ui/FormField';
import FormError from '@/components/ui/FormError';
import FormSuccess from '@/components/ui/FormSuccess';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Checkbox from '@/components/ui/Checkbox';
import Radio from '@/components/ui/Radio';
import SelectDropdown from '@/components/ui/SelectDropdown';
import DateRangePicker from '@/components/ui/DateRangePicker';
import FileUpload from '@/components/ui/FileUpload';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export interface FormFieldConfig {
  name: string;
  type: 'text' | 'email' | 'password' | 'tel' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'dateRange' | 'file';
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  helpText?: string;
  description?: string;
  options?: Array<{ value: string; label: string; group?: string }>;
  validation?: z.ZodTypeAny;
  defaultValue?: any;
  className?: string;
  rows?: number;
  accept?: string;
  maxFiles?: number;
  maxSize?: number;
  allowedTypes?: string[];
  searchable?: boolean;
  multiple?: boolean;
  clearable?: boolean;
  groupBy?: string;
  minDate?: Date;
  maxDate?: Date;
  presets?: Array<{
    label: string;
    value: { startDate: Date; endDate: Date };
  }>;
}

export interface FormBuilderProps<T extends FieldValues> {
  schema: z.ZodType<T>;
  fields: FormFieldConfig[];
  onSubmit: (data: T) => Promise<void> | void;
  defaultValues?: Partial<T>;
  submitLabel?: string;
  resetLabel?: string;
  showReset?: boolean;
  className?: string;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  loading?: boolean;
  successMessage?: string;
  errorMessage?: string;
  onClearSuccess?: () => void;
  onClearError?: () => void;
}

export default function FormBuilder<T extends FieldValues>({
  schema,
  fields,
  onSubmit,
  defaultValues,
  submitLabel = 'Submit',
  resetLabel = 'Reset',
  showReset = true,
  className,
  onSuccess,
  onError,
  loading = false,
  successMessage,
  errorMessage,
  onClearSuccess,
  onClearError,
}: FormBuilderProps<T>) {
  const form = useForm<T>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: defaultValues as any,
  });

  const { handleSubmit, watch, setValue, reset, formState: { errors, isDirty, isValid } } = form;

  const handleFormSubmit = async (data: T) => {
    try {
      await onSubmit(data);
      if (onSuccess) {
        onSuccess(data);
      }
    } catch (error) {
      if (onError) {
        onError(error instanceof Error ? error : new Error('Form submission failed'));
      }
    }
  };

  const renderField = (fieldConfig: FormFieldConfig) => {
    const { name, type, label, placeholder, required, disabled, helpText, description, className: fieldClassName, ...props } = fieldConfig;
    
    const fieldValue = watch(name as keyof T);
    const fieldError = errors[name as keyof T];

    const commonProps = {
      name: name as any,
      register: form.register,
      error: fieldError,
      required,
      disabled,
      className: fieldClassName,
      helpText,
      description,
    };

    switch (type) {
      case 'text':
      case 'email':
      case 'password':
      case 'tel':
      case 'number':
        return (
          <FormField key={name} label={label} {...commonProps}>
            <Input
              type={type}
              placeholder={placeholder}
              className={fieldError ? 'border-red-500' : ''}
            />
          </FormField>
        );

      case 'textarea':
        return (
          <FormField key={name} label={label} {...commonProps}>
            <Textarea
              placeholder={placeholder}
              rows={props.rows || 3}
              className={fieldError ? 'border-red-500' : ''}
            />
          </FormField>
        );

      case 'select':
        return (
          <FormField key={name} label={label} {...commonProps}>
            <SelectDropdown
              options={props.options || []}
              value={fieldValue}
              onChange={(value) => setValue(name as keyof T, value as any)}
              placeholder={placeholder}
              searchable={props.searchable}
              multiple={props.multiple}
              clearable={props.clearable}
              groupBy={props.groupBy}
              error={fieldError?.message}
            />
          </FormField>
        );

      case 'checkbox':
        return (
          <FormField key={name} label={label} {...commonProps}>
            <Checkbox
              label={placeholder || label}
              checked={fieldValue || false}
              onChange={(checked) => setValue(name as keyof T, checked as any)}
              error={fieldError?.message}
            />
          </FormField>
        );

      case 'radio':
        return (
          <FormField key={name} label={label} {...commonProps}>
            <div className="space-y-2">
              {props.options?.map((option) => (
                <Radio
                  key={option.value}
                  name={name}
                  value={option.value}
                  label={option.label}
                  checked={fieldValue === option.value}
                  onChange={(e) => setValue(name as keyof T, e.target.value as any)}
                  error={fieldError?.message}
                />
              ))}
            </div>
          </FormField>
        );

      case 'date':
        return (
          <FormField key={name} label={label} {...commonProps}>
            <Input
              type="date"
              value={fieldValue ? new Date(fieldValue).toISOString().split('T')[0] : ''}
              onChange={(e) => setValue(name as keyof T, e.target.value as any)}
              className={fieldError ? 'border-red-500' : ''}
            />
          </FormField>
        );

      case 'dateRange':
        return (
          <FormField key={name} label={label} {...commonProps}>
            <DateRangePicker
              value={fieldValue || { startDate: null, endDate: null }}
              onChange={(value) => setValue(name as keyof T, value as any)}
              placeholder={placeholder}
              minDate={props.minDate}
              maxDate={props.maxDate}
              presets={props.presets}
              error={fieldError?.message}
            />
          </FormField>
        );

      case 'file':
        return (
          <FormField key={name} label={label} {...commonProps}>
            <FileUpload
              files={fieldValue || []}
              onChange={(files) => setValue(name as keyof T, files as any)}
              accept={props.accept}
              maxFiles={props.maxFiles}
              maxSize={props.maxSize}
              allowedTypes={props.allowedTypes}
              error={fieldError?.message}
            />
          </FormField>
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Success/Error Messages */}
      {successMessage && (
        <FormSuccess
          message={successMessage}
          dismissible
          onDismiss={onClearSuccess}
        />
      )}

      {errorMessage && (
        <FormError
          error={errorMessage}
          dismissible
          onDismiss={onClearError}
        />
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map(renderField)}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          {showReset && (
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              disabled={loading}
            >
              {resetLabel}
            </Button>
          )}
          <Button
            type="submit"
            disabled={loading || !isValid}
            loading={loading}
          >
            {loading ? 'Submitting...' : submitLabel}
          </Button>
        </div>
      </form>

      {/* Form Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
          <div className="text-gray-500 dark:text-gray-400">Status</div>
          <div className="font-medium text-gray-900 dark:text-white">
            {isDirty ? 'Modified' : 'Clean'}
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
          <div className="text-gray-500 dark:text-gray-400">Validation</div>
          <div className={`font-medium ${isValid ? 'text-green-600' : 'text-red-600'}`}>
            {isValid ? 'Valid' : 'Invalid'}
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
          <div className="text-gray-500 dark:text-gray-400">Errors</div>
          <div className="font-medium text-gray-900 dark:text-white">
            {Object.keys(errors).length}
          </div>
        </div>
      </div>
    </div>
  );
}
