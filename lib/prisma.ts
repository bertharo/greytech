// Prisma Client singleton for serverless environments
// This pattern works well with Vercel and other serverless platforms

const globalForPrisma = globalThis as unknown as {
  prisma: any | undefined
}

function getPrismaClient() {
  if (typeof window !== 'undefined') {
    throw new Error('Prisma Client should only be used on the server')
  }
  
  // Use dynamic import for @prisma/client - webpack externalizes it
  // In serverless, the client should be available at runtime
  // @ts-ignore - @prisma/client is externalized by webpack
  const prismaModule = require('@prisma/client')
  
  // PrismaClient might be in different places depending on Prisma version
  const PrismaClient = prismaModule.PrismaClient || 
                       prismaModule.default?.PrismaClient || 
                       prismaModule.default
  
  if (!PrismaClient) {
    throw new Error('PrismaClient not found in @prisma/client module. Make sure Prisma client is generated.')
  }
  
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
