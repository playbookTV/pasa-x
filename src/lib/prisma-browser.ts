/**
 * Mock Prisma client for browser environment
 * This provides a safe fallback when running in a Chrome extension context
 */

// Mock Prisma client with basic functionality
const mockPrismaClient = {
  user: {
    findUnique: async () => null,
    findFirst: async () => null,
    findMany: async () => [],
    create: async (data: any) => data.data,
    update: async (data: any) => data.data,
    delete: async () => ({}),
    count: async () => 0,
  },
  resume: {
    findUnique: async () => null,
    findFirst: async () => null,
    findMany: async () => [],
    create: async (data: any) => data.data,
    update: async (data: any) => data.data,
    delete: async () => ({}),
    count: async () => 0,
  },
  coverLetter: {
    findUnique: async () => null,
    findFirst: async () => null,
    findMany: async () => [],
    create: async (data: any) => data.data,
    update: async (data: any) => data.data,
    delete: async () => ({}),
    count: async () => 0,
  },
  application: {
    findUnique: async () => null,
    findFirst: async () => null,
    findMany: async () => [],
    create: async (data: any) => data.data,
    update: async (data: any) => data.data,
    delete: async () => ({}),
    count: async () => 0,
  },
  subscription: {
    findUnique: async () => null,
    findFirst: async () => null,
    findMany: async () => [],
    create: async (data: any) => data.data,
    update: async (data: any) => data.data,
    delete: async () => ({}),
    count: async () => 0,
  },
  // Add more models as needed
};

export const PrismaClient = function() {
  return mockPrismaClient;
};

export default { PrismaClient }; 