# Research Role Flow - Implementation Document

## Overview
This document outlines the implementation requirements for the Research Role user flow based on the reference images provided in `ref_page/research_role_flow/`.

---

## User Flow Analysis

### 1. Landing Page (01_research_role_landing_page.jpeg)
**Page**: Research Admin Landing
**Route**: `/home`

#### UI Components:
- **Header**: "Research Admin"
- **Three Main Action Cards**:
  1. **Project Management Dashboard** (Purple/Indigo background)
  2. **Findings Dashboard** (Blue background)
  3. **Access to Raw Data** (Cyan/Teal background)

#### Layout:
- Cards displayed in a horizontal row
- Equal width distribution (3 columns)
- Consistent height across all cards
- Centered text with white font
- Rounded corners with shadow effect

---

### 2. After Clicking "Findings Dashboard" (02_b_after_clicked_onfinding_dashboard.jpeg)
**Page**: Findings Dashboard Selection
**Route**: `/research/findings-selection`

#### UI Components:
- **Top Section**: Retains the 3 main cards from landing page
- **New Section Below**: "Findings Dashboard"
  - **Title**: "Findings Dashboard" (left-aligned)
  - **Two Dashboard Options**:
    1. **Findings Dashboard** (Blue background)
    2. **Normalization Dashboard** (Blue background)

#### Layout:
- Two-column grid for dashboard options
- Each card occupies 50% width (2 columns out of 4)
- Consistent styling with rounded corners
- White text on blue background
- Section separator or spacing between top and bottom sections

---

### 3. System Selection Page (03_after_clicked_on_anyof_button.jpeg)
**Page**: CAPI/CATI System Selection
**Route**: `/research/system-selection` or similar

#### UI Components:
- **Header**: "Admin Portal"
- **Three System Selection Cards**:
  1. **CAPI** (Light green/lime background)
  2. **CATI** (Yellow/Gold background)
  3. **CAPI + CATI** (Turquoise/Mint green background)

#### Layout:
- Cards displayed in a horizontal row
- Equal width distribution (3 columns)
- Consistent height across all cards
- Centered text with dark/black font
- Rounded corners with shadow effect
- Background colors match the home page implementation

---

### 4. After Selecting CAPI (04_after_clicked_on_capi.jpeg)
**Page**: CAPI Role-Specific Dashboard Selection
**Route**: `/research/capi/dashboard-selection`

#### UI Components:
- **Top Section**: System selection cards (CAPI, CATI, CAPI + CATI)
- **New Section Below**: "CAPI"
  - **Title**: "CAPI" (left-aligned)
  - **Two Role-Based Dashboard Options**:
    1. **Data Quality Management** (Purple/Indigo background)
    2. **QC user** (Purple/Indigo background)

#### Layout:
- Two-column grid for role options
- Each card occupies 50% width
- Consistent purple/indigo background
- White text on colored background
- Section separator between system selection and role selection

---

## Implementation Requirements

### A. Routing Structure

```
/research
  ├── /home (or /dashboard)                 → Landing page with 3 main cards
  ├── /findings-selection                   → Findings Dashboard selection
  ├── /system-selection                     → CAPI/CATI selection
  ├── /capi
  │   ├── /dashboard-selection              → Role selection for CAPI
  │   ├── /dqm                              → Data Quality Management routes
  │   └── /qc-user                          → QC User routes
  ├── /cati
  │   └── /dashboard-selection              → Role selection for CATI
  └── /raw-data                             → Access to Raw Data
```

### B. Page Components Required

#### 1. Research Landing Page (`/research/home`)
```tsx
- Header: "Admin Portal"
- Three action cards:
  * Project Management Dashboard
  * Findings Dashboard
  * Access to Raw Data
- Click handlers for navigation
```

#### 2. Findings Dashboard Selection (`/research/findings-selection`)
```tsx
- Top section: 3 main cards (same as landing)
- Bottom section: "Findings Dashboard"
  * Findings Dashboard card
  * Normalization Dashboard card
- Click handlers for each option
```

#### 3. System Selection Page (`/research/system-selection`)
```tsx
- Header: "Admin Portal"
- Three system cards:
  * CAPI (green background)
  * CATI (yellow background)
  * CAPI + CATI (turquoise background)
- Click handlers for system selection
```

#### 4. CAPI Dashboard Selection (`/research/capi/dashboard-selection`)
```tsx
- Top section: System selection cards
- Bottom section: "CAPI"
  * Data Quality Management card
  * QC user card
- Click handlers for role selection
```

### C. Navigation Flow

```
1. User logs in as Research role
   ↓
2. Lands on /research/home
   ↓
3. Clicks one of three options:
   
   Option A: "Project Management Dashboard"
   → Navigate to PM Dashboard
   
   Option B: "Findings Dashboard"
   → Navigate to /research/findings-selection
   → User selects "Findings Dashboard" or "Normalization Dashboard"
   → Navigate to respective dashboard
   
   Option C: "Access to Raw Data"
   → Navigate to /research/system-selection
   → User selects CAPI, CATI, or CAPI + CATI
   → Navigate to /research/{system}/dashboard-selection
   → User selects role-specific dashboard
   → Navigate to respective dashboard
```

### D. State Management

#### User Context Required:
```typescript
interface ResearchUser {
  id: string;
  name: string;
  email: string;
  role: 'research' | 'research_admin';
  selectedSystem?: 'capi' | 'cati' | 'both';
  selectedDashboard?: string;
  permissions: string[];
}
```

#### Navigation State:
```typescript
interface ResearchNavigation {
  currentPath: string;
  breadcrumbs: Array<{
    label: string;
    path: string;
  }>;
  previousPage?: string;
}
```

### E. UI Styling Requirements

#### Color Scheme:
- **Project Management Dashboard**: `#6366f1` (Indigo/Purple)
- **Findings Dashboard**: `#3b82f6` (Blue)
- **Access to Raw Data**: `#06b6d4` (Cyan/Teal)
- **CAPI Button**: `#a8d5a1` (Light green)
- **CATI Button**: `#f4d03f` (Yellow/Gold)
- **CAPI + CATI Button**: `#7dd3c0` (Turquoise/Mint)
- **Role Cards (DQM, QC)**: `#6366f1` (Purple/Indigo)

#### Card Styling:
```css
- Border radius: 8px (rounded-lg)
- Shadow: medium shadow
- Padding: 20px (p-20)
- Height: 80px (h-20) or auto
- Text: Center-aligned, font-bold, text-lg
- Hover effect: Slightly darker shade
- Transition: smooth (duration-200)
```

#### Layout Grid:
```css
- 3-column grid: grid-cols-1 md:grid-cols-3 gap-6
- 2-column grid: grid-cols-1 md:grid-cols-2 gap-6
- Container: max-width-7xl, mx-auto
- Spacing between sections: mb-8 or mb-12
```

### F. Component Structure

#### Reusable Card Component:
```tsx
interface DashboardCardProps {
  title: string;
  bgColor: string;
  textColor?: string;
  onClick: () => void;
  icon?: React.ReactNode;
  className?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  bgColor,
  textColor = 'text-white',
  onClick,
  icon,
  className
}) => {
  return (
    <button
      onClick={onClick}
      className={`h-20 rounded-lg shadow-md transition-all duration-200 flex items-center justify-center gap-3 ${bgColor} hover:opacity-90 ${textColor} ${className}`}
    >
      {icon && <span className="text-2xl">{icon}</span>}
      <span className="text-lg font-bold">{title}</span>
    </button>
  );
};
```

### G. Authentication & Authorization

#### Role Check:
```typescript
const isResearchRole = (user: User): boolean => {
  return ['research', 'research_admin'].includes(user.role);
};
```

#### Route Protection:
```typescript
// Middleware or layout component
if (!isResearchRole(user)) {
  redirect('/unauthorized');
}
```

#### Menu Visibility:
- Header should NOT show horizontal navigation menu
- Header should show user profile and logout options
- No sidebar menu for research role landing pages

---

## Implementation Steps

### Phase 1: Setup Routes & Pages
1. Create `/research/home` page with 3 main cards
2. Create `/research/findings-selection` page
3. Create `/research/system-selection` page
4. Create `/research/capi/dashboard-selection` page
5. Create `/research/cati/dashboard-selection` page

### Phase 2: Create Reusable Components
1. `DashboardCard` component
2. `SectionTitle` component
3. `ResearchLayout` wrapper component

### Phase 3: Implement Navigation Logic
1. Add click handlers for all cards
2. Implement navigation state management
3. Add breadcrumb navigation
4. Implement back button functionality

### Phase 4: Integrate with Authentication
1. Add research role to User interface
2. Update AuthContext for research role
3. Add route protection for research pages
4. Update login redirect logic

### Phase 5: Connect to Backend
1. Fetch user-specific dashboard permissions
2. Load available systems (CAPI/CATI)
3. Load available roles for selected system
4. Track user navigation analytics

### Phase 6: Testing & Refinement
1. Test navigation flow
2. Test role-based access
3. Verify responsive design
4. Check accessibility
5. Performance optimization

---

## Files to Create/Modify

### New Files:
```
src/app/research/
  ├── home/page.tsx
  ├── findings-selection/page.tsx
  ├── system-selection/page.tsx
  ├── capi/
  │   └── dashboard-selection/page.tsx
  ├── cati/
  │   └── dashboard-selection/page.tsx
  └── layout.tsx

src/components/research/
  ├── DashboardCard.tsx
  ├── SectionTitle.tsx
  └── ResearchLayout.tsx
```

### Modified Files:
```
src/types/index.ts              → Add research role type
src/contexts/AuthContext.tsx    → Add research role handling
src/lib/menu-data.ts            → Add research role menus (if needed)
src/components/layout/ConditionalLayout.tsx → Add research route handling
```

---

## API Endpoints Required

```
GET /api/research/dashboards
  → Returns available dashboards for research role

GET /api/research/systems
  → Returns available systems (CAPI, CATI, or both)

GET /api/research/permissions
  → Returns user-specific permissions for research dashboards

POST /api/research/track-navigation
  → Track user navigation for analytics
```

---

## Notes & Considerations

1. **Backward Navigation**: Ensure users can navigate back to previous selection screens
2. **State Persistence**: Consider persisting user's last selected system/dashboard
3. **Responsive Design**: All cards should stack vertically on mobile devices
4. **Loading States**: Show loading indicators when fetching permissions/dashboards
5. **Error Handling**: Handle cases where user has no access to certain dashboards
6. **Analytics**: Track which dashboards are most accessed
7. **Accessibility**: Ensure all cards are keyboard navigable and screen-reader friendly

---

## Design Specifications

### Typography:
- Page Title: text-2xl font-semibold
- Card Title: text-lg font-bold
- Section Title: text-xl font-semibold

### Spacing:
- Between sections: mb-8
- Between cards: gap-6
- Card padding: p-20 (vertical), px-6 (horizontal)
- Page container: p-6 or py-8 px-6

### Responsive Breakpoints:
- Mobile (< 768px): Single column, stacked cards
- Tablet (768px - 1024px): 2 columns for 3-card layout
- Desktop (> 1024px): 3 columns for 3-card layout, 2 columns for 2-card layout

---

## Conclusion

This implementation document provides a comprehensive guide for developing the Research Role flow. The design emphasizes:
- Clear visual hierarchy
- Intuitive navigation
- Consistent UI patterns
- Role-based access control
- Responsive design

Follow the implementation steps sequentially to ensure a smooth development process.

