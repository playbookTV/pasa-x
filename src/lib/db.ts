// Use a dynamic import to handle different environments
let PrismaClient: any;

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Initialize the prisma client
let prisma: any;

// In a browser context, use our mock implementation
if (isBrowser) {
  // Import our mock client for the browser
  import('./prisma-browser').then(module => {
    PrismaClient = module.PrismaClient;
    prisma = new PrismaClient();
    console.log('Using mock Prisma client for browser environment');
  }).catch(error => {
    console.error('Failed to load mock Prisma client:', error);
  });
} else {
  // In Node.js, use the real Prisma client
  import('@prisma/client').then(module => {
    PrismaClient = module.PrismaClient;
    
    // PrismaClient is attached to the `global` object in development to prevent
    // exhausting your database connection limit.
    const globalForPrisma = global as unknown as { prisma: any };
    
    prisma =
      globalForPrisma.prisma ||
      new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      });
    
    // Attach PrismaClient to the global object in development
    if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
  }).catch(error => {
    console.error('Failed to load Prisma client:', error);
  });
}

// Create a safe version of prisma that handles potential async initialization
const safePrisma = new Proxy({} as any, {
  get: (target, prop) => {
    if (!prisma) {
      // Return mock implementations that resolve to empty data if Prisma isn't loaded yet
      if (prop === 'user' || prop === 'resume' || prop === 'coverLetter' || 
          prop === 'application' || prop === 'subscription') {
        return {
          findUnique: async () => null,
          findFirst: async () => null,
          findMany: async () => [],
          create: async (data: any) => data.data,
          update: async (data: any) => data.data,
          upsert: async (data: any) => data.create,
          delete: async () => ({}),
          count: async () => 0,
        };
      }
    }
    
    return prisma ? prisma[prop] : null;
  }
});

// Export the safe prisma client
export { safePrisma as prisma };

// Helper functions for common database operations

// Users
export async function getUserByEmail(email: string) {
  return safePrisma.user.findUnique({
    where: { email },
  });
}

export async function getUserById(id: string) {
  return safePrisma.user.findUnique({
    where: { id },
    include: { resume: true },
  });
}

export async function createUser(data: {
  email: string;
  fullName: string;
  passwordHash?: string;
  currentRole?: string;
  googleId?: string;
}) {
  return safePrisma.user.create({
    data,
  });
}

// Resumes
export async function getResumeByUserId(userId: string) {
  return safePrisma.resume.findUnique({
    where: { userId },
  });
}

export async function createOrUpdateResume(
  userId: string,
  data: {
    fileUrl: string;
    fileName: string;
    fileSize: number;
    scoreOverall?: number;
    scoreKeywords?: number;
    scoreFormat?: number;
    feedback?: string;
  }
) {
  return safePrisma.resume.upsert({
    where: { userId },
    update: data,
    create: {
      userId,
      ...data,
    },
  });
}

// Cover Letters
export async function getCoverLettersByUserId(userId: string) {
  return safePrisma.coverLetter.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createCoverLetter(
  userId: string,
  data: {
    jobTitle: string;
    company: string;
    content: string;
    applicationId?: string;
  }
) {
  return safePrisma.coverLetter.create({
    data: {
      userId,
      ...data,
    },
  });
}

// Applications
export async function getApplicationsByUserId(userId: string) {
  return safePrisma.application.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    include: { coverLetters: true },
  });
}

export async function createApplication(
  userId: string,
  data: {
    jobTitle: string;
    company: string;
    jobUrl?: string;
    status: string;
  }
) {
  return safePrisma.application.create({
    data: {
      userId,
      ...data,
    },
  });
}

export async function updateApplicationStatus(id: string, status: string) {
  return safePrisma.application.update({
    where: { id },
    data: { status },
  });
} 