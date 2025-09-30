import { MenuItem } from '@/types';

export const menuData: MenuItem[] = [
  // Portal Admin Menu
  {
    id: 'portal-admin-users',
    label: 'Users',
    href: '/portal-admin/users',
    icon: 'Users',
    roles: ['portal_admin'],
    children: [
      {
        id: 'portal-admin-users-list',
        label: 'Users List',
        href: '/portal-admin/users',
        icon: 'List',
        roles: ['portal_admin'],
      },
      {
        id: 'portal-admin-create-user',
        label: 'Create User',
        href: '/portal-admin/users/create',
        icon: 'UserPlus',
        roles: ['portal_admin'],
      },
    ],
  },
  {
    id: 'portal-admin-enumerators',
    label: 'Enumerators',
    href: '/portal-admin/enumerators',
    icon: 'Users',
    roles: ['portal_admin'],
    children: [
      {
        id: 'portal-admin-enumerators-list',
        label: 'Enumerator List',
        href: '/portal-admin/enumerators',
        icon: 'List',
        roles: ['portal_admin'],
      },
      {
        id: 'portal-admin-create-enumerator',
        label: 'Create Enumerator',
        href: '/portal-admin/enumerators/create',
        icon: 'UserPlus',
        roles: ['portal_admin'],
      },
    ],
  },

  // Super Admin Menu
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/super-admin/dashboard',
    icon: 'Home',
    roles: ['super_admin'],
  },
  {
    id: 'user-management',
    label: 'User Management',
    href: '/super-admin/users',
    icon: 'Users',
    roles: ['super_admin'],
  },
  {
    id: 'role-management',
    label: 'Role Management',
    href: '/super-admin/roles',
    icon: 'Shield',
    roles: ['super_admin'],
  },
  {
    id: 'feature-management',
    label: 'Feature Management',
    href: '/super-admin/features',
    icon: 'Settings',
    roles: ['super_admin'],
  },
  {
    id: 'page-management',
    label: 'Page Management',
    href: '/super-admin/pages',
    icon: 'FileText',
    roles: ['super_admin'],
  },
  {
    id: 'system-information',
    label: 'System Information',
    href: '/super-admin/system',
    icon: 'Server',
    roles: ['super_admin'],
  },
  {
    id: 'components',
    label: 'Components',
    href: '/dashboard/components',
    icon: 'Sliders',
    roles: ['super_admin'],
    children: [
      {
        id: 'select-demo',
        label: 'Select Components',
        href: '/dashboard/components/select-demo',
        icon: 'CheckCircle',
        roles: ['super_admin'],
      },
      {
        id: 'form-validation-demo',
        label: 'Form Validation',
        href: '/dashboard/components/form-validation-demo',
        icon: 'FileText',
        roles: ['super_admin'],
      },
      {
        id: 'form-builder-demo',
        label: 'Form Builder',
        href: '/dashboard/components/form-builder-demo',
        icon: 'Settings',
        roles: ['super_admin'],
      },
      {
        id: 'modal-demo',
        label: 'Modal Components',
        href: '/dashboard/components/modal-demo',
        icon: 'FileText',
        roles: ['super_admin'],
      },
      {
        id: 'form-components-demo',
        label: 'Form Components',
        href: '/dashboard/components/form-components-demo',
        icon: 'Settings',
        roles: ['super_admin'],
      },
      {
        id: 'ui-components-demo',
        label: 'UI Components',
        href: '/dashboard/components/ui-components-demo',
        icon: 'Sliders',
        roles: ['super_admin'],
      },
      {
        id: 'medium-components-demo',
        label: 'Medium Components',
        href: '/dashboard/components/medium-components-demo',
        icon: 'BarChart3',
        roles: ['super_admin'],
      },
      {
        id: 'utility-components-demo',
        label: 'Utility Components',
        href: '/dashboard/components/utility-components-demo',
        icon: 'Settings',
        roles: ['super_admin'],
      },
      {
        id: 'advanced-components-demo',
        label: 'Advanced Components',
        href: '/dashboard/components/advanced-components-demo',
        icon: 'Settings',
        roles: ['super_admin'],
      },
    ],
  },
  
  // ============================================
  // CAPI SYSTEM MENUS
  // ============================================
  
  // CAPI Project Progress Monitoring (PPM) Menu
  {
    id: 'capi-ppm-overview',
    label: 'Overview',
    href: '/capi/ppm/overview/fieldwork-progress',
    icon: 'BarChart3',
    roles: ['ppm'],
    system: 'capi',
    children: [
      {
        id: 'capi-ppm-fieldwork-progress',
        label: 'Fieldwork Progress',
        href: '/capi/ppm/overview/fieldwork-progress',
        icon: 'BarChart3',
        roles: ['ppm'],
        system: 'capi',
      },
      {
        id: 'capi-ppm-interview-log',
        label: 'Interview Log',
        href: '/capi/ppm/overview/interview-log',
        icon: 'FileText',
        roles: ['ppm'],
        system: 'capi',
      },
    ],
  },
  {
    id: 'ppm-master',
    label: 'Master',
    href: '/capi/ppm/master/aclist',
    icon: 'Database',
    roles: ['ppm'],
    children: [
      {
        id: 'ppm-ac-list',
        label: 'AC List',
        href: '/capi/ppm/master/aclist',
        icon: 'Users',
        roles: ['ppm'],
      },
      {
        id: 'ppm-team-registration',
        label: 'Team Registration',
        href: '/capi/ppm/master/team-registration',
        icon: 'Users',
        roles: ['ppm'],
      },
      {
        id: 'ppm-project-setting',
        label: 'Project Setting',
        href: '/capi/ppm/master/project-setting',
        icon: 'Settings',
        roles: ['ppm'],
      },
    ],
  },
  {
    id: 'ppm-progress-report',
    label: 'Progress Report',
    href: '/capi/ppm/progress-report',
    icon: 'BarChart3',
    roles: ['ppm'],
  },
  {
    id: 'ppm-rejection-report',
    label: 'Rejection Report',
    href: '/capi/ppm/rejection-report',
    icon: 'XCircle',
    roles: ['ppm'],
  },
  {
    id: 'ppm-gps-map',
    label: 'GPS Map',
    href: '/capi/ppm/gps-map',
    icon: 'Map',
    roles: ['ppm'],
  },
  {
    id: 'ppm-demographic',
    label: 'Demographic %',
    href: '/capi/ppm/demographic',
    icon: 'Users',
    roles: ['ppm'],
  },
  {
    id: 'ppm-uploads',
    label: 'Uploads',
    href: '/capi/ppm/uploads/change-status',
    icon: 'Upload',
    roles: ['ppm'],
    children: [
      {
        id: 'ppm-change-status',
        label: 'Change Status',
        href: '/capi/ppm/uploads/change-status',
        icon: 'Edit',
        roles: ['ppm'],
      },
      {
        id: 'ppm-send-to-qc',
        label: 'Send to QC',
        href: '/capi/ppm/uploads/send-to-qc',
        icon: 'Send',
        roles: ['ppm'],
      },
      {
        id: 'ppm-weights',
        label: 'Weights',
        href: '/capi/ppm/uploads/weights',
        icon: 'Scale',
        roles: ['ppm'],
      },
      {
        id: 'ppm-cron-request',
        label: 'Cron Request',
        href: '/capi/ppm/uploads/cron-request',
        icon: 'Clock',
        roles: ['ppm'],
      },
    ],
  },
  {
    id: 'ppm-master-data',
    label: 'Master Data',
    href: '/capi/ppm/master-data/master-ac',
    icon: 'Database',
    roles: ['ppm'],
    children: [
      {
        id: 'ppm-master-ac',
        label: 'Master AC',
        href: '/capi/ppm/master-data/master-ac',
        icon: 'Users',
        roles: ['ppm'],
      },
      {
        id: 'ppm-master-ac-caste',
        label: 'Master AC Caste',
        href: '/capi/ppm/master-data/master-ac-caste',
        icon: 'Users',
        roles: ['ppm'],
      },
      {
        id: 'ppm-master-ps',
        label: 'Master PS',
        href: '/capi/ppm/master-data/master-ps',
        icon: 'MapPin',
        roles: ['ppm'],
      },
    ],
  },
  {
    id: 'ppm-ps-form',
    label: 'PS for Form',
    href: '/capi/ppm/ps-form',
    icon: 'FileText',
    roles: ['ppm'],
  },

  // Project Progress Monitoring Team (PPMT) Menu
  {
    id: 'ppmt-overview',
    label: 'Overview',
    href: '/capi/ppmt/overview/fieldwork-progress',
    icon: 'BarChart3',
    roles: ['ppmt'],
    children: [
      {
        id: 'ppmt-fieldwork-progress',
        label: 'Fieldwork Progress',
        href: '/capi/ppmt/overview/fieldwork-progress',
        icon: 'BarChart3',
        roles: ['ppmt'],
      },
      {
        id: 'ppmt-interview-log',
        label: 'Interview Log',
        href: '/capi/ppmt/overview/interview-log',
        icon: 'FileText',
        roles: ['ppmt'],
      },
    ],
  },
  {
    id: 'ppmt-progress-report',
    label: 'Progress Report',
    href: '/capi/ppmt/progress-report',
    icon: 'BarChart3',
    roles: ['ppmt'],
  },
  {
    id: 'ppmt-rejection-report',
    label: 'Rejection Report',
    href: '/capi/ppmt/rejection-report',
    icon: 'XCircle',
    roles: ['ppmt'],
  },
  {
    id: 'ppmt-gps-map',
    label: 'GPS Map',
    href: '/capi/ppmt/gps-map',
    icon: 'Map',
    roles: ['ppmt'],
  },
  {
    id: 'ppmt-demographic',
    label: 'Demographic %',
    href: '/capi/ppmt/demographic',
    icon: 'Users',
    roles: ['ppmt'],
  },

  // Data Quality Management (DQM) Menu
  {
    id: 'dqm-fieldwork-progress',
    label: 'Fieldwork Progress',
    href: '/capi/dqm/fieldwork-progress',
    icon: 'BarChart3',
    roles: ['dqm'],
  },
  {
    id: 'dqm-qc-team-registration',
    label: 'QC Team Registration',
    href: '/capi/dqm/qc-team-registration',
    icon: 'Users',
    roles: ['dqm'],
  },
  {
    id: 'dqm-qc-user-registration',
    label: 'QC User Registration',
    href: '/capi/dqm/qc-user-registration',
    icon: 'UserPlus',
    roles: ['dqm'],
  },
  {
    id: 'dqm-progress',
    label: 'Progress',
    href: '/capi/dqm/progress/qc-user-progress',
    icon: 'BarChart3',
    roles: ['dqm'],
    children: [
      {
        id: 'dqm-qc-user-progress',
        label: 'QC User Progress',
        href: '/capi/dqm/progress/qc-user-progress',
        icon: 'BarChart3',
        roles: ['dqm'],
      },
      {
        id: 'dqm-interview-list',
        label: 'Interview List',
        href: '/capi/dqm/progress/interview-list',
        icon: 'FileText',
        roles: ['dqm'],
      },
      // 
      {
        id: 'dqm-qc-user-pending-data',
        label: 'QC User - Pending Data',
        href: '/capi/dqm/progress/qc-user-pending-data',
        icon: 'Clock',
        roles: ['dqm'],
      },
      {
        id: 'dqm-ac-wise-pending-data',
        label: 'AC Wise - Pending Data',
        href: '/capi/dqm/progress/ac-wise-pending-data',
        icon: 'MapPin',
        roles: ['dqm'],
      },
    ],
  },
  {
    id: 'dqm-report',
    label: 'Report',
    href: '/capi/dqm/report/interview-date-wise',
    icon: 'FileText',
    roles: ['dqm'],
    children: [
      {
        id: 'dqm-interview-date-wise',
        label: 'Interview Date Wise',
        href: '/capi/dqm/report/interview-date-wise',
        icon: 'Calendar',
        roles: ['dqm'],
      },
      {
        id: 'dqm-enumerator-wise',
        label: 'Enumerator Wise',
        href: '/capi/dqm/report/enumerator-wise',
        icon: 'Users',
        roles: ['dqm'],
      },
      {
        id: 'dqm-ac-wise-report',
        label: 'AC Wise Report',
        href: '/capi/dqm/report/acwisereport',
        icon: 'MapPin',
        roles: ['dqm'],
      },
      {
        id: 'dqm-assigned-ac',
        label: 'Assigned AC',
        href: '/capi/dqm/report/assigned-ac',
        icon: 'MapPin',
        roles: ['dqm'],
      },
    ],
  },
  {
    id: 'dqm-demographic',
    label: 'Demographic %',
    href: '/capi/dqm/demographic',
    icon: 'Users',
    roles: ['dqm'],
  },
  {
    id: 'dqm-gps-map',
    label: 'GPS Map',
    href: '/capi/dqm/gps-map',
    icon: 'Map',
    roles: ['dqm'],
  },
  {
    id: 'dqm-download',
    label: 'Download',
    href: '/capi/dqm/download/qc-data',
    icon: 'Download',
    roles: ['dqm'],
    children: [
      {
        id: 'dqm-qc-data',
        label: 'QC Data',
        href: '/capi/dqm/download/qc-data',
        icon: 'Download',
        roles: ['dqm'],
      },
      {
        id: 'dqm-update-request',
        label: 'Update Request',
        href: '/capi/dqm/download/update-request',
        icon: 'Edit',
        roles: ['dqm'],
      },
    ],
  },

  // Data Quality Management Team (DQMT) Menu
  {
    id: 'dqmt-fieldwork-progress',
    label: 'Fieldwork Progress',
    href: '/capi/dqmt/fieldwork-progress',
    icon: 'BarChart3',
    roles: ['dqmt'],
  },
  {
    id: 'dqmt-qc-user-registration',
    label: 'QC User Registration',
    href: '/capi/dqmt/qc-user-registration',
    icon: 'UserPlus',
    roles: ['dqmt'],
  },
  {
    id: 'dqmt-progress',
    label: 'Progress',
    href: '/capi/dqmt/Progress/qc-user-progress',
    icon: 'BarChart3',
    roles: ['dqmt'],
    children: [
      {
        id: 'dqmt-qc-user-progress',
        label: 'QC User Progress',
        href: '/capi/dqmt/Progress/qc-user-progress',
        icon: 'BarChart3',
        roles: ['dqmt'],
      },
      {
        id: 'dqmt-interview-list',
        label: 'Interview List',
        href: '/capi/dqmt/Progress/interview-list',
        icon: 'FileText',
        roles: ['dqmt'],
      },
      {
        id: 'dqmt-qc-user-pending-data',
        label: 'QC User - Pending Data',
        href: '/capi/dqmt/Progress/qc-user-pending-data',
        icon: 'Clock',
        roles: ['dqmt'],
      },
      {
        id: 'dqmt-ac-wise-pending-data',
        label: 'AC Wise - Pending Data',
        href: '/capi/dqmt/Progress/ac-wise-pending-data',
        icon: 'MapPin',
        roles: ['dqmt'],
      },
    ],
  },
  // {
  //   id: 'dqmt-ac-wise-pending-data',
  //   label: 'AC Wise - Pending Data',
  //   href: '/capi/dqmt/ac-wise-pending-data',
  //   icon: 'MapPin',
  //   roles: ['dqmt'],
  // },
  {
    id: 'dqmt-report',
    label: 'Report',
    href: '/capi/dqmt/report/interview-date-wise',
    icon: 'FileText',
    roles: ['dqmt'],
    children: [
      {
        id: 'dqmt-interview-date-wise',
        label: 'Interview Date Wise',
        href: '/capi/dqmt/report/interview-date-wise',
        icon: 'Calendar',
        roles: ['dqmt'],
      },
      {
        id: 'dqmt-enumerator-wise',
        label: 'Enumerator Wise',
        href: '/capi/dqmt/report/enumerator-wise',
        icon: 'Users',
        roles: ['dqmt'],
      },
      {
        id: 'dqmt-ac-wise-report',
        label: 'AC Wise Report',
        href: '/capi/dqmt/report/ac-wise-report',
        icon: 'MapPin',
        roles: ['dqmt'],
      },
      {
        id: 'dqmt-assigned-ac',
        label: 'Assigned AC',
        href: '/capi/dqmt/report/assigned-ac',
        icon: 'MapPin',
        roles: ['dqmt'],
      },
    ],
  },
  {
    id: 'dqmt-demographic',
    label: 'Demographic %',
    href: '/capi/dqmt/demographic',
    icon: 'Users',
    roles: ['dqmt'],
  },
  {
    id: 'dqmt-gps-map',
    label: 'GPS Map',
    href: '/capi/dqmt/gps-map',
    icon: 'Map',
    roles: ['dqmt'],
  },

  // Start QC Menu
  {
    id: 'start-gps-qc',
    label: 'Start GPS QC',
    href: '/capi/start_qc/start-gps-qc',
    icon: 'Map',
    roles: ['start_qc'],
  },
  {
    id: 'start-audio-qc',
    label: 'Start Audio QC',
    href: '/capi/start_qc/start-audio-qc',
    icon: 'Mic',
    roles: ['start_qc'],
  },
  {
    id: 'start-re-qc',
    label: 'Start Re-QC',
    href: '/capi/start_qc/start-re-qc',
    icon: 'RefreshCw',
    roles: ['start_qc'],
  },

  // Findings Dashboard Menu
  {
    id: 'fd-fieldwork-progress',
    label: 'Fieldwork Progress',
    href: '/capi/fd/fieldwork-progress',
    icon: 'BarChart3',
    roles: ['fd'],
  },
  {
    id: 'fd-demographics',
    label: 'Demographics',
    href: '/capi/fd/demographics/basic-demographics',
    icon: 'Users',
    roles: ['fd'],
    children: [
      {
        id: 'fd-basic-demographics',
        label: 'Basic Demographics',
        href: '/capi/fd/demographics/basic-demographics',
        icon: 'Users',
        roles: ['fd'],
      },
      {
        id: 'fd-caste',
        label: 'Caste',
        href: '/capi/fd/demographics/caste',
        icon: 'Users',
        roles: ['fd'],
      },
    ],
  },
  {
    id: 'fd-interview-audio',
    label: 'Interview Audio',
    href: '/capi/fd/interview-audio',
    icon: 'Mic',
    roles: ['fd'],
  },
  {
    id: 'fd-findings',
    label: 'Findings',
    href: '/capi/fd/findings/vote-share-estimate',
    icon: 'BarChart3',
    roles: ['fd'],
    children: [
      {
        id: 'fd-vote-share-estimate',
        label: 'Vote Share Estimate',
        href: '/capi/fd/findings/vote-share-estimate',
        icon: 'BarChart3',
        roles: ['fd'],
      },
      {
        id: 'fd-gain-and-losses',
        label: 'Gain & Losses',
        href: '/capi/fd/findings/gain-and-losses',
        icon: 'TrendingUp',
        roles: ['fd'],
      },
      {
        id: 'fd-second-choice',
        label: 'Second Choice',
        href: '/capi/fd/findings/second-choice',
        icon: 'Target',
        roles: ['fd'],
      },
      {
        id: 'fd-approval-ratings',
        label: 'Approval Ratings',
        href: '/capi/fd/findings/approval-ratings',
        icon: 'ThumbsUp',
        roles: ['fd'],
      },
      {
        id: 'fd-wisdom-of-crowds',
        label: 'Wisdom of Crowds',
        href: '/capi/fd/findings/wisdom-of-crowds',
        icon: 'Users',
        roles: ['fd'],
      },
    ],
  },
  {
    id: 'fd-client-comparison',
    label: 'Client Comparison',
    href: '/capi/fd/client-comparison',
    icon: 'GitCompare',
    roles: ['fd'],
  },

  // Access to Raw Data Menu
  {
    id: 'atrd-capi',
    label: 'CAPI',
    href: '/capi/atrd/capi',
    icon: 'Database',
    roles: ['atrd'],
  },
  {
    id: 'atrd-cati',
    label: 'CATI',
    href: '/capi/atrd/cati',
    icon: 'Phone',
    roles: ['atrd'],
  },
  {
    id: 'atrd-capi-cati',
    label: 'CAPI + CATI',
    href: '/capi/atrd/capi-cati',
    icon: 'Database',
    roles: ['atrd'],
  },

  // WB Admin Menu
  {
    id: 'wba',
    label: 'WB Admin',
    href: '/capi/wba',
    icon: 'Settings',
    roles: ['wba'],
  },

  // Normalization Dashboard Menu
  {
    id: 'nd',
    label: 'Normalization Dashboard',
    href: '/capi/nd',
    icon: 'BarChart3',
    roles: ['nd'],
  },

  // PMT Menu (Legacy - keeping for backward compatibility)
  {
    id: 'pmt',
    label: 'PMT',
    href: '/pmt/dashboard',
    icon: 'BarChart3',
    roles: ['pmt'],
    children: [
      {
        id: 'pmt-dashboard',
        label: 'PMT Dashboard',
        href: '/pmt/dashboard',
        icon: 'Home',
        roles: ['pmt'],
      },
      {
        id: 'interview-log',
        label: 'Interview Log',
        href: '/pmt/interview-log',
        icon: 'FileText',
        roles: ['pmt'],
      },
      {
        id: 'demographic-pc',
        label: 'Demographic % (PC)',
        href: '/pmt/demographicpc',
        icon: 'Users',
        roles: ['pmt'],
      },
      {
        id: 'audit-log',
        label: 'Audit Log',
        href: '/pmt/audit',
        icon: 'FileText',
        roles: ['pmt'],
      },
      {
        id: 'cron-requests',
        label: 'Cron Requests',
        href: '/pmt/cron-request',
        icon: 'Clock',
        roles: ['pmt'],
      },
      {
        id: 'broadcasts',
        label: 'Broadcasts',
        href: '/pmt/broadcast',
        icon: 'Bell',
        roles: ['pmt'],
      },
      {
        id: 'broadcasts-log',
        label: 'Broadcasts - Log',
        href: '/pmt/broadcast/logdetail',
        icon: 'FileText',
        roles: ['pmt'],
      },
    ],
  },
  {
    id: 'master',
    label: 'Master',
    href: '/pmt/master',
    icon: 'Database',
    roles: ['pmt'],
    children: [
      {
        id: 'ac-list',
        label: 'AC List',
        href: '/pmt/master-ac',
        icon: 'Users',
        roles: ['pmt'],
      },
      {
        id: 'agency-list',
        label: 'Agency List',
        href: '/pmt/master-agency',
        icon: 'Users',
        roles: ['pmt'],
      },
      {
        id: 'project-setting',
        label: 'Project Setting',
        href: '/pmt/setting',
        icon: 'Settings',
        roles: ['pmt'],
      },
    ],
  },
  {
    id: 'progress-report',
    label: 'Progress Report',
    href: '/pmt/progress',
    icon: 'BarChart3',
    roles: ['pmt'],
  },
  {
    id: 'fail-report',
    label: 'Fail Report',
    href: '/pmt/progress/default/rejectreport',
    icon: 'XCircle',
    roles: ['pmt'],
  },
  {
    id: 'qc-fail-report',
    label: 'QC Fail Report',
    href: '/pmt/progress/qcrejectrepor',
    icon: 'XCircle',
    roles: ['pmt'],
  },
  {
    id: 'gps-map',
    label: 'GPS Map',
    href: '/pmt/progress/gpsmap',
    icon: 'Map',
    roles: ['pmt'],
  },
  {
    id: 'interview-detail',
    label: 'Interview Detail',
    href: '/pmt/progress/interviewdetail',
    icon: 'FileText',
    roles: ['pmt'],
  },
  {
    id: 'master-ps',
    label: 'Master PS',
    href: '/pmt/progress/master-poling-station',
    icon: 'MapPin',
    roles: ['pmt'],
  },
  {
    id: 'demographic-percent',
    label: 'Demographic %',
    href: '/pmt/progress/demographic',
    icon: 'Users',
    roles: ['pmt'],
    children: [
      {
        id: 'gender-wise',
        label: 'Gender Wise',
        href: '/pmt/progress/demographic',
        icon: 'Users',
        roles: ['pmt'],
      },
      {
        id: 'age-wise',
        label: 'Age Wise',
        href: '/pmt/progress/demographic/agewise',
        icon: 'Users',
        roles: ['pmt'],
      },
      {
        id: 'religion-wise',
        label: 'Religion Wise',
        href: '/pmt/progress/demographic/religionwise',
        icon: 'Users',
        roles: ['pmt'],
      },
      {
        id: 'social-category',
        label: 'Social Category',
        href: '/pmt/progress/demographic/socialcategorywise',
        icon: 'Users',
        roles: ['pmt'],
      },
      {
        id: 'caste-wise',
        label: 'Caste Wise',
        href: '/pmt/progress/demographic/castewise',
        icon: 'Users',
        roles: ['pmt'],
      },
    ],
  },

  // ============================================
  // CATI ROLES - Similar structure but different routes
  // ============================================

  // CATI Project Progress Monitoring (PPM) Menu
  {
    id: 'cati-ppm-overview',
    label: 'Overview',
    href: '/cati/ppm/overview/fieldwork-progress',
    icon: 'BarChart3',
    roles: ['cati_ppm'],
    children: [
      {
        id: 'cati-ppm-fieldwork-progress',
        label: 'Fieldwork Progress',
        href: '/cati/ppm/overview/fieldwork-progress',
        icon: 'BarChart3',
        roles: ['cati_ppm'],
      },
      {
        id: 'cati-ppm-interview-log',
        label: 'Interview Log',
        href: '/cati/ppm/overview/interview-log',
        icon: 'FileText',
        roles: ['cati_ppm'],
      },
    ],
  },
  {
    id: 'cati-ppm-master',
    label: 'Master',
    href: '/cati/ppm/master/aclist',
    icon: 'Database',
    roles: ['cati_ppm'],
    children: [
      {
        id: 'cati-ppm-ac-list',
        label: 'AC List',
        href: '/cati/ppm/master/aclist',
        icon: 'Users',
        roles: ['cati_ppm'],
      },
      {
        id: 'cati-ppm-team-registration',
        label: 'Team Registration',
        href: '/cati/ppm/master/team-registration',
        icon: 'Users',
        roles: ['cati_ppm'],
      },
      {
        id: 'cati-ppm-project-setting',
        label: 'Project Setting',
        href: '/cati/ppm/master/project-setting',
        icon: 'Settings',
        roles: ['cati_ppm'],
      },
    ],
  },
  {
    id: 'cati-ppm-progress-report',
    label: 'Progress Report',
    href: '/cati/ppm/progress-report',
    icon: 'BarChart3',
    roles: ['cati_ppm'],
  },
  {
    id: 'cati-ppm-rejection-report',
    label: 'Rejection Report',
    href: '/cati/ppm/rejection-report',
    icon: 'XCircle',
    roles: ['cati_ppm'],
  },
  {
    id: 'cati-ppm-demographic',
    label: 'Demographic %',
    href: '/cati/ppm/demographic',
    icon: 'Users',
    roles: ['cati_ppm'],
  },

  // CATI Project Progress Monitoring Team (PPMT) Menu
  {
    id: 'cati-ppmt-overview',
    label: 'Overview',
    href: '/cati/ppmt/overview/fieldwork-progress',
    icon: 'BarChart3',
    roles: ['cati_ppmt'],
    children: [
      {
        id: 'cati-ppmt-fieldwork-progress',
        label: 'Fieldwork Progress',
        href: '/cati/ppmt/overview/fieldwork-progress',
        icon: 'BarChart3',
        roles: ['cati_ppmt'],
      },
      {
        id: 'cati-ppmt-interview-log',
        label: 'Interview Log',
        href: '/cati/ppmt/overview/interview-log',
        icon: 'FileText',
        roles: ['cati_ppmt'],
      },
    ],
  },
  {
    id: 'cati-ppmt-progress-report',
    label: 'Progress Report',
    href: '/cati/ppmt/progress-report',
    icon: 'BarChart3',
    roles: ['cati_ppmt'],
  },
  {
    id: 'cati-ppmt-rejection-report',
    label: 'Rejection Report',
    href: '/cati/ppmt/rejection-report',
    icon: 'XCircle',
    roles: ['cati_ppmt'],
  },
  {
    id: 'cati-ppmt-demographic',
    label: 'Demographic %',
    href: '/cati/ppmt/demographic',
    icon: 'Users',
    roles: ['cati_ppmt'],
  },

  // CATI Data Quality Management (DQM) Menu
  {
    id: 'cati-dqm-fieldwork-progress',
    label: 'Fieldwork Progress',
    href: '/cati/dqm/fieldwork-progress',
    icon: 'BarChart3',
    roles: ['cati_dqm'],
  },
  {
    id: 'cati-dqm-qc-team-registration',
    label: 'QC Team Registration',
    href: '/cati/dqm/qc-team-registration',
    icon: 'Users',
    roles: ['cati_dqm'],
  },
  {
    id: 'cati-dqm-qc-user-registration',
    label: 'QC User Registration',
    href: '/cati/dqm/qc-user-registration',
    icon: 'UserPlus',
    roles: ['cati_dqm'],
  },
  {
    id: 'cati-dqm-progress',
    label: 'Progress',
    href: '/cati/dqm/progress/qc-user-progress',
    icon: 'BarChart3',
    roles: ['cati_dqm'],
    children: [
      {
        id: 'cati-dqm-qc-user-progress',
        label: 'QC User Progress',
        href: '/cati/dqm/progress/qc-user-progress',
        icon: 'BarChart3',
        roles: ['cati_dqm'],
      },
      {
        id: 'cati-dqm-interview-list',
        label: 'Interview List',
        href: '/cati/dqm/progress/interview-list',
        icon: 'FileText',
        roles: ['cati_dqm'],
      },
      {
        id: 'cati-dqm-qc-user-pending-data',
        label: 'QC User - Pending Data',
        href: '/cati/dqm/progress/qc-user-pending-data',
        icon: 'Clock',
        roles: ['cati_dqm'],
      },
      {
        id: 'cati-dqm-ac-wise-pending-data',
        label: 'AC Wise - Pending Data',
        href: '/cati/dqm/progress/ac-wise-pending-data',
        icon: 'MapPin',
        roles: ['cati_dqm'],
      },
    ],
  },
  {
    id: 'cati-dqm-report',
    label: 'Report',
    href: '/cati/dqm/report/interview-date-wise',
    icon: 'FileText',
    roles: ['cati_dqm'],
    children: [
      {
        id: 'cati-dqm-interview-date-wise',
        label: 'Interview Date Wise',
        href: '/cati/dqm/report/interview-date-wise',
        icon: 'Calendar',
        roles: ['cati_dqm'],
      },
      {
        id: 'cati-dqm-enumerator-wise',
        label: 'Enumerator Wise',
        href: '/cati/dqm/report/enumerator-wise',
        icon: 'Users',
        roles: ['cati_dqm'],
      },
      {
        id: 'cati-dqm-ac-wise-report',
        label: 'AC Wise Report',
        href: '/cati/dqm/report/acwisereport',
        icon: 'MapPin',
        roles: ['cati_dqm'],
      },
      {
        id: 'cati-dqm-assigned-ac',
        label: 'Assigned AC',
        href: '/cati/dqm/report/assigned-ac',
        icon: 'MapPin',
        roles: ['cati_dqm'],
      },
    ],
  },
  {
    id: 'cati-dqm-demographic',
    label: 'Demographic %',
    href: '/cati/dqm/demographic',
    icon: 'Users',
    roles: ['cati_dqm'],
  },
  {
    id: 'cati-dqm-download',
    label: 'Download',
    href: '/cati/dqm/download/qc-data',
    icon: 'Download',
    roles: ['cati_dqm'],
    children: [
      {
        id: 'cati-dqm-qc-data',
        label: 'QC Data',
        href: '/cati/dqm/download/qc-data',
        icon: 'Download',
        roles: ['cati_dqm'],
      },
      {
        id: 'cati-dqm-update-request',
        label: 'Update Request',
        href: '/cati/dqm/download/update-request',
        icon: 'Edit',
        roles: ['cati_dqm'],
      },
    ],
  },

  // CATI Data Quality Management Team (DQMT) Menu
  {
    id: 'cati-dqmt-fieldwork-progress',
    label: 'Fieldwork Progress',
    href: '/cati/dqmt/fieldwork-progress',
    icon: 'BarChart3',
    roles: ['cati_dqmt'],
  },
  {
    id: 'cati-dqmt-qc-user-registration',
    label: 'QC User Registration',
    href: '/cati/dqmt/qc-user-registration',
    icon: 'UserPlus',
    roles: ['cati_dqmt'],
  },
  {
    id: 'cati-dqmt-progress',
    label: 'Progress',
    href: '/cati/dqmt/progress/qc-user-progress',
    icon: 'BarChart3',
    roles: ['cati_dqmt'],
    children: [
      {
        id: 'cati-dqmt-qc-user-progress',
        label: 'QC User Progress',
        href: '/cati/dqmt/progress/qc-user-progress',
        icon: 'BarChart3',
        roles: ['cati_dqmt'],
      },
      {
        id: 'cati-dqmt-interview-list',
        label: 'Interview List',
        href: '/cati/dqmt/progress/interview-list',
        icon: 'FileText',
        roles: ['cati_dqmt'],
      },
      {
        id: 'cati-dqmt-qc-user-pending-data',
        label: 'QC User - Pending Data',
        href: '/cati/dqmt/progress/qc-user-pending-data',
        icon: 'Clock',
        roles: ['cati_dqmt'],
      },
      {
        id: 'cati-dqmt-ac-wise-pending-data',
        label: 'AC Wise - Pending Data',
        href: '/cati/dqmt/progress/ac-wise-pending-data',
        icon: 'MapPin',
        roles: ['cati_dqmt'],
      },
    ],
  },
  {
    id: 'cati-dqmt-report',
    label: 'Report',
    href: '/cati/dqmt/report/interview-date-wise',
    icon: 'FileText',
    roles: ['cati_dqmt'],
    children: [
      {
        id: 'cati-dqmt-interview-date-wise',
        label: 'Interview Date Wise',
        href: '/cati/dqmt/report/interview-date-wise',
        icon: 'Calendar',
        roles: ['cati_dqmt'],
      },
      {
        id: 'cati-dqmt-enumerator-wise',
        label: 'Enumerator Wise',
        href: '/cati/dqmt/report/enumerator-wise',
        icon: 'Users',
        roles: ['cati_dqmt'],
      },
      {
        id: 'cati-dqmt-ac-wise-report',
        label: 'AC Wise Report',
        href: '/cati/dqmt/report/ac-wise-report',
        icon: 'MapPin',
        roles: ['cati_dqmt'],
      },
      {
        id: 'cati-dqmt-assigned-ac',
        label: 'Assigned AC',
        href: '/cati/dqmt/report/assigned-ac',
        icon: 'MapPin',
        roles: ['cati_dqmt'],
      },
    ],
  },
  {
    id: 'cati-dqmt-demographic',
    label: 'Demographic %',
    href: '/cati/dqmt/demographic',
    icon: 'Users',
    roles: ['cati_dqmt'],
  },

  // CATI Start QC Menu
  {
    id: 'cati-start-audio-qc',
    label: 'Start Audio QC',
    href: '/cati/start_qc/start-audio-qc',
    icon: 'Mic',
    roles: ['cati_start_qc'],
  },
  {
    id: 'cati-start-re-qc',
    label: 'Start Re-QC',
    href: '/cati/start_qc/start-re-qc',
    icon: 'RefreshCw',
    roles: ['cati_start_qc'],
  },

  // CATI Findings Dashboard Menu
  {
    id: 'cati-fd-fieldwork-progress',
    label: 'Fieldwork Progress',
    href: '/cati/fd/fieldwork-progress',
    icon: 'BarChart3',
    roles: ['cati_fd'],
  },
  {
    id: 'cati-fd-demographics',
    label: 'Demographics',
    href: '/cati/fd/demographics/basic-demographics',
    icon: 'Users',
    roles: ['cati_fd'],
    children: [
      {
        id: 'cati-fd-basic-demographics',
        label: 'Basic Demographics',
        href: '/cati/fd/demographics/basic-demographics',
        icon: 'Users',
        roles: ['cati_fd'],
      },
      {
        id: 'cati-fd-caste',
        label: 'Caste',
        href: '/cati/fd/demographics/caste',
        icon: 'Users',
        roles: ['cati_fd'],
      },
    ],
  },
  {
    id: 'cati-fd-interview-audio',
    label: 'Interview Audio',
    href: '/cati/fd/interview-audio',
    icon: 'Mic',
    roles: ['cati_fd'],
  },
  {
    id: 'cati-fd-findings',
    label: 'Findings',
    href: '/cati/fd/findings/vote-share-estimate',
    icon: 'BarChart3',
    roles: ['cati_fd'],
    children: [
      {
        id: 'cati-fd-vote-share-estimate',
        label: 'Vote Share Estimate',
        href: '/cati/fd/findings/vote-share-estimate',
        icon: 'BarChart3',
        roles: ['cati_fd'],
      },
      {
        id: 'cati-fd-gain-and-losses',
        label: 'Gain & Losses',
        href: '/cati/fd/findings/gain-and-losses',
        icon: 'TrendingUp',
        roles: ['cati_fd'],
      },
      {
        id: 'cati-fd-second-choice',
        label: 'Second Choice',
        href: '/cati/fd/findings/second-choice',
        icon: 'Target',
        roles: ['cati_fd'],
      },
      {
        id: 'cati-fd-approval-ratings',
        label: 'Approval Ratings',
        href: '/cati/fd/findings/approval-ratings',
        icon: 'ThumbsUp',
        roles: ['cati_fd'],
      },
      {
        id: 'cati-fd-wisdom-of-crowds',
        label: 'Wisdom of Crowds',
        href: '/cati/fd/findings/wisdom-of-crowds',
        icon: 'Users',
        roles: ['cati_fd'],
      },
    ],
  },
  {
    id: 'cati-fd-client-comparison',
    label: 'Client Comparison',
    href: '/cati/fd/client-comparison',
    icon: 'GitCompare',
    roles: ['cati_fd'],
  },
];

export const getMenuByRole = (role: string, userSystem?: 'capi' | 'cati'): MenuItem[] => {
  return menuData.filter(item => {
    const hasRole = item.roles.includes(role) || item.roles.includes('admin');
    
    // If item has no system specified (common menus), show for all users
    if (!item.system) return hasRole;
    
    // If user has no system (admin roles), show common menus only
    if (!userSystem) return hasRole && !item.system;
    
    // Match both role and system
    return hasRole && item.system === userSystem;
  }).map(item => ({
    ...item,
    children: item.children ? item.children.filter(child => {
      const childHasRole = child.roles.includes(role) || child.roles.includes('admin');
      
      // If child has no system specified, show for all users
      if (!child.system) return childHasRole;
      
      // If user has no system, show common menus only
      if (!userSystem) return childHasRole && !child.system;
      
      // Match both role and system
      return childHasRole && child.system === userSystem;
    }) : undefined,
  }));
};
