import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Explicitly use webpack for Prisma compatibility
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Externalize Prisma client so it's loaded at runtime, not bundled
      const originalExternals = config.externals || []
      config.externals = [
        ...(Array.isArray(originalExternals) ? originalExternals : [originalExternals]),
        ({ request }: { request?: string }, callback: (err?: Error | null, result?: string) => void) => {
          // Externalize any require to the Prisma client path
          if (request && typeof request === 'string') {
            const prismaPath = path.join(process.cwd(), 'node_modules/.prisma/client/client')
            if (request === prismaPath || request.includes('.prisma/client/client')) {
              return callback(null, 'commonjs ' + prismaPath)
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
