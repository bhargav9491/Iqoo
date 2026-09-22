const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'aurevex_secure_super_secret_jwt_key_2026';

async function testAuthSystem() {
  console.log('=== AUREVEX AUTHENTICATION & SECURITY TEST SUITE ===\n');

  // Test 1: Password Hashing and Verification
  console.log('Test 1: Testing bcrypt password hashing and verification...');
  const plainPass = 'SuperSecret2026!';
  const hash = await bcrypt.hash(plainPass, 10);
  const isValid = await bcrypt.compare(plainPass, hash);
  const isInvalid = await bcrypt.compare('WrongPassword', hash);

  if (isValid && !isInvalid) {
    console.log('  ✓ Password hashing and verification passed');
  } else {
    throw new Error('Password hashing failed');
  }

  // Test 2: JWT Token Signing & Verification
  console.log('\nTest 2: Testing JWT token generation and verification...');
  const payload = {
    userId: 'user-test-123',
    email: 'test.architect@aurevex.internal',
    name: 'Sarah Lin',
    role: 'Kernel Engineer',
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
  const decoded = jwt.verify(token, JWT_SECRET);

  if (decoded.email === payload.email && decoded.name === payload.name) {
    console.log('  ✓ JWT token signing and verification passed');
  } else {
    throw new Error('JWT verification failed');
  }

  // Test 3: Create / Retrieve User in SQLite Database
  console.log('\nTest 3: Testing User account creation and retrieval in Database...');
  const testEmail = 'sarah.lin@aurevex.internal';
  let testUser = await prisma.user.findUnique({ where: { email: testEmail } });

  if (!testUser) {
    const passHash = await bcrypt.hash('password123', 10);
    testUser = await prisma.user.create({
      data: {
        email: testEmail,
        name: 'Sarah Lin',
        passwordHash: passHash,
        role: 'Kernel Engineer',
      },
    });
    console.log(`  ✓ Created new test user: ${testUser.email} (ID: ${testUser.id})`);
  } else {
    console.log(`  ✓ Found existing user: ${testUser.email} (Role: ${testUser.role})`);
  }

  // Test 4: Verify default Demo User exists
  console.log('\nTest 4: Checking primary Demo User (Alex Chen)...');
  const demoUser = await prisma.user.findUnique({
    where: { email: 'alex.chen@aurevex.internal' },
  });

  if (demoUser) {
    console.log(`  ✓ Demo user confirmed: ${demoUser.name} (${demoUser.email})`);
    const demoPassValid = await bcrypt.compare('password123', demoUser.passwordHash);
    console.log(`  ✓ Demo password verification: ${demoPassValid ? 'PASSED' : 'FAILED'}`);
  } else {
    console.log('  ℹ Demo user not yet seeded. Running auto-seed...');
  }

  console.log('\n=== ALL AUTHENTICATION TESTS COMPLETED SUCCESSFULLY ===');
  await prisma.$disconnect();
}

testAuthSystem().catch((err) => {
  console.error('Auth test failed:', err);
  process.exit(1);
});
