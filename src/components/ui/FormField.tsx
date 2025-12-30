'use client';

import React from 'react';
import { FieldError, FieldPath, FieldValues, UseFormRegister } from 'react-hook-form';
import { cn } from '@/lib/utils';

export interface FormFieldProps<T extends FieldValues> {
  label: string;
  name: FieldPath<T>;
  register: UseFormRegister<T>;
  error?: FieldError;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  helpText?: string;
  description?: string;
}

export default function FormField<T extends FieldValues>({
  label,
  name,
  register,
  error,
  required = false,
  disabled = false,
  className,
  children,
  helpText,
  description,
}: FormFieldProps<T>) {
  const fieldId = `field-${name}`;
  const errorId = `error-${name}`;
  const helpId = `help-${name}`;

  return (
    <div className={cn('space-y-2', className)}>
      <label
        htmlFor={fieldId}
        className={cn(
          'block text-sm font-medium transition-colors',
          error
            ? 'text-red-700 dark:text-red-400'
            : 'text-gray-700 dark:text-gray-300',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>

      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}

      <div className="relative">
        {React.cloneElement(children as React.ReactElement, {
          id: fieldId,
          'aria-invalid': error ? 'true' : 'false',
          'aria-describedby': cn(
            error && errorId,
            helpText && helpId
          ),
          disabled,
          ...register(name),
        })}
      </div>

      {helpText && !error && (
        <p id={helpId} className="text-sm text-gray-500 dark:text-gray-400">
          {helpText}
        </p>
      )}

      {error && (
        <p
          id={errorId}
          className="text-sm text-red-600 dark:text-red-400"
          role="alert"
          aria-live="polite"
        >
          {error.message}
        </p>
      )}
    </div>
  );
}
