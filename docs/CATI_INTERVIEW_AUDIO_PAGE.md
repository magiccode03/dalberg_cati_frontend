# CATI Interview Audio Page

## Overview
This page allows Field Directors (FD) to view and listen to interview audio recordings from CATI surveys.

## Route
`/cati/fd/interview-audio`

## API Endpoint
```
GET http://localhost:4001/api/cati/interviews/ac-audio?limit=5000
```

### API Response Structure
```json
{
  "success": true,
  "data": [
    {
      "id": 7585,              // Server Token
      "ac_code": 214,          // AC Code
      "ac_name": "Bhagabanpur", // AC Name
      "audio": "https://...",   // Interview Audio URL
      "interview_date": "2025-10-07T11:01:03.000Z" // Interview Date
    }
  ]
}
```

## Features

### 1. **Search & Filter**
- **AC Code Filter**: Dropdown to filter by Assembly Constituency
- **Interview Date Filter**: Dropdown to filter by interview date
- **Search Button**: Triggers filtered data fetch

### 2. **Interview List Table**
Displays:
- Serial Number (auto-incremented)
- Server Token (Interview ID)
- AC Code
- AC Name
- Interview Date (formatted)
- Play button for audio

### 3. **Audio Player Modal**
When user clicks "Play" button:
- Opens modal popup
- Displays interview details:
  - Server Token
  - Interview Date
  - AC Code
  - AC Name
- **HTML5 Audio Player** with:
  - Play/Pause controls
  - Volume control
  - Progress bar
  - Auto-play on modal open
- Shows audio URL for reference
- Close button to dismiss modal

### 4. **Pagination**
- Client-side pagination
- 50 items per page
- Standard pagination controls

## Technical Implementation

### State Management
```typescript
const [acCode, setAcCode] = useState('');
const [interviewDate, setInterviewDate] = useState('');
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage] = useState(50);
const [interviewData, setInterviewData] = useState<InterviewAudioData[]>([]);
const [totalItems, setTotalItems] = useState(0);
const [totalPages, setTotalPages] = useState(0);
const [showAudioModal, setShowAudioModal] = useState(false);
const [currentAudio, setCurrentAudio] = useState<InterviewAudioData | null>(null);
```

### Key Functions

#### `fetchData()`
- Fetches interview audio data from API
- Applies AC code and date filters
- Extracts unique values for filter dropdowns
- Handles loading and error states

#### `handlePlayAudio(audioData)`
- Sets current audio data
- Opens audio player modal

#### `handleCloseModal()`
- Closes modal
- Clears current audio data

## UI Components Used
- `Container` - Page wrapper
- `Card` - Section containers
- `Heading` - Page and section titles
- `Table` - Data display
- `Button` - Actions (Search, Play, Close)
- `SelectDropdown` - Filter controls
- `PaginationStandard` - Page navigation

## Icons Used
- `Search` - Search button
- `Play` - Play audio button
- `X` - Close modal
- `Volume2` - Modal header icon

## Styling Features
- Responsive design
- Dark mode support
- Gradient background for audio player
- Modal with backdrop overlay
- Hover effects on buttons and table rows
- Loading spinner overlay

## Audio Player Configuration

### Primary Audio Player
```html
<audio
  controls
  className="w-full"
  controlsList="nodownload"
  preload="metadata"
  onError={handleAudioError}
>
  <source src={currentAudio.audio} type="audio/mpeg" />
  <source src={currentAudio.audio} type="audio/mp3" />
  Your browser does not support the audio element.
</audio>
```

### Fallback: Iframe Player
If the primary audio player fails (e.g., CORS issues), the system automatically switches to an iframe-based player:
```html
<iframe
  src={currentAudio.audio}
  className="w-full h-16 border-0 rounded"
  title="Audio Player"
  allow="autoplay"
/>
```

### Audio Features
- **Full controls**: Play, pause, volume, seek
- **Preload metadata**: Loads audio information before playing
- **Error handling**: Automatic fallback to iframe player on error
- **Multiple formats**: Supports both audio/mpeg and audio/mp3
- **Alternative access**: "Open in new tab" and "Download" options

### Audio Source Compatibility
The audio URLs come from an external service ([sarv.com](https://s-ct3.sarv.com)) and are verified working. The player handles:
- Cross-origin audio streaming
- URL-encoded query parameters
- Token-based authentication in URL

## Error Handling
- Network errors display error message with retry button
- Empty state when no data found
- Loading states during API calls

## Accessibility
- Semantic HTML
- Keyboard navigation support
- ARIA labels (via component defaults)
- Focus management in modal

## Future Enhancements
- Download audio option
- Playback speed control
- Audio waveform visualization
- Transcript display (if available)
- Quality control notes/ratings

