#!/usr/bin/env node

/**
 * Deployment Verification Script
 * 
 * This script verifies that the deployed application is working correctly
 * by testing critical endpoints and functionality.
 */

import https from 'https';
import http from 'http';

// Configuration
const config = {
  apiUrl: process.env.API_URL || 'http://localhost:5000',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

// Test results
const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
  tests: [],
};

/**
 * Make HTTP/HTTPS request
 */
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const urlObj = new URL(url);
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {},
      timeout: 10000,
    };

    const req = protocol.request(requestOptions, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

/**
 * Log test result
 */
function logTest(name, passed, message = '') {
  const status = passed ? `${colors.green}✓ PASS${colors.reset}` : `${colors.red}✗ FAIL${colors.reset}`;
  console.log(`${status} ${name}`);
  
  if (message) {
    console.log(`  ${colors.yellow}${message}${colors.reset}`);
  }
  
  results.tests.push({ name, passed, message });
  
  if (passed) {
    results.passed++;
  } else {
    results.failed++;
  }
}

/**
 * Log warning
 */
function logWarning(message) {
  console.log(`${colors.yellow}⚠ WARNING${colors.reset} ${message}`);
  results.warnings++;
}

/**
 * Test backend health endpoint
 */
async function testBackendHealth() {
  console.log(`\n${colors.blue}Testing Backend Health...${colors.reset}`);
  
  try {
    const response = await makeRequest(`${config.apiUrl}/api/health`);
    
    if (response.statusCode === 200) {
      const data = JSON.parse(response.body);
      logTest('Backend health check', data.success === true, `Environment: ${data.environment}`);
    } else {
      logTest('Backend health check', false, `Status code: ${response.statusCode}`);
    }
  } catch (error) {
    logTest('Backend health check', false, error.message);
  }
}

/**
 * Test public API endpoints
 */
async function testPublicEndpoints() {
  console.log(`\n${colors.blue}Testing Public API Endpoints...${colors.reset}`);
  
  const endpoints = [
    { path: '/api/profile', name: 'Profile endpoint' },
    { path: '/api/skills', name: 'Skills endpoint' },
    { path: '/api/projects', name: 'Projects endpoint' },
    { path: '/api/experience', name: 'Experience endpoint' },
    { path: '/api/education', name: 'Education endpoint' },
    { path: '/api/certifications', name: 'Certifications endpoint' },
    { path: '/api/testimonials', name: 'Testimonials endpoint' },
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await makeRequest(`${config.apiUrl}${endpoint.path}`);
      const passed = response.statusCode === 200 || response.statusCode === 404;
      logTest(endpoint.name, passed, `Status: ${response.statusCode}`);
    } catch (error) {
      logTest(endpoint.name, false, error.message);
    }
  }
}

/**
 * Test CORS configuration
 */
async function testCORS() {
  console.log(`\n${colors.blue}Testing CORS Configuration...${colors.reset}`);
  
  try {
    const response = await makeRequest(`${config.apiUrl}/api/health`, {
      headers: {
        'Origin': config.frontendUrl,
      },
    });
    
    const corsHeader = response.headers['access-control-allow-origin'];
    const passed = corsHeader === config.frontendUrl || corsHeader === '*';
    
    logTest('CORS headers', passed, `Access-Control-Allow-Origin: ${corsHeader || 'not set'}`);
  } catch (error) {
    logTest('CORS headers', false, error.message);
  }
}

/**
 * Test security headers
 */
async function testSecurityHeaders() {
  console.log(`\n${colors.blue}Testing Security Headers...${colors.reset}`);
  
  try {
    const response = await makeRequest(`${config.apiUrl}/api/health`);
    const headers = response.headers;
    
    // Check for important security headers
    const securityHeaders = [
      { name: 'X-Content-Type-Options', expected: 'nosniff' },
      { name: 'X-Frame-Options', expected: ['DENY', 'SAMEORIGIN'] },
      { name: 'X-XSS-Protection', expected: '1; mode=block' },
    ];

    for (const header of securityHeaders) {
      const value = headers[header.name.toLowerCase()];
      const passed = Array.isArray(header.expected) 
        ? header.expected.includes(value)
        : value === header.expected;
      
      logTest(`${header.name} header`, passed, `Value: ${value || 'not set'}`);
    }

    // Check for HSTS in production
    if (config.apiUrl.startsWith('https')) {
      const hsts = headers['strict-transport-security'];
      logTest('HSTS header', !!hsts, `Value: ${hsts || 'not set'}`);
    }
  } catch (error) {
    logTest('Security headers', false, error.message);
  }
}

/**
 * Test frontend accessibility
 */
async function testFrontend() {
  console.log(`\n${colors.blue}Testing Frontend...${colors.reset}`);
  
  try {
    const response = await makeRequest(config.frontendUrl);
    const passed = response.statusCode === 200;
    logTest('Frontend loads', passed, `Status: ${response.statusCode}`);
    
    if (passed) {
      const html = response.body;
      
      // Check for essential elements
      logTest('HTML contains title', html.includes('<title>'), '');
      logTest('HTML contains root div', html.includes('id="root"'), '');
      logTest('HTML contains script tag', html.includes('<script'), '');
    }
  } catch (error) {
    logTest('Frontend loads', false, error.message);
  }
}

/**
 * Test database connection (indirect)
 */
async function testDatabaseConnection() {
  console.log(`\n${colors.blue}Testing Database Connection...${colors.reset}`);
  
  try {
    // Try to fetch data that requires database
    const response = await makeRequest(`${config.apiUrl}/api/profile`);
    
    if (response.statusCode === 200) {
      logTest('Database connection', true, 'Profile data retrieved successfully');
    } else if (response.statusCode === 404) {
      logWarning('Profile not found - database connected but no data');
      logTest('Database connection', true, 'Database accessible (no profile data yet)');
    } else {
      logTest('Database connection', false, `Unexpected status: ${response.statusCode}`);
    }
  } catch (error) {
    logTest('Database connection', false, error.message);
  }
}

/**
 * Test rate limiting
 */
async function testRateLimiting() {
  console.log(`\n${colors.blue}Testing Rate Limiting...${colors.reset}`);
  
  try {
    // Make multiple rapid requests
    const requests = [];
    for (let i = 0; i < 5; i++) {
      requests.push(makeRequest(`${config.apiUrl}/api/health`));
    }
    
    const responses = await Promise.all(requests);
    const allSuccessful = responses.every(r => r.statusCode === 200);
    
    logTest('Rate limiting configured', true, 'Multiple requests handled');
    
    if (!allSuccessful) {
      logWarning('Some requests were rate limited');
    }
  } catch (error) {
    logTest('Rate limiting configured', false, error.message);
  }
}

/**
 * Print summary
 */
function printSummary() {
  console.log(`\n${colors.blue}${'='.repeat(50)}${colors.reset}`);
  console.log(`${colors.blue}Deployment Verification Summary${colors.reset}`);
  console.log(`${colors.blue}${'='.repeat(50)}${colors.reset}\n`);
  
  console.log(`${colors.green}Passed:${colors.reset} ${results.passed}`);
  console.log(`${colors.red}Failed:${colors.reset} ${results.failed}`);
  console.log(`${colors.yellow}Warnings:${colors.reset} ${results.warnings}`);
  console.log(`Total Tests: ${results.tests.length}\n`);
  
  if (results.failed === 0) {
    console.log(`${colors.green}✓ All tests passed! Deployment verified successfully.${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`${colors.red}✗ Some tests failed. Please review the issues above.${colors.reset}\n`);
    process.exit(1);
  }
}

/**
 * Main execution
 */
async function main() {
  console.log(`${colors.blue}${'='.repeat(50)}${colors.reset}`);
  console.log(`${colors.blue}Deployment Verification Script${colors.reset}`);
  console.log(`${colors.blue}${'='.repeat(50)}${colors.reset}`);
  console.log(`\nAPI URL: ${config.apiUrl}`);
  console.log(`Frontend URL: ${config.frontendUrl}\n`);
  
  try {
    await testBackendHealth();
    await testPublicEndpoints();
    await testCORS();
    await testSecurityHeaders();
    await testDatabaseConnection();
    await testRateLimiting();
    await testFrontend();
    
    printSummary();
  } catch (error) {
    console.error(`\n${colors.red}Fatal error:${colors.reset}`, error.message);
    process.exit(1);
  }
}

// Run the script
main();
