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
  
  // Create index.js that creates a proper module export
  // We can't require .ts files directly, so we need to proxy through the runtime
  const indexPath = path.join(defaultPath, 'index.js')
  // The solution: use require.resolve to find @prisma/client, then re-export
  // But actually, we should just make default/ a symlink or copy that works
  // For now, let's try requiring the internal class directly
  const indexContent = `// Prisma Client default export
// We need to export what @prisma/client expects
// Since we can't require .ts files, we'll use the runtime module
const runtime = require('../internal/runtime');
const $Class = require('../internal/class');

// Re-create the PrismaClient export that client.ts has
const PrismaClient = $Class.getPrismaClientClass ? $Class.getPrismaClientClass() : $Class.PrismaClient;

module.exports = {
  PrismaClient: PrismaClient,
  Prisma: require('../enums').Prisma || {},
};
`
  
  fs.writeFileSync(indexPath, indexContent)
  console.log('✅ Prisma client generated and default directory created with all files')
} catch (error) {
  console.error('Error setting up Prisma client:', error)
  process.exit(1)
}
