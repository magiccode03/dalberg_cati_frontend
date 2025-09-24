import { z } from 'zod';

// Common validation patterns
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
export const indianPhoneRegex = /^(\+91|91)?[6-9]\d{9}$/;
export const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
export const aadharRegex = /^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/;

// Base schemas
export const baseUserSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  
  phone: z.string()
    .min(1, 'Phone number is required')
    .regex(indianPhoneRegex, 'Please enter a valid Indian phone number'),
  
  role: z.enum(['admin', 'pmt', 'qc', 'quality-analyst', 'start-qc', 'data-quality'], {
    errorMap: () => ({ message: 'Please select a valid role' })
  }),
});

// User registration schema
export const userRegistrationSchema = baseUserSchema.extend({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  
  confirmPassword: z.string()
    .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// User login schema
export const userLoginSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  
  password: z.string()
    .min(1, 'Password is required'),
  
  rememberMe: z.boolean().optional(),
});

// User profile update schema
export const userProfileSchema = baseUserSchema.extend({
  avatar: z.string().url().optional().or(z.literal('')),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  department: z.string().min(1, 'Department is required').optional(),
  designation: z.string().min(1, 'Designation is required').optional(),
});

// Survey form schema
export const surveyFormSchema = z.object({
  surveyId: z.string().min(1, 'Survey ID is required'),
  title: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be less than 100 characters'),
  
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters'),
  
  startDate: z.string()
    .min(1, 'Start date is required')
    .refine((date) => new Date(date) >= new Date(), 'Start date must be in the future'),
  
  endDate: z.string()
    .min(1, 'End date is required'),
  
  location: z.string()
    .min(1, 'Location is required')
    .max(100, 'Location must be less than 100 characters'),
  
  targetSample: z.number()
    .min(1, 'Target sample must be at least 1')
    .max(100000, 'Target sample must be less than 100,000'),
  
  budget: z.number()
    .min(0, 'Budget cannot be negative')
    .max(10000000, 'Budget must be less than 10,000,000'),
  
  priority: z.enum(['low', 'medium', 'high', 'urgent'], {
    errorMap: () => ({ message: 'Please select a valid priority' })
  }),
  
  status: z.enum(['draft', 'active', 'paused', 'completed', 'cancelled'], {
    errorMap: () => ({ message: 'Please select a valid status' })
  }),
}).refine((data) => new Date(data.endDate) > new Date(data.startDate), {
  message: "End date must be after start date",
  path: ["endDate"],
});

// Interview form schema
export const interviewFormSchema = z.object({
  interviewId: z.string().min(1, 'Interview ID is required'),
  respondentName: z.string()
    .min(2, 'Respondent name must be at least 2 characters')
    .max(50, 'Respondent name must be less than 50 characters'),
  
  age: z.number()
    .min(18, 'Age must be at least 18')
    .max(100, 'Age must be less than 100'),
  
  gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say'], {
    errorMap: () => ({ message: 'Please select a valid gender' })
  }),
  
  phone: z.string()
    .min(1, 'Phone number is required')
    .regex(indianPhoneRegex, 'Please enter a valid Indian phone number'),
  
  address: z.string()
    .min(10, 'Address must be at least 10 characters')
    .max(200, 'Address must be less than 200 characters'),
  
  district: z.string().min(1, 'District is required'),
  constituency: z.string().min(1, 'Constituency is required'),
  pollingStation: z.string().min(1, 'Polling station is required'),
  
  gpsLatitude: z.number()
    .min(-90, 'Invalid latitude')
    .max(90, 'Invalid latitude'),
  
  gpsLongitude: z.number()
    .min(-180, 'Invalid longitude')
    .max(180, 'Invalid longitude'),
  
  interviewDate: z.string()
    .min(1, 'Interview date is required'),
  
  interviewDuration: z.number()
    .min(1, 'Interview duration must be at least 1 minute')
    .max(300, 'Interview duration must be less than 300 minutes'),
  
  responses: z.record(z.string(), z.any()).optional(),
  
  qualityScore: z.number()
    .min(0, 'Quality score cannot be negative')
    .max(100, 'Quality score cannot exceed 100')
    .optional(),
  
  notes: z.string()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional(),
});

// Quality check schema
export const qualityCheckSchema = z.object({
  checkId: z.string().min(1, 'Check ID is required'),
  interviewId: z.string().min(1, 'Interview ID is required'),
  
  checkerName: z.string()
    .min(2, 'Checker name must be at least 2 characters')
    .max(50, 'Checker name must be less than 50 characters'),
  
  checkDate: z.string()
    .min(1, 'Check date is required'),
  
  checkType: z.enum(['audio', 'gps', 'duration', 'completeness', 'logic', 'manual'], {
    errorMap: () => ({ message: 'Please select a valid check type' })
  }),
  
  status: z.enum(['passed', 'failed', 'warning', 'pending'], {
    errorMap: () => ({ message: 'Please select a valid status' })
  }),
  
  score: z.number()
    .min(0, 'Score cannot be negative')
    .max(100, 'Score cannot exceed 100'),
  
  issues: z.array(z.string()).optional(),
  
  recommendations: z.string()
    .max(500, 'Recommendations must be less than 500 characters')
    .optional(),
  
  isApproved: z.boolean().optional(),
});

// Agency management schema
export const agencySchema = z.object({
  agencyId: z.string().min(1, 'Agency ID is required'),
  name: z.string()
    .min(2, 'Agency name must be at least 2 characters')
    .max(100, 'Agency name must be less than 100 characters'),
  
  contactPerson: z.string()
    .min(2, 'Contact person name must be at least 2 characters')
    .max(50, 'Contact person name must be less than 50 characters'),
  
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  
  phone: z.string()
    .min(1, 'Phone number is required')
    .regex(indianPhoneRegex, 'Please enter a valid Indian phone number'),
  
  address: z.string()
    .min(10, 'Address must be at least 10 characters')
    .max(200, 'Address must be less than 200 characters'),
  
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pincode: z.string()
    .regex(/^[1-9][0-9]{5}$/, 'Please enter a valid 6-digit pincode'),
  
  registrationNumber: z.string().min(1, 'Registration number is required'),
  panNumber: z.string()
    .regex(panRegex, 'Please enter a valid PAN number'),
  
  gstNumber: z.string()
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Please enter a valid GST number')
    .optional(),
  
  contractStartDate: z.string().min(1, 'Contract start date is required'),
  contractEndDate: z.string().min(1, 'Contract end date is required'),
  
  status: z.enum(['active', 'inactive', 'suspended', 'terminated'], {
    errorMap: () => ({ message: 'Please select a valid status' })
  }),
}).refine((data) => new Date(data.contractEndDate) > new Date(data.contractStartDate), {
  message: "Contract end date must be after start date",
  path: ["contractEndDate"],
});

// Filter form schema
export const filterFormSchema = z.object({
  dateRange: z.object({
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
  }).refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: "End date must be after or equal to start date",
    path: ["endDate"],
  }),
  
  location: z.string().optional(),
  status: z.string().optional(),
  search: z.string().optional(),
  
  district: z.string().optional(),
  constituency: z.string().optional(),
  pollingStation: z.string().optional(),
  
  role: z.string().optional(),
  agency: z.string().optional(),
  
  minScore: z.number().min(0).max(100).optional(),
  maxScore: z.number().min(0).max(100).optional(),
}).refine((data) => {
  if (data.minScore && data.maxScore) {
    return data.minScore <= data.maxScore;
  }
  return true;
}, {
  message: "Minimum score must be less than or equal to maximum score",
  path: ["maxScore"],
});

// Settings form schema
export const settingsFormSchema = z.object({
  theme: z.enum(['light', 'dark', 'system'], {
    errorMap: () => ({ message: 'Please select a valid theme' })
  }),
  
  language: z.enum(['en', 'hi'], {
    errorMap: () => ({ message: 'Please select a valid language' })
  }),
  
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    sms: z.boolean(),
  }),
  
  dataRefreshInterval: z.number()
    .min(30, 'Refresh interval must be at least 30 seconds')
    .max(3600, 'Refresh interval must be less than 1 hour'),
  
  autoSave: z.boolean(),
  autoSaveInterval: z.number()
    .min(60, 'Auto-save interval must be at least 60 seconds')
    .max(300, 'Auto-save interval must be less than 5 minutes'),
});

// Export types
export type UserRegistrationForm = z.infer<typeof userRegistrationSchema>;
export type UserLoginForm = z.infer<typeof userLoginSchema>;
export type UserProfileForm = z.infer<typeof userProfileSchema>;
export type SurveyForm = z.infer<typeof surveyFormSchema>;
export type InterviewForm = z.infer<typeof interviewFormSchema>;
export type QualityCheckForm = z.infer<typeof qualityCheckSchema>;
export type AgencyForm = z.infer<typeof agencySchema>;
export type FilterForm = z.infer<typeof filterFormSchema>;
export type SettingsForm = z.infer<typeof settingsFormSchema>;
