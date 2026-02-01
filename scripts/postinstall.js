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
  
  // Create index.js that re-exports from parent directory
  // Since Node.js can't require .ts files directly, we need to use the parent
  // which should be handled by Next.js/webpack during build
  const indexPath = path.join(defaultPath, 'index.js')
  // Use a workaround: re-export from @prisma/client which should work
  // because webpack externalizes it and it resolves at runtime
  const indexContent = `// Re-export Prisma client
// Use @prisma/client which webpack externalizes and resolves at runtime
// This avoids TypeScript file resolution issues
try {
  module.exports = require('@prisma/client');
} catch (e) {
  // If that fails, try to require from parent (might work in some environments)
  try {
    module.exports = require('../client');
  } catch (e2) {
    throw new Error(\`Failed to load Prisma Client: \${e.message}. Fallback: \${e2.message}\`);
  }
}
`
  
  fs.writeFileSync(indexPath, indexContent)
  console.log('✅ Prisma client generated and default directory created with all files')
} catch (error) {
  console.error('Error setting up Prisma client:', error)
  process.exit(1)
}
