'use client';

import React from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import Modal from './Modal';
import Button from './Button';
import FormError from './FormError';
import FormSuccess from './FormSuccess';

export interface FormModalProps<T extends FieldValues> {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: T) => void;
  form: UseFormReturn<T>;
  title: string;
  children: React.ReactNode;
  submitText?: string;
  cancelText?: string;
  loading?: boolean;
  disabled?: boolean;
  showCancel?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  successMessage?: string;
  errorMessage?: string;
  onClearSuccess?: () => void;
  onClearError?: () => void;
  className?: string;
  bodyClassName?: string;
  footerClassName?: string;
}

export default function FormModal<T extends FieldValues>({
  isOpen,
  onClose,
  onSubmit,
  form,
  title,
  children,
  submitText = 'Save',
  cancelText = 'Cancel',
  loading = false,
  disabled = false,
  showCancel = true,
  size = 'lg',
  successMessage,
  errorMessage,
  onClearSuccess,
  onClearError,
  className,
  bodyClassName,
  footerClassName,
}: FormModalProps<T>) {
  const { handleSubmit, formState: { isValid, isDirty } } = form;

  const handleFormSubmit = (data: T) => {
    if (!loading && !disabled) {
      onSubmit(data);
    }
  };

  const footer = (
    <div className="flex items-center justify-end space-x-3">
      {showCancel && (
        <Button
          variant="outline"
          onClick={onClose}
          disabled={loading || disabled}
        >
          {cancelText}
        </Button>
      )}
      <Button
        type="submit"
        form="form-modal-form"
        loading={loading}
        disabled={disabled || !isValid || !isDirty}
      >
        {submitText}
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      showHeader={true}
      showFooter={true}
      footer={footer}
      loading={loading}
      disabled={disabled}
      closeOnOverlayClick={!loading}
      closeOnEscape={!loading}
      className={className}
      bodyClassName={bodyClassName}
      footerClassName={footerClassName}
    >
      <form
        id="form-modal-form"
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-6"
      >
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

        {/* Form Content */}
        {children}
      </form>
    </Modal>
  );
}
