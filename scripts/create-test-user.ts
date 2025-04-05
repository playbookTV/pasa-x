import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    // Generate hashed password
    const passwordHash = await bcrypt.hash('password123', 10);

    // Create test user
    const user = await prisma.user.upsert({
      where: { email: 'test@pasa.app' },
      update: {},
      create: {
        email: 'test@pasa.app',
        fullName: 'Test User',
        passwordHash,
        currentRole: 'Software Engineer',
        hasResume: false,
      },
    });

    console.log('Test user created successfully:');
    console.log(user);
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 