# Google Maps Test Page Setup Guide

## Quick Setup

### 1. Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Maps JavaScript API**
4. Create credentials (API Key)
5. Add the API key to your environment variables

### 2. Environment Configuration

Add this to your `.env.local` file:

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

### 3. Test the Implementation

1. Start your development server: `npm run dev`
2. Navigate to: `http://localhost:3000/test-map`
3. The map should load with all West Bengal Assembly Constituencies

## Features

- ✅ Interactive map with all 294 AC boundaries
- ✅ Search functionality (by name, district, or code)
- ✅ Click on map polygons or sidebar items to select ACs
- ✅ Hover effects on map polygons
- ✅ Responsive design with dark mode support
- ✅ Detailed AC information panel

## Troubleshooting

### Map Not Loading
- Check if `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set correctly
- Verify API key has Maps JavaScript API enabled
- Check browser console for errors

### Data Not Loading
- Ensure the API route `/api/capi/json/wb.json` is accessible
- Check if `wb.json` file exists in `src/app/capi/json/`
- Verify file permissions

### Performance Issues
- The GeoJSON file is 23MB, so initial loading may take a moment
- Consider implementing lazy loading for production use

## File Structure

```
src/app/test-map/
├── page.tsx              # Main map component
├── README.md            # Detailed documentation
├── SETUP.md             # This setup guide
└── ...

src/app/api/capi/json/wb.json/
└── route.ts             # API route to serve GeoJSON data

src/app/capi/json/
└── wb.json              # West Bengal GeoJSON data (23MB)
```

## Next Steps

- Add election data overlay
- Implement data visualization
- Add export functionality
- Optimize for production use
