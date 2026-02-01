// Prisma Client singleton for serverless environments
// This pattern works well with Vercel and other serverless platforms

const globalForPrisma = globalThis as unknown as {
  prisma: any | undefined
}

function getPrismaClient() {
  if (typeof window !== 'undefined') {
    throw new Error('Prisma Client should only be used on the server')
  }
  
  // Bypass @prisma/client/default.js and import directly from generated client
  // This avoids the TypeScript file resolution issues
  try {
    const path = require('path')
    // Try to require the generated client directly
    const clientPath = path.join(process.cwd(), 'node_modules', '.prisma', 'client', 'client')
    const prismaModule = require(clientPath)
    return prismaModule.PrismaClient || prismaModule.default?.PrismaClient
  } catch (e) {
    // Fallback: try @prisma/client (might work in some environments)
    try {
      const { PrismaClient } = require('@prisma/client')
      return PrismaClient
    } catch (e2) {
      throw new Error(`Failed to load Prisma Client: ${e.message}. Fallback also failed: ${e2.message}`)
    }
  }
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
