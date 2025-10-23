# Table Card UI Reference Guide

This document provides a comprehensive reference for implementing consistent table card UI components across the application, based on the QC User Progress page implementation.

## Table Card Structure

### 1. Main Container
```tsx
<div className="main-content horizontal-content">
  <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto p-6 main-container">
    {/* Page Header */}
    <div className="mb-6">
      <Heading level={1} className="text-2xl font-semibold text-gray-900">
        Page Title
      </Heading>
    </div>

    {/* Table Card */}
    <Card className="">
      {/* Card Content */}
    </Card>
  </Container>
</div>
```

### 2. Card Header Section
```tsx
<Card className="">
  <div className="flex justify-between items-center mb-6">
    {/* Left Side - Title with Blue Accent */}
    <div className="flex items-center">
      <div className="w-1 h-6 bg-blue-600 mr-3"></div>
      <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
        Table Title
      </Heading>
    </div>
    
    {/* Right Side - Action Buttons */}
    <div className="flex items-center">
      <Button
        variant="primary"
        onClick={handleAction}
        className="flex items-center"
      >
        <Icon className="w-4 h-4 mr-2" />
        Action Text
      </Button>
    </div>
  </div>

  {/* Summary Info */}
  <div className="text-sm text-gray-600 dark:text-gray-400 my-2">
    Total <strong>{totalCount}</strong> items.
  </div>
</Card>
```

## Table Implementation

### 3. Table Container
```tsx
<div className="overflow-x-auto">
  <Table
    striped
    bordered
    hover
    className="w-full border-collapse"
  >
    {/* Table Content */}
  </Table>
</div>
```

### 4. Table Header
```tsx
<thead className="sticky-header bg-gray-50">
  <tr>
    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">
      Column Header
    </th>
    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">
      Left Aligned Header
    </th>
  </tr>
</thead>
```

### 5. Table Body
```tsx
<tbody className="bg-white divide-y divide-gray-200">
  {data.map((item, index) => (
    <tr key={`${item.id}-${index}`} className="hover:bg-gray-50">
      {/* Numeric/ID columns - Center aligned, monospace font */}
      <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900 text-center">
        {item.id}
      </td>
      
      {/* Text columns - Left aligned, regular font */}
      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
        {item.name || '-'}
      </td>
      
      {/* Numeric data - Center aligned, monospace, with formatting */}
      <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900 text-center">
        {item.value.toLocaleString()}
      </td>
    </tr>
  ))}
</tbody>
```

### 6. Table Footer with Pagination
```tsx
<div className="flex justify-between items-center mt-4 px-4 pb-4">
  {/* Left Side - Results Info */}
  <div className="text-sm text-gray-700">
    Showing <span className="font-semibold">{((currentPage - 1) * pageSize) + 1}</span> - 
    <span className="font-semibold">{Math.min(currentPage * pageSize, totalCount)}</span> of 
    <span className="font-semibold">{totalCount}</span> results.
  </div>
  
  {/* Right Side - Pagination */}
  {totalPages > 1 && (
    <div>
      <PaginationStandard
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalCount}
        itemsPerPage={pageSize}
        onPageChange={handlePageChange}
      />
    </div>
  )}
</div>
```

## Styling Guidelines

### Colors
- **Header Background**: `bg-gray-50`
- **Header Text**: `text-gray-800`
- **Row Background**: `bg-white`
- **Row Hover**: `hover:bg-gray-50`
- **Text Color**: `text-gray-900`
- **Secondary Text**: `text-gray-600` / `text-gray-400`
- **Accent Color**: `bg-blue-600` (for title accent bar)

### Typography
- **Page Title**: `text-2xl font-semibold text-gray-900`
- **Card Title**: `text-lg font-semibold text-gray-900 dark:text-white`
- **Header Text**: `text-sm font-semibold text-gray-800 uppercase tracking-wider`
- **Body Text**: `text-sm text-gray-900`
- **Monospace Text**: `text-sm font-mono text-gray-900` (for IDs, numbers)
- **Summary Text**: `text-sm text-gray-600 dark:text-gray-400`

### Spacing & Layout
- **Container Padding**: `p-6`
- **Card Margin Bottom**: `mb-6`
- **Header Margin Bottom**: `mb-6`
- **Cell Padding**: `px-4 py-4` (body), `px-4 py-3` (header)
- **Footer Margin Top**: `mt-4`
- **Footer Padding**: `px-4 pb-4`

### Alignment
- **Numeric/ID Columns**: `text-center`
- **Text Columns**: `text-left`
- **Headers**: `text-center` (default), `text-left` (for text columns)

### Special Elements
- **Title Accent Bar**: `w-1 h-6 bg-blue-600 mr-3`
- **Sticky Header**: `sticky-header` class
- **Row Dividers**: `divide-y divide-gray-200`
- **Hover Effects**: `hover:bg-gray-50`

## Dark Mode Support
- **Card Title**: `dark:text-white`
- **Summary Text**: `dark:text-gray-400`
- **Input Fields**: `dark:bg-gray-800 dark:border-gray-600 dark:text-white`

## Responsive Design
- **Container**: `max-w-9xl mx-auto` with responsive padding
- **Table**: `overflow-x-auto` for horizontal scrolling on mobile
- **Flex Layout**: `flex flex-wrap` for responsive filter sections

## Component Dependencies
- `Container` from `@/components/ui/Container`
- `Card` from `@/components/ui/Card`
- `Heading` from `@/components/ui/Heading`
- `Table` from `@/components/ui/Table`
- `Button` from `@/components/ui/Button`
- `PaginationStandard` from `@/components/ui/PaginationStandard`

## Example Implementation
```tsx
// Complete table card example
<Card className="">
  <div className="flex justify-between items-center mb-6">
    <div className="flex items-center">
      <div className="w-1 h-6 bg-blue-600 mr-3"></div>
      <Heading level={4} className="text-lg font-semibold text-gray-900 dark:text-white">
        Data Summary
      </Heading>
    </div>
    <div className="flex items-center">
      <Button variant="primary" onClick={handleDownload} className="flex items-center">
        <Download className="w-4 h-4 mr-2" />
        Download
      </Button>
    </div>
  </div>

  <div className="text-sm text-gray-600 dark:text-gray-400 my-2">
    Total <strong>{totalCount}</strong> items.
  </div>

  <div className="overflow-x-auto">
    <Table striped bordered hover className="w-full border-collapse">
      <thead className="sticky-header bg-gray-50">
        <tr>
          <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">
            ID
          </th>
          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">
            Name
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.map((item, index) => (
          <tr key={item.id} className="hover:bg-gray-50">
            <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900 text-center">
              {item.id}
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
              {item.name}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  </div>

  <div className="flex justify-between items-center mt-4 px-4 pb-4">
    <div className="text-sm text-gray-700">
      Showing <span className="font-semibold">1</span> - <span className="font-semibold">20</span> of <span className="font-semibold">100</span> results.
    </div>
    <PaginationStandard
      currentPage={1}
      totalPages={5}
      totalItems={100}
      itemsPerPage={20}
      onPageChange={handlePageChange}
    />
  </div>
</Card>
```

This reference ensures consistent table card UI implementation across all pages in the application.
