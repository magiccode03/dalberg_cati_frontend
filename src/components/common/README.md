# Common Filter Component for CATI Pages

This directory contains a reusable filter component designed specifically for CATI (Computer Assisted Telephone Interviewing) pages in the application.

## Files Overview

### 1. `CommonFilter.tsx`
The main reusable filter component that provides:
- Multiple field types (text, select, date, dateRange, number, multiselect)
- Dynamic options loading from API endpoints
- Conditional field display
- Flexible layout options (grid/flex)
- Built-in search and clear functionality
- Loading and disabled states
- Responsive design

### 2. `CommonFilterExample.tsx`
A comprehensive example showing how to use the CommonFilter component with various field types and configurations.

### 3. `CommonFilterTelecallerProgressExample.tsx`
A practical example demonstrating how to convert an existing page (telecaller-progress) to use the CommonFilter component.

### 4. `CommonFilter.md`
Detailed documentation explaining all features, configuration options, and usage patterns.

## Key Features

### Field Types Supported
- **Text**: Simple text input fields
- **Select**: Dropdown with searchable options
- **Date**: Date picker input
- **Date Range**: Predefined date ranges with custom date support
- **Number**: Numeric input with min/max/step validation
- **Multi-select**: Multiple selection dropdown

### Dynamic Options
- Load options from API endpoints
- Automatic data transformation
- Loading states for async operations
- Error handling

### Conditional Fields
- Show/hide fields based on other field values
- Support for single values or arrays
- Dynamic form behavior

### Layout Options
- **Grid Layout**: Responsive grid with configurable columns
- **Flex Layout**: Flexible horizontal layout
- Mobile-responsive design

## Usage Examples

### Basic Usage
```tsx
import CommonFilter, { FilterConfig } from '@/components/common/CommonFilter';

const config: FilterConfig = {
  fields: [
    {
      key: 'search',
      label: 'Search',
      type: 'text',
      placeholder: 'Enter search term...'
    }
  ],
  onSearch: (filters) => console.log('Search:', filters)
};

<CommonFilter config={config} />
```

### Advanced Usage with API
```tsx
const config: FilterConfig = {
  fields: [
    {
      key: 'qcUserId',
      label: 'QC User',
      type: 'select',
      apiConfig: {
        endpoint: '/qc-user-registration',
        dataPath: 'data',
        valueField: 'id',
        labelField: 'name',
        params: { status: '1', limit: '1000' }
      }
    }
  ],
  onSearch: handleSearch,
  onClear: handleClear
};
```

## Integration Steps

To integrate CommonFilter into existing pages:

1. **Import the component**:
   ```tsx
   import CommonFilter, { FilterConfig } from '@/components/common/CommonFilter';
   ```

2. **Define filter configuration**:
   ```tsx
   const filterConfig: FilterConfig = {
     fields: [
       // Define your filter fields
     ],
     onSearch: handleSearch,
     onClear: handleClear
   };
   ```

3. **Replace existing filter JSX**:
   ```tsx
   <CommonFilter config={filterConfig} />
   ```

4. **Handle search and clear events**:
   ```tsx
   const handleSearch = (filters: Record<string, any>) => {
     // Process filters and make API calls
   };

   const handleClear = () => {
     // Clear filters and reset data
   };
   ```

## Benefits

### For Developers
- **Consistency**: Standardized filter UI across all pages
- **Reusability**: Write once, use everywhere
- **Maintainability**: Centralized filter logic
- **Type Safety**: Full TypeScript support
- **Flexibility**: Highly configurable for different use cases

### For Users
- **Consistency**: Familiar interface across all pages
- **Responsiveness**: Works well on all screen sizes
- **Accessibility**: Proper labels and keyboard navigation
- **Performance**: Optimized rendering and API calls

## Common Patterns

### Date Range Filter
```tsx
{
  key: 'reportDays',
  label: 'Report Days',
  type: 'dateRange',
  dateRangeFields: {
    from: 'dateFrom',
    to: 'dateTo'
  }
}
```

### User Selection with API
```tsx
{
  key: 'userId',
  label: 'User',
  type: 'select',
  apiConfig: {
    endpoint: '/users',
    dataPath: 'data',
    valueField: 'id',
    labelField: 'name',
    params: { status: 'active' }
  }
}
```

### Conditional Field Display
```tsx
{
  key: 'customOption',
  label: 'Custom Option',
  type: 'text',
  showWhen: {
    field: 'type',
    value: 'custom'
  }
}
```

## Migration Guide

### From Manual Filter Implementation
1. Identify existing filter fields
2. Map them to CommonFilter field types
3. Configure API endpoints for dynamic options
4. Replace JSX with CommonFilter component
5. Update event handlers

### Example Migration
**Before**:
```tsx
<div className="grid grid-cols-4 gap-4">
  <Input value={search} onChange={setSearch} />
  <SelectDropdown value={status} onChange={setStatus} options={statusOptions} />
  <Button onClick={handleSearch}>Search</Button>
  <Button onClick={handleClear}>Clear</Button>
</div>
```

**After**:
```tsx
<CommonFilter
  config={{
    fields: [
      { key: 'search', label: 'Search', type: 'text' },
      { key: 'status', label: 'Status', type: 'select', options: statusOptions }
    ],
    onSearch: handleSearch,
    onClear: handleClear
  }}
/>
```

## Best Practices

1. **Use consistent field keys** across similar pages
2. **Provide meaningful labels** and placeholders
3. **Set appropriate default values** for better UX
4. **Use API configuration** for dynamic options
5. **Handle loading states** appropriately
6. **Test with different screen sizes** for responsive design
7. **Keep filter configurations** in separate files for reusability

## Future Enhancements

- **Advanced date picker** with calendar widget
- **Multi-level cascading selects** (e.g., State → District → AC)
- **Filter presets** and saved filter configurations
- **Export/import filter configurations**
- **Real-time search** with debouncing
- **Filter validation** and error handling
- **Accessibility improvements** (ARIA labels, keyboard navigation)

## Support

For questions or issues with the CommonFilter component:
1. Check the documentation in `CommonFilter.md`
2. Review the examples in `CommonFilterExample.tsx`
3. Look at practical implementations in `CommonFilterTelecallerProgressExample.tsx`
4. Contact the development team for assistance
