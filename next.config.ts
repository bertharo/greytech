import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Transpile Prisma client packages so TypeScript files are processed
  transpilePackages: ['.prisma', '@prisma/client'],
  
  // Explicitly use webpack for Prisma compatibility
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Externalize Prisma client so it's loaded at runtime, not bundled
      const originalExternals = config.externals || []
      // Externalize @prisma/client and related modules
      // This ensures they're loaded from node_modules at runtime, not bundled
      config.externals = [
        ...(Array.isArray(originalExternals) ? originalExternals : [originalExternals]),
        '@prisma/client',
        '.prisma/client',
        ({ request }: { request?: string }, callback: (err?: Error | null, result?: string) => void) => {
          // Externalize any Prisma-related module requests
          if (request && typeof request === 'string') {
            if (
              request === '@prisma/client' ||
              request.includes('.prisma/client') ||
              request.startsWith('.prisma/')
            ) {
              // Externalize as commonjs module
              return callback(null, `commonjs ${request}`)
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
