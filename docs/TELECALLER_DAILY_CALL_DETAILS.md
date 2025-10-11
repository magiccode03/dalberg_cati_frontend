# Telecaller Daily Call Details Page

## Overview
The Telecaller Daily Call Details page displays a comprehensive list of call records made by telecallers, including call information, durations, and audio recordings with playback functionality.

## Page Location
- **URL:** `/cati/fd/telecaller-daily-call-details`
- **File:** `project-frontend/src/app/cati/fd/telecaller-daily-call-details/page.tsx`
- **Role:** FD (Field Data) users

## Features

### 1. Call Details Table
Displays the following columns:
- **Caller Name**: Name of the telecaller
- **Caller ID**: Unique identifier for the caller
- **Call Time**: Date and time of the call
- **Call Received**: Whether the call was answered (Yes/No)
- **Caller Response**: Placeholder for caller response data
- **API Response**: Placeholder for API response data
- **IVR Duration**: Duration in IVR system (MM:SS format)
- **Talk Duration**: Actual conversation duration (MM:SS format)
- **Audio file**: Play button for audio playback (if available)
- **Update**: Edit button for updating call details

### 2. API Integration

#### Endpoint
```
GET /api/cati/interviews/call-details
```

#### Query Parameters
- `page`: Current page number (default: 1)
- `limit`: Number of records per page (default: 10)

#### Request Headers
```
Authorization: Bearer <token>
Accept: application/json
```

#### Response Structure
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 8180,
        "caller_id": 125,
        "caller_name": "Souvik",
        "phone": "6294993297",
        "ac_code": 238,
        "call_time": null,
        "call_received": 0,
        "ivr_duration": null,
        "talk_duration": null,
        "audio": null
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 5,
      "total": 7851,
      "totalPages": 1571,
      "hasNext": true,
      "hasPrev": false
    }
  },
  "message": "Call details retrieved successfully",
  "timestamp": "2025-10-08T09:35:56.095Z"
}
```

### 3. Audio Playback Modal

#### Features
- **Consistent UI**: Matches the existing audio modal design from interview-audio page
- **HTML5 Audio Player**: Primary playback method
- **Iframe Fallback**: Automatic fallback for CORS or playback issues
- **Error Handling**: Graceful error handling with alternative methods
- **External Access**: "Open in New Tab" button
- **Download Option**: "Download Audio" button
- **URL Display**: Shows the audio URL for debugging

#### Audio Player Logic
1. **Primary Method**: HTML5 `<audio>` element with autoplay
2. **Error Detection**: `onError` event handler
3. **Fallback**: Switch to iframe if HTML5 fails
4. **Alternative Access**: Always show external link and download options

### 4. Data Handling

#### Empty/Null Values
- Fields with `null` or empty values display as `-`
- Blank columns remain blank if data is not provided by API

#### Call Received Status
- `1` → "Yes"
- `0` → "No"
- Other/null → "-"

#### Duration Formatting
- Converts seconds to `MM:SS` format
- `null` values display as `-`
- Example: `125` seconds → `2:05`

#### DateTime Formatting
- Uses `toLocaleString` with 'en-IN' locale
- Format: "Jan 8, 2025, 10:30 AM"
- `null` values display as `-`

### 5. Pagination
- Server-side pagination
- Shows current page, total pages, and total records
- Displays "Showing X to Y of Z entries"
- Previous/Next navigation buttons
- Page number links

### 6. Error Handling
- **Network Errors**: Displays error alert with retry button
- **Auth Errors**: Shows authentication error message
- **API Errors**: Displays API error message
- **Audio Errors**: Automatic fallback to iframe

### 7. Responsive Design
- **Mobile**: Horizontal scroll for table
- **Tablet**: Optimized layout
- **Desktop**: Full table display
- **Modal**: Responsive audio player
- **Buttons**: Stack vertically on mobile

## Component Structure

```tsx
TelecallerDailyCallDetailsPage
├── State Management
│   ├── callDetails (array)
│   ├── pagination (object)
│   ├── loading (boolean)
│   ├── error (string | null)
│   ├── showAudioModal (boolean)
│   ├── currentAudio (string | null)
│   ├── audioError (boolean)
│   └── useIframe (boolean)
│
├── API Functions
│   └── fetchCallDetails(page)
│
├── Event Handlers
│   ├── handlePageChange(newPage)
│   ├── handlePlayAudio(audioUrl)
│   ├── handleCloseAudioModal()
│   └── handleAudioError()
│
├── Utility Functions
│   ├── formatDuration(seconds)
│   └── formatDateTime(dateTime)
│
└── UI Components
    ├── Header
    ├── Error Alert
    ├── Data Table
    ├── Pagination
    └── Audio Modal
        ├── Audio Player
        ├── Iframe Fallback
        ├── Action Buttons
        └── URL Display
```

## Usage

### Initial Load
1. Component mounts
2. Fetches call details for page 1
3. Displays data in table
4. Shows pagination controls

### Playing Audio
1. User clicks "Play" button
2. Modal opens with audio player
3. Audio auto-plays (if supported)
4. If playback fails, switches to iframe
5. User can open in new tab or download

### Pagination
1. User clicks page number or next/prev
2. Fetches new data for that page
3. Updates table and pagination info

### Error Recovery
1. Error occurs during fetch
2. Error alert displayed with retry button
3. User clicks retry
4. Re-fetches data for current page

## API Data Mapping

| API Field | Table Column | Format | Fallback |
|-----------|--------------|--------|----------|
| `caller_name` | Caller Name | String | "-" |
| `caller_id` | Caller ID | Number → String | "-" |
| `call_time` | Call Time | DateTime (locale) | "-" |
| `call_received` | Call Received | 0/1 → Yes/No | "-" |
| N/A | Caller Response | N/A | "-" |
| N/A | API Response | N/A | "-" |
| `ivr_duration` | IVR Duration | Seconds → MM:SS | "-" |
| `talk_duration` | Talk Duration | Seconds → MM:SS | "-" |
| `audio` | Audio file | Play Button | "-" |
| `id` | Update | Edit Button | Always shown |

## Future Enhancements

1. **Update Functionality**: Implement edit modal for updating call details
2. **Filters**: Add date range, caller, AC code filters
3. **Export**: Add CSV/Excel export functionality
4. **Search**: Implement search by caller name or phone
5. **Bulk Actions**: Select multiple records for bulk operations
6. **Real-time Updates**: WebSocket integration for live updates
7. **Audio Waveform**: Visual waveform for audio playback
8. **Call Statistics**: Summary cards showing call metrics

## Technical Details

### Dependencies
- React useState, useEffect hooks
- Container, Card, Heading, Table (with TableHeader, TableBody, TableRow, TableHead, TableCell), PaginationStandard, Alert, Button components
- localStorage for token management
- Environment variable for API base URL

### Table Implementation
The page uses the base Table component with manual row rendering:
```tsx
<Table responsive striped hover>
  <TableHeader>
    <TableRow>
      <TableHead>Column Name</TableHead>
      ...
    </TableRow>
  </TableHeader>
  <TableBody>
    {callDetails.map((detail) => (
      <TableRow key={detail.id}>
        <TableCell>{detail.caller_name}</TableCell>
        ...
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Performance
- Pagination reduces initial load
- Lazy loading of audio (only when modal opens)
- Efficient re-rendering with proper state management

### Accessibility
- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Screen reader friendly

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- HTML5 audio support
- Iframe fallback for legacy browsers
- Responsive design for all screen sizes

