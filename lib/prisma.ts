import path from 'path'

// Lazy load Prisma Client at runtime to avoid webpack bundling issues
let _PrismaClient: any = null
let _prismaInstance: any = null

function getPrismaClient() {
  if (typeof window !== 'undefined') {
    throw new Error('Prisma Client should only be used on the server')
  }
  
  if (!_PrismaClient) {
    // Try multiple path resolutions for different environments
    const possiblePaths = [
      // Standard path
      path.join(process.cwd(), 'node_modules', '.prisma', 'client', 'client'),
      // Relative path (for serverless)
      path.resolve('node_modules', '.prisma', 'client', 'client'),
      // Absolute path fallback
      '/var/task/node_modules/.prisma/client/client', // AWS Lambda
      '/tmp/node_modules/.prisma/client/client', // Some serverless
    ]
    
    let prismaModule: any = null
    let lastError: any = null
    let successfulPath: string | null = null
    
    // Try each path with different require methods
    for (const prismaPath of possiblePaths) {
      // Method 1: Direct require
      try {
        // @ts-ignore - require exists at runtime in Node.js
        if (typeof require !== 'undefined') {
          prismaModule = require(prismaPath)
          successfulPath = prismaPath
          break
        }
      } catch (e) {
        lastError = e
      }
      
      // Method 2: createRequire
      try {
        // @ts-ignore
        const module = require('module')
        const { createRequire } = module
        const requireFunc = createRequire(process.cwd() + '/package.json')
        prismaModule = requireFunc(prismaPath)
        successfulPath = prismaPath
        break
      } catch (e2) {
        lastError = e2
      }
      
      // Method 3: Function constructor (bypasses webpack analysis)
      try {
        const requireFunc = new Function('path', 'return require(path)')
        prismaModule = requireFunc(prismaPath)
        successfulPath = prismaPath
        break
      } catch (e3) {
        lastError = e3
      }
    }
    
    if (!prismaModule || !prismaModule.PrismaClient) {
      const errorMsg = lastError instanceof Error ? lastError.message : String(lastError)
      throw new Error(
        `Failed to load Prisma Client. Tried paths: ${possiblePaths.join(', ')}. ` +
        `Last error: ${errorMsg}. Successful path: ${successfulPath || 'none'}`
      )
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
