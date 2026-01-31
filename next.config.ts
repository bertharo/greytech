import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Explicitly use webpack for Prisma compatibility
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Externalize Prisma client so it's loaded at runtime, not bundled
      const originalExternals = config.externals || []
      // Externalize @prisma/client so it's not bundled
      // This allows it to be loaded at runtime from node_modules
      config.externals = [
        ...(Array.isArray(originalExternals) ? originalExternals : [originalExternals]),
        '@prisma/client',
        '.prisma/client',
        ({ request }: { request?: string }, callback: (err?: Error | null, result?: string) => void) => {
          // Externalize any Prisma-related requests
          if (request && typeof request === 'string') {
            if (request.includes('.prisma/client') || request.includes('@prisma/client')) {
              // Keep as external - don't bundle
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
