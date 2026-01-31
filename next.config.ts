import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Explicitly use webpack for Prisma compatibility
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Externalize Prisma client so it's loaded at runtime, not bundled
      const originalExternals = config.externals || []
      // Externalize Prisma client and related modules
      const prismaPath = path.join(process.cwd(), 'node_modules/.prisma/client/client')
      const prismaModules = [
        prismaPath,
        '@prisma/client',
        '.prisma/client',
        '.prisma/client/client',
        '.prisma/client/default'
      ]
      
      config.externals = [
        ...(Array.isArray(originalExternals) ? originalExternals : [originalExternals]),
        ({ request }: { request?: string }, callback: (err?: Error | null, result?: string) => void) => {
          // Externalize any require to Prisma-related paths
          if (request && typeof request === 'string') {
            // Check if it's a Prisma-related module
            if (prismaModules.some(mod => request.includes(mod) || request === mod)) {
              // Use relative path that works in production
              const relativePath = path.relative(process.cwd(), prismaPath)
              return callback(null, `commonjs ${relativePath}`)
            }
            // Also check for absolute paths
            if (request === prismaPath || request.startsWith(prismaPath)) {
              return callback(null, `commonjs ${prismaPath}`)
            }
          }
          callback()
        }
      ]
    }
    return config
  },
  // Add empty turbopack config to silence warning when using webpack
  turbopack: {},
};

export default nextConfig;
