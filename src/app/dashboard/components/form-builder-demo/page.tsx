'use client';

import React, { useState } from 'react';
import { z } from 'zod';
import Breadcrumb from '@/components/ui/Breadcrumb';
import FormBuilder from '@/components/forms/FormBuilder';
import { FormFieldConfig } from '@/components/forms/FormBuilder';

const breadcrumbItems = [
  { label: 'Components', href: '/dashboard/components' },
  { label: 'Form Builder Demo', active: true }
];

// User Registration Form Schema
const userRegistrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^(\+91|91)?[6-9]\d{9}$/, 'Please enter a valid Indian phone number'),
  role: z.enum(['admin', 'pmt', 'qc', 'quality-analyst', 'start-qc', 'data-quality'], {
    errorMap: () => ({ message: 'Please select a valid role' })
  }),
  country: z.string().min(1, 'Please select a country'),
  dateRange: z.object({
    startDate: z.date().nullable(),
    endDate: z.date().nullable(),
  }),
  documents: z.array(z.any()).min(1, 'Please upload at least one document'),
  terms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
  gender: z.enum(['male', 'female', 'other'], {
    errorMap: () => ({ message: 'Please select a gender' })
  }),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
});

type UserRegistrationForm = z.infer<typeof userRegistrationSchema>;

// Survey Form Schema
const surveyFormSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  location: z.string().min(1, 'Location is required'),
  targetSample: z.number().min(1, 'Target sample must be at least 1'),
  budget: z.number().min(0, 'Budget cannot be negative'),
  priority: z.enum(['low', 'medium', 'high', 'urgent'], {
    errorMap: () => ({ message: 'Please select a valid priority' })
  }),
  status: z.enum(['draft', 'active', 'paused', 'completed', 'cancelled'], {
    errorMap: () => ({ message: 'Please select a valid status' })
  }),
});

type SurveyForm = z.infer<typeof surveyFormSchema>;

export default function FormBuilderDemoPage() {
  const [activeForm, setActiveForm] = useState<'user' | 'survey'>('user');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // User Registration Form Configuration
  const userFormFields: FormFieldConfig[] = [
    {
      name: 'name',
      type: 'text',
      label: 'Full Name',
      placeholder: 'Enter your full name',
      required: true,
      helpText: 'Enter your full name as it appears on official documents',
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email Address',
      placeholder: 'Enter your email address',
      required: true,
      helpText: 'We\'ll use this to send you important updates',
    },
    {
      name: 'phone',
      type: 'tel',
      label: 'Phone Number',
      placeholder: '+91 9876543210',
      required: true,
      helpText: 'Enter your 10-digit Indian mobile number',
    },
    {
      name: 'role',
      type: 'select',
      label: 'Role',
      placeholder: 'Select your role',
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
      name: 'country',
      type: 'select',
      label: 'Country',
      placeholder: 'Select your country',
      required: true,
      searchable: true,
      groupBy: 'group',
      options: [
        { value: 'in', label: 'India', group: 'Asia' },
        { value: 'us', label: 'United States', group: 'North America' },
        { value: 'uk', label: 'United Kingdom', group: 'Europe' },
        { value: 'ca', label: 'Canada', group: 'North America' },
        { value: 'au', label: 'Australia', group: 'Oceania' },
      ],
    },
    {
      name: 'gender',
      type: 'radio',
      label: 'Gender',
      required: true,
      options: [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' },
      ],
    },
    {
      name: 'dateRange',
      type: 'dateRange',
      label: 'Project Duration',
      placeholder: 'Select project duration',
      required: true,
      helpText: 'Select the start and end dates for your project',
    },
    {
      name: 'documents',
      type: 'file',
      label: 'Documents',
      required: true,
      helpText: 'Upload relevant documents (PDF, DOC, images)',
      accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png',
      maxFiles: 5,
      maxSize: 10,
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Bio',
      placeholder: 'Tell us about yourself',
      helpText: 'Optional: Brief description about yourself',
      rows: 3,
    },
    {
      name: 'terms',
      type: 'checkbox',
      label: 'Terms and Conditions',
      placeholder: 'I agree to the terms and conditions',
      required: true,
    },
  ];

  // Survey Form Configuration
  const surveyFormFields: FormFieldConfig[] = [
    {
      name: 'title',
      type: 'text',
      label: 'Survey Title',
      placeholder: 'Enter survey title',
      required: true,
      helpText: 'A descriptive title for your survey',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      placeholder: 'Enter survey description',
      required: true,
      helpText: 'Detailed description of the survey objectives',
      rows: 4,
    },
    {
      name: 'startDate',
      type: 'date',
      label: 'Start Date',
      required: true,
      helpText: 'When should the survey begin?',
    },
    {
      name: 'endDate',
      type: 'date',
      label: 'End Date',
      required: true,
      helpText: 'When should the survey end?',
    },
    {
      name: 'location',
      type: 'text',
      label: 'Location',
      placeholder: 'Enter survey location',
      required: true,
      helpText: 'Primary location for the survey',
    },
    {
      name: 'targetSample',
      type: 'number',
      label: 'Target Sample Size',
      placeholder: 'Enter target sample size',
      required: true,
      helpText: 'Number of respondents to target',
    },
    {
      name: 'budget',
      type: 'number',
      label: 'Budget (₹)',
      placeholder: 'Enter budget amount',
      required: true,
      helpText: 'Total budget for the survey',
    },
    {
      name: 'priority',
      type: 'select',
      label: 'Priority',
      placeholder: 'Select priority level',
      required: true,
      options: [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
        { value: 'urgent', label: 'Urgent' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      placeholder: 'Select status',
      required: true,
      options: [
        { value: 'draft', label: 'Draft' },
        { value: 'active', label: 'Active' },
        { value: 'paused', label: 'Paused' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' },
      ],
    },
  ];

  const handleUserSubmit = async (data: UserRegistrationForm) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('User registration submitted:', data);
      setSuccessMessage('User registration completed successfully!');
    } catch (error) {
      setErrorMessage('Failed to register user. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSurveySubmit = async (data: SurveyForm) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Survey form submitted:', data);
      setSuccessMessage('Survey created successfully!');
    } catch (error) {
      setErrorMessage('Failed to create survey. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="space-y-8">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Form Builder Demo</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Dynamic form generation using FormBuilder component with React Hook Form and Zod validation
          </p>
        </div>

        {/* Form Selector */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Select Form Type
          </h2>
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveForm('user')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeForm === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              User Registration
            </button>
            <button
              onClick={() => setActiveForm('survey')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeForm === 'survey'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Survey Creation
            </button>
          </div>
        </div>

        {/* Form Builder */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            {activeForm === 'user' ? 'User Registration Form' : 'Survey Creation Form'}
          </h2>
          
          {activeForm === 'user' ? (
            <FormBuilder
              schema={userRegistrationSchema}
              fields={userFormFields}
              onSubmit={handleUserSubmit}
              submitLabel="Register User"
              resetLabel="Reset Form"
              loading={isSubmitting}
              successMessage={successMessage}
              errorMessage={errorMessage}
              onClearSuccess={() => setSuccessMessage(null)}
              onClearError={() => setErrorMessage(null)}
              defaultValues={{
                name: '',
                email: '',
                phone: '',
                role: 'admin',
                country: '',
                dateRange: { startDate: null, endDate: null },
                documents: [],
                terms: false,
                gender: 'male',
                bio: '',
              }}
            />
          ) : (
            <FormBuilder
              schema={surveyFormSchema}
              fields={surveyFormFields}
              onSubmit={handleSurveySubmit}
              submitLabel="Create Survey"
              resetLabel="Reset Form"
              loading={isSubmitting}
              successMessage={successMessage}
              errorMessage={errorMessage}
              onClearSuccess={() => setSuccessMessage(null)}
              onClearError={() => setErrorMessage(null)}
              defaultValues={{
                title: '',
                description: '',
                startDate: '',
                endDate: '',
                location: '',
                targetSample: 0,
                budget: 0,
                priority: 'medium',
                status: 'draft',
              }}
            />
          )}
        </div>

        {/* Form Configuration Display */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Form Configuration
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-2">
                Current Form Fields
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {activeForm === 'user' ? userFormFields.length : surveyFormFields.length} fields configured
              </div>
            </div>
            <div>
              <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-2">
                Field Types Used
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {activeForm === 'user' 
                  ? 'text, email, tel, select, radio, dateRange, file, textarea, checkbox'
                  : 'text, textarea, date, number, select'
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
