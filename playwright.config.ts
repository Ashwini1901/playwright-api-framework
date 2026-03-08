import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Read TEST_ENV from command line, default to 'dev'
const env = process.env.TEST_ENV || 'dev';

// Load .env.staging or .env.dev if it exists
dotenv.config({ path: path.resolve(__dirname, `.env.${env}`) });

// Always load .env as fallback
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Temporary debug line — remove after fixing
console.log('BASE_URL:', process.env.BASE_URL);

export default defineConfig({

  testDir: './tests',
  timeout: 30_000,
  retries: 0,
  workers: 1,

  reporter: [
    ['list'],
    ['allure-playwright'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],

  use: {
    // Now reads from .env instead of being hardcoded
    baseURL: process.env.BASE_URL,

    extraHTTPHeaders: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  },
});