// Import PrismaClient directly - webpack will externalize it
// This is the most reliable approach for serverless environments
import { PrismaClient } from '@prisma/client'

let _PrismaClient: any = null
let _prismaInstance: any = null

function getPrismaClient() {
  if (typeof window !== 'undefined') {
    throw new Error('Prisma Client should only be used on the server')
  }
  
  if (!_PrismaClient) {
    // Use the imported PrismaClient directly
    // Since @prisma/client is externalized by webpack, this will work at runtime
    _PrismaClient = PrismaClient
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
