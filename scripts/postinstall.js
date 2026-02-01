// Postinstall script to ensure Prisma client is generated and accessible
const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

try {
  // Generate Prisma client
  console.log('Generating Prisma client...')
  execSync('npx prisma generate', { stdio: 'inherit' })
  
  // @prisma/client expects .prisma/client/default to exist
  // Create it if it doesn't exist
  const prismaClientPath = path.join(process.cwd(), 'node_modules/.prisma/client')
  const defaultPath = path.join(prismaClientPath, 'default')
  
  if (!fs.existsSync(defaultPath)) {
    fs.mkdirSync(defaultPath, { recursive: true })
  }
  
  // Copy all necessary files to default directory
  const filesToCopy = ['client.ts', 'enums.ts', 'browser.ts', 'models.ts', 'commonInputTypes.ts']
  filesToCopy.forEach(file => {
    const srcPath = path.join(prismaClientPath, file)
    const destPath = path.join(defaultPath, file)
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath)
    }
  })
  
  // Copy directories
  const dirsToCopy = ['internal', 'models']
  dirsToCopy.forEach(dir => {
    const srcDir = path.join(prismaClientPath, dir)
    const destDir = path.join(defaultPath, dir)
    if (fs.existsSync(srcDir)) {
      if (fs.existsSync(destDir)) {
        fs.rmSync(destDir, { recursive: true, force: true })
      }
      fs.cpSync(srcDir, destDir, { recursive: true })
    }
  })
  
  // Create index.js that properly exports PrismaClient
  // We can't require .ts files directly, so we need to use the Prisma runtime
  // The runtime is in JavaScript and can be required
  const indexPath = path.join(defaultPath, 'index.js')
  
  // Use Prisma's runtime to get the PrismaClient class
  // This avoids TypeScript file resolution issues
  const indexContent = `// Prisma Client default export
// Use Prisma runtime to construct PrismaClient without requiring .ts files
const runtime = require('@prisma/client/runtime/library');
const { getPrismaClient } = require('@prisma/client/runtime');

// Get the PrismaClient class from the runtime
// The runtime has the actual JavaScript implementation
const PrismaClient = getPrismaClient ? getPrismaClient() : runtime.PrismaClient;

if (!PrismaClient) {
  // Fallback: try to get it from the generated client using dynamic import
  // This will work in Next.js where TypeScript is transpiled
  try {
    const clientModule = require('../client');
    module.exports = clientModule;
  } catch (e) {
    throw new Error('Failed to load Prisma Client. Make sure Prisma client is generated.');
  }
} else {
  module.exports = {
    PrismaClient: PrismaClient,
    Prisma: require('../enums')?.Prisma || {},
  };
}
`
  
  fs.writeFileSync(indexPath, indexContent)
  console.log('✅ Prisma client generated and default directory created with JavaScript wrapper')
} catch (error) {
  console.error('Error setting up Prisma client:', error)
  process.exit(1)
}
