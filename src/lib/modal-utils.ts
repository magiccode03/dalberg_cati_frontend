import { z } from 'zod';

// Common modal configurations
export const modalConfigs = {
  // User management modals
  createUser: {
    title: 'Create New User',
    size: 'lg' as const,
    formSchema: z.object({
      name: z.string().min(2, 'Name must be at least 2 characters'),
      email: z.string().email('Please enter a valid email address'),
      role: z.string().min(1, 'Please select a role'),
      department: z.string().optional(),
    }),
  },
  
  editUser: {
    title: 'Edit User',
    size: 'lg' as const,
    formSchema: z.object({
      name: z.string().min(2, 'Name must be at least 2 characters'),
      email: z.string().email('Please enter a valid email address'),
      role: z.string().min(1, 'Please select a role'),
      department: z.string().optional(),
    }),
  },
  
  deleteUser: {
    title: 'Delete User',
    message: 'Are you sure you want to delete this user? This action cannot be undone.',
    type: 'danger' as const,
    confirmText: 'Delete',
    cancelText: 'Cancel',
  },
  
  // Survey management modals
  createSurvey: {
    title: 'Create New Survey',
    size: 'xl' as const,
    formSchema: z.object({
      title: z.string().min(5, 'Title must be at least 5 characters'),
      description: z.string().min(10, 'Description must be at least 10 characters'),
      startDate: z.string().min(1, 'Start date is required'),
      endDate: z.string().min(1, 'End date is required'),
      location: z.string().min(1, 'Location is required'),
      targetSample: z.number().min(1, 'Target sample must be at least 1'),
      budget: z.number().min(0, 'Budget cannot be negative'),
      priority: z.enum(['low', 'medium', 'high', 'urgent']),
    }),
  },
  
  editSurvey: {
    title: 'Edit Survey',
    size: 'xl' as const,
    formSchema: z.object({
      title: z.string().min(5, 'Title must be at least 5 characters'),
      description: z.string().min(10, 'Description must be at least 10 characters'),
      startDate: z.string().min(1, 'Start date is required'),
      endDate: z.string().min(1, 'End date is required'),
      location: z.string().min(1, 'Location is required'),
      targetSample: z.number().min(1, 'Target sample must be at least 1'),
      budget: z.number().min(0, 'Budget cannot be negative'),
      priority: z.enum(['low', 'medium', 'high', 'urgent']),
    }),
  },
  
  deleteSurvey: {
    title: 'Delete Survey',
    message: 'Are you sure you want to delete this survey? All associated data will be lost.',
    type: 'danger' as const,
    confirmText: 'Delete',
    cancelText: 'Cancel',
  },
  
  // Quality check modals
  qualityCheck: {
    title: 'Quality Check',
    size: 'lg' as const,
    formSchema: z.object({
      checkType: z.enum(['audio', 'gps', 'duration', 'completeness', 'logic', 'manual']),
      status: z.enum(['passed', 'failed', 'warning', 'pending']),
      score: z.number().min(0).max(100),
      issues: z.array(z.string()).optional(),
      recommendations: z.string().max(500).optional(),
    }),
  },
  
  // Settings modals
  settings: {
    title: 'Settings',
    size: 'md' as const,
    formSchema: z.object({
      theme: z.enum(['light', 'dark', 'system']),
      language: z.string().min(1, 'Please select a language'),
      notifications: z.boolean(),
      autoSave: z.boolean(),
      dataRefreshInterval: z.number().min(30).max(3600),
    }),
  },
  
  // Confirmation modals
  confirmAction: {
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed with this action?',
    type: 'warning' as const,
    confirmText: 'Proceed',
    cancelText: 'Cancel',
  },
  
  confirmDelete: {
    title: 'Confirm Delete',
    message: 'Are you sure you want to delete this item? This action cannot be undone.',
    type: 'danger' as const,
    confirmText: 'Delete',
    cancelText: 'Cancel',
  },
  
  confirmSave: {
    title: 'Save Changes',
    message: 'Do you want to save your changes before leaving?',
    type: 'info' as const,
    confirmText: 'Save',
    cancelText: 'Discard',
  },
};

// Modal factory functions
export const createModalConfig = <T extends z.ZodType>(
  title: string,
  schema: T,
  options?: {
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    submitText?: string;
    cancelText?: string;
  }
) => ({
  title,
  formSchema: schema,
  size: options?.size || 'md',
  submitText: options?.submitText || 'Save',
  cancelText: options?.cancelText || 'Cancel',
});

export const createConfirmationConfig = (
  title: string,
  message: string,
  options?: {
    type?: 'danger' | 'warning' | 'info' | 'success';
    confirmText?: string;
    cancelText?: string;
  }
) => ({
  title,
  message,
  type: options?.type || 'warning',
  confirmText: options?.confirmText || 'Confirm',
  cancelText: options?.cancelText || 'Cancel',
});

// Common form field configurations
export const formFieldConfigs = {
  user: [
    {
      name: 'name',
      type: 'text' as const,
      label: 'Full Name',
      placeholder: 'Enter full name',
      required: true,
    },
    {
      name: 'email',
      type: 'email' as const,
      label: 'Email Address',
      placeholder: 'Enter email address',
      required: true,
    },
    {
      name: 'role',
      type: 'select' as const,
      label: 'Role',
      placeholder: 'Select role',
      required: true,
      options: [
        { value: 'admin', label: 'Administrator' },
        { value: 'pmt', label: 'PMT Manager' },
        { value: 'qc', label: 'QC Manager' },
        { value: 'quality-analyst', label: 'Quality Analyst' },
        { value: 'start-qc', label: 'Start QC' },
        { value: 'data-quality', label: 'Data Quality' },
      ],
    },
    {
      name: 'department',
      type: 'text' as const,
      label: 'Department',
      placeholder: 'Enter department',
      required: false,
    },
  ],
  
  survey: [
    {
      name: 'title',
      type: 'text' as const,
      label: 'Survey Title',
      placeholder: 'Enter survey title',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea' as const,
      label: 'Description',
      placeholder: 'Enter survey description',
      required: true,
      rows: 4,
    },
    {
      name: 'startDate',
      type: 'date' as const,
      label: 'Start Date',
      required: true,
    },
    {
      name: 'endDate',
      type: 'date' as const,
      label: 'End Date',
      required: true,
    },
    {
      name: 'location',
      type: 'text' as const,
      label: 'Location',
      placeholder: 'Enter survey location',
      required: true,
    },
    {
      name: 'targetSample',
      type: 'number' as const,
      label: 'Target Sample Size',
      placeholder: 'Enter target sample size',
      required: true,
    },
    {
      name: 'budget',
      type: 'number' as const,
      label: 'Budget (₹)',
      placeholder: 'Enter budget amount',
      required: true,
    },
    {
      name: 'priority',
      type: 'select' as const,
      label: 'Priority',
      placeholder: 'Select priority',
      required: true,
      options: [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
        { value: 'urgent', label: 'Urgent' },
      ],
    },
  ],
};

// Utility functions for modal management
export const modalUtils = {
  // Get modal configuration by key
  getConfig: (key: keyof typeof modalConfigs) => modalConfigs[key],
  
  // Create a confirmation modal for delete action
  createDeleteConfirmation: (itemName: string, itemType: string = 'item') => 
    createConfirmationConfig(
      `Delete ${itemType}`,
      `Are you sure you want to delete this ${itemName}? This action cannot be undone.`,
      { type: 'danger', confirmText: 'Delete' }
    ),
  
  // Create a confirmation modal for save action
  createSaveConfirmation: (hasUnsavedChanges: boolean = true) => 
    hasUnsavedChanges ? createConfirmationConfig(
      'Save Changes',
      'Do you want to save your changes before leaving?',
      { type: 'info', confirmText: 'Save', cancelText: 'Discard' }
    ) : null,
  
  // Create a confirmation modal for bulk action
  createBulkActionConfirmation: (action: string, count: number) =>
    createConfirmationConfig(
      'Bulk Action',
      `Are you sure you want to ${action} ${count} selected items?`,
      { type: 'warning', confirmText: 'Proceed' }
    ),
  
  // Validate form data against schema
  validateFormData: <T extends z.ZodType>(schema: T, data: unknown) => {
    try {
      return { success: true, data: schema.parse(data) };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { 
          success: false, 
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          }))
        };
      }
      return { success: false, errors: [{ field: 'unknown', message: 'Validation failed' }] };
    }
  },
  
  // Get field configuration by form type
  getFieldConfig: (formType: keyof typeof formFieldConfigs) => 
    formFieldConfigs[formType] || [],
};
