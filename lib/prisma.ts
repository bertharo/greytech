import path from 'path'

// Lazy load Prisma Client at runtime to avoid webpack bundling issues
let _PrismaClient: any = null
let _prismaInstance: any = null

function getPrismaClient() {
  if (typeof window !== 'undefined') {
    throw new Error('Prisma Client should only be used on the server')
  }
  
  if (!_PrismaClient) {
    try {
      // Use dynamic require that webpack can't statically analyze
      // Build the path dynamically to prevent webpack from resolving it
      const parts = ['node_modules', '.prisma', 'client', 'client']
      const prismaPath = path.join(process.cwd(), ...parts)
      
      // Use Function constructor to create require that webpack can't analyze
      // This ensures it's only executed at runtime, not during build
      const requireFunc = new Function('path', 'return require(path)')
      // @ts-ignore - Prisma 7 custom output path
      const prismaModule = requireFunc(prismaPath)
      _PrismaClient = prismaModule.PrismaClient
    } catch (error) {
      // During build, the module might not be available
      // This will be retried at runtime
      throw new Error(`Failed to load Prisma Client: ${error}`)
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

// Only initialize at module load if we're not in a build context
// During build, this will be deferred until runtime
let prisma: any
if (process.env.NEXT_PHASE !== 'phase-production-build') {
  prisma = getPrismaInstance()
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
  }
} else {
  // During build, create a proxy that will initialize on first use
  prisma = new Proxy({} as any, {
    get(target, prop) {
      const instance = getPrismaInstance()
      return instance[prop]
    }
  })
}

export { prisma }
