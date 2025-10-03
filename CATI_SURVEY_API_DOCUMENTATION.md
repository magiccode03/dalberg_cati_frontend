# CATI Survey API Documentation
## West Bengal Opinion Poll 2025

### Overview
This document provides comprehensive API documentation for the CATI (Computer-Assisted Telephone Interview) survey system. It includes APIs for saving form data, listing surveys, retrieving details, and managing AC codes.

---

## 📋 Table of Contents

1. [Authentication](#authentication)
2. [Save Form Data API](#save-form-data-api)
3. [List Surveys API](#list-surveys-api)
4. [Survey Detail API](#survey-detail-api)
5. [AC Code Management APIs](#ac-code-management-apis)
6. [Data Transformation](#data-transformation)
7. [Error Handling](#error-handling)
8. [Response Formats](#response-formats)

---

## 🔐 Authentication

All APIs require JWT authentication in the header:
```http
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

---

## 💾 Save Form Data API

### Endpoint
```http
POST /api/cati/survey/save
```

### Request Body

#### Complete Form Data Structure
```json
{
  // =====================================================
  // IDENTIFICATION DATA (Section 1)
  // =====================================================
  "ac_code": "123",
  "ac_name": "Kolkata North",
  "pc_name": "Kolkata North",
  "pc_code": "PC001",
  "district_name": "Kolkata",
  "district_code": "D001",
  "region_name": "South Bengal",
  "region_code": "R001",
  "mla_name": "John Doe",
  "mp_name": "Jane Smith",
  
  // =====================================================
  // CALL STATUS & METADATA
  // =====================================================
  "number_status": "1",
  "call_not_ring": "2",
  "call_ring_status": "1",
  "q_call_status": "1",
  "call_reschedule": "2024-12-25T10:00:00",
  "telecaller_name": "Telecaller Name",
  "callid": "CALL123456",
  
  // =====================================================
  // SECTION 2: CONSENT
  // =====================================================
  "consent": "1",
  
  // =====================================================
  // SECTION 3: BASIC DEMOGRAPHICS
  // =====================================================
  "resp_age": "25",
  "resp_registered_voter": "1",
  "resp_gender": "1",
  
  // =====================================================
  // SECTION 4: PARTY PREFERENCES
  // =====================================================
  "q5": "1",
  "q5_oth": "",
  "q5_ind": "",
  "q6": "2",
  "q6_oth": "",
  "q6_ind": "",
  "q7": "1",
  "q7_oth": "",
  "q7_ind": "",
  "q8": "3",
  "q8_oth": "",
  "q8_ind": "",
  "q9": "2",
  "q9_oth": "",
  "q9_ind": "",
  
  // =====================================================
  // MULTI-SELECT QUESTIONS (Arrays)
  // =====================================================
  "q10": ["1", "3", "5"],
  "q10_oth": "",
  "q11": ["1", "2", "4"],
  "q11_oth": "",
  "q12": ["1", "3", "5"],
  "q12_oth": "",
  "q13": ["1", "2", "3"],
  "q13_oth": "",
  
  // =====================================================
  // SECTION 5: SATISFACTION & APPROVAL RATINGS
  // =====================================================
  "q14": "3",
  "q15": "2",
  "q16_a": "4",
  "q16_b": "3",
  "q17": "1",
  "q17_oth": "",
  "q19": "2",
  "q19_oth": "",
  
  // =====================================================
  // SECTION 6: DEMOGRAPHICS
  // =====================================================
  "resp_religion": "1",
  "resp_religion_oth": "",
  "resp_social_cat": "3",
  "resp_caste_jati": "15",
  "resp_caste_jati_oth": "",
  "resp_female_edu": "5",
  "resp_male_edu": "6",
  "resp_occupation": "4",
  "thanks_future": "1",
  
  // =====================================================
  // METADATA
  // =====================================================
  "time": 1200,
  "final_submit": 1,
  "user_timezone": "Asia/Kolkata",
  "user_localdatetime": "2024-12-24 15:30:00",
  "language_used": "english"
}
```

### Response

#### Success Response (201 Created)
```json
{
  "success": true,
  "data": {
    "id": 12345,
    "survey_id": "SURVEY_2024_12345",
    "status": "completed",
    "created_at": "2024-12-24T10:00:00.000Z",
    "updated_at": "2024-12-24T10:20:00.000Z"
  },
  "message": "Survey data saved successfully",
  "timestamp": "2024-12-24T10:20:00.123Z"
}
```

#### Validation Error Response (400 Bad Request)
```json
{
  "success": false,
  "error": "Validation failed",
  "message": "Required field missing: resp_age",
  "details": [
    {
      "field": "resp_age",
      "message": "Age is required when consent is given",
      "code": "REQUIRED_FIELD"
    }
  ],
  "timestamp": "2024-12-24T10:20:00.123Z"
}
```

#### Server Error Response (500 Internal Server Error)
```json
{
  "success": false,
  "error": "Internal server error",
  "message": "Failed to save survey data",
  "timestamp": "2024-12-24T10:20:00.123Z"
}
```

---

## 📋 List Surveys API

### Endpoint
```http
GET /api/cati/survey/list
```

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | integer | No | Page number (default: 1) |
| `limit` | integer | No | Items per page (default: 10, max: 100) |
| `status` | string | No | Filter by status (pending, completed, rejected, in_progress, dropped, rescheduled) |
| `ac_code` | string | No | Filter by Assembly Constituency code |
| `teleform_user_id` | integer | No | Filter by telecaller ID |
| `date_from` | string | No | Filter from date (YYYY-MM-DD) |
| `date_to` | string | No | Filter to date (YYYY-MM-DD) |
| `search` | string | No | Search in phone, name, or callid |
| `agency_id` | integer | No | Filter by agency ID |

### Example Request
```http
GET /api/cati/survey/list?page=1&limit=20&status=completed&ac_code=123&date_from=2024-12-01&date_to=2024-12-31
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

### Response

#### Success Response (200 OK)
```json
{
  "success": true,
  "data": {
    "surveys": [
      {
        "id": 12345,
        "survey_id": "SURVEY_2024_12345",
        "ac_code": "123",
        "ac_name": "Kolkata North",
        "phone": "9876543210",
        "name": "John Doe",
        "teleform_user_id": 5,
        "telecaller_name": "Telecaller Name",
        "status": "completed",
        "call_attempt": 2,
        "survey_duration": 1200,
        "language_used": "english",
        "created_at": "2024-12-24T10:00:00.000Z",
        "updated_at": "2024-12-24T10:20:00.000Z",
        "qc_status": "pending"
      },
      {
        "id": 12346,
        "survey_id": "SURVEY_2024_12346",
        "ac_code": "124",
        "ac_name": "Kolkata South",
        "phone": "9876543211",
        "name": "Jane Smith",
        "teleform_user_id": 6,
        "telecaller_name": "Another Telecaller",
        "status": "in_progress",
        "call_attempt": 1,
        "survey_duration": 600,
        "language_used": "bengali",
        "created_at": "2024-12-24T11:00:00.000Z",
        "updated_at": "2024-12-24T11:10:00.000Z",
        "qc_status": "pending"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8,
      "hasNext": true,
      "hasPrev": false
    },
    "filters": {
      "status_counts": {
        "completed": 120,
        "pending": 15,
        "in_progress": 8,
        "rejected": 5,
        "dropped": 2
      }
    }
  },
  "message": "Surveys retrieved successfully",
  "timestamp": "2024-12-24T10:20:00.123Z"
}
```

---

## 🔍 Survey Detail API

### Endpoint
```http
GET /api/cati/survey/detail/{survey_id}
```

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `survey_id` | integer | Yes | Survey ID |

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `include_qc` | boolean | No | Include QC data (default: false) |
| `include_metadata` | boolean | No | Include metadata (default: true) |

### Example Request
```http
GET /api/cati/survey/detail/12345?include_qc=true&include_metadata=true
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

### Response

#### Success Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": 12345,
    "survey_id": "SURVEY_2024_12345",
    
    // =====================================================
    // BASIC INFORMATION
    // =====================================================
    "survey_data_id": 1,
    "agency_id": 1,
    "supervisor_id": 3,
    "teleform_user_id": 5,
    "telecaller_name": "Telecaller Name",
    "generate_date": "2024-12-24",
    "track": 1,
    "calling_group": 1,
    "priority": 0,
    "status": "completed",
    
    // =====================================================
    // IDENTIFICATION
    // =====================================================
    "ac_code": "123",
    "ac_name": "Kolkata North",
    "pc_code": "PC001",
    "pc_name": "Kolkata North",
    "district_code": "D001",
    "district_name": "Kolkata",
    "region_code": "R001",
    "region_name": "South Bengal",
    "mla_name": "John Doe",
    "mp_name": "Jane Smith",
    "part_no": 15,
    "phone": "9876543210",
    "name": "John Doe",
    
    // =====================================================
    // CALL METADATA
    // =====================================================
    "call_attempt": 2,
    "call_received": 1,
    "call_date": "2024-12-24",
    "callid": "CALL123456",
    "starttime": 1703419200,
    "endtime": 1703420400,
    "survey_complete_date": "2024-12-24T10:20:00.000Z",
    "survey_duration": 1200,
    
    // =====================================================
    // CALL FLOW
    // =====================================================
    "q_call_status": 1,
    "q_consent": 1,
    "q_interview_status": 1,
    
    // =====================================================
    // BASIC DEMOGRAPHICS
    // =====================================================
    "q_age": 25,
    "q_locality": 1,
    "q_register_voter": 1,
    "q_gender": 1,
    
    // =====================================================
    // PARTY PREFERENCES (Transformed)
    // =====================================================
    "party_preferences": {
      "q5_2021_mla": {
        "selected": "1",
        "selected_label": "AITC",
        "other_text": "",
        "independent_text": ""
      },
      "q6_2024_mp": {
        "selected": "2",
        "selected_label": "BJP",
        "other_text": "",
        "independent_text": ""
      },
      "q7_byelection": {
        "selected": "1",
        "selected_label": "AITC",
        "other_text": "",
        "independent_text": ""
      },
      "q8_tomorrow": {
        "selected": "3",
        "selected_label": "INC"
      },
      "q9_second_choice": {
        "selected": "2",
        "selected_label": "BJP"
      }
    },
    
    // =====================================================
    // MULTI-SELECT RESPONSES (Transformed)
    // =====================================================
    "multi_select_responses": {
      "q10_reasons": {
        "selected": ["1", "3", "5"],
        "selected_labels": ["Party manifesto/agenda", "Local candidate", "Party's state leadership"],
        "other_text": ""
      },
      "q11_aitc_reasons": {
        "selected": ["1", "2", "4"],
        "selected_labels": ["Mamata Banerjee leadership", "Welfare schemes", "Development work"],
        "other_text": ""
      },
      "q12_bjp_reasons": {
        "selected": ["1", "3", "5"],
        "selected_labels": ["Modi leadership", "National security", "Hindu identity"],
        "other_text": ""
      },
      "q13_issues": {
        "selected": ["1", "2", "3"],
        "selected_labels": ["Unemployment", "Inflation/Price rise", "Education"],
        "other_text": ""
      }
    },
    
    // =====================================================
    // SATISFACTION RATINGS
    // =====================================================
    "satisfaction_ratings": {
      "q14_state_govt": {
        "rating": "3",
        "label": "Neither satisfied nor dissatisfied"
      },
      "q15_bjp_opposition": {
        "rating": "2",
        "label": "Somewhat satisfied"
      },
      "q16_a_mp": {
        "rating": "4",
        "label": "Somewhat dissatisfied"
      },
      "q16_b_mla": {
        "rating": "3",
        "label": "Neither satisfied nor dissatisfied"
      },
      "q17_best_cm": {
        "selected": "1",
        "label": "Mamata Banerjee",
        "other_text": ""
      },
      "q19_win_prediction": {
        "selected": "2",
        "label": "BJP",
        "other_text": ""
      }
    },
    
    // =====================================================
    // DEMOGRAPHICS
    // =====================================================
    "demographics": {
      "religion": {
        "code": "1",
        "label": "Hindu",
        "other_text": ""
      },
      "social_category": {
        "code": "3",
        "label": "OBC"
      },
      "caste_jati": {
        "code": "15",
        "label": "Specific Caste Name",
        "other_text": ""
      },
      "female_education": {
        "code": "5",
        "label": "Higher Secondary"
      },
      "male_education": {
        "code": "6",
        "label": "Graduate"
      },
      "occupation": {
        "code": "4",
        "label": "Labour (other than agriculture)"
      },
      "future_contact": {
        "code": "1",
        "label": "Yes"
      }
    },
    
    // =====================================================
    // QC DATA (if requested)
    // =====================================================
    "qc_data": {
      "qc_teleform_user_id": 10,
      "qc_user_name": "QC User Name",
      "qc": 1,
      "qc_assign_date": "2024-12-25",
      "qc_complete_date": "2024-12-25T14:30:00.000Z",
      "qc_status": "approved",
      "qc_checks": {
        "qc_q_intro": 1,
        "qc_q12": 1,
        "qc_q11": 1,
        "qc_q16": 1,
        "qc_q14": 1,
        "qc_q28": 1
      },
      "qc_remark": 1
    },
    
    // =====================================================
    // METADATA
    // =====================================================
    "metadata": {
      "language_used": "english",
      "user_timezone": "Asia/Kolkata",
      "user_localdatetime": "2024-12-24 15:30:00",
      "weight": "1.00000",
      "non_weight": 1,
      "cloud_api_id": 0,
      "calling_request_id": null
    },
    
    // =====================================================
    // AUDIT FIELDS
    // =====================================================
    "audit": {
      "created_at": 1703419200,
      "created_by": 5,
      "updated_at": 1703420400,
      "updated_by": 5
    }
  },
  "message": "Survey details retrieved successfully",
  "timestamp": "2024-12-24T10:20:00.123Z"
}
```

---

## 🏛️ AC Code Management APIs

### 1. List AC Codes

#### Endpoint
```http
GET /api/cati/ac-codes
```

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | integer | No | Page number (default: 1) |
| `limit` | integer | No | Items per page (default: 50, max: 200) |
| `district_code` | string | No | Filter by district code |
| `region_code` | string | No | Filter by region code |
| `search` | string | No | Search in AC code or AC name |

#### Example Request
```http
GET /api/cati/ac-codes?page=1&limit=50&district_code=D001&search=Kolkata
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

#### Response
```json
{
  "success": true,
  "data": {
    "ac_codes": [
      {
        "ac_code": "123",
        "ac_name": "Kolkata North",
        "pc_code": "PC001",
        "pc_name": "Kolkata North",
        "district_code": "D001",
        "district_name": "Kolkata",
        "region_code": "R001",
        "region_name": "South Bengal",
        "mla_name": "John Doe",
        "mp_name": "Jane Smith",
        "part_count": 15,
        "is_active": true,
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-12-24T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 294,
      "totalPages": 6,
      "hasNext": true,
      "hasPrev": false
    }
  },
  "message": "AC codes retrieved successfully",
  "timestamp": "2024-12-24T10:20:00.123Z"
}
```

### 2. Get AC Code Detail

#### Endpoint
```http
GET /api/cati/ac-codes/{ac_code}
```

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ac_code` | string | Yes | Assembly Constituency code |

#### Example Request
```http
GET /api/cati/ac-codes/123
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

#### Response
```json
{
  "success": true,
  "data": {
    "ac_code": "123",
    "ac_name": "Kolkata North",
    "pc_code": "PC001",
    "pc_name": "Kolkata North",
    "district_code": "D001",
    "district_name": "Kolkata",
    "region_code": "R001",
    "region_name": "South Bengal",
    "mla_name": "John Doe",
    "mp_name": "Jane Smith",
    "part_count": 15,
    "is_active": true,
    "parts": [
      {
        "part_no": 1,
        "part_name": "Part 1",
        "booth_count": 150,
        "voter_count": 1200
      },
      {
        "part_no": 2,
        "part_name": "Part 2",
        "booth_count": 145,
        "voter_count": 1150
      }
    ],
    "survey_stats": {
      "total_surveys": 45,
      "completed": 38,
      "pending": 5,
      "rejected": 2
    },
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-12-24T10:00:00.000Z"
  },
  "message": "AC code details retrieved successfully",
  "timestamp": "2024-12-24T10:20:00.123Z"
}
```

### 3. Create/Update AC Code

#### Endpoint
```http
POST /api/cati/ac-codes
PUT /api/cati/ac-codes/{ac_code}
```

#### Request Body
```json
{
  "ac_code": "123",
  "ac_name": "Kolkata North",
  "pc_code": "PC001",
  "pc_name": "Kolkata North",
  "district_code": "D001",
  "district_name": "Kolkata",
  "region_code": "R001",
  "region_name": "South Bengal",
  "mla_name": "John Doe",
  "mp_name": "Jane Smith",
  "part_count": 15,
  "is_active": true
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "ac_code": "123",
    "ac_name": "Kolkata North",
    "pc_code": "PC001",
    "pc_name": "Kolkata North",
    "district_code": "D001",
    "district_name": "Kolkata",
    "region_code": "R001",
    "region_name": "South Bengal",
    "mla_name": "John Doe",
    "mp_name": "Jane Smith",
    "part_count": 15,
    "is_active": true,
    "created_at": "2024-12-24T10:00:00.000Z",
    "updated_at": "2024-12-24T10:00:00.000Z"
  },
  "message": "AC code saved successfully",
  "timestamp": "2024-12-24T10:20:00.123Z"
}
```

---

## 🔄 Data Transformation

### Frontend to Backend Mapping

#### 1. Checkbox Arrays to Multiple Columns

**Frontend:**
```json
{
  "q10": ["1", "3", "5"],
  "q10_oth": ""
}
```

**Backend Transformation:**
```javascript
// Initialize all columns to NULL
const q10Columns = {
  q7_3: null, q7_4: null, q7_5: null, q7_6: null, q7_7: null,
  q7_8: null, q7_10: null, q7_11: null, q7_12: null, q7_13: null,
  q7_44: null, q7_99: null, q7_other: null
};

// Map array values to columns
const mapping = {
  '1': 'q7_3',   // Party manifesto
  '2': 'q7_4',   // Track record
  '3': 'q7_5',   // Local candidate
  '4': 'q7_6',   // National leadership
  '5': 'q7_7',   // State leadership
  '6': 'q7_8',   // Caste/community
  '7': 'q7_10',  // Development
  '44': 'q7_44', // Others
  '99': 'q7_99'  // Don't know
};

formData.q10.forEach(value => {
  if (mapping[value]) {
    q10Columns[mapping[value]] = 1;
  }
});

// Result: q7_3=1, q7_5=1, q7_7=1 (others=NULL)
```

#### 2. Party Questions to Multi-column Split

**Frontend:**
```json
{
  "q5": "1",
  "q5_oth": "",
  "q5_ind": ""
}
```

**Backend Transformation:**
```javascript
const q5Mapping = {
  '1': 'q1_1',   // AITC
  '2': 'q1_2',   // BJP
  '3': 'q1_3',   // INC
  '4': 'q1_4',   // Left Front
  '55': 'q1_5',  // NOTA
  '44': 'q1_44'  // Others
};

const result = {
  q1_1: null, q1_2: null, q1_3: null, q1_4: null, q1_5: null, q1_44: null,
  q1_other: null
};

if (q5Mapping[formData.q5]) {
  result[q5Mapping[formData.q5]] = 1;
}

if (formData.q5 === '44' && formData.q5_oth) {
  result.q1_other = formData.q5_oth;
} else if (formData.q5 === '12' && formData.q5_ind) {
  result.q1_other = 'Independent: ' + formData.q5_ind;
}
```

#### 3. Direct Field Mappings

| Frontend Field | Backend Column | Transformation |
|---------------|----------------|----------------|
| `resp_age` | `q_age` | `parseInt(value)` |
| `consent` | `q_consent` | `parseInt(value)` |
| `q14` | `q6` | `parseInt(value)` |
| `q15` | `q8a` | `parseInt(value)` |
| `q16_a` | `q8b` | `parseInt(value)` |
| `q16_b` | `q8c` | `parseInt(value)` |
| `q17` | `q11` | `parseInt(value)` |
| `q19` | `q12` | `parseInt(value)` |
| `resp_religion` | `q_religion` | `parseInt(value)` |
| `resp_social_cat` | `q_social_category` | `parseInt(value)` |
| `resp_caste_jati` | `q_caste_jati` | `parseInt(value)` |
| `resp_female_edu` | `q_female_education` | `parseInt(value)` |
| `resp_male_edu` | `resp_education` | `parseInt(value)` |
| `resp_occupation` | `q_occupation` | `parseInt(value)` |
| `thanks_future` | `q_future_contact` | `parseInt(value)` |

---

## ❌ Error Handling

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `REQUIRED_FIELD` | 400 | Required field missing |
| `INVALID_VALUE` | 400 | Invalid field value |
| `UNAUTHORIZED` | 401 | Invalid or missing authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `DUPLICATE_ENTRY` | 409 | Duplicate record exists |
| `RATE_LIMITED` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |
| `DATABASE_ERROR` | 500 | Database operation failed |

### Error Response Format
```json
{
  "success": false,
  "error": "VALIDATION_ERROR",
  "message": "Request validation failed",
  "details": [
    {
      "field": "resp_age",
      "message": "Age must be between 10 and 99",
      "code": "INVALID_VALUE"
    },
    {
      "field": "q10",
      "message": "Maximum 3 selections allowed",
      "code": "INVALID_VALUE"
    }
  ],
  "timestamp": "2024-12-24T10:20:00.123Z"
}
```

---

## 📊 Response Formats

### Standard Success Response
```json
{
  "success": true,
  "data": { /* Response data */ },
  "message": "Operation completed successfully",
  "timestamp": "2024-12-24T10:20:00.123Z"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": {
    "items": [ /* Array of items */ ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8,
      "hasNext": true,
      "hasPrev": false
    }
  },
  "message": "Data retrieved successfully",
  "timestamp": "2024-12-24T10:20:00.123Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": "ERROR_CODE",
  "message": "Human readable error message",
  "details": [ /* Optional error details */ ],
  "timestamp": "2024-12-24T10:20:00.123Z"
}
```

---

## 🔧 Backend Implementation Notes

### 1. Data Validation
- Validate all required fields based on conditional logic
- Check age ranges (10-99)
- Validate checkbox array limits (max 3)
- Validate phone number format (10 digits)
- Validate email format if applicable

### 2. Database Operations
- Use transactions for data consistency
- Implement proper indexing for performance
- Handle concurrent access appropriately
- Use prepared statements for security

### 3. Security Considerations
- Validate and sanitize all input data
- Implement rate limiting
- Use proper authentication and authorization
- Log all operations for audit trail

### 4. Performance Optimization
- Implement caching for lookup data
- Use pagination for large datasets
- Optimize database queries
- Implement proper indexing

---

## 📝 API Testing Examples

### cURL Examples

#### Save Survey Data
```bash
curl -X POST "http://localhost:4001/api/cati/survey/save" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "ac_code": "123",
    "consent": "1",
    "resp_age": "25",
    "resp_gender": "1",
    "q5": "1",
    "q10": ["1", "3", "5"],
    "time": 1200,
    "final_submit": 1
  }'
```

#### List Surveys
```bash
curl -X GET "http://localhost:4001/api/cati/survey/list?page=1&limit=10&status=completed" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

#### Get Survey Detail
```bash
curl -X GET "http://localhost:4001/api/cati/survey/detail/12345?include_qc=true" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

#### Get AC Codes
```bash
curl -X GET "http://localhost:4001/api/cati/ac-codes?district_code=D001&search=Kolkata" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

## 🎯 Summary

This API documentation provides:

✅ **Complete form data structure** for saving surveys  
✅ **List and detail APIs** for survey management  
✅ **AC code management** APIs for geographic data  
✅ **Data transformation logic** for frontend-backend mapping  
✅ **Comprehensive error handling** with proper HTTP status codes  
✅ **Security considerations** and validation rules  
✅ **Performance optimization** guidelines  
✅ **Testing examples** with cURL commands  

**Ready for backend implementation!** 🚀
