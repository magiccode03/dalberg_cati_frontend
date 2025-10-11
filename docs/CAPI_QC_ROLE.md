# CAPI QC Role Documentation

## Overview
The `capi_qc` role is a specialized role for CAPI (Computer-Assisted Personal Interviewing) Quality Control users.

## Role Details

### Role Name
- **Internal Name**: `capi_qc`
- **Display Name**: CAPI QC
- **System**: CAPI

### User ID Prefix
- **Prefix**: `CAPIQC`
- **Format**: `CAPIQC001`, `CAPIQC002`, etc.

### Permissions
The `capi_qc` role has the following default permissions:
- `qc:read` - Read quality control data
- `qc:write` - Write/modify quality control data
- `dashboard:read` - Access dashboard information

## Login Redirect
After successful login, users with the `capi_qc` role are automatically redirected to:
```
/capi/capi-qc/qc-auth
```

This is the QC Authentication page where users can authenticate before accessing the QC system.

## Menu Access
CAPI QC users have access to the following menu items:
- **QC Authentication** (`/capi/capi-qc/qc-auth`) - Main authentication page

## Implementation Files

### Type Definitions
- **File**: `src/types/index.ts`
- **Changes**: Added `capi_qc` to the `User` role type union

### Authentication Context
- **File**: `src/contexts/AuthContext.tsx`
- **Changes**:
  - Added `capi_qc` to `systemRoles` array
  - Added `capi_qc` permissions in `getDefaultPermissions()`
  - Added `capi_qc` redirect URL in `getRedirectUrl()`
  - Added `capi_qc` prefix in `generateUniqueId()`

### Menu Data
- **File**: `src/lib/menu-data.ts`
- **Changes**: Added CAPI QC menu items with proper role filtering

### Pages
- **File**: `src/app/capi/capi-qc/qc-auth/page.tsx`
- **Description**: QC Authentication page for CAPI QC users

## Usage

### Creating a CAPI QC User
1. Login as Super Admin or Portal Admin
2. Navigate to user management
3. Create a new user with role `capi_qc`
4. The system will automatically assign a unique ID with prefix `CAPIQC`

### Login Flow
1. User logs in with their `CAPIQC` credentials
2. System authenticates the user
3. User is automatically redirected to `/capi/capi-qc/qc-auth`
4. User authenticates on the QC Auth page
5. After authentication, user is redirected to the main dashboard (`/home`)

## API Integration
The `capi_qc` role is integrated with the backend API through:
- Login endpoint: Handles role-based authentication
- User creation: Supports `capi_qc` role assignment
- Permission checks: Validates QC-specific permissions

## Future Enhancements
Potential future enhancements for the CAPI QC role:
- Additional QC-specific pages and workflows
- Enhanced QC data visualization
- QC reporting and analytics
- Interview quality scoring
- QC team management

## Related Roles
- `start_qc` - CAPI Start QC role (different from capi_qc)
- `dqm` - Data Quality Management role
- `dqmt` - Data Quality Management Team role

## Date Created
October 10, 2025

## Last Updated
October 10, 2025

