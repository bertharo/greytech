import path from 'path'

// Lazy load Prisma Client at runtime to avoid webpack bundling issues
let _PrismaClient: any = null
let _prismaInstance: any = null

function getPrismaClient() {
  if (typeof window !== 'undefined') {
    throw new Error('Prisma Client should only be used on the server')
  }
  
  if (!_PrismaClient) {
    // Build the path dynamically to prevent webpack from resolving it
    const parts = ['node_modules', '.prisma', 'client', 'client']
    const prismaPath = path.join(process.cwd(), ...parts)
    
    // Try multiple approaches to load the module
    let prismaModule: any = null
    
    // Approach 1: Use createRequire if available (ES modules)
    try {
      const { createRequire } = require('module')
      // Get the current file's directory or use process.cwd() as fallback
      const basePath = typeof __dirname !== 'undefined' ? __dirname : process.cwd()
      const requireFunc = createRequire(path.join(basePath, 'package.json'))
      prismaModule = requireFunc(prismaPath)
    } catch (e) {
      // Approach 2: Use direct require (CommonJS)
      try {
        // @ts-ignore - require may not be in types but exists at runtime in Node
        const requireFunc = typeof require !== 'undefined' ? require : global.require
        if (requireFunc) {
          prismaModule = requireFunc(prismaPath)
        }
      } catch (e2) {
        // Approach 3: Use Function constructor as last resort
        try {
          const requireFunc = new Function('path', 'return require(path)')
          prismaModule = requireFunc(prismaPath)
        } catch (e3) {
          throw new Error(`Failed to load Prisma Client. Tried createRequire, require, and Function constructor. Last error: ${e3}`)
        }
      }
    }
    
    if (!prismaModule || !prismaModule.PrismaClient) {
      throw new Error(`Prisma Client not found at ${prismaPath}`)
    }
    
    _PrismaClient = prismaModule.PrismaClient
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
