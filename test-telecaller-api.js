// Test script for Telecaller Performance API endpoints
// Run with: node test-telecaller-api.js

const API_BASE_URL = 'http://localhost:4001';
const TEST_TOKEN = 'YOUR_JWT_TOKEN_HERE'; // Replace with actual token

async function testAPI(endpoint, description) {
  console.log(`\n🧪 Testing: ${description}`);
  console.log(`📍 Endpoint: ${endpoint}`);
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    
    const contentType = response.headers.get('content-type');
    console.log(`📄 Content-Type: ${contentType}`);

    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      console.log(`✅ Response:`, JSON.stringify(data, null, 2));
      
      if (data.success && data.data) {
        console.log(`📈 Metrics loaded: ${Object.keys(data.data).length} fields`);
        if (Array.isArray(data.data)) {
          console.log(`📅 Days of data: ${data.data.length}`);
        }
      }
    } else {
      const text = await response.text();
      console.log(`❌ Non-JSON response:`, text.substring(0, 200));
    }
  } catch (error) {
    console.log(`❌ Error:`, error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting Telecaller Performance API Tests');
  console.log('=' .repeat(50));

  // Test 1: Overall Performance (No Filters)
  await testAPI(
    '/api/cati/telecaller-performance',
    'Overall Performance Metrics (No Filters)'
  );

  // Test 2: Overall Performance with Telecaller Filter
  await testAPI(
    '/api/cati/telecaller-performance?teleform_user_id=1',
    'Overall Performance with Telecaller Filter'
  );

  // Test 3: Overall Performance with AC Filter
  await testAPI(
    '/api/cati/telecaller-performance?ac_code=12',
    'Overall Performance with AC Filter'
  );

  // Test 4: Day-wise Performance (Default 7 days)
  await testAPI(
    '/api/cati/telecaller-performance/daywise',
    'Day-wise Performance (Last 7 Days)'
  );

  // Test 5: Day-wise Performance with Filters
  await testAPI(
    '/api/cati/telecaller-performance/daywise?teleform_user_id=1&days=14',
    'Day-wise Performance with Telecaller Filter (14 days)'
  );

  // Test 6: Date Range Filter
  const today = new Date().toISOString().split('T')[0];
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  await testAPI(
    `/api/cati/telecaller-performance?start_date=${weekAgo}&end_date=${today}`,
    `Overall Performance with Date Range (${weekAgo} to ${today})`
  );

  console.log('\n' + '='.repeat(50));
  console.log('✅ API Testing Complete!');
  console.log('\n📋 Next Steps:');
  console.log('1. Replace YOUR_JWT_TOKEN_HERE with a valid token');
  console.log('2. Make sure backend server is running on http://localhost:4001');
  console.log('3. Verify database has data in cati_survey_calling_interview table');
  console.log('4. Check frontend dashboard at /cati/ppm/progress/telecaller-progress');
}

// Instructions for getting a valid token
console.log('🔑 To get a valid JWT token:');
console.log('1. Login to the application');
console.log('2. Open browser dev tools (F12)');
console.log('3. Go to Application/Storage tab');
console.log('4. Find localStorage and copy the "accessToken" value');
console.log('5. Replace YOUR_JWT_TOKEN_HERE in this script');
console.log('\n');

// Run the tests
runTests().catch(console.error);
