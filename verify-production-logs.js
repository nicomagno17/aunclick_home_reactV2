/**
 * Quick verification script to ensure no console calls in production mode
 * Run with: NODE_ENV=production node verify-production-logs.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying production logger compliance...\n');

// Read the logger file
const loggerPath = path.join(__dirname, 'src/lib/logger.ts');
const loggerContent = fs.readFileSync(loggerPath, 'utf8');

// Check for console calls and whether they're properly guarded
const consoleCalls = [
  /console\.log\(/g,
  /console\.error\(/g,
  /console\.warn\(/g,
  /console\.info\(/g,
  /console\.debug\(/g
];

let unguardedMatches = [];
const lines = loggerContent.split('\n');

lines.forEach((line, index) => {
  if (consoleCalls.some(regex => regex.test(line))) {
    // Check if this line is inside a development guard
    const previousLines = lines.slice(0, index);
    const hasDevGuard = previousLines.reverse().some(prevLine => 
      prevLine.includes('if (config.isDevelopment)') ||
      prevLine.includes('if(config.isDevelopment)')
    );
    
    if (!hasDevGuard) {
      unguardedMatches.push({ line: index + 1, content: line.trim() });
    }
  }
});

if (unguardedMatches.length > 0) {
  console.log(`❌ Found ${unguardedMatches.length} unguarded console calls:`);
  unguardedMatches.forEach(match => {
    console.log(`   Line ${match.line}: ${match.content}`);
  });
  
  console.log('\n⚠️  These console calls should be guarded by config.isDevelopment checks');
} else {
  console.log('✅ All console calls are properly guarded');
}

// Check for isDevelopment guards
const devGuards = loggerContent.match(/if \(config\.isDevelopment\)/g) || [];
console.log(`\n🛡️  Found ${devGuards.length} development guards`);

// Check the isDevelopment definition
const isDevDefinition = loggerContent.match(/isDevelopment:\s*process\.env\.NODE_ENV\s*!==\s*['"`]production['"`]/);
if (isDevDefinition) {
  console.log('✅ isDevelopment correctly defined as NODE_ENV !== "production"');
} else {
  console.log('❌ isDevelopment definition issue');
}

// Final verdict
console.log('\n📋 Summary:');
if (unguardedMatches.length > 0) {
  console.log('❌ Logger may produce console output in production');
  console.log('🔧 Fix: Add config.isDevelopment guards around all console calls');
  process.exit(1);
} else {
  console.log('✅ Logger is production-ready - no console output in production');
  process.exit(0);
}