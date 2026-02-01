// Prisma Client singleton for serverless environments
// This pattern works well with Vercel and other serverless platforms

const globalForPrisma = globalThis as unknown as {
  prisma: any | undefined
}

function getPrismaClient() {
  if (typeof window !== 'undefined') {
    throw new Error('Prisma Client should only be used on the server')
  }
  
  try {
    // Try multiple approaches to load Prisma Client
    let PrismaClient: any = null
    
    // Approach 1: Direct require from @prisma/client
    try {
      const prismaModule = require('@prisma/client')
      PrismaClient = prismaModule.PrismaClient || prismaModule.default?.PrismaClient
      if (PrismaClient) return PrismaClient
    } catch (e1) {
      // Continue to next approach
    }
    
    // Approach 2: Try to require from .prisma/client directly
    try {
      const path = require('path')
      const prismaClientPath = path.join(process.cwd(), 'node_modules', '.prisma', 'client', 'client')
      const prismaModule = require(prismaClientPath)
      PrismaClient = prismaModule.PrismaClient || prismaModule.default?.PrismaClient
      if (PrismaClient) return PrismaClient
    } catch (e2) {
      // Continue to next approach
    }
    
    // Approach 3: Try serverless paths
    try {
      const serverlessPaths = [
        '/var/task/node_modules/.prisma/client/client',
        '/var/task/node_modules/@prisma/client'
      ]
      for (const serverlessPath of serverlessPaths) {
        try {
          const prismaModule = require(serverlessPath)
          PrismaClient = prismaModule.PrismaClient || prismaModule.default?.PrismaClient
          if (PrismaClient) return PrismaClient
        } catch (e) {
          // Try next path
        }
      }
    } catch (e3) {
      // All approaches failed
    }
    
    throw new Error('All Prisma Client loading approaches failed')
  } catch (error: any) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : undefined
    
    // Log detailed error for debugging
    console.error('Prisma Client loading error:', {
      message: errorMsg,
      stack: errorStack,
      code: error?.code,
      requireStack: error?.requireStack
    })
    
    throw new Error(
      `Failed to load Prisma Client: ${errorMsg}. ` +
      `Make sure Prisma client is generated (run: npx prisma generate). ` +
      `In Vercel, ensure postinstall script runs during build.`
    )
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
