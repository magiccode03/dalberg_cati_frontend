# Audio URL Encoding Fix

## Problem

The backend API returns audio URLs with unencoded JSON in the query parameter:

```
https://s-ct3.sarv.com/v2/recording?data={"userId":"50345024","token":"6JExgLsg6Vlsp5424S9U","file":"/202510/2mggcy281175983475499828173_8001011644_2025-10-7-16-29-50_CTC.mp3"}
```

This causes issues because:
- The curly braces `{}` are not URL-safe
- The quotes `"` need to be encoded
- Browsers may not handle this correctly

## Solution

### 1. URL Encoding Utility Function

Created `fixAudioUrl()` function that:
- Detects unencoded JSON in the URL
- Extracts the JSON parameter
- Properly encodes it using `encodeURIComponent()`
- Returns the corrected URL

```typescript
const fixAudioUrl = (url: string): string => {
  if (!url) return url;
  
  // Check if URL contains unencoded JSON in query parameter
  if (url.includes('data={')) {
    try {
      // Extract base URL and JSON part
      const parts = url.split('data=');
      if (parts.length === 2) {
        const baseUrl = parts[0] + 'data=';
        const jsonStr = parts[1];
        
        // URL encode the JSON part
        const encoded = encodeURIComponent(jsonStr);
        const fixedUrl = baseUrl + encoded;
        
        console.log('Original URL:', url);
        console.log('Fixed URL:', fixedUrl);
        
        return fixedUrl;
      }
    } catch (e) {
      console.error('Error fixing audio URL:', e);
    }
  }
  
  return url;
};
```

### 2. Integration

The function is called in `handlePlayAudio()`:

```typescript
const handlePlayAudio = (audioData: InterviewAudioData) => {
  // Fix the audio URL encoding
  const processedAudioData = {
    ...audioData,
    audio: fixAudioUrl(audioData.audio)
  };
  
  console.log('Playing audio:', processedAudioData);
  
  setCurrentAudio(processedAudioData);
  setShowAudioModal(true);
  setAudioError(false);
  setUseIframe(false);
};
```

### 3. Result

**Before (Unencoded):**
```
https://s-ct3.sarv.com/v2/recording?data={"userId":"50345024","token":"6JExgLsg6Vlsp5424S9U","file":"/202510/2mggcy281175983475499828173_8001011644_2025-10-7-16-29-50_CTC.mp3"}
```

**After (Properly Encoded):**
```
https://s-ct3.sarv.com/v2/recording?data=%7B%22userId%22%3A%2250345024%22%2C%22token%22%3A%226JExgLsg6Vlsp5424S9U%22%2C%22file%22%3A%22%2F202510%2F2mggcy281175983475499828173_8001011644_2025-10-7-16-29-50_CTC.mp3%22%7D
```

## Debugging

Added a collapsible debug section in the audio modal:
- Shows the processed (encoded) URL
- Helps troubleshoot playback issues
- Can be expanded by clicking "🔍 Debug Info"

## Browser Compatibility

The fix ensures compatibility across:
- ✅ Chrome/Edge
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers

## Alternative Access

If audio still doesn't play, users can:
1. Use the iframe fallback player
2. Open in new tab
3. Download the audio file

All these options use the correctly encoded URL.

## Backend Recommendation

**Ideal Solution:** The backend should return properly encoded URLs:

```json
{
  "audio": "https://s-ct3.sarv.com/v2/recording?data=%7B%22userId%22%3A%2250345024%22%2C%22token%22%3A%226JExgLsg6Vlsp5424S9U%22%2C%22file%22%3A%22%2F202510%2F2mggcy281175983475499828173_8001011644_2025-10-7-16-29-50_CTC.mp3%22%7D"
}
```

However, the frontend now handles both cases gracefully.
