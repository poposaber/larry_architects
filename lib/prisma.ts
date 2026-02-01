import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  })

// Explicitly set the connection URL via internal property if needed, 
// but Prisma 7 + prisma.config.ts should handle this automatically in many contexts.
// However, for Next.js runtime, we might need a workaround if types are being strict 'never'.

// Reverting to the simplest initialization usually works if generated correctly.
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

