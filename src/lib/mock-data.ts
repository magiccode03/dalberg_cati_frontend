import { User, Notification, VoteShareData, ProgressData, DashboardStats } from '@/types';

// Mock Users
export const generateUsers = (): User[] => [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@biharelection.gov.in',
    role: 'admin',
    avatar: '/avatars/admin.jpg',
    permissions: ['*'],
  },
  {
    id: '2',
    name: 'PMT Manager',
    email: 'pmt@biharelection.gov.in',
    role: 'pmt',
    avatar: '/avatars/pmt.jpg',
    permissions: ['pmt:*', 'analysis:read'],
  },
  {
    id: '3',
    name: 'QC Supervisor',
    email: 'qc@biharelection.gov.in',
    role: 'qc',
    avatar: '/avatars/qc.jpg',
    permissions: ['qc:*', 'analysis:read'],
  },
  {
    id: '4',
    name: 'Quality Analyst',
    email: 'qa@biharelection.gov.in',
    role: 'quality-analyst',
    avatar: '/avatars/qa.jpg',
    permissions: ['quality-analyst:*', 'analysis:read'],
  },
  {
    id: '5',
    name: 'Start QC Operator',
    email: 'startqc@biharelection.gov.in',
    role: 'start-qc',
    avatar: '/avatars/startqc.jpg',
    permissions: ['start-qc:*'],
  },
  {
    id: '6',
    name: 'Data Quality Manager',
    email: 'dataquality@biharelection.gov.in',
    role: 'data-quality',
    avatar: '/avatars/dataquality.jpg',
    permissions: ['data-quality:*', 'analysis:read'],
  },
];

// Mock Notifications
export const generateNotifications = (): Notification[] => [
  {
    id: '1',
    title: 'New Survey Completed',
    message: 'Survey #12345 has been completed in Patna District',
    type: 'success',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    read: false,
  },
  {
    id: '2',
    title: 'QC Alert',
    message: 'High rejection rate detected in Muzaffarpur District',
    type: 'warning',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    read: false,
  },
  {
    id: '3',
    title: 'System Update',
    message: 'New features have been added to the analysis dashboard',
    type: 'info',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    read: true,
  },
  {
    id: '4',
    title: 'Data Export Complete',
    message: 'Your data export for Q3 2024 is ready for download',
    type: 'success',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    read: true,
  },
];

// Mock Vote Share Data
export const generateVoteShareData = (): VoteShareData[] => [
  {
    party: 'BJP',
    votes: 1250000,
    percentage: 35.2,
    color: '#3B82F6',
  },
  {
    party: 'RJD',
    votes: 1100000,
    percentage: 31.0,
    color: '#10B981',
  },
  {
    party: 'JD(U)',
    votes: 850000,
    percentage: 23.9,
    color: '#F59E0B',
  },
  {
    party: 'Others',
    votes: 350000,
    percentage: 9.9,
    color: '#EF4444',
  },
];

// Mock Progress Data
export const generateProgressData = (): ProgressData[] => [
  {
    status: 'Completed',
    count: 1250,
    percentage: 65.2,
    color: '#10B981',
  },
  {
    status: 'In Progress',
    count: 450,
    percentage: 23.4,
    color: '#F59E0B',
  },
  {
    status: 'Pending',
    count: 220,
    percentage: 11.4,
    color: '#6B7280',
  },
];

// Mock Dashboard Stats
export const generateDashboardStats = (): DashboardStats => ({
  totalVoters: 2500000,
  completedSurveys: 1250,
  pendingSurveys: 220,
  rejectionRate: 8.5,
});

// Mock Chart Data for Different Modules
export const generatePMTData = () => ({
  agencies: [
    { id: '1', name: 'Patna Agency', status: 'Active', surveys: 150, completion: 85 },
    { id: '2', name: 'Muzaffarpur Agency', status: 'Active', surveys: 120, completion: 78 },
    { id: '3', name: 'Gaya Agency', status: 'Inactive', surveys: 90, completion: 65 },
  ],
  auditLogs: [
    { id: '1', action: 'Survey Created', user: 'PMT Manager', timestamp: new Date().toISOString(), details: 'Survey #12345 created' },
    { id: '2', action: 'Data Updated', user: 'QC Supervisor', timestamp: new Date().toISOString(), details: 'Survey #12344 updated' },
  ],
});

export const generateQCData = () => ({
  fieldworkProgress: [
    { district: 'Patna', completed: 85, pending: 15, rejected: 5 },
    { district: 'Muzaffarpur', completed: 78, pending: 22, rejected: 8 },
    { district: 'Gaya', completed: 65, pending: 35, rejected: 12 },
  ],
  gpsLocations: [
    { id: '1', lat: 25.5941, lng: 85.1376, name: 'Patna Center', status: 'Active' },
    { id: '2', lat: 26.1209, lng: 85.3647, name: 'Muzaffarpur Center', status: 'Active' },
  ],
});

export const generateQualityAnalystData = () => ({
  demographics: {
    ageWise: [
      { age: '18-25', count: 450, percentage: 25.5 },
      { age: '26-35', count: 520, percentage: 29.4 },
      { age: '36-45', count: 380, percentage: 21.5 },
      { age: '46-55', count: 280, percentage: 15.8 },
      { age: '55+', count: 140, percentage: 7.8 },
    ],
    genderWise: [
      { gender: 'Male', count: 950, percentage: 53.7 },
      { gender: 'Female', count: 820, percentage: 46.3 },
    ],
    casteWise: [
      { caste: 'General', count: 420, percentage: 23.7 },
      { caste: 'OBC', count: 680, percentage: 38.4 },
      { caste: 'SC', count: 450, percentage: 25.4 },
      { caste: 'ST', count: 220, percentage: 12.5 },
    ],
  },
});

export const generateDataQualityData = () => ({
  validationResults: [
    { field: 'Voter ID', total: 1000, valid: 950, invalid: 50, accuracy: 95.0 },
    { field: 'Name', total: 1000, valid: 920, invalid: 80, accuracy: 92.0 },
    { field: 'Address', total: 1000, valid: 880, invalid: 120, accuracy: 88.0 },
  ],
  qualityMetrics: {
    overallAccuracy: 91.7,
    dataCompleteness: 94.2,
    consistencyScore: 89.5,
    timelinessScore: 96.8,
  },
});
