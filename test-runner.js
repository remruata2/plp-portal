#!/usr/bin/env node

/**
 * Test runner for the PLP Portal testing suite
 * Runs unit, integration, and end-to-end tests in sequence
 */

const { spawn } = require('child_process');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options,
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve(code);
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function runTests() {
  log('\n🧪 Starting PLP Portal Test Suite', colors.cyan + colors.bright);
  log('=' .repeat(50), colors.cyan);

  const testSuites = [
    {
      name: 'Backend Unit Tests - Field Value DTO',
      command: 'npx',
      args: ['jest', 'src/lib/dto/__tests__/field-value.dto.test.ts', '--verbose'],
      description: 'Tests validation rules and serialization logic',
    },
    {
      name: 'Backend Integration Tests - Health Data API',
      command: 'npx',
      args: ['jest', 'src/app/api/health-data/__tests__/route.test.ts', '--verbose'],
      description: 'Tests API endpoints and conditional logic',
    },
    {
      name: 'Frontend Component Tests - Dynamic Form',
      command: 'npx',
      args: ['jest', 'src/components/forms/__tests__/DynamicHealthDataForm.test.tsx', '--verbose'],
      description: 'Tests component visibility logic and submission payload',
    },
    {
      name: 'End-to-End Tests - Form Flow',
      command: 'npx',
      args: ['jest', 'src/__tests__/e2e/form-flow.test.ts', '--verbose'],
      description: 'Tests complete form flow covering Yes/No branches',
    },
  ];

  let totalPassed = 0;
  let totalFailed = 0;

  for (const suite of testSuites) {
    log(`\n📋 Running: ${suite.name}`, colors.yellow + colors.bright);
    log(`📝 ${suite.description}`, colors.yellow);
    log('-'.repeat(50), colors.yellow);

    try {
      await runCommand(suite.command, suite.args);
      log(`✅ ${suite.name} - PASSED`, colors.green + colors.bright);
      totalPassed++;
    } catch (error) {
      log(`❌ ${suite.name} - FAILED`, colors.red + colors.bright);
      log(`Error: ${error.message}`, colors.red);
      totalFailed++;
    }
  }

  // Summary
  log('\n🏁 Test Suite Summary', colors.cyan + colors.bright);
  log('=' .repeat(50), colors.cyan);
  log(`✅ Passed: ${totalPassed}/${testSuites.length}`, colors.green);
  log(`❌ Failed: ${totalFailed}/${testSuites.length}`, totalFailed > 0 ? colors.red : colors.green);

  if (totalFailed === 0) {
    log('\n🎉 All tests passed! The implementation is ready.', colors.green + colors.bright);
    log('\n📊 Test Coverage Summary:', colors.blue);
    log('• Back-end validation rules and serialization: ✅', colors.blue);
    log('• Front-end component visibility logic: ✅', colors.blue);
    log('• Form submission payload structure: ✅', colors.blue);
    log('• End-to-end form flow (Yes/No branches): ✅', colors.blue);
    log('• Error handling and edge cases: ✅', colors.blue);
  } else {
    log('\n🔧 Some tests failed. Please review the output above.', colors.red + colors.bright);
    process.exit(1);
  }
}

// Additional test commands
async function runCoverage() {
  log('\n📈 Generating Test Coverage Report', colors.magenta + colors.bright);
  log('-'.repeat(50), colors.magenta);
  
  try {
    await runCommand('npx', [
      'jest',
      '--coverage',
      '--coverageReporters=text',
      '--coverageReporters=html',
      '--collectCoverageFrom=src/lib/dto/**/*.ts',
      '--collectCoverageFrom=src/app/api/health-data/**/*.ts',
      '--collectCoverageFrom=src/components/forms/**/*.tsx',
      '--collectCoverageFrom=!**/*.test.*',
      '--collectCoverageFrom=!**/*.spec.*',
    ]);
    log('✅ Coverage report generated', colors.green);
  } catch (error) {
    log('❌ Coverage generation failed', colors.red);
    log(`Error: ${error.message}`, colors.red);
  }
}

async function runWatch() {
  log('\n👀 Starting Jest in Watch Mode', colors.blue + colors.bright);
  log('-'.repeat(50), colors.blue);
  
  try {
    await runCommand('npx', ['jest', '--watch', '--verbose']);
  } catch (error) {
    log('❌ Watch mode failed', colors.red);
    log(`Error: ${error.message}`, colors.red);
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--coverage')) {
    await runCoverage();
  } else if (args.includes('--watch')) {
    await runWatch();
  } else {
    await runTests();
    
    if (args.includes('--generate-coverage')) {
      await runCoverage();
    }
  }
}

if (require.main === module) {
  main().catch((error) => {
    log(`\n💥 Test runner failed: ${error.message}`, colors.red + colors.bright);
    process.exit(1);
  });
}

module.exports = { runTests, runCoverage, runWatch };
