'use client';

import React, { useState, useEffect } from 'react';
import { useForm, UseFormReturn, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Minus, Trash2, Eye, EyeOff } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Checkbox from '@/components/ui/Checkbox';
import Radio from '@/components/ui/Radio';
import SelectDropdown from '@/components/ui/SelectDropdown';
import DateRangePicker from '@/components/ui/DateRangePicker';
import FileUpload from '@/components/ui/FileUpload';
import FormField from '@/components/ui/FormField';
import FormError from '@/components/ui/FormError';
import FormSuccess from '@/components/ui/FormSuccess';
import { cn } from '@/lib/utils';

export interface DynamicFieldConfig {
  id: string;
  type: 'text' | 'email' | 'password' | 'tel' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'dateRange' | 'file' | 'array' | 'object';
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
  // Array field specific
  arrayConfig?: {
    minItems?: number;
    maxItems?: number;
    itemConfig: DynamicFieldConfig;
    addButtonText?: string;
    removeButtonText?: string;
  };
  // Object field specific
  objectConfig?: {
    fields: DynamicFieldConfig[];
    layout?: 'grid' | 'stack';
    columns?: number;
  };
  // Conditional rendering
  showWhen?: (data: any) => boolean;
  hideWhen?: (data: any) => boolean;
  // Dependencies
  dependsOn?: string[];
  // Computed values
  computedValue?: (data: any) => any;
}

export interface DynamicFormProps<T extends FieldValues> {
  fields: DynamicFieldConfig[];
  onSubmit: (data: T) => Promise<void> | void;
  schema?: z.ZodType<T>;
  initialData?: Partial<T>;
  className?: string;
  layout?: 'grid' | 'stack';
  columns?: number;
  showSubmitButton?: boolean;
  submitText?: string;
  resetText?: string;
  showResetButton?: boolean;
  loading?: boolean;
  successMessage?: string;
  errorMessage?: string;
  onClearSuccess?: () => void;
  onClearError?: () => void;
  onFieldChange?: (fieldId: string, value: any, formData: T) => void;
  onDataChange?: (data: T) => void;
}

export default function DynamicForm<T extends FieldValues>({
  fields,
  onSubmit,
  schema,
  initialData,
  className,
  layout = 'grid',
  columns = 2,
  showSubmitButton = true,
  submitText = 'Submit',
  resetText = 'Reset',
  showResetButton = true,
  loading = false,
  successMessage,
  errorMessage,
  onClearSuccess,
  onClearError,
  onFieldChange,
  onDataChange,
}: DynamicFormProps<T>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visibleFields, setVisibleFields] = useState<Set<string>>(new Set(fields.map(f => f.id)));

  // Create dynamic schema if not provided
  const dynamicSchema = schema || createDynamicSchema(fields);

  const form = useForm<T>({
    resolver: zodResolver(dynamicSchema),
    mode: 'onChange',
    defaultValues: initialData as any,
  });

  const { handleSubmit, watch, setValue, formState: { errors, isDirty, isValid }, reset } = form;

  // Watch form data changes
  const formData = watch();

  // Update visible fields based on conditions
  useEffect(() => {
    const newVisibleFields = new Set<string>();
    
    fields.forEach(field => {
      let shouldShow = true;
      
      if (field.showWhen) {
        shouldShow = field.showWhen(formData);
      }
      
      if (field.hideWhen) {
        shouldShow = !field.hideWhen(formData);
      }
      
      if (shouldShow) {
        newVisibleFields.add(field.id);
      }
    });
    
    setVisibleFields(newVisibleFields);
  }, [formData, fields]);

  // Handle field changes
  useEffect(() => {
    if (onDataChange) {
      onDataChange(formData);
    }
  }, [formData, onDataChange]);

  // Handle form submission
  const handleFormSubmit = async (data: T) => {
    setIsSubmitting(true);
    
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render field based on type
  const renderField = (fieldConfig: DynamicFieldConfig) => {
    if (!visibleFields.has(fieldConfig.id)) return null;

    const { id, type, label, placeholder, required, disabled, helpText, description, className: fieldClassName, ...props } = fieldConfig;
    
    const fieldValue = formData[id as keyof T];
    const fieldError = errors[id as keyof T];

    const commonProps = {
      name: id as any,
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
          <FormField key={id} label={label} {...commonProps}>
            <Input
              type={type}
              placeholder={placeholder}
              className={fieldError ? 'border-red-500' : ''}
            />
          </FormField>
        );

      case 'textarea':
        return (
          <FormField key={id} label={label} {...commonProps}>
            <Textarea
              placeholder={placeholder}
              rows={props.rows || 3}
              className={fieldError ? 'border-red-500' : ''}
            />
          </FormField>
        );

      case 'select':
        return (
          <FormField key={id} label={label} {...commonProps}>
            <SelectDropdown
              options={props.options || []}
              value={fieldValue}
              onChange={(value) => {
                setValue(id as keyof T, value as any);
                onFieldChange?.(id, value, formData);
              }}
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
          <FormField key={id} label={label} {...commonProps}>
            <Checkbox
              label={placeholder || label}
              checked={fieldValue || false}
              onChange={(checked) => {
                setValue(id as keyof T, checked as any);
                onFieldChange?.(id, checked, formData);
              }}
              error={fieldError?.message}
            />
          </FormField>
        );

      case 'radio':
        return (
          <FormField key={id} label={label} {...commonProps}>
            <div className="space-y-2">
              {props.options?.map((option) => (
                <Radio
                  key={option.value}
                  name={id}
                  value={option.value}
                  label={option.label}
                  checked={fieldValue === option.value}
                  onChange={(e) => {
                    setValue(id as keyof T, e.target.value as any);
                    onFieldChange?.(id, e.target.value, formData);
                  }}
                  error={fieldError?.message}
                />
              ))}
            </div>
          </FormField>
        );

      case 'date':
        return (
          <FormField key={id} label={label} {...commonProps}>
            <Input
              type="date"
              value={fieldValue ? new Date(fieldValue).toISOString().split('T')[0] : ''}
              onChange={(e) => {
                setValue(id as keyof T, e.target.value as any);
                onFieldChange?.(id, e.target.value, formData);
              }}
              className={fieldError ? 'border-red-500' : ''}
            />
          </FormField>
        );

      case 'dateRange':
        return (
          <FormField key={id} label={label} {...commonProps}>
            <DateRangePicker
              value={fieldValue || { startDate: null, endDate: null }}
              onChange={(value) => {
                setValue(id as keyof T, value as any);
                onFieldChange?.(id, value, formData);
              }}
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
          <FormField key={id} label={label} {...commonProps}>
            <FileUpload
              files={fieldValue || []}
              onChange={(files) => {
                setValue(id as keyof T, files as any);
                onFieldChange?.(id, files, formData);
              }}
              accept={props.accept}
              maxFiles={props.maxFiles}
              maxSize={props.maxSize}
              allowedTypes={props.allowedTypes}
              error={fieldError?.message}
            />
          </FormField>
        );

      case 'array':
        return (
          <FormField key={id} label={label} {...commonProps}>
            <ArrayField
              fieldConfig={fieldConfig}
              value={fieldValue || []}
              onChange={(value) => {
                setValue(id as keyof T, value as any);
                onFieldChange?.(id, value, formData);
              }}
              formData={formData}
            />
          </FormField>
        );

      case 'object':
        return (
          <FormField key={id} label={label} {...commonProps}>
            <ObjectField
              fieldConfig={fieldConfig}
              value={fieldValue || {}}
              onChange={(value) => {
                setValue(id as keyof T, value as any);
                onFieldChange?.(id, value, formData);
              }}
              formData={formData}
            />
          </FormField>
        );

      default:
        return null;
    }
  };

  const layoutClasses = {
    grid: `grid grid-cols-1 ${columns === 2 ? 'md:grid-cols-2' : columns === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`,
    stack: 'space-y-6',
  };

  return (
    <div className={cn('w-full', className)}>
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

      {/* Form */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className={layoutClasses[layout]}>
          {fields.map(renderField)}
        </div>

        {/* Form Actions */}
        {(showSubmitButton || showResetButton) && (
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            {showResetButton && (
              <Button
                type="button"
                variant="outline"
                onClick={() => reset()}
                disabled={loading || isSubmitting}
              >
                {resetText}
              </Button>
            )}
            {showSubmitButton && (
              <Button
                type="submit"
                disabled={loading || isSubmitting || !isValid}
                loading={loading || isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : submitText}
              </Button>
            )}
          </div>
        )}
      </form>
    </div>
  );
}

// Helper component for array fields
function ArrayField({ fieldConfig, value, onChange, formData }: {
  fieldConfig: DynamicFieldConfig;
  value: any[];
  onChange: (value: any[]) => void;
  formData: any;
}) {
  const { arrayConfig } = fieldConfig;
  if (!arrayConfig) return null;

  const addItem = () => {
    const newItem = arrayConfig.itemConfig.defaultValue || '';
    onChange([...value, newItem]);
  };

  const removeItem = (index: number) => {
    const newValue = value.filter((_, i) => i !== index);
    onChange(newValue);
  };

  const updateItem = (index: number, newValue: any) => {
    const newArray = [...value];
    newArray[index] = newValue;
    onChange(newArray);
  };

  return (
    <div className="space-y-4">
      {value.map((item, index) => (
        <div key={index} className="flex items-center space-x-2 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="flex-1">
            <Input
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              placeholder={arrayConfig.itemConfig.placeholder}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => removeItem(index)}
            disabled={value.length <= (arrayConfig.minItems || 0)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      
      <Button
        type="button"
        variant="outline"
        onClick={addItem}
        disabled={value.length >= (arrayConfig.maxItems || Infinity)}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        {arrayConfig.addButtonText || 'Add Item'}
      </Button>
    </div>
  );
}

// Helper component for object fields
function ObjectField({ fieldConfig, value, onChange, formData }: {
  fieldConfig: DynamicFieldConfig;
  value: any;
  onChange: (value: any) => void;
  formData: any;
}) {
  const { objectConfig } = fieldConfig;
  if (!objectConfig) return null;

  const updateField = (fieldId: string, fieldValue: any) => {
    onChange({ ...value, [fieldId]: fieldValue });
  };

  const layoutClasses = {
    grid: `grid grid-cols-1 ${objectConfig.columns === 2 ? 'md:grid-cols-2' : objectConfig.columns === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4`,
    stack: 'space-y-4',
  };

  return (
    <div className={layoutClasses[objectConfig.layout || 'grid']}>
      {objectConfig.fields.map((field) => (
        <div key={field.id}>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <Input
            value={value[field.id] || ''}
            onChange={(e) => updateField(field.id, e.target.value)}
            placeholder={field.placeholder}
            type={field.type}
          />
        </div>
      ))}
    </div>
  );
}

// Helper function to create dynamic schema
function createDynamicSchema(fields: DynamicFieldConfig[]): z.ZodType<any> {
  const schemaFields: Record<string, z.ZodTypeAny> = {};

  fields.forEach(field => {
    let fieldSchema: z.ZodTypeAny;

    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
        fieldSchema = z.string();
        break;
      case 'password':
        fieldSchema = z.string().min(8, 'Password must be at least 8 characters');
        break;
      case 'number':
        fieldSchema = z.number();
        break;
      case 'textarea':
        fieldSchema = z.string();
        break;
      case 'select':
      case 'radio':
        fieldSchema = z.string();
        break;
      case 'checkbox':
        fieldSchema = z.boolean();
        break;
      case 'date':
        fieldSchema = z.string();
        break;
      case 'dateRange':
        fieldSchema = z.object({
          startDate: z.date().nullable(),
          endDate: z.date().nullable(),
        });
        break;
      case 'file':
        fieldSchema = z.array(z.any());
        break;
      case 'array':
        fieldSchema = z.array(z.any());
        break;
      case 'object':
        fieldSchema = z.object({});
        break;
      default:
        fieldSchema = z.any();
    }

    if (field.required) {
      fieldSchema = fieldSchema.refine((val) => val !== undefined && val !== null && val !== '', {
        message: `${field.label} is required`,
      });
    }

    if (field.validation) {
      fieldSchema = field.validation;
    }

    schemaFields[field.id] = fieldSchema;
  });

  return z.object(schemaFields);
}
