# Election Analysis Dashboard

A comprehensive Next.js 15+ application for Election Analysis Dashboard System with advanced data visualization, role-based access control, and real-time analytics.

## 🚀 Features

### Core Functionality
- **Election Data Analysis**: Comprehensive analysis of vote share, progress tracking, and demographic insights
- **Real-time Dashboards**: Live tracking of fieldwork progress, interview status, and quality metrics
- **Interactive Maps**: GPS tracking, cluster mapping, and heatmap visualization using Leaflet
- **Advanced Charts**: ECharts integration for dynamic data visualization
- **Role-based Access Control**: Multi-level user management with specific permissions
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark/Light Theme**: Theme switching with system preference detection

### User Roles & Systems
- **SUPER ADMIN**: Complete system management and user administration
- **PPM (Project Progress Monitoring)**: Project oversight and progress monitoring
- **QC (Quality Control)**: Interview quality assessment and validation
- **CAPI System**: Computer-Assisted Personal Interviewing
- **CATI System**: Computer-Assisted Telephone Interviewing
- **Data Quality Management**: Data validation and quality assurance

### Key Modules
- **Dashboard Analytics**: Vote share analysis, progress tracking, demographic insights
- **User Management**: Create, edit, and manage system users (SUPER ADMIN only)
- **Fieldwork Progress**: Real-time tracking of interview progress and completion
- **Quality Control**: GPS validation, audio QC, and data quality checks
- **Master Data Management**: AC (Assembly Constituency) and PS (Polling Station) management
- **Report Generation**: Comprehensive reporting and data export capabilities

## 🛠️ Required Technologies

### Core Technologies
- **Node.js**: v20.0.0 or higher
- **npm**: v8.0.0 or higher (or yarn/pnpm)
- **Next.js**: 15.5.3
- **React**: 19.1.0
- **TypeScript**: 5.x

### Key Dependencies
- **UI Framework**: Tailwind CSS 3.4.17
- **State Management**: Redux Toolkit 2.9.0
- **Data Fetching**: TanStack React Query 5.90.1
- **Charts**: ECharts 5.6.0, ECharts for React 3.0.2
- **Maps**: Leaflet 1.9.4, React Leaflet 5.0.0
- **Forms**: React Hook Form 7.63.0, Zod 4.1.11
- **UI Components**: Radix UI components
- **Icons**: Lucide React 0.544.0

### Development Tools
- **Linting**: ESLint 9.x
- **Type Checking**: TypeScript 5.x
- **CSS Processing**: PostCSS 8.5.6, Autoprefixer 10.4.21

## 📋 Prerequisites

Before running this application, ensure you have:

1. **Node.js** (v20.0.0 or higher)
   ```bash
   node --version
   ```

2. **npm** (v8.0.0 or higher)
   ```bash
   npm --version
   ```

3. **Git** (for cloning the repository)
   ```bash
   git --version
   ```

## 🚀 Installation Process and How to Run on Another System

### For New Developers/Team Members

1. **Clone and Setup**
   ```bash
   git clone <repository-url>
   cd convergentview_sportal_frontend
   npm install
   ```
2. **Environment Configuration**
   ```bash
   # Copy environment template
   cp env.example .env
   
   # If env.example not available, edit environment variables
   nano .env  # or use your preferred editor
   ```

4. **Start Development**
   ```bash
   npm run dev
   ```

5. **Access Application**
   - Open browser and navigate to `http://localhost:3000`
   - If port 3000 is busy, Next.js will automatically use the next available port (3001, 3002, etc.)

### For Production Deployment

1. **Build the Application**
   ```bash
   npm run build
   ```

2. **Start Production Server**
   ```bash
   npm start
   ```

3. **Environment Variables for Production**
   ```bash
   # Set production environment variables
   export NODE_ENV=production
   export NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com/api
   export NEXTAUTH_URL=https://your-domain.com
   ```

## 📁 Project Structure

```
src/
├── app/                   # Next.js App Router pages
│   ├── capi/              # CAPI system pages
│   │   ├── dqm/           # Data Quality Management
│   │   ├── dqmt/          # Data Quality Management Team
│   │   ├── fd/            # Field Data
│   │   ├── ppm/           # Project Progress Monitoring
│   │   ├── ppmt/          # Project Progress Monitoring Team
│   │   └── start_qc/      # Quality Control initiation
│   ├── cati/              # CATI system pages
│   │   ├── fd/            # Field Data
│   │   ├── ppm/           # Project Progress Monitoring
│   │   └── ss/            # Survey System
│   ├── dashboard/         # Main dashboard pages
│   │   ├── analysis/      # Analysis modules
│   │   ├── components/    # Dashboard components
│   │   ├── ppm/           # Project Progress Monitoring
│   │   ├── qc/            # Quality Control
│   │   ├── quality-analyst/ # Quality Analysis
│   │   └── user-management/ # User Management
│   ├── home/              # Home page
│   ├── login/             # Authentication pages
│   ├── ppm/               # Project Progress Monitoring
│   ├── portal-admin/      # Portal administration
│   ├── super-admin/       # Super admin pages
│   └── unauthorized/      # Unauthorized access page
├── components/            # Reusable React components
│   ├── auth/              # Authentication components
│   ├── charts/            # Chart components
│   ├── forms/             # Form components
│   ├── layout/            # Layout components
│   ├── management/        # Management components
│   ├── maps/              # Map components
│   ├── providers/         # Context providers
│   ├── tables/            # Table components
│   ├── theme-provider.tsx # Theme provider
│   └── ui/                # Base UI components (70+ components)
├── contexts/              # React Context providers
│   ├── AuthContext.tsx    # Authentication context
│   └── SidebarContext.tsx # Sidebar context
├── hooks/                 # Custom React hooks
│   ├── redux.ts           # Redux hooks
│   ├── useApi.ts          # API hooks
│   ├── useFormValidation.ts # Form validation hooks
│   └── useModal.ts        # Modal hooks
├── lib/                   # Utility functions and configurations
│   ├── api-client.ts      # API client
│   ├── api-service.ts     # API service
│   ├── api.ts             # API utilities
│   ├── auth-service.ts    # Authentication service
│   ├── chart-config.ts    # Chart configurations
│   ├── config.ts          # App configuration
│   ├── error-handler.ts   # Error handling
│   ├── menu-data.ts       # Menu structure
│   ├── mock-data.ts       # Mock data
│   ├── modal-utils.ts     # Modal utilities
│   ├── token-manager.ts   # Token management
│   ├── utils.ts           # General utilities
│   └── validation-schemas.ts # Validation schemas
├── stores/                # Redux store slices
│   ├── analysis-store.ts  # Analysis state
│   ├── app-store.ts       # App state
│   └── store.ts           # Store configuration
└── types/                 # TypeScript type definitions
    └── index.ts           # Type definitions
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Additional commands
npm run type-check   # Run TypeScript type checking
npm run clean        # Clean build artifacts
```

## 🔐 Authentication & User Roles

### Login System
- **Unique ID Authentication**: Users log in with alphanumeric/numeric IDs (not email)
- **Role-based Access**: Different access levels based on user roles
- **Protected Routes**: Automatic redirect to login for unauthenticated users

### User Roles
- **SUPER_ADMIN**: Complete system access and user management
- **ADMIN**: Administrative access to specific modules
- **PPM**: Project Progress Monitoring access
- **QC**: Quality Control access
- **QUALITY_ANALYST**: Quality analysis access
- **START_QC**: Quality control initiation access
- **DATA_QUALITY**: Data quality management
- **PPM/PPMT**: Project Progress Monitoring
- **DQM/DQMT**: Data Quality Management
- **FD**: Field Data access
- **PORTAL_ADMIN**: Portal administration

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark/Light Theme**: Automatic theme switching with system preference detection
- **Interactive Components**: Radix UI components for accessibility
- **Data Visualization**: ECharts for dynamic charts and graphs
- **Map Integration**: Leaflet maps for GPS tracking and location data
- **Form Validation**: React Hook Form with Zod validation schemas

## 📊 Data Visualization

- **Vote Share Analysis**: Interactive pie charts and bar charts
- **Progress Tracking**: Real-time progress bars and completion metrics
- **Demographic Insights**: Population distribution and analysis charts
- **GPS Mapping**: Interactive maps with cluster and heatmap views
- **Quality Metrics**: Data quality assessment visualizations

## 🔧 Configuration

### Next.js Configuration
The application uses `next.config.ts` with the following settings:
- ESLint integration
- TypeScript support
- Build optimization

### Tailwind CSS
Custom configuration in `tailwind.config.js` with:
- Custom color schemes
- Responsive breakpoints
- Component-specific styling

## 🚨 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Kill process on port 3000
   lsof -ti:3000 | xargs kill -9
   
   # Or use different port
   npm run dev -- --port 3001
   ```

2. **ChunkLoadError**
   ```bash
   # Clear Next.js cache
   rm -rf .next
   npm run dev
   ```

3. **Dependencies Issues**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **TypeScript Errors**
   ```bash
   # Check TypeScript configuration
   npx tsc --noEmit
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is proprietary and confidential. All rights reserved.

## 📞 Support

For technical support or questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation in `/docs` folder

## 🔄 Version History

- **v0.1.0**: Initial release with core dashboard functionality
- **v0.2.0**: Added CAPI/CATI system integration
- **v0.3.0**: Enhanced data visualization and mapping features
- **v0.4.0**: Improved user management and role-based access control

---

**Note**: This application is specifically designed for Election 2025 analysis and contains sensitive election data. Ensure proper security measures are in place when deploying to production.