# West Bengal Assembly Constituencies Map

This test page demonstrates the integration of Google Maps with the West Bengal GeoJSON data (`wb.json`).

## Features

- **Interactive Map**: Display all 294 Assembly Constituencies of West Bengal
- **Search Functionality**: Search ACs by name, district, or code
- **Click Interactions**: Click on map polygons or sidebar items to select ACs
- **Hover Effects**: Visual feedback when hovering over map polygons
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode Support**: Full dark mode compatibility

## Setup Requirements

### 1. Google Maps API Key

You need to set up a Google Maps API key:

1. Go to [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Geocoding API (optional, for future features)
4. Create credentials (API Key)
5. Add the API key to your environment variables:

```bash
# Add to your .env.local file
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

### 2. API Restrictions (Recommended)

For security, restrict your API key:

1. **Application restrictions**: HTTP referrers
   - Add your domain: `yourdomain.com/*`
   - For development: `localhost:3000/*`

2. **API restrictions**: 
   - Maps JavaScript API
   - Geocoding API (if used)

## File Structure

```
src/app/test-map/
├── page.tsx              # Main map component
├── README.md            # This documentation
└── ...

src/app/api/capi/json/wb.json/
└── route.ts             # API route to serve GeoJSON data

src/app/capi/json/
└── wb.json              # West Bengal GeoJSON data (23MB)
```

## Usage

1. Navigate to `/test-map` in your application
2. The map will load with all AC boundaries
3. Use the search box to filter ACs
4. Click on map polygons or sidebar items to select ACs
5. View detailed information in the selected AC panel

## Technical Details

### Data Structure

The GeoJSON data contains:
- **AC_CODE**: Assembly Constituency code (1-294)
- **AC_NAME**: Constituency name
- **DISTRICT**: District name
- **PARLIAMENT**: Parliamentary constituency
- **Geometry**: Polygon coordinates defining boundaries

### Map Features

- **Polygon Rendering**: Each AC is rendered as a clickable polygon
- **Interactive Controls**: Zoom, pan, and map type controls
- **Custom Styling**: Blue color scheme with hover effects
- **Bounds Fitting**: Automatically fits map bounds to selected AC

### Performance Considerations

- **Large Dataset**: The GeoJSON file is 23MB, so loading may take a moment
- **Polygon Rendering**: All 294 polygons are rendered simultaneously
- **Memory Usage**: Consider implementing lazy loading for production use

## Future Enhancements

- **Data Overlay**: Overlay election results or demographic data
- **Clustering**: Group nearby ACs for better performance
- **Export Functionality**: Export map views or data
- **Print Support**: Generate printable maps
- **Mobile Optimization**: Touch gestures and mobile-specific features

## Troubleshooting

### Map Not Loading
- Check if Google Maps API key is set correctly
- Verify API key has proper permissions
- Check browser console for errors

### Data Not Loading
- Ensure the API route is accessible
- Check if `wb.json` file exists in the correct location
- Verify file permissions

### Performance Issues
- Consider reducing the number of visible polygons
- Implement data pagination or lazy loading
- Use map clustering for better performance

## Dependencies

- Google Maps JavaScript API
- React hooks (useState, useEffect, useRef)
- Tailwind CSS for styling
- Lucide React for icons
