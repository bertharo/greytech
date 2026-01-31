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
    let lastError: any = null
    
    // Approach 1: Use direct require (most common in Node.js)
    try {
      // @ts-ignore - require exists at runtime in Node.js
      if (typeof require !== 'undefined') {
        prismaModule = require(prismaPath)
      }
    } catch (e) {
      lastError = e
      // Approach 2: Use createRequire for ES module contexts
      try {
        // @ts-ignore
        const { createRequire } = require('module')
        // Use process.cwd() as base since __dirname might not be available
        const requireFunc = createRequire(path.join(process.cwd(), 'package.json'))
        prismaModule = requireFunc(prismaPath)
      } catch (e2) {
        lastError = e2
        // Approach 3: Try with __dirname if available
        try {
          // @ts-ignore
          if (typeof __dirname !== 'undefined') {
            // @ts-ignore
            const { createRequire } = require('module')
            // @ts-ignore
            const requireFunc = createRequire(__filename || __dirname)
            prismaModule = requireFunc(prismaPath)
          }
        } catch (e3) {
          lastError = e3
          // Approach 4: Use Function constructor as last resort
          try {
            // This creates a require function that webpack can't analyze
            const requireFunc = new Function('path', 'return require(path)')
            prismaModule = requireFunc(prismaPath)
          } catch (e4) {
            throw new Error(
              `Failed to load Prisma Client from ${prismaPath}. ` +
              `Tried: require (${e?.message}), createRequire (${e2?.message}), ` +
              `createRequire with __dirname (${e3?.message}), Function constructor (${e4?.message})`
            )
          }
        }
      }
    }
    
    if (!prismaModule || !prismaModule.PrismaClient) {
      throw new Error(`Prisma Client not found at ${prismaPath}. Module loaded but PrismaClient export missing.`)
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
