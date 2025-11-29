// Test script for OAuth token encryption/decryption
// Run with: node test-oauth-encryption.js

const crypto = require('crypto');

// Mock environment variables
process.env.OAUTH_ENCRYPTION_KEY = crypto.randomBytes(32).toString('base64');

// Import the functions (adjust path as needed)
const { encryptOAuthToken, decryptOAuthToken } = require('./src/lib/oauth-security.ts');

async function testEncryption() {
  try {
    console.log('Testing OAuth token encryption/decryption...');
    
    // Test with a sample OAuth token
    const originalToken = 'ya29.a0AfH6SMC...sample_oauth_token';
    console.log('Original token:', originalToken);
    
    // Encrypt the token
    const encryptedData = encryptOAuthToken(originalToken);
    console.log('Encrypted data:', {
      encrypted: encryptedData.encrypted.substring(0, 20) + '...',
      iv: encryptedData.iv,
      authTag: encryptedData.authTag
    });
    
    // Decrypt the token
    const decryptedToken = decryptOAuthToken(encryptedData);
    console.log('Decrypted token:', decryptedToken);
    
    // Verify they match
    if (originalToken === decryptedToken) {
      console.log('✅ SUCCESS: Encryption/decryption test passed!');
    } else {
      console.log('❌ FAILURE: Decrypted token does not match original');
    }
    
    // Test with different tokens
    const testTokens = [
      'short_token',
      'medium_length_token_with_some_characters_123',
      'very_long_token_that_contains_many_characters_numbers_and_symbols_!@#$%^&*()_+-=[]{}|;:,.<>?'
    ];
    
    console.log('\nTesting with various token lengths...');
    for (const token of testTokens) {
      const encrypted = encryptOAuthToken(token);
      const decrypted = decryptOAuthToken(encrypted);
      
      if (token === decrypted) {
        console.log(`✅ Token length ${token.length}: PASSED`);
      } else {
        console.log(`❌ Token length ${token.length}: FAILED`);
      }
    }
    
  } catch (error) {
    console.error('❌ ERROR during encryption test:', error);
  }
}

// Run the test
testEncryption();