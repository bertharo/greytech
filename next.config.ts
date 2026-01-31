import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Externalize Prisma client so it's loaded at runtime, not bundled
      config.externals = config.externals || []
      const prismaPath = path.join(process.cwd(), 'node_modules/.prisma/client/client')
      config.externals.push({
        [prismaPath]: 'commonjs ' + prismaPath,
      })
    }
    return config
  },
};

export default nextConfig;
