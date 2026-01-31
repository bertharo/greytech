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
    // Use require for @prisma/client - webpack externalizes it so it loads at runtime
    // @ts-ignore - @prisma/client is externalized, so this works at runtime
    const { PrismaClient } = require('@prisma/client')
    return PrismaClient
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
