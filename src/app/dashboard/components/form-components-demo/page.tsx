'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Settings, FileText, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import Breadcrumb from '@/components/ui/Breadcrumb';
import MultiStepForm from '@/components/forms/MultiStepForm';
import WizardForm from '@/components/forms/WizardForm';
import DynamicForm from '@/components/forms/DynamicForm';
import FormBuilder from '@/components/forms/FormBuilder';
import Button from '@/components/ui/Button';
import { useModal, useConfirmationModal } from '@/hooks/useModal';

const breadcrumbItems = [
  { label: 'Components', href: '/dashboard/components' },
  { label: 'Form Components Demo', active: true }
];

// Multi-step form schemas
const personalInfoSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^(\+91|91)?[6-9]\d{9}$/, 'Please enter a valid Indian phone number'),
});

const addressInfoSchema = z.object({
  street: z.string().min(5, 'Street address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  pincode: z.string().regex(/^[1-9][0-9]{5}$/, 'Please enter a valid 6-digit pincode'),
  country: z.string().min(1, 'Please select a country'),
});

const preferencesSchema = z.object({
  newsletter: z.boolean(),
  notifications: z.boolean(),
  theme: z.enum(['light', 'dark', 'system']),
  language: z.string().min(1, 'Please select a language'),
});

// Wizard form schemas
const surveyInfoSchema = z.object({
  title: z.string().min(5, 'Survey title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Please select a category'),
});

const surveySettingsSchema = z.object({
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  targetSample: z.number().min(1, 'Target sample must be at least 1'),
  budget: z.number().min(0, 'Budget cannot be negative'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
});

const surveyQuestionsSchema = z.object({
  questionCount: z.number().min(1, 'At least 1 question is required'),
  questionTypes: z.array(z.string()).min(1, 'Please select at least one question type'),
  estimatedDuration: z.number().min(1, 'Duration must be at least 1 minute'),
});

// Dynamic form configuration
const dynamicFormFields = [
  {
    id: 'name',
    type: 'text' as const,
    label: 'Full Name',
    placeholder: 'Enter your full name',
    required: true,
  },
  {
    id: 'email',
    type: 'email' as const,
    label: 'Email Address',
    placeholder: 'Enter your email address',
    required: true,
  },
  {
    id: 'role',
    type: 'select' as const,
    label: 'Role',
    placeholder: 'Select your role',
    required: true,
    options: [
      { value: 'admin', label: 'Administrator' },
      { value: 'pmt', label: 'PMT Manager' },
      { value: 'qc', label: 'QC Manager' },
      { value: 'quality-analyst', label: 'Quality Analyst' },
    ],
  },
  {
    id: 'notifications',
    type: 'checkbox' as const,
    label: 'Notifications',
    placeholder: 'Enable email notifications',
    required: false,
  },
  {
    id: 'preferences',
    type: 'object' as const,
    label: 'Preferences',
    required: false,
    objectConfig: {
      fields: [
        {
          id: 'theme',
          type: 'select' as const,
          label: 'Theme',
          options: [
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
            { value: 'system', label: 'System' },
          ],
        },
        {
          id: 'language',
          type: 'select' as const,
          label: 'Language',
          options: [
            { value: 'en', label: 'English' },
            { value: 'hi', label: 'Hindi' },
          ],
        },
      ],
      layout: 'grid' as const,
      columns: 2,
    },
  },
  {
    id: 'skills',
    type: 'array' as const,
    label: 'Skills',
    required: false,
    arrayConfig: {
      minItems: 0,
      maxItems: 10,
      itemConfig: {
        id: 'skill',
        type: 'text' as const,
        label: 'Skill',
        placeholder: 'Enter a skill',
      },
      addButtonText: 'Add Skill',
    },
  },
];

// Form Builder configuration
const formBuilderFields = [
  {
    name: 'title',
    type: 'text' as const,
    label: 'Project Title',
    placeholder: 'Enter project title',
    required: true,
  },
  {
    name: 'description',
    type: 'textarea' as const,
    label: 'Description',
    placeholder: 'Enter project description',
    required: true,
    rows: 4,
  },
  {
    name: 'category',
    type: 'select' as const,
    label: 'Category',
    placeholder: 'Select category',
    required: true,
    options: [
      { value: 'research', label: 'Research' },
      { value: 'survey', label: 'Survey' },
      { value: 'analysis', label: 'Analysis' },
      { value: 'other', label: 'Other' },
    ],
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
    name: 'budget',
    type: 'number' as const,
    label: 'Budget (₹)',
    placeholder: 'Enter budget amount',
    required: true,
  },
  {
    name: 'priority',
    type: 'radio' as const,
    label: 'Priority',
    required: true,
    options: [
      { value: 'low', label: 'Low' },
      { value: 'medium', label: 'Medium' },
      { value: 'high', label: 'High' },
      { value: 'urgent', label: 'Urgent' },
    ],
  },
  {
    name: 'isPublic',
    type: 'checkbox' as const,
    label: 'Public Project',
    placeholder: 'Make this project visible to all users',
    required: false,
  },
];

export default function FormComponentsDemoPage() {
  const [activeForm, setActiveForm] = useState<'multistep' | 'wizard' | 'dynamic' | 'builder'>('multistep');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Modal states
  const formModal = useModal();
  const confirmationModal = useConfirmationModal();

  // Multi-step form steps
  const multiStepFormSteps = [
    {
      id: 'personal',
      title: 'Personal Information',
      description: 'Enter your basic personal details',
      schema: personalInfoSchema,
      component: PersonalInfoStep,
    },
    {
      id: 'address',
      title: 'Address Information',
      description: 'Enter your address details',
      schema: addressInfoSchema,
      component: AddressInfoStep,
    },
    {
      id: 'preferences',
      title: 'Preferences',
      description: 'Set your preferences',
      schema: preferencesSchema,
      component: PreferencesStep,
    },
  ];

  // Wizard form steps
  const wizardFormSteps = [
    {
      id: 'info',
      title: 'Survey Information',
      description: 'Basic information about your survey',
      icon: FileText,
      schema: surveyInfoSchema,
      component: SurveyInfoStep,
      helpText: 'Provide a clear and descriptive title for your survey to help participants understand its purpose.',
    },
    {
      id: 'settings',
      title: 'Survey Settings',
      description: 'Configure survey parameters',
      icon: Settings,
      schema: surveySettingsSchema,
      component: SurveySettingsStep,
      warningText: 'Make sure the end date is after the start date and the budget is sufficient for your target sample size.',
    },
    {
      id: 'questions',
      title: 'Question Setup',
      description: 'Configure survey questions',
      icon: CheckCircle,
      schema: surveyQuestionsSchema,
      component: SurveyQuestionsStep,
    },
  ];

  // Form handlers
  const handleMultiStepSubmit = async (data: any) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Multi-step form submitted:', data);
      setSubmitSuccess('Multi-step form submitted successfully!');
    } catch (error) {
      setSubmitError('Failed to submit multi-step form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWizardSubmit = async (data: any) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Wizard form submitted:', data);
      setSubmitSuccess('Wizard form submitted successfully!');
    } catch (error) {
      setSubmitError('Failed to submit wizard form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDynamicSubmit = async (data: any) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Dynamic form submitted:', data);
      setSubmitSuccess('Dynamic form submitted successfully!');
    } catch (error) {
      setSubmitError('Failed to submit dynamic form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormBuilderSubmit = async (data: any) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Form builder submitted:', data);
      setSubmitSuccess('Form builder submitted successfully!');
    } catch (error) {
      setSubmitError('Failed to submit form builder. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmation = () => {
    confirmationModal.show({
      title: 'Confirm Action',
      message: 'Are you sure you want to proceed with this action?',
      type: 'warning',
      confirmText: 'Proceed',
      cancelText: 'Cancel',
      onConfirm: () => {
        console.log('Action confirmed');
        confirmationModal.hide();
      },
    });
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="space-y-8">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Form Components Demo</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Comprehensive demonstration of advanced form components including multi-step, wizard, dynamic, and form builder
          </p>
        </div>

        {/* Form Type Selector */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Select Form Type
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              onClick={() => setActiveForm('multistep')}
              variant={activeForm === 'multistep' ? 'primary' : 'outline'}
              className="w-full"
            >
              <User className="h-4 w-4 mr-2" />
              Multi-Step Form
            </Button>
            <Button
              onClick={() => setActiveForm('wizard')}
              variant={activeForm === 'wizard' ? 'primary' : 'outline'}
              className="w-full"
            >
              <Settings className="h-4 w-4 mr-2" />
              Wizard Form
            </Button>
            <Button
              onClick={() => setActiveForm('dynamic')}
              variant={activeForm === 'dynamic' ? 'primary' : 'outline'}
              className="w-full"
            >
              <FileText className="h-4 w-4 mr-2" />
              Dynamic Form
            </Button>
            <Button
              onClick={() => setActiveForm('builder')}
              variant={activeForm === 'builder' ? 'primary' : 'outline'}
              className="w-full"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Form Builder
            </Button>
          </div>
        </div>

        {/* Form Components */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            {activeForm === 'multistep' && 'Multi-Step Form'}
            {activeForm === 'wizard' && 'Wizard Form'}
            {activeForm === 'dynamic' && 'Dynamic Form'}
            {activeForm === 'builder' && 'Form Builder'}
          </h2>

          {activeForm === 'multistep' && (
            <MultiStepForm
              steps={multiStepFormSteps}
              onSubmit={handleMultiStepSubmit}
              loading={isSubmitting}
              successMessage={submitSuccess}
              errorMessage={submitError}
              onClearSuccess={() => setSubmitSuccess(null)}
              onClearError={() => setSubmitError(null)}
            />
          )}

          {activeForm === 'wizard' && (
            <WizardForm
              steps={wizardFormSteps}
              onSubmit={handleWizardSubmit}
              loading={isSubmitting}
              successMessage={submitSuccess}
              errorMessage={submitError}
              onClearSuccess={() => setSubmitSuccess(null)}
              onClearError={() => setSubmitError(null)}
              theme="card"
            />
          )}

          {activeForm === 'dynamic' && (
            <DynamicForm
              fields={dynamicFormFields}
              onSubmit={handleDynamicSubmit}
              loading={isSubmitting}
              successMessage={submitSuccess}
              errorMessage={submitError}
              onClearSuccess={() => setSubmitSuccess(null)}
              onClearError={() => setSubmitError(null)}
              layout="grid"
              columns={2}
            />
          )}

          {activeForm === 'builder' && (
            <FormBuilder
              schema={z.object({
                title: z.string().min(1, 'Title is required'),
                description: z.string().min(1, 'Description is required'),
                category: z.string().min(1, 'Category is required'),
                startDate: z.string().min(1, 'Start date is required'),
                endDate: z.string().min(1, 'End date is required'),
                budget: z.number().min(0, 'Budget must be positive'),
                priority: z.string().min(1, 'Priority is required'),
                isPublic: z.boolean(),
              })}
              fields={formBuilderFields}
              onSubmit={handleFormBuilderSubmit}
              loading={isSubmitting}
              successMessage={submitSuccess}
              errorMessage={submitError}
              onClearSuccess={() => setSubmitSuccess(null)}
              onClearError={() => setSubmitError(null)}
            />
          )}
        </div>

        {/* Additional Actions */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Additional Actions
          </h2>
          <div className="flex space-x-4">
            <Button onClick={() => formModal.open()} variant="outline">
              Open Form Modal
            </Button>
            <Button onClick={handleConfirmation} variant="outline">
              Show Confirmation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Step Components for Multi-Step Form
function PersonalInfoStep({ form, isActive, isCompleted, isFirst, isLast }: any) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            First Name *
          </label>
          <input
            {...form.register('firstName')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Enter first name"
          />
          {form.formState.errors.firstName && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {form.formState.errors.firstName.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Last Name *
          </label>
          <input
            {...form.register('lastName')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Enter last name"
          />
          {form.formState.errors.lastName && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {form.formState.errors.lastName.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            {...form.register('email')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Enter email address"
          />
          {form.formState.errors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            {...form.register('phone')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="+91 9876543210"
          />
          {form.formState.errors.phone && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {form.formState.errors.phone.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function AddressInfoStep({ form, isActive, isCompleted, isFirst, isLast }: any) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Street Address *
        </label>
        <input
          {...form.register('street')}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="Enter street address"
        />
        {form.formState.errors.street && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {form.formState.errors.street.message}
          </p>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            City *
          </label>
          <input
            {...form.register('city')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Enter city"
          />
          {form.formState.errors.city && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {form.formState.errors.city.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            State *
          </label>
          <input
            {...form.register('state')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Enter state"
          />
          {form.formState.errors.state && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {form.formState.errors.state.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Pincode *
          </label>
          <input
            {...form.register('pincode')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Enter pincode"
          />
          {form.formState.errors.pincode && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {form.formState.errors.pincode.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Country *
          </label>
          <select
            {...form.register('country')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">Select country</option>
            <option value="in">India</option>
            <option value="us">United States</option>
            <option value="uk">United Kingdom</option>
          </select>
          {form.formState.errors.country && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {form.formState.errors.country.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function PreferencesStep({ form, isActive, isCompleted, isFirst, isLast }: any) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            {...form.register('newsletter')}
            className="mr-2"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Subscribe to newsletter
          </span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            {...form.register('notifications')}
            className="mr-2"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Enable notifications
          </span>
        </label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Theme
          </label>
          <select
            {...form.register('theme')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Language
          </label>
          <select
            {...form.register('language')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// Step Components for Wizard Form
function SurveyInfoStep({ form, isActive, isCompleted, isFirst, isLast, data }: any) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Survey Title *
        </label>
        <input
          {...form.register('title')}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="Enter survey title"
        />
        {form.formState.errors.title && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {form.formState.errors.title.message}
          </p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description *
        </label>
        <textarea
          {...form.register('description')}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="Enter survey description"
        />
        {form.formState.errors.description && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {form.formState.errors.description.message}
          </p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Category *
        </label>
        <select
          {...form.register('category')}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">Select category</option>
          <option value="research">Research</option>
          <option value="survey">Survey</option>
          <option value="analysis">Analysis</option>
          <option value="other">Other</option>
        </select>
        {form.formState.errors.category && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {form.formState.errors.category.message}
          </p>
        )}
      </div>
    </div>
  );
}

function SurveySettingsStep({ form, isActive, isCompleted, isFirst, isLast, data }: any) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Start Date *
          </label>
          <input
            type="date"
            {...form.register('startDate')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          {form.formState.errors.startDate && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {form.formState.errors.startDate.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            End Date *
          </label>
          <input
            type="date"
            {...form.register('endDate')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          {form.formState.errors.endDate && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {form.formState.errors.endDate.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Target Sample *
          </label>
          <input
            type="number"
            {...form.register('targetSample', { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Enter target sample size"
          />
          {form.formState.errors.targetSample && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {form.formState.errors.targetSample.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Budget (₹) *
          </label>
          <input
            type="number"
            {...form.register('budget', { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Enter budget amount"
          />
          {form.formState.errors.budget && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {form.formState.errors.budget.message}
            </p>
          )}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Priority *
        </label>
        <select
          {...form.register('priority')}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">Select priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
        {form.formState.errors.priority && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {form.formState.errors.priority.message}
          </p>
        )}
      </div>
    </div>
  );
}

function SurveyQuestionsStep({ form, isActive, isCompleted, isFirst, isLast, data }: any) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Number of Questions *
        </label>
        <input
          type="number"
          {...form.register('questionCount', { valueAsNumber: true })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="Enter number of questions"
        />
        {form.formState.errors.questionCount && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {form.formState.errors.questionCount.message}
          </p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Question Types *
        </label>
        <div className="space-y-2">
          {['Multiple Choice', 'Text Input', 'Rating Scale', 'Yes/No'].map((type) => (
            <label key={type} className="flex items-center">
              <input
                type="checkbox"
                {...form.register('questionTypes')}
                value={type}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{type}</span>
            </label>
          ))}
        </div>
        {form.formState.errors.questionTypes && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {form.formState.errors.questionTypes.message}
          </p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Estimated Duration (minutes) *
        </label>
        <input
          type="number"
          {...form.register('estimatedDuration', { valueAsNumber: true })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="Enter estimated duration"
        />
        {form.formState.errors.estimatedDuration && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {form.formState.errors.estimatedDuration.message}
          </p>
        )}
      </div>
    </div>
  );
}
