'use client';

import React from 'react';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';
import { cn } from '@/lib/utils';

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type?: 'danger' | 'warning' | 'info' | 'success';
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  disabled?: boolean;
  showCancel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const typeConfig = {
  danger: {
    icon: XCircle,
    iconColor: 'text-red-500',
    iconBg: 'bg-red-100 dark:bg-red-900/20',
    confirmVariant: 'danger' as const,
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-yellow-500',
    iconBg: 'bg-yellow-100 dark:bg-yellow-900/20',
    confirmVariant: 'warning' as const,
  },
  info: {
    icon: Info,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-100 dark:bg-blue-900/20',
    confirmVariant: 'primary' as const,
  },
  success: {
    icon: CheckCircle,
    iconColor: 'text-green-500',
    iconBg: 'bg-green-100 dark:bg-green-900/20',
    confirmVariant: 'success' as const,
  },
};

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'danger',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  loading = false,
  disabled = false,
  showCancel = true,
  size = 'md',
}: ConfirmationModalProps) {
  const config = typeConfig[type];
  const IconComponent = config.icon;

  const handleConfirm = () => {
    if (!loading && !disabled) {
      onConfirm();
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
        variant={config.confirmVariant}
        onClick={handleConfirm}
        loading={loading}
        disabled={disabled}
      >
        {confirmText}
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={size}
      showHeader={false}
      showFooter={true}
      footer={footer}
      loading={loading}
      disabled={disabled}
      closeOnOverlayClick={!loading}
      closeOnEscape={!loading}
    >
      <div className="flex items-start space-x-4">
        {/* Icon */}
        <div
          className={cn(
            'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
            config.iconBg
          )}
        >
          <IconComponent className={cn('h-6 w-6', config.iconColor)} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {message}
          </p>
        </div>
      </div>
    </Modal>
  );
}
