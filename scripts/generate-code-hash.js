/**
 * Invitation Code Hash Generator
 * 
 * This script generates bcrypt hashes for invitation codes.
 * Use these hashes when creating guest documents in Firestore.
 * 
 * USAGE:
 * node scripts/generate-code-hash.js CODE1 CODE2 CODE3
 * 
 * EXAMPLE:
 * node scripts/generate-code-hash.js TEST1234 ABC12345 XYZ67890
 */

const bcrypt = require('bcrypt');

/**
 * Generate bcrypt hash for a code
 */
async function generateHash(code) {
  const saltRounds = 10;
  const hash = await bcrypt.hash(code.toUpperCase(), saltRounds);
  return hash;
}

/**
 * Main function
 */
async function main() {
  const codes = process.argv.slice(2);

  if (codes.length === 0) {
    console.log('\n❌ No codes provided!');
    console.log('\nUSAGE:');
    console.log('  node scripts/generate-code-hash.js CODE1 CODE2 CODE3\n');
    console.log('EXAMPLE:');
    console.log('  node scripts/generate-code-hash.js TEST1234 ABC12345\n');
    process.exit(1);
  }

  console.log('\n🔐 Generating Bcrypt Hashes for Invitation Codes\n');
  console.log('━'.repeat(60));

  for (const code of codes) {
    const normalizedCode = code.toUpperCase();
    const hash = await generateHash(normalizedCode);
    
    console.log(`\nCode: ${normalizedCode}`);
    console.log(`Hash: ${hash}`);
    console.log('\nFirestore Document:');
    console.log(JSON.stringify({
      name: 'Guest Name',
      email: 'guest@example.com',
      code_hash: hash,
      used: false,
      rsvp_status: 'pending',
      message: '',
      created_at: new Date().toISOString()
    }, null, 2));
    console.log('━'.repeat(60));
  }

  console.log('\n✅ Done! Copy the hashes above and use them in Firestore.\n');
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
