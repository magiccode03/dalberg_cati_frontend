'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Breadcrumb from '@/components/ui/Breadcrumb';
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
import { userRegistrationSchema, surveyFormSchema, interviewFormSchema } from '@/lib/validation-schemas';

// Demo form schemas
const demoFormSchema = z.object({
  // Basic fields
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^(\+91|91)?[6-9]\d{9}$/, 'Please enter a valid Indian phone number'),
  
  // Select fields
  role: z.enum(['admin', 'pmt', 'qc', 'quality-analyst', 'start-qc', 'data-quality'], {
    errorMap: () => ({ message: 'Please select a valid role' })
  }),
  country: z.string().min(1, 'Please select a country'),
  
  // Date fields
  dateRange: z.object({
    startDate: z.date().nullable(),
    endDate: z.date().nullable(),
  }).refine((data) => {
    if (!data.startDate || !data.endDate) return true;
    return data.endDate >= data.startDate;
  }, {
    message: "End date must be after start date",
    path: ["endDate"],
  }),
  
  // File upload
  documents: z.array(z.any()).min(1, 'Please upload at least one document'),
  
  // Checkbox and radio
  terms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
  gender: z.enum(['male', 'female', 'other'], {
    errorMap: () => ({ message: 'Please select a gender' })
  }),
  
  // Textarea
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  
  // Conditional fields
  hasExperience: z.boolean(),
  experience: z.string().optional(),
}).refine((data) => {
  if (data.hasExperience && !data.experience) {
    return false;
  }
  return true;
}, {
  message: "Experience is required when you have experience",
  path: ["experience"],
});

type DemoFormData = z.infer<typeof demoFormSchema>;

export default function FormValidationDemoPage() {
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty, isValid },
    reset,
  } = useForm<DemoFormData>({
    resolver: zodResolver(demoFormSchema),
    mode: 'onChange',
    defaultValues: {
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
      hasExperience: false,
      experience: '',
    },
  });

  const watchedHasExperience = watch('hasExperience');
  const watchedDateRange = watch('dateRange');

  const breadcrumbItems = [
    { label: 'Components', href: '/dashboard/components' },
    { label: 'Form Validation Demo', active: true }
  ];

  // Sample options
  const roleOptions = [
    { value: 'admin', label: 'Administrator' },
    { value: 'pmt', label: 'PMT Manager' },
    { value: 'qc', label: 'QC Manager' },
    { value: 'quality-analyst', label: 'Quality Analyst' },
    { value: 'start-qc', label: 'Start QC' },
    { value: 'data-quality', label: 'Data Quality' },
  ];

  const countryOptions = [
    { value: 'in', label: 'India', group: 'Asia' },
    { value: 'us', label: 'United States', group: 'North America' },
    { value: 'uk', label: 'United Kingdom', group: 'Europe' },
    { value: 'ca', label: 'Canada', group: 'North America' },
    { value: 'au', label: 'Australia', group: 'Oceania' },
  ];

  const onSubmit = async (data: DemoFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Form submitted:', data);
      setSubmitSuccess('Form submitted successfully!');
      reset();
    } catch (error) {
      setSubmitError('Failed to submit form. Please try again.');
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Form Validation Demo</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Comprehensive demonstration of form validation with React Hook Form and Zod
          </p>
        </div>

        {/* Form Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400">Form Status</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {isDirty ? 'Modified' : 'Clean'}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400">Validation</div>
            <div className={`text-lg font-semibold ${isValid ? 'text-green-600' : 'text-red-600'}`}>
              {isValid ? 'Valid' : 'Invalid'}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400">Errors</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {Object.keys(errors).length}
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {submitSuccess && (
          <FormSuccess
            message={submitSuccess}
            dismissible
            onDismiss={() => setSubmitSuccess(null)}
          />
        )}

        {submitError && (
          <FormError
            error={submitError}
            dismissible
            onDismiss={() => setSubmitError(null)}
          />
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Personal Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Full Name"
                name="name"
                register={register}
                error={errors.name}
                required
                helpText="Enter your full name as it appears on official documents"
              >
                <Input
                  placeholder="Enter your full name"
                  className={errors.name ? 'border-red-500' : ''}
                />
              </FormField>

              <FormField
                label="Email Address"
                name="email"
                register={register}
                error={errors.email}
                required
                helpText="We'll use this to send you important updates"
              >
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  className={errors.email ? 'border-red-500' : ''}
                />
              </FormField>

              <FormField
                label="Phone Number"
                name="phone"
                register={register}
                error={errors.phone}
                required
                helpText="Enter your 10-digit Indian mobile number"
              >
                <Input
                  type="tel"
                  placeholder="+91 9876543210"
                  className={errors.phone ? 'border-red-500' : ''}
                />
              </FormField>

              <FormField
                label="Role"
                name="role"
                register={register}
                error={errors.role}
                required
              >
                <SelectDropdown
                  options={roleOptions}
                  value={watch('role')}
                  onChange={(value) => setValue('role', value as any)}
                  placeholder="Select your role"
                  error={errors.role?.message}
                />
              </FormField>

              <FormField
                label="Country"
                name="country"
                register={register}
                error={errors.country}
                required
              >
                <SelectDropdown
                  options={countryOptions}
                  value={watch('country')}
                  onChange={(value) => setValue('country', value as any)}
                  placeholder="Select your country"
                  searchable
                  groupBy="group"
                  error={errors.country?.message}
                />
              </FormField>

              <FormField
                label="Gender"
                name="gender"
                register={register}
                error={errors.gender}
                required
              >
                <div className="space-y-2">
                  {[
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                    { value: 'other', label: 'Other' },
                  ].map((option) => (
                    <Radio
                      key={option.value}
                      name="gender"
                      value={option.value}
                      label={option.label}
                      checked={watch('gender') === option.value}
                      onChange={(e) => setValue('gender', e.target.value as any)}
                      error={errors.gender?.message}
                    />
                  ))}
                </div>
              </FormField>
            </div>

            <FormField
              label="Bio"
              name="bio"
              register={register}
              error={errors.bio}
              helpText="Tell us about yourself (optional)"
            >
              <Textarea
                placeholder="Enter a brief description about yourself"
                rows={3}
                className={errors.bio ? 'border-red-500' : ''}
              />
            </FormField>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Project Details
            </h2>
            
            <FormField
              label="Project Duration"
              name="dateRange"
              register={register}
              error={errors.dateRange}
              required
              helpText="Select the start and end dates for your project"
            >
              <DateRangePicker
                value={watchedDateRange}
                onChange={(value) => setValue('dateRange', value)}
                placeholder="Select project duration"
                error={errors.dateRange?.message}
              />
            </FormField>

            <FormField
              label="Project Documents"
              name="documents"
              register={register}
              error={errors.documents}
              required
              helpText="Upload relevant project documents (PDF, DOC, images)"
            >
              <FileUpload
                files={watch('documents') || []}
                onChange={(files) => setValue('documents', files)}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                maxFiles={5}
                maxSize={10}
                error={errors.documents?.message}
              />
            </FormField>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Experience & Agreement
            </h2>
            
            <div className="space-y-6">
              <FormField
                label="Do you have relevant experience?"
                name="hasExperience"
                register={register}
                error={errors.hasExperience}
              >
                <Checkbox
                  label="Yes, I have relevant experience"
                  checked={watchedHasExperience}
                  onChange={(checked) => setValue('hasExperience', checked)}
                  error={errors.hasExperience?.message}
                />
              </FormField>

              {watchedHasExperience && (
                <FormField
                  label="Experience Details"
                  name="experience"
                  register={register}
                  error={errors.experience}
                  required
                  helpText="Please describe your relevant experience"
                >
                  <Textarea
                    placeholder="Describe your relevant experience"
                    rows={4}
                    className={errors.experience ? 'border-red-500' : ''}
                  />
                </FormField>
              )}

              <FormField
                label="Terms and Conditions"
                name="terms"
                register={register}
                error={errors.terms}
                required
              >
                <Checkbox
                  label="I agree to the terms and conditions"
                  checked={watch('terms')}
                  onChange={(checked) => setValue('terms', checked)}
                  error={errors.terms?.message}
                />
              </FormField>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              disabled={isSubmitting}
            >
              Reset Form
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !isValid}
              loading={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Form'}
            </Button>
          </div>
        </form>

        {/* Form Data Display */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Form Data (Live Preview)
          </h2>
          <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md text-sm overflow-auto">
            {JSON.stringify(watch(), null, 2)}
          </pre>
        </div>

        {/* Validation Errors Display */}
        {Object.keys(errors).length > 0 && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Validation Errors
            </h2>
            <div className="space-y-2">
              {Object.entries(errors).map(([field, error]) => (
                <div key={field} className="text-sm text-red-600 dark:text-red-400">
                  <strong>{field}:</strong> {error?.message}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
