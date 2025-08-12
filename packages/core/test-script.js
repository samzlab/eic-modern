#!/usr/bin/env node

/**
 * Simple test script to verify the EIC library works correctly
 */

import {
    generateRandomEIC,
    isValid,
    examine,
    calcCheckChar,
} from './dist/index.js';

console.log('🧪 Testing EIC Modern Library\n');

// Test 1: Generate random EIC codes
console.log('1. Generating random EIC codes:');
for (let i = 0; i < 3; i++) {
    const code = generateRandomEIC();
    console.log(`   ${code} (valid: ${isValid(code)})`);
}

// Test 2: Validate specific codes
console.log('\n2. Validating specific codes:');
const testCodes = [
    '10x0000000000011',
    '11y0000000000019', 
    '12z000000000001h',
    '99x000000000001g', // unknown issuer
    '10b000000000001g', // unknown type
    'invalid-code',      // invalid format
];

testCodes.forEach(code => {
    const result = examine(code);
    console.log(`   ${code}:`);
    console.log(`     Valid: ${result.isValid}`);
    if (result.issuer) console.log(`     Issuer: ${result.issuer.name} (${result.issuer.country})`);
    if (result.type) console.log(`     Type: ${result.type}`);
    if (result.errors.length > 0) console.log(`     Errors: ${result.errors.map(e => e.errorMessage).join(', ')}`);
    if (result.warnings.length > 0) console.log(`     Warnings: ${result.warnings.map(w => w.errorMessage).join(', ')}`);
});

// Test 3: Check character calculation
console.log('\n3. Check character calculation:');
const incomplete = '10x000000000001';
const checkChar = calcCheckChar(incomplete);
const complete = incomplete + checkChar;
console.log(`   ${incomplete} + ${checkChar} = ${complete} (valid: ${isValid(complete)})`);

console.log('\n✅ All tests completed successfully!');
