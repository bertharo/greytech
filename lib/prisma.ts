import path from 'path'

// Lazy load Prisma Client at runtime to avoid webpack bundling issues
let _PrismaClient: any = null
let _prismaInstance: any = null

function getPrismaClient() {
  if (typeof window !== 'undefined') {
    throw new Error('Prisma Client should only be used on the server')
  }
  
  if (!_PrismaClient) {
    // Use dynamic require that webpack can't statically analyze
    // Build the path dynamically to prevent webpack from resolving it
    const parts = ['node_modules', '.prisma', 'client', 'client']
    const prismaPath = path.join(process.cwd(), ...parts)
    
    // Use Function constructor to create require that webpack can't analyze
    const requireFunc = new Function('path', 'return require(path)')
    // @ts-ignore - Prisma 7 custom output path
    const prismaModule = requireFunc(prismaPath)
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

export const prisma = getPrismaInstance()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
