#!/usr/bin/env node

/**
 * Test Runner for Tax Calculator
 * Runs comprehensive tests and generates a detailed report
 */

import * as fs from 'fs';
import * as path from 'path';

// Type definitions for test framework
interface TestCase {
  name: string;
  fn: () => void;
  describe: string;
}

interface DescribeBlock {
  name: string;
  tests: TestCase[];
}

interface TestResults {
  total: number;
  passed: number;
  failed: number;
  errors: Array<{ describe: string; error: string }>;
}

interface ExpectMatcher {
  toBe: (expected: any) => void;
  toEqual: (expected: any) => void;
  toBeCloseTo: (expected: number, precision?: number) => void;
  toBeGreaterThan: (expected: number) => void;
  toBeLessThan: (expected: number) => void;
  toThrow: () => void;
}

// Simple test framework implementation
class TestFramework {
  private tests: TestCase[] = [];
  private describes: DescribeBlock[] = [];
  private currentDescribe: DescribeBlock | null = null;
  private results: TestResults = {
    total: 0,
    passed: 0,
    failed: 0,
    errors: []
  };

  describe(name: string, fn: () => void): void {
    const previousDescribe = this.currentDescribe;
    this.currentDescribe = { name, tests: [] };
    this.describes.push(this.currentDescribe);

    try {
      fn();
    } catch (error: any) {
      this.results.errors.push({ describe: name, error: error.message });
    }

    this.currentDescribe = previousDescribe;
  }

  test(name: string, fn: () => void): void {
    const testCase: TestCase = { name, fn, describe: this.currentDescribe?.name || 'Global' };
    this.tests.push(testCase);
    if (this.currentDescribe) {
      this.currentDescribe.tests.push(testCase);
    }
  }

  expect(actual: any): ExpectMatcher {
    return {
      toBe: (expected: any): void => {
        if (actual !== expected) {
          throw new Error(`Expected ${expected}, but got ${actual}`);
        }
      },
      toBeCloseTo: (expected, precision = 2) => {
        const factor = Math.pow(10, precision);
        if (Math.round(actual * factor) !== Math.round(expected * factor)) {
          throw new Error(`Expected ${expected} (±${1/factor}), but got ${actual}`);
        }
      },
      toBeGreaterThan: (expected) => {
        if (actual <= expected) {
          throw new Error(`Expected ${actual} to be greater than ${expected}`);
        }
      },
      toBeLessThan: (expected) => {
        if (actual >= expected) {
          throw new Error(`Expected ${actual} to be less than ${expected}`);
        }
      }
    };
  }

  beforeEach(fn) {
    this.beforeEachFn = fn;
  }

  async runTests() {
    console.log('🧮 Running Tax Calculator Tests...\n');
    
    for (const test of this.tests) {
      this.results.total++;
      
      try {
        // Run beforeEach if defined
        if (this.beforeEachFn) {
          this.beforeEachFn();
        }
        
        await test.fn();
        this.results.passed++;
        console.log(`✅ ${test.describe} > ${test.name}`);
      } catch (error) {
        this.results.failed++;
        this.results.errors.push({
          describe: test.describe,
          test: test.name,
          error: error.message
        });
        console.log(`❌ ${test.describe} > ${test.name}`);
        console.log(`   Error: ${error.message}`);
      }
    }
    
    this.generateReport();
  }

  generateReport() {
    const passRate = ((this.results.passed / this.results.total) * 100).toFixed(1);
    
    console.log('\n' + '='.repeat(80));
    console.log('📊 TEST RESULTS SUMMARY');
    console.log('='.repeat(80));
    console.log(`Total Tests: ${this.results.total}`);
    console.log(`Passed: ${this.results.passed} ✅`);
    console.log(`Failed: ${this.results.failed} ❌`);
    console.log(`Pass Rate: ${passRate}%`);
    
    if (this.results.errors.length > 0) {
      console.log('\n❌ FAILED TESTS:');
      this.results.errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error.describe} > ${error.test || 'Setup'}`);
        console.log(`   ${error.error}`);
      });
    }
    
    // Generate detailed HTML report
    this.generateHTMLReport();
    
    console.log('\n📄 Detailed HTML report generated: test-report.html');
    console.log('='.repeat(80));
  }

  generateHTMLReport() {
    const testsByDescribe = {};
    
    this.tests.forEach(test => {
      if (!testsByDescribe[test.describe]) {
        testsByDescribe[test.describe] = [];
      }
      
      const error = this.results.errors.find(e => 
        e.describe === test.describe && e.test === test.name
      );
      
      testsByDescribe[test.describe].push({
        name: test.name,
        passed: !error,
        error: error?.error
      });
    });

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tax Calculator Test Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 2.5em; }
        .header p { margin: 10px 0 0 0; opacity: 0.9; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; padding: 30px; }
        .stat-card { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #007bff; }
        .stat-card.passed { border-left-color: #28a745; }
        .stat-card.failed { border-left-color: #dc3545; }
        .stat-number { font-size: 2em; font-weight: bold; margin-bottom: 5px; }
        .stat-label { color: #6c757d; font-size: 0.9em; }
        .test-section { margin: 20px 30px; }
        .test-group { margin-bottom: 30px; border: 1px solid #e9ecef; border-radius: 8px; overflow: hidden; }
        .test-group-header { background: #f8f9fa; padding: 15px 20px; font-weight: bold; border-bottom: 1px solid #e9ecef; }
        .test-item { padding: 15px 20px; border-bottom: 1px solid #f1f3f4; display: flex; justify-content: space-between; align-items: center; }
        .test-item:last-child { border-bottom: none; }
        .test-name { flex: 1; }
        .test-status { font-weight: bold; }
        .test-status.passed { color: #28a745; }
        .test-status.failed { color: #dc3545; }
        .test-error { color: #dc3545; font-size: 0.9em; margin-top: 5px; font-family: monospace; background: #f8f9fa; padding: 10px; border-radius: 4px; }
        .timestamp { text-align: center; padding: 20px; color: #6c757d; font-size: 0.9em; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧮 Tax Calculator Test Report</h1>
            <p>Comprehensive testing of all calculation fields and scenarios</p>
        </div>
        
        <div class="summary">
            <div class="stat-card">
                <div class="stat-number">${this.results.total}</div>
                <div class="stat-label">Total Tests</div>
            </div>
            <div class="stat-card passed">
                <div class="stat-number">${this.results.passed}</div>
                <div class="stat-label">Passed</div>
            </div>
            <div class="stat-card failed">
                <div class="stat-number">${this.results.failed}</div>
                <div class="stat-label">Failed</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${((this.results.passed / this.results.total) * 100).toFixed(1)}%</div>
                <div class="stat-label">Pass Rate</div>
            </div>
        </div>
        
        <div class="test-section">
            ${Object.entries(testsByDescribe).map(([describe, tests]) => `
                <div class="test-group">
                    <div class="test-group-header">${describe}</div>
                    ${tests.map(test => `
                        <div class="test-item">
                            <div class="test-name">
                                ${test.name}
                                ${test.error ? `<div class="test-error">${test.error}</div>` : ''}
                            </div>
                            <div class="test-status ${test.passed ? 'passed' : 'failed'}">
                                ${test.passed ? '✅ PASS' : '❌ FAIL'}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `).join('')}
        </div>
        
        <div class="timestamp">
            Report generated on ${new Date().toLocaleString()}
        </div>
    </div>
</body>
</html>`;

    fs.writeFileSync('test-report.html', html);
  }
}

// Global test framework instance
const framework = new TestFramework();
global.describe = framework.describe.bind(framework);
global.test = framework.test.bind(framework);
global.expect = framework.expect.bind(framework);
global.beforeEach = framework.beforeEach.bind(framework);

// Mock Jest for compatibility
global.jest = {
  fn: () => () => {}
};

// Load and run the tests
try {
  require('./tax-calculator-tests.js');
  framework.runTests();
} catch (error) {
  console.error('Error loading tests:', error.message);
  process.exit(1);
}
