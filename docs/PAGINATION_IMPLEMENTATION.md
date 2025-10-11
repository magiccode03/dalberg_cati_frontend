# Server-Side Pagination Implementation

## 🎯 **Overview**

Updated the CATI Interview Audio page to use **server-side pagination** instead of client-side pagination, following the API specification:

```bash
curl -X GET "http://localhost:4001/api/cati/interviews/ac-audio?page=2&limit=100" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔧 **Changes Made**

### **1. API Service Updates (`src/lib/api.ts`)**

#### **Enhanced ApiResponse Interface**
```typescript
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
```

#### **Updated getInterviewAudio Method**
```typescript
async getInterviewAudio(params?: { 
  page?: number; 
  limit?: number; 
  ac_code?: string; 
  interview_date?: string 
}): Promise<ApiResponse<Array<{
  id: number;
  ac_code: number;
  ac_name: string;
  audio: string;
  interview_date: string;
}>>> {
  const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
  return this.request(`/cati/interviews/ac-audio${queryString}`);
}
```

### **2. Frontend Updates (`src/app/cati/fd/interview-audio/page.tsx`)**

#### **Server-Side Pagination Parameters**
```typescript
const params: any = {
  page: currentPage,        // Current page number
  limit: itemsPerPage       // Items per page (50)
};

if (acCode) params.ac_code = acCode;
if (interviewDate) params.interview_date = interviewDate;
```

#### **Pagination Response Handling**
```typescript
// Handle pagination from API response
if (response.pagination) {
  setTotalItems(response.pagination.total);
  setTotalPages(response.pagination.totalPages);
} else {
  // Fallback to client-side calculation if no pagination info
  setTotalItems(response.data.length);
  setTotalPages(Math.ceil(response.data.length / itemsPerPage));
}
```

#### **Removed Client-Side Pagination**
```typescript
// Before: Client-side slicing
const paginatedData = interviewData.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);

// After: Direct API data
const paginatedData = interviewData;
```

### **3. Enhanced User Experience**

#### **Page Information Display**
```typescript
<div className="text-sm text-gray-600 dark:text-gray-400">
  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
</div>
```

#### **Smooth Page Navigation**
```typescript
const handlePageChange = (page: number) => {
  setCurrentPage(page);
  // Scroll to top when page changes
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
```

#### **Conditional Pagination Display**
```typescript
{totalPages > 1 && (
  <PaginationStandard
    currentPage={currentPage}
    totalPages={totalPages}
    totalItems={totalItems}
    itemsPerPage={itemsPerPage}
    onPageChange={handlePageChange}
  />
)}
```

## 📊 **API Request Format**

### **Request Parameters**
- `page`: Current page number (starts from 1)
- `limit`: Number of items per page (default: 50)
- `ac_code`: Filter by Assembly Constituency code (optional)
- `interview_date`: Filter by interview date (optional)

### **Example Requests**
```bash
# Page 1 with default limit
GET /api/cati/interviews/ac-audio?page=1&limit=50

# Page 2 with 100 items
GET /api/cati/interviews/ac-audio?page=2&limit=100

# Filtered by AC code
GET /api/cati/interviews/ac-audio?page=1&limit=50&ac_code=214

# Filtered by date
GET /api/cati/interviews/ac-audio?page=1&limit=50&interview_date=2025-10-07
```

## 🔄 **Expected API Response**

```json
{
  "success": true,
  "data": [
    {
      "id": 7585,
      "ac_code": 214,
      "ac_name": "Bhagabanpur",
      "audio": "https://s-ct3.sarv.com/v2/recording?data=...",
      "interview_date": "2025-10-07T11:01:03.000Z"
    }
  ],
  "pagination": {
    "page": 2,
    "limit": 100,
    "total": 500,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": true
  },
  "message": "Success",
  "timestamp": "2025-01-27T10:30:00.000Z"
}
```

## ✨ **Benefits**

### **1. Performance**
- ✅ **Faster Loading**: Only loads current page data
- ✅ **Reduced Memory**: No client-side data slicing
- ✅ **Better UX**: Smooth pagination with loading states

### **2. Scalability**
- ✅ **Large Datasets**: Handles thousands of records efficiently
- ✅ **Server Resources**: Reduces client-side processing
- ✅ **Network Optimization**: Smaller response payloads

### **3. User Experience**
- ✅ **Page Information**: Shows current position in dataset
- ✅ **Smooth Navigation**: Auto-scroll to top on page change
- ✅ **Loading States**: Clear feedback during page transitions

## 🧪 **Testing**

### **Test Cases**
1. **Page Navigation**: Click through different pages
2. **Filtering**: Test with AC code and date filters
3. **Edge Cases**: First page, last page, empty results
4. **Performance**: Large datasets with 100+ items per page

### **Expected Behavior**
- ✅ Page changes trigger new API calls
- ✅ Loading states show during transitions
- ✅ Row numbers update correctly
- ✅ Pagination controls work properly
- ✅ Filters reset to page 1

## 📝 **Backend Requirements**

The backend should return:
- ✅ **Pagination metadata** in response
- ✅ **Proper HTTP status codes**
- ✅ **Consistent data structure**
- ✅ **Error handling** for invalid page numbers

**The frontend is now fully optimized for server-side pagination!** 🚀
