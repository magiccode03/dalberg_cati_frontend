# CommonFilter Component

A reusable filter component for CATI pages that provides consistent filtering functionality across the application.

## Features

- **Multiple Field Types**: Text, Select, Date, Date Range, Number, Multi-select
- **Dynamic Options**: Load options from API endpoints
- **Conditional Fields**: Show/hide fields based on other field values
- **Flexible Layout**: Grid or flex layout options
- **Search & Clear**: Built-in search and clear functionality
- **Loading States**: Support for loading states and disabled states
- **Responsive Design**: Mobile-friendly responsive layout

## Basic Usage

```tsx
import CommonFilter, { FilterConfig, FilterField } from '@/components/common/CommonFilter';

const filterConfig: FilterConfig = {
  fields: [
    {
      key: 'search',
      label: 'Search',
      type: 'text',
      placeholder: 'Enter search term...'
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: '1', label: 'Active' },
        { value: '0', label: 'Inactive' }
      ]
    }
  ],
  onSearch: (filters) => console.log('Search:', filters),
  onClear: () => console.log('Cleared')
};

<CommonFilter config={filterConfig} />
```

## Field Types

### Text Field
```tsx
{
  key: 'search',
  label: 'Search',
  type: 'text',
  placeholder: 'Enter search term...',
  required: true
}
```

### Select Field
```tsx
{
  key: 'status',
  label: 'Status',
  type: 'select',
  placeholder: 'Select Status',
  options: [
    { value: '1', label: 'Active' },
    { value: '0', label: 'Inactive' }
  ],
  searchable: true,
  clearable: true
}
```

### Date Field
```tsx
{
  key: 'date',
  label: 'Date',
  type: 'date',
  required: true
}
```

### Date Range Field
```tsx
{
  key: 'reportDays',
  label: 'Report Days',
  type: 'dateRange',
  placeholder: 'Select Date Range',
  dateRangeFields: {
    from: 'dateFrom',
    to: 'dateTo'
  }
}
```

### Number Field
```tsx
{
  key: 'duration',
  label: 'Duration (minutes)',
  type: 'number',
  min: 0,
  max: 60,
  step: 1
}
```

### Multi-select Field
```tsx
{
  key: 'categories',
  label: 'Categories',
  type: 'multiselect',
  options: [
    { value: 'cat1', label: 'Category 1' },
    { value: 'cat2', label: 'Category 2' }
  ]
}
```

## Dynamic Options from API

```tsx
{
  key: 'qcUserId',
  label: 'QC User',
  type: 'select',
  placeholder: 'Select QC User',
  apiConfig: {
    endpoint: '/qc-user-registration',
    dataPath: 'data',
    valueField: 'id',
    labelField: 'name',
    params: { status: '1', limit: '1000' }
  }
}
```

## Conditional Fields

```tsx
{
  key: 'customDate',
  label: 'Custom Date',
  type: 'date',
  showWhen: {
    field: 'reportDays',
    value: 'custom'
  }
}
```

## Configuration Options

### FilterConfig Interface

```tsx
interface FilterConfig {
  fields: FilterField[];
  layout?: 'grid' | 'flex';
  columns?: number;
  showSearchButton?: boolean;
  showClearButton?: boolean;
  searchButtonText?: string;
  clearButtonText?: string;
  searchButtonIcon?: React.ReactNode;
  clearButtonIcon?: React.ReactNode;
  onSearch?: (filters: Record<string, any>) => void;
  onClear?: () => void;
  onFilterChange?: (key: string, value: any) => void;
  className?: string;
  cardClassName?: string;
}
```

### FilterField Interface

```tsx
interface FilterField {
  key: string;
  label: string;
  type: FilterFieldType;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  required?: boolean;
  disabled?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  maxHeight?: number;
  min?: number;
  max?: number;
  step?: number;
  dateRangeFields?: {
    from: string;
    to: string;
  };
  showWhen?: {
    field: string;
    value: string | string[];
  };
  apiConfig?: {
    endpoint: string;
    dataPath: string;
    valueField: string;
    labelField: string;
    params?: Record<string, string>;
  };
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `config` | `FilterConfig` | - | Filter configuration object |
| `defaultValues` | `DefaultFilters` | `{}` | Default filter values |
| `loading` | `boolean` | `false` | Loading state |
| `disabled` | `boolean` | `false` | Disabled state |

## Examples

### Basic Filter
```tsx
const basicConfig: FilterConfig = {
  fields: [
    {
      key: 'search',
      label: 'Search',
      type: 'text',
      placeholder: 'Search...'
    }
  ],
  onSearch: (filters) => handleSearch(filters)
};
```

### Advanced Filter with API
```tsx
const advancedConfig: FilterConfig = {
  fields: [
    {
      key: 'reportDays',
      label: 'Report Days',
      type: 'dateRange',
      dateRangeFields: { from: 'dateFrom', to: 'dateTo' }
    },
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
  layout: 'grid',
  columns: 3,
  onSearch: handleSearch,
  onClear: handleClear
};
```

### Grid Layout
```tsx
const gridConfig: FilterConfig = {
  fields: [...],
  layout: 'grid',
  columns: 4
};
```

## Integration with Existing Pages

To integrate with existing pages, replace the current filter implementation:

1. **Remove existing filter JSX**
2. **Import CommonFilter**
3. **Define filter configuration**
4. **Replace with CommonFilter component**

### Before (Manual Implementation)
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  <div>
    <label>Search</label>
    <Input value={search} onChange={setSearch} />
  </div>
  <div>
    <label>Status</label>
    <SelectDropdown value={status} onChange={setStatus} options={statusOptions} />
  </div>
  <Button onClick={handleSearch}>Search</Button>
  <Button onClick={handleClear}>Clear</Button>
</div>
```

### After (CommonFilter)
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

## Common Patterns

### Date Range with Custom Dates
```tsx
{
  key: 'reportDays',
  label: 'Report Days',
  type: 'dateRange',
  dateRangeFields: { from: 'dateFrom', to: 'dateTo' }
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
