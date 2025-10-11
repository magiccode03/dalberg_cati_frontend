# QC User Verification Update

## Overview
Updated the CAPI QC authentication page to use the new QC user verification API and added a header button to display QC user information when verified.

## Date Updated
October 10, 2025

## Changes Made

### 1. QC Auth Page (`/capi/capi-qc/qc-auth`)
**File**: `src/app/capi/capi-qc/qc-auth/page.tsx`

#### API Integration Changes
- **Old API**: `/api/teleform-users/verify`
- **New API**: `/api/qc-user-registration/verify`

#### Request Format
```json
POST /api/qc-user-registration/verify
{
  "qc_id": 101,
  "mobile_number": "9876543210"
}
```

#### Response Format
```json
{
  "success": true,
  "data": {
    "success": true,
    "message": "QC user verified successfully",
    "data": {
      "id": 1,
      "qc_id": 101,
      "name": "John Doe",
      "mobile_number": "9876543210",
      "status": "Active",
      "access_permissions": {
        "audio_qc": true,
        "gps_qc": true,
        "tele_qc": false,
        "rechecking": false
      },
      "agency_id": 1
    }
  },
  "message": "QC user verification completed",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### Key Function Updates

**1. Renamed Function**
- **Old**: `verifyTeleformUser()`
- **New**: `verifyQCUser()`

**2. LocalStorage Key**
- **Old**: `teleform_user_data`
- **New**: `qc_user_data`

**3. Custom Event**
- **Old**: `teleformUserUpdated`
- **New**: `qcUserUpdated`

**4. Behavior Changes**
- **Old**: Redirected to `/cati/ss/new-call/{qc_id}` after verification
- **New**: Shows success message with "Continue" button to go to `/home`

#### UI Updates

**Success Message**
- Changed from "Login Successful!" to "Verification Successful!"
- Updated message text to reflect QC user verification
- Added two buttons:
  - **Clear**: Clears form and QC user data
  - **Continue**: Navigates to `/home`

**Form Fields**
- QC User ID input
- User Phone No input
- Form validation with error messages
- Submit button with loading state
- Clear button to reset form

### 2. Header Component Updates
**File**: `src/components/layout/Header.tsx`

#### New State Variable
```typescript
const [qcUserData, setQcUserData] = useState<any>(null);
```

#### New Function
```typescript
const checkQCUserData = () => {
  const savedData = localStorage.getItem('qc_user_data');
  if (savedData) {
    try {
      const userData = JSON.parse(savedData);
      setQcUserData(userData);
    } catch (err) {
      console.error('Error parsing QC user data:', err);
      setQcUserData(null);
    }
  } else {
    setQcUserData(null);
  }
};
```

#### Event Listeners Updated
```typescript
// Added QC user event listener
window.addEventListener('qcUserUpdated', handleStorageChange);

// Cleanup
window.removeEventListener('qcUserUpdated', handleStorageChange);
```

#### New Handler Function
```typescript
const handleQCUserClick = () => {
  router.push('/capi/capi-qc/qc-auth');
};
```

#### QC User Button Component
```tsx
{/* QC User Button */}
{mounted && qcUserData && user?.role === 'capi_qc' && (
  <button
    onClick={handleQCUserClick}
    className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-800 transition-colors"
    title="View QC User"
  >
    <UserCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
    <div className="text-left">
      <p className="text-xs font-medium text-blue-800 dark:text-blue-300">
        {qcUserData.name}
      </p>
      <p className="text-xs text-blue-600 dark:text-blue-400">
        ID: {qcUserData.qc_id}
      </p>
    </div>
  </button>
)}
```

## Features

### 1. QC User Verification
- Users enter QC ID and mobile number
- System verifies with backend API
- Success response saves data to localStorage
- Triggers header update via custom event

### 2. Header Button Display
- **Visibility**: Only shows when:
  - Component is mounted
  - QC user data exists in localStorage
  - User role is `capi_qc`
- **Styling**: Blue theme (vs. green for teleform users)
- **Information Displayed**:
  - QC user name
  - QC user ID
- **Click Action**: Navigates to QC auth page

### 3. Data Persistence
- QC user data stored in localStorage
- Auto-fills form on page reload if data exists
- Shows success state if user is already verified
- Clear button removes data and resets form

### 4. Real-time Header Updates
- Custom event `qcUserUpdated` triggers header refresh
- Works across same-tab updates
- Storage event listener for cross-tab updates

## User Flow

### Verification Flow
```
1. User logs in with capi_qc role
   ↓
2. Auto-redirected to /capi/capi-qc/qc-auth
   ↓
3. User enters QC ID and mobile number
   ↓
4. System verifies with API
   ↓
5. Success: Data saved to localStorage
   ↓
6. Header button appears
   ↓
7. User clicks "Continue" → goes to /home
```

### Re-visit Flow
```
1. User returns to QC auth page
   ↓
2. System detects saved QC data
   ↓
3. Auto-fills form
   ↓
4. Shows success message
   ↓
5. Header button already visible
   ↓
6. User can continue or clear data
```

## Styling

### QC User Button
- **Background**: Blue-50 (light mode), Blue-900/30 (dark mode)
- **Border**: Blue-200 (light mode), Blue-800 (dark mode)
- **Icon**: UserCheck from Lucide React
- **Text Colors**:
  - Name: Blue-800 (light), Blue-300 (dark)
  - ID: Blue-600 (light), Blue-400 (dark)

### Success Card
- **Background**: Green-50 (light mode), Green-900/20 (dark mode)
- **Border**: Green-200 (light mode), Green-800 (dark mode)
- **Text Colors**:
  - Title: Green-900 (light), Green-300 (dark)
  - Message: Green-800 (light), Green-400 (dark)

## API Error Handling
- Missing token: "No authentication token found"
- Network error: "Failed to verify QC user. Please try again."
- API error response: Displays message from API
- Validation errors: Shows inline error messages

## Testing Checklist
- [ ] Verify API integration with correct endpoint
- [ ] Test form validation (empty fields, invalid phone)
- [ ] Test successful verification flow
- [ ] Test error handling scenarios
- [ ] Test header button visibility
- [ ] Test header button click navigation
- [ ] Test Clear button functionality
- [ ] Test Continue button navigation
- [ ] Test data persistence on page reload
- [ ] Test real-time header updates
- [ ] Test dark mode styling
- [ ] Test responsive design

## Related Files
- `src/app/capi/capi-qc/qc-auth/page.tsx` - Main QC auth page
- `src/components/layout/Header.tsx` - Header with QC user button
- `src/contexts/AuthContext.tsx` - Authentication context
- `src/lib/menu-data.ts` - Menu configuration
- `src/types/index.ts` - Type definitions
- `docs/CAPI_QC_ROLE.md` - Role documentation

## Notes
- QC user data is stored separately from teleform user data
- Uses different localStorage key (`qc_user_data` vs `teleform_user_data`)
- Uses different custom event (`qcUserUpdated` vs `teleformUserUpdated`)
- Button styling is blue (QC) vs green (teleform) for visual distinction
- No linting errors after implementation

## Future Enhancements
- Add QC user profile page with detailed information
- Add access permissions display in header button tooltip
- Add QC user statistics dashboard
- Add QC activity tracking
- Add QC user logout functionality from header button

