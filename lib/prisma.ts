// Use dynamic require for @prisma/client - webpack will externalize it
// This works in both CommonJS and serverless environments
let _PrismaClient: any = null
let _prismaInstance: any = null

function getPrismaClient() {
  if (typeof window !== 'undefined') {
    throw new Error('Prisma Client should only be used on the server')
  }
  
  if (!_PrismaClient) {
    try {
      // Use require for @prisma/client - webpack externalizes it so it loads at runtime
      // @ts-ignore - @prisma/client is externalized, so this works at runtime
      const prismaModule = require('@prisma/client')
      _PrismaClient = prismaModule.PrismaClient || prismaModule.default?.PrismaClient
      
      if (!_PrismaClient) {
        throw new Error('PrismaClient not found in @prisma/client module')
      }
    } catch (error: any) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      throw new Error(`Failed to load Prisma Client: ${errorMsg}. Make sure Prisma client is generated (run: npx prisma generate)`)
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
