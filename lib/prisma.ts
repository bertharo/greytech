// Prisma Client singleton for serverless environments
// This pattern works well with Vercel and other serverless platforms

const globalForPrisma = globalThis as unknown as {
  prisma: any | undefined
}

function getPrismaClient() {
  if (typeof window !== 'undefined') {
    throw new Error('Prisma Client should only be used on the server')
  }
  
  // Use standard @prisma/client import - Prisma handles the client resolution
  // @ts-ignore - @prisma/client is externalized by webpack
  const { PrismaClient } = require('@prisma/client')
  return PrismaClient
}

// Initialize Prisma Client instance
// Use global to prevent multiple instances in serverless environments
function getPrismaInstance() {
  if (!globalForPrisma.prisma) {
    const PrismaClientClass = getPrismaClient()
    globalForPrisma.prisma = new PrismaClientClass({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })
  }
  return globalForPrisma.prisma
}

// Export prisma as a getter to avoid initialization during build
// In serverless, this will be initialized on first use per function invocation
const prismaProxy = new Proxy({} as any, {
  get(target, prop) {
    const instance = getPrismaInstance()
    const value = instance[prop]
    
    // If it's a function, bind it to the instance
    if (typeof value === 'function') {
      return value.bind(instance)
    }
    
    return value
  },
  set(target, prop, value) {
    const instance = getPrismaInstance()
    instance[prop] = value
    return true
  }
})

export const prisma = prismaProxy
