/**
 * Integration Test Suite for Portal Job Board
 * 
 * By default, this test suite connects to the test database.
 * To run these tests against production, you must:
 * 1. Set NODE_ENV=production
 * 2. Set ALLOW_PRODUCTION_TESTS=true
 * 3. Set USE_PRODUCTION_DB=true
 * 4. Have valid production database credentials in your .env file
 */

const logger = require('../../utils/logger');
const { startTestServer, stopTestServer } = require('./testServer');
const api = require('./testClient');
const { initializeTestMetrics, recordTestResult, generateReport } = require('./testUtils');

// Safety check function
const checkEnvironmentSafety = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const useProductionDb = process.env.USE_PRODUCTION_DB === 'true';
  
  if (isProduction && !process.env.ALLOW_PRODUCTION_TESTS) {
    throw new Error('Production tests are not allowed. Set ALLOW_PRODUCTION_TESTS=true to proceed');
  }

  if (useProductionDb) {
    if (!process.env.MONGO_URI_PROD || !process.env.MONGO_URI_PROD.includes('portal-jb')) {
      throw new Error('Invalid or missing production database URI');
    }
    console.warn('Running tests against production database. This is not recommended for regular testing.');
  } else {
    if (!process.env.MONGO_URI_DEV || !process.env.MONGO_URI_DEV.includes('test')) {
      throw new Error('Invalid or missing test database URI');
    }
    console.info('Running tests against test database');
  }
};

describe('Integration Tests', () => {
  beforeAll(async () => {
    // Safety checks
    checkEnvironmentSafety();
    
    // Initialize metrics
    initializeTestMetrics();
    
    // Start test server
    console.info('Starting test server...');
    await startTestServer();
    console.info('Test server started successfully');
  });

  afterAll(async () => {
    // Generate report
    generateReport();

    // Stop test server
    await stopTestServer();
    console.info('Test server stopped');
  });

  // Import and run test suites
  require('./auth.test');
  require('./contributor.test');
  require('./sponsor.test');
  require('./task.test');
  require('./skill.test');
  require('./submission.test');
}); 