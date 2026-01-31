// Use standard @prisma/client import which works better in serverless environments
// The @prisma/client package will resolve to the generated client
let _PrismaClient: any = null
let _prismaInstance: any = null

function getPrismaClient() {
  if (typeof window !== 'undefined') {
    throw new Error('Prisma Client should only be used on the server')
  }
  
  if (!_PrismaClient) {
    try {
      // Try to use @prisma/client which should work in most environments
      // @prisma/client will resolve to .prisma/client/default or .prisma/client/client
      // @ts-ignore - Dynamic import to avoid webpack bundling
      const prismaModule = require('@prisma/client')
      _PrismaClient = prismaModule.PrismaClient
    } catch (e) {
      // Fallback: try direct path resolution
      const path = require('path')
      const possiblePaths = [
        path.join(process.cwd(), 'node_modules', '.prisma', 'client', 'default'),
        path.join(process.cwd(), 'node_modules', '.prisma', 'client', 'client'),
        '/var/task/node_modules/.prisma/client/default',
        '/var/task/node_modules/.prisma/client/client',
      ]
      
      let prismaModule: any = null
      let lastError: any = e
      
      for (const prismaPath of possiblePaths) {
        try {
          // Try require if available
          if (typeof require !== 'undefined') {
            prismaModule = require(prismaPath)
            if (prismaModule?.PrismaClient) {
              _PrismaClient = prismaModule.PrismaClient
              return _PrismaClient
            }
          }
        } catch (e2) {
          lastError = e2
        }
      }
      
      const errorMsg = lastError instanceof Error ? lastError.message : String(lastError)
      throw new Error(
        `Failed to load Prisma Client. Tried @prisma/client and paths: ${possiblePaths.join(', ')}. ` +
        `Error: ${errorMsg}`
      )
    }
  }
  
  return _PrismaClient
}

const globalForPrisma = globalThis as unknown as {
  prisma: any | undefined
}

function getPrismaInstance() {
  if (!_prismaInstance) {
    const PrismaClientClass = getPrismaClient()
    _prismaInstance = globalForPrisma.prisma ?? new PrismaClientClass()
  }
  return _prismaInstance
}

// Create a proxy that initializes on first access
// This defers initialization until actually needed
const prisma = new Proxy({} as any, {
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

// Store in global for reuse
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export { prisma }
